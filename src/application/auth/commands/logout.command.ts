import { LogoutRequest } from '../dto/auth.dto';

export class LogoutCommand {
  constructor(public readonly request: LogoutRequest) {}
}