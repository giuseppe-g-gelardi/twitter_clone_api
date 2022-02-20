import { Request, Response } from 'express'
import axios from 'axios'

export const test = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('http://localhost:8080')
    return res.status(200).send(response.data)
    
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}
