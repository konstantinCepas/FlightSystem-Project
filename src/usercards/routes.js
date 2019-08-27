import {Router} from 'express';
import actions from './actions';


const adminRouter = Router();

const { list, listUsersCCInfo, specificUser, del } = actions

adminRouter.get('/admin/usercards', list);
adminRouter.get('/admin/usercards/users', listUsersCCInfo);
adminRouter.get('/admin/usercards/:userId', specificUser);
adminRouter.delete('/admin/usercards/:userId', del);


export default adminRouter