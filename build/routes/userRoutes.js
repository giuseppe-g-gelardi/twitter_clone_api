"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get('/all', userController_1.getAllUsers);
router.get('/search', userController_1.userSearch);
router.get('/:username', userController_1.findByUsername);
router.get('/id/:userid', userController_1.findUserById);
router.post('/new', userController_1.registerNewUser);
router.post('/login', userController_1.login);
router.delete('/id/:userid', userController_1.deleteUser);
module.exports = router;
