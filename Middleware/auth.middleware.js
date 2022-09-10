import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';
import expressAsyncHandler from 'express-async-handler';
const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
      req.user = await User.findById(decoded._id).select('-password');
      next();
    } catch (error) {
      if (error.message == 'jwt expired') {
        res.status(500);
        throw new Error('Token expired');
      } else {
        res.status(401);
        throw new Error('Not Authorized, token failed');
      }
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
export default protect;
