import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export async function connectDB(): Promise<void> {
  const connectionString: string = process.env.DB!
  try {
    const connect = await mongoose.connect(connectionString)
    console.log(`MongoBD Connected: ${connect.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

