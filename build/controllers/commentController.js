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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postNewComment = void 0;
const postNewComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const post = await Post.findOne({_id: req.params.postid})
    //   if (!post) return res.status(404).json(`Post: ${req.params.postid} not found`)
    //   const user = await User.findOne({ })
    //   if (!user) return res.status(404).json(`User: ${user} not found`)
    //   const comment = new Comment({
    //     body: req.body.body,
    //     user: user._id,
    //     username: user.username
    //   })
    //   await comment.save()
    //   user.posts.push(post._id)
    //   await user.save()
    //   return res.json(comment)
    // } catch (error) {
    //   return res.status(500).json(`Internal server error: ${error}`)
    // }
    return res.json('comment route');
});
exports.postNewComment = postNewComment;
