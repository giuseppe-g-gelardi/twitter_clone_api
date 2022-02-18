"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
db_1.connectDB();
const app = express_1.default();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/api/users/', require('./routes/userRoutes'));
app.use('/api/posts/', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.listen(port, () => console.log(`Server started on post: ${port}`));
