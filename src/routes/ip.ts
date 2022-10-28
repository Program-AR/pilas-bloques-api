import * as express from 'express'
import { syncHandler } from './utils'

const router = express.Router()

router.get('/user-ip', syncHandler(async (req, res) => {
    const jsonIp = {
        ip: req.ip
    }
    res.json(jsonIp)
}))

export default router