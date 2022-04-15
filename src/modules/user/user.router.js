import express from 'express'
import * as controllers from './user.controllers.js'

const userRouter = express()

userRouter.post('/login', controllers.loginUser)

userRouter.post('/register', controllers.registerUser)

export default userRouter
