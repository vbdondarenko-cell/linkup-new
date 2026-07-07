import { UpdateLocationRequest } from '../dto/profile.dto';

export class UpdateLocationCommand {
  constructor(public readonly request: UpdateLocationRequest) {}
}
