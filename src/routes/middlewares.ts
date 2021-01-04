import fetch from 'node-fetch'
import * as express from 'express'
import { syncHandler } from './utils'
import { DocumentType } from '@typegoose/typegoose'
import UserModel, { User } from '../models/user'
import { parseToken } from '../models/auth'
import { NotFound, ParametersNotFound, Unauthorized } from './errorHandlers'

type AuthteticatedRequest = express.Request & { user: DocumentType<User> }


export const tokenAuth = syncHandler(async (req: AuthteticatedRequest, res, next) => {
  const { username } = parseToken(accessToken(req))
  const user = await UserModel.findByUsername(username).exec()
  if (!user) throw new Unauthorized()
  req.user = user
  next()
})

const accessToken = (req: AuthteticatedRequest): string => {
  const token = req.query['access_token'] as string
  if (!token) throw new NotFound('access token')
  return token
}

export const requiredBody = (...fields: string[]) => syncHandler(async (req: AuthteticatedRequest, res, next) => {
  required(req.body, 'body', fields, next)
})


export const requiredQueryParams = (...fields: string[]) => syncHandler(async (req: AuthteticatedRequest, res, next) => {
  required(req.query, 'query', fields, next)
})

const required = (data: any, label: string, fields: string[], next: express.NextFunction) => {
  if (!data) throw (new NotFound(label))
  if (!fields.every(field => data[field])) throw (new ParametersNotFound(label, ...fields.filter(field => !data[field])))
  next()
}

export const mirrorTo = (url: string) => syncHandler(async (req, _res, next) => {
  const data = {
    method: req.method,
    body: req.body,
    headers: Object.entries(req.headers) as string[][]
  }
  fetch(url, data).catch(err => {
    console.log("MIRRORING FAILED", err)
  })
  next()
})
