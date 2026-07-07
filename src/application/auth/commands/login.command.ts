import { LoginRequest, LoginResponse } from '../dto/auth.dto';

export class LoginCommand {
  constructor(public readonly request: LoginRequest) {}
}