# Content Moderation

## Purpose

Content Moderation reviews all user-generated content to ensure it meets community guidelines and remove harmful material before it affects users.

## Content Types

| Type | Description |
|------|-------------|
| Event Title | Event name |
| Event Description | Full event details |
| User Profile | Display name, bio |
| Business Profile | Business information |
| Message | Chat messages |
| Image | Uploaded images |

## Violation Types

| Type | Severity | Description |
|------|----------|-------------|
| Profanity | 70 | Inappropriate language |
| Scam | 100 | Fraudulent content |
| Harassment | 90 | Bullying, threats |
| Illegal | 100 | Illegal content |
| NSFW | 95 | Adult content |
| Hate Speech | 95 | Discriminatory content |
| Violence | 90 | Violent content |
| Spam | 60 | Promotional spam |

## Detection Methods

### Pattern Matching
- Keyword detection for known violations
- Regular expressions for common patterns
- URL detection for external links

### ML Models (Future)
- Natural language understanding
- Image classification
- Context analysis

## Moderation Results

| Result | Confidence | Violations |
|--------|------------|------------|
| Approved | Any | None or low |
| Rejected | High | High severity |
| Flagged | Medium | Medium severity |
| Pending Review | Low | Any |

## Human Review Triggers

Content requires human review when:
- AI confidence < 70%
- Multiple violations detected
- High severity violation found
- Content is borderline

## User-Facing Messages

When content is rejected:
- "Content contains inappropriate language"
- "Content may be attempting to deceive"
- "Content may be harassment"
- "Content violates our guidelines"

Never expose:
- Detection methodology
- Internal violation types
- AI confidence scores

## Appeal Process

1. User sees rejection
2. User can edit and resubmit
3. Human reviewer makes final decision
4. Decision is logged

## Moderation Dashboard (Future)

Displays:
- Pending reviews
- Approved/rejected ratios
- Common violation patterns
- Reviewer performance
- Appeal outcomes

---

*Last Updated: V6.0*
*Owner: AI Team*
