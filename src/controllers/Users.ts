import { Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { v4 as UUIDV4 } from "uuid";
import { DOMAIN, SECRET_JWT_KEY } from "../models/config";
import { UserStatus } from "../models/enums/UserStatus";
import Users from "../models/mysql/Users";
import { User } from "../models/Users";

export const getUserByName = async (req: Request, res: Response) => {
  try {
    const user = await getUserLogged(req);

    if (!user) {
      return res
        .status(401)
        .json({ message: "No tiene permiso para ver esta información" });
    }

    const { username } = req.params;
    const fullName = decodeURIComponent(username);
    const UserAux = await Users.findOne({ where: { fullName: fullName } });

    if (!UserAux) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }

    return res.json(UserAux);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const validateUserID = async (req: Request, res: Response) => {
  try {
    const user = await getUserLogged(req);

    if (!user) {
      return res.status(401).json(false);
    }

    const { userID } = req.params;
    const UserAux = await Users.findOne({
      where: { id: userID, status: UserStatus.ACTIVE },
    });

    if (!UserAux) {
      return res.status(404).json(false);
    }

    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const postImage = (
  file: Express.Multer.File | Buffer,
  originalName?: string
): string | undefined => {
  if (!file) return undefined;

  const uniqueName = `${UUIDV4()}${path.extname(originalName || "image.png")}`;
  const uploadPath = path.join("uploads/users", uniqueName);

  // 🔹 Si `file` es un Buffer (imagen procesada), lo guarda como un archivo
  if (file instanceof Buffer) {
    fs.writeFileSync(uploadPath, file as NodeJS.ArrayBufferView);
  } else {
    // 🔹 Si es un archivo Multer, guarda el buffer
    fs.writeFileSync(uploadPath, file.buffer as NodeJS.ArrayBufferView);
  }

  return uploadPath;
};

export const deleteImage = (imagePath: string): boolean => {
  try {
    const fullPath = path.resolve(imagePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }

    return false;
  } catch (err) {
    console.error("Error deleting image:", err);
    return false;
  }
};

export const recoverPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json("No todos los campos contienen un valor");
    }
    const UserAux = await Users.scope("withAll").findOne({
      where: { email: email },
    });
    if (UserAux) {
      return res.json(UserAux);
    } else {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("No todos los campos contienen un valor");
    }

    const userAux = await loginCheck(email, password);

    if (userAux != null) {
      createCookies(userAux, res);
      return res.status(200).json({ message: "successfully logged in" });
    } else {
      return res
        .status(401)
        .json({ message: "El email o la contraseña es incorrecto" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

function createCookies(userValidated: User, res: Response) {
  const access_token = jwt.sign(
    {
      id: userValidated.id,
      fullName: userValidated.fullName,
      email: userValidated.email,
      phone: userValidated.phone,
      userID: userValidated.userID,
      status: userValidated.status,
      profileImage: userValidated.profileImage,
    },
    SECRET_JWT_KEY,
    {
      expiresIn: "1h",
    }
  );

  const refresh_token = jwt.sign(
    {
      id: userValidated.id,
      fullName: userValidated.fullName,
      email: userValidated.email,
      phone: userValidated.phone,
      userID: userValidated.userID,
      status: userValidated.status,
      profileImage: userValidated.profileImage,
    },
    SECRET_JWT_KEY,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("access_token", access_token, {
    path: "/",
    httpOnly: true,
    secure: true, ///process.env.NODE_ENV == 'production',
    sameSite: "none",
    domain: DOMAIN,
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refresh_token", refresh_token, {
    path: "/",
    httpOnly: true,
    secure: true, ///process.env.NODE_ENV == 'production',
    sameSite: "none",
    domain: DOMAIN,
    maxAge: 1000 * 60 * 60 * 24,
  });
}

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.access_token;

    if (token) {
      res.cookie("refresh_token", "", {
        path: "/",
        httpOnly: true,
        secure: true, ///process.env.NODE_ENV == 'production',
        sameSite: "none",
        domain: DOMAIN,
        maxAge: 0,
      });

      res.cookie("access_token", "", {
        path: "/",
        httpOnly: true,
        secure: true, ///process.env.NODE_ENV == 'production',
        sameSite: "none",
        domain: DOMAIN,
        maxAge: 0,
      });
      return res.status(200).json({ message: "Logged out" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const validatePasswordModal = async (req: Request, res: Response) => {
  const loggedUser = await getUserLogged(req);
  if (!loggedUser) {
    return res.json(false);
  }

  const { password } = req.body;

  if (!password) {
    return res.json(false);
  }

  try {
    const userAux = await Users.scope("withAll").findByPk(loggedUser.id);
    if (!userAux) {
      return res.json(false);
    }
    const userPass = userAux.getDataValue("password");

    if (password !== userPass) {
      return res.json(false);
    }

    return res.json(true);
  } catch (error) {
    return res.status(500).json(error);
  }
};

async function loginCheck(email: string, password: string) {
  try {
    const user = await Users.scope("withAll").findOne({
      where: { email: email, status: "active" },
    });
    let userAux: User = new User("", "", "", "", "", "", UserStatus.ACTIVE);
    if (user != null) {
      userAux = user.toJSON() as User;
      let access = password === userAux.password; //await bcrypt.compare(password, userAux.password);
      if (access) {
        return userAux;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

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
