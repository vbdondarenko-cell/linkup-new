export type SupportedLanguage = 'en' | 'uk' | 'ru';

export class Language {
  private constructor(public readonly value: SupportedLanguage) {}

  static readonly SUPPORTED = ['en', 'uk', 'ru'] as const;

  static create(value: string): Language {
    const normalized = value.toLowerCase() as SupportedLanguage;
    if (!Language.SUPPORTED.includes(normalized)) {
      throw new Error(`Language must be one of: ${Language.SUPPORTED.join(', ')}`);
    }
    return new Language(normalized);
  }

  static default(): Language {
    return new Language('en');
  }

  equals(other: Language): boolean {
    return this.value === other.value;
  }

  toJSON(): string {
    return this.value;
  }
}
