import { catchAsync } from '../../utils/catch.js'
import * as service from './user.service.js'
import errors from 'http-errors'
import { createToken } from '../../utils/jwt.js'
import { omit } from 'lodash-es'

const { BadRequest, Conflict } = errors

/**
 * Logins a user
 */
export const loginUser = catchAsync(async (req, res) => {
  const { password, email } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json(new BadRequest('Email and Password are required'))
  }

  const existingUser = await service.findOne({ email }).select('+password')

  if (!existingUser) {
    return res.status(400).json(new BadRequest('Invalid email or password'))
  }

  const isPasswordCorrect = await existingUser.verifyPassword(password)

  if (!isPasswordCorrect) {
    throw res.status(400).json(new BadRequest('Invalid email or password'))
  }

  const payload = omit(
    existingUser.toJSON(),
    'password',
    'createdAt',
    'updatedAt',
    '__v'
  )

  const token = createToken(payload, process.env.JWT_SECRET)

  res.status(200).json({ message: 'Logged in', result: { token } })
})

/**
 * Registers a user
 * @type {import('express').RequestHandler}
 */
export const registerUser = catchAsync(async (req, res) => {
  const { password, confirmPassword, email, firstname, lastname } = req.body

  if (!(confirmPassword === password)) {
    return res
      .status(400)
      .json(new BadRequest('Password and confirmPassword do not match'))
  }

  const existingUser = await service.findOne({ email }).lean()

  if (existingUser) {
    return res.status(409).json(new Conflict('Email is already registered'))
  }

  await service.create({ password, email, firstname, lastname })

  res.status(200).json({ message: 'User registered' })
})
