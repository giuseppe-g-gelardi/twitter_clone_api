import express from 'express'
import { postTest, test } from '../controllers/servicetest'
const router = express.Router()

router.get('/', test)
router.post('/postTest', postTest)

module.exports = router
