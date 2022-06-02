import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import './database/connectdb.js'
import authRouter from './routes/auth.route.js';
import linkRouter from './routes/link.route.js';

const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', linkRouter);

// Pongo a escuchar el servidor.
app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT} -- http://localhost:${PORT}`);
});