import { Router } from "express";
import * as userController from "./controller/user.controller.js";
import { validationMiddleware } from "../../middleware/validation.js";
import * as userValidators from "./user.validationSchema.js";
import {authMiddleware} from '../../middleware/auth.js'

const router = Router();

router.post(
    "/signup",
    validationMiddleware(userValidators.signupSchema),
    userController.signup
);

router.post(
    "/login",
    validationMiddleware(userValidators.loginSchema),
    userController.login
);

router.get('/', authMiddleware(), userController.getUser)

router.get('/otherUsers', authMiddleware(), userController.getOtherUsers)

router.get('/:userId', authMiddleware(), userController.getUserById)

export default router;
