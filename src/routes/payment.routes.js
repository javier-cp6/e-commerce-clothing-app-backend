import { Router } from "express";
import {
  createUserTest,
  createPayment,
} from "../controllers/payments.controllers.js";

import { checkToken } from "../middleware/validatorToken.js";

export const paymentRouter = Router();

paymentRouter.route("/userTest").post(createUserTest);
paymentRouter.post("/create-payment", checkToken, createPayment);
