import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import refreshRoutes from "./routes/refresh.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/refresh', refreshRoutes);

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGODB_URI;

async function start() {
  if (!MONGO_URI) {
    console.error('Startup Error: MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected!');

    app.listen(PORT, () => {
      console.log('Server started on port: ' + PORT);
    });
  } catch (e) {
    console.error('Startup Error: ', e);
    process.exit(1);
  }

}

start();



