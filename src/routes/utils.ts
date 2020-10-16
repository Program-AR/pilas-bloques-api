import * as express from 'express'

export type RequestHandler = express.RequestHandler

export const syncHandler = (handler: RequestHandler): RequestHandler => async (req, res, next) => {
  try {
    await handler(req, res, next)
  } catch (err) {
    next(err)
  }
}