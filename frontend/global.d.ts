// - SuperAdmin 
// - Admin
// - Mentor
// - Student
// - Event
// - Directory Permission
// - Buddy-Pairing
// - Mentor-Student Pairing

/**
 * PestoUser
 * extends base mongo User model
 * represent base user entity
 */
interface IUser {
  readonly id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  userType: string;
  approvalStatus: boolean;
  avartar: null | string;
  batch: Array<string>;
}

interface IEvent {
  id: number;
  title: string;
  desc: string;
  link: string;
  startDateTime: Date;
  endDateTime: Date;
  hasAssignment: boolean;
  resources:  Array<string>;
  assignedBatch?: string | number;
  organizer: Partial<IPestoUser>;
}

interface IPairing {
  id: number;
  members: Partial<IPestoUser>[];
}

// interface IAnalytics {
//   total
// }