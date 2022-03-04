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
exports.registerNewUser = exports.login = exports.deleteUser = exports.findUserById = exports.findByUsername = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const axios_1 = __importDefault(require("axios"));
// this will return everything but password and updated at
// const { password, updatedAt, ...other } = user._doc
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json([error.message, 'Internal server error.']);
    }
});
exports.getAllUsers = getAllUsers;
const findByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User: ${user} not found`);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json(`Internal server error, ${error}`);
    }
});
exports.findByUsername = findByUsername;
const findUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.userid);
        if (!user)
            return res.status(404).json(`User id: ${req.params.userid} not found`);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json(`Internal server error, ${error}`);
    }
});
exports.findUserById = findUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndRemove(req.params.userid);
        if (!user)
            return res.status(404).json(`User with id: ${req.params.userid} not found`);
        return res.status(200).json(`Deleted user: ${user.username}`);
    }
    catch (error) {
        return res.status(500).json(`Internal server error, ${error}`);
    }
});
exports.deleteUser = deleteUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userModel_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).json("Invalid email or password.");
        const validPassword = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(400).json("Invalid email or password.");
        // const token: string = user.generateAuthToken() // ? method to generate token
        const response = yield axios_1.default.post('http://localhost:8080/login', {
            email: user.email,
            password: user.password
        });
        const token = response.data;
        return res.status(200).send(token);
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
});
exports.login = login;
const registerNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield userModel_1.default.findOne({ email: req.body.email });
        if (userExists)
            return res.status(404).json('User already registered');
        const salt = yield bcryptjs_1.default.genSalt(10);
        const user = yield userModel_1.default.create({
            username: req.body.username,
            email: req.body.email,
            password: yield bcryptjs_1.default.hash(req.body.password, salt),
        });
        const token = yield user.generateAuthToken(user._id);
        if (user)
            return res
                .header('x-auth-token', token)
                .header('access-control-expose-headers', 'x-auth-token')
                .json({ _id: user._id, username: user.username, email: user.email });
    }
    catch (error) {
        return res.status(500).json([error, 'something']);
    }
});
exports.registerNewUser = registerNewUser;
