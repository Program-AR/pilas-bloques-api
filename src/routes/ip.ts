import * as express from 'express'
import { syncHandler } from './utils'

const router = express.Router()

router.get('/user-ip', syncHandler(async (_req, res) => {
    const response = await fetch("https://api64.ipify.org?format=json")
    const jsonIp = await response.json()
    res.json(jsonIp)
}))

export default router