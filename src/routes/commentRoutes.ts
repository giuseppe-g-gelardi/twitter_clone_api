import express from 'express'
import { 
  getAllComments,
  likeUnlikeComment,
  postNewComment 
} from '../controllers/commentController'
const router = express.Router()

router.get('/:username/:postid/all', getAllComments)
router.post('/:username/:postid/new', postNewComment)
router.put('/:username/:postid/comments/:commentid/likes', likeUnlikeComment)

module.exports = router

// /:username/:postid/comments/:commentid/likes
