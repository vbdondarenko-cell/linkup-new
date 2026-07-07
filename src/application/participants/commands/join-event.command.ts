import { JoinEventRequest } from '../dto/participant.dto';

export class JoinEventCommand {
  constructor(public readonly request: JoinEventRequest) {}
}
