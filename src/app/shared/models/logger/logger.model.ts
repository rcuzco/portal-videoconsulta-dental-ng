import { LoggerItem } from './loggerItem.model';

export interface Logger {
  logs: Array<LoggerItem>;
  timestamp: Date;
}
