export abstract class BaseEntity<T> {
  protected readonly _id: T;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: T, createdAt?: Date) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = new Date();
  }

  get id(): T {
    return this._id;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  equals(entity: BaseEntity<T>): boolean {
    if (this === entity) return true;
    return this._id === entity._id;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
