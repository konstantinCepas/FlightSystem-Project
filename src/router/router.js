import { Router } from 'express';
import flights from '../flights/index'
import users from '../users/index'
import adminUserCards from '../usercards/index'
import adminTickets from '../tickets/index'

const { routes } = flights
const indexRouter = Router();

indexRouter.use(routes);
indexRouter.use(users.routes)
indexRouter.use(adminUserCards.routes)
indexRouter.use(adminTickets.routes);

export default indexRouter;