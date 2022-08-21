import axios from "axios";
import mercadopago from "mercadopago";
import { PrismaConnector } from "../prisma.js";

export const createUserTest = async (req, res) => {
  try {
    const base_url = "https://api.mercadopago.com";
    const body = req.body;
    const test_user = await axios.post(`${base_url}/users/test_user`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    return res.status(200).json({
      message: "El usuario de prueba se creo exitosamente",
      result: test_user.data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      result: null,
    });
  }
};

export const createPayment = async (req, res) => {
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

  if (shoppingCartDetail.length === 0) {
    return res.status(400).json({
      message: "No se puede crear un pago porque el shoppingCart esta vacio",
    });
  }

  const items = await Promise.all(
    shoppingCartDetail.map(async (detalle) => {
      const productFound = await PrismaConnector.product.findFirst({
          where: {
            prod_id: detalle.productId
          } 
        });
      return {
        id: productFound.prod_id,
        title: productFound.prod_name,
        picture_url: productFound.prod_img,
        quantity: detalle.quantity,
        currency_id: "PEN",
        unit_price: Number(productFound.prod_price),
      };
    })
  );
  const preferencia = await mercadopago.preferences.create({
    auto_return: "approved", // esto redireccionara automaticamente cuando el pago sea aprobado,
    back_urls: {
      success: "http://www.google.com", // la url si el pago es exitoso se hara el redireccionamiento
      failure: "http://www.tecsup.edu.pe", // si el pago no fue exitosoa se hara el rediccionamiento
      pending: "http://www.example.com", // si aun no se realizo el pago por que fue seleccionada la opcion de pago contra entrega o PagoEfectivo
    },
    payer: {
      name: user.fullName,
      surname: user.lastName,
      email: "test_user_2297415@testuser.com",
      address: {
        street_name: "test",
        street_number: 132,
        zip_code: "04002",
      },
    },
    items,
    notification_url:
      "https://384a-190-236-76-55.ngrok.io/mercado-pago-notificaciones", // colocamos la url en la cual mercado pago va a enviar la informacion en tiempo real sobre esta preferencia , mercado pago la conoce como IPN (Instant Payment Notification)
  });
  await PrismaConnector.shoppingCartDetail.deleteMany({
    where: {
      shoppingCartCart_id: shoppingCart.cart_id
    }
  });

  // metodo basico
  let total = 0;
  items.forEach((item) => {
    total += item.quantity * item.unit_price;
  });

  return res.json({
    message: "Pago creado",
    result: preferencia,
  });
};