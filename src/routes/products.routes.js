import { Router } from "express";
import { 
  getProducts, 
  postProduct 
} from "../controllers/products.controllers.js";

export const productsRouter = Router()

productsRouter
  .route("/categories/:id/products")
  .get(getProducts)
  .post(postProduct)
