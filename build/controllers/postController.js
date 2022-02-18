"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPost = exports.getAllPosts = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find();
        if (!posts)
            return res.status(404).json('no posts found');
        return res.status(200).json(posts);
    }
    catch (error) {
        return res.status(500).json('Internal server error, unable to fetch posts');
    }
});
exports.getAllPosts = getAllPosts;
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ username: req.params.username });
        if (!user)
            return res.status(400).json(`User ${req.params.username} not found`);
        console.log(user._id);
        const post = new postModel_1.default({
            body: req.body.body,
            user: user._id,
            username: user.username
        });
        yield post.save();
        user.posts.push(post._id);
        yield user.save();
        return res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json(`Internal server error?? ${error}`);
    }
});
exports.newPost = newPost;
