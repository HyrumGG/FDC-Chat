const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const mongo = require('mongodb').MongoClient;
http.listen(3000);

app.use(express.static("public"));

const url = 'mongodb://localhost:27017/chatterbox';
MongoClient.connect(url, function(error, db) {
    const messageHist = db.collection('messages');
    
    io.sockets.on("connection", function(socket) {
        console.log('User Connected');
        socket.on("message", function(msg) {
            console.log('message: '+msg);
            messageHist.insertOne({text:message});
            socket.broadcast.emit("message", msg);
        });
    })
})

