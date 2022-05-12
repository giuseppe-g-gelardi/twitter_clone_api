import express from 'express'
import { 
  getAllComments,
  getComment,
  likeUnlikeComment,
  postNewComment, 
} from '../controllers/commentController'
const router = express.Router()

router.get('/:commentid', getComment)
router.get('/:username/:postid/all', getAllComments)
router.put('/:username/:postid/new', postNewComment)
router.put('/:commentid/likes', likeUnlikeComment)


module.exports = router
