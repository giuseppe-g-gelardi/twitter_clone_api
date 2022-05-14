import { Request, Response } from 'express'
import Comment from '../models/commentModel'
import Post from '../models/postModel'
import User, { Users } from '../models/userModel'

export const getAllComments = async (_req: Request, res: Response) => {
  try {
    const comments = await Comment.find()
    if (!comments) return res.status(400).json('Unable to find comments')

    return res.json(comments)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const getComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentid })
    //.populate({ path: 'replies' }) //
    if (!comment) return res.status(400).json('Unable to find comments')

    return res.status(200).json(comment)
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const postNewComment = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ _id: req.params.postid })
    if (!post) return res.status(400).json(`Post not found`)

    const postUser: Users | null = await User.findByIdAndUpdate(post.user)
    if (!postUser) return res.status(400).json('User not found')

    const fromUser: Users | null = await User.findOne({ username: req.params.username })
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
      ...user 
    } = fromUser?._doc

    if (!fromUser) return res.status(400).json(`User not found`)

    let notification;

    const comment = new Comment({
      body: req.body.body,
      user: user._id,
      username: user.username
    })

    notification = {
      to: {
        userid: postUser?._id,
        username: postUser?.username,
      },
      from: {
        userid: user._id,
        username: user.username,
        user
      },
      action: {
        actionType: 'commented',
        actionOn: 'post'
      },
      navToPost: `/posts/${post._id}`,
      navToUser: `/${user.username}`,
      message: `${user.username} commented on your post!`,
      commentid: comment._id,
      postid: post._id,
    }

    post.comments.push(comment)
    await comment.save()
    await post.save()


    if (JSON.stringify(user._id) !== JSON.stringify(postUser?._id)) {
      postUser?.notifications?.push(notification)
      await postUser?.save()
    }

    return res.status(200).json({comment, notification})
  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

export const likeUnlikeComment = async (req: Request, res: Response) => {
  try {

    let comment = await Comment.findById(req.params.commentid)
    if (!comment) return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`)

    let user = await User.findById(comment.user)
    if (!user) return res.status(400).json('user not found')

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

    if (!liker) return res.status(400).json('liker not found')


    let message;
    let notification;

    if (comment.likes.includes(req.body.userid)) {
      comment.likes.pull(req.body.userid)
      message = 'disliked'
    } else {
      if (user.username !== liker.username) {
        comment.likes.push(req.body.userid)
        message = 'liked'

        notification = {
          to: {
            userid: user?._id,
            username: user?.username
          },
          from: {
            userid: liker._id,
            username: liker.username,
            user: other
          },
          action: {
            actionType: 'liked',
            actionOn: 'comment'
          },
          navToPost: null,
          navToUser: `/${liker.username}`,
          message: `${liker.username} liked your comment!`,
          commentid: comment._id,
          postid: null
        }

        user.notifications.push(notification)
      } else if (user.username === liker.username) {
        comment.likes.push(req.body.userid)
        message = 'liked'
      }
    }

    await user.save()
    await comment.save()
    return res.status(200).json({ comment, message, notification })

  } catch (error) {
    return res.status(500).json(`Internal server error: ${error}`)
  }
}

