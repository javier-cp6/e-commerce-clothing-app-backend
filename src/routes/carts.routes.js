import { Router } from "express";
import { 
  getItems, 
  postItem, 
} from "../controllers/carts.controllers.js";
import { validateToken } from "../utils/tokenvalidator.js";

export const cartsRouter = Router()

cartsRouter
  .route("/cart")
  .all(validateToken)
  .get(getItems)
  .post(postItem)