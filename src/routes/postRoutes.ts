import express from 'express'
import { 
  newPost, 
  getAllPosts, 
  getSinglePost, 
  getUserPosts, 
  deletePost, 
  likeUnlike, 
  getPostLikes,
  getFeed,
} from '../controllers/postController'
const router = express.Router()

router.get('/all', getAllPosts)
router.get('/:postid', getSinglePost)
router.put('/:username', newPost)
router.get('/:username/posts', getUserPosts)
router.delete('/:postid', deletePost)
router.put('/:postid/likes', likeUnlike)
router.get('/:postid/likes', getPostLikes)
router.get('/:username/feed', getFeed)

module.exports = router
