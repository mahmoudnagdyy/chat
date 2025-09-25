import { Server } from "socket.io"
import {verifyToken} from '../utils/tokenService.js'

let io


export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://127.0.0.1:5500",
        },
    });

    io.on('connection', (socket) => {

        socket.on("joinRoom", (data) => {
            const roomName = `conversation_${data}`;
            socket.join(roomName);
        });

        socket.on("sendMessage", (data) => {
            io.to(`conversation_${data}`).emit("newMsg", "newMsg");
        });

        socket.on("signup", (data) => {
            socket.broadcast.emit('newUser', 'newUser')
        }); 
     
        socket.on('home', (data) => {
            const decoded = verifyToken({token: data, signature: process.env.LOGIN_TOKEN_SIGNATURE});
            socket.join(`Room_${decoded.id}`)
            io.to(`Room_${decoded.id}`).emit('hi', 'welcome in new room')
        })

        socket.on("newNoftication", (data) => {
            io.to(`Room_${data.to}`).emit("showNotification", data.from);
        });

        socket.on("readMessages", (data) => {
            io.emit("setRead", "setRead");
        });

        socket.on("readUser", (data) => {
            socket.emit("setReadUser", data);
        });
    }) 
}