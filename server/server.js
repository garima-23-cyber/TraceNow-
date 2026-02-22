const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/database');
const { setIoInstance } = require('./controllers/captureController');

// Routes
const dataRoutes = require('./routes/dataRoutes');
const captureRoutes = require('./routes/captureRoutes');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://trace-now.vercel.app';

// ------------------------------------
// Middlewares
// ------------------------------------
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// File Upload Middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// ------------------------------------
// Socket.IO Configuration
// ------------------------------------
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Pass the IO instance to your capture controller to enable real-time emits
setIoInstance(io);

// ------------------------------------
// Database & Routes
// ------------------------------------
connectDB();

// API Route Mounting
app.use('/api/data', dataRoutes);
app.use('/api/capture', captureRoutes);
// trackerRoutes removed as we are using a JSON-based service now

// Default Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Privacy Visualizer Engine is up and running..."
  });
});

// ------------------------------------
// Socket.IO Real-time Logic (Session-Based)
// ------------------------------------
io.on('connection', (socket) => {
  console.log(`📡 New Socket Connection: ${socket.id}`);

  /**
   * Users join a specific "room" based on their sessionId.
   * This ensures they only see THEIR network capture data.
   */
  socket.on('join_session', (sessionId) => {
    if (sessionId) {
      socket.join(sessionId);
      console.log(`👥 Socket ${socket.id} joined session room: ${sessionId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// ------------------------------------
// Server Activation
// ------------------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Interface: ${CLIENT_ORIGIN}`);
});