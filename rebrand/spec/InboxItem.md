# InboxItem

Figma: component set `11043:1798` (06 · Product cards `10982:21`) · 4 variants · showcase `11043:1848`
One notification, redesigned (owner): calm and useful. Replaces legacy System notification card, System notification card overdue, NOTIFICATION.

**Content rule:** title = the fact (amount · status · date); body = the next step in one or two lines; overdue = only the fact is red, no blame,
always a way forward (Brand Bible p143).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Unread · Read | Unread | `unread` |
| Tone | VARIANT | Default · Overdue | Default | `tone: 'default' \| 'overdue'` |
| Kind | TEXT | | "Loan" | `kind` |
| Time | TEXT | | "21h ago" | `time` |
| Action label | TEXT | | "View details" | `action` (+ `onOpen`) |
| (text) Title · Body | | | | `title`, `body` |

## Parts and tokens

Card: vertical, width **343**, `var(--surface-default)`, radius `var(--radius-card)` 24, padding 16, gap `var(--spacing-gap-md)` 12.

| Part | Token |
|---|---|
| Meta | gap `var(--spacing-gap-sm)`: kind icon (Notification) 16 `var(--content-secondary)` · Kind `.ps-t-label-sm` secondary (fills) · unread dot **8** `var(--bg-action)` (Unread only) · Time `.ps-t-caption-sm` `var(--content-tertiary)` |
| Text | gap `var(--spacing-gap-xs)` 4 |
| Title | `.ps-t-title-xs` — Default `var(--content-primary)` · Overdue `var(--content-negative)` |
| Body | `.ps-t-body-md`, `var(--content-secondary)`, max 2 lines with … |
| Divider | `var(--border-subtle)` 1 px |
| Action | `.ps-t-label-md` + chevron 16, `var(--content-link)`, space between |

## States

| # | Caption | Props |
|---|---|---|
| 0 | Unread — the fact + next step | `kind:'Loan', time:'21h ago', title:'₱3,000.00 sent to your GCash', body:'It should arrive within a few minutes. Your first payment is due on Jan 15.', action:'View details', unread` |
| 1 | Read | same, `time:'Nov 2'` |
| 2 | Overdue — unread, calm | `tone:'overdue', kind:'Repayment', time:'2h ago', title:'₱2,050.00 was due on Dec 28', body:"Pay today to keep your credit limit. Need more time? Chat with us and we'll help.", action:'Pay now', unread` |
| 3 | Overdue — read | same, `time:'Yesterday'` |

## 2026-11-20 · Rebuilt from the legacy card (phase 1)

The earlier demo layout (343 × 171) is withdrawn; the demo has gone back to legacy too. All four variants were rebuilt in place (same ids)
by translating the legacy cards with the kit:

| Variant | Legacy | Size |
|---|---|---|
| State=Unread, Tone=Default | System notification card · Unread 7809:16461 | 328 × 174 |
| State=Read, Tone=Default | System notification card · Read 8133:28404 | 328 × 174 |
| State=Unread, Tone=Overdue | System notification card overdue 8620:34504 | 328 × 176 |
| State=Read, Tone=Overdue | same, unread dot off (.InboxTime Unread=Off) | 328 × 176 |

Layout (legacy): padding 16, head row 28 (Icon / Inbox 16 · kind · `.InboxTime` = unread dot + time, 55 × 16) · divider · title (Title/xs) +
two-line body (Body/md tertiary) · divider · action row 28 ("View more" + chevron). Overdue adds a red "Overdue" Tag next to the title.
New part: `.InboxTime` `11180:54341` (Unread=On / Off; legacy Time 7809:16667). Map: legacy NOTIFICATION 7809:16437 → Icon / Inbox.
v2: "View more" is Content/Brand (navy; legacy brand blue). The props table above describes the withdrawn redesign; texts are now instance
overrides (kind, time, title, body, action), as legacy.
