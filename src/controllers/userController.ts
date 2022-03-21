import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { Users } from '../models/userModel'
import axios from 'axios'

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

export const userSearch = async (req: Request, res: Response) => {
  try {
    const users: Users[] = (await User.find()).filter(user => user.protected === false)
    if (!users) return res.status(400).json('No public users to show')

    return res.json(users)
  } catch (error: any) {
    return res.status(500).json('Unable to get users')
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

export const login = async (req: Request, res: Response) => {
  try {
    let user: Users | null = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json("Invalid email or password.");
  
    const validPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)return res.status(400).json("Invalid email or password.");
  
    // const token: string = user.generateAuthToken() // ? schema method to generate token
    const response = await axios.post('http://localhost:8080/token', {
      id: user._id
    })
    const token = response.data
    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json({ message: 'internal server error' })
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
    // const token: string = await user.generateAuthToken(user._id) // ? schema method to generate token
    const response = await axios.post('http://localhost:8080/token', {
      id: user._id
    })
    const token = response.data
    if (user) return res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .json(token);
      // .json({ _id: user._id, username: user.username, email: user.email, token });
  } catch (error) {
    return res.status(500).json([error, 'something'])
  }
}

export const followAndUnfollowUsers = async (req: Request, res: Response) => {
  // const user = await User.find({ username: req.params.username })
  // if (!user) return res.status(400).json('cant find user')

  return res.json({ message: "follow and unfollow users is working ish"})


}

// // ! follow AND unfollow user. working? will test more
// router.put('/:id/follow', async (req, res) => {
//   // return res.status(200).send('endpoint works')
//   if (req.body.userid !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id)
//       const currentUser = await User.findById(req.body.userid)

//       let message;
//       if (user.followers.includes(req.body.userid)) {
//         user.followers.pull(req.body.userid)
//         currentUser.following.pull(req.params.id)
//         message = 'You are no longer following this user'
//       } else {
//         user.followers.push(req.body.userid)
//         currentUser.following.push(req.params.id)
//         message = 'You are now following this user'
//       }
//       await user.save()
//       await currentUser.save()
//       return res.status(200).send(message)
      
//   } catch (err) {
//     res.status(500).send('ERR BRUH')
//   }

//   } else {
//     res.status(403).send(err.message)
//   }
// })
