import { shoppingCartRequestDTO } from "../dtos/shoppingCart.dtos.js";
import { PrismaConnector } from "../prisma.js";

export const createShoppingCart = async (req, res) => {
  try {
    const user = req.user;
    const dataProduct = shoppingCartRequestDTO(req.body);
    const shoppingCart = await PrismaConnector.shoppingCart.findFirst({
        where: {
          user_id: user.user_id
        }
      });

    if (shoppingCart) {
      const productUpdate = await PrismaConnector.shoppingCart.update({
        where: {
          user_id: user.user_id
        },
        data: {
          details:{
            create: {
              productId: dataProduct.productId,
              quantity: dataProduct.quantity
            }
          }
        }
      });

      return res.status(201).json({
        message: "Articulo agregado exitosamente",
        content: productUpdate,
      });
    } else {
      const newShoppingCart = await PrismaConnector.shoppingCart.create({
        data:{
          user_id: user.user_id,
          details:{
            create:{
              productId: dataProduct.productId,
              quantity: dataProduct.quantity
            }
          }
        }
      });

      return res.status(201).json({
        message: "Articulo agregado exitosamente",
        content: newShoppingCart,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      result: null,
    });
  }
};

export const listShoppingCart = async (req, res) => {
  try {
    // en base al req.user (objeto de usuario _id) hacer la busqueda del shoppingCart de ese usuario
    const { user } = req;
    const shoppingCart = await PrismaConnector.shoppingCart.findFirstOrThrow({
        where: {
          user_id: user.user_id
        }
      });
    const shoppingCartDetail = await PrismaConnector.shoppingCartDetail.findMany({
        where: {
          shoppingCartCart_id: shoppingCart.cart_id
        }
      });
    const details = await Promise.all(
      shoppingCartDetail.map(async (value) => {
        const productFound = await PrismaConnector.product.findFirst({
          where: {
            prod_id: value.productId
          } 
        });

        return {
          productoId: value.productoId,
          nombre: productFound.prod_name,
          precio: productFound.prod_price,
          imagen: productFound.prod_img,
          cantidad: value.quantity,
        };
      })
    );

    return res.json({
      result: { ...shoppingCart, details }, // reemplazar el detalle por el nuevo detalle con la info de los productos
      message: null,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      result: null,
    });
  }
};