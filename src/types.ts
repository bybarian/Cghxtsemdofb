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

export interface Assignment {
  room: string;
  scenarioType: string;
  facilitator: string;
  sr: string;
  group: string;
}

export interface FacilitatorStep {
  label: string;
  duration: string;
  items: string[];
}

export interface FacilitatorScenario {
  id: number;
  title: string;
  steps: FacilitatorStep[];
  tips?: string[];
}

export interface RotationSession {
  timeRange: string;
  assignments: Assignment[];
}
