const { Server } = require("socket.io");
const sessionMiddleware = require("../config/sessionConfig");
const cookieParser = require("cookie-parser");
const ticketSocket = require("./ticketSocket");
const applicationSocket = require("./applicationSocket");
const hiringProcessSocket = require("./hiringProcessSocket");
const interviewSocket = require("./interviewSocket");
const notificationSocket = require("./notificationSocket");

let io;

// Initializes the Socket.IO server and sets up middleware for session handling and authentication
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }
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

  // Define event handlers for various socket namespaces
  io.on("connection", (socket) => {
    ticketSocket(io, socket);
    applicationSocket(io, socket);
    hiringProcessSocket(io, socket);
    interviewSocket(io, socket);
    notificationSocket(io, socket);
  });
};

module.exports = {
  initializeSocket,
  getIo: () => io
};
