import express from 'express'
const router = express.Router()

import { handleGetWebhook, handleStoreWebhook, handleDeleteWebhook } from '../controllers/store.js'
import { accessedDirectly } from '../middleware/access.js'

router.get('/webhooks', accessedDirectly, handleGetWebhook)

router.post('/webhooks', accessedDirectly, handleStoreWebhook)

router.delete('/webhooks', accessedDirectly, handleDeleteWebhook)

export default router