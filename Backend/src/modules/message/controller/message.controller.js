import { asyncHandler } from "../../../utils/errorHandler.js";
import messageModel from '../../../../DB/models/Message.model.js'




// prettier-ignore
export const addMessage = asyncHandler(
    async (req, res, next) => {
        const {conversationId, senderId, receiverId, text} = req.body
        const messageData = await messageModel.create({conversationId, senderId, receiverId, text})
        return res.send({ message: "msg sent", messageData });
    }
)


// prettier-ignore
export const getAllMessages = asyncHandler(
    async (req, res, next) => {
        const {conversationId} = req.params
        const messages = await messageModel.find({ conversationId }).populate([
            {
                path: "conversationId",
            },
            {
                path: "senderId",
            },
        ]);
        return res.send({message: 'conversation messages', messages})
    }
)


// prettier-ignore
export const getUnReadMessages = asyncHandler(
    async (req, res, next) => {
        const messages = await messageModel.find({ isRead: false, receiverId: req.user._id }).populate([
            {
                path: "conversationId",
            },
            {
                path: "senderId",
            },
            {
                path: "receiverId",
            },
        ]);
        return res.send({message: 'conversation messages', messages})
    }
)


// prettier-ignore
export const readMessage = asyncHandler(
    async (req, res, next) => {
        const {senderId} = req.params
        const messages = await messageModel.updateMany(
            { isRead: false, receiverId: req.user._id, senderId },
            { isRead: true }
        );
        return res.send({message: messages.modifiedCount? 'read messages' :  'unread messages'})
    }
)