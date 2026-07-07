# LinkUp Design System 2026

## Official LinkUp Design Language 2026

This is the **official source of truth** for all LinkUp UI components and design decisions.

---

## 🎯 Design Philosophy

LinkUp is not a social network, dating app, or messenger. 

**LinkUp is a premium platform that helps people meet in real life.**

The interface must communicate:
- **Trust** - Users feel safe and secure
- **Human connection** - Warm, inviting, personal
- **Calm** - Never overwhelming, always peaceful
- **Premium quality** - Every detail is refined
- **Confidence** - Clear, decisive interactions
- **Simplicity** - Less is more, every tap counts

---

## 📐 Design Principles

1. **Content First** - Let the content breathe
2. **Whitespace First** - Generous spacing creates calm
3. **Typography First** - Type is the primary visual element
4. **Motion with Purpose** - Every animation has meaning
5. **Minimal Cognitive Load** - Reduce mental effort
6. **Every interaction under 3 taps** - Efficiency matters
7. **Every screen should feel calm** - Never chaotic

---

## 🛠️ Tech Stack

- **Framework**: React Native (Expo)
- **Styling**: StyleSheet with design tokens
- **Animation**: React Native Reanimated 3
- **Icons**: Lucide React Native
- **Fonts**: System fonts (SF Pro, Roboto)

---

## 📁 Design System Structure

```
src/ui/
├── tokens/           # Design tokens
│   ├── colors.ts     # Color system
│   ├── typography.ts  # Typography scale
│   ├── spacing.ts    # Spacing scale
│   ├── radius.ts     # Border radius
│   ├── shadows.ts    # Elevation system
│   ├── animation.ts   # Motion tokens
│   ├── haptics.ts    # Haptic feedback
│   ├── icons.ts      # Icon guidelines
│   ├── breakpoints.ts # Responsive breakpoints
│   └── z-index.ts    # Layering system
├── theme/            # Theme configuration
│   ├── light-theme.ts
│   ├── dark-theme.ts
│   └── theme.ts      # Utilities
├── providers/         # React context
│   └── theme-provider.tsx
├── motion/           # Animation utilities
├── components/       # UI components
│   └── base/         # Button, Input, Card, Avatar, Badge
└── hooks/            # Custom hooks
```

---

## 🎨 Color System

### Brand Colors

- **Primary**: Deep Ocean Blue - Trust, confidence
- **Secondary**: Soft Lavender - Human connection
- **Accent**: Fresh Mint - Success, growth

### Semantic Colors

- **Success**: Green - Completed actions
- **Warning**: Amber - Caution needed
- **Danger**: Red - Errors, destructive actions
- **Info**: Blue - Informational messages

### Surface Hierarchy

```
Background → Surface → Elevated → Floating → Overlay
```

### Never Hardcode Colors

❌ Don't use: `color: '#525252'`
✅ Do use: `color: theme.colors.text.secondary`

---

## ✏️ Typography System

### Type Scale

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| displayLG | 48px | Regular | Hero text |
| displayMD | 40px | Regular | Large display |
| largeTitle | 34px | Semibold | Screen headers |
| titleLG | 28px | Semibold | Section headers |
| headline | 17px | Semibold | Card titles |
| bodyLG | 17px | Regular | Primary content |
| bodyMD | 15px | Regular | Secondary content |
| caption | 12px | Regular | Timestamps, labels |

---

## 📏 Spacing System

Base unit: **4px**

```
4 → 8 → 12 → 16 → 20 → 24 → 32 → 40 → 48 → 64 → 80 → 96 → 128
```

### Usage

- Screen padding: `16px`
- Card padding: `16px` / `24px`
- Button padding: `12px 16px` (small) / `16px 24px` (large)
- Touch targets: minimum `44px`

---

## ⭕ Radius System

| Token | Value | Usage |
|-------|-------|-------|
| subtle | 4px | Minimal rounding |
| sm | 8px | Buttons, inputs |
| md | 12px | Cards, panels |
| lg | 16px | Modals, sheets |
| xl | 20px | Bottom sheets |
| full | 9999px | Avatars, badges |

---

## 🌑 Shadow System

### Elevation Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| base | none | Flat elements |
| surface | xs | Cards, list items |
| raised | sm | Elevated cards |
| floating | md | FABs, dropdowns |
| modal | lg | Modals, dialogs |

### Never Use Heavy Shadows

❌ Don't use: `boxShadow: '0 20px 50px rgba(0,0,0,0.3)'`
✅ Do use: `boxShadow: theme.shadows.elevation.modal`

---

## 🎬 Motion System

### Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| instant | 0ms | Immediate |
| fast | 100ms | Hover, micro |
| normal | 200ms | Standard |
| slow | 300ms | Reveals |
| slower | 400ms | Large transitions |

### Easing Curves

- `decelerate` - Content entering (default)
- `accelerate` - Content exiting
- `easeOutBack` - Emphasis, completion

### Motion Principles

1. **Purposeful** - Every animation has meaning
2. **Calm** - Never jarring or fast
3. **Responsive** - Instant feedback
4. **Consistent** - Same motion patterns

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Device |
|------------|-------|--------|
| xs | 0-639px | Phones |
| sm | 640-767px | Large phones |
| md | 768-1023px | Tablets |
| lg | 1024-1279px | Laptops |
| xl | 1280-1535px | Desktops |
| 2xl | 1536px+ | Large screens |

---

## 🔄 Themes

### Light Theme (Primary)

- Clean, calm, premium
- White/light gray backgrounds
- Subtle shadows
- High contrast text

### Dark Theme (Secondary)

- OLED-friendly pure black
- Carefully adjusted colors
- Not an inversion of light
- Reduced contrast for comfort

---

## ♿ Accessibility

### Requirements

- WCAG 2.1 AA+ compliance
- Touch targets ≥ 44px
- Dynamic Type support
- Reduced Motion support
- VoiceOver/TalkBack support
- High Contrast support

### Never Disable Accessibility

❌ Don't use: `accessibilityElementsHidden={true}`
✅ Do use: All interactive elements are accessible

---

## 📦 Component Guidelines

### File Structure

```
components/
└── ComponentName/
    ├── ComponentName.tsx
    └── index.ts
```

### Props Pattern

```typescript
interface ComponentProps {
  // Required
  children: ReactNode;
  
  // Optional with defaults
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  
  // States
  disabled?: boolean;
  loading?: boolean;
  
  // Events
  onPress?: () => void;
}
```

---

## 🚫 What NOT To Use

- ❌ Crypto/Web3 UI patterns
- ❌ Neon or RGB colors
- ❌ Huge gradients
- ❌ Heavy glassmorphism
- ❌ Huge shadows
- ❌ Tiny text
- ❌ Visual noise
- ❌ Overloaded cards
- ❌ Decorative effects

---

## ✅ Success Criteria

- [x] Design tokens implemented
- [x] Light theme implemented
- [x] Dark theme implemented
- [x] Typography system complete
- [x] Motion system defined
- [x] Haptic feedback supported
- [x] Accessibility guidelines
- [x] Component patterns established

---

## 📚 Resources

- [React Native Docs](https://reactnative.dev)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Lucide Icons](https://lucide.dev)
- [Accessibility Guide](https://reactnative.dev/docs/accessibility)

---

*Last updated: LinkUp Design System v6.0 (2026)*
