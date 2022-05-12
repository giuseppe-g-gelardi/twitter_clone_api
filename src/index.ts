import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import compression from 'compression'
import morgan from 'morgan'

import { connectDB } from './config/db'
import connectMessage from './util/serverConnectionMessage'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || '3825'

app.disable('x-powered-by')

app.use('/build', express.static('../build', { immutable: true, maxAge: '1y' }))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(compression())
app.use(express.static('public', { maxAge: '1h' }))
app.use(morgan('tiny'))

app.use('/api/users/', require('./routes/userRoutes'))
app.use('/api/posts/', require('./routes/postRoutes'))
app.use('/api/comments', require('./routes/commentRoutes'))

app.listen(port, () => connectMessage(port))
