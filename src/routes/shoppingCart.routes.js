import { Router } from "express";
import { createShoppingCart, listShoppingCart } from "../controllers/shoppingCart.controller.js";
import { checkToken } from "../middleware/validatorToken.js";

export const shoppingCartRouter = Router();

shoppingCartRouter
  .route("/cart")
  .all(checkToken)
  .post(createShoppingCart)
  .get(listShoppingCart);
