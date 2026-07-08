# LinkUp V6.0

> A premium platform for discovering real-life activities

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/vbdondarenko-cell/linkup-new)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/vbdondarenko-cell/linkup-new/actions)
[![Coverage](https://img.shields.io/badge/coverage-70%25-yellow.svg)](https://codecov.io/gh/vbdondarenko-cell/linkup-new)

## 🎯 Mission

**Helping people meet safely in the real world.**

LinkUp is a premium mobile-first platform that makes discovering and organizing real-life activities effortless. Built with privacy-first principles, trust systems, and AI-powered recommendations.

## ✨ Features

### Core Features
- 📍 **Map-First Experience** - Discover events visually on an interactive map
- 🔐 **Telegram Authentication** - Secure, seamless login
- 🤝 **Trust System** - Community-driven trust scoring
- ⭐ **Premium Experience** - Unlock exclusive features
- 🎁 **Reward Premium** - Earn rewards through engagement
- 🔒 **Privacy First** - Your data stays yours

### Event System
- 📅 **Event Discovery** - Personalized recommendations
- 🎨 **Event Creation** - Rich event creation with images
- 📍 **Location-Based** - Find events near you
- 🔍 **Universal Search** - Find anything instantly
- 🏷️ **Categories** - Social, Tech, Business, Sports, Music, Arts, Food, Health, Education, Other

### Organizer Tools
- 📊 **Organizer Dashboard** - Manage your events
- 👥 **Attendee Management** - Track and manage participants
- 📈 **Analytics** - Event performance insights
- 🏅 **Verification** - Get verified as a trusted organizer

### Business Features
- ✅ **Verified Business** - Official business verification
- 🏢 **Business Profile** - Professional presence
- 📊 **Business Analytics** - Advanced insights

### Community
- 💬 **Realtime Chat** - Event-based group chats
- ⏰ **Auto-Expiring Chats** - Clean, focused conversations
- 🔔 **Notifications** - Stay updated
- 🏆 **Achievements** - Unlock badges
- 📈 **XP System** - Level up your profile

### AI-Powered
- 🎯 **Smart Recommendations** - Personalized event suggestions
- 🛡️ **Content Moderation** - Safe community
- 🤖 **Fraud Detection** - Protection from fake accounts
- 🚫 **Anti-Spam** - Clean platform

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native (iOS)                      │
│                    + React Web (Future)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Platform                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │ PostgreSQL  │  │ Realtime    │  │    Storage      │    │
│  │ + PostGIS   │  │ WebSocket   │  │  (Images/Files) │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Edge Functions                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Auth     │  │ Events   │  │ Messages │  │ AI       │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native 0.76+ |
| Web | Next.js 14, React 18 |
| Database | PostgreSQL 15 + PostGIS |
| Realtime | Supabase Realtime |
| Storage | Supabase Storage |
| Auth | Telegram + JWT |
| Maps | Mapbox GL |
| Analytics | PostHog |
| Error Tracking | Sentry |
| CI/CD | GitHub Actions |
| Hosting | Supabase Edge + Render |

## 📁 Project Structure

```
linkup-new/
├── src/
│   ├── __tests__/              # Test setup and utilities
│   ├── application/             # Application layer
│   │   ├── ai/                 # AI DTOs and handlers
│   │   ├── auth/               # Authentication
│   │   ├── events/             # Event handlers
│   │   ├── health/             # Health checks
│   │   └── ...
│   ├── config/                 # Configuration
│   │   ├── version.ts          # Version info
│   │   ├── feature-flags.ts    # Feature flags
│   │   └── remote-config.ts    # Remote config
│   ├── domain/                 # Domain layer
│   │   ├── ai/                  # AI entities and services
│   │   ├── events/             # Event domain
│   │   ├── users/              # User domain
│   │   ├── profiles/           # Profile domain
│   │   └── ...
│   ├── hooks/                  # React hooks
│   ├── infrastructure/         # Infrastructure
│   │   ├── supabase/           # Supabase client
│   │   └── ...
│   └── ui/                     # UI components
│       ├── components/         # Reusable components
│       ├── screens/            # App screens
│       ├── navigation/         # Navigation
│       └── theme/              # Design system
├── supabase/
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge functions
├── tests/
│   ├── e2e/                    # E2E tests
│   ├── performance/            # Load tests
│   └── security/               # Security tests
├── docs/                       # Documentation
│   ├── architecture/           # Architecture docs
│   ├── infrastructure/         # Infra docs
│   ├── api/                    # API docs
│   └── qa/                     # QA docs
└── infrastructure/             # Infrastructure configs
    └── environments/           # Environment configs
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase CLI
- iOS Simulator or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/vbdondarenko-cell/linkup-new.git
cd linkup-new

# Install dependencies
npm install

# Setup environment
cp infrastructure/environments/development/.env.example .env.local
# Edit .env.local with your values

# Link Supabase project
supabase login
supabase link --project-ref <your-project-ref>

# Run database migrations
npm run db:migrate

# Start development
npm run dev
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External Services
MAPBOX_TOKEN=your-mapbox-token
SENTRY_DSN=your-sentry-dsn
POSTHOG_KEY=your-posthog-key

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
```

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all

# Coverage report
npm run test:coverage
```

## 📦 Deployment

### Staging (Automatic)
Push to `develop` branch for automatic deployment.

### Production (Manual)
1. Create PR from `develop` to `main`
2. Review and approve
3. Merge to `main`
4. Approve deployment in GitHub Actions

See [Deployment Guide](docs/infrastructure/06_DEPLOYMENT_GUIDE.md) for details.

## 📚 Documentation

| Category | Documentation |
|----------|--------------|
| Architecture | [docs/architecture/](docs/architecture/) |
| API | [docs/api/](docs/api/) |
| AI | [docs/ai/](docs/ai/) |
| Infrastructure | [docs/infrastructure/](docs/infrastructure/) |
| QA | [docs/qa/](docs/qa/) |
| Testing | [docs/qa/01_TESTING_GUIDE.md](docs/qa/01_TESTING_GUIDE.md) |

## 🔒 Security

- [Security Documentation](docs/infrastructure/05_SECURITY.md)
- [Security Tests](tests/security/security.test.ts)

Report security issues: security@linkup.app

## 📊 Version History

See [CHANGELOG.md](.github/CHANGELOG_TEMPLATE.md) for detailed version history.

### Version 1.0.0
- Initial production release
- Core features: Events, Chat, Maps, Auth
- AI recommendations
- Trust system
- Premium features
- Production infrastructure

## 🗺️ Roadmap

| Version | Focus |
|---------|-------|
| 1.x | Quality, Performance, Growth |
| 2.0 | AI Assistant, Semantic Search |
| 3.0 | Business Marketplace |
| 4.0 | Community Ecosystem |
| 5.0 | Global Expansion |

See [docs/ROADMAP.md](docs/ROADMAP.md) for detailed roadmap.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 👥 Team

- **Vladyslav Bondarenko** - Lead Developer

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend platform
- [React Native](https://reactnative.dev) - Mobile framework
- [Next.js](https://nextjs.org) - Web framework
- [Mapbox](https://mapbox.com) - Maps
- [Telegram](https://telegram.org) - Authentication

---

**Made with ❤️ for people who love real-life connections**

*Version 1.0.0 | Production Ready*
