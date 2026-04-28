import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  if (!process.env.DB_URI) {
    console.warn('DB_URI is not set; starting API without MongoDB connection')
    return null
  }

  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('Database connection error:', error.message)
    return null
  }
}

export default connectDB
