import express from "express";
import {
  addItems,
  editItems,
  getItems,
} from "../Controllers/itemController.js";
const router = express.Router();

import protect from "../Middleware/auth.middleware.js";

router
  .route("/")
  .post(protect, addItems)
  .get(getItems)
  .patch(protect, editItems);

export { router };
