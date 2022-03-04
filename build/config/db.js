"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// import colors from 'colors'
dotenv_1.default.config();
async function connectDB() {
    const connectionString = process.env.DB;
    try {
        const connect = await mongoose_1.default.connect(connectionString);
        console.log(`MongoBD Connected: ${connect.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}
exports.connectDB = connectDB;
