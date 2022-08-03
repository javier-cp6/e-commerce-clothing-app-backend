import { Router } from "express";
import { getCategories, postCategory } from "../controllers/categories.controllers.js";

export const categoriesRouter = Router()

categoriesRouter
  .route("/categories")
  .get(getCategories)
  .post(postCategory)

