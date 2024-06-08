import express from 'express'
const router = express.Router()

import { addContentItemText, addContentItemImage } from '../controllers/content.js'

router.post('/', addContentItemText)
router.post('/image', addContentItemImage)

export default router