import express from 'express'
import { connectDB } from './config/db'

connectDB()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users/', require('./routes/userRoutes'))
app.use('/api/posts/', require('./routes/postRoutes'))
app.use('/api/comments', require('./routes/commentRoutes'))
app.use('/api/gotest', require('./routes/serticetestroute'))

app.listen(port, () => console.log(`Server started on post: ${port}`))


