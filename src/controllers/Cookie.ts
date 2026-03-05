import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DOMAIN, SECRET_JWT_KEY } from "../models/config";
import { User } from "../models/Users";

export const tokenExist = (req: Request, res: Response) => {
  const { cookieName } = req.params;
  const token = req.cookies[cookieName];
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    if (token) {
      return res.json(true); // Usamos return para evitar que siga ejecutando código
    } else {
      return res.json(false); // Usamos return para evitar que siga ejecutando código
    }
  } else {
    try {
      const data = jwt.verify(refreshToken, SECRET_JWT_KEY);
      if (typeof data === "object" && data !== null) {
        const userValidated: User = data as User; // Casting si estás seguro que data contiene propiedades de User
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
          { expiresIn: "1h" }
        );

        res.cookie("access_token", access_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          domain: DOMAIN,
          sameSite: "none",
          maxAge: 1000 * 60 * 60,
        });
        return res.json(true); // Usamos return para evitar que siga ejecutando código
      } else {
        return res.status(401).send("Acceso denegado"); // Enviamos respuesta y detenemos la ejecución
      }
    } catch (error) {
      return res.status(401).send("acceso denegado"); // Enviamos respuesta en caso de error y detenemos la ejecución
    }
  }
};

export const getToken = (req: Request, res: Response) => {
  const { cookieName } = req.params;
  const token = req.cookies[cookieName];

  if (!token) {
    return res.json(false); // Usamos return para detener la ejecución
  } else {
    try {
      const data = jwt.verify(token, SECRET_JWT_KEY);
      if (typeof data === "object" && data !== null) {
        const user: User = data as User; // Casting si estás seguro que data contiene propiedades de User
        return res.json(user); // Enviamos la respuesta y terminamos la ejecución
      } else {
        return res.status(401).send("Acceso denegado"); // Enviamos respuesta de error y detenemos la ejecución
      }
    } catch (error) {
      return res.status(401).send("acceso denegado"); // Enviamos respuesta de error en caso de excepción
    }
  }
};

export const returnToken = (req: Request, res: Response) => {
  const { cookieName } = req.params;
  const token = req.cookies[cookieName];

  if (!token) {
    return res.json(false);
  } else {
    res.json(token);
  }
};
