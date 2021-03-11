import * as express from 'express'
import { syncHandler } from './utils'
import { tokenAuth, mirrorTo, tryy, AutheticatedRequest, onlyIfAuth, end } from './middlewares'
import SolutionModel from '../models/solution'

const router = express.Router()

const mirror = mirrorTo(process.env.PB_ANALYTICS_URI)

router.post('/challenges', mirror, end)

router.get('/challenges/:challengeId/solution', tokenAuth, syncHandler(async (req: AutheticatedRequest, res) => {
  const { user } = req
  const { challengeId } = req.params as any
  const solution = await SolutionModel.findOne({ challengeId, user }).exec()
  res.json(solution)
}))

router.post('/solutions', mirror, tryy(tokenAuth), onlyIfAuth, syncHandler(async (req: AutheticatedRequest, res) => {
  const { user, body } = req
  const { challengeId } = body
  body.user = user
  const result = await SolutionModel.updateOne({ challengeId, user }, body, { upsert: true }).exec()
  res.json(result) // TODO: Retrieve solution?
}))

router.put('/solutions/:solutionId', mirror, tryy(tokenAuth), onlyIfAuth, syncHandler(async (req: AutheticatedRequest, res) => {
  const { solutionId } = req.params as any
  const solution = await SolutionModel.findOne({ solutionId }).exec()
  await solution.set(req.body).save()
  res.json(solution)
}))

export default router