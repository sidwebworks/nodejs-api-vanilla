import mongoose from 'mongoose'

export const connection = function () {
  return mongoose.connect(process.env.DATABASE_URI)
}
