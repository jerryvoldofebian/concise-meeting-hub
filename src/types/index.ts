
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
}

export interface MeetingAttendee {
  id: string;
  userId: string;
  meetingId: string;
  user?: User;
  isPresent: boolean;
  isOptional: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  isRecurring: boolean;
  recurringPattern?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attendees?: MeetingAttendee[];
  minutes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  assignee?: User;
  meetingId?: string;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  id: string;
  companyName: string;
  companyLogo?: string;
  defaultMeetingDuration: number;
  emailNotifications: boolean;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at?: string;
  members_count?: number;
  is_member?: boolean;
  is_admin?: boolean;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  is_admin: boolean;
  joined_at: string;
  teams?: Team;
}
