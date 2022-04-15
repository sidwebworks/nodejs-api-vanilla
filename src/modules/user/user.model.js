import mongoose from 'mongoose'

const { Schema, model } = mongoose

import { hash, verify } from 'argon2'

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    settings: {
      theme: {
        type: String,
        required: true,
        default: 'dark',
      },
      notifications: {
        type: Boolean,
        required: true,
        default: true,
      },
      compactMode: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    const hashed = await hash(this.password)
    this.password = hashed
  } catch (error) {
    next(error)
  }

  next()
})

userSchema.methods.verifyPassword = async function (password) {
  const hashedPassword = this.password

  const isCorrect = await verify(hashedPassword, password)

  return isCorrect
}

export const User = model('user', userSchema)
