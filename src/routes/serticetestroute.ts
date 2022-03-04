import express from 'express'
import { loginTest, postTest, test } from '../controllers/servicetest'
const router = express.Router()

router.get('/', test)
router.post('/test', postTest)
router.post('/logintest', loginTest)

module.exports = router
