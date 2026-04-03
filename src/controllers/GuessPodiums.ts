import { Request, Response } from "express";
import { Brands, Drivers, GuessPodiums } from "../models/mysql/associations";

export const getGameData = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const challenge = await GuessPodiums.findOne({
      where: { date: today },
      include: [
        {
          model: Drivers,
          as: "FirstDriver",
          attributes: ["image"],
        },
        {
          model: Drivers,
          as: "SecondDriver",
          attributes: ["image"],
        },
        {
          model: Drivers,
          as: "ThirdDriver",
          attributes: ["image"],
        },
        {
          model: Brands,
          as: "FirstCar",
          attributes: ["image"],
        },
        {
          model: Brands,
          as: "SecondCar",
          attributes: ["image"],
        },
        {
          model: Brands,
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
      firstDriverImage: plainChallenge.FirstDriver?.image,
      secondDriverImage: plainChallenge.SecondDriver?.image,
      thirdDriverImage: plainChallenge.ThirdDriver?.image,
      firstCarImage: plainChallenge.FirstCar?.image,
      secondCarImage: plainChallenge.SecondCar?.image,
      thirdCarImage: plainChallenge.ThirdCar?.image,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const guessOne = async (req: Request, res: Response) => {
  try {
    const { type, position, id } = req.body;

    if (
      !type ||
      !position ||
      !id ||
      typeof type !== "string" ||
      typeof position !== "string" ||
      typeof id !== "string"
    ) {
      return res.status(400).json({ message: "Bad request" });
    }

    const today = new Date().toISOString().split("T")[0];
    const gamedata = await GuessPodiums.findOne({
      where: { date: today },
      include: [
        {
          model: Drivers,
          as: "FirstDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Drivers,
          as: "SecondDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Drivers,
          as: "ThirdDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Brands,
          as: "FirstCar",
          attributes: ["name", "image"],
        },
        {
          model: Brands,
          as: "SecondCar",
          attributes: ["name", "image"],
        },
        {
          model: Brands,
          as: "ThirdCar",
          attributes: ["name", "image"],
        },
      ],
    });

    if (!gamedata) {
      return res.status(404).json({ message: "No game found today" });
    }

    let guessed = false;
    let data: { name: string; image: string } | null = null;

    // Según el tipo (driver o car) y la posición (1, 2, 3), validar
    switch (type) {
      case "driver":
        if (position === "1") {
          guessed = id === gamedata.getDataValue("first_place_driver_id");
          if (guessed) {
            const driver = gamedata.getDataValue("FirstDriver");
            data = {
              name: driver.firstname + " " + driver.lastname,
              image: driver.image,
            };
          }
        } else if (position === "2") {
          guessed = id === gamedata.getDataValue("second_place_driver_id");
          if (guessed) {
            const driver = gamedata.getDataValue("SecondDriver");
            data = {
              name: driver.firstname + " " + driver.lastname,
              image: driver.image,
            };
          }
        } else if (position === "3") {
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
        } else if (position === "2") {
          guessed = id === gamedata.getDataValue("second_place_car_id");
          if (guessed) {
            const brand = gamedata.getDataValue("SecondCar");
            data = {
              name: brand.name,
              image: brand.image,
            };
          }
        } else if (position === "3") {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const guessAll = async (req: Request, res: Response) => {
  try {
    const { firstDriverID, secondDriverID, thirdDriverID } = req.body;

    if (!firstDriverID || !secondDriverID || !thirdDriverID) {
      return res.status(400).json({ message: "Bad request" });
    }

    const today = new Date().toISOString().split("T")[0];

    const gamedata = await GuessPodiums.findOne({
      where: { date: today },
      include: [
        {
          model: Drivers,
          as: "FirstDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Drivers,
          as: "SecondDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Drivers,
          as: "ThirdDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Brands,
          as: "FirstCar",
          attributes: ["name", "image"],
        },
        {
          model: Brands,
          as: "SecondCar",
          attributes: ["name", "image"],
        },
        {
          model: Brands,
          as: "ThirdCar",
          attributes: ["name", "image"],
        },
      ],
    });

    if (!gamedata) {
      return res.status(404).json({ message: "No game found today" });
    }

    const firstDriver: boolean =
      firstDriverID === gamedata.getDataValue("first_place_driver_id");
    const secondDriver: boolean =
      secondDriverID === gamedata.getDataValue("second_place_driver_id");
    const thirdDriver: boolean =
      thirdDriverID === gamedata.getDataValue("third_place_driver_id");

    const gameWon: boolean = firstDriver && secondDriver && thirdDriver;

    return res.status(200).json({
      gameWon,
      gamedata,
      firstDriver,
      secondDriver,
      thirdDriver,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const surrender = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const gamedata = await GuessPodiums.findOne({
      where: { date: today },
      include: [
        {
          model: Drivers,
          as: "FirstDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Drivers,
          as: "SecondDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Drivers,
          as: "ThirdDriver",
          attributes: ["firstname", "lastname", "image"],
        },
        {
          model: Brands,
          as: "FirstCar",
          attributes: ["name", "image"],
        },
        {
          model: Brands,
          as: "SecondCar",
          attributes: ["name", "image"],
        },
        {
          model: Brands,
          as: "ThirdCar",
          attributes: ["name", "image"],
        },
      ],
    });

    if (!gamedata) {
      return res.status(404).json({ message: "No game found today" });
    }

    return res.status(200).json({ gamedata });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
