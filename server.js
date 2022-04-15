import { config } from 'dotenv'

config()

import app from './src/app.js'
import { createServer } from 'http'
import { connection } from './src/utils/database.js'

async function main() {
  const PORT = process.env.PORT || 4000
  const HOST = process.env.HOST || '0.0.0.0'

  const server = createServer(app)

  await connection()

  console.log(`Database connection initialized`)

  server.listen(PORT, HOST, () =>
    console.log(`Server started at: http://${HOST}:${PORT}`)
  )
}

main()
