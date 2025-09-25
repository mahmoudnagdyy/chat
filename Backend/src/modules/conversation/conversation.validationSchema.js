import Joi from "joi";
import {idCustomValidation} from '../../utils/customValidation.js'



export const addConversationSchema = {
    body: Joi.object({
        type: Joi.string().valid("private", "group").required(),
        participants: Joi.array().items(Joi.custom(idCustomValidation)).min(2).required(),
        name: Joi.string().optional()
    }).required(),
};