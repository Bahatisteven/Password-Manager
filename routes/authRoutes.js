import express from 'express';
import { signUp, login, logout } from '../controllers/authController.js';
import { validateSignUp, validateLogin } from '../validators/authValidator.js';
import { authenticateLogin } from '../middleware/authMiddleware.js';

const router = express.Router();

const authRoutes = () => {
  router.post("/signup", validateSignUp, signUp);
  router.post("/login", validateLogin, authenticateLogin, login);
  router.post("/logout", logout);
  return router;
};


export { authRoutes };