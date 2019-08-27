import {Router} from 'express';
import actions from './actions';


const adminRouter = Router();

const { list, listTicketUsersInfo, specificUser, del } = actions


adminRouter.get('/admin/tickets', list);
adminRouter.get('/admin/tickets/users', listTicketUsersInfo);
adminRouter.get('/admin/tickets/:userId', specificUser);
adminRouter.delete('/admin/tickets/:id', del);





export default adminRouter