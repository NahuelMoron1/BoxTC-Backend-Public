import { Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { v4 as UUIDV4 } from "uuid";
import { SECRET_JWT_KEY } from "../models/config";
import { UserStatus } from "../models/enums/UserStatus";
import News from "../models/mysql/News";
import { User } from "../models/Users";

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await News.findAll({
      where: { approved: true },
      order: [["date", "DESC"]],
    });

    if (!news) {
      return res.status(404).json({ message: "No news found" });
    }

    return res.json(news);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const getMyNews = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    if (!userID || typeof userID !== "string") {
      return res.status(400).json({ message: "Bad request" });
    }

    const user = await getUserLogged(req);

    if (!user || user.id !== userID) {
      return res.status(401).json({ message: "You're not allowed to be here" });
    }

    const news = await News.findAll({
      where: { userID: userID },
      order: [["date", "DESC"]],
    });

    if (!news) {
      return res.status(404).json({ message: "No news found" });
    }

    return res.json(news);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const { id, allowed } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "No ID provided correctly" });
    }

    const whereConditions: any = { id };

    if (!allowed) {
      whereConditions.approved = true;
    }

    const article = await News.scope("withAll").findOne({
      where: whereConditions,
    });

    if (!article) {
      return res.status(404).json({ message: "No article found" });
    }

    return res.json(article);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const user = await getUserLogged(req);

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

    const imageUrl = postImage(file);
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

    await News.create(article);
    return res.status(200).json({ message: "Article created successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const editArticle = async (req: Request, res: Response) => {
  try {
    const user = await getUserLogged(req);

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
    var imageUrl: string | undefined = "";
    if (file) {
      imageUrl = postImage(file);
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

    await News.update(
      {
        title: article.title,
        summary: article.summary,
        image: article.image,
        author: article.author,
        date: article.date,
        text: article.text,
        approved: article.approved,
      },
      {
        where: { id: article.id },
      }
    );
    return res.status(200).json({ message: "Article updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

function validateArticle(articleData: any) {
  if (
    !articleData.id ||
    !articleData.title ||
    !articleData.summary ||
    !articleData.date ||
    !articleData.author
  ) {
    return false;
  }
  if (
    typeof articleData.title !== "string" ||
    typeof articleData.summary !== "string" ||
    typeof articleData.date !== "string" ||
    typeof articleData.author !== "string"
  ) {
    return false;
  }

  return true;
}

export const postImage = (
  file: Express.Multer.File | Buffer,
  originalName?: string
): string | undefined => {
  if (!file) return undefined;

  const uniqueName = `${UUIDV4()}${path.extname(originalName || "image.png")}`;
  const uploadPath = path.join("uploads/news", uniqueName);

  // 🔹 Si `file` es un Buffer (imagen procesada), lo guarda como un archivo
  if (file instanceof Buffer) {
    fs.writeFileSync(uploadPath, file as NodeJS.ArrayBufferView);
  } else {
    // 🔹 Si es un archivo Multer, guarda el buffer
    fs.writeFileSync(uploadPath, file.buffer as NodeJS.ArrayBufferView);
  }

  return uploadPath;
};

async function getUserLogged(req: Request) {
  let access = req.cookies["access_token"];
  let user: User = new User("", "", "", "", "", "", UserStatus.ACTIVE);
  if (access) {
    let userAux = await getToken(access);
    if (userAux) {
      user = userAux;
    }
    return user;
  }
  return undefined;
}

async function getToken(tokenAux: any) {
  let user: User = new User("", "", "", "", "", "", UserStatus.ACTIVE);
  try {
    const data = jwt.verify(tokenAux, SECRET_JWT_KEY);
    if (typeof data === "object" && data !== null) {
      user = data as User; // Casting si estás seguro que data contiene propiedades de User
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
