import { CreateEventRequest } from '../dto/event.dto';

export class CreateEventCommand {
  constructor(public readonly request: CreateEventRequest) {}
}
