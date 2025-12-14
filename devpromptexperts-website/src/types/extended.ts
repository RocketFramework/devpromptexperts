import { ProjectResponses, Consultants, Users } from '@/services/generated';

export interface ProjectResponseWithDetails extends ProjectResponses {
  consultants: Consultants & {
    users: Users;
  };
}
