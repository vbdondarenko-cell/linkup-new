# Premium Experience

## Purpose

This document describes the Premium Experience for LinkUp V6, an optional subscription that enhances the user experience without providing unfair advantages.

## Scope

- Premium Home
- Subscription Plans
- Reward Premium
- Premium Themes
- FAQ
- Settings
- Purchase Flow

---

## Philosophy

### Community First

LinkUp is community-first. Premium supports the product:

- Free users have a complete experience
- Premium never manipulates users
- Nothing affects event ranking unfairly
- Nothing affects recommendations

### What Premium Is NOT

Premium is NOT about:
- Gaining unfair advantages
- Manipulating user behavior
- Artificial urgency
- Fake discounts
- Dark patterns

### What Premium IS

Premium IS about:
- Convenience
- Personalization
- Advanced tools
- Priority support
- Exclusive themes

---

## Premium Home

### Hero Section

**Elements:**
- Premium Badge (⭐ icon)
- Hero Illustration
- Headline ("Elevate Your Experience" / "You're Premium!")
- Value Proposition
- CTA Button

**States:**
- Free user view
- Premium user view

### Benefits List

**Premium Benefits:**
| Icon | Feature | Description |
|------|---------|-------------|
| 🎨 | Premium Themes | Express yourself with exclusive themes |
| 🔍 | Advanced Filters | Find events your way |
| 📊 | Extended Analytics | Deep insights |
| 📅 | Unlimited Events | Create more, connect more |
| 💬 | Priority Support | Get help when you need it |
| ⭐ | Exclusive Badge | Stand out in the community |

### Plans

**Available Plans:**
| Plan | Price | Interval | Savings |
|------|-------|----------|---------|
| Monthly | $9.99 | month | — |
| Yearly | $79.99 | year | 33% |

### Comparison Table

| Feature | Free | Premium |
|---------|------|---------|
| Event Creation | 3/month | Unlimited |
| Themes | Default only | 10+ themes |
| Event Filters | Basic | Advanced |
| Analytics | Basic stats | Deep insights |
| Profile Badges | 1 | Unlimited |
| Support | Community | Priority |

---

## Subscription Plans

### Plan Card

**Display:**
- Plan name
- Price
- Billing period
- Savings badge (yearly)
- Current plan indicator
- Feature list
- Popular badge (yearly)

**States:**
- Default
- Selected
- Current Plan

### Purchase Flow

1. Select Plan
2. Confirmation Screen
3. Payment
4. Verification
5. Activation
6. Success Animation

---

## Reward Premium

### How It Works

1. Watch 5 rewarded advertisements
2. Receive 24 hours of Premium for free
3. 72-hour cooldown after each reward

### Display

**Progress:**
- Ads watched (X/5)
- Progress bar
- Remaining ads count
- Reward duration

**States:**
- Active (can watch ad)
- In cooldown
- Premium unlocked

### After Watching Ad

- Progress animation
- Updated count
- Confetti animation (optional)

### After Unlocking

- Premium activation animation
- Unlocked features displayed
- Expiration countdown

---

## Premium Themes

### Available Themes

| Theme | Icon | Premium Required | Colors |
|-------|------|------------------|--------|
| System | 🖥️ | No | Follows system |
| Dark | 🌙 | No | Dark mode |
| Midnight | 🌌 | Yes | Deep blue/purple |
| Ocean | 🌊 | Yes | Cyan/teal |
| Forest | 🌲 | Yes | Green tones |
| Sunrise | 🌅 | Yes | Orange/amber |
| Graphite | ⬛ | Yes | Dark gray |
| Copper | 🟤 | Yes | Brown tones |
| Aurora | ✨ | Yes | Pink/purple |

### Theme Selector

**Display:**
- Theme preview card
- Theme name
- Premium lock badge
- Selected indicator

### Theme Preview

Mini UI preview showing:
- Primary color
- Surface color
- Text colors
- Button style

---

## Premium Badges

### Badge Types

- **Profile Badge**: ⭐ Premium shown on profile
- **Event Badge**: Shown on events created by Premium users
- **Organizer Badge**: Shown on organizer dashboard

### Badge Design

- Elegant, minimal
- Gold color (#FFD700)
- No glowing effects
- Simple icon + text

---

## FAQ

### Categories

- General
- Subscription
- Reward
- Privacy
- Refund

### Sample Questions

**What is Premium?**
Premium is an optional subscription that enhances your LinkUp experience with exclusive themes, advanced features, and priority support. Free users always have a complete experience.

**Does Premium affect my visibility?**
No. Premium never affects event ranking, recommendations, or search results. It's purely about convenience and personalization.

**How does Reward Premium work?**
Watch 5 rewarded advertisements to unlock 24 hours of Premium for free. After claiming your reward, there's a 72-hour cooldown before you can earn another reward.

---

## Settings

### Premium Settings

**Sections:**
- Current Plan
- Theme Selection
- Notifications
- Account Actions

### Notifications

**Types:**
- Expiration Reminders
- Reward Reminders

### Account Actions

- Restore Purchase
- Contact Support

---

## File Structure

```
src/features/premium/
├── premium-home/
│   └── premium-home-screen.tsx
├── plans/
│   └── plans-screen.tsx
├── comparison/
│   └── comparison-screen.tsx
├── reward/
│   └── reward-screen.tsx
├── themes/
│   └── themes-screen.tsx
├── subscription/
│   └── subscription-screen.tsx
├── billing/
│   └── billing-screen.tsx
├── faq/
│   └── faq-screen.tsx
├── settings/
│   └── settings-screen.tsx
├── notifications/
│   └── notifications-screen.tsx
├── components/
│   ├── index.ts
│   ├── premium-hero.tsx
│   ├── benefit-card.tsx
│   ├── plan-card.tsx
│   ├── reward-premium.tsx
│   ├── theme-selector.tsx
│   └── comparison-table.tsx
├── hooks/
│   ├── index.ts
│   └── use-premium-state.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## Animations

### Hero
- FadeIn for container
- FadeInUp for elements
- Spring animations

### Plan Cards
- Scale on press
- Border highlight on selection
- Spring bounce

### Reward Progress
- Progress bar animation
- Dot fill animation
- Confetti on unlock

### Theme Selection
- Smooth preview
- Selection border
- Lock animation for premium themes

---

## Microinteractions

### Buttons
- Compress naturally
- Haptic feedback
- Loading states

### Cards
- Soft elevation
- Press scale (0.98)
- Border highlight

### Progress
- Smooth transitions
- Number counting
- Bar filling

---

## Accessibility

### VoiceOver
- Semantic labels
- Plan descriptions
- Progress announcements

### Touch Targets
- Minimum 44px
- Proper spacing
- Easy tap areas

### Dynamic Type
- Flexible layouts
- Scalable text
- Max/min constraints

---

## Offline Support

- Cached subscription status
- Cached theme selection
- Sync purchases on reconnect
- Queue updates

---

*Last Updated: V6.0*
*Owner: Engineering Team*
*Review Frequency: Per Release*
