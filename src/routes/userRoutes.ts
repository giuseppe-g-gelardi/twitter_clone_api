import express from 'express'
import { getUserByUsername, getUsers, register } from '../controllers/userController'
const router = express.Router()

router.get('/', getUsers)
router.get('/:username', getUserByUsername)
router.post('/register', register)

module.exports = router
