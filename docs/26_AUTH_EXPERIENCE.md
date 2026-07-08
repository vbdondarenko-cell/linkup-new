# Authentication & Onboarding Experience

## Purpose

This document describes the Authentication and Onboarding Experience for LinkUp V6, enabling users to create an account and personalize their experience in under 60 seconds.

## Scope

- Telegram Login
- Splash Screen
- Welcome Screen
- Loading Experience
- Interest Selection
- Radius Selection
- Profile Preview
- Welcome Home

---

## Core Principle

### NO EMAIL
### NO PASSWORDS
### NO PHONE
### NO SOCIAL LOGIN

**The ONLY authentication method is Telegram Login.**

Everything else is future optional.

---

## Login Flow

```
Launch App
    ↓
Splash Screen (2s)
    ↓
Welcome Screen
    ↓
Telegram Authentication
    ↓
Loading (Profile Import)
    ↓
Interest Selection (3-10 interests)
    ↓
Radius Selection (500m - 100km)
    ↓
Profile Preview
    ↓
Welcome Home
    ↓
Home Screen
```

---

## Telegram Login

### What Gets Imported

Automatically and silently:
- Telegram ID
- Display Name
- Username
- Avatar Photo
- Telegram Language

### Privacy

No personal data is stored on our servers. All Telegram data is used only for authentication and profile creation.

---

## Splash Screen

### Elements
- Animated background circles
- LinkUp logo
- Tagline: "Connect through real experiences"
- Loading dots

### Timing
- Auto-advances after 2 seconds

### Animation
- Fade in on mount
- Pulsing circle animation
- Calm, premium feel

---

## Welcome Screen

### Hero Content
- Large illustration
- Headline: "Find people for real-life activities"
- Description

### Features
1. Discover Nearby
2. Connect Authentically  
3. Create Memories

### CTA
- Primary button: "Continue with Telegram"
- Secondary: Privacy Policy + Terms links

---

## Loading Experience

### Messages (rotating)
1. "Preparing your account..."
2. "Importing your profile..."
3. "Setting up your preferences..."
4. "Almost ready..."

### Visual
- Progress bar animation
- Telegram connection indicator
- Logo display

### Duration
- Typically 2-3 seconds

---

## Interest Selection

### Importance

This is the MOST important onboarding step. It personalizes the entire experience.

### Rules
- **Minimum:** 3 interests
- **Maximum:** 10 interests

### Categories

| Category | Icon |
|----------|------|
| Coffee | ☕ |
| Food | 🍽️ |
| Music | 🎵 |
| Sports | ⚽ |
| Gaming | 🎮 |
| Technology | 💻 |
| Business | 💼 |
| Travel | ✈️ |
| Nature | 🌿 |
| Art | 🎨 |
| Photography | 📷 |
| Fitness | 💪 |
| Movies | 🎬 |
| Books | 📚 |
| Education | 🎓 |
| Languages | 🗣️ |
| Volunteering | 🤝 |
| Nightlife | 🌃 |
| Culture | 🏛️ |
| Wellness | 🧘 |

### Features
- Search functionality
- Category filtering
- Selected interests at top
- Progress indicator
- Animated chips

---

## Radius Selection

### Options

| Value | Label |
|-------|-------|
| 0.5 | 500m |
| 1 | 1km |
| 2 | 2km |
| 5 | 5km |
| 10 | 10km |
| 25 | 25km |
| 50 | 50km |
| 100 | 100km |

### Default
- 5km

### Visual
- Animated map preview
- Radius visualization
- Circle overlay

### Info
- Tip about changing later

---

## Profile Preview

### Display
- Avatar with verification badge
- Display name
- Username
- Telegram badge
- Selected interests
- Radius setting
- Language
- Notification status

### Purpose
- Show user what they'll look like
- Build confidence before entering app

---

## Welcome Home

### Animation
- Logo scale animation
- Background pattern
- Text fade in

### Content
- "Welcome to LinkUp"
- "Let's discover your city together"
- Tip card

### Duration
- Auto-advances after 3 seconds

---

## File Structure

```
src/features/auth/
├── onboarding/
│   └── onboarding-screen.tsx
├── components/
│   ├── index.ts
│   ├── splash-screen.tsx
│   ├── welcome-screen.tsx
│   ├── loading-screen.tsx
│   ├── interests-screen.tsx
│   ├── radius-screen.tsx
│   ├── profile-preview-screen.tsx
│   └── welcome-home-screen.tsx
├── hooks/
│   ├── index.ts
│   └── use-auth-state.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## Components

### SplashScreen
- Animated background
- Logo with pulse effect
- Tagline

### WelcomeScreen
- Hero illustration
- Feature list
- Telegram CTA

### LoadingScreen
- Rotating messages
- Progress bar
- Telegram indicator

### InterestsScreen
- Search bar
- Category chips
- Interest grid
- Selected chips

### RadiusScreen
- Map visualization
- Option buttons
- Info card

### ProfilePreviewScreen
- Profile card
- Interests display
- Settings preview

### WelcomeHomeScreen
- Animated logo
- Welcome text
- Loading animation

---

## State Management

### useAuthState Hook

```typescript
interface UseAuthStateReturn {
  // State
  state: OnboardingState;
  isOnboardingComplete: boolean;
  canProceed: boolean;
  interestsProgress: { current: number; min: number; max: number };
  
  // Actions
  startTelegramLogin: () => Promise<void>;
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  selectInterest: (interest: Interest) => void;
  deselectInterest: (interestId: string) => void;
  setRadius: (radius: number) => void;
  setLocation: (location: Location) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  completeOnboarding: () => Promise<void>;
}
```

---

## Animations

### Splash
- FadeIn
- Circle pulse

### Welcome
- FadeInUp with stagger
- Button compress

### Loading
- Progress bar
- Message fade

### Interests
- Layout springify
- Chip scale

### Radius
- Spring animations
- Circle resize

### Welcome Home
- Logo scale sequence
- Text fade
- Pattern reveal

---

## Accessibility

### VoiceOver
- All screens have labels
- Progress announcements
- Button descriptions

### Touch Targets
- Minimum 44px
- Proper spacing

### Dynamic Type
- Flexible layouts
- Scalable text

### Reduced Motion
- Simplified animations
- Essential animations only

---

## Performance

### Optimizations
- Memoized components
- Lazy loading
- Preloaded assets

### Offline
- Graceful error handling
- Retry mechanisms
- Cached data

---

*Last Updated: V6.0*
*Owner: Engineering Team*
*Review Frequency: Per Release*
