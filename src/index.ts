import express from 'express'
import { connectDB } from './config/db'
import cors from 'cors'

connectDB()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api/users/', require('./routes/userRoutes'))
app.use('/api/posts/', require('./routes/postRoutes'))
app.use('/api/comments', require('./routes/commentRoutes'))

app.listen(port, () => console.log(`Server started on post: ${port}`))


