/**
 * LinkUp Design System 2026
 * Events Feature - Main Exports
 */

// Event Card
export {
  EventCard,
  FeaturedEventCard,
  CompactEventCard,
  EventCardGrid,
  EventCardList,
} from './event-card/event-card';
export type { EventCardProps, EventCardSize, EventCardVariant } from './event-card/event-card';

// Organizer Card
export { OrganizerCard, OrganizerRow, TrustBadge } from './organizer-card/organizer-card';
export type { OrganizerCardProps, OrganizerRowProps, TrustBadgeProps } from './organizer-card/organizer-card';

// Event Details
export { EventDetailsScreen } from './event-details/event-details-screen';

// Join Flow
export {
  JoinButton,
  JoinFlow,
  PendingState,
  AcceptedState,
  DeclinedState,
  FullEventState,
} from './join-flow/join-flow';
export type { JoinFlowProps, JoinState } from './join-flow/join-flow';

// Trust
export { TrustBlock, TrustScoreDisplay, TrustMetricsRow, TrustBadge as TrustBadgeComponent } from './trust/trust-block';
export type { TrustBlockProps, TrustScoreDisplayProps, TrustMetricsRowProps, TrustBadgeProps as TrustBadgeComponentProps } from './trust/trust-block';
