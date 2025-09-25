import { asyncHandler } from "../../../utils/errorHandler.js";
import conversationModel from '../../../../DB/models/Conversation.model.js'



// prettier-ignore
export const addConversation = asyncHandler(
    async (req, res, next) => {
        const {type, participants, name} = req.body
        const checkConversation = await conversationModel.findOne({
            participants: { $all: [participants[0], participants[1]], $size: 2 },
            type: "private",
        });
        if(checkConversation){
            return res.send({message: 'Conversation Already Exist', checkConversation})
        }
        const conversation = await conversationModel.create({type, participants, name})
        return res.send({message: 'Conversation Created', conversation})
    }
)


// prettier-ignore
export const getConversation = asyncHandler(
    async (req, res, next) => {
        const {otherUserId} = req.params
        
        const conversation = await conversationModel.findOne({
            participants: { $all: [otherUserId, req.user._id], $size: 2 },
            type: "private",
        });
        
        if (!conversation) {
            return next(new Error("Conversation Not Found"));
        }
        return res.send({message: 'conversation', conversation})
    }
)