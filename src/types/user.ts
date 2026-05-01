export type UserRole = 'admin' | 'user';
export type TreatmentPrefix = 'Sr.' | 'Sra.' | 'Srta.';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  treatment: TreatmentPrefix;
}
