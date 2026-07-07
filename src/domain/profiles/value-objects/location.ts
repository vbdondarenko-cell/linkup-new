import { Coordinates } from './coordinates';

export class Location {
  private constructor(
    public readonly coordinates: Coordinates,
    public readonly address?: string,
    public readonly city?: string,
    public readonly country?: string,
    public readonly placeId?: string
  ) {}

  static create(
    coordinates: Coordinates,
    address?: string,
    city?: string,
    country?: string,
    placeId?: string
  ): Location {
    return new Location(coordinates, address, city, country, placeId);
  }

  static fromCoords(latitude: number, longitude: number): Location {
    return Location.create(Coordinates.create(latitude, longitude));
  }

  isWithinRadius(center: Coordinates, radiusKm: number): boolean {
    return this.coordinates.distanceTo(center) <= radiusKm;
  }

  equals(other: Location): boolean {
    return this.coordinates.equals(other.coordinates);
  }

  toJSON(): Record<string, string | number | undefined> {
    return {
      ...this.coordinates.toJSON(),
      address: this.address,
      city: this.city,
      country: this.country,
      placeId: this.placeId,
    };
  }
}
