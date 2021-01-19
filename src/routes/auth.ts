import * as express from 'express'
import { syncHandler } from './utils'
import { DocumentType } from '@typegoose/typegoose'
import UserModel, { User } from '../models/user'
import { generatePassword, verifyPassword, generateToken } from '../models/auth'
import { tokenAuth, requiredBody, requiredQueryParams } from './middlewares'
import { HttpCodeError } from './errorHandlers'

type AuthteticatedRequest = express.Request & { user: DocumentType<User> }

const newToken = (user: User) => generateToken({ username: user.username })
const authResponse = (user: User) => ({ token: newToken(user), ...user.profile })

const router = express.Router()

router.post('/register', requiredBody('username', 'password'), syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const user = await UserModel.create({ ...body, ...generatePassword(body.password) })
  res.json(authResponse(user))
}))

router.post('/login', requiredBody('username', 'password'), syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const user = await UserModel.findByUsername(body.username).exec()
  if (!user || !verifyPassword(body.password, user)) throw new HttpCodeError(400, "Wrong credentials")
  res.json(authResponse(user))
}))

router.put('/credentials', requiredBody('username', 'password', 'parentCUIL'), syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const user = await UserModel.findByUsername(body.username).exec()
  if (!user || user.parentCUIL !== body.parentCUIL) throw new HttpCodeError(400, "Wrong credentials")
  await user.set(generatePassword(body.password)).save()
  res.json(authResponse(user))
}))

router.get('/users/exists', requiredQueryParams('username'), syncHandler(async ({ query }: AuthteticatedRequest, res) => {
  const user = await UserModel.findByUsername(query['username'] as string).exec()
  res.json(Boolean(user))
}))

router.get('/profile', tokenAuth, syncHandler(async ({ user }: AuthteticatedRequest, res) => {
  res.json(user.profile)
}))

export default router