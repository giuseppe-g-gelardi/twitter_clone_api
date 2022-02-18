"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const router = express_1.default.Router();
router.get('/all', postController_1.getAllPosts);
router.get('/:postid', postController_1.getSinglePost);
router.put('/:username', postController_1.newPost);
router.get('/:username/posts', postController_1.getUserPosts);
router.delete('/:postid', postController_1.deletePost);
router.put('/:postid/likes', postController_1.likeUnlike);
module.exports = router;