import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import initializeSocket from './sockets/index.js'
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);

const server = createServer(app);
const io = new Server(server, {
  cors: process.env.SOCKET_ORIGINAL,
  serveClient: false,
});

initializeSocket(io);
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
