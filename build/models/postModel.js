"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.postSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, ref: 'User' },
    username: { type: String, default: null },
    body: { type: String, maxlength: 500, required: true },
    likes: { type: [mongoose_1.default.Types.ObjectId], default: [] },
    comments: [{ type: [mongoose_1.default.Types.ObjectId], ref: 'Comment', default: [] }],
}, { timestamps: true });
const Post = mongoose_1.default.model("Post", exports.postSchema);
exports.default = Post;
