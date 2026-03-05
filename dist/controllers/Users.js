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
exports.validatePasswordModal = exports.logout = exports.login = exports.recoverPassword = exports.deleteImage = exports.postImage = exports.validateUserID = exports.getUserByName = void 0;
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("../models/config");
const UserStatus_1 = require("../models/enums/UserStatus");
const Users_1 = __importDefault(require("../models/mysql/Users"));
const Users_2 = require("../models/Users");
const getUserByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield getUserLogged(req);
        if (!user) {
            return res
                .status(401)
                .json({ message: "No tiene permiso para ver esta información" });
        }
        const { username } = req.params;
        const fullName = decodeURIComponent(username);
        const UserAux = yield Users_1.default.findOne({ where: { fullName: fullName } });
        if (!UserAux) {
            return res.status(404).json({ message: "No se encontró el usuario" });
        }
        return res.json(UserAux);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.getUserByName = getUserByName;
const validateUserID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield getUserLogged(req);
        if (!user) {
            return res.status(401).json(false);
        }
        const { userID } = req.params;
        const UserAux = yield Users_1.default.findOne({
            where: { id: userID, status: UserStatus_1.UserStatus.ACTIVE },
        });
        if (!UserAux) {
            return res.status(404).json(false);
        }
        return res.status(200).json(true);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.validateUserID = validateUserID;
const postImage = (file, originalName) => {
    if (!file)
        return undefined;
    const uniqueName = `${(0, uuid_1.v4)()}${path_1.default.extname(originalName || "image.png")}`;
    const uploadPath = path_1.default.join("uploads/users", uniqueName);
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
const deleteImage = (imagePath) => {
    try {
        const fullPath = path_1.default.resolve(imagePath);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
            return true;
        }
        return false;
    }
    catch (err) {
        console.error("Error deleting image:", err);
        return false;
    }
};
exports.deleteImage = deleteImage;
const recoverPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json("No todos los campos contienen un valor");
        }
        const UserAux = yield Users_1.default.scope("withAll").findOne({
            where: { email: email },
        });
        if (UserAux) {
            return res.json(UserAux);
        }
        else {
            return res.status(404).json({ message: "No se encontró el usuario" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.recoverPassword = recoverPassword;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json("No todos los campos contienen un valor");
        }
        const userAux = yield loginCheck(email, password);
        if (userAux != null) {
            createCookies(userAux, res);
            return res.status(200).json({ message: "successfully logged in" });
        }
        else {
            return res
                .status(401)
                .json({ message: "El email o la contraseña es incorrecto" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.login = login;
function createCookies(userValidated, res) {
    const access_token = jsonwebtoken_1.default.sign({
        id: userValidated.id,
        fullName: userValidated.fullName,
        email: userValidated.email,
        phone: userValidated.phone,
        userID: userValidated.userID,
        status: userValidated.status,
        profileImage: userValidated.profileImage,
    }, config_1.SECRET_JWT_KEY, {
        expiresIn: "1h",
    });
    const refresh_token = jsonwebtoken_1.default.sign({
        id: userValidated.id,
        fullName: userValidated.fullName,
        email: userValidated.email,
        phone: userValidated.phone,
        userID: userValidated.userID,
        status: userValidated.status,
        profileImage: userValidated.profileImage,
    }, config_1.SECRET_JWT_KEY, {
        expiresIn: "1d",
    });
    res.cookie("access_token", access_token, {
        path: "/",
        httpOnly: true,
        secure: true, ///process.env.NODE_ENV == 'production',
        sameSite: "none",
        domain: config_1.DOMAIN,
        maxAge: 1000 * 60 * 60,
    });
    res.cookie("refresh_token", refresh_token, {
        path: "/",
        httpOnly: true,
        secure: true, ///process.env.NODE_ENV == 'production',
        sameSite: "none",
        domain: config_1.DOMAIN,
        maxAge: 1000 * 60 * 60 * 24,
    });
}
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        if (token) {
            res.cookie("refresh_token", "", {
                path: "/",
                httpOnly: true,
                secure: true, ///process.env.NODE_ENV == 'production',
                sameSite: "none",
                domain: config_1.DOMAIN,
                maxAge: 0,
            });
            res.cookie("access_token", "", {
                path: "/",
                httpOnly: true,
                secure: true, ///process.env.NODE_ENV == 'production',
                sameSite: "none",
                domain: config_1.DOMAIN,
                maxAge: 0,
            });
            return res.status(200).json({ message: "Logged out" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.logout = logout;
const validatePasswordModal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedUser = yield getUserLogged(req);
    if (!loggedUser) {
        return res.json(false);
    }
    const { password } = req.body;
    if (!password) {
        return res.json(false);
    }
    try {
        const userAux = yield Users_1.default.scope("withAll").findByPk(loggedUser.id);
        if (!userAux) {
            return res.json(false);
        }
        const userPass = userAux.getDataValue("password");
        if (password !== userPass) {
            return res.json(false);
        }
        return res.json(true);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.validatePasswordModal = validatePasswordModal;
function loginCheck(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield Users_1.default.scope("withAll").findOne({
                where: { email: email, status: "active" },
            });
            let userAux = new Users_2.User("", "", "", "", "", "", UserStatus_1.UserStatus.ACTIVE);
            if (user != null) {
                userAux = user.toJSON();
                let access = password === userAux.password; //await bcrypt.compare(password, userAux.password);
                if (access) {
                    return userAux;
                }
                else {
                    return null;
                }
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
function getUserLogged(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let access = req.cookies["access_token"];
        let user = new Users_2.User("", "", "", "", "", "", UserStatus_1.UserStatus.ACTIVE);
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
        let user = new Users_2.User("", "", "", "", "", "", UserStatus_1.UserStatus.ACTIVE);
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
