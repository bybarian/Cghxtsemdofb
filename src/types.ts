export interface Scenario {
  id: number;
  title: string;
  timeRange: string;
  description: string;
  roleBehavior: string;
  tips: string[];
  personality: 'agreeable_vague' | 'perfectionist' | 'resistant_anxious';
}

export interface ScheduleItem {
  time: string;
  minutes: number;
  topic: string;
  location: string;
  isBreak?: boolean;
}
