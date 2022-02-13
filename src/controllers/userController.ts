import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/userModel'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.find()
    return res.json(user)
  } catch (error) {
    throw new Error('unable to get users')
  }
}

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const user = await User.find({ username: req.params.username })
    if (!user) res.status(403).json(`User ${user} not found`)

    return res.status(200).json(user)
    
  } catch (error) {
    
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered.')

    const salt = await bcrypt.genSalt(10)
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
    })

    await user.save()

    const token = user.generateAuthToken()
    // const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT);
      return res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .send({ _id: user._id, username: user.username, email: user.email });
  } catch (error) {
    throw new Error('trouble making a new user')
  }
}




// const userExists = await User.findOne({ email: req.body.email })
// if (userExists) return res.status(400).json(`Account with email ${req.body.email} already exists`)

// const salt = await bcrypt.genSalt(10)
// const hashedPassword = await bcrypt.hash(req.body.password, salt)

// const user = await new User({
//   username: req.body.username,
//   email: req.body.email,
//   password: hashedPassword,
// })

// await user.save()
// const token = user.generateAuthToken()
// return res
// .header('x-auth-token', token)
// .header('access-control-expose-headers', 'x-auth-token')
// .send({ _id: user._id, username: user.username, email: user.email });
