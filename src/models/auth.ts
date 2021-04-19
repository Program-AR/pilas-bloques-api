import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import { User } from './user'
import { Unauthorized } from '../routes/errorHandlers'

type EncodedPassword = {
  salt: string,
  hashedPassword: string
}

const hashPassword = (password: string, salt: string) =>
  crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 64, 'sha512').toString('base64')

export const generatePassword = (password: string): EncodedPassword => {
  const salt = crypto.randomBytes(16).toString('base64')
  const hashedPassword = hashPassword(password, salt)
  return { salt, hashedPassword }
}

export const verifyPassword = (password: string, { salt, hashedPassword }: EncodedPassword) =>
  hashPassword(password, salt) === hashedPassword


type TokenData = {
  id: string
}

const secret = process.env.JWT_SECRET || 'test'

export const newToken = (user: User) => generateToken({ id: user._id })

export const generateToken = (data: TokenData): string => jwt.sign(data, secret)

export const parseToken = (token: string): TokenData => {
  try { return jwt.verify(token, secret) as TokenData }
  catch { throw new Unauthorized() }
}