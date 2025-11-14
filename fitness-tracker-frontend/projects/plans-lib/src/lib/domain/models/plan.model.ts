export interface Plan {
  id: string;
  title: string;
  description?: string;
  sessionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
