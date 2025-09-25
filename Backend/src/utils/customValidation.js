import { Types } from "mongoose"



export const idCustomValidation = (value, helpers) => {
    return Types.ObjectId.isValid(value)? value : helpers.message('In-valid Id')
}