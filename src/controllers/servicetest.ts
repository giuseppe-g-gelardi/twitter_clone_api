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

export const postTest = async (req: Request, res: Response) => {
  try {
    // const body = {
    //   "testparam": "this is a test",
    //   "testparam2": "this is also a test"
    // }

    const body = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
    }

    const response = await axios.post('http://localhost:8080/posttest', {body})
    return res.status(200).json(response.data)

    
  } catch (error: any) {
    return res.status(500).json(error)
  }
}
