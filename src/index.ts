// ENV VAR
import * as dotenv from 'dotenv'
dotenv.config() // Do first!

// GLOBALS
import fetch from 'node-fetch'
global.fetch = fetch as any

// DB
import { connectDB } from './persistence/db'
connectDB()

// SERVER
import * as express from 'express'
import routes from './routes'
const { log } = console
const port = process.env.PORT
const app = express()
app.use(routes)
app.listen(port, () => {
  log(`Server started at ${port}`)
})