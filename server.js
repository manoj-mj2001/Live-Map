const express = require("express");
const socketio = require("socket.io");
const serverlesshttp = require("serverless-http");
const http = require("http");
const path = require("path");

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

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

router.get("/", function (req, res) {
  res.sendFile("/public/index.html");
});

server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverlesshttp(app);
