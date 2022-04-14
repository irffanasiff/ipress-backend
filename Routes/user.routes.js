import express from 'express';
const router = express.Router();
import { loginController } from '../Controllers/user.controller.js';

router.post('/login', loginController);

export { router };
