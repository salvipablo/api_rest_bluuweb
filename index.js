import 'dotenv/config';
import express from "express";
import cookieParser from 'cookie-parser';

import './database/connectdb.js'
import authRouter from './routes/auth.route.js';

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT} -- http://localhost:${PORT}`);
});