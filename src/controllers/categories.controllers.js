import { categoryRequestDTO } from "../dtos/categories.dtos.js";
import { PrismaConnector } from "../prisma.js";

export const getCategories = async (req, res)=> {
  try {
    const categories = await PrismaConnector.category.findMany();
    return res.json({
      message: null,
      result: categories
    })
  } catch (error) {
    return res.json({
      message: 'Something went wrong',
      result: error.message
    })
  }
}

export const postCategory = async (req, res) => {
  try {
    const data = categoryRequestDTO(req.body)
    const result = await PrismaConnector.category.create({ data })
    return res.status(201).json({
      message: "Category created successfully",
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong while creating category",
      result: error.message
    })
  }
}