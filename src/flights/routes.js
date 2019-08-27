import { Router } from 'express';
import actions from './actions';

const flightRouter = Router();
const { list,create, update, get, del } = actions

flightRouter.get('/flights', list);
flightRouter.post('/flight', create);
flightRouter.put('/flight/:id', update);
flightRouter.get('/flight/:id', get);
flightRouter.delete('/flight/:id', del);



export default flightRouter