export interface TelegramConfig {
  botToken: string;
  apiUrl?: string;
}

export interface TelegramSendMessageParams {
  chatId: number;
  text: string;
  parseMode?: 'Markdown' | 'HTML';
  replyMarkup?: unknown;
  disableNotification?: boolean;
}

export interface TelegramSendPhotoParams {
  chatId: number;
  photo: string;
  caption?: string;
  parseMode?: 'Markdown' | 'HTML';
}

export interface TelegramEditMessageParams {
  chatId: number;
  messageId: number;
  text: string;
  parseMode?: 'Markdown' | 'HTML';
}

export interface TelegramBotCommand {
  command: string;
  description: string;
}

export interface ITelegramClient {
  sendMessage(params: TelegramSendMessageParams): Promise<TelegramMessage>;
  sendPhoto(params: TelegramSendPhotoParams): Promise<TelegramMessage>;
  editMessageText(params: TelegramEditMessageParams): Promise<TelegramMessage>;
  deleteMessage(chatId: number, messageId: number): Promise<void>;
  setCommands(commands: TelegramBotCommand[]): Promise<void>;
  answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void>;
}

export interface TelegramMessage {
  messageId: number;
  chat: { id: number; type: string };
  date: number;
  text?: string;
  caption?: string;
}

export interface TelegramUpdate {
  updateId: number;
  message?: TelegramMessage;
  callbackQuery?: {
    id: string;
    from: { id: number; isBot: boolean; firstName: string };
    chat: { id: number };
    message: TelegramMessage;
    data: string;
  };
}
