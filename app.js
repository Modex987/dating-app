const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
      res.render("home");
});

/* ************************************************ */

//const { Server } = require("socket.io");
// const io = new Server(server, {
//       cors: { origin: ["http://localhost:3000/"] },
// });

// io.on("connection", (socket) => {
//       console.log(`user connected; ${socket.id}`);

//       socket.on("message", (msg, room) => {
//             if (room) {
//                   socket.to(room).emit("message", msg);
//             } else {
//                   socket.broadcast.emit("message", msg);
//             }
//       });
// });

/* ************************************************ */

server.listen(3000, () => {
      console.log("listening on *:3000");
});
