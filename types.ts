
export enum Sender {
  User = 'user',
  Assistant = 'assistant',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}

export type UserRole = 'Admin' | 'Member';

export interface User {
  name: string;
  email: string;
  role?: UserRole; // Role can be optional for general user type
}

export interface Member extends User {
  role: UserRole;
  id: string;
}

export interface Organization {
  id: string;
  name: string;
  members?: Member[];
}

export interface Notification {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
}