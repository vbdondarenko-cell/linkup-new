import { IProfileRepository } from '../../../domain/profiles/repositories/i-profile-repository';
import { AuthorizationMiddleware, AuthorizationContext } from '../../shared/middleware/authorization-middleware';
import { LoggingMiddleware } from '../../shared/middleware/logging-middleware';
import { ICacheService, CacheKeys } from '../../shared/cache/cache-service';
import { CreateProfileHandler } from '../handlers/create-profile.handler';
import { UpdateProfileHandler } from '../handlers/update-profile.handler';
import { GetProfileHandler } from '../handlers/get-profile.handler';
import { ChangeLanguageHandler } from '../handlers/change-language.handler';
import { UpdateLocationHandler } from '../handlers/update-location.handler';
import {
  CreateProfileRequest,
  UpdateProfileRequest,
  ChangeLanguageRequest,
  UpdateLocationRequest,
  ProfileResponse,
} from '../dto/profile.dto';

export class ProfileService {
  constructor(
    private readonly profileRepository: IProfileRepository,
    private readonly authorization: AuthorizationMiddleware,
    private readonly logger: LoggingMiddleware,
    private readonly cacheService: ICacheService
  ) {}

  async createProfile(request: CreateProfileRequest): Promise<ProfileResponse> {
    return this.logger.execute(
      'ProfileService.createProfile',
      request.userId,
      async () => {
        const handler = new CreateProfileHandler(this.profileRepository);
        const result = await handler.handle({ request } as any);

        if (!result.success) {
          throw result.error;
        }

        // Invalidate user cache
        await this.cacheService.deleteByTags([CacheKeys.tags.profile]);

        return result.data;
      }
    );
  }

  async updateProfile(
    context: AuthorizationContext,
    request: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    this.authorization.authorize(context, 'profile', 'update');

    const handler = new UpdateProfileHandler(this.profileRepository);
    const result = await handler.handle({ request } as any);

    if (!result.success) {
      throw result.error;
    }

    // Invalidate cache
    await this.cacheService.delete(CacheKeys.profile(request.profileId));

    return result.data;
  }

  async getProfile(
    profileId: string,
    requestingUserId?: string
  ): Promise<ProfileResponse> {
    // Try cache first
    const cached = await this.cacheService.get<ProfileResponse>(CacheKeys.profile(profileId));
    if (cached) {
      return cached;
    }

    const handler = new GetProfileHandler(this.profileRepository);
    const profile = await handler.handleById({ profileId, requestingUserId } as any);

    // Cache for 5 minutes
    await this.cacheService.set(CacheKeys.profile(profileId), profile, { ttl: 300 });

    return profile;
  }

  async getProfileByUserId(userId: string): Promise<ProfileResponse | null> {
    const handler = new GetProfileHandler(this.profileRepository);
    return handler.handleByUserId({ userId } as any);
  }

  async changeLanguage(
    context: AuthorizationContext,
    request: ChangeLanguageRequest
  ): Promise<void> {
    this.authorization.authorize(context, 'profile', 'update');

    const handler = new ChangeLanguageHandler(this.profileRepository);
    const result = await handler.handle({ request } as any);

    if (!result.success) {
      throw result.error;
    }

    await this.cacheService.delete(CacheKeys.profile(request.profileId));
  }

  async updateLocation(
    context: AuthorizationContext,
    request: UpdateLocationRequest
  ): Promise<void> {
    this.authorization.authorize(context, 'profile', 'update');

    const handler = new UpdateLocationHandler(this.profileRepository);
    const result = await handler.handle({ request } as any);

    if (!result.success) {
      throw result.error;
    }

    await this.cacheService.delete(CacheKeys.profile(request.profileId));
  }
}
