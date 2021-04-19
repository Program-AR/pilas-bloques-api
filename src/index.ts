// SERVER
import * as express from 'express'

// ENV VAR
import * as dotenv from 'dotenv'
dotenv.config() // Do first!

// GLOBALS
import fetch from 'node-fetch'
global.fetch = fetch as any

// DB
import { connectDB } from './persistence/db'
connectDB()

// Mail
import mailing from './mailing'

// API
import routes from './routes'

const { log } = console
const port = process.env.PORT
const app = express()
app.use(mailing)
app.use(routes)
app.listen(port, () => {
  log(`Server started at ${port}`)
})