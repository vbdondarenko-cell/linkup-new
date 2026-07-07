export interface TelegramInitData {
  hash: string;
  queryId: string;
  user: TelegramUser;
  authDate: Date;
}

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
}

export class TelegramInitDataVO {
  private constructor(
    public readonly hash: string,
    public readonly queryId: string,
    public readonly user: TelegramUser,
    public readonly authDate: Date
  ) {}

  static create(data: TelegramInitData): TelegramInitDataVO {
    if (!data.hash || !data.queryId || !data.user?.id) {
      throw new Error('Invalid Telegram init data');
    }
    return new TelegramInitDataVO(
      data.hash,
      data.queryId,
      data.user,
      new Date(data.authDate)
    );
  }

  get isRecent(): boolean {
    const now = new Date();
    const diff = now.getTime() - this.authDate.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return diff < twentyFourHours;
  }

  get isPremium(): boolean {
    return this.user.isPremium ?? false;
  }

  get telegramId(): string {
    return String(this.user.id);
  }
}
