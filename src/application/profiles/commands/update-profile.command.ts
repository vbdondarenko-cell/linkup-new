import { UpdateProfileRequest } from '../dto/profile.dto';

export class UpdateProfileCommand {
  constructor(public readonly request: UpdateProfileRequest) {}
}
