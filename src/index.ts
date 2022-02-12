import express, { Request, Response } from 'express'
import { connectDB } from './config/db'

connectDB()

const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(errorHandler)

app.listen(port, () => console.log(`Server started on post: ${port}`))


