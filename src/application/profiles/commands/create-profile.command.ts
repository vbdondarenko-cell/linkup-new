import { CreateProfileRequest } from '../dto/profile.dto';

export class CreateProfileCommand {
  constructor(public readonly request: CreateProfileRequest) {}
}
