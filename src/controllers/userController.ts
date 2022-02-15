import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/userModel'

// this will return everything but password and updated at
// const { password, updatedAt, ...other } = user._doc

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    return res.json(users)
  } catch (error: any) {
    return res.status(500).json([error.message, 'Internal server error.'])
  }
}

export const findByUsername = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(404).json(`User: ${user} not found`)

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(`Internal server error, ${error}`)
  }
}

export const findUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userid)
    if (!user) return res.status(404).json(`User id: ${req.params.userid} not found`)
    
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json(`Internal server error, ${error}`)
  }
}

export const registerNewUser = async (req: Request, res: Response) => {
  try {
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) return res.status(404).json('User already registered')

    const salt = await bcrypt.genSalt(10)
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
    })

    const token = await user.generateAuthToken(user._id)
    if (user) return res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .json({ _id: user._id, username: user.username, email: user.email });
  } catch (error) {
    return res.status(500).json([error, 'something'])
  }
}

export async function login(req: Request, res: Response) {
  return res.json('login function')
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndRemove(req.params.userid)
    if (!user) return res.status(404).json(`User with id: ${req.params.userid} not found`)

    return res.status(200).json(`Deleted user: ${user.username}`)
  } catch (error) {
    return res.status(500).json(`Internal server error, ${error}`)
  }
}


// router.post("/login", async (req, res) => {
//   // find the user
//     let user = await User.findOne({ email: req.body.email });
//     if (!user) return res.status(400).send("Invalid email or password.");
//     // once found, validate the password
//     const validPassword = await bcrypt.compare(req.body.password, user.password)
//     // if password is invalid, return a 400 response
//     if (!validPassword)return res.status(400).send("Invalid email or password.")

//     // generate the token and return it
//     const token = user.generateAuthToken()
//     return res.send(token);

// });

// export async function getUserByUsername(req: Request, res: Response) {
//   User.findOne({ username: req.params.username })
//     .then(user => {
//       if (!user) return res.status(404).json('user not found')
//       return res.json(user)
//     })
//     .catch(error => res.status(500).json(error))
// }
// export async function getUsers(req: Request, res: Response) {
//   return User.find()
//     .then(user => {
//       if (!user) return res.status(404).json('Users not found')
//       return res.json(user)
//     })
//     .catch(error => res.status(500).json(error))
// }
// export async function register(req: Request, res: Response) {
//   User.findOne({ email: req.body.email })
//     .then(async user => {
//       if (user) return res.status(400).json('User already exists')

//       const salt = await bcrypt.genSalt(10)
//       user = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: await bcrypt.hash(req.body.password, salt),
//       })
//       await user.save()

//       const token = user.generateAuthToken(user._id)

//       return res
//       .header('x-auth-token', token)
//       .header('access-control-expose-headers', 'x-auth-token')
//       .json({ _id: user._id, username: user.username, email: user.email });
//     })
//     .catch(error => res.status(500).json(error))
// }
