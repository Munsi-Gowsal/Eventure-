import { Registration } from '../events/registration.model';
import { AppError } from '../../utils/AppError';

export class UserService {
  static async getMyRegistrations(userId: string) {
    const registrations = await Registration.find({ userId, status: 'REGISTERED' })
      .populate('eventId', 'title date time location bannerImageUrl maxAttendees')
      .sort({ registeredAt: -1 });
    
    return registrations;
  }
}
