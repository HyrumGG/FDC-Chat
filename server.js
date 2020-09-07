const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 3000;
http.listen(PORT);

app.use(express.static("public"));

const uri = "mongodb+srv://admin:FCXuaT7DA45SM4N@cluster0.il8as.mongodb.net/messages?retryWrites=true&w=majority";

MongoClient.connect(process.env.MONGODB_URI || uri, function(err, client) {
    const db = client.db('messages').collection('messages');

    connectedClients = [];
    
    io.sockets.on("connection", function(socket) {
        if (connectedClients.indexOf(socket) === -1) {
            connectedClients.push(socket);
        }

        db.find().toArray().then(function (docs) {
            socket.emit("retrievePast", docs);
        });;

        socket.on("message", function(msg) {
            db.insertOne({text:msg});
            socket.broadcast.emit("message", msg);
        });

        socket.on("username", function (username) {
            socket.name = username;
            socket.broadcast.emit("username", {
                username: username,
                id: socket.id
            });
        });

        socket.on("GetClients", function (nothing, callback) {
            var usersList = connectedClients.map(function (item) {
                return {
                    id: item.id,
                    username: item.name
                }
            });
            callback(usersList);
        });

        socket.on('disconnect', function() {
            var index = connectedClients.indexOf(socket);
            connectedClients.splice(index, 1);
            socket.broadcast.emit("UserDisconnect");
        });
    });
})