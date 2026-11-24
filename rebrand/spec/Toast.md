# Toast

Figma: component set `10991:524` (02 · Feedback `10982:17`) · 4 variants · showcase `10991:633`
Short dark notice under the header bar (decision 6). Replaces legacy Toast. Doesn't take focus; 3–5 s; swipe left / × closes.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Status | VARIANT | Success · Error · Info · Neutral | Success | `status` |
| Message | TEXT | | "Message in one short sentence." | `text` (children) |
| Action | BOOLEAN | | false | shown when `action` is set |
| Action label | TEXT | | "Undo" | `action: { label, onClick }` |
| Close | BOOLEAN | | false | `onClose` shows the × |

## Parts and tokens

Layout: horizontal auto layout, items centred, width **343** fixed (16 px page margins), height hugs; message wraps (2 lines max).

| Part | Property | Token |
|---|---|---|
| root | fill | `var(--surface-inverse)` [Surface/Inverse] |
| root | padding top/bottom · left/right | `var(--spacing-padding-md)` 12 · `var(--spacing-padding-lg)` 16 |
| root | gap | `var(--spacing-gap-md)` 12 |
| root | radius | `var(--radius-md)` 16 |
| root | shadow | `var(--elevation-3)` (Elevation/3; today `--elevation-focus`) |
| Message | `.ps-t-body-md`, `var(--content-inverse)`, fills the width | |
| Action | `.ps-t-label-md`, `var(--content-accent)` | |
| Close | Icon / Close-thin 16 × 16, `var(--content-placeholder)` | |
| Status icon | 20 × 20 — see below | |

| Status | Icon | Colours |
|---|---|---|
| Success | Check circle / Filled | circle `var(--bg-positive)`, tick `var(--content-on-action)` |
| Error | Alert circle | `var(--content-negative-subtle)` (red-500, 4.3:1 on Ink) |
| Info | Info circle | `var(--content-inverse)` |
| Neutral | none (icon hidden) | |

## States

| # | Group | Props |
|---|---|---|
| 0 | Statuses | `status:'success', text:'Bank account added.'` |
| 1 | Statuses | `status:'error', text:"Couldn't send the code. Check your signal.", action:{label:'Retry'}` |
| 2 | Statuses | `status:'info', text:"Your application is being reviewed. We'll notify you.", close` |
| 3 | Statuses | `status:'neutral', text:'Your account has been deleted.'` |
| 4 | Destructive → Undo | `status:'neutral', text:'Bank account removed.', action:{label:'Undo'}` |

Showcase stacks the toasts with `--spacing-gap-sm` 8 between them only for review; in the app it is the existing `PS.Toasts` stack.
