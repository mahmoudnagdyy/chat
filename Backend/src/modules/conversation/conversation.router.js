import Router from "express";
import * as conversationController from "./controller/conversation.controller.js";
import { validationMiddleware } from "../../middleware/validation.js";
import * as conversationValidators from "./conversation.validationSchema.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = Router();

router.post(
    "/",
    authMiddleware(),
    validationMiddleware(conversationValidators.addConversationSchema),
    conversationController.addConversation
);

router.get(
    "/:otherUserId",
    authMiddleware(),
    conversationController.getConversation
);

export default router;
