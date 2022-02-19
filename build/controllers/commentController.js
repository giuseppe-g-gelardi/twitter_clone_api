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
exports.postNewComment = exports.getAllComments = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield commentModel_1.default.find();
        if (!comments)
            return res.status(404).json('No comments to show?');
        return res.json(comments);
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error === null || error === void 0 ? void 0 : error.message}`);
    }
});
exports.getAllComments = getAllComments;
const postNewComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postModel_1.default.findOne({ _id: req.params.postid });
        if (!post)
            return res.status(404).json(`Post: ${req.params.postid} not found`);
        const user = yield userModel_1.default.findOne({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User: ${user} not found`);
        const comment = new commentModel_1.default({
            body: req.body.body,
            user: user._id,
            username: user.username
        });
        yield comment.save();
        post.comments.push(comment._id);
        yield user.save();
        return res.json(comment);
    }
    catch (error) {
        return res.status(500).json(`Internal server error: ${error.message}`);
    }
});
exports.postNewComment = postNewComment;
