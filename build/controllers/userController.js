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
exports.register = exports.getUserByUsername = exports.getUsers = void 0;
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
            .catch(error => res.status(500).send(error));
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
                .send({ _id: user._id, username: user.username, email: user.email });
        }))
            .catch(error => res.status(500).json(error));
    });
}
exports.register = register;
// export const registera = async (req: Request, res: Response) => {
//   try {
//     let user = await User.findOne({ email: req.body.email })
//     if (user) return res.status(400).send('User already registered.')
//     const salt = await bcrypt.genSalt(10)
//     user = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: await bcrypt.hash(req.body.password, salt),
//     })
//     await user.save()
//     const token = user.generateAuthToken()
//     // const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT);
//       return res
//       .header('x-auth-token', token)
//       .header('access-control-expose-headers', 'x-auth-token')
//       .send({ _id: user._id, username: user.username, email: user.email });
//   } catch (error) {
//     throw new Error('trouble making a new user')
//   }
// }
// const userExists = await User.findOne({ email: req.body.email })
// if (userExists) return res.status(400).json(`Account with email ${req.body.email} already exists`)
// const salt = await bcrypt.genSalt(10)
// const hashedPassword = await bcrypt.hash(req.body.password, salt)
// const user = await new User({
//   username: req.body.username,
//   email: req.body.email,
//   password: hashedPassword,
// })
// await user.save()
// const token = user.generateAuthToken()
// return res
// .header('x-auth-token', token)
// .header('access-control-expose-headers', 'x-auth-token')
// .send({ _id: user._id, username: user.username, email: user.email });
// export const getUsers = async (req: Request, res: Response) => {
// try {
//   const user = User.find()
//   return res.json(user)
// } catch (error) {
//   throw new Error('unable to get users')
// }
// export const getUserByUsername = async (req: Request, res: Response) => {
//   try {
//     const user = await User.find({ username: req.params.username })
//     if (!user) res.status(403).json(`User ${user} not found`)
//     return res.status(200).json(user)
//   } catch (error) {
//   }
// }
