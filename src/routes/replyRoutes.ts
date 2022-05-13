import express from 'express'
import { 
  deleteReply, 
  getAllReplies,
  getCommentReplies,
  getSingleReply, 
  likeUnlikeReply, 
  newReply 
} from '../controllers/replyController'
const router = express.Router()

router.get('/:commentid/replies/all', getAllReplies)
router.get('/:commentid/replies', getCommentReplies)
router.get('/:id', getSingleReply)
router.put('/:commentid/new', newReply)
router.put('/:id/likes', likeUnlikeReply)
router.delete('/:id', deleteReply)

module.exports = router
