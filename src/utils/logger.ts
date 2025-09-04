import debug from "debug";

/**
 * Debug logger utility for WuzAPI
 * Uses the debug package for conditional logging
 *
 * Usage:
 * - Set DEBUG=wuzapi:* to see all logs
 * - Set DEBUG=wuzapi:request to see only request logs
 * - Set DEBUG=wuzapi:response to see only response logs
 */
export const logger = {
  request: debug("wuzapi:request"),
  response: debug("wuzapi:response"),
  error: debug("wuzapi:error"),
  info: debug("wuzapi:info"),
};

/**
 * Creates a logger instance with a specific namespace
 * @param namespace - The namespace for the logger (will be prefixed with 'wuzapi:')
 */
export const createLogger = (namespace: string): debug.Debugger => {
  return debug(`wuzapi:${namespace}`);
};

export default createLogger;
