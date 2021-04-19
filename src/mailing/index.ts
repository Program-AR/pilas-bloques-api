import * as express from 'express'
import * as nodemailer from 'nodemailer'
import { AutheticatedRequest, syncHandler } from '../routes/utils'

export const createTransport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// TODO: Mover a otro lugar?
const router = express.Router()
router.use(syncHandler((req: AutheticatedRequest, _res, next) => {
  req.transport = createTransport()
  next()
}))
export default router

