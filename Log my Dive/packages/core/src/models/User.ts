export type UnitSystem = 'metric' | 'imperial';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUri?: string;
  certificationLevel?: string; // e.g. "PADI Open Water", "PADI Divemaster"
  unitSystem: UnitSystem;
  createdAt: string;
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
