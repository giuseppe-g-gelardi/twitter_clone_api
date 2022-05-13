import express from 'express'
import { 
  deleteReply, 
  getAllReplies,
  getSingleReply, 
  likeUnlikeReply, 
  newReply 
} from '../controllers/replyController'
const router = express.Router()

router.get('/:commentid/replies', getAllReplies)
router.get('/:id', getSingleReply)
router.post('/:commentid/new', newReply)
router.delete('/:id', deleteReply)
router.put('/:id/likes', likeUnlikeReply)



module.exports = router
