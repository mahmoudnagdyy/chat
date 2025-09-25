import { Router } from "express";
import * as messageController from "./controller/message.controller.js";
import * as messageValidators from "./message.validationSchema.js";
import { authMiddleware } from "../../middleware/auth.js";
import { validationMiddleware } from "../../middleware/validation.js";

const router = Router();

router.post(
    "/",
    authMiddleware(),
    validationMiddleware(messageValidators.addMessageSchema),
    messageController.addMessage
);

router.get(
    "/allMessages/:conversationId",
    authMiddleware(),
    messageController.getAllMessages
);


router.get('/unReadMessages', authMiddleware(), messageController.getUnReadMessages)

router.patch('/readMessage/:senderId', authMiddleware(), messageController.readMessage)

export default router;
