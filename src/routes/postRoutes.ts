import express from 'express'
import { newPost, getAllPosts, getSinglePost, getUserPosts } from '../controllers/postController'
const router = express.Router()

router.get('/all', getAllPosts)
router.get('/:postid', getSinglePost)
router.put('/:username', newPost)
router.get('/:username/posts', getUserPosts)

module.exports = router
