# Infrastructure & API Integration

## API Clients

The Application Layer interacts with external services through wrapper interfaces.

### Supabase Client

Database, authentication, and realtime.

```typescript
interface ISupabaseClient {
  select<T>(table: string, options?: QueryOptions): Promise<SupabaseResponse<T>>;
  insert<T>(table: string, data: Partial<T>): Promise<SupabaseResponse<T>>;
  update<T>(table: string, data: Partial<T>, options?: QueryOptions): Promise<SupabaseResponse<T>>;
  upsert<T>(table: string, data: Partial<T>): Promise<SupabaseResponse<T>>;
  delete(table: string, options?: QueryOptions): Promise<SupabaseResponse<void>>;
  rpc<T>(fn: string, params?: Record<string, unknown>): Promise<SupabaseResponse<T>>;
}
```

**Usage:**
```typescript
// Query
const events = await supabase.select<Event>('events', {
  eq: { status: 'published' },
  limit: 20,
  order: { column: 'start_date', ascending: true }
});

// Insert
await supabase.insert('profiles', { userId, bio, language: 'en' });

// Update
await supabase.update('events', { title: 'New Title' }, { eq: { id: eventId } });
```

### Supabase Storage

File uploads.

```typescript
interface ISupabaseStorage {
  upload(path: string, file: Blob | File, options?: {...}): Promise<{ path: string; url: string }>;
  download(path: string): Promise<Blob>;
  delete(path: string): Promise<void>;
  getPublicUrl(path: string): string;
}
```

### Supabase Realtime

Live updates.

```typescript
interface ISupabaseRealtime {
  subscribe(channel: string, callback: (payload: unknown) => void): () => void;
  unsubscribe(channel: string): void;
}
```

### Telegram Client

Bot operations.

```typescript
interface ITelegramClient {
  sendMessage(params: TelegramSendMessageParams): Promise<TelegramMessage>;
  sendPhoto(params: TelegramSendPhotoParams): Promise<TelegramMessage>;
  editMessageText(params: TelegramEditMessageParams): Promise<TelegramMessage>;
  deleteMessage(chatId: number, messageId: number): Promise<void>;
  setCommands(commands: TelegramBotCommand[]): Promise<void>;
  answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void>;
}
```

**Usage:**
```typescript
// Send message
await telegram.sendMessage({
  chatId: 123456789,
  text: 'Event starting soon!',
  parseMode: 'Markdown'
});

// Send with inline keyboard
await telegram.sendMessage({
  chatId: 123456789,
  text: 'Choose action:',
  replyMarkup: {
    inline_keyboard: [[
      { text: '✅ Join', callback_data: 'join_event' },
      { text: '❌ Cancel', callback_data: 'cancel' }
    ]]
  }
});
```

### Notification Client

Push, email, SMS.

```typescript
interface INotificationClient {
  sendPush(userId: string, payload: PushNotificationPayload): Promise<void>;
  sendPushBatch(userIds: string[], payload: PushNotificationPayload): Promise<void>;
  sendEmail(payload: EmailPayload): Promise<void>;
  sendSMS(payload: SMSPayload): Promise<void>;
}
```

## Repository Implementations

Repository interfaces defined in Domain are implemented in Infrastructure.

```
src/infrastructure/
├── repositories/
│   ├── supabase/
│   │   ├── supabase-event.repository.ts
│   │   ├── supabase-profile.repository.ts
│   │   ├── supabase-user.repository.ts
│   │   └── ...
```

### Example Implementation

```typescript
export class SupabaseEventRepository implements IEventRepository {
  constructor(private readonly supabase: ISupabaseClient) {}

  async findById(id: EntityId): Promise<Event | null> {
    const { data, error } = await this.supabase
      .select<EventDto>('events', { eq: { id } });

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  async save(event: Event): Promise<void> {
    const dto = this.mapToDto(event);
    await this.supabase.upsert('events', dto);
  }

  async delete(id: EntityId): Promise<void> {
    await this.supabase.delete('events', { eq: { id } });
  }
}
```

## Event Handlers (Infrastructure)

Domain events are handled in Infrastructure to trigger side effects.

```typescript
export class EventCreatedHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly recommendationService: RecommendationService
  ) {}

  async handle(event: EventCreated): Promise<void> {
    // Send notification to followers
    await this.notificationService.notifyFollowers(
      event.aggregateId,
      'New event created!'
    );

    // Update recommendations
    await this.recommendationService.refreshRecommendations(
      event.organizerId
    );
  }
}
```

## Dependency Injection

All dependencies are injected via constructors.

```typescript
// Without DI container
const authService = new AuthService(
  new SupabaseSessionRepository(supabase),
  new SupabaseUserRepository(supabase),
  authorization,
  logger
);

// With DI container (e.g., tsyringe)
@injectable()
class AuthService {
  constructor(
    @inject('ISessionRepository') private sessionRepository: ISessionRepository,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject(AuthorizationMiddleware) private authorization: AuthorizationMiddleware,
    @inject(LoggingMiddleware) private logger: LoggingMiddleware
  ) {}
}
```

## Environment Configuration

```typescript
// config.ts
export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
  },
  cache: {
    defaultTTL: 300,
  },
};
```

## Error Handling Strategy

```typescript
try {
  const result = await eventService.createEvent(context, request);
  res.status(201).json(result);
} catch (error) {
  if (error instanceof ValidationApplicationError) {
    res.status(400).json(error.toJSON());
  } else if (error instanceof NotFoundApplicationError) {
    res.status(404).json(error.toJSON());
  } else if (error instanceof AuthorizationApplicationError) {
    res.status(403).json(error.toJSON());
  } else if (error instanceof ConflictApplicationError) {
    res.status(409).json(error.toJSON());
  } else {
    logger.error('Unhandled error', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

## Retry Strategy

For transient failures.

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
  throw new Error('Should not reach here');
}
```
