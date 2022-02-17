"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    firstname: { type: String },
    lastname: { type: String },
    bio: { type: String, maxlength: 140 },
    location: { type: String, maxlength: 100 },
    profilePicture: { type: String, default: '' },
    profileBanner: { type: String, default: '' },
    protected: { type: Boolean, default: false },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    posts: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Post', default: [] }],
    notifications: { type: Array, default: [] },
    theme: { type: String, default: 'light' },
    createdAt: { type: String },
    updatedAt: { type: String }
}, { timestamps: true });
exports.userSchema.methods.generateAuthToken = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id, username: this.username, email: this.email }, process.env.JWT);
};
const User = mongoose_1.default.model("User", exports.userSchema);
exports.default = User;
