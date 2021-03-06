import { Request, Response } from 'express'
import Comment from '../models/commentModel'
import Reply, { Replies } from '../models/replyModel'
import User, { Users } from '../models/userModel'

export const getAllReplies = async (req: Request, res: Response) => {
  try {
    const replies = await Reply.find().where({ comment: req.params.commentid })
    if (!replies) return res.status(400).json('unable to find replies or comment')

    return res.status(200).json(replies)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getSingleReply = async (req: Request, res: Response) => {
  try {

    const reply: Replies | null = await Reply.findById(req.params.id)
    if (!reply) return res.status(400).json('unable to find reply')

    return res.status(200).json(reply)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getSingleReplyWithUser = async (req: Request, res: Response) => {
  try {

    const reply: Replies | null = await Reply.findById(req.params.id)
    if (!reply) return res.status(400).json('unable to find reply')

    // let other = await User.findById(reply.user)
    const user = await User.findById(reply.user)
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
      email,
      _id,
      ...other
    } = user?._doc
    if (!user) return res.status(400).json('unable to find user')

    return res.status(200).json({reply, other})
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getCommentReplies = async (req: Request, res: Response) => {
  try {
    // const replies = await Comment.findById({ _id: req.params.commentid }).populate({
    //   path: 'replies'
    // })

    const comment = await Comment.findOne({ _id: req.params.commentid })
    if (!comment) return res.status(400).json('Unable to find comment')

    let replyObjects = comment.replies

    let data: any = []

    for (let replies of replyObjects) {
      let reply = await Reply.findOne(replies)
      let replyUser = await User.findOne(reply.user)
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
        email,
        _id,
        ...user
      } = replyUser?._doc
      data.push({ reply, user })
    }
    
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json('trouble fetching this comment')
  }
}

export const newReply = async (req: Request, res: Response) => {
  try {

    const comment = await Comment.findOne({ _id : req.params.commentid })
    if (!comment) return res.status(400).json('comment not found')


    const commentUser: Users | null = await User.findByIdAndUpdate(comment.user)
    if (!commentUser) return res.status(400).json('comment user not found')

    const fromUser: Users | null = await User.findById(req.body.user)
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
      email,
      _id,
      ...user
    } = fromUser?._doc
    if (!fromUser) return res.status(400).json('user not found')

    // let notification;

    const reply = new Reply({
      body: req.body.body,
      user: req.body.user,
      comment: req.body.comment
      // user: user._id,
      // comment: req.params.commentid
    })


    // TODO: update this. properly get User, adjust notifications

    // notification = {
    //   to: {
    //     userid: postUser?._id,
    //     username: postUser?.username,
    //   },
    //   from: {
    //     userid: user._id,
    //     username: user.username,
    //     user
    //   },
    //   action: {
    //     actionType: 'commented',
    //     actionOn: 'post'
    //   },
    //   navToPost: `/posts/${post._id}`,
    //   navToUser: `/${user.username}`,
    //   message: `${user.username} commented on your post!`,
    //   commentid: comment._id,
    //   postid: post._id,
    // }

    comment.replies.push(reply)
    await reply.save()
    await comment.save()

    // if (JSON.stringify(user._id) !== JSON.stringify(commentUser?._id)) {
    //   commentUser?.notifications?.push(notification)
    //   await commentUser?.save()
    // }


    return res.status(200).json({reply, user})
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const deleteReply = async (req: Request, res: Response) => {
  try {

    const reply: Replies | null = await Reply.findByIdAndDelete(req.params.id)
    if (!reply) return res.status(400).json('unable to find reply')

    return res.status(200).json(`deleted successfully`)

  } catch (error) {
    return res.status(500).json(error)

  }
}

export const likeUnlikeReply = async (req: Request, res: Response) => {
  try {

    let reply = await Reply.findById(req.params.id)
    if (!reply) return res.status(400).json('reply not found')

    let user = await User.findById(reply.user)
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


    if (reply.likes.includes(req.body.userid)) {
      reply.likes.pull(req.body.userid)
      message = 'disliked'
    } else {
      if (user.username !== liker.username) {
        reply.likes.push(req.body.userid)
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
            actionOn: 'reply'
          },
          navToPost: `/replies/${reply._id}`,
          navToUser: `/${liker.username}`,
          message: `${liker.username} liked your post!`,
          commentid: reply.comment._id,
          postid: null,
        }

        user.notifications.push(notification)
      } else if (user.username === liker.username) {
        reply.likes.push(req.body.userid)
        message = 'liked'
      }
    }

    await user.save()
    await reply.save()
    return res.status(200).json({ reply, message })
  } catch (error) {
    return res.status(500).json(error)
  }
}
