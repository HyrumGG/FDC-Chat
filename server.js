const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const MongoClient = require('mongodb').MongoClient;
http.listen(3000);

app.use(express.static("public"));

MongoClient.connect(process.env.MONGODB_URI, function(err, client) {
    const db = client.db('messages');
    
    io.sockets.on("connection", function(socket) {
        console.log('User Connected');
        socket.on("message", function(msg) {
            console.log('message: '+msg);
            messageHist.insertOne({text:message});
            socket.broadcast.emit("message", msg);
        });
    })
})

