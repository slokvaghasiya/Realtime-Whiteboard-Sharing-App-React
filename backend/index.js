const express = require("express");
const app = express();

const server = require("http").createServer(app)
const { Server } = require("socket.io")
const { addUser, removeUser, getUser } = require('./utils/user')

const io = new Server(server);

let roomIdGlobal, imageURLGlobal;
app.get("/", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.send("Realtime whiteBoard Sharing App ( MERN )")
})

io.on("connection", (socket) => {

    socket.on("userJoined", (data) => {
        const { name, userId, roomId, host, presenter } = data;
        roomIdGlobal = roomId
        socket.join(roomId);
        const users = addUser({ name, userId, roomId, host, presenter, socketId: socket.id })
        socket.emit("UserIsJoined", { success: true, users });
        socket.broadcast.to(roomId).emit("userJoinMsg", name)
        socket.broadcast.to(roomId).emit("allUsers", users)
        socket.broadcast.to(roomId).emit("whiteboardDataResponse", {
            imageURL: imageURLGlobal
        })
    });

    socket.on("whiteboardData", (data) => {
        imageURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse", {
            imageURL: data
        });
    });


    
    socket.on("message", (data) => {
        const { message } = data;
        const user = getUser(socket.id)
        if (user) {
            socket.broadcast;
            socket.broadcast.to(roomIdGlobal).emit("messageRes", { message, name: user.name })
        }
    })
    socket.on("disconnect", () => {
        const user = getUser(socket.id)
        if (user) {
            removeUser(socket.id)
            socket.broadcast.to(roomIdGlobal).emit("userLeftMsg", user.name)
        }
    });
});

const port = 8080
server.listen(port, () => {
    console.log("Server is Running !!");
})