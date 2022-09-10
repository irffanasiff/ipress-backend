import asyncHandler from 'express-async-handler';
import User from '../Models/user.model.js';
import Order from '../Models/order.model.js';
import Product from '../Models/product.model.js';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import generateToken from '../Utils/generateToken.js';
import { sendEmail } from '../Utils/sendMail.js';
//import jwt from 'jsonwebtoken';
//import { OAuth2Client } from "google-auth-library";
//import { validationResult } from('express-validator');
//import { errorHandler } from ('../helpers/dbErrorHandling');

/* import formData from "form-data";
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "Anoymous",
  key: process.env.MAILGUN_API_KEY,
  public_key: process.env.MAILGUN_PUB_KEY,
}); */
export const getAllDetails = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const [users, orders, products] = await Promise.all([
      User.find({ isAdmin: false }).lean(),
      Order.find().lean(),
      Product.find().lean(),
    ]);
    res.status(201).json({ users, orders, products });
  } else {
    res.status(401);
    throw new Error('YOU ARE NOT THE ADMIN!!!');
  }
});
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const orders = await Order.deleteMany({ user: req.params.id });
    const products = await Product.deleteMany({ user: req.params.id });
    const user = await User.findByIdAndDelete(req.params.id);
    const [newUsers, newOrders, newProducts] = await Promise.all([
      User.find({ isAdmin: false }).lean(),
      Order.find().lean(),
      Product.find().lean(),
    ]);
    res
      .status(201)
      .json({ users: newUsers, orders: newOrders, products: newProducts });
  } else {
    res.status(401);
    throw new Error('YOU ARE NOT THE ADMIN!!!');
  }
});
export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.isValidPassword(password))) {
    sendEmail(
      user.email,
      'SUCCESSFULLY LOGED IN!! HERE ARE SOME OF OUR PRODUCTS'
    );
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } else {
    console.log('Invalid user credentials');
    res.status(401);
    throw new Error('Invalid user credentials');
  }
});

// @desc   GET user profile
// @route  GET api/user/profile
// @access PRIVATE
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc   Register a newuser
// @route  POST api/user
// @access PUBLIC
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User Already exists');
  }
  const user = await User.create({ name, email, password });
  if (user) {
    sendEmail(user.email, 'SUCCESSFULLY REGISTERED!!');
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.email) {
      let existingUser = await User.find({ email: req.body.email });
      if (!existingUser.length) {
        user.email = req.body.email;
        sendEmail(user.email, 'EMAIL UPDATED !!');
      }
    }
    if (req.body.password) {
      user.password = req.body.password;
      sendEmail(user.email, 'PASSWORD UPDATED !!');
    }

    const updatedUser = await user.save();
    // send email to user
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      // token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const forgotPasswordController = (req, res) => {
  const { email } = req.body;
  // find if the user exists
  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: 'User does not exist',
        });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: '10m',
        }
      );

      return user.updateOne(
        {
          resetPasswordLink: token,
        },
        (err, success) => {
          if (err) {
            console.log('RESET PASSWORD LINK ERROR', err);
            return res.status(400).json({
              message:
                'Database connection error on user password forgot request',
            });
          } else {
            sendEmail(
              'me',
              '',
              `<html><a href="http://stackoverflow.com">For ${user.email}</a>
              <h1>Change password:  
              Copy and paste this link in your browser: "http://localhost:3000/reset-password?token=${token}"</h1>
              </html>
              `,
              'Reset password'
            );
            return res.status(201);
          }
        }
      );
    }
  );
};

export const resetPasswordController = (req, res) => {
  const { token: resetPasswordLink, password: newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            message: 'Expired link. Try again',
          });
        }

        User.findOne(
          {
            resetPasswordLink,
          },
          (err, user) => {
            if (err || !user) {
              return res.status(400).json({
                message: 'Something went wrong. Try later',
              });
            }

            const updatedFields = {
              password: newPassword,
              resetPasswordLink: '',
            };

            user = _.extend(user, updatedFields);
            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  message: 'Error resetting user password',
                });
              }
              res.json({
                message: `Great! Now you can login with your new password`,
              });
            });
          }
        );
      }
    );
  }
};
/*
// Google Login
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.googleController = (req, res) => {
  const { idToken } = req.body;
  console.log(idToken);
  client
    .verifyIdToken({
      idToken,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    })
    .then((response) => {
      const { email_verified, name, email, picture } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            //find if the email already exists
            console.log('user exists 😊');
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            });
            const { _id, email, name, profilePicture, role } = user;
            return res.json({
              //send response to client side (token and user info)
              token,
              user: { _id, email, name, profilePicture, role },
            });
          } else {
            console.log('user does not exits 🤭');
            //if user not exists we will save in database and generate pasword for it
            let password = email + process.env.JWT_SECRET;
            const profilePicture = picture;
            user = new User({ name, email, password, profilePicture }); //create new user object with google data
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE - ', err);
                return res.status(400).json({
                  message: 'User signup failed with google',
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, name, profilePicture, role } = data;
              return res.json({
                token,
                user: { _id, email, name, profilePicture, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          message: 'Google login failed. Try again',
        });
      }
    })
    .catch((error) => {
      console.log(error);
    })
}
*/
