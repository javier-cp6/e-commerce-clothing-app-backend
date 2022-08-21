import { Router } from "express";
import { 
  placeOrder, 
  mercadoPagoNotifications,
} from "../controllers/orders.controllers.js";
import { validateToken } from "../utils/tokenvalidator.js";

export const ordersRouter = Router()

ordersRouter.post("/place-order", validateToken, placeOrder)

ordersRouter.post("/mercado-pago-notifications", mercadoPagoNotifications);
