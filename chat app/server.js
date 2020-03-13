var express = require("express");
var http = require("http");

var app = express();
var server = http.Server(app);
var io = require("socket.io")(server);
var users = [];

server.listen(3333 , function(){
    console.log("the server is running at port 3333");
});

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
});
app.get("/index.css",function(req,res){
    res.sendFile(__dirname + "/index.css")
});

io.on("connection", function(socket){
    var user =""
    console.log("A user has connected");
    socket.on("has connected", function(username){
        user = username
        users.push(username);
        console.log(username);
        io.emit("has connected", {username: username , userlist: users});
    });
    socket.on("disconnect", function(){
        console.log("user has disconnect")
        users.splice(users.indexOf(user),1);
        io.emit("has disconnected", {username: user , userlist: users});
    });
    socket.on("new message",function(data){
        io.emit("new message",data);
        console.log(data.message);
    });
});