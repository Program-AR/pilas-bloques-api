import * as express from 'express'
import { syncHandler } from './utils'
import { DocumentType } from '@typegoose/typegoose'
import UserModel, { User } from '../models/user'
import { generatePassword, verifyPassword, generateToken } from '../models/auth'
import { tokenAuth, requiredBody, requiredQueryParams } from './middlewares'
import { HttpCodeError } from './errorHandlers'

type AuthteticatedRequest = express.Request & { user: DocumentType<User> }

const newToken = (user: User) => generateToken({ username: user.credentials.username })

const router = express.Router()

router.post('/register', requiredBody('credentials', 'profile'), syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const credentials = { ...body.credentials, ...generatePassword(body.credentials.password) }
  const user = await UserModel.create({ ...body, credentials })
  const token = newToken(user)
  res.json({ token, ...user.profile })
}))

router.post('/login', requiredBody('username', 'password'), syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const user = await UserModel.findByUsername(body.username).exec()
  if (!user || !verifyPassword(body.password, user.credentials)) throw new HttpCodeError(400, "Wrong credentials")
  const token = newToken(user)
  res.json({ token, ...user.profile })
}))

router.get('/register/check', requiredQueryParams('username'), syncHandler(async ({ query }: AuthteticatedRequest, res) => {
  const user = await UserModel.findByUsername(query['username'] as string).exec()
  res.json(!user)
}))

router.get('/profile', tokenAuth, syncHandler(async ({ user }: AuthteticatedRequest, res) => {
  res.json(user.profile)
}))

export default router