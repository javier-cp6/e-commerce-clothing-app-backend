import { PrismaConnector } from "../prisma.js";
import { productRequestDTO } from "../dtos/products.dtos.js";

export const getProducts = async (req, res) => {
  try {
    const {id} = req.params;
    const result = await PrismaConnector.product.findMany({
      where: {categoryId: +id}
    });
    return res.json(result)
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong while getting products',
      result: error.message
    })
  }
}

export const postProduct = async (req, res) => {
  try {
    const data = productRequestDTO(req.body)
    console.log(data)
    const result = await PrismaConnector.product.create({data})
    return res.status(201).json({
      message:"Product created successfully",
      result,
    })
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong while creating product",
      result: error.message
    })
  }
}