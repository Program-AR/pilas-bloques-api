import * as express from 'express'
import { syncHandler } from './utils'
import { tokenAuth, mirrorTo, tryy, AutheticatedRequest, onlyIfAuth, end } from './middlewares'

const router = express.Router()

const mirror = mirrorTo(process.env.PB_ANALYTICS_URI)

router.post('/challenges', mirror, end)

router.post('/solutions', mirror, tryy(tokenAuth), onlyIfAuth, syncHandler(async (req: AutheticatedRequest, res) => {
  // TODO: Save req.user solution
  res.end()
}))

router.put('/solutions/:id', mirror, tryy(tokenAuth), onlyIfAuth, syncHandler(async (req: AutheticatedRequest, res) => {
  // TODO: Update req.user solution
  res.end()
}))

export default router