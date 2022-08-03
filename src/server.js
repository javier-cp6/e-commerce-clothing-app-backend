import express from 'express';
import { PrismaConnector } from "./prisma.js"
import { categoriesRouter } from './routes/categories.routes.js';
import { productsRouter } from './routes/products.routes.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// app.get("/categories", async (req, res) => {
//   try {
//     const result = await PrismaConnector.category.findMany();
//     console.log(result)
//     return res.json({
//       message: "Hi",
//       result
//     })
//   } catch (error) {
//     return res.status(400).json({
//       message: "Something went wrong",
//       result: error.message
//     })
//   }
// })

app.use(categoriesRouter)
app.use(productsRouter)

app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
})