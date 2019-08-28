import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import indexRouter from './router/router.js';
import jwt from 'express-jwt';



const app = express();
const port = process.env.PORT || 3000;
const publicLinks = ['/register', '/user/searchflights', '/login'];

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(jwt({secret:'secret'}).unless({path: publicLinks}));
app.use(indexRouter);
app.listen(port, () => console.log(`API is listening on ${port}`));



