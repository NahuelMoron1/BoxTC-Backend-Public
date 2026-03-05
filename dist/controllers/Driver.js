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
exports.updateAllDriverFlags = void 0;
const Drivers_1 = __importDefault(require("../models/mysql/Drivers"));
// =================================================================
// 1. MAPA DE NACIONALIDADES (CORREGIDO)
// =================================================================
const nationalityToCode = {
    Dutch: "nl",
    "New Zealander": "nz",
    British: "gb",
    Italian: "it",
    Monegasque: "mc",
    Mexican: "mx",
    Thai: "th",
    Finnish: "fi",
    French: "fr",
    Chinese: "cn",
    American: "us",
    Australian: "au",
    Japanese: "jp", // Ya estaba mapeado para "Japanese"
    Japan: "jp", // ⬅️ ¡CORRECCIÓN AÑADIDA!
    Canadian: "ca",
    German: "de",
    Venezuelan: "ve",
    Spanish: "es",
    Russian: "ru",
    Polish: "pl",
    Austrian: "at",
    Brazilian: "br",
    Colombian: "co",
    Portuguese: "pt",
    Swiss: "ch",
    Belgian: "be",
    Swedish: "se",
    Chilean: "cl",
    "South African": "za",
    Indian: "in",
    Argentinian: "ar",
    Rhodesian: "zw",
    Liechtensteiner: "li",
    Irish: "ie",
    Malaysian: "my",
    Uruguayan: "uy",
    Hungarian: "hu",
    Danish: "dk",
    Czech: "cz",
    "East German": "de",
    Indonesian: "id",
};
const updateAllDriverFlags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drivers = yield Drivers_1.default.findAll();
        if (!drivers || drivers.length === 0) {
            return res.status(404).json({ message: "No drivers found to update" });
        }
        const updatePromises = drivers.map((driver) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const nationality = (_a = driver.getDataValue("nationality")) === null || _a === void 0 ? void 0 : _a.trim();
            const code = nationalityToCode[nationality] || "unknown";
            // 🚨 CÓDIGO DE ADVERTENCIA MODIFICADO 🚨
            if (code === "unknown") {
                // Usamos los nombres correctos de columna del CSV: 'firstname' y 'lastname'
                const firstname = driver.getDataValue("firstname");
                const lastname = driver.getDataValue("lastname");
                const driverId = driver.getDataValue("id"); // Usamos el ID como respaldo
                // Creamos un mensaje más claro para identificar al piloto
                const driverName = firstname && lastname
                    ? `${firstname} ${lastname}`
                    : `ID: ${driverId}`;
                console.log(`[WARN 🚩] Nacionalidad no mapeada encontrada: "${nationality}" para el piloto (${driverName}). Se asignará la ruta 'uploads/flags/unknown'.`);
            }
            // FIN DEL CÓDIGO DE ADVERTENCIA MODIFICADO
            const flagPath = `uploads/flags/${code}`;
            driver.setDataValue("flag", flagPath);
            return driver.save();
        }));
        yield Promise.all(updatePromises);
        return res.json({
            message: "Flags updated successfully",
            totalUpdated: drivers.length,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
});
exports.updateAllDriverFlags = updateAllDriverFlags;
