// Import system modules.
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Import own modules.
import './database/connectdb.js'
import authRouter from './routes/auth.route.js';
import linkRouter from './routes/link.route.js';
import redirectRouter from './routes/redirect.route.js'

// Settings.
const PORT = process.env.PORT || 5000;

// Initializations.
const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    if ( whiteList.includes(origin) ) return callback(null, origin);
    return callback(`Error de CORS, origin ${origin}. No autorizado!`);
  }
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', redirectRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', linkRouter);

// I put the server to listen.
app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT} -- http://localhost:${PORT}`);
});