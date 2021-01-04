import fetch from 'node-fetch'
import * as express from 'express'
import { syncHandler, RequestHandler } from './utils'
import { DocumentType } from '@typegoose/typegoose'
import UserModel, { User } from '../models/user'
import { parseToken } from '../models/auth'
import { NotFound, ParametersNotFound, Unauthorized } from './errorHandlers'

export type AutheticatedRequest = express.Request & { user: DocumentType<User> }

export const tokenAuth = syncHandler(async (req: AutheticatedRequest, _res, next) => {
  const { username } = parseToken(accessToken(req))
  const user = await UserModel.findByUsername(username).exec()
  if (!user) throw new Unauthorized()
  req.user = user
  next()
})

const accessToken = (req: AutheticatedRequest): string => {
  const token = req.query['access_token'] as string || req.header('authorization')?.replace('Bearer ', '')
  if (!token) throw new NotFound('access token')
  return token
}

export const requiredBody = (...fields: string[]) => syncHandler(async (req: AutheticatedRequest, _res, next) => {
  required(req.body, 'body', fields, next)
})


export const requiredQueryParams = (...fields: string[]) => syncHandler(async (req: AutheticatedRequest, _res, next) => {
  required(req.query, 'query', fields, next)
})

const required = (data: any, label: string, fields: string[], next: express.NextFunction) => {
  if (!data) throw (new NotFound(label))
  if (!fields.every(field => data[field])) throw (new ParametersNotFound(label, ...fields.filter(field => !data[field])))
  next()
}

export const mirrorTo = (url: string): RequestHandler => (req, _res, next) => {
  const data = {
    method: req.method,
    body: JSON.stringify(req.body),
    headers: Object.entries(req.headers) as string[][]
  }
  fetch(url + req.path, data).catch(err => {
    console.log("MIRRORING FAILED", err)
  })
  next()
}

export const tryy = (handler: RequestHandler): RequestHandler => (req, _res, next) => {
  try {
    handler(req, _res, () => next())
  } catch {
    next()
  }
}

export const onlyIfAuth : RequestHandler = (req: AutheticatedRequest, res, next) => {
  if (req.user) { next() } else { res.end() }
}

export const end : RequestHandler = (req: AutheticatedRequest, res) => {
  res.end()
}