# MyStrain+ — Session Log

This file is updated by Claude at the end of work sessions to preserve context across restarts.

## Session: 2026-02-24 (latest) — LEGAL HARDENING + DISPENSARY COMPLETE

### Current State
- **Live URL:** https://mystrainplus.netlify.app
- **GitHub (both synced at `31dd8ef`):** origin → nhouseholder/Strain-Finder-Front-Cannalchemy-Back, cannalchemy-v2 → nhouseholder/cannalchemy-v2
- **Latest commit:** `31dd8ef` — Comprehensive legal hardening across all pages
- **Status:** FULLY OPERATIONAL. All features live, legal hardening complete, dispensary with regional caching live.
- **Paywall:** Currently disabled (FREE_LIMIT=Infinity) — all results free
- **Stripe price:** $0.99/mo (price_1T4BpSQBM4GMGA1Hzd0k3OpJ)

### Admin Account
- **Email:** nikhouseholdr@gmail.com
- **User ID:** 6ea77df4-0b56-4e1e-b18c-6f727390718b
- **Admin:** true
- **Subscription:** active

### Recent Commits (newest first)
1. `31dd8ef` — Comprehensive legal hardening across all pages (12 files modified, 1 new)
2. `3eeffd0` — Add unique colors to predicted effects bars based on effect type
3. `0019656` — Add live dispensary availability, regional cache, drawer, skip quiz splash
4. `784f863` — Add DOB age gate, soften medical labels, add disclaimers to cards
5. `282c73d` — Harden legal protections for launch as free platform
6. `2338941` — Remove paywall — all results are free for now

### What Was Done (2026-02-24 sessions)

#### Legal Hardening (commit `31dd8ef`) — 12 files, 11 tasks
1. **LandingPage.jsx** — Softened all medical/scientific claims, added 4-section disclaimer (Important Notice, Medical Disclaimer, Health Warnings, Legal Notice)
2. **SignupPage.jsx** — Added 2 mandatory checkboxes (ToS agreement + 21+ confirmation) with validation
3. **AppShell.jsx** — Expanded footer with platform identity + pregnancy warning
4. **TermsPage.jsx** — Added §17 (AI Content), §18 (Subscription Terms), §19 (Health Warnings)
5. **PrivacyPage.jsx** — Added Stripe/Anthropic to third-party list, §11 (Not HIPAA), §12 (AI/ML Data)
6. **PaywallOverlay.jsx** — Softened language + "software access only" footer
7. **CheckoutSuccessPage.jsx** — "software subscription" + "not a purchase of cannabis products"
8. **WhatToExpect.jsx** — "Scientifically Predicted" → "Community-Reported"
9. **StrainCardExpanded.jsx** — Comment update to match
10. **TerpeneGuide.jsx** — "Medical Research" → "Published Research (Informational)"
11. **LegalConsent.jsx** (NEW) — Consent gate with disclaimers + 2 checkboxes, wraps ResultsPage

#### Live Dispensary System (commit `0019656`)
- Regional caching via Netlify Blobs (24h TTL, shared across users)
- `dispensary-cache.js` Netlify function
- `useDispensaryAvailability.js` hook (singleton pattern)
- `AvailabilityBadge.jsx` on StrainCards
- `DispensaryDrawer.jsx` detail modal
- `DispensaryFilters.jsx` + `LocationInput.jsx`
- Enhanced `dispensarySearch.js` (2-layer cache: localStorage 30min + regional 24h)
- Enhanced `promptBuilder.js` with per-strain pricing prompt

#### Other Features (commits `3eeffd0`, `784f863`, `282c73d`, `2338941`)
- Unique colors for predicted effects bars
- DOB age gate (AgeGate.jsx wrapping entire app)
- Softened medical labels throughout
- Paywall removed (all results free)
- Pricing dropped to $0.99/mo

### Three-Layer Consent Architecture
1. **AgeGate** — DOB verification, blocks entire app, `localStorage: sf_age_verified`
2. **Signup checkboxes** — Explicit ToS + 21+ consent at account creation
3. **LegalConsent** — Risk acknowledgment before viewing AI results, `localStorage: sf_legal_consent`

### Stripe (LIVE MODE)
- **Account:** acct_1T443qQBM4GMGA1H
- **Price:** price_1T4BpSQBM4GMGA1Hzd0k3OpJ ($0.99/month)
- **Paywall:** Disabled (FREE_LIMIT=Infinity in useSubscription.js)

### Everything Built & Deployed (Cumulative)
- **1,094 strains** with import scripts + one-command rebuild
- **DOB age gate** (21+ verification, localStorage persistence)
- **Three-layer consent** (AgeGate → Signup → LegalConsent)
- **Terms of Service** (21 sections) + **Privacy Policy** (14 sections)
- **Comprehensive legal disclaimers** on all pages + footer
- **Live dispensary search** with AI-powered availability
- **Regional dispensary cache** (Netlify Blobs, 24h TTL)
- **Dispensary drawer** with pricing, deals, hours, directions
- **Availability badges** on strain cards
- **Stripe Billing Portal** + subscription management
- **API rate limiting** (10/hr premium, 3/hr free) + caching (30min TTL)
- **Rate-limit UI** with countdown timer
- **Colored effects bars** with type-specific colors
- **Lazy-loaded strains.json** (1.4MB → 23KB initial)
- **Vite chunk splitting** (recharts + leaflet vendor chunks)
- **Security headers** (CSP, HSTS, X-Frame-Options)
- **OG image** + Twitter card + JSON-LD structured data
- **Sitemap.xml** + robots.txt + Plausible analytics (cookieless)

### Nick's Remaining Tasks
1. ✅ ~~Switch Stripe test → live keys~~
2. ✅ ~~Enable Stripe Billing Portal~~
3. ✅ ~~Create live Stripe webhook~~
4. ✅ ~~Set Netlify env vars with live keys~~
5. ✅ ~~Make admin account~~
6. ✅ ~~Sign up for Plausible.io~~
7. ✅ ~~Legal hardening (comprehensive)~~
8. ✅ ~~Live dispensary system with caching~~
9. ✅ ~~Share repos with 2incertus~~
10. **Update Plausible domain** — Change to mystrainplus.netlify.app in Plausible dashboard
11. **Eventually: custom domain** — Buy domain, add to Netlify + Stripe + Supabase
12. **End-to-end payment test** — Real $0.99 charge through Stripe

### Previous Sessions
- **2026-02-24 (latest)**: Legal hardening (12 files), dispensary availability, effects bars, age gate
- **2026-02-23 (final)**: Domain rename, trigger fix, admin account creation
- **2026-02-23 (evening)**: 429 handling, bundle optimization, security headers
- **2026-02-23 (afternoon)**: Strain Registry (1,094 strains), Stripe portal, rate limiting, SEO, analytics
- **2026-02-23 (morning)**: 14-commit SaaS sprint, Auth + Stripe + landing page
