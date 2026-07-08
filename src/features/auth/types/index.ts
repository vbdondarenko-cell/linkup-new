/**
 * LinkUp Design System 2026
 * Auth & Onboarding Types
 */

// Telegram User
export interface TelegramUser {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
}

// User Profile
export interface UserProfile {
  id: string;
  telegramId: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  language: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  radius: number;
  interests: Interest[];
  memberSince: Date;
}

// Interest System
export interface Interest {
  id: string;
  name: string;
  icon: string;
  category: InterestCategory;
  subcategory?: string;
}

export interface InterestCategory {
  id: string;
  name: string;
  icon: string;
  interests: Interest[];
}

export const INTEREST_CATEGORIES: Array<{ id: string; name: string; icon: string }> = [
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'food', name: 'Food', icon: '🍽️' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'photography', name: 'Photography', icon: '📷' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'movies', name: 'Movies', icon: '🎬' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'languages', name: 'Languages', icon: '🗣️' },
  { id: 'volunteering', name: 'Volunteering', icon: '🤝' },
  { id: 'nightlife', name: 'Nightlife', icon: '🌃' },
  { id: 'culture', name: 'Culture', icon: '🏛️' },
  { id: 'wellness', name: 'Wellness', icon: '🧘' },
];

// Generate interests for each category
export const ALL_INTERESTS: Interest[] = [
  // Coffee
  { id: 'coffee_specialty', name: 'Specialty Coffee', icon: '☕', category: 'coffee' },
  { id: 'coffee_latte', name: 'Latte Art', icon: '🥛', category: 'coffee' },
  { id: 'coffee_brewing', name: 'Home Brewing', icon: '🏠', category: 'coffee' },
  
  // Food
  { id: 'food_italian', name: 'Italian Cuisine', icon: '🍕', category: 'food' },
  { id: 'food_japanese', name: 'Japanese Cuisine', icon: '🍣', category: 'food' },
  { id: 'food_mexican', name: 'Mexican Food', icon: '🌮', category: 'food' },
  { id: 'food_bakeries', name: 'Bakeries', icon: '🥐', category: 'food' },
  { id: 'food_wine', name: 'Wine Tasting', icon: '🍷', category: 'food' },
  { id: 'food_cooking', name: 'Cooking Classes', icon: '👨‍🍳', category: 'food' },
  
  // Music
  { id: 'music_live', name: 'Live Music', icon: '🎤', category: 'music' },
  { id: 'music_jazz', name: 'Jazz', icon: '🎷', category: 'music' },
  { id: 'music_rock', name: 'Rock', icon: '🎸', category: 'music' },
  { id: 'music_electronic', name: 'Electronic', icon: '🎹', category: 'music' },
  { id: 'music_indie', name: 'Indie', icon: '🎧', category: 'music' },
  
  // Sports
  { id: 'sports_football', name: 'Football', icon: '🏈', category: 'sports' },
  { id: 'sports_basketball', name: 'Basketball', icon: '🏀', category: 'sports' },
  { id: 'sports_tennis', name: 'Tennis', icon: '🎾', category: 'sports' },
  { id: 'sports_running', name: 'Running', icon: '🏃', category: 'sports' },
  { id: 'sports_cycling', name: 'Cycling', icon: '🚴', category: 'sports' },
  
  // Gaming
  { id: 'gaming_pc', name: 'PC Gaming', icon: '🖥️', category: 'gaming' },
  { id: 'gaming_console', name: 'Console Gaming', icon: '🎮', category: 'gaming' },
  { id: 'gaming_board', name: 'Board Games', icon: '🎲', category: 'gaming' },
  { id: 'gaming_esports', name: 'Esports', icon: '🏆', category: 'gaming' },
  
  // Technology
  { id: 'tech_startups', name: 'Startups', icon: '🚀', category: 'technology' },
  { id: 'tech_ai', name: 'AI & ML', icon: '🤖', category: 'technology' },
  { id: 'tech_coding', name: 'Coding', icon: '💻', category: 'technology' },
  { id: 'tech_web3', name: 'Web3', icon: '⛓️', category: 'technology' },
  
  // Business
  { id: 'business_networking', name: 'Networking', icon: '🤝', category: 'business' },
  { id: 'business_startup', name: 'Startup', icon: '💼', category: 'business' },
  { id: 'business_marketing', name: 'Marketing', icon: '📢', category: 'business' },
  
  // Travel
  { id: 'travel_adventure', name: 'Adventure Travel', icon: '🏔️', category: 'travel' },
  { id: 'travel_backpacking', name: 'Backpacking', icon: '🎒', category: 'travel' },
  { id: 'travel_digital', name: 'Digital Nomad', icon: '🌍', category: 'travel' },
  
  // Nature
  { id: 'nature_hiking', name: 'Hiking', icon: '🥾', category: 'nature' },
  { id: 'nature_camping', name: 'Camping', icon: '⛺', category: 'nature' },
  { id: 'nature_beach', name: 'Beach', icon: '🏖️', category: 'nature' },
  { id: 'nature_gardening', name: 'Gardening', icon: '🌱', category: 'nature' },
  
  // Art
  { id: 'art_galleries', name: 'Art Galleries', icon: '🖼️', category: 'art' },
  { id: 'art_street', name: 'Street Art', icon: '🎨', category: 'art' },
  { id: 'art_workshops', name: 'Art Workshops', icon: '🖌️', category: 'art' },
  
  // Photography
  { id: 'photo_urban', name: 'Urban Photography', icon: '🏙️', category: 'photography' },
  { id: 'photo_portrait', name: 'Portrait Photography', icon: '📸', category: 'photography' },
  { id: 'photo_nature', name: 'Nature Photography', icon: '🌄', category: 'photography' },
  
  // Fitness
  { id: 'fitness_gym', name: 'Gym', icon: '🏋️', category: 'fitness' },
  { id: 'fitness_yoga', name: 'Yoga', icon: '🧘', category: 'fitness' },
  { id: 'fitness_hiking', name: 'Hiking Fitness', icon: '⛰️', category: 'fitness' },
  { id: 'fitness_martial', name: 'Martial Arts', icon: '🥋', category: 'fitness' },
  
  // Movies
  { id: 'movies_cinema', name: 'Cinema', icon: '🎬', category: 'movies' },
  { id: 'movies_indie', name: 'Indie Films', icon: '🎞️', category: 'movies' },
  { id: 'movies_documentary', name: 'Documentaries', icon: '📽️', category: 'movies' },
  
  // Books
  { id: 'books_fiction', name: 'Fiction', icon: '📖', category: 'books' },
  { id: 'books_nonfiction', name: 'Non-Fiction', icon: '📚', category: 'books' },
  { id: 'books_bookclub', name: 'Book Club', icon: '📚', category: 'books' },
  
  // Education
  { id: 'edu_lectures', name: 'Lectures', icon: '🎓', category: 'education' },
  { id: 'edu_workshops', name: 'Workshops', icon: '💡', category: 'education' },
  { id: 'edu_podcasts', name: 'Podcasts', icon: '🎧', category: 'education' },
  
  // Languages
  { id: 'lang_exchange', name: 'Language Exchange', icon: '🗣️', category: 'languages' },
  { id: 'lang_culture', name: 'Language & Culture', icon: '🌍', category: 'languages' },
  
  // Volunteering
  { id: 'vol_local', name: 'Local Community', icon: '🏘️', category: 'volunteering' },
  { id: 'vol_environment', name: 'Environment', icon: '🌍', category: 'volunteering' },
  { id: 'vol_social', name: 'Social Causes', icon: '❤️', category: 'volunteering' },
  
  // Nightlife
  { id: 'night_clubs', name: 'Night Clubs', icon: '🎉', category: 'nightlife' },
  { id: 'night_bars', name: 'Cocktail Bars', icon: '🍸', category: 'nightlife' },
  { id: 'night_live', name: 'Live Venues', icon: '🎵', category: 'nightlife' },
  
  // Culture
  { id: 'cult_museums', name: 'Museums', icon: '🏛️', category: 'culture' },
  { id: 'cult_theater', name: 'Theater', icon: '🎭', category: 'culture' },
  { id: 'cult_history', name: 'History', icon: '🏰', category: 'culture' },
  { id: 'cult_festivals', name: 'Festivals', icon: '🎪', category: 'culture' },
  
  // Wellness
  { id: 'well_meditation', name: 'Meditation', icon: '🧘', category: 'wellness' },
  { id: 'well_spa', name: 'Spa & Wellness', icon: '💆', category: 'wellness' },
  { id: 'well_mental', name: 'Mental Health', icon: '💜', category: 'wellness' },
];

// Onboarding Step
export type OnboardingStep = 
  | 'splash'
  | 'welcome'
  | 'telegram-login'
  | 'loading'
  | 'interests'
  | 'radius'
  | 'location'
  | 'notifications'
  | 'profile-preview'
  | 'welcome-home';

export interface OnboardingState {
  currentStep: OnboardingStep;
  telegramUser: TelegramUser | null;
  profile: Partial<UserProfile>;
  selectedInterests: Interest[];
  radius: number;
  location: { latitude: number; longitude: number; city?: string } | null;
  notificationsEnabled: boolean;
  isLoading: boolean;
  error: string | null;
}

// Radius Options
export const RADIUS_OPTIONS = [
  { value: 0.5, label: '500m' },
  { value: 1, label: '1km' },
  { value: 2, label: '2km' },
  { value: 5, label: '5km' },
  { value: 10, label: '10km' },
  { value: 25, label: '25km' },
  { value: 50, label: '50km' },
  { value: 100, label: '100km' },
];

// Interest Selection Rules
export const INTEREST_SELECTION = {
  MIN: 3,
  MAX: 10,
};

// Loading Messages
export const LOADING_MESSAGES = [
  'Preparing your account...',
  'Importing your profile...',
  'Setting up your preferences...',
  'Almost ready...',
];

// Navigation
export interface AuthNavigationParams {
  screen: OnboardingStep;
  params?: Record<string, unknown>;
}
