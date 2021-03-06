import { Request, Response } from 'express'
import Post, { Posts } from '../models/postModel'
import User from '../models/userModel'

export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts: Posts[] = await Post.find()
    if (!posts) return res.status(400).json('no posts found')

    return res.status(200).json(posts)
  } catch (error) {
    return res.status(500).json('Internal server error, unable to fetch posts')
  }
}

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const posts: Posts[] | null = await Post.find().populate({
      path: 'user',
      // select: 'username isVerified profilePicture',
    })
    // ! update this to prevent over fetching
    // const user: Users | null = await User.findOne({ username: req.params.username}) // not needed? probably not...
    const userposts = posts.filter(post => post.user.username === req.params.username)
    return res.status(200).json(userposts)
  } catch (error) {
    return res.status(500).json('Trouble fetching user posts')
  }
}

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const post: Posts | null = await Post.findOne({ _id: req.params.postid })
    if (!post) return res.status(500).json(`Post ${req.params.postid} not found`)

    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const newPost = async (req: Request, res: Response) => {
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
    res.status(500).json(`Internal server error: ${error}`)
    
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post: Posts | null = await Post.findByIdAndRemove(req.params.postid)
    if (!post) return res.status(404).json(`Unable to find post: ${req.params.postid}`)

    return res.status(200).json(`Post ${post} successfully deleted`)
  } catch (error) {
    return res.status(500).send(`unable to delete post ${error}`)
  }
}

export const likeUnlike = async (req: Request, res: Response) => {
  try {
    let post = await Post.findById(req.params.postid)
    if (!post) return res.status(400).json(`Post not found`)

    let user = await User.findById(post.user)
    if (!user) return res.status(400).json(`user not found`)

    let liker = await User.findById(req.body.userid)
    const { 
      password, 
      updatedAt, 
      notifications, 
      bio,
      location,
      followers,
      following,
      posts,
      theme,
      ...other 
    } = liker?._doc
    if (!liker) return res.status(400).json('user not found')


    let message;
    let notification

    if (post.likes.includes(req.body.userid)) {
      post.likes.pull(req.body.userid)
      message = 'disliked'
    } else {
      if (user.username !== liker.username) {
        post.likes.push(req.body.userid)
        message = 'liked'

        notification = {
          to: {
            userid: user._id,
            username: user.username
          },
          from: {
            userid: liker._id,
            username: liker.username,
            user: other
          },
          action: {
            actionType: 'liked',
            actionOn: 'post'
          },
          navToPost: `/posts/${post._id}`,
          navToUser: `/${liker.username}`,
          message: `${liker.username} liked your post!`,
          commentid: null,
          postid: post._id,
        }

        user.notifications.push(notification)
      } else if (user.username === liker.username) {
        post.likes.push(req.body.userid)
        message = 'liked'
      }
    }
    await user.save()
    await post.save()
    return res.status(200).json({ post, message, notification })
  } catch (error) {
    res.status(500).send(`Internal server error --Unable to like/unlike post. ${error}`)
  }
}

export const viewCount = async (req: Request, res: Response) => {
  try {
    const post: Posts | null = await Post.findOneAndUpdate({ _id: req.params.postid }, {
      $inc: { views: 1 }
    })
    if (!post) return res.status(400).json('Post not found')

    return res.status(200).json('views increased')
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}
