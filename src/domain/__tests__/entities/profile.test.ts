import { Profile } from '../../profiles/entities/profile';
import { Language } from '../../profiles/value-objects/language';
import { Radius } from '../../profiles/value-objects/radius';
import { Coordinates } from '../../profiles/value-objects/coordinates';
import { Location } from '../../profiles/value-objects/location';

describe('Profile Entity', () => {
  const userId = 'user_123';

  describe('create', () => {
    it('should create a profile with default values', () => {
      const profile = Profile.create({
        userId,
        interests: ['interest_1'],
        isPublic: true,
      });

      expect(profile.id).toBeDefined();
      expect(profile.userId).toBe(userId);
      expect(profile.language.value).toBe('en');
      expect(profile.radius.value).toBe(10);
      expect(profile.isPublic).toBe(true);
      expect(profile.interests).toContain('interest_1');
    });

    it('should create profile with custom language and radius', () => {
      const profile = Profile.create({
        userId,
        language: Language.create('uk'),
        radius: Radius.create(25),
        interests: [],
        isPublic: true,
      });

      expect(profile.language.value).toBe('uk');
      expect(profile.radius.value).toBe(25);
    });
  });

  describe('updateUsername', () => {
    it('should update username', () => {
      const profile = Profile.create({
        userId,
        interests: [],
        isPublic: true,
      });

      profile.updateUsername('new_username');

      expect(profile.username).toBe('new_username');
    });
  });

  describe('updateBio', () => {
    it('should update bio', () => {
      const profile = Profile.create({
        userId,
        interests: [],
        isPublic: true,
      });

      profile.updateBio('My new bio');

      expect(profile.bio).toBe('My new bio');
    });
  });

  describe('changeLanguage', () => {
    it('should change language', () => {
      const profile = Profile.create({
        userId,
        language: Language.create('en'),
        interests: [],
        isPublic: true,
      });

      profile.changeLanguage(Language.create('ru'));

      expect(profile.language.value).toBe('ru');
    });
  });

  describe('changeRadius', () => {
    it('should change radius', () => {
      const profile = Profile.create({
        userId,
        radius: Radius.create(10),
        interests: [],
        isPublic: true,
      });

      profile.changeRadius(Radius.create(50));

      expect(profile.radius.value).toBe(50);
    });
  });

  describe('interests management', () => {
    it('should add interest', () => {
      const profile = Profile.create({
        userId,
        interests: ['interest_1'],
        isPublic: true,
      });

      profile.addInterest('interest_2');

      expect(profile.interests).toContain('interest_1');
      expect(profile.interests).toContain('interest_2');
    });

    it('should not add duplicate interest', () => {
      const profile = Profile.create({
        userId,
        interests: ['interest_1'],
        isPublic: true,
      });

      profile.addInterest('interest_1');

      expect(profile.interests.filter(i => i === 'interest_1').length).toBe(1);
    });

    it('should remove interest', () => {
      const profile = Profile.create({
        userId,
        interests: ['interest_1', 'interest_2'],
        isPublic: true,
      });

      profile.removeInterest('interest_1');

      expect(profile.interests).not.toContain('interest_1');
      expect(profile.interests).toContain('interest_2');
    });
  });

  describe('archive/delete', () => {
    it('should archive profile', () => {
      const profile = Profile.create({
        userId,
        interests: [],
        isPublic: true,
      });

      profile.archive();

      expect(profile.status).toBe('archived');
    });

    it('should delete profile', () => {
      const profile = Profile.create({
        userId,
        interests: [],
        isPublic: true,
      });

      profile.delete();

      expect(profile.status).toBe('deleted');
    });
  });
});

describe('Language Value Object', () => {
  it('should create valid language', () => {
    const lang = Language.create('uk');
    expect(lang.value).toBe('uk');
  });

  it('should normalize to lowercase', () => {
    const lang = Language.create('RU');
    expect(lang.value).toBe('ru');
  });

  it('should throw for invalid language', () => {
    expect(() => Language.create('fr')).toThrow();
  });

  it('should return default language', () => {
    const lang = Language.default();
    expect(lang.value).toBe('en');
  });
});

describe('Radius Value Object', () => {
  it('should create valid radius', () => {
    const radius = Radius.create(25);
    expect(radius.value).toBe(25);
  });

  it('should throw for radius below minimum', () => {
    expect(() => Radius.create(0)).toThrow();
  });

  it('should throw for radius above maximum', () => {
    expect(() => Radius.create(150)).toThrow();
  });

  it('should return default radius', () => {
    const radius = Radius.default();
    expect(radius.value).toBe(10);
  });
});

describe('Coordinates Value Object', () => {
  it('should create valid coordinates', () => {
    const coords = Coordinates.create(50.4501, 30.5234);
    expect(coords.latitude).toBe(50.4501);
    expect(coords.longitude).toBe(30.5234);
  });

  it('should throw for invalid latitude', () => {
    expect(() => Coordinates.create(91, 30)).toThrow();
    expect(() => Coordinates.create(-91, 30)).toThrow();
  });

  it('should throw for invalid longitude', () => {
    expect(() => Coordinates.create(50, 181)).toThrow();
    expect(() => Coordinates.create(50, -181)).toThrow();
  });

  it('should calculate distance correctly', () => {
    const kyiv = Coordinates.create(50.4501, 30.5234);
    const lviv = Coordinates.create(49.8397, 24.0297);

    const distance = kyiv.distanceTo(lviv);
    
    expect(distance).toBeGreaterThan(450);
    expect(distance).toBeLessThan(550);
  });

  it('should check equality', () => {
    const coords1 = Coordinates.create(50.4501, 30.5234);
    const coords2 = Coordinates.create(50.4501, 30.5234);
    const coords3 = Coordinates.create(49.8397, 24.0297);

    expect(coords1.equals(coords2)).toBe(true);
    expect(coords1.equals(coords3)).toBe(false);
  });
});

describe('Location Value Object', () => {
  it('should create location with address', () => {
    const coords = Coordinates.create(50.4501, 30.5234);
    const location = Location.create(coords, 'Khreshchatyk St', 'Kyiv', 'Ukraine');

    expect(location.coordinates.latitude).toBe(50.4501);
    expect(location.address).toBe('Khreshchatyk St');
    expect(location.city).toBe('Kyiv');
    expect(location.country).toBe('Ukraine');
  });

  it('should check if within radius', () => {
    const center = Coordinates.create(50.4501, 30.5234);
    const nearby = Coordinates.create(50.4550, 30.5300);
    const far = Coordinates.create(51.0000, 31.0000);

    const location1 = Location.create(nearby);
    const location2 = Location.create(far);

    expect(location1.isWithinRadius(center, 5)).toBe(true);
    expect(location2.isWithinRadius(center, 5)).toBe(false);
  });
});
