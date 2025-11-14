export interface Session {
  id: string;
  planId: string;
  scheduledAt: string;
  completed: boolean;
  notes?: string;
}
