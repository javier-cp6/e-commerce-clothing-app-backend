import express from 'express';
import cors from "cors";
import { PrismaConnector } from "./prisma.js"
import { categoriesRouter } from './routes/categories.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { userRouter } from "./routes/users.routes.js";
import { shoppingCartRouter } from "./routes/shoppingCart.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
  integrator_id: process.env.MP_INTEGRATOR_ID,
});

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: [process.env.APP_URL, process.env.ADMIN_APP_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["accept", "authorization", "content-type"]
  })
)

app.use(express.json());

app.use(categoriesRouter);
app.use(productsRouter);
app.use(userRouter);
app.use(shoppingCartRouter);
app.use(paymentRouter);

app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
})