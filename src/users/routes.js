import {Router} from 'express';
import actions from './actions';


const userRouter = Router();
const { register, update, addCredit, updateBalance, userListFlights,
     userGotFlight, userBuyTicket, deleteCC, listMyTicket, cancelTicket, login } = actions;

userRouter.post('/register', register);
userRouter.put('/user/update/:id', update);
userRouter.post('/user/:userId/creditcard', addCredit);
userRouter.put('/user/:userId/creditcard/balance', updateBalance);
userRouter.get('/user/searchflights', userListFlights);
userRouter.get('/user/searchflights/:flightId', userGotFlight);
userRouter.post('/user/:userId/:flightId/buyticket', userBuyTicket);
userRouter.delete('/user/:userId/creditcard', deleteCC);
userRouter.get('/user/:userId/ticket', listMyTicket);
userRouter.post('/user/:userId/ticket', cancelTicket);
userRouter.post('/login/', login);

export default userRouter