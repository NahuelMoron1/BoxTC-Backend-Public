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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../models/config");
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { to } = req.body;
    let { subject } = req.body;
    let { text } = req.body;
    let transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: config_1.NODEMAILER_USER,
            pass: config_1.NODEMAILER,
        },
    });
    let mailOptions = {
        from: config_1.NODEMAILER_USER, // Remitente
        to: to, // Destinatario
        subject: subject, // Asunto
        html: text, // Cuerpo del correo en texto plano
        ///html: html // Cuerpo del correo en formato HTML (opcional)
    };
    try {
        let info = yield transporter.sendMail(mailOptions);
        res.json(info);
    }
    catch (error) {
        res.status(404).json({ message: "Error on sending the mail" });
    }
});
exports.sendEmail = sendEmail;
