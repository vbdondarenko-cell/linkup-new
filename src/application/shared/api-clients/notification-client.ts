export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  icon?: string;
  badge?: number;
  clickAction?: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SMSPayload {
  to: string;
  message: string;
}

export interface INotificationClient {
  sendPush(userId: string, payload: PushNotificationPayload): Promise<void>;
  sendPushBatch(userIds: string[], payload: PushNotificationPayload): Promise<void>;
  sendEmail(payload: EmailPayload): Promise<void>;
  sendSMS(payload: SMSPayload): Promise<void>;
}
