import express from 'express'
import { 
  login, 
  getAllUsers, 
  findByUsername, 
  registerNewUser,
  findUserById,
  deleteUser,
  userSearch,
  followAndUnfollowUsers,
  uploadProfilePicture,
} from '../controllers/userController'
const router = express.Router()

router.get('/all', getAllUsers)
router.get('/search', userSearch)
router.get('/:username', findByUsername)
router.get('/id/:userid', findUserById)
router.put('/:username/following', followAndUnfollowUsers)
router.put('/:username/update', uploadProfilePicture)
router.post('/new', registerNewUser)
router.post('/login', login)
router.delete('/id/:userid', deleteUser)

module.exports = router
