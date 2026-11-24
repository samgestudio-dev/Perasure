# 0012 · Lists in the application are popovers

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "The full app"; design system node 7201:12032

## Context
The design system retired bottom-sheet lists in the application form.

## Decision
Pick lists open as popovers centred on where the finger tapped, 8 px from the page's sides, on a light-bounce spring (the one thing that bounces). Dates use `PS.DatePicker` with a wheel for month / year.

## Consequences
- `PS.FormField{menu}` / `PS.Popover`; the date picker always shows six rows of days.
