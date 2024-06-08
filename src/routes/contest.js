import express from 'express'
const router = express.Router()

import { handleContestWebhook } from '../controllers/contest.js'

router.post('/', handleContestWebhook)


export default router