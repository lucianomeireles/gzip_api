import dotenv from 'dotenv'
import mongoose from 'mongoose'
import logger from './winston.config'
dotenv.config()

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id
    delete converted.__v
    delete converted.password
  },
})

let database: mongoose.Connection

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'check-your-env-file')
    database = mongoose.connection
    logger.info('Connected to MongoDB')
    return database
  } catch (err) {
    logger.error(`MongoDB connection error: ${err}`)
    process.exit(1)
  }
}

export default { connect, mongoose }
