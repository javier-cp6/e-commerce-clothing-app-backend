import { Router } from "express";
import { 
  getProducts, 
  postProduct,
  updateProduct 
} from "../controllers/products.controllers.js";

export const productsRouter = Router()

productsRouter
  .route("/categories/:id/products")
  .get(getProducts)
  .post(postProduct)

productsRouter
  .route("/categories/:catId/products/:prodId")
  .put(updateProduct)