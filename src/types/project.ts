export type PhaseConfig = {
  name: string;
  days: number;
};

export type PhaseData = {
  start: Date;
  end: Date;
};

export type ProjectStatus = 'planning' | 'active' | 'completed';

export interface Project {
  id: string;
  name: string;
  client?: string;
  description?: string;
  eventDate: Date;
  phases: {
    [key: string]: PhaseData;
  };
  createdAt: Date;
  status: ProjectStatus;
}

export interface LaunchCalculatorResult {
  launchModel: string;
  eventDate: Date;
  phases: {
    [key: string]: PhaseData;
  };
}