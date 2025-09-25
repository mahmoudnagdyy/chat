import Joi from "joi";
import { idCustomValidation } from "../../utils/customValidation.js";




export const addMessageSchema = {

    body: Joi.object({
        conversationId: Joi.string().custom(idCustomValidation),
        senderId: Joi.string().custom(idCustomValidation),
        receiverId: Joi.string().custom(idCustomValidation),
        text: Joi.string(),
    }).required().options({presence: 'required'})

}