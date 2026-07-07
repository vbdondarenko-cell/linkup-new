import { UpdateEventRequest } from '../dto/event.dto';

export class UpdateEventCommand {
  constructor(public readonly request: UpdateEventRequest) {}
}
