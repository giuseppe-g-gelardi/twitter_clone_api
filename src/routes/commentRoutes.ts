import express from 'express'
import { 
  getAllComments,
  postNewComment 
} from '../controllers/commentController'
const router = express.Router()

router.get('/:username/:postid/all', getAllComments)
router.post('/:username/:postid/new', postNewComment)

module.exports = router
