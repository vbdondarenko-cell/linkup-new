export class GetEventQuery {
  constructor(
    public readonly eventId: string,
    public readonly requestingUserId?: string
  ) {}
}

export class GetEventsNearbyQuery {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly radiusKm: number,
    public readonly page: number = 1,
    public readonly pageSize: number = 20
  ) {}
}

export class GetOrganizerEventsQuery {
  constructor(
    public readonly organizerId: string,
    public readonly page: number = 1,
    public readonly pageSize: number = 20
  ) {}
}
