const { Server } = require("socket.io");
const sessionMiddleware = require("../config/sessionConfig");
const cookieParser = require("cookie-parser");
const ticketSocket = require("./ticketSocket");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    cookieParser()(socket.request, {}, (err) => {
      if (err) return next(err);
      sessionMiddleware(socket.request, {}, next);
    });
  });

  io.use((socket, next) => {
    if (socket.request.session && socket.request.session.passport && socket.request.session.passport.user) {
      next();
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    ticketSocket(io, socket);
  });
};

module.exports = {
  initializeSocket,
  getIo: () => io,
};
