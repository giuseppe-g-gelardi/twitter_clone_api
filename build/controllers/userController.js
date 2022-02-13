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
exports.login = exports.register = exports.getUserByUsername = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return userModel_1.default.find()
            .then(user => {
            if (!user)
                return res.status(404).json('Users not found');
            return res.json(user);
        })
            .catch(error => res.status(500).json(error));
    });
}
exports.getUsers = getUsers;
function getUserByUsername(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        userModel_1.default.findOne({ username: req.params.username })
            .then(user => {
            if (!user)
                return res.status(404).json('user not found');
            return res.json(user);
        })
            .catch(error => res.status(500).json(error));
    });
}
exports.getUserByUsername = getUserByUsername;
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        userModel_1.default.findOne({ email: req.body.email })
            .then((user) => __awaiter(this, void 0, void 0, function* () {
            if (user)
                return res.status(400).json('User already exists');
            const salt = yield bcryptjs_1.default.genSalt(10);
            user = new userModel_1.default({
                username: req.body.username,
                email: req.body.email,
                password: yield bcryptjs_1.default.hash(req.body.password, salt),
            });
            yield user.save();
            const token = user.generateAuthToken(user._id);
            return res
                .header('x-auth-token', token)
                .header('access-control-expose-headers', 'x-auth-token')
                .json({ _id: user._id, username: user.username, email: user.email });
        }))
            .catch(error => res.status(500).json(error));
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return res.json('User login function');
    });
}
exports.login = login;
