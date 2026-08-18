import { Router } from 'express';
import * as eventController from './event.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
import { requireAdmin } from '../../middleware/requireAdmin';
import { 
  paramIdSchema, 
  createEventSchema, 
  updateEventSchema, 
  listEventsQuerySchema 
} from './event.schema';

const router = Router();

// PUBLIC ROUTES
router.get('/', validate(listEventsQuerySchema), eventController.listEvents);
router.get('/:id', validate(paramIdSchema), eventController.getEventById);
// PROTECTED (USER) ROUTES
router.post('/:id/register', requireAuth, validate(paramIdSchema), eventController.registerForEvent);
router.delete('/:id/register', requireAuth, validate(paramIdSchema), eventController.cancelRegistration);

// ADMIN ROUTES
router.post('/', requireAuth, requireAdmin, validate(createEventSchema), eventController.createEvent);
router.patch('/:id', requireAuth, requireAdmin, validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', requireAuth, requireAdmin, validate(paramIdSchema), eventController.softDeleteEvent);
router.get('/:id/registrations', requireAuth, requireAdmin, validate(paramIdSchema), eventController.getEventRegistrations);

export default router;
