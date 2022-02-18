import { Request, Response } from 'express'
import Post, { Posts, postSchema } from '../models/postModel'
import User, { Users } from '../models/userModel'

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts: Posts[] = await Post.find()
    if (!posts) return res.status(404).json('no posts found')

    return res.status(200).json(posts)
  } catch (error) {
    return res.status(500).json('Internal server error, unable to fetch posts')
  }
}

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ _id: req.params.postid})
    if (!post) return res.status(500).json(`Post ${req.params.postid} not found`)

    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate({
      path: 'user',
      select: 'username isVerified profilePicture',
    })

    const userposts = posts.filter(post => post.user.username === req.params.username)
    return res.status(200).send(userposts)
  } catch (error) {
    return res.status(500).json('Trouble fetching user posts')
  }
}

export const newPost = async (req: Request, res: Response) =>{
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) return res.status(400).json(`User ${req.params.username} not found`)

    const post = new Post({
      body: req.body.body,
      user: user._id,
      username: user.username
    })
    await post.save()

    user.posts.push(post._id)
    await user.save()

    return res.status(200).json(post)
  } catch (error) {
    res.status(500).json(`Internal server error?? ${error}`)
    
  }
}

