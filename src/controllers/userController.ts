import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { Users } from '../models/userModel'

// this will return everything but password and updated at
// const { password, updatedAt, ...other } = user._doc

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: Users[] = await User.find()
    return res.json(users)
  } catch (error: any) {
    return res.status(500).json([error.message, 'Internal server error.'])
  }
}

export const findByUsername = async (req: Request, res: Response) => {
  try {
    const user: Users | null = await User.findOne({ username: req.params.username })
    if (!user) return res.status(404).json(`User: ${user} not found`)

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(`Internal server error, ${error}`)
  }
}

export const findUserById = async (req: Request, res: Response) => {
  try {
    const user: Users | null = await User.findById(req.params.userid)
    if (!user) return res.status(404).json(`User id: ${req.params.userid} not found`)
    
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(`Internal server error, ${error}`)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user: Users | null = await User.findByIdAndRemove(req.params.userid)
    if (!user) return res.status(404).json(`User with id: ${req.params.userid} not found`)

    return res.status(200).json(`Deleted user: ${user.username}`)
  } catch (error) {
    return res.status(500).json(`Internal server error, ${error}`)
  }
}

// ! update to call go server for jwt authentication
export const login = async (req: Request, res: Response) => {
  try {
    let user: Users | null = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json("Invalid email or password.");
  
    const validPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)return res.status(400).json("Invalid email or password.");
  
    const token: string = user.generateAuthToken()
    return res.status(200).send(token);
  } catch (error) {
    return res.status(500).json({ message: 'internal server error'})
  }
}

export const registerNewUser = async (req: Request, res: Response) => {
  try {
    const userExists: Users | null = await User.findOne({ email: req.body.email })
    if (userExists) return res.status(404).json('User already registered')

    const salt: string = await bcrypt.genSalt(10)
    const user: Users = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
    })

    const token: string = await user.generateAuthToken(user._id)
    if (user) return res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .json({ _id: user._id, username: user.username, email: user.email });
  } catch (error) {
    return res.status(500).json([error, 'something'])
  }
}
