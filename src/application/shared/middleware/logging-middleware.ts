export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  correlationId?: string;
  userId?: string;
  operation?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface Logger {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void;
}

export class ConsoleLogger implements Logger {
  private formatEntry(entry: LogEntry): string {
    return `[${entry.timestamp.toISOString()}] [${entry.level.toUpperCase()}] ${entry.message}${
      entry.correlationId ? ` [${entry.correlationId}]` : ''
    }${entry.userId ? ` [user:${entry.userId}]` : ''}${
      entry.operation ? ` [${entry.operation}]` : ''
    }${entry.duration ? ` [${entry.duration}ms]` : ''}`;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      ...metadata,
    };

    const formatted = this.formatEntry(entry);
    const data = metadata ? ` ${JSON.stringify(metadata)}` : '';

    switch (level) {
      case 'debug':
        console.debug(formatted + data);
        break;
      case 'info':
        console.info(formatted + data);
        break;
      case 'warn':
        console.warn(formatted + data);
        break;
      case 'error':
        console.error(formatted + data);
        break;
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('error', message, {
      ...metadata,
      error: error?.message,
      stack: error?.stack,
    });
  }
}

export class LoggingMiddleware {
  private logger: Logger;
  private correlationIdHeader = 'x-correlation-id';

  constructor(logger?: Logger) {
    this.logger = logger || new ConsoleLogger();
  }

  generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async execute<T>(
    operation: string,
    userId: string | undefined,
    fn: (correlationId: string) => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const correlationId = this.generateCorrelationId();
    const startTime = Date.now();

    this.logger.info(`Starting ${operation}`, {
      correlationId,
      userId,
      operation,
    });

    try {
      const result = await fn(correlationId);
      const duration = Date.now() - startTime;

      this.logger.info(`Completed ${operation}`, {
        correlationId,
        userId,
        operation,
        duration,
        metadata,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error(`Failed ${operation}`, error as Error, {
        correlationId,
        userId,
        operation,
        duration,
        metadata,
      });

      throw error;
    }
  }

  logCommand<T>(
    commandName: string,
    userId: string | undefined,
    input: Record<string, unknown>,
    result: { success: boolean; error?: Error }
  ): void {
    this.logger.info(`Command ${commandName}`, {
      userId,
      command: commandName,
      input,
      success: result.success,
      error: result.error?.message,
    });
  }

  logQuery<T>(
    queryName: string,
    userId: string | undefined,
    input: Record<string, unknown>,
    result: T,
    duration: number
  ): void {
    this.logger.info(`Query ${queryName}`, {
      userId,
      query: queryName,
      input,
      duration,
    });
  }
}
