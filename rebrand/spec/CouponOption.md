# CouponOption

Figma: component set `11273:4944` (Component - Rebranding) · 4 variants · 296 × 40 · added 2026-11-20 (log entry 24)
A coupon row in the loan detail coupon picker. Translated from legacy "percentage off" `10656:51539` and "credit increase" `10656:51695`
(phase 1: legacy layout and copy, v2 colours, Hanken Grotesk).

## Props

| Figma property | Type | Values | Default |
|---|---|---|---|
| Kind | VARIANT | Percentage · Credit | Percentage |
| State | VARIANT | Active · Default | Active |

Active = the radio on (picked); Default = radio off. The coupon art is the legacy art, unchanged (BRIEF 32).

## Parts and tokens

| Part | Value |
|---|---|
| Root | horizontal, gap 16, 296 × 40 |
| Row | horizontal, gap `Spacing/Gap/md` 12, padding right `Spacing/Padding/sm` 8 |
| Art | 36 × 36 legacy coupon art (Percentage: ticket + %; Credit: ticket + arrow) |
| Title | Body/md-strong, `Content/Primary` ("50% off first-payment interest") |
| Saving line | Caption/sm, `Content/Positive/Strong` ("You save ₱5,000") |
| Text stack | vertical, gap `Spacing/Gap/xs` 4, 224 wide |
| Radio | Radio 16, State=On (Active) / Off (Default), border `Border/Default` |

## Used in

Coupon center / Loan application / Loan detail 1–6 (two rows each).
