import User from '../models/user'
import * as express from 'express'
import * as mongoose from 'mongoose'
import { syncHandler } from './utils'
import { EntityNotFound } from './errorHandlers'
import { generatePassword, verifyPassword, generateToken, parseToken } from '../models/auth';

type AuthteticatedRequest = express.Request & { user: typeof User }

const router = express.Router()

router.post('/register', syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const credentials = { ...body.credentials, ...generatePassword(body.documentNumber) }
  const user = await User.create({ ...body, credentials })
  res.json(user)
}))

router.post('/login', syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const user = User.findByName(body.username)
  if (!verifyPassword(body.password, user.credentials)) throw "Contraseña incorrecta"
  const token = generateToken({ userId: user._id })
  res.json(token)
}))

const tokenAuth = syncHandler(async (req: AuthteticatedRequest, res, next) => {
  const { userId } = parseToken(req.params['access_token'])
  const user = await User.findById(userId).exec()
  if (!user) throw "Fallo de sesión"
  req.user = user
  next()
})

router.get('/profile', tokenAuth, syncHandler(async ({ user }: AuthteticatedRequest, res) => {
  res.json(user.profile)
}))

export default router