import { connectDB } from "../DB/connection.js"
import userRouter from './modules/user/user.router.js'
import { globalErrorHandler } from "./utils/errorHandler.js";
import conversationRouter from './modules/conversation/conversation.router.js'
import messageRouter from "./modules/message/message.router.js";





export const bootstrap = (app, express) => {

    app.use(express.json())
    
    app.use('/user', userRouter)
    app.use("/conversation", conversationRouter);
    app.use("/message", messageRouter);
    
    app.use(globalErrorHandler);

    app.use('*root', (req, res, next) => {
        return res.send({message: '404 Not Found'})
    })

    connectDB()

}