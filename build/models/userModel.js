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
    posts: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Post', default: [] }]
}, { timestamps: true });
exports.userSchema.methods.generateAuthToken = function () {
    return jsonwebtoken_1.default.sign({ _id: this._id, username: this.username, email: this.email }, process.env.JWT);
};
const User = mongoose_1.default.model("User", exports.userSchema);
exports.default = User;
