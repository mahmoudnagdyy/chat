import jwt from 'jsonwebtoken'
import userModel from '../../DB/models/User.model.js'



export const authMiddleware = () => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        
        if (!authorization) {
            return next(new Error("Authorization token is required"));
        }

        if (!authorization.startsWith("nagdy__")) {
            return next(new Error("In-valid authorization token"));
        }
 
        const token = authorization.split("nagdy__")[1];

        const decoded = jwt.verify(token, process.env.LOGIN_TOKEN_SIGNATURE);
        if (!decoded) {
            return next(new Error("In-valid token"));
        }

        const user = await userModel.findById(decoded.id);
        if(!user){
            return next(new Error('User Not Found'))
        }

        req.user = user
        next()
    };
}