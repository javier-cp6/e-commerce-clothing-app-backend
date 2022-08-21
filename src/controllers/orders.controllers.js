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
          id: product.prod_id,
          title: product.prod_name,
          picture_url: product.prod_img,
          currency_id: "USD",
          unit_price: +product.prod_price,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color
        }
      })
    )

    const preference = await mercadopago.preferences.create({
      auto_return: "approved", 
      back_urls: {
        success: "https://cod-dwf-custom-clothing-app.vercel.app",
        failure: "https://cod-dwf-custom-clothing-app.vercel.app/cart",
        pending: "https://cod-dwf-custom-clothing-app.vercel.app",
      },
      payer: {
        name: user.name,
        surname: user.lastname,
        email: "test_user_63274575@testuser.com",
        // TODO add address
        // address: {
        //   street_name: user.direcciones[0]?.calle,
        //   street_number: +user.direcciones[0]?.numero,
        //   zip_code: "04002",
        // },
      },
      items: orderItems,
      notification_url: process.env.MP_NOTIFICATION_URL, 
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
      message: "Order placed sucessfully. Payment link:",
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