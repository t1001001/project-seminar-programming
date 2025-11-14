export interface Exercise {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  intensity: 'low' | 'medium' | 'high';
}
