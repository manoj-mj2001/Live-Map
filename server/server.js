const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve("./public")));

io.on("connection", function (socket) {
  console.log("User connected", socket.id);

  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
    console.log("User disconnected", socket.id);
  });
});

app.get("/data", function (req, res) {
  res.sendFile("/public/index.html");
});

server.listen(3000, console.log("App is listening on port 3000"));
