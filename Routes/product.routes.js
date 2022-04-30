import express from "express";
const router = express.Router();
import {
  addProduct,
  deleteProduct,
  getProductbyId,
  getProducts,
} from "../Controllers/productController.js";
import protect from "../Middleware/auth.middleware.js";

router.route("/").get(protect, getProducts).post(protect, addProduct);
router
  .route("/:id")
  .get(protect, getProductbyId)
  .delete(protect, deleteProduct);
export { router };
