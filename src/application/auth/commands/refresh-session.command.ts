import { RefreshSessionRequest, RefreshSessionResponse } from '../dto/auth.dto';

export class RefreshSessionCommand {
  constructor(public readonly request: RefreshSessionRequest) {}
}