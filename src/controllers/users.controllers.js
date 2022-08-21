import { userRequestDTO, loginRequestDTO } from "../dtos/users.dtos.js";
import { PrismaConnector } from "../prisma.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    let data = userRequestDTO(req.body);
    // otra forma de guardar un registro en un modelo usando un constructor de clase
    data.password = bcryptjs.hashSync(data.password, 10);
    const result = await PrismaConnector.User.create({ data })
    const { password, ...resultado } = result;
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      result: resultado,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      result: null,
    });
  }
};

export const login = async (req, res) => {
  try {
    const data = loginRequestDTO(req.body);
    const userFound = await PrismaConnector.User.findFirstOrThrow({
      where: {
        email: data.email
      }
    });
    if (!userFound) {
      return res.status(200).json({
        message: "Usuario no existe",
        result: null,
      });
    } else {
      if (bcryptjs.compareSync(data.password, userFound.password)) {
        const token = jwt.sign(
          {
            id: userFound.user_id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          message: "Usuario existe",
          token: token,
        });
      } else {
        return res.status(400).json({
          message: "Usuario no existe, bad password",
          result: null,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      result: null,
    });
  }
};
