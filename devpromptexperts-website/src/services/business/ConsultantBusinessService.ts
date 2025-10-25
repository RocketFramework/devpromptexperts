// services/business/ConsultantBusinessService.ts
import { ConsultantsService } from '@/services/generated/ConsultantsService';
import { ConsultantDTO } from '@/types/dtos/Consultant.dto';

export class ConsultantBusinessService {
  static async getConsultantsForAdmin(): Promise<ConsultantDTO[]> {
    const consultants = await ConsultantsService.findAllWithUsers();
    
    return consultants.map(consultant => ({
      ...consultant,
      email: consultant.users?.[0]?.email || '',
      name: consultant.users?.[0]?.full_name || '',
      role: consultant.users?.[0]?.role || '',
      image: consultant.users?.[0]?.profile_image_url || null,
      country: consultant.users?.[0]?.country || null
    }));
  }
}