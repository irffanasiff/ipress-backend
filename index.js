import express from 'express';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './Config/db.js';
import { notFound, errorHandler } from './Middleware/error.middleware.js';
import { router as ProductRouter } from './Routes/product.routes.js';
import { router as UserRouter } from './Routes/user.routes.js';

export const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
connectDB();

app.get('/hello', (req, res) => {
  res.send('Hello From the server');
});

app.use('/api/products', ProductRouter);
app.use('/api/user', UserRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(5000, console.log('🖥  Server running on port 5000'.blue.bold));
