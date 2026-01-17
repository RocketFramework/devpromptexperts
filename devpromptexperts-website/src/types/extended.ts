import { ProjectResponses, Consultants, Users, ProjectRequests } from '@/services/generated';

export interface ProjectResponseWithDetails extends ProjectResponses {
  consultants: Consultants & {
    users: Users;
  };
  project_requests?: ProjectRequests;
}
