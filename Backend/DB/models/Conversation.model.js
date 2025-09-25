import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["private", "group"],
            required: true,
        },

        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        ],

        name: String,

        // lastMessage: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Message'
        // }
    },
    {
        timestamps: true,
    }
);

const conversationModel = model('Conversation', conversationSchema)
export default conversationModel