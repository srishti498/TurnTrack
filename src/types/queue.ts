export interface Queue {
  id: string;
  name: string;
  currentNumber: number;
  waitingCount: number;
  avgWaitTime: number;
  isActive: boolean;
  location: string;
}

export interface Ticket {
  id: string;
  number: number;
  queueId: string;
  queueName: string;
  isPriority: boolean;
  createdAt: Date;
  estimatedWait: number;
  position: number;
  notificationEnabled: boolean;
}

export interface QueueStats {
  totalServed: number;
  avgWaitTime: number;
  activeQueues: number;
  peakHour: string;
}