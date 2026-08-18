import { Router } from 'express';
import * as userController from './user.controller';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();

// PROTECTED (USER) ROUTES
router.get('/registrations', requireAuth, userController.getMyRegistrations);

export default router;
