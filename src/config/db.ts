import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv'
import dbLogDecoration from '../util/dbConnectionMessage'

dotenv.config()

export async function connectDB(): Promise<void> {
  try {
    const connect = await mongoose.connect(process.env.DB!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    dbLogDecoration(connect.connection.host)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

