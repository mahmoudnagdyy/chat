import joi from 'joi'



export const signupSchema = {

    body: joi.object({
        username: joi.string().min(6).max(20).alphanum(),
        email: joi.string().email(),
        password: joi.string().min(6),
        confirmPassword: joi.string().valid(joi.ref('password'))
    }).required().options({presence: 'required'})

}

export const loginSchema = {

    body: joi.object({
        email: joi.string().email(),
        password: joi.string(),
    }).required().options({presence: 'required'})

}