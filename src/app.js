import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'
import { router as userRouter } from './modules/user/index.js'
import errors from 'http-errors'

const { NotFound } = errors

const app = express()

app.use(helmet())

app.use(json())

app.use(urlencoded({ extended: true }))

app.use(cors())

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
} else {
  app.use(logger('combined'))
}

app.get('/health', (req, res) => {
  res.status(200).json({
    uptime: process.uptime(),
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/v1/users', userRouter)

app.use('*', (req, res) => {
  res.status(404).json(new NotFound(`${req.baseUrl} not found on the server`))
})

export default app
