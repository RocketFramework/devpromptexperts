// services/business/ConsultantBusinessService.ts
import { ConsultantsService } from '@/services/generated/ConsultantsService';
import { ConsultantDTO } from '@/types/dtos/Consultant.dto';

export class ConsultantBusinessService {
  static async getConsultantsForAdmin(): Promise<ConsultantDTO[]> {
    const consultants = await ConsultantsService.findAllWithUsers();
    
    const mappedConsultants = consultants.map(consultant => {
      
      // Get the first user (there should be one user per consultant)
      const user = Array.isArray(consultant.users) ? consultant.users[0] : consultant.users;
      
      return {
        ...consultant,
        email: user?.email || '',
        name: user?.full_name || '',
        role: user?.role || '',
        image: user?.profile_image_url || null,
        country: user?.country || null
      };
    });
    
    return mappedConsultants;
  }
}