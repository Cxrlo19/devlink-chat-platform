import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import refreshRoutes from "./routes/refresh.routes";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/refresh', refreshRoutes);

// Config
const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGODB_URI;

// Validate env
if (!MONGO_URI) {
  console.error('Startup Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Debug
console.log("Mongo URI:", MONGO_URI);

async function start() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('MongoDB Connected!');

    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (err) {
    console.error('Startup Error:', err);
    process.exit(1);
  }
}

start();
