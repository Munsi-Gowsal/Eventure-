import { Router } from 'express';
import * as eventController from './event.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/requireAuth';
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
router.post('/:id/register', validate(paramIdSchema), eventController.registerForEvent);

// ADMIN ROUTES
router.post('/', requireAuth, validate(createEventSchema), eventController.createEvent);
router.patch('/:id', requireAuth, validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', requireAuth, validate(paramIdSchema), eventController.softDeleteEvent);

export default router;
