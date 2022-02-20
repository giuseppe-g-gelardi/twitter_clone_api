import express from 'express'
import { 
  getAllComments,
  getCommentLikes,
  getSingleComment,
  likeUnlikeComment,
  postNewComment 
} from '../controllers/commentController'
import { getPostLikes } from '../controllers/postController'
const router = express.Router()

router.get('/:username/:postid/all', getAllComments)
router.post('/:username/:postid/new', postNewComment)
router.put('/:username/:postid/comments/:commentid/likes', likeUnlikeComment)
router.get('/:username/:postid/comments/:commentid/likes', getCommentLikes)
router.get('/:username/:postid/comments/:commentid', getSingleComment)

module.exports = router

// /:username/:postid/comments/:commentid/likes
