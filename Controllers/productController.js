import asyncHandler from "express-async-handler";
import Product from "../Models/product.model.js";

//@desc fetch all users products by order
//@route GET /api/products
//@access Private
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id, isOrdered: false });
  res.status(200).json(products);
});

export const addProduct = asyncHandler(async (req, res) => {
  const product = new Product({ ...req.body, user: req.user.id });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(200).json({ error: "No product found" });
    else if (product.user.equals(req.user._id)) {
      await product.delete();
      res.status(204).json({ success: "Product deleted" });
    }
  } catch (e) {
    console.log(e);
  }
});
//@desc fetch a product by id
//@route GET /api/products/:id
//@access Public
export const getProductbyId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
