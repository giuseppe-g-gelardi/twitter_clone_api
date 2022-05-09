import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { Users } from '../models/userModel'
import axios from 'axios'

// ! reimplement plz
// this will return everything but password and updated at
// const { password, updatedAt, ...other } = user._doc

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users: Users[] = await User.find()
    return res.json(users)
  } catch (error: any) {
    return res.status(500).json([error.message, 'Internal server error.'])
  }
}

export const userSearch = async (_req: Request, res: Response) => {
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
    if (!validPassword) return res.status(400).json("Invalid email or password.");

    // const token: string = user.generateAuthToken() // ? schema method to generate token
    const response = await axios.post('http://localhost:8080/token', {
      id: user._id
    })
    const token = response.data
    return res.status(200).json(user);
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
    // const token: string = await user.generateAuthToken(user._id) // * schema method to generate token
    const response = await axios.post('http://localhost:8080/token', {
      id: user._id
    })
    const token = response.data
    if (user) return res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .json(user);
    // .json({ _id: user._id, username: user.username, email: user.email, token });
  } catch (error) {
    return res.status(500).json([error, 'something'])
  }
}

// TODO: push notification when following
export const followAndUnfollowUsers = async (req: Request, res: Response) => {
  if (req.body.username !== req.params.username) {
    try {
      const user: Users | null = await User.findOne({ username: req.params.username })
      if (!user) return res.status(404).json({ message: `ERR! User ${req.params.username} not found.` })

      const currentUser: Users | null = await User.findOne({ username: req.body.username })
      if (!currentUser) return res.status(404).json({ message: `ERRRR! User [logged in user] ${req.body.username} not found.` })

      let message;
      if (user?.followers?.includes(req.body.username)) {
        user?.followers?.pull(req.body.username)
        currentUser?.following?.pull(req.params.username)
        message = 'You are no longer following this user'
      } else {
        user?.followers?.push(req.body.username)
        currentUser?.following?.push(req.params.username)
        message = 'You are now following'
      }
      await user?.save()
      await currentUser?.save()
      return res.status(200).json(message)
    } catch (error: any) {
      res.status(500).json(error.message)
    }
  } else {
    res.status(403).json('this is the else block')
  }
}

export const uploadProfileBanner = async (req: Request, res: Response) => {
  try {

    let user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(400).json('user not found')

    const image = req.body.image

    if (user.profileBanner.length !== '') {
      user.profileBanner = ''
      user.profileBanner = image
    }
    user.profileBanner = image

    await user.save()

    res.status(200).json(user)

  } catch (error) {
    return res.status(500).json(error)

  }
}

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(400).json('user not found')

    const image = req.body.image

    if (user.profilePicture.length !== '') {
      user.profilePicture = ''
      user.profilePicture = image
    }
    user.profilePicture = image

    await user.save()

    res.status(200).json(user)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {

    const user: Users | null = await User.findOneAndUpdate({ username: req.params.username }, {
      $set: req.body,
    })
    if (!user) return res.status(404).json('user not found')

    res.status(200).json('Account has been updated!')
  } catch (err) {
    return res.status(500).json(err)
  }
}

// ! this only seems to work for one user, not sure why. the following 
// ! works by id and seems to work with other users.
// TODO: FIND OUT WHY THE SERVER CRASHES IF I DELETE THIS!?@#?!
export const clearNotifications = async (req: Request, res: Response) => {
  try {
    const user: Users | null = await User.findOneAndUpdate({ username: req.params.username })
    if (!user) return res.status(400).json('unable to find user')

    console.log(user.username)

    let notifications: any = user.notifications
    notifications.splice(0, notifications.length)

    await user.save()
    return res.status(200).json('notifications cleared!')
  } catch (error) {
    return res.status(500).json(error)
  }
}

// http://localhost:8000/api/users/notifications/${userid}/clear
export const clearNotificationsById = async (req: Request, res: Response) => {
  try {

    let user = await User.findByIdAndUpdate(req.params.userid)
    if (!user) return res.status(400).json('user not found')

    let notifications: any = user.notifications
    notifications.splice(0, notifications.length)

    await user.save()

    return res.status(200).json('notifications cleared!')
  } catch (error) {
    return res.status(500).json(error)
  }
}
