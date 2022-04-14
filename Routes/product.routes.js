import express from 'express';
const router = express.Router();
import {
  getProductbyId,
  getProducts,
} from '../Controllers/productController.js';

router.get('/', getProducts);
router.get('/:id', getProductbyId);

export { router };
