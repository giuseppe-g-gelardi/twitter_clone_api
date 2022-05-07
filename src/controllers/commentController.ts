import { Request, Response } from 'express'
import Comment from '../models/commentModel'
import Post from '../models/postModel'
import User from '../models/userModel'

export const getAllComments = async (_req: Request, res: Response) => {
  try {
    const comments = await Comment.find()
    if (!comments) return res.status(404).json('No comments to show?')
    
    return res.json(comments)
  } catch (error: any) {
    return res.status(500).json(`Internal server error: ${error?.message}`)
  }
}

export const getComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentid })
    if (!comment) return res.status(400).json('unable to find comment')

    return res.status(200).json(comment)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const postNewComment = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({_id: req.params.postid})
    if (!post) return res.status(404).json(`Post: ${req.params.postid} not found`)

    const user = await User.findOne({ username: req.params.username})
    if (!user) return res.status(404).json(`User: ${user} not found`)

    const comment = new Comment({
      body: req.body.body,
      user: user._id,
      username: user.username
    })
    await comment.save()

    post.comments.push(comment)
    // post.comments.push(comment._id)
    await post.save()
    // await user.save()

    return res.json(comment)
  } catch (error: any) {
    return res.status(500).json(`Internal server error: ${error.message}`)
  }
}

export const likeUnlikeComment = async (req: Request, res: Response) => {
  try {
    // const user = await User.find({ username: req.params.username })
    // if (!user) return res.status(404).json(`User ${req.params.username} does not exist`)

    // let post = await Post.findById(req.params.postid)
    // if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)

    let comment = await Comment.findById(req.params.commentid)
    if (!comment) return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`)

    let message: string;
    if (comment.likes.includes(req.body.userid)) {
      comment.likes.pull(req.body.userid)
      message = 'disliked'
    } else {
      comment.likes.push(req.body.userid)
      message = 'liked'
    }

    await comment.save()
    return res.status(200).json({ comment, message })

  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

// http://localhost:8000/api/comments/seppe/620f39593bd2f802685b1595/comments/:commentid/likes
export const getCommentLikes = async (req: Request, res: Response) => {
  // ! update to populate each userid, username, pfp ...otherdetails
  // for each like to display on front end. 
  // use .populate()
  try {
    const user = await User.find({ username: req.params.username })
    if (!user) return res.status(404).json(`User ${req.params.username} does not exist`)

    let post = await Post.findById(req.params.postid)
    if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)

    let comment = await Comment.findById(req.params.commentid)
    if (!comment) return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`)

    const likes = comment.likes.length
    if (!likes) return res.json('err')

    return res.status(200).json(likes)
  } catch (error) {
    return res.status(500).json(`internal server error: ${error}`)
  }
}

export const getSingleComment = async (req: Request, res: Response) => {
  try {
    const user = await User.find({ username: req.params.username })
    if (!user) return res.status(404).json(`User ${req.params.username} does not exist`)

    let post = await Post.findById(req.params.postid)
    if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)

    let comment = await Comment.findById(req.params.commentid)
    if (!comment) return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`)

    return res.status(200).json(comment)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const reply = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(404).json(`User ${req.params.username} does not exist`)

    let post = await Post.findById(req.params.postid)
    if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)

    let parentComment = await Comment.findById(req.params.commentid)
    if (!parentComment) return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`)

    let replies = parentComment.replies

    let newReply = new Comment({
      body: req.body.body,
      user: user._id,
      username: user.username,
      parent: req.params.commentid
    })
    await newReply.save()

    replies.push(newReply._id)
    await parentComment.save()

    return res.json({parentComment, newReply})
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const getAllReplies = async (req: Request, res: Response) => {
  try {
    const user = await User.find({ username: req.params.username })
    if (!user) return res.status(404).json(`User ${req.params.username} does not exist`)

    let post = await Post.findById(req.params.postid)
    if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)

    let comment = await Comment.findById(req.params.commentid)
    if (!comment) return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`)
    
    const replies = await comment.replies

    return res.status(200).json({ 
      parentComment: {
        id: comment._id,
        body: comment.body,
        userid: comment.user,
        username: comment.username
      }, 
      replies 
    })
      
      
    } catch (error) {
      return res.status(500).json(`Internal server error: ${error}`)
    }
  }
  
  
  // ! implement to populate reply details
  // const posts = await Post.find().populate({
  //   path: 'user',
  //   select: 'username isVerified profilePicture',
  // })
