import express from 'express';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './Config/db.js';
import { notFound, errorHandler } from './Middleware/error.middleware.js';
import { router as ProductRouter } from './Routes/product.routes.js';
import { router as UserRouter } from './Routes/user.routes.js';
import { router as OrderRouter } from './Routes/order.routes.js';
import { router as ItemRouter } from './Routes/item.routes.js';
import cloudinaryApi from './Utils/cloudinaryApi.js';

export const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
dotenv.config();
connectDB();

app.get('/hello', (req, res) => {
  res.send('Hello From the server');
});

app.use('/api/products', ProductRouter);
app.use('/api/user', UserRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/items', ItemRouter);

app.use('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.get('/api/images', (req, res) => {
  const file = req.query.folder;
  try {
    cloudinaryApi.search
      .expression(`folder="IPRESS/${file}"`)
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute()
      .then((result) => res.send(result));
  } catch (err) {
    res.status(404).send({ error: err });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(
  process.env.PORT || 5000,
  console.log('🖥  Server running on port 5000'.blue.bold)
);
