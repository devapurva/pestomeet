import { AnySrvRecord } from 'dns';

export type UserManager = {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  approval: string;
  experience: string;
};

export type BatchMembers = {
  id: string;
  name: string;
};

export type BatchManager = {
  batchId?: string;
  batchName: string;
  batchType: string;
  batchOwner: string;
  batchOwnerID: string;
  batchMembers: BatchMembers[] | [];
};

export type TeamMember = {
  id: string;
  name: string;
};

export type TeamManager = {
  teamId?: string;
  teamName: string;
  teamType: string;
  mentorName: string;
  mentorId: string;
  batchId: string;
  batchOwnerID: string;
  teamMembers: TeamMember[] | [];
};

export type ResourceManager = {
  resourceId?: string;
  resourceName: string;
  uploaderId: string;
  eventId: string;
  eventType: string;
  resource: any;
  resourceLinks: any;
};

export type AssignmentManager = {
  assignmentId?: string;
  assignmentName: string;
  uploaderId: string;
  eventID: string;
  assignmentLinks: any;
};
