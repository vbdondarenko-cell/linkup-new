# LinkUp Home Experience

## Phase 7.0 - Home Experience + Map Experience

This document covers the complete Home Experience implementation for LinkUp V5.

## Philosophy

The Home Experience is the **heart of LinkUp**. The map is the product - everything else supports it.

### Key Principles

1. **Map First** - The map occupies the maximum visual area
2. **Zero Friction** - Users understand the app within 5 seconds
3. **Effortless Discovery** - Events appear naturally while exploring
4. **Premium Feel** - Apple-quality interactions and animations

### What Home Is NOT

- ❌ A dashboard
- ❌ A social timeline
- ❌ A scrolling feed
- ❌ A list view

## Layout Architecture

```
┌─────────────────────────────────────────────┐
│              Status Bar                       │
├─────────────────────────────────────────────┤
│              Safe Area Top                   │
├─────────────────────────────────────────────┤
│           HomeHeader                         │
│         (Greeting + Location)              │
├─────────────────────────────────────────────┤
│         FloatingSearch                       │
│         (Glass Surface)                   │
├─────────────────────────────────────────────┤
│         FilterChips                          │
│         (Horizontal Scroll)               │
├─────────────────────────────────────────────┤
│              MapContainer                   │
│           (Full Screen Map)                │
├─────────────────────────────────────────────┤
│           FloatingDock                      │
│       (Bottom Navigation)                 │
└─────────────────────────────────────────────┘
```

## Components

### HomeHeader

Displays user context at the top of the screen.

**Elements:**
- Dynamic greeting (Good Morning/Afternoon/Evening)
- Current city with location indicator
- Notification bell with badge
- User avatar

### FloatingSearch

Glass-morphism search interface.

**Features:**
- Searches events, organizers, businesses, interests, addresses
- Shows recent searches
- Voice input placeholder (future)
- Animated placeholder cycling

### FilterChips

Horizontal scrolling category filters.

**Categories:**
- All, Coffee, Sports, Music, Gaming, Travel
- Business, Food, Art, Education, Nightlife, Volunteering

### MapContainer

Full-screen interactive map with event markers.

**Marker Types:**
| Type | Color |
|------|-------|
| User Event | Primary (Indigo) |
| Organizer Event | Purple |
| Verified Business | Blue |
| Premium | Gold |

### BottomSheet

Elastic, gesture-driven bottom sheet.

**Snap Points:**
| State | Height |
|-------|--------|
| Collapsed | 120px |
| Medium | 45% screen |
| Expanded | 90% screen |

### EventPreview

Event card shown in bottom sheet.

**Elements:**
- Cover image, Title, Organizer
- Badges (Verified, Premium, Organizer)
- Date/Time, Participant count
- Action buttons (Join, Share, Favorite, Report)

### FloatingDock

Bottom navigation bar.

**Tabs:**
- Map, Events, Create, Chats, Profile

## Success Criteria ✅

- [x] Home screen architecture implemented
- [x] Map becomes the central experience
- [x] Search works with glass surface
- [x] Filters work with horizontal chips
- [x] Marker interactions feel premium
- [x] Bottom Sheet works with gesture-driven snap points
- [x] Floating Dock is production-ready
- [x] Event Preview shows essential info
- [x] Empty state implemented
- [x] Offline banner implemented
