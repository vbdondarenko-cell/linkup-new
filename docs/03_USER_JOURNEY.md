# User Journey

## Purpose

This document maps every user flow in LinkUp from initial discovery through long-term retention. Each flow is documented with user actions, system responses, and key decision points.

## Scope

- Onboarding flows
- Discovery flows
- Event participation flows
- Organizer flows
- Business flows
- Retention flows

## Master User Flow Overview

```
INSTALLATION
     ↓
TELEGRAM LOGIN
     ↓
ONBOARDING
     ↓
INTERESTS
     ↓
LOCATION PERMISSION
     ↓
MAP
     ↓
DISCOVER
     ↓
JOIN EVENT
     ↓
APPROVAL
     ↓
CHAT
     ↓
OFFLINE MEETING
     ↓
RATING
     ↓
XP
     ↓
BADGES
     ↓
RETURN
```

## Detailed User Flows

### 1. Installation Flow

**Trigger:** User downloads LinkUp from App Store or Play Store

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 1.1 | Open app | Show splash screen with logo |
| 1.2 | — | Check for existing session |
| 1.3 | — | If no session, show login screen |
| 1.4 | — | If session exists, show map |

**Edge Cases:**
- App updated from previous version → Migrate data, maintain session
- Device storage full → Show warning, suggest clearing cache
- Corrupted local data → Clear and re-sync

**Future Expansion:**
- Deep link handling for event invites
- Universal links from organizer referrals

**Dependencies:**
- Telegram Mini App SDK
- Local storage system

---

### 2. Telegram Login Flow

**Trigger:** User reaches login screen (new user or no session)

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 2.1 | Tap "Continue with Telegram" | Open Telegram auth dialog |
| 2.2 | Approve Telegram auth | Receive auth data |
| 2.3 | — | Validate auth token with backend |
| 2.4 | — | Create/update user record |
| 2.5 | — | Generate session token |
| 2.6 | — | Initialize local database |
| 2.7 | — | Navigate to onboarding |

**Required Permissions:**
- Telegram identity verification

**Edge Cases:**
- User denies Telegram auth → Show explanation, retry option
- Telegram account restricted → Show error, contact support
- Network failure during auth → Retry with exponential backoff
- Invalid/expired Telegram auth → Prompt re-authentication

**Business Rules:**
- One account per Telegram user
- No anonymous/provisional accounts
- Auth tokens expire after 30 days of inactivity

**Future Expansion:**
- Support for multiple Telegram accounts
- Linking additional verification methods

**Dependencies:**
- Supabase Auth
- Telegram Authentication SDK

---

### 3. Onboarding Flow

**Trigger:** User successfully authenticated for first time

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 3.1 | View welcome screen | Show value proposition |
| 3.2 | Tap "Get Started" | — |
| 3.3 | View privacy overview | Explain data handling |
| 3.4 | Acknowledge privacy | Continue to interests |
| 3.5 | — | Navigate to interests screen |

**Screen Content:**
- Welcome message with product vision
- Brief video or illustration of key features
- Privacy commitment statement
- Clear CTA to continue

**Business Rules:**
- Onboarding shown only on first login
- Can be replayed from settings
- Progress saved if interrupted

**Edge Cases:**
- User skips onboarding → Mark as complete, proceed
- App killed during onboarding → Resume on next launch
- Returning user resets onboarding → Always first-time only

**Future Expansion:**
- Personalized onboarding based on source
- Interactive tutorial on first event discovery

**Dependencies:**
- Onboarding state tracking
- Analytics for completion rates

---

### 4. Interests Selection Flow

**Trigger:** User completes onboarding

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 4.1 | View interest categories | Show scrollable grid |
| 4.2 | Browse categories | — |
| 4.3 | Select interests | Toggle selection state |
| 4.4 | Select minimum 3 interests | Enable continue button |
| 4.5 | Tap "Continue" | — |
| 4.6 | — | Save interests to profile |
| 4.7 | — | Navigate to location permission |

**Interest Categories:**
- Sports & Fitness
- Arts & Culture
- Food & Drink
- Music
- Technology
- Games
- Outdoors & Nature
- Books & Learning
- Social & Networking
- Health & Wellness
- Travel & Adventure
- Pets & Animals

**Business Rules:**
- Minimum 3 interests required
- Maximum 10 interests allowed
- Can be changed later in settings
- Interests influence recommendation engine

**Edge Cases:**
- User selects fewer than 3 → Show gentle prompt
- User tries to continue with 0 → Disable button
- Interests page refreshes → Maintain selections

**Future Expansion:**
- Sub-categories within main categories
- Interest intensity levels
- Event-type preferences

**Dependencies:**
- Interest data catalog
- Recommendation engine

---

### 5. Location Permission Flow

**Trigger:** User completes interests selection

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 5.1 | View location request | Explain why needed |
| 5.2 | Tap "Enable Location" | Request system permission |
| 5.3 | Grant permission | — |
| 5.4 | — | Fetch current location |
| 5.5 | — | Calculate nearby events |
| 5.6 | — | Navigate to map with events |

**Permission Request Copy:**
"LinkUp needs your location to show events near you. Your location is never stored or shared—it's only used to find nearby events."

**Business Rules:**
- Location used for event discovery only
- Approximate location (1km+) preferred over exact
- Can be changed to "While Using" later
- Events visible without location (search-based)

**Edge Cases:**
- User denies location → Navigate to map with search mode
- User selects "Ask Once" → Use only this session
- Location services disabled in settings → Show manual location entry
- Location very far from user → Offer to update manually

**Privacy:**
- Exact location shared only with event organizer after approval
- Location data not stored long-term
- No background location tracking

**Future Expansion:**
- Save favorite locations
- Location-based notifications
- Offline map downloads for saved locations

**Dependencies:**
- Geolocation API
- Map SDK

---

### 6. Map Discovery Flow

**Trigger:** User grants location permission OR opts to search

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 6.1 | View map | Load centered on user location |
| 6.2 | Pan/zoom map | Update visible event pins |
| 6.3 | — | Show clusters when zoomed out |
| 6.4 | Tap event pin | Show event preview card |
| 6.5 | Tap preview card | Navigate to event details |
| 6.6 | — | OR: Tap "See All" to list events |

**Map Interactions:**

| Action | System Response |
|--------|-----------------|
| Pan map | Load events in visible area |
| Zoom in | Expand clusters to individual pins |
| Zoom out | Cluster nearby events |
| Tap pin | Show event preview (title, date, attendees) |
| Long press | Show quick actions (share location, create event) |
| Double tap | Zoom in one level |
| Two-finger tap | Zoom out one level |

**Event Pin States:**
- Default: Blue pin with category icon
- User's event: Green pin
- Almost full: Yellow pin
- Full/Waitlist: Red pin
- Live now: Pulsing blue pin
- Premium featured: Gold pin

**Business Rules:**
- Events load within 500m of visible map area
- Maximum 100 pins shown at once
- Clusters expand on zoom
- Events update every 5 minutes

**Edge Cases:**
- No events in area → Show "No events nearby" + expand radius option
- Very dense area → Show "Too many events" + zoom prompt
- Offline → Show cached events + "Offline mode" indicator
- Slow connection → Show skeleton pins + loading state

**Future Expansion:**
- Custom map styles
- Heat maps for popular areas
- Time-based event filtering
- Walking/transit directions to events

**Dependencies:**
- Map SDK (Mapbox/MapKit)
- Event clustering library
- Offline tile caching

---

### 7. Event Discovery Flow

**Trigger:** User explores map or searches for events

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 7.1 | View event list/grid | Show events sorted by recommendation |
| 7.2 | Filter events | Apply selected filters |
| 7.3 | Sort events | Reorder based on criteria |
| 7.4 | Search events | Query by keyword/address |
| 7.5 | Tap event card | Navigate to event details |
| 7.6 | — | Record discovery action |

**Filter Options:**
- Category (multiple selection)
- Date (Today, Tomorrow, This Week, This Month)
- Time (Morning, Afternoon, Evening, Night)
- Distance (1km, 5km, 10km, 25km)
- Price (Free, Paid, Any)
- Capacity (Spots available, Any)

**Sort Options:**
- Recommended (default)
- Nearest
- Soonest
- Most Popular
- Highest Rated

**Business Rules:**
- Filters persist across sessions
- Results paginated (20 per page)
- Search has 500ms debounce
- Maximum 200 results per query

**Edge Cases:**
- No matching results → Show suggestions, clear filters option
- Too many filters → Show active filter count + clear all
- Search with no results → Suggest spelling alternatives
- Location changed → Offer to update discovery area

**Recommendation Engine Inputs:**
See Document 16_RECOMMENDATION_ENGINE.md

**Future Expansion:**
- Save search filters
- Create alerts for new matching events
- Collaborative filtering based on friends' interests

**Dependencies:**
- Search API
- Recommendation engine
- Filter caching

---

### 8. Event Details Flow

**Trigger:** User taps event from map or list

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 8.1 | View event details | Load full event information |
| 8.2 | View organizer profile | Navigate to organizer preview |
| 8.3 | View attendee preview | Show sample attendee avatars |
| 8.4 | View event location | Show on mini-map |
| 8.5 | Tap "Join" | Check requirements |
| 8.6 | — | If requires approval → Show request flow |
| 8.7 | — | If open join → Show confirmation |
| 8.8 | Confirm action | — |

**Event Detail Sections:**

| Section | Content |
|---------|---------|
| Header | Title, date, time, category badge |
| Cover | Event image (if any) |
| Location | Address, map preview, distance |
| Description | Full event details, what to expect |
| Organizer | Avatar, name, trust score, verified badge |
| Attendees | Current/max, sample avatars, waitlist count |
| Series | If part of series, link to series |
| Related | Similar events user might like |
| Actions | Join/Request, Share, Save, Report |

**Business Rules:**
- Organizer visible trust score calculated from ratings
- Waitlist shown only when event is full
- Join confirmation required (not automatic)
- Event details cached for offline access

**Edge Cases:**
- Event full → Show waitlist option
- Event ended → Show past event view with feedback
- Event cancelled → Show cancellation notice
- User already joined → Show "You're In" state
- User blocked by organizer → Show permission denied

**Future Expansion:**
- Event photos gallery
- Discussion thread
- Event countdown
- Calendar integration

**Dependencies:**
- Event API
- Trust score service
- Offline cache

---

### 9. Join Request Flow

**Trigger:** Event requires approval to join

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 9.1 | Tap "Request to Join" | Open request form |
| 9.2 | Fill request (if required) | Add message to organizer |
| 9.3 | Tap "Send Request" | — |
| 9.4 | — | Create join request record |
| 9.5 | — | Send notification to organizer |
| 9.6 | — | Show "Request Pending" state |
| 9.7 | — | Return to event details |

**Request Form (if required by organizer):**
- Message to organizer (optional, 500 char max)
- Confirmation checkbox

**Business Rules:**
- One pending request per user per event
- Request expires after 7 days
- Cannot request if previously rejected
- Cannot request if blocked by organizer

**Edge Cases:**
- Request timeout → Show expired message, allow retry
- Organizer offline → Notify when back online
- Event fills before response → Auto-reject, notify user
- Duplicate request → Show "Already Requested" state

**Notification Sent:**
"New join request for [Event Name] from [User Name]"

**Future Expansion:**
- Request templates
- Quick-join for trusted users
- Organizer can request users to join

**Dependencies:**
- Request API
- Notification service

---

### 10. Join Approval Flow (Organizer View)

**Trigger:** Organizer receives join request

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 10.1 | Receive notification | Show join request alert |
| 10.2 | Open LinkUp | Navigate to requests |
| 10.3 | View requester profile | See trust score, history |
| 10.4 | Review profile | — |
| 10.5 | Tap Approve/Reject | — |
| 10.6 | Confirm decision | — |
| 10.7 | — | Update request status |
| 10.8 | — | Notify requester |

**Organizer Information Shown:**
- User name and avatar
- Trust score (without formula)
- Member since date
- Past attendance (as %)
- Past ratings given
- Past events attended
- Mutual interests

**Business Rules:**
- Default approval timeout: 48 hours
- Auto-reject if event fills during review
- Organizer can add note with rejection
- Batch approve/reject available

**Edge Cases:**
- Organizer removes event → Auto-reject all, notify
- Requester cancels → Remove from queue
- Organizer account suspended → Pause requests
- Multiple organizers → Any can approve

**Future Expansion:**
- Auto-approval rules based on trust score
- Suggested approvals based on compatibility
- Bulk import from trusted lists

**Dependencies:**
- Request management API
- Trust score service
- Notification service

---

### 11. Direct Join Flow

**Trigger:** Event allows direct join (no approval needed)

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 11.1 | Tap "Join Event" | Show confirmation modal |
| 11.2 | Confirm join | — |
| 11.3 | — | Create attendance record |
| 11.4 | — | Decrement available spots |
| 11.5 | — | Generate ticket (if applicable) |
| 11.6 | — | Show success state |
| 11.7 | — | Navigate to event home |

**Confirmation Modal:**
- Event name and date
- "You're about to join this event"
- "You commit to attending"
- [Cancel] [Confirm Join]

**Business Rules:**
- User cannot join if event is full
- User cannot join if already joined
- User cannot join if event has ended
- Join confirmation adds to attendance score

**Edge Cases:**
- Event fills during confirmation → Show full state, offer waitlist
- Payment required → Navigate to payment flow
- User not verified → Show verification prompt
- Duplicate join attempt → Show "Already Joined" state

**Future Expansion:**
- Calendar reminder creation
- Share with Telegram friends
- Invite others to join

**Dependencies:**
- Event API
- Payment service (if paid)
- Calendar integration

---

### 12. Chat Flow

**Trigger:** User successfully joins an event

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 12.1 | Navigate to event | Show event home |
| 12.2 | Tap "Chat" | Open event chat |
| 12.3 | Read previous messages | Load message history |
| 12.4 | Type message | Show typing indicator |
| 12.5 | Send message | — |
| 12.6 | — | Broadcast to participants |
| 12.7 | — | Update local message list |
| 12.8 | View responses | Real-time updates |

**Chat Features:**

| Feature | Description |
|---------|-------------|
| Text messages | Up to 1000 characters |
| Image sharing | Compressed, max 5 images |
| Location sharing | Pin drops on event map |
| Reactions | Emoji reactions (👏 🔥 ❤️ 😊 🤔) |
| Reply threads | Nested replies (one level) |

**Business Rules:**
- Only event participants can access chat
- Chat disabled until 24 hours before event
- Chat deleted 6 hours after event ends
- No editing or deleting after send
- Moderators can pin messages and mute users

**Edge Cases:**
- Chat not yet enabled → Show "Chat opens 24h before"
- Chat expired → Show "Chat has ended"
- User removed from event → Lose chat access immediately
- Large image upload → Compress and show progress
- Network issue → Queue message, retry on reconnect

**Chat States:**
- Pre-event: Active discussion
- Event active: Live updates
- Post-event: Retrospective discussion
- Expired: Read-only archive (6 hours)
- Deleted: No longer accessible

**Future Expansion:**
- Event-specific stickers
- Polls and voting
- Speaker/Q&A mode
- Voice messages

**Dependencies:**
- Supabase Realtime
- Message storage
- Push notifications

---

### 13. Event Check-In Flow

**Trigger:** Event start time arrives OR user arrives at event location

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 13.1 | User arrives at location | — |
| 13.2 | Open event in app | Show "Check In" option |
| 13.3 | Tap "Check In" | Request location verification |
| 13.4 | Confirm location | — |
| 13.5 | — | Verify user within event radius |
| 13.6 | — | Record attendance confirmation |
| 13.7 | — | Award check-in XP |
| 13.8 | — | Show "Checked In" state |

**Location Verification:**
- User must be within 500m of event location
- Uses approximate location (not exact)
- Verification cached for 30 minutes

**Business Rules:**
- Check-in available 1 hour before to 1 hour after start
- Only verified attendees can check in
- Cannot check in if marked absent previously
- Late check-in still counts

**Edge Cases:**
- Location far from event → Show directions option
- Already checked in → Show "Already Checked In"
- Event not started → Show "Check-in available at [time]"
- GPS issues → Offer manual check-in (may require organizer)

**Future Expansion:**
- NFC/Bluetooth check-in
- QR code scanning
- Group check-in for organizer
- Auto check-in based on停留时间

**Dependencies:**
- Geolocation verification
- Attendance tracking

---

### 14. Offline Meeting Flow

**Trigger:** User physically attends event

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 14.1 | Attend event | Organizer marks event started |
| 14.2 | Participate | — |
| 14.3 | Event ends | — |
| 14.4 | — | Mark event as completed |
| 14.5 | — | Record attendance completion |
| 14.6 | — | Trigger feedback prompts |
| 14.7 | — | Close chat (6-hour countdown) |

**Offline Meeting Characteristics:**
- No app interaction required
- Connection happens in physical space
- Shared experience builds trust
- Natural conversation based on event activity

**System Recording (with consent):**
- Attendance verification
- Event completion
- Duration estimate (check-in to check-out)

**Business Rules:**
- Event marked complete by organizer
- Attendance recorded for all checked-in users
- Feedback prompts sent within 24 hours
- XP awarded for attendance

**Edge Cases:**
- User leaves early → Record partial attendance
- Event cancelled mid-way → Handle as cancelled, no attendance
- No-show despite check-in → Flag for review
- Organizer no-show → Allow attendees to report

**Future Expansion:**
- Post-event meetup suggestions
- Photo sharing from event
- Connection suggestions based on interactions

**Dependencies:**
- Attendance tracking
- Event status management

---

### 15. Rating Flow

**Trigger:** Event ends, user is prompted for feedback

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 15.1 | Receive rating prompt | Show feedback screen |
| 15.2 | Rate event (1-5 stars) | — |
| 15.3 | Rate organizer (1-5 stars) | — |
| 15.4 | Write review (optional) | Max 500 characters |
| 15.5 | Select anonymous | Toggle anonymous option |
| 15.6 | Submit feedback | — |
| 15.7 | — | Record ratings and reviews |
| 15.8 | — | Update trust scores |
| 15.9 | — | Award rating XP |

**Rating Criteria:**
- Overall experience (required)
- Organizer rating (required)
- Would recommend (implied by stars)

**Optional Feedback:**
- What you liked
- What could improve
- Topics for future events

**Business Rules:**
- Prompt sent 1 hour after event end
- Rating window: 7 days after event
- Cannot rate without attendance record
- Can update rating within 24 hours
- Anonymous ratings still count in trust score

**Edge Cases:**
- User ignores prompt → No rating recorded
- Late rating (after 7 days) → Decline with explanation
- Rating without attendance → Reject with error
- Suspicious rating patterns → Flag for review

**Trust Score Impact:**
See Document 09_REPUTATION_SYSTEM.md

**Future Expansion:**
- Photo sharing with rating
- Detailed rubric ratings
- Rating categories by event type

**Dependencies:**
- Rating API
- Trust score service
- Notification service

---

### 16. XP Award Flow

**Trigger:** User completes XP-generating action

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 16.1 | Complete action | Trigger XP event |
| 16.2 | — | Calculate XP earned |
| 16.3 | — | Check level thresholds |
| 16.4 | — | Update user XP total |
| 16.5 | — | Check for level up |
| 16.6 | — | Show XP notification |

**XP Sources:**
- Profile completion: 50 XP
- First event join: 100 XP
- Event attendance: 150 XP
- Event rating: 50 XP
- Check-in: 25 XP
- Review written: 30 XP
- Series subscription: 75 XP
- Invite accepted: 100 XP

**Level Thresholds:**
- Level 1: 0 XP
- Level 2: 200 XP
- Level 3: 500 XP
- Level 4: 1000 XP
- Level 5: 2000 XP
- Level 6: 4000 XP
- Level 7: 7500 XP
- Level 8: 12000 XP
- Level 9: 20000 XP
- Level 10: 35000 XP

**Business Rules:**
- XP never decreases
- XP is permanent
- Level displayed on profile
- Some features unlock at levels

**Edge Cases:**
- Multiple actions same time → Process sequentially
- XP overflow → Cap at maximum (no overflow)
- Offline XP earning → Queue and sync
- Duplicate XP detection → Prevent double-counting

**Level Up Notification:**
"🎉 Level Up! You're now Level [N]. Keep exploring and connecting!"

**Future Expansion:**
- Seasonal XP multipliers
- Bonus XP for streaks
- Premium XP multipliers
- XP leaderboards

**Dependencies:**
- XP service
- Level calculation
- Notification service

---

### 17. Badge Award Flow

**Trigger:** User meets badge criteria

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 17.1 | Complete badge criteria | Trigger badge check |
| 17.2 | — | Evaluate badge rules |
| 17.3 | — | If criteria met → Award badge |
| 17.4 | — | Record badge to profile |
| 17.5 | — | Show badge notification |
| 17.6 | — | Check for badge collection |

**Badge Categories:**

| Category | Examples |
|----------|----------|
| Explorer | First event, 5 events, 10 events, 25 events |
| Social | Introducer, Connector, Community Builder |
| Quality | 5-star rating, Consistent Attender |
| Creator | First event created, Series creator |
| Special | Early Adopter, Verified, Ambassador |

**Rarity Tiers:**
- Common: Default achievement markers
- Uncommon: 10% of eligible users
- Rare: 5% of eligible users
- Epic: 1% of eligible users
- Legendary: 0.1% of eligible users

**Business Rules:**
- Badges are permanent
- Badges cannot be revoked (unless fraud detected)
- Badge notification shows immediately
- Can display limited badges on profile

**Edge Cases:**
- Badge criteria changed → Re-evaluate existing holders
- Fraudulent badge → Review and possible revocation
- Multiple badges same time → Show all in notification

**Display Rules:**
- Profile shows all earned badges
- Can feature 3 badges on profile card
- Featured badges visible in event attendance lists
- Badge details visible on profile

**Future Expansion:**
- Seasonal badges
- Collaborative badges
- Badge trading (not for money)

**Dependencies:**
- Badge service
- Achievement tracking
- Notification service

---

### 18. Return User Flow

**Trigger:** User returns to app after previous session

**Steps:**

| Step | User Action | System Response |
|------|------------|-----------------|
| 18.1 | Open app | Load session |
| 18.2 | — | Check for new events in area |
| 18.3 | — | Sync any offline changes |
| 18.4 | — | Check pending notifications |
| 18.5 | — | Update location |
| 18.6 | — | Show map with current events |
| 18.7 | View upcoming events | Show user's scheduled events |

**Session Restoration:**
- Last map position remembered
- Pending actions synced
- Notifications updated
- New recommendations calculated

**Edge Cases:**
- Long absence (>30 days) → Show "Welcome Back" summary
- Significant updates → Show changelog highlights
- Trust score change → Show any updates
- Event changes while away → Notify of relevant updates

**Retention Mechanisms:**
- Personalized recommendations
- Upcoming event reminders
- New badge/achievement highlights
- Community activity summaries

**Future Expansion:**
- Re-engagement campaigns
- Personalized return incentives
- Dormant user win-back flows

---

## Open Questions

1. Should we implement progressive onboarding based on user type (Explorer vs Organizer)?
2. How do we handle multi-language users in the onboarding flow?
3. What's the optimal timing for event reminders?
4. Should we support biometric authentication for quick access?

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*
