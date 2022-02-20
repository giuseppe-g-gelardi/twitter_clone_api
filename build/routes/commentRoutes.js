"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
router.get('/:username/:postid/all', commentController_1.getAllComments);
router.post('/:username/:postid/new', commentController_1.postNewComment);
router.put('/:username/:postid/comments/:commentid/likes', commentController_1.likeUnlikeComment);
router.get('/:username/:postid/comments/:commentid/likes', commentController_1.getCommentLikes);
router.get('/:username/:postid/comments/:commentid', commentController_1.getSingleComment);
router.get('/:username/:postid/comments/:commentid/replies', commentController_1.reply);
module.exports = router;
// /:username/:postid/comments/:commentid/likes
