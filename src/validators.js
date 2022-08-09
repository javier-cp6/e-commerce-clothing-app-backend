import { PrismaConnector } from "./prisma.js"

export const validateCategoryId = async (req, res, next) => {
  try {
    const {catId, prodId} = req.params
    const product = await PrismaConnector.product.findFirstOrThrow({
      where: {
        prod_id: +prodId
      }
    })
    if(product.categoryId === +catId) {
      next()
    } else {
      throw new Error("Category id didn't match product")
    }
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong while fetching product data",
      content: error.message
    })
  }
}
