import { Session } from 'sessions-lib'

export interface Plan {
  id: string;
  name: string;
  description?: string;
  sessions: Session[];
}
