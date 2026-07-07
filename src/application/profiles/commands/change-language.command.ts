import { ChangeLanguageRequest } from '../dto/profile.dto';

export class ChangeLanguageCommand {
  constructor(public readonly request: ChangeLanguageRequest) {}
}
