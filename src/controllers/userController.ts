import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/userModel'

const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  // check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400) 
    throw new Error('User already exists')
  }
  
  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    token: generateToken(user._id)
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.name,
      email: user.email
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  
  //check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// generate jwt token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT!, { expiresIn: '30d' })
}
