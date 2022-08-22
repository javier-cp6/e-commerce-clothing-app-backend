import mercadopago from "mercadopago";
import { PrismaConnector } from "../prisma.js";

export const placeOrder = async (req, res) => {
  try {
    const { user }  = req;
    const cart = await PrismaConnector.cart.findFirst({
      where: {userId: user.id},
      include: {
        cartItems: true
      }
    })
    
    if (cart.cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = await Promise.all(
      cart.cartItems.map(async (cartItem)=> {
        const product = await PrismaConnector.product.findUnique({
          where: {prod_id: cartItem.productId }
        })
        return {
          // id: product.prod_id,
          id: +process.env.MP_TEST_PROD_ID,
          title: product.prod_name,
          picture_url: product.prod_img,
          currency_id: "USD",
          unit_price: +product.prod_price,
          // quantity: cartItem.quantity,
          quantity:1,
          size: cartItem.size,
          color: cartItem.color,
          description: "Dispositivo móvil de Tienda e-commerce", 
        }
      })
    )

    const preference = await mercadopago.preferences.create({
      auto_return: "approved", 
      back_urls: {
        success: "https://cod-dwf-custom-clothing-app.vercel.app",
        failure: "https://cod-dwf-custom-clothing-app.vercel.app/cart",
        pending: "https://cod-dwf-custom-clothing-app.vercel.app/favs",
      },
      payer: {
        name: user.name,
        surname: user.lastname,
        email: process.env.MP_TEST_USER_EMAIL,
        address: {
          street_name: process.env.MP_TEST_USER_STREET,
          street_number: +process.env.MP_TEST_USER_ST_NUMBER,
          zip_code: process.env.MP_TEST_USER_ZIPCODE,
        },
        phone: {
          area_code: process.env.MP_TEST_USER_AREA_CODE,
          number: +process.env.MP_TEST_USER_PHONE,
        },
      },
      items: orderItems,
      notification_url: process.env.MP_NOTIFICATION_URL, 
      external_reference: "javiercastillopena@gmail.com",
      payment_methods: {
        excluded_payment_methods: [
          { "id": "visa" }
        ],
        installments: 6
      },
    });

    // Empty cart
    await PrismaConnector.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    let total = 0;
    total = orderItems.reduce((prevVal, curVal) => {
      return prevVal + curVal.quantity * curVal.unit_price;
    }, 0);

    await PrismaConnector.order.create({
      data: { 
        total,
        status: "CREATED",
        mpPreferenceId: preference.body.id,
        userId: user.id,
      }
    })

    return res.json({
      message: `Order placed sucessfully. Payment link: ${preference.body.init_point}`,
      content: preference,
    });

  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: error.message,
      result: null,
    });
  }
};

export const mercadoPagoNotifications = async (req, res) => {
  try {
    if (req.query.topic && req.query.topic === "merchant_order") {
      const { id } = req.query;
      const merchant_order = await mercadopago.merchant_orders.get(id);

      const order = await PrismaConnector.order.findFirst({
        where: { mpPreferenceId: merchant_order.body.preference_id}
      })

      if (order) {
        order.mpMerchantOrderId = merchant_order.body.id;
        const payment = merchant_order.body.payments[0];
        if (payment && payment.status === "approved") {
          order.status = "PAID";
        }
        if (payment && payment.status === "pending") {
          order.status = "PENDING";
        }
        if (payment && payment.status === "rejected") {
          order.status = "FAILED";
        }

        await PrismaConnector.order.update({
          where: { id: order.id},
          data: {
            status: order.status,
            mpMerchantOrderId: order.mpMerchantOrderId.toString(), 
          },
        })
  
      } else {
        // TODO send email to admin
        console.log(
          `Order with preference id ${merchant_order.body.preference_id} was not found in DB`
        );
      }
    }
    return res.status(200).send();
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: error.message
    })
  }
};