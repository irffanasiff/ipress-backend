import asyncHandler from "express-async-handler";
import Product from "../Models/product.model.js";
import Order from "../Models/order.model.js";
//@desc fetch all users order
//@route GET /api/orders
//@access Private
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const order = new Order({ ...req.body });
    const createdOrder = await order.save();
    order.orderItems.map(({ product }) => {
      Product.findByIdAndUpdate(
        product,
        { isOrdered: true },
        function (err, docs) {
          if (err) {
            console.log(err);
          }
        }
      );
    });

    res.status(201).json(createdOrder);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
});
