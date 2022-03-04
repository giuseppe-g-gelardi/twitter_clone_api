"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReplies = exports.reply = exports.getSingleComment = exports.getCommentLikes = exports.likeUnlikeComment = exports.postNewComment = exports.getAllComments = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getAllComments = async (req, res) => {
    try {
        const comments = await commentModel_1.default.find();
        if (!comments)
            return res.status(404).json('No comments to show?');
        return res.json(comments);
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error?.message}`);
    }
};
exports.getAllComments = getAllComments;
const postNewComment = async (req, res) => {
    try {
        const post = await postModel_1.default.findOne({ _id: req.params.postid });
        if (!post)
            return res.status(404).json(`Post: ${req.params.postid} not found`);
        const user = await userModel_1.default.findOne({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User: ${user} not found`);
        const comment = new commentModel_1.default({
            body: req.body.body,
            user: user._id,
            username: user.username
        });
        await comment.save();
        post.comments.push(comment._id);
        await user.save();
        return res.json(comment);
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error.message}`);
    }
};
exports.postNewComment = postNewComment;
const likeUnlikeComment = async (req, res) => {
    try {
        const user = await userModel_1.default.find({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User ${req.params.username} does not exist`);
        let post = await postModel_1.default.findById(req.params.postid);
        if (!post)
            return res.status(404).json(`Post with id: ${req.params.postid} does not exist`);
        let comment = await commentModel_1.default.findById(req.params.commentid);
        if (!comment)
            return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`);
        let message;
        if (comment.likes.includes(req.body.userid)) {
            comment.likes.pull(req.body.userid);
            message = 'disliked';
        }
        else {
            comment.likes.push(req.body.userid);
            message = 'liked';
        }
        await comment.save();
        return res.status(200).json({ comment, message });
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error}`);
    }
};
exports.likeUnlikeComment = likeUnlikeComment;
// http://localhost:8000/api/comments/seppe/620f39593bd2f802685b1595/comments/:commentid/likes
const getCommentLikes = async (req, res) => {
    // ! update to populate each userid, username, pfp ...otherdetails
    // for each like to display on front end. 
    // use .populate()
    try {
        const user = await userModel_1.default.find({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User ${req.params.username} does not exist`);
        let post = await postModel_1.default.findById(req.params.postid);
        if (!post)
            return res.status(404).json(`Post with id: ${req.params.postid} does not exist`);
        let comment = await commentModel_1.default.findById(req.params.commentid);
        if (!comment)
            return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`);
        const likes = comment.likes.length;
        if (!likes)
            return res.json('err');
        return res.status(200).json(likes);
    }
    catch (error) {
        return res.status(500).json(`internal server error: ${error}`);
    }
};
exports.getCommentLikes = getCommentLikes;
const getSingleComment = async (req, res) => {
    try {
        const user = await userModel_1.default.find({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User ${req.params.username} does not exist`);
        let post = await postModel_1.default.findById(req.params.postid);
        if (!post)
            return res.status(404).json(`Post with id: ${req.params.postid} does not exist`);
        let comment = await commentModel_1.default.findById(req.params.commentid);
        if (!comment)
            return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`);
        return res.status(200).json(comment);
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error}`);
    }
};
exports.getSingleComment = getSingleComment;
const reply = async (req, res) => {
    try {
        const user = await userModel_1.default.findOne({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User ${req.params.username} does not exist`);
        let post = await postModel_1.default.findById(req.params.postid);
        if (!post)
            return res.status(404).json(`Post with id: ${req.params.postid} does not exist`);
        let parentComment = await commentModel_1.default.findById(req.params.commentid);
        if (!parentComment)
            return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`);
        let replies = parentComment.replies;
        let newReply = new commentModel_1.default({
            body: req.body.body,
            user: user._id,
            username: user.username,
            parent: req.params.commentid
        });
        await newReply.save();
        replies.push(newReply._id);
        await parentComment.save();
        return res.json({ parentComment, newReply });
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error}`);
    }
};
exports.reply = reply;
const getAllReplies = async (req, res) => {
    try {
        const user = await userModel_1.default.find({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User ${req.params.username} does not exist`);
        let post = await postModel_1.default.findById(req.params.postid);
        if (!post)
            return res.status(404).json(`Post with id: ${req.params.postid} does not exist`);
        let comment = await commentModel_1.default.findById(req.params.commentid);
        if (!comment)
            return res.status(404).json(`comment with id: ${req.params.commentid} does not exist`);
        const replies = await comment.replies;
        return res.status(200).json({
            parentComment: {
                id: comment._id,
                body: comment.body,
                userid: comment.user,
                username: comment.username
            },
            replies
        });
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error}`);
    }
};
exports.getAllReplies = getAllReplies;
// ! implement to populate reply details
// const posts = await Post.find().populate({
//   path: 'user',
//   select: 'username isVerified profilePicture',
// })
