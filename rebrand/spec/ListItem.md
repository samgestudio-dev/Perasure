# ListItem

Figma: component set `11025:971` (04 · Lists `10982:19`) · 6 variants · showcase `11025:972`
One row of a list inside a card. Replaces legacy FAQs list, FAQs secondary list, About Perasure list, Customer service / Contact list,
City list, Name list, ID LIST, Bank list, search city popover / list. (Demo today: rows of `PS.LinkList`.)

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Tone | VARIANT | Default · Brand | Default | `tone: 'default' \| 'brand'` (brand = help topics / page links) |
| State | VARIANT | Default · Pressed · Disabled | Default | `disabled`; gallery `state` |
| Title | TEXT | | "Sending money" | `title` |
| Subtitle | BOOLEAN + Subtitle text | | false · "Pampanga, Central Luzon" | `subtitle` |
| Leading | BOOLEAN + Leading icon (INSTANCE_SWAP) | Bank, Phone, Message, Email, bank / e-wallet logos, ID card, Help | false · Icon / Bank | `icon` or `logo` |
| Tag | BOOLEAN (exposed Tag, Small · Accent · Subtle) | | false ("Higher credit") | `tag: { label, tone }` |
| Value | BOOLEAN + Value text | | false · "(+632) 8299 3923" | `value` |
| Chevron | BOOLEAN + Trailing icon (INSTANCE_SWAP) | Chevron right, Link, Copy | true · Chevron right | `trail` (`'none'` hides) |
| Divider | BOOLEAN | | true | `divider` (off on the last row) |

## Parts and tokens

Root: vertical, width **343** (Fill in a card), no side margin of its own beyond the row padding. Parts: Main · Divider.

| Part | Property | Token |
|---|---|---|
| Main | min-height | `var(--size-control-lg)` 48 |
| Main | padding left/right · top/bottom | `var(--spacing-padding-lg)` 16 · `var(--spacing-padding-md)` 12 |
| Main | gap | `var(--spacing-gap-md)` 12 |
| root (Pressed) | fill | `var(--surface-sunken)` (Default / Disabled: none) |
| Leading | 24 × 24, icon `var(--content-primary)`; logos keep their colours; Disabled: opacity `var(--opacity-disabled)` | |
| Text | gap Title → Subtitle | `var(--spacing-gap-2xs)` 2 |
| Title | Default tone `.ps-t-body-md-strong` `var(--content-primary)` · Brand tone `.ps-t-body-md` `var(--content-brand)` · Disabled `--content-disabled` | |
| Subtitle | `.ps-t-caption-sm`, `var(--content-tertiary)` | |
| Tag | Tag Size=Small, Tone=Accent, Emphasis=Subtle (see Tag.md) | |
| Value | `.ps-t-body-md-strong`, `var(--content-link)` | |
| Trailing icon | 16 × 16, `var(--content-tertiary)`; Disabled: opacity `var(--opacity-disabled)` | |
| Divider | padding left/right `var(--spacing-padding-lg)` 16; line height `var(--stroke-width-default)` 1, `var(--border-subtle)` | |

Search results: the matched letters of the title are `var(--content-brand)` in the demo (Figma shows the plain row).

## States

| # | Group (card) | Props |
|---|---|---|
| 0 | Help topics — Brand | `tone:'brand', title:'How do I repay my loan?'` |
| 1 | Help topics — Brand | `tone:'brand', state:'pressed', title:'Sending money'` |
| 2 | Help topics — Brand | `tone:'brand', title:'Why was my application not approved?', divider:false` |
| 3 | Contact | `title:'Hotline', icon:'phone', value:'(+632) 8299 3923', trail:'none'` |
| 4 | Contact | `title:'Email', icon:'email', value:'support@perasure.ph', trail:'none', divider:false` |
| 5 | City search results | `title:'Angeles City', subtitle:'Pampanga, Central Luzon', trail:'none'` |
| 6 | City search results | `title:'San Fernando City', subtitle:'Pampanga, Central Luzon', trail:'none', divider:false` |
| 7 | ID types | `title:'UMID (Unified Multi-purpose ID)', tag:{label:'Higher credit'}` |
| 8 | ID types | `state:'pressed', title:"Driver's License"` |
| 9 | ID types | `disabled:true, title:'Postal ID', divider:false` |
| 10 | Banks and e-wallets | `logo:'bdo', title:'Bank de Oro Universal Bank'` |
| 11 | Banks and e-wallets | `logo:'gcash', title:'GCash', divider:false` |
Each group sits in a white card: `var(--surface-default)`, radius `var(--radius-card)` 24, padding top/bottom `var(--spacing-padding-xs)` 4.
