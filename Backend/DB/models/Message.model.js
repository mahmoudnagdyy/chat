import { Schema, model } from "mongoose";

const messageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true
        },

        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        text: {
            type: String,
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const messageModel = model('Message', messageSchema)
export default messageModel