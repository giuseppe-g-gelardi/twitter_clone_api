import { Request, Response } from 'express'
import Post, { Posts } from '../models/postModel'
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
    const post: Posts | null = await Post.findOne({ _id: req.params.postid})
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

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.postid)
    if (!post) return res.status(404).json(`Unable to find post: ${req.params.postid}`)

    return res.status(200).json(`Post ${post} successfully deleted`)
  } catch (error) {
    return res.status(500).send(`unable to delete post ${error}`)
  }
}

export const likeUnlike = async (req: Request, res: Response) => {
  try {
    let post = await Post.findById(req.params.postid)
    if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)

    let message;
    if (post.likes.includes(req.body.userid)) {
      post.likes.pull(req.body.userid)
      message = 'disliked'
    } else {
      post.likes.push(req.body.userid)
      message = 'liked'
    }
    await post.save()
    return res.status(200).json({ post, message })
  } catch (error) {
    res.status(500).send(`Internal server error --Unable to like/unlike post. ${error}`)
    
  }
}

export const getPostLikes = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ _id: req.params.postid })
    if (!post) return res.status(404).json(`Post with id: ${req.params.postid} not found`)

    let likes = post.likes
    if (!likes) return res.json(`Post ${post} has no likes`)

    return res.status(200).json(likes)
  } catch (error) {
    return res.status(500).json(`unable to find likes... ${error}`)
  }
}
