import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/userModel'

export async function getUsers(req: Request, res: Response) {
  return User.find()
    .then(user => {
      if (!user) return res.status(404).json('Users not found')
      return res.json(user)
    })
    .catch(error => res.status(500).json(error))
}

export async function getUserByUsername(req: Request, res: Response) {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) return res.status(404).json('user not found')
      return res.json(user)
    })
    .catch(error => res.status(500).json(error))
}

export async function register(req: Request, res: Response) {
  User.findOne({ email: req.body.email })
    .then(async user => {
      if (user) return res.status(400).json('User already exists')

      const salt = await bcrypt.genSalt(10)
      user = new User({
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt),
      })
      await user.save()

      const token = user.generateAuthToken(user._id)

      return res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .json({ _id: user._id, username: user.username, email: user.email });
    })
    .catch(error => res.status(500).json(error))
}

export async function login(req: Request, res: Response) {
  return res.json('User login function')
}
