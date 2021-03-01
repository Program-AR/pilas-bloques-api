import * as express from 'express'
import { syncHandler } from './utils'
import { DocumentType } from '@typegoose/typegoose'
import UserModel, { User } from '../models/user'
import { generatePassword, verifyPassword, generateToken } from '../models/auth'
import { tokenAuth, requiredBody, requiredQueryParams } from './middlewares'
import { HttpCodeError } from './errorHandlers'

type AuthteticatedRequest = express.Request & { user: DocumentType<User> }

const newToken = (user: User) => generateToken({ username: user.username })

const toJsonUser = (user: User) => ({ token: newToken(user), ...user.profile, answers: user.answersIds })

const router = express.Router()

router.post('/register', requiredBody('username', 'password'), syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const user = await UserModel.create({ ...body, ...generatePassword(body.password) })
  res.json(toJsonUser(user))
}))

router.post('/login', requiredBody('username', 'password'), syncHandler(async ({ body }: AuthteticatedRequest, res) => {
  const user = await UserModel.findByUsername(body.username).exec()
  if (!user || !verifyPassword(body.password, user)) throw new HttpCodeError(400, "Wrong credentials")
  res.json(toJsonUser(user))
}))

router.get('/register/check', requiredQueryParams('username'), syncHandler(async ({ query }: AuthteticatedRequest, res) => {
  const user = await UserModel.findByUsername(query['username'] as string).exec()
  res.json(!user)
}))


router.post('/answers', tokenAuth, requiredBody('question', 'response'), syncHandler(async ({ user, body }: AuthteticatedRequest, res) => {
  user.answers.push(body)
  await user.save()
  res.json(toJsonUser(user))
}))

router.get('/profile', tokenAuth, syncHandler(async ({ user }: AuthteticatedRequest, res) => {
  res.json(user.profile)
}))

export default router