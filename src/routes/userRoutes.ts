import express from 'express'
import { 
  login, 
  getAllUsers, 
  findByUsername, 
  registerNewUser,
  findUserById,
  deleteUser,
  userSearch, 
} from '../controllers/userController'
const router = express.Router()

router.get('/all', getAllUsers)
router.get('/search', userSearch)
router.get('/:username', findByUsername)
router.get('/id/:userid', findUserById)
router.post('/new', registerNewUser)
router.post('/login', login)
router.delete('/id/:userid', deleteUser)

module.exports = router
