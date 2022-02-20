import express from 'express'
import { 
  getAllComments,
  getAllReplies,
  getCommentLikes,
  getSingleComment,
  likeUnlikeComment,
  postNewComment, 
  reply
} from '../controllers/commentController'
const router = express.Router()

router.get('/:username/:postid/all', getAllComments)
router.post('/:username/:postid/new', postNewComment)
router.put('/:username/:postid/comments/:commentid/likes', likeUnlikeComment)
router.get('/:username/:postid/comments/:commentid/likes', getCommentLikes)
router.get('/:username/:postid/comments/:commentid', getSingleComment)
router.post('/:username/:postid/comments/:commentid/replies', reply)
router.get('/:username/:postid/comments/:commentid/replies', getAllReplies)

module.exports = router
