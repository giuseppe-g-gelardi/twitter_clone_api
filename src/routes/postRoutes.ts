import express from 'express'
import { 
  newPost, 
  getAllPosts, 
  getSinglePost, 
  getUserPosts, 
  deletePost, 
  likeUnlike } from '../controllers/postController'
const router = express.Router()

router.get('/all', getAllPosts)
router.get('/:postid', getSinglePost)
router.put('/:username', newPost)
router.get('/:username/posts', getUserPosts)
router.delete('/:postid', deletePost)
router.put('/:postid/likes', likeUnlike)

module.exports = router