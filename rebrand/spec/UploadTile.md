# UploadTile

Figma: component set `11044:2020` (06 · Product cards `10982:21`) · 8 variants · showcase `11044:2071`
Adding a picture or a file. Replaces legacy Upload File Sheet, Application details Upload File Sheet and File catalog sheet rows
(demo `PS.UploadTile` for pictures; file rows are new for the demo).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Type | VARIANT | Picture · File | Picture | `type: 'picture' \| 'file'` |
| State | VARIANT | Picture: Empty · Loading · Done · Error — File: Uploaded · Uploading · Compressing · Failed | Empty | `state` |
| Label | TEXT (Picture) | | "Front of ID" | `label` |
| File name · File type | TEXT (File) | | "SSS_Contributions_2026.pdf" · "PDF" | `name`, `fileType` |
| (text) status line | | | | `size`, `progress`, `error` |

## Parts and tokens — Picture

Vertical, width **165**, gap `var(--spacing-gap-sm)`, centred: Picture slot **165 × 107** (148 : 96) + Label `.ps-t-caption-sm` tertiary.

| State | Slot | Content |
|---|---|---|
| Empty | `var(--surface-sunken)`, dashed `var(--border-default)` 1 px, radius `var(--radius-sm)` | add 24 `var(--content-tertiary)` |
| Loading | same | spinner 24 (ring 270°), `var(--content-brand)` |
| Done | solid `var(--border-positive)` `var(--stroke-width-medium)` | ID card 40 tertiary + mark 20 bottom-right: circle `var(--bg-positive)`, tick `var(--content-on-action)` |
| Error | solid `var(--border-negative)` 1.5 | ID card 40 + Alert circle 20 `var(--content-negative)` |

## Parts and tokens — File

Horizontal row, width **343**, `var(--surface-default)`, radius `var(--radius-md)` 16, padding `var(--spacing-padding-md)` 12, gap 12, centred.

| Part | Token |
|---|---|
| Badge | **36 × 36**, `var(--surface-sunken)`, radius `var(--radius-xs)`, type `.ps-t-label-sm` tertiary |
| Name | `.ps-t-body-md-strong` primary, one line … |
| Status | `.ps-t-caption-sm`: Uploaded `var(--content-positive)` "1.1 MB · Uploaded" · Uploading tertiary "Uploading · 62% of 2.4 MB" · Compressing tertiary "Compressing…" · Failed `var(--content-negative)` "Upload failed. Check your connection and try again." |
| Progress (Uploading) | 4 tall, track `var(--border-subtle)`, fill `var(--bg-brand)`, radius full |
| Action | 20, `var(--content-tertiary)`: Delete (Uploaded) · Close (Uploading, Compressing) · Reload (Failed) |

## States

| # | Group | Props |
|---|---|---|
| 0 | ID pictures | `type:'picture', state:'empty', label:'Front of ID'` |
| 1 | ID pictures | `state:'loading', label:'Back of ID'` |
| 2 | ID pictures | `state:'done', label:'Front of ID'` |
| 3 | ID pictures | `state:'error', label:'Back of ID'` |
| 4 | Documents | `type:'file', state:'uploaded', name:'SSS_Contributions_2026.pdf', fileType:'PDF'` |
| 5 | Documents | `state:'uploading', name:'Payslip_scan_Sept_2026.jpg', fileType:'JPG'` |
| 6 | Documents | `state:'compressing', name:'Payslip_scan_Sept_2026.jpeg', fileType:'JPEG'` |
| 7 | Documents | `state:'failed', name:'SSS_Contributions_2026_page2.png', fileType:'PNG'` |

## 2026-11-20 · File states at legacy geometry

Type=File states rebuilt in place from legacy Application details Upload File Sheet 9548:31409: Uploaded 328 × 60, Uploading 328 × 64, Compressing 328 × 60, Failed 328 × 60 (were 343 wide, 62–78 tall). New State=Empty ("Add files (0/3)", 328 × 80) and State=Add more (328 × 48).
