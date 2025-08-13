# Landing Page Implementation Instructions

## Overview
This instruction details all sections and features present on the GenEric TraDer Platform landing page.

## Sections & Features

1. **Header**
   - Sticky header with logo, navigation links (Features, Demos, Copy Trading, Remote Bots, Testimonials, Pricing).
   - Auth buttons: Log In, Sign Up, Dashboard, Log Out (conditional on authentication).
   - Theme toggle.

2. **Hero Section**
   - Platform name and tagline.
   - Brief description of platform features.
   - Call-to-action buttons: Try Demo, Get Started.
   - Hero image.

3. **Features Section**
   - Key features displayed in cards:
     - Automated Trading Bots
     - Risk Management
     - Social Trading
     - Strategy Builder
     - API Integrations
     - Self-Hosted
   - Each card includes icon, title, and description.

4. **Demo Portfolios Section**
   - Tabs for asset types: Traditional Markets, Cryptocurrency, DeFi Yield.
   - Each tab displays a demo portfolio card with:
     - Name, description, performance metrics (YTD return, assets, win rate, drawdown, Sharpe ratio).
     - Performance chart.
     - Buttons: View Demo Dashboard, Export Data.

5. **Demo Portfolio Manager**
   - Allows users to add, edit, and remove demo portfolios (tier-based limits).
   - Shows current count and max allowed portfolios.
   - Portfolio templates for quick creation.
   - Edit name/description and view mock performance chart.
   - Upgrade prompt if limit reached.

6. **Market Insights Section**
   - Cards for Fear & Greed Index and Trading Signals.
   - Each card includes description, widget/chart, and action button.

7. **Testimonials Section**
   - User testimonials in cards with name, role, quote, and rating icons.

8. **Pricing Section**
   - Pricing cards for each tier (Free Insta, Baby, Middle, Big, XL).
   - Features list per tier.
   - Plan comparison table.

9. **CTA Section**
   - Call-to-action with buttons: Get Started, View Demos.
   - Background image and overlay.

10. **Tech Stack Section**
    - Cards for technology features: Open Source, Self-Hosted, Real-Time, API Integrations.
    - Icon, title, and description per card.

11. **Footer**
    - Platform logo, description, and navigation links.
    - Responsive layout.

12. **Cookie Consent**
    - Cookie consent banner at the bottom.

## General Implementation Notes
- Use modular React components for each section.
- Ensure responsive design for all devices.
- Use your UI library for consistency (Card, Button, Tabs, Badge, etc.).
- Conditionally render elements based on authentication state.
- Use mock data for charts and metrics where needed.
- All navigation links should be functional and accessible.

---

**Reference:** See `app/clientpage.tsx` for the main implementation.
