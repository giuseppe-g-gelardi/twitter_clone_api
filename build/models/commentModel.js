"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.commentSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
    username: { type: String, default: null },
    body: { type: String, maxlength: 500, required: true },
    likes: { type: [mongoose_1.default.Types.ObjectId], default: [] },
    parent: { type: mongoose_1.default.Types.ObjectId, default: null },
    replies: { type: [mongoose_1.default.Types.ObjectId], ref: 'Comment', default: [] }
});
const Comment = mongoose_1.default.model("Comment", exports.commentSchema);
exports.default = Comment;
