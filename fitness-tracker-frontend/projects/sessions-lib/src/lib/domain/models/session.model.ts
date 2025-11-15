import { Exercise } from 'exercises-lib';

export interface Session {
  id: string;
  name: string;
  scheduledDate: string; 
  exerciseExecutions: Exercise[];
}
