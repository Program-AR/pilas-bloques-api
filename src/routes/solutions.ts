import * as express from 'express'
import { syncHandler } from './utils'
import { DocumentType } from '@typegoose/typegoose'
import UserModel, { User } from '../models/user'
import { tokenAuth, requiredBody, requiredQueryParams, mirrorTo, tryy, AutheticatedRequest } from './middlewares'
import { HttpCodeError } from './errorHandlers'

const router = express.Router()

const mirror = mirrorTo(process.env.PB_ANALYTICS_URI)

router.post('/challenges', mirror, syncHandler(async (req, res) => {
  // Do nothing
  console.log("challenges", req.body)
  res.end()
}))

router.post('/solutions', mirror, tryy(tokenAuth), syncHandler(async (req: AutheticatedRequest, res) => {
  // TODO: Save user solution if logged
  console.log("solutions", req.user)
  res.end()
}))

router.put('/solutions/:id', mirror, tryy(tokenAuth), syncHandler(async (req, res) => {
  // TODO: Update user solution if logged
  console.log("result", req.body)
  res.end()
}))

export default router