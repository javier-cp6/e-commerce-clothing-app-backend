import { Router } from "express";
import { 
  getItems, 
  postItem,
  deleteItem, 
  updateItem,
} from "../controllers/carts.controllers.js";
import { validateToken } from "../utils/tokenvalidator.js";

export const cartsRouter = Router()

cartsRouter
  .route("/cart")
  .all(validateToken)
  .get(getItems)
  .post(postItem)
  .delete(deleteItem)

cartsRouter
  .route("/cart/:itemId")
  .all(validateToken)
  .delete(deleteItem)
  .put(updateItem)