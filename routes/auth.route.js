import express from "express";
import { body } from "express-validator";

import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post(
  '/register', 
  [
    body('email', 'Formato de email incorrecto')
      .trim()
      .isEmail()
      .normalizeEmail(),
    body('password', 'Formato de email incorrecto')
      .isLength({ min: 6 })
  ],
  register
);

router.post('/login', login);

export default router;
