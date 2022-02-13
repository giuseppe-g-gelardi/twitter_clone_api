import express from 'express'
import { getUserByUsername, getUsers, register, login } from '../controllers/userController'
const router = express.Router()

router.get('/', getUsers)
router.get('/:username', getUserByUsername)
router.post('/register', register)
router.post('/login', login)

module.exports = router
