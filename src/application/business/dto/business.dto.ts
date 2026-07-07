export interface CreateBusinessRequest {
  ownerId: string;
  name: string;
  description: string;
  email: string;
  website?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  categoryId?: string;
}

export interface VerifyBusinessRequest {
  businessId: string;
}

export interface BusinessResponse {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: Record<string, string>;
  verificationStatus: string;
  isVerified: boolean;
  createdAt: string;
}
