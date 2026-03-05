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
exports.postImage = exports.editArticle = exports.createArticle = exports.getArticle = exports.getMyNews = exports.getAllNews = void 0;
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("../models/config");
const UserStatus_1 = require("../models/enums/UserStatus");
const News_1 = __importDefault(require("../models/mysql/News"));
const Users_1 = require("../models/Users");
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield News_1.default.findAll({
            where: { approved: true },
            order: [["date", "DESC"]],
        });
        if (!news) {
            return res.status(404).json({ message: "No news found" });
        }
        return res.json(news);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.getAllNews = getAllNews;
const getMyNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        if (!userID || typeof userID !== "string") {
            return res.status(400).json({ message: "Bad request" });
        }
        const user = yield getUserLogged(req);
        if (!user || user.id !== userID) {
            return res.status(401).json({ message: "You're not allowed to be here" });
        }
        const news = yield News_1.default.findAll({
            where: { userID: userID },
            order: [["date", "DESC"]],
        });
        if (!news) {
            return res.status(404).json({ message: "No news found" });
        }
        return res.json(news);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.getMyNews = getMyNews;
const getArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, allowed } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ message: "No ID provided correctly" });
        }
        const whereConditions = { id };
        if (!allowed) {
            whereConditions.approved = true;
        }
        const article = yield News_1.default.scope("withAll").findOne({
            where: whereConditions,
        });
        if (!article) {
            return res.status(404).json({ message: "No article found" });
        }
        return res.json(article);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.getArticle = getArticle;
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield getUserLogged(req);
        if (!user) {
            return res
                .status(401)
                .json({ message: "You're not allowed to create an article" });
        }
        const rawBody = req.body.body;
        const file = req.file;
        if (!rawBody || !file) {
            return res.status(400).json({
                message: "Trying to create a new article without information",
            });
        }
        let articleData = JSON.parse(rawBody);
        const validated = validateArticle(articleData);
        if (!validated) {
            return res
                .status(400)
                .json({ message: "Not all fields contains a value" });
        }
        const imageUrl = (0, exports.postImage)(file);
        const article = {
            id: articleData.id,
            title: articleData.title,
            summary: articleData.summary,
            image: imageUrl,
            author: articleData.author,
            date: articleData.date.split("T")[0],
            text: articleData.text,
            approved: false,
            userID: user.id,
        };
        yield News_1.default.create(article);
        return res.status(200).json({ message: "Article created successfully!" });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.createArticle = createArticle;
const editArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield getUserLogged(req);
        if (!user) {
            return res
                .status(401)
                .json({ message: "You're not allowed to create an article" });
        }
        const rawBody = req.body.body;
        const file = req.file;
        let articleData = JSON.parse(rawBody);
        if (!articleData || (!file && !articleData.image) || !articleData.id) {
            return res.status(400).json({
                message: "Trying to edit an existing article without information",
            });
        }
        const validated = validateArticle(articleData);
        if (!validated) {
            return res
                .status(400)
                .json({ message: "Not all fields contains a value" });
        }
        var imageUrl = "";
        if (file) {
            imageUrl = (0, exports.postImage)(file);
        }
        const article = {
            id: articleData.id,
            title: articleData.title,
            summary: articleData.summary,
            image: file ? imageUrl : articleData.image,
            author: articleData.author,
            date: articleData.date,
            text: articleData.text,
            approved: false,
            userID: user.id,
        };
        yield News_1.default.update({
            title: article.title,
            summary: article.summary,
            image: article.image,
            author: article.author,
            date: article.date,
            text: article.text,
            approved: article.approved,
        }, {
            where: { id: article.id },
        });
        return res.status(200).json({ message: "Article updated successfully!" });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.editArticle = editArticle;
function validateArticle(articleData) {
    if (!articleData.id ||
        !articleData.title ||
        !articleData.summary ||
        !articleData.date ||
        !articleData.author) {
        return false;
    }
    if (typeof articleData.title !== "string" ||
        typeof articleData.summary !== "string" ||
        typeof articleData.date !== "string" ||
        typeof articleData.author !== "string") {
        return false;
    }
    return true;
}
const postImage = (file, originalName) => {
    if (!file)
        return undefined;
    const uniqueName = `${(0, uuid_1.v4)()}${path_1.default.extname(originalName || "image.png")}`;
    const uploadPath = path_1.default.join("uploads/news", uniqueName);
    // 🔹 Si `file` es un Buffer (imagen procesada), lo guarda como un archivo
    if (file instanceof Buffer) {
        fs_1.default.writeFileSync(uploadPath, file);
    }
    else {
        // 🔹 Si es un archivo Multer, guarda el buffer
        fs_1.default.writeFileSync(uploadPath, file.buffer);
    }
    return uploadPath;
};
exports.postImage = postImage;
function getUserLogged(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let access = req.cookies["access_token"];
        let user = new Users_1.User("", "", "", "", "", "", UserStatus_1.UserStatus.ACTIVE);
        if (access) {
            let userAux = yield getToken(access);
            if (userAux) {
                user = userAux;
            }
            return user;
        }
        return undefined;
    });
}
function getToken(tokenAux) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = new Users_1.User("", "", "", "", "", "", UserStatus_1.UserStatus.ACTIVE);
        try {
            const data = jsonwebtoken_1.default.verify(tokenAux, config_1.SECRET_JWT_KEY);
            if (typeof data === "object" && data !== null) {
                user = data; // Casting si estás seguro que data contiene propiedades de User
                return user;
            }
            else {
                return null;
            }
        }
        catch (error) {
            return null;
        }
    });
}
