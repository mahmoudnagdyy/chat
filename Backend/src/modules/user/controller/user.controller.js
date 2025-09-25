import { asyncHandler } from "../../../utils/errorHandler.js";
import userModel from '../../../../DB/models/User.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";


// prettier-ignore
export const signup = asyncHandler(
    async (req, res, next) => {
        const {username, email, password} = req.body
        
        const checkUser = await userModel.findOne({
            $or: [
                {username},
                {email}
            ]
        })
        if(checkUser){
            return next(new Error('username or email already exist'))
        }

        const user = new userModel({
            username,
            email,
            password,
        });
        
        const saveUser = await user.save()

        return res.send({message: 'signup done'})
    }
)


// prettier-ignore
export const login = asyncHandler(
    async (req, res, next) => {
        const {email, password} = req.body

        const checkUser = await userModel.findOne({email})
        if(!checkUser){
            return next(new Error('Email Not Found'))
        }

        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        if(!checkPassword){
            return next(new Error('Wrong Email Or Password'))
        }

        const token = jwt.sign(
            { id: checkUser._id },
            process.env.LOGIN_TOKEN_SIGNATURE
        );

        return res.send({message: 'user loggedIn', token})
    }
)


// prettier-ignore
export const getUser = asyncHandler(
    async (req, res, next) => {
        return res.send({message: 'user data', user: req.user})
    }
)


// prettier-ignore
export const getOtherUsers = asyncHandler(
    async (req, res, next) => {
        const otherUsers = await userModel.find({_id: {$ne: req.user._id}})
        return res.send({message: 'otherUsers', otherUsers})
    }
)


// prettier-ignore
export const getUserById = asyncHandler(
    async (req, res, next) => {
        const {userId} = req.params
        const user = await userModel.findById(userId)
        return res.send({message: 'user', user})
    }
)