---
name: Loom & Ledger
colors:
  surface: '#f7faf6'
  surface-dim: '#d7dbd7'
  surface-bright: '#f7faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5f0'
  surface-container: '#ebefea'
  surface-container-high: '#e5e9e5'
  surface-container-highest: '#e0e3df'
  on-surface: '#181d1a'
  on-surface-variant: '#3f4943'
  inverse-surface: '#2d312f'
  inverse-on-surface: '#eef2ed'
  outline: '#6f7a73'
  outline-variant: '#bec9c2'
  surface-tint: '#096c4f'
  primary: '#00543c'
  on-primary: '#ffffff'
  primary-container: '#0f6e51'
  on-primary-container: '#9aedc9'
  inverse-primary: '#84d7b3'
  secondary: '#835400'
  on-secondary: '#ffffff'
  secondary-container: '#fdb244'
  on-secondary-container: '#6e4600'
  tertiary: '#474948'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e6160'
  on-tertiary-container: '#dbdcda'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a0f3cf'
  primary-fixed-dim: '#84d7b3'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#ffddb5'
  secondary-fixed-dim: '#ffb956'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#e1e3e1'
  tertiary-fixed-dim: '#c5c7c5'
  on-tertiary-fixed: '#191c1b'
  on-tertiary-fixed-variant: '#444746'
  background: '#f7faf6'
  on-background: '#181d1a'
  surface-variant: '#e0e3df'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is centered on the core concept of "Trust made visible." It positions a high-end second-hand marketplace as a sophisticated, editorial experience rather than a cluttered resale shop. The visual direction is **Modern Editorial**, blending the precision of a high-end SaaS dashboard with the breathable whitespace of a luxury fashion magazine.

The emotional response should be one of security and intentionality. By utilizing expansive margins, high-contrast typography, and a deliberate lack of decorative "noise," the design system ensures that the items themselves—and the verification of their quality—take center stage. It avoids playful or toy-like elements, favoring sharp execution and structured layouts that signal professional-grade reliability.

## Colors

The palette is anchored by **Deep Emerald**, a color chosen to represent both sustainability and financial security. This is paired with a **Warm Amber** accent, used exclusively for high-priority calls to action and critical highlights to ensure they pierce through the calm layout.

The foundation of the interface is **Off-white**, providing a warm, parchment-like canvas that feels more premium than pure white. Text is rendered in **Charcoal** to maintain high legibility while appearing softer and more integrated than true black. Semantic colors are slightly desaturated to maintain the editorial tone while providing clear functional feedback for system states.

## Typography

This design system employs a dual-font strategy. **Plus Jakarta Sans** provides a geometric, confident personality for headings, offering the modern "polished SaaS" feel. Its slightly wider apertures ensure headlines feel open and breathable. 

For high-density information and long-form descriptions, **Inter** is utilized for its exceptional utilitarian clarity and neutral character. 

Hierarchy is established through significant scale shifts. Display sizes use tighter letter spacing and heavier weights to command attention, while small labels use increased letter spacing and uppercase styling to ensure readability in badges and tags.

## Layout & Spacing

The layout philosophy follows a **fluid grid** model with a 12-column structure for desktop. To maintain the "Modern Editorial" feel, the design system prioritizes generous outer margins (`48px` on desktop) to "frame" the content, preventing it from feeling cramped at the screen edges.

The spacing rhythm is strictly based on a **4px base unit**. Smaller increments (4px, 8px, 12px) are reserved for internal component padding and related grouping, while larger increments (32px, 48px, 64px) are used to separate major sections and create the "breathable" atmosphere characteristic of this system. Content reflows to a 4-column structure on mobile with reduced margins to maximize usable real estate.

## Elevation & Depth

Visual hierarchy is achieved through a **layered tonal system** combined with **soft ambient shadows**. Surfaces do not rely on heavy borders; instead, they use subtle depth to indicate interactivity and importance.

- **Base Level:** The Off-white background (`#FAFAF7`).
- **Surface Level:** Cards and panels use white backgrounds with a soft, layered shadow: `0 4px 16px rgba(0,0,0,0.06)`. This creates a "lifted" effect without looking heavy or dated.
- **Interactivity:** On hover, elements should utilize a "shadow lift," increasing the shadow spread and reducing opacity slightly to simulate the physical movement of the element toward the user.
- **Overlays:** Modals and hero panels use a semi-transparent backdrop blur (12px) to maintain context while focusing attention.

## Shapes

The shape language is structured to reflect the specific "Trust made visible" hierarchy. A tiered approach to corner radii is used to distinguish between small interactive elements and large structural containers:

- **Inputs & Buttons:** `8px` radius for a crisp, professional, and precise appearance.
- **Cards & Product Frames:** `16px` radius to soften the presentation of photography and item listings.
- **Modals & Hero Panels:** `24px` radius for major structural containers to create a distinct, modern "app-like" feel within the browser.

Photography should always be contained within these standard radii; raw, sharp-edged images are not permitted within the UI frames.

## Components

### Buttons & CTAs
- **Primary:** Deep Emerald background with white text. High-contrast, 8px radius.
- **Secondary:** Transparent with a 1px Charcoal border.
- **CTA:** Warm Amber for critical conversion points (e.g., "Buy Now").

### Condition Badges
Small, pill-shaped tags (`label-sm`) with a subtle tonal background based on the condition status (e.g., light green for "Pristine", light grey for "Good"). They should never use heavy shadows.

### Verified Seller Tags
A combination of a small Deep Emerald checkmark icon and `label-md` text. This is a core trust component and should be consistently placed near seller names.

### Input Fields
8px radius, white background, and a 1px border in a lightened charcoal shade. Focus states use a 2px Deep Emerald ring with a soft outer glow.

### Photography Frames
All product images must be displayed in a 16px rounded container. Use a subtle `1px inset border` of `#00000005` to ensure light-colored products remain distinct from the Off-white background.

### Motion Details
- **Entrances:** Elements should use a 0.4s ease-out fade and an 8px slide-up transition.
- **Hover States:** Interactive cards scale to `1.02` with an accompanying shadow lift to `0 8px 24px rgba(0,0,0,0.08)`.
- **Staggering:** List items or grid galleries should utilize a `0.05s` stagger delay between children to create a sense of organized loading.