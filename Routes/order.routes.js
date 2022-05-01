import express from "express";
import { createOrder, getOrders } from "../Controllers/orderController.js";
const router = express.Router();

import protect from "../Middleware/auth.middleware.js";

router.route("/").get(protect, getOrders).post(protect, createOrder);
/* router
  .route("/:id")
  .get(protect, getOrderbyId) */
export { router };
