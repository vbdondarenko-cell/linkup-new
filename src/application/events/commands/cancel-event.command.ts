export class CancelEventCommand {
  constructor(
    public readonly eventId: string,
    public readonly reason?: string
  ) {}
}
