import { LeaveEventRequest } from '../dto/participant.dto';

export class LeaveEventCommand {
  constructor(public readonly request: LeaveEventRequest) {}
}
