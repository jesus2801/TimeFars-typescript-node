export interface TaskDB {
  taskID: number | string;
  creationDate: string;
  activity: string;
  color: string;
  importance: 'i-1' | 'i-2' | '1-3' | 'i-4';
  startDate: string;
  finalDate: string;
}
