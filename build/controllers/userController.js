"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followAndUnfollowUsers = exports.registerNewUser = exports.login = exports.deleteUser = exports.findUserById = exports.findByUsername = exports.userSearch = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const axios_1 = __importDefault(require("axios"));
// ! reimplement plz
// this will return everything but password and updated at
// const { password, updatedAt, ...other } = user._doc
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find();
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json([error.message, 'Internal server error.']);
    }
};
exports.getAllUsers = getAllUsers;
const userSearch = async (req, res) => {
    try {
        const users = (await userModel_1.default.find()).filter(user => user.protected === false);
        if (!users)
            return res.status(400).json('No public users to show');
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json('Unable to get users');
    }
};
exports.userSearch = userSearch;
const findByUsername = async (req, res) => {
    try {
        const user = await userModel_1.default.findOne({ username: req.params.username });
        if (!user)
            return res.status(404).json(`User: ${user} not found`);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json(`Internal server error, ${error}`);
    }
};
exports.findByUsername = findByUsername;
const findUserById = async (req, res) => {
    try {
        const user = await userModel_1.default.findById(req.params.userid);
        if (!user)
            return res.status(404).json(`User id: ${req.params.userid} not found`);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json(`Internal server error, ${error}`);
    }
};
exports.findUserById = findUserById;
const deleteUser = async (req, res) => {
    try {
        const user = await userModel_1.default.findByIdAndRemove(req.params.userid);
        if (!user)
            return res.status(404).json(`User with id: ${req.params.userid} not found`);
        return res.status(200).json(`Deleted user: ${user.username}`);
    }
    catch (error) {
        return res.status(500).json(`Internal server error, ${error}`);
    }
};
exports.deleteUser = deleteUser;
const login = async (req, res) => {
    try {
        let user = await userModel_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).json("Invalid email or password.");
        const validPassword = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(400).json("Invalid email or password.");
        // const token: string = user.generateAuthToken() // ? schema method to generate token
        const response = await axios_1.default.post('http://localhost:8080/token', {
            id: user._id
        });
        const token = response.data;
        return res.status(200).json(token);
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
};
exports.login = login;
const registerNewUser = async (req, res) => {
    try {
        const userExists = await userModel_1.default.findOne({ email: req.body.email });
        if (userExists)
            return res.status(404).json('User already registered');
        const salt = await bcryptjs_1.default.genSalt(10);
        const user = await userModel_1.default.create({
            username: req.body.username,
            email: req.body.email,
            password: await bcryptjs_1.default.hash(req.body.password, salt),
        });
        // const token: string = await user.generateAuthToken(user._id) // ? schema method to generate token
        const response = await axios_1.default.post('http://localhost:8080/token', {
            id: user._id
        });
        const token = response.data;
        if (user)
            return res
                .header('x-auth-token', token)
                .header('access-control-expose-headers', 'x-auth-token')
                .json(token);
        // .json({ _id: user._id, username: user.username, email: user.email, token });
    }
    catch (error) {
        return res.status(500).json([error, 'something']);
    }
};
exports.registerNewUser = registerNewUser;
const followAndUnfollowUsers = async (req, res) => {
    if (req.body.username !== req.params.username) {
        try {
            const user = await userModel_1.default.findOne({ username: req.params.username });
            if (!user)
                return res.status(404).json({ message: `ERR! User ${req.params.username} not found.` });
            const currentUser = await userModel_1.default.findOne({ username: req.body.username });
            if (!currentUser)
                return res.status(404).json({ message: `ERRRR! User [logged in user] ${req.body.username} not found.` });
            let message;
            if (user?.followers?.includes(req.body.username)) {
                user?.followers?.pull(req.body.username);
                currentUser?.following?.pull(req.params.username);
                message = 'You are no longer following this user';
            }
            else {
                user?.followers?.push(req.body.username);
                currentUser?.following?.push(req.params.username);
                message = 'You are now following';
            }
            await user?.save();
            await currentUser?.save();
            return res.status(200).json(message);
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }
    else {
        res.status(403).json('this is the else block');
    }
};
exports.followAndUnfollowUsers = followAndUnfollowUsers;
