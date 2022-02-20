import express from 'express'
import { test } from '../controllers/servicetest'
const router = express.Router()

router.get('/', test)

module.exports = router
