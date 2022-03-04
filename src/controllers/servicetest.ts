import { Request, Response } from 'express'
import axios from 'axios'
import User from '../models/userModel'
import bcrypt from 'bcryptjs'

export const test = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('http://localhost:8080')
    return res.status(200).send(response.data)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const postTest = async (req: Request, res: Response) => {
  try {
    const response = await axios.post('http://localhost:8080/test', {
      id: req.body.id,
      email: req.body.email
    })
    return res.status(200).json(response.data)    
  } catch (error: any) {
    return res.status(500).json(error)
  }
}

export const loginTest = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json("Invalid Credentials");
    console.log(user)
  
    const validPassword: boolean = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(validPassword)
    if (!validPassword)return res.status(400).json("Invalid Credentials");

    const token: string = await axios.post('http://localhost:8080/login', {
      username: user.username,
      email: user.email
    })
    return res.status(200).send(token);
  } catch (error) {
    console.log('halp')
    return res.status(500).json({ message: 'internal server error'})
  }
}

// export const login = async (req: Request, res: Response) => {
//   try {
//     let user: Users | null = await User.findOne({ email: req.body.email })
//     if (!user) return res.status(400).json("Invalid email or password.");
  
//     const validPassword: boolean = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!validPassword)return res.status(400).json("Invalid email or password.");
  
//     const token: string = user.generateAuthToken()
//     return res.status(200).send(token);
//   } catch (error) {
//     return res.status(500).json({ message: 'internal server error'})
//   }
// }
