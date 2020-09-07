const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const PORT = process.env.PORT || 3000;
http.listen(PORT);

app.use(express.static("public"));

    db = [];
    connectedClients = [];
    
    io.sockets.on("connection", function(socket) {
        console.log(`User Connected`);

        socket.emit("retrievePast", db);

        if (connectedClients.indexOf(socket) === -1) {
            connectedClients.push(socket);
        }

        socket.on("message", function(msg) {
            db.push({text:msg});
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
            console.log('User Disconnected!');
            var index = connectedClients.indexOf(socket);
            connectedClients.splice(index, 1);
            socket.broadcast.emit("UserDisconnect");
        });
    });

