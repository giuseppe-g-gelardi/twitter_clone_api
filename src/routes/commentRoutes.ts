import express from 'express'
import { 
  postNewComment 
} from '../controllers/commentController'
const router = express.Router()

router.put('/:postid', postNewComment)

module.exports = router
