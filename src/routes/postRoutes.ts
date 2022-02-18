import express from 'express'
import { newPost, getAllPosts } from '../controllers/postController'
const router = express.Router()

router.get('/all', getAllPosts)
// router.post('/new', newPost)
router.put('/:username', newPost)

module.exports = router
