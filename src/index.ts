import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import connectMessage from './util/serverLogDecoration'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || '3825'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api/users/', require('./routes/userRoutes'))
app.use('/api/posts/', require('./routes/postRoutes'))
app.use('/api/comments', require('./routes/commentRoutes'))

app.listen(port, () => connectMessage(port))
