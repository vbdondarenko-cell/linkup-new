export type SearchableType = 'event' | 'user' | 'organizer' | 'business' | 'category' | 'interest';

export interface SearchResultProps {
  type: SearchableType;
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  relevanceScore: number;
  metadata?: Record<string, unknown>;
}

export class SearchResult {
  private constructor(
    public readonly type: SearchableType,
    public readonly id: string,
    public readonly title: string,
    public readonly subtitle: string | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly relevanceScore: number,
    public readonly metadata: Record<string, unknown>
  ) {}

  static create(props: SearchResultProps): SearchResult {
    return new SearchResult(
      props.type,
      props.id,
      props.title,
      props.subtitle,
      props.description,
      props.imageUrl,
      props.relevanceScore,
      props.metadata || {}
    );
  }

  isEvent(): boolean {
    return this.type === 'event';
  }

  isUser(): boolean {
    return this.type === 'user';
  }

  isOrganizer(): boolean {
    return this.type === 'organizer';
  }

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      id: this.id,
      title: this.title,
      subtitle: this.subtitle,
      description: this.description,
      imageUrl: this.imageUrl,
      relevanceScore: this.relevanceScore,
      metadata: { ...this.metadata },
    };
  }
}

export interface SearchQuery {
  query: string;
  types?: SearchableType[];
  filters?: {
    location?: { latitude: number; longitude: number; radiusKm: number };
    dateRange?: { start: Date; end: Date };
    interests?: string[];
    categoryId?: string;
  };
  pagination: { limit: number; offset: number };
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  query: string;
  took: number; // milliseconds
}
