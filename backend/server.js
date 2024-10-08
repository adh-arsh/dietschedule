require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dishRoutes = require('./routes/dishRoutes');
const Dish = require('./models/Dish'); 

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "DELETE"], 
  }
});

// Database Connection
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URI, // Allow requests from the frontend
}));

app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);

// Socket.io integration
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for moveDish event
  socket.on('moveDish', async ({ dishId, newDay }) => {
    try {
      
      const updatedDish = await Dish.findByIdAndUpdate(
        dishId,
        { day: newDay }, 
        { new: true }
      );

      if (!updatedDish) {
        socket.emit('error', { message: 'Dish not found' });
        return;
      }

      console.log(`Dish moved: ${updatedDish.name} to ${newDay}`);
      
      io.emit('dishUpdated', updatedDish);
    } catch (error) {
      console.error(error);
      socket.emit('error', { message: 'Failed to move dish' });
    }
  });


  socket.on('deleteDish', async (dishId) => {
    try {
      
      const deletedDish = await Dish.findByIdAndDelete(dishId);

      if (!deletedDish) {
        socket.emit('error', { message: 'Dish not found' });
        return;
      }

      console.log(`Dish deleted: ${deletedDish.name}`);
      
      io.emit('dishDeleted', dishId);
    } catch (error) {
      console.error(error);
      socket.emit('error', { message: 'Failed to delete dish' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
