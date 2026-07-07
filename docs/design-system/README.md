# LinkUp Design System

## Phase 6.0 - Presentation Layer + Design System Foundation

This is the foundation of the LinkUp design system, inspired by Apple's attention to detail with a focus on elegance, minimalism, and premium quality.

## Design Philosophy

### Core Principles

1. **Content First** - UI serves content, never competes with it
2. **Motion Second** - Animations are purposeful and functional
3. **Color Third** - Color is meaningful, not decorative
4. **Effects Last** - Effects support, not define

### Design Keywords

- Elegant
- Minimal
- Premium
- Readable
- Modern
- Human
- Fast
- Calm
- Confident

### What We're NOT Building

- ❌ Neon colors
- ❌ Oversized gradients
- ❌ Excessive blur
- ❌ Gaming aesthetics
- ❌ Crypto aesthetics
- ❌ Web3 aesthetics
- ❌ Glass everywhere

## Architecture

```
src/ui/
├── tokens/           # Design tokens (colors, spacing, typography)
├── theme/            # Light, Dark, System themes
├── components/       # Base UI components
│   └── base/        # Button, Input, Card, Avatar, Badge, Divider
├── layouts/         # Layout components
├── motion/          # Animation configuration
├── hooks/           # Custom React hooks
├── providers/       # Context providers
├── utils/           # Utility functions
└── icons/          # Icon system (future)
```

## Design Tokens

### Colors

Semantic color system with full Light and Dark theme support:

```typescript
// Usage
import { colors } from './tokens/colors';

// Primary
colors.primary[500]  // Main primary color

// Semantic
colors.semantic.success.light
colors.semantic.danger.bg

// Premium/Feature badges
colors.premium.accent
colors.business.background
```

### Typography

Professional font stack with consistent scale:

```typescript
import { typography } from './tokens/typography';

// Variant styles
typography.largeTitle    // Large titles
typography.title1         // H1 headings
typography.headline        // Emphasized body
typography.body           // Default body text
typography.caption        // Small labels
```

### Spacing

4px base unit system:

```typescript
import { spacing } from './tokens/spacing';

spacing[4]    // 16px
spacing[6]    // 24px
spacing[8]    // 32px
```

### Border Radius

Consistent corner radii:

```typescript
import { radius } from './tokens/radius';

radius.sm      // 8px  - Small elements
radius.md      // 12px - Medium elements
radius.lg      // 16px - Cards
radius.full    // 9999px - Pills/circles
```

## Theme System

### Provider Setup

```tsx
import { ThemeProvider } from './providers/theme-provider';

export const App = () => (
  <ThemeProvider initialMode="system">
    {/* App content */}
  </ThemeProvider>
);
```

### Using Themes

```tsx
import { useTheme } from './providers/theme-provider';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Hello
      </Text>
    </View>
  );
};
```

### Theme Switching

```tsx
import { useThemeMode } from './providers/theme-provider';

const ThemeToggle = () => {
  const { mode, setMode, toggle, isDark } = useThemeMode();
  
  return (
    <Button onPress={toggle}>
      {isDark ? 'Switch to Light' : 'Switch to Dark'}
    </Button>
  );
};
```

## Components

### Button

```tsx
import { Button } from './components/base';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="muted">Muted</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// States
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>

// With Icons
<Button leftIcon={<Icon name="plus" />}>Create</Button>
```

### Input

```tsx
import { Input } from './components/base';

<Input
  label="Email"
  placeholder="Enter your email"
  error="Invalid email format"
  hint="We'll never share your email"
/>
```

### Card

```tsx
import { Card } from './components/base';

<Card variant="elevated" padding="large">
  <Text>Card Content</Text>
</Card>

<Card variant="outlined" interactive>
  <Text>Interactive Card</Text>
</Card>
```

### Avatar

```tsx
import { Avatar } from './components/base';

<Avatar src="https://..." name="John Doe" />
<Avatar size="large" name="JD" online />
<Avatar size="small" name="?" />
```

### Badge

```tsx
import { Badge } from './components/base';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Expired</Badge>
<Badge variant="premium">Premium</Badge>
<Badge variant="business">Business</Badge>
<Badge variant="organizer">Organizer</Badge>
```

## Layout Components

### Screen

```tsx
import { Screen } from './layouts';

<Screen scrollable keyboardAvoiding>
  {/* Content */}
</Screen>
```

### Container

```tsx
import { Container } from './layouts';

<Container maxWidth={800} center>
  {/* Centered content */}
</Container>
```

### Stacks

```tsx
import { VStack, HStack } from './layouts';

<VStack gap={4} align="center">
  <Text>Vertically Stacked</Text>
  <Button>Action</Button>
</VStack>

<HStack gap={2} justify="space-between">
  <Text>Left</Text>
  <Text>Right</Text>
</HStack>
```

### Section

```tsx
import { Section } from './layouts';

<Section title="Upcoming Events" subtitle="Based on your interests">
  {/* Events */}
</Section>

<Section headerRight={<Button size="small">View All</Button>}>
  {/* Content */}
</Section>
```

## Motion

### Animation Config

```typescript
import { animationConfig } from './motion/animation-config';

// Usage with Reanimated
withSpring(value, animationConfig.spring.default);
withTiming(value, { duration: animationConfig.normal.duration });
```

### Haptics

```typescript
import { useHaptics } from './hooks';

const MyButton = () => {
  const { success } = useHaptics();
  
  const onPress = () => {
    // Do something
    success(); // Trigger haptic
  };
  
  return <Button onPress={onPress}>Press Me</Button>;
};
```

## Responsive Design

```tsx
import { useResponsive } from './hooks';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();
  
  return (
    <View>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </View>
  );
};
```

## Accessibility

### Requirements

- WCAG AA minimum contrast ratios
- Touch targets ≥ 44px
- Keyboard navigation support
- Screen reader labels
- Dynamic Type support
- Reduced Motion support

### Usage

```tsx
<Button
  accessibilityLabel="Create new event"
  accessibilityHint="Double tap to create a new event"
  accessibilityRole="button"
>
  Create Event
</Button>
```

## Success Criteria ✅

- [x] Complete Design System foundation created
- [x] Theme system (Light/Dark/System) implemented
- [x] UI tokens (colors, spacing, typography, radius, shadows) implemented
- [x] Base components (Button, Input, Card, Avatar, Badge, Divider) implemented
- [x] Layout components (Screen, Container, VStack, HStack, Section) implemented
- [x] Motion system configuration created
- [x] Accessibility considerations integrated
- [x] Responsive design hooks provided
- [x] Design system documentation created

## Next Steps (Phase 6.1)

### Map Experience & Home Screen

1. Map component with markers and clusters
2. Home screen with event discovery
3. Search functionality
4. Filter and category navigation
5. Bottom sheet interactions
6. Real-time updates
