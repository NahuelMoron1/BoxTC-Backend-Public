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
Object.defineProperty(exports, "__esModule", { value: true });
exports.surrender = exports.guessAll = exports.guessOne = exports.getGameData = void 0;
const associations_1 = require("../models/mysql/associations");
const getGameData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const today = new Date().toISOString().split("T")[0];
        const challenge = yield associations_1.GuessPodiums.findOne({
            where: { date: today },
            include: [
                {
                    model: associations_1.Drivers,
                    as: "FirstDriver",
                    attributes: ["image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "SecondDriver",
                    attributes: ["image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "ThirdDriver",
                    attributes: ["image"],
                },
                {
                    model: associations_1.Brands,
                    as: "FirstCar",
                    attributes: ["image"],
                },
                {
                    model: associations_1.Brands,
                    as: "SecondCar",
                    attributes: ["image"],
                },
                {
                    model: associations_1.Brands,
                    as: "ThirdCar",
                    attributes: ["image"],
                },
            ],
        });
        if (!challenge) {
            return res
                .status(404)
                .json({ message: "No guess podium challenge for today" });
        }
        const plainChallenge = challenge.get({ plain: true });
        const response = {
            id: plainChallenge.id,
            title: plainChallenge.title,
            date: plainChallenge.date,
            firstDriverImage: (_a = plainChallenge.FirstDriver) === null || _a === void 0 ? void 0 : _a.image,
            secondDriverImage: (_b = plainChallenge.SecondDriver) === null || _b === void 0 ? void 0 : _b.image,
            thirdDriverImage: (_c = plainChallenge.ThirdDriver) === null || _c === void 0 ? void 0 : _c.image,
            firstCarImage: (_d = plainChallenge.FirstCar) === null || _d === void 0 ? void 0 : _d.image,
            secondCarImage: (_e = plainChallenge.SecondCar) === null || _e === void 0 ? void 0 : _e.image,
            thirdCarImage: (_f = plainChallenge.ThirdCar) === null || _f === void 0 ? void 0 : _f.image,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getGameData = getGameData;
const guessOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, position, id } = req.body;
        console.log("TYPE: ", type);
        console.log("POSITION: ", position);
        console.log("ID: ", id);
        if (!type ||
            !position ||
            !id ||
            typeof type !== "string" ||
            typeof position !== "string" ||
            typeof id !== "string") {
            return res.status(400).json({ message: "Bad request" });
        }
        const today = new Date().toISOString().split("T")[0];
        const gamedata = yield associations_1.GuessPodiums.findOne({
            where: { date: today },
            include: [
                {
                    model: associations_1.Drivers,
                    as: "FirstDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "SecondDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "ThirdDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "FirstCar",
                    attributes: ["name", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "SecondCar",
                    attributes: ["name", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "ThirdCar",
                    attributes: ["name", "image"],
                },
            ],
        });
        if (!gamedata) {
            return res.status(404).json({ message: "No game found today" });
        }
        let guessed = false;
        let data = null;
        // Según el tipo (driver o car) y la posición (1, 2, 3), validar
        switch (type) {
            case "driver":
                if (position === "first") {
                    guessed = id === gamedata.getDataValue("first_place_driver_id");
                    if (guessed) {
                        const driver = gamedata.getDataValue("FirstDriver");
                        data = {
                            name: driver.firstname + " " + driver.lastname,
                            image: driver.image,
                        };
                    }
                }
                else if (position === "second") {
                    guessed = id === gamedata.getDataValue("second_place_driver_id");
                    if (guessed) {
                        const driver = gamedata.getDataValue("SecondDriver");
                        data = {
                            name: driver.firstname + " " + driver.lastname,
                            image: driver.image,
                        };
                    }
                }
                else if (position === "third") {
                    guessed = id === gamedata.getDataValue("third_place_driver_id");
                    if (guessed) {
                        const driver = gamedata.getDataValue("ThirdDriver");
                        data = {
                            name: driver.firstname + " " + driver.lastname,
                            image: driver.image,
                        };
                    }
                }
                break;
            case "car":
                if (position === "1") {
                    guessed = id === gamedata.getDataValue("first_place_car_id");
                    if (guessed) {
                        const brand = gamedata.getDataValue("FirstCar");
                        data = {
                            name: brand.name,
                            image: brand.image,
                        };
                    }
                }
                else if (position === "2") {
                    guessed = id === gamedata.getDataValue("second_place_car_id");
                    if (guessed) {
                        const brand = gamedata.getDataValue("SecondCar");
                        data = {
                            name: brand.name,
                            image: brand.image,
                        };
                    }
                }
                else if (position === "3") {
                    guessed = id === gamedata.getDataValue("third_place_car_id");
                    if (guessed) {
                        const brand = gamedata.getDataValue("ThirdCar");
                        data = {
                            name: brand.name,
                            image: brand.image,
                        };
                    }
                }
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        if (!guessed) {
            return res.status(200).json({ message: "Incorrect Guess" });
        }
        return res.status(200).json({ data });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.guessOne = guessOne;
const guessAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstDriverID, secondDriverID, thirdDriverID } = req.body;
        if (!firstDriverID || !secondDriverID || !thirdDriverID) {
            return res.status(400).json({ message: "Bad request" });
        }
        const today = new Date().toISOString().split("T")[0];
        const gamedata = yield associations_1.GuessPodiums.findOne({
            where: { date: today },
            include: [
                {
                    model: associations_1.Drivers,
                    as: "FirstDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "SecondDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "ThirdDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "FirstCar",
                    attributes: ["name", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "SecondCar",
                    attributes: ["name", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "ThirdCar",
                    attributes: ["name", "image"],
                },
            ],
        });
        if (!gamedata) {
            return res.status(404).json({ message: "No game found today" });
        }
        const firstDriver = firstDriverID === gamedata.getDataValue("first_place_driver_id");
        const secondDriver = secondDriverID === gamedata.getDataValue("second_place_driver_id");
        const thirdDriver = thirdDriverID === gamedata.getDataValue("third_place_driver_id");
        const gameWon = firstDriver && secondDriver && thirdDriver;
        return res.status(200).json({
            gameWon,
            gamedata,
            firstDriver,
            secondDriver,
            thirdDriver,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.guessAll = guessAll;
const surrender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date().toISOString().split("T")[0];
        const gamedata = yield associations_1.GuessPodiums.findOne({
            where: { date: today },
            include: [
                {
                    model: associations_1.Drivers,
                    as: "FirstDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "SecondDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Drivers,
                    as: "ThirdDriver",
                    attributes: ["firstname", "lastname", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "FirstCar",
                    attributes: ["name", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "SecondCar",
                    attributes: ["name", "image"],
                },
                {
                    model: associations_1.Brands,
                    as: "ThirdCar",
                    attributes: ["name", "image"],
                },
            ],
        });
        if (!gamedata) {
            return res.status(404).json({ message: "No game found today" });
        }
        return res.status(200).json({ gamedata });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.surrender = surrender;
