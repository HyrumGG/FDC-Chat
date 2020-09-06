const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const MongoClient = require('mongodb').MongoClient;
http.listen(3000);

app.use(express.static("public"));

const uri = "mongodb+srv://admin:FCXuaT7DA45SM4N@cluster0.il8as.mongodb.net/messages?retryWrites=true&w=majority";

MongoClient.connect(uri, function(err, client) {
    const db = client.db('messages');
    
    io.sockets.on("connection", function(socket) {
        console.log('User Connected');
        socket.on("message", function(msg) {
            db.insertOne({text:message});
            socket.broadcast.emit("message", msg);
        });
    })
})

