import asyncHandler from 'express-async-handler';
import Product from '../Models/product.model.js';
import Order from '../Models/order.model.js';
import { sendEmail } from '../Utils/sendMail.js';
//@desc fetch all users order
//@route GET /api/orders
//@access Private
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    'orderItems.product'
  );
  res.status(200).json(orders);
});

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const order = new Order({ ...req.body.order });
    const createdOrder = await order.save();
    order.orderItems.map(({ product }, index) => {
      Product.findByIdAndUpdate(
        product,
        { isOrdered: true, fields: { ...req.body.cartItems[index].fields } },
        function (err, docs) {
          if (err) {
            console.log(err);
          }
        }
      );
    });
    const { cartItems } = req.body;
    const data = order.isPaid
      ? {
          id: order.paymentResult.id,
          date: order.paymentResult.update_time.split('T')[0],
          name: order.paymentResult.name,
          quantity: cartItems.length,
          price: order.itemsPrice,
          tax: order.taxPrice,
          total: order.totalPrice,
        }
      : {
          id: 'NOT PAID',
          date: new Date().split('T')[0],
          name: req.user.name,
          quantity: cartItems.length,
          price: order.itemsPrice,
          tax: order.taxPrice,
          total: order.totalPrice,
        };
    const adminData = {
      ...data,
      email: req.user.email,
      paid: order.isPaid ? 'Yes' : 'No',
      address: order.shippingAddress,
    };
    sendEmail('', 'order_paid', 'SUCCESSFULLY ORDERED!!', data);
    sendEmail(
      'namita_2020bece034@nitsri.net',
      'paid_admin',
      'NEW ORDER!!',
      data
    );
    res.status(201).json(createdOrder);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
});

export const editOrder = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const order = await Order.findByIdAndUpdate(req.body.id, {
      ...req.body.update,
    });
    res.status(201).json(order);
  } else {
    throw new Error('ADMIN PERMISSIONS REQUIRED!!');
  }
});
