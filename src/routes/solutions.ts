import * as express from 'express'
import { syncHandler } from './utils'
import { tokenAuth, mirrorTo, tryy, AutheticatedRequest, onlyIfAuth, end } from './middlewares'
import SolutionModel from '../models/solution'

const router = express.Router()

const mirror = mirrorTo(process.env.PB_ANALYTICS_URI)

router.post('/challenges', mirror, end)

router.post('/solutions', mirror, tryy(tokenAuth), onlyIfAuth, syncHandler(async (req: AutheticatedRequest, res) => {
  const { user, body } = req
  const { challengeId } = body
  body.user = user
  await SolutionModel.updateOne({ challengeId, user }, body, { upsert: true }).exec()
  res.end()
}))

router.put('/solutions/:solutionId', mirror, tryy(tokenAuth), onlyIfAuth, syncHandler(async (req: AutheticatedRequest, res) => {
  const { solutionId } = req.params as any
  await SolutionModel.updateOne({ solutionId }, req.body).exec()
  res.end()
}))

export default router