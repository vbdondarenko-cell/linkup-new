export class GetProfileQuery {
  constructor(
    public readonly profileId: string,
    public readonly requestingUserId?: string
  ) {}
}

export class GetProfileByUserIdQuery {
  constructor(public readonly userId: string) {}
}
