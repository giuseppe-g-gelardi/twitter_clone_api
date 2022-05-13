import { Request, Response } from 'express'
import Reply, { Replies } from '../models/replyModel'
import User from '../models/userModel'

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

export const newReply = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user)
    if (!user) return res.status(400).json('user not found')

    const reply: Replies[] = await Reply.create({
      user: req.body.user,
      body: req.body.body,
      comment: req.params.commentid
    })

    return res.status(200).json(reply)

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
            // user: liker
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

    console.log(notification)
    await user.save()
    await reply.save()
    return res.status(200).json({ reply, message, notification })
  } catch (error) {
    return res.status(500).json(error)
  }
}

