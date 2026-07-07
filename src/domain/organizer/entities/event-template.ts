import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';

export interface EventTemplateProps {
  organizerId: EntityId;
  name: string;
  description: string;
  titleTemplate: string;
  descriptionTemplate: string;
  defaultVisibility: 'public' | 'private' | 'followers';
  defaultInterests: string[];
  defaultDuration: number; // minutes
  isActive: boolean;
  useCount: number;
  createdAt?: Date;
}

export class EventTemplate extends BaseEntity<EntityId> {
  private _organizerId: EntityId;
  private _name: string;
  private _description: string;
  private _titleTemplate: string;
  private _descriptionTemplate: string;
  private _defaultVisibility: 'public' | 'private' | 'followers';
  private _defaultInterests: string[];
  private _defaultDuration: number;
  private _isActive: boolean;
  private _useCount: number;

  constructor(props: EventTemplateProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._organizerId = props.organizerId;
    this._name = props.name;
    this._description = props.description;
    this._titleTemplate = props.titleTemplate;
    this._descriptionTemplate = props.descriptionTemplate;
    this._defaultVisibility = props.defaultVisibility;
    this._defaultInterests = [...props.defaultInterests];
    this._defaultDuration = props.defaultDuration;
    this._isActive = props.isActive;
    this._useCount = props.useCount;
  }

  static create(params: Omit<EventTemplateProps, 'useCount'>): EventTemplate {
    return new EventTemplate({
      ...params,
      id: `template_${params.organizerId}_${Date.now()}`,
      useCount: 0,
    });
  }

  get organizerId(): EntityId {
    return this._organizerId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get titleTemplate(): string {
    return this._titleTemplate;
  }

  get descriptionTemplate(): string {
    return this._descriptionTemplate;
  }

  get defaultVisibility(): 'public' | 'private' | 'followers' {
    return this._defaultVisibility;
  }

  get defaultInterests(): string[] {
    return [...this._defaultInterests];
  }

  get defaultDuration(): number {
    return this._defaultDuration;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get useCount(): number {
    return this._useCount;
  }

  update(details: Partial<Omit<EventTemplateProps, 'id' | 'organizerId' | 'useCount'>>): void {
    if (details.name) this._name = details.name;
    if (details.description !== undefined) this._description = details.description;
    if (details.titleTemplate) this._titleTemplate = details.titleTemplate;
    if (details.descriptionTemplate !== undefined) this._descriptionTemplate = details.descriptionTemplate;
    if (details.defaultVisibility) this._defaultVisibility = details.defaultVisibility;
    if (details.defaultInterests) this._defaultInterests = [...details.defaultInterests];
    if (details.defaultDuration) this._defaultDuration = details.defaultDuration;
    if (details.isActive !== undefined) this._isActive = details.isActive;
    this.touch();
  }

  recordUse(): void {
    this._useCount += 1;
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      organizerId: this._organizerId,
      name: this._name,
      description: this._description,
      titleTemplate: this._titleTemplate,
      descriptionTemplate: this._descriptionTemplate,
      defaultVisibility: this._defaultVisibility,
      defaultInterests: [...this._defaultInterests],
      defaultDuration: this._defaultDuration,
      isActive: this._isActive,
      useCount: this._useCount,
    };
  }
}
