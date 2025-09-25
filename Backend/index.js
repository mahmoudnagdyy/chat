import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { bootstrap } from './src/index.router.js'
import { initializeSocket } from "./src/utils/socketService.js";

const app = express()
app.use(cors({ origin: "http://127.0.0.1:5500" }));


app.get('/', (req, res, next) => {
    return res.send('Hello World')
})


bootstrap(app, express)






const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port .... ${process.env.PORT}`);
})


initializeSocket(server)