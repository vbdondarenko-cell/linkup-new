export interface LevelConfig {
  level: number;
  minXP: number;
  maxXP: number;
  title: string;
  perks: string[];
}

export class Level {
  private constructor(
    public readonly level: number,
    public readonly minXP: number,
    public readonly maxXP: number,
    public readonly title: string,
    public readonly perks: string[]
  ) {}

  static LEVELS: LevelConfig[] = [
    { level: 1, minXP: 0, maxXP: 100, title: 'Newcomer', perks: ['basic_features'] },
    { level: 2, minXP: 100, maxXP: 300, title: 'Regular', perks: ['create_events'] },
    { level: 3, minXP: 300, maxXP: 600, title: 'Explorer', perks: ['create_events', 'badges'] },
    { level: 4, minXP: 600, maxXP: 1000, title: 'Enthusiast', perks: ['create_events', 'badges', 'analytics'] },
    { level: 5, minXP: 1000, maxXP: 1500, title: 'Active', perks: ['create_events', 'badges', 'analytics', 'featured'] },
    { level: 6, minXP: 1500, maxXP: 2100, title: 'Dedicated', perks: ['create_events', 'badges', 'analytics', 'featured'] },
    { level: 7, minXP: 2100, maxXP: 2800, title: 'Expert', perks: ['create_events', 'badges', 'analytics', 'featured', 'priority'] },
    { level: 8, minXP: 2800, maxXP: 3600, title: 'Master', perks: ['create_events', 'badges', 'analytics', 'featured', 'priority'] },
    { level: 9, minXP: 3600, maxXP: 4500, title: 'Legend', perks: ['create_events', 'badges', 'analytics', 'featured', 'priority', 'exclusive'] },
    { level: 10, minXP: 4500, maxXP: Infinity, title: 'Elite', perks: ['create_events', 'badges', 'analytics', 'featured', 'priority', 'exclusive'] },
  ];

  static fromXP(totalXP: number): Level {
    for (let i = Level.LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= Level.LEVELS[i].minXP) {
        const config = Level.LEVELS[i];
        return new Level(config.level, config.minXP, config.maxXP, config.title, config.perks);
      }
    }
    return new Level(1, 0, 100, 'Newcomer', ['basic_features']);
  }

  static fromLevel(level: number): Level {
    const config = Level.LEVELS.find(l => l.level === level) || Level.LEVELS[0];
    return new Level(config.level, config.minXP, config.maxXP, config.title, config.perks);
  }

  getProgressPercentage(totalXP: number): number {
    if (this.maxXP === Infinity) return 100;
    const xpInLevel = totalXP - this.minXP;
    const xpNeeded = this.maxXP - this.minXP;
    return Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  }

  getXPToNextLevel(totalXP: number): number {
    if (this.maxXP === Infinity) return 0;
    return this.maxXP - totalXP;
  }

  hasPerk(perk: string): boolean {
    return this.perks.includes(perk);
  }

  toJSON(): LevelConfig {
    return {
      level: this.level,
      minXP: this.minXP,
      maxXP: this.maxXP,
      title: this.title,
      perks: [...this.perks],
    };
  }
}