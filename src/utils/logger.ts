/* eslint-disable no-console */
type LogArg = unknown;

export const logger = {
  info: (message: string, ...args: LogArg[]) => console.log(`[INFO] ${message}`, ...args),
  warn: (message: string, ...args: LogArg[]) => console.warn(`[WARN] ${message}`, ...args),
  error: (message: string, ...args: LogArg[]) => console.error(`[ERROR] ${message}`, ...args),
};
