import express from 'express';
const router = express.Router();
import {
  loginController,
  getUserProfile,
  registerUser,
  updateUserProfile,
  forgotPasswordController,
  resetPasswordController,
  deleteUser,
  getAllDetails,
} from '../Controllers/user.controller.js';
import protect from '../Middleware/auth.middleware.js';

router.route('/').post(registerUser).get(protect, getAllDetails);
router.route('/admin/:id').delete(protect, deleteUser);
router.post('/login', loginController);
router.post('/link', forgotPasswordController);
router.post('/password', resetPasswordController);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export { router };
