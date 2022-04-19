import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dbLogDecoration from '../util/dbLogDecoration'

dotenv.config()

export async function connectDB(): Promise<void> {
  const connectionString: string = process.env.DB!
  try {
    const connect = await mongoose.connect(connectionString)
    const host = connect.connection.host
    dbLogDecoration(host)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

