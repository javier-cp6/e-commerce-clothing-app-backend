import _ from "lodash";
import jwt from "jsonwebtoken";
import { PrismaConnector } from "../prisma.js";

export const checkToken = async (req, res, next) => {
  // valido que me envie los headers de authorization
  if (_.isNil(req.headers.authorization)) {
    return res.status(401).json({
      message: "Se necesita una token para realizar esta peticion",
      result: null,
    });
  }

  // en el header de authorization me llegara la siguiente informacion: Bearer xxx.xxx.xxx
  const token = req.headers.authorization.split(" ")[1];
  if (_.isNil(token)) {
    return res.status(401).json({
      message: "Formato de token no valido",
      result: null,
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // {id: 'asdasdasd'}
    const user = await PrismaConnector.User.findFirstOrThrow({
      where: {
        user_id: payload.id
      }
    })
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token Invalido",
      result: error.message,
    });
  }
};
