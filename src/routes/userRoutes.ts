import express from 'express'
import { login, getAllUsers, findByUsername, registerNewUser } from '../controllers/userController'
const router = express.Router()

router.get('/all', getAllUsers)
router.get('/:username', findByUsername)
router.post('/new', registerNewUser)
router.post('/login', login)

module.exports = router
// router.post('/register', register)
