"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostLikes = exports.likeUnlike = exports.deletePost = exports.newPost = exports.getUserPosts = exports.getSinglePost = exports.getAllPosts = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel_1.default.find();
        if (!posts)
            return res.status(404).json('no posts found');
        return res.status(200).json(posts);
    }
    catch (error) {
        return res.status(500).json('Internal server error, unable to fetch posts');
    }
};
exports.getAllPosts = getAllPosts;
const getSinglePost = async (req, res) => {
    try {
        const post = await postModel_1.default.findOne({ _id: req.params.postid });
        if (!post)
            return res.status(500).json(`Post ${req.params.postid} not found`);
        return res.status(200).json(post);
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error}`);
    }
};
exports.getSinglePost = getSinglePost;
const getUserPosts = async (req, res) => {
    try {
        const posts = await postModel_1.default.find().populate({
            path: 'user',
            select: 'username isVerified profilePicture',
        });
        const userposts = posts.filter(post => post.user.username === req.params.username);
        return res.status(200).send(userposts);
    }
    catch (error) {
        return res.status(500).json('Trouble fetching user posts');
    }
};
exports.getUserPosts = getUserPosts;
const newPost = async (req, res) => {
    try {
        const user = await userModel_1.default.findOne({ username: req.params.username });
        if (!user)
            return res.status(400).json(`User ${req.params.username} not found`);
        const post = new postModel_1.default({
            body: req.body.body,
            user: user._id,
            username: user.username
        });
        await post.save();
        user.posts.push(post._id);
        await user.save();
        return res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json(`Internal server error?? ${error}`);
    }
};
exports.newPost = newPost;
const deletePost = async (req, res) => {
    try {
        const post = await postModel_1.default.findByIdAndRemove(req.params.postid);
        if (!post)
            return res.status(404).json(`Unable to find post: ${req.params.postid}`);
        return res.status(200).json(`Post ${post} successfully deleted`);
    }
    catch (error) {
        return res.status(500).send(`unable to delete post ${error}`);
    }
};
exports.deletePost = deletePost;
const likeUnlike = async (req, res) => {
    try {
        let post = await postModel_1.default.findById(req.params.postid);
        if (!post)
            return res.status(404).json(`Post with id: ${req.params.postid} does not exist`);
        let message;
        if (post.likes.includes(req.body.userid)) {
            post.likes.pull(req.body.userid);
            message = 'disliked';
        }
        else {
            post.likes.push(req.body.userid);
            message = 'liked';
        }
        await post.save();
        return res.status(200).json({ post, message });
    }
    catch (error) {
        res.status(500).send(`Internal server error --Unable to like/unlike post. ${error}`);
    }
};
exports.likeUnlike = likeUnlike;
const getPostLikes = async (req, res) => {
    try {
        const post = await postModel_1.default.findOne({ _id: req.params.postid });
        if (!post)
            return res.status(404).json(`Post with id: ${req.params.postid} not found`);
        let likes = post.likes;
        if (!likes)
            return res.json(`Post ${post} has no likes`);
        return res.status(200).json(likes);
    }
    catch (error) {
        return res.status(500).json(`unable to find likes... ${error}`);
    }
};
exports.getPostLikes = getPostLikes;
