---
name: Aura Flow
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#926e6b'
  outline-variant: '#e7bdb9'
  surface-tint: '#c0001a'
  primary: '#bd001a'
  on-primary: '#ffffff'
  primary-container: '#e61e2a'
  on-primary-container: '#fffeff'
  inverse-primary: '#ffb3ad'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#006a48'
  on-tertiary: '#ffffff'
  tertiary-container: '#00865c'
  on-tertiary-container: '#fafff9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#930011'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  card-gap: 20px
---

## Brand & Style

The design system embodies a **Modern Glassmorphic** aesthetic, tailored specifically for the evolution of human resource management. It balances professional utility with a "humanized" digital touch, moving away from cold, industrial enterprise layouts toward a fluid, airy, and inviting workspace.

The brand personality is **sophisticated yet accessible**. It aims to evoke a sense of clarity and calm—reducing the cognitive load of complex HR tasks. By leveraging translucent layers and soft background gradients, the UI feels lightweight and breathable. The reintroduction of the heritage red as a high-impact accent ensures that while the environment is soft, critical actions and urgency remain unmistakably clear.

## Colors

This design system utilizes a sophisticated light-mode palette defined by translucency and soft environmental shifts.

- **Primary Red (#e61e2a):** Reserved exclusively for high-priority interactions, notification badges, destructive actions, and critical status indicators. It acts as the "pulse" of the system.
- **Surface Strategy:** The base is a clean, off-white (#f8fafc) or pure white. Depth is created using glassmorphism: white surfaces at 70-80% opacity with a 20px-40px backdrop blur.
- **Environmental Gradients:** Soft, large-scale mesh gradients using Lemon, Purple, and Mint should be placed in the background to provide a sense of depth and warmth without interfering with content legibility.
- **Functional Colors:** Use soft indigos and emeralds for secondary actions and "success" states to maintain the professional HRMS foundation.

## Typography

The typography system relies on **Plus Jakarta Sans** for its friendly yet modern geometric proportions. It provides the "human" feel required for an HR platform. **Manrope** is used for smaller labels and data points to ensure maximum legibility and a slightly more technical precision where details matter most.

- **Headlines:** Use tight letter-spacing and bold weights to create a strong hierarchy against the soft background.
- **Body:** Maintain generous line heights (1.5x) to ensure long-form HR documents and policies remain readable.
- **Captions:** Use Manrope at 600 weight for small metadata to differentiate it from standard body copy.

## Layout & Spacing

The system uses a **Fluid Grid** model with high internal padding to reinforce the airy, glassmorphic feel.

- **Desktop:** 12-column grid with 24px gutters. Content should be housed in "Floating Glass" containers that have a minimum margin of 32px from the screen edge.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px gutters.
- **Spacing Logic:** All spacing must be multiples of 8px. Use larger gaps (32px+) between distinct functional sections to prevent the UI from feeling cluttered, which is a common pitfall in HRMS tools.

## Elevation & Depth

Depth is conveyed through **Glassmorphism and Ambient Shadows** rather than traditional solid stacks.

1.  **Level 0 (Background):** Pastel mesh gradients.
2.  **Level 1 (Main Canvas):** Semi-transparent white surface (70% opacity) with a subtle 1px white border (inner glow) to define edges.
3.  **Level 2 (Cards/Popovers):** Higher opacity (90%) with an extra-diffused, low-opacity shadow (Color: Primary Neutral, 10% opacity, 20px blur, 10px Y-offset).
4.  **Level 3 (Modals/Active States):** Crisp white background with a colored glow (using a tinted version of the Primary Red for urgent alerts).

## Shapes

The shape language is **Rounded**, favoring organic, soft corners that move away from the "boxy" nature of legacy enterprise software.

- **Standard Cards:** 1rem (16px) corner radius.
- **Primary Buttons:** 0.75rem (12px) for a modern, approachable feel.
- **Inner Elements (Inputs/Chips):** 0.5rem (8px) to maintain a nested relationship with parent containers.
- **Icons:** Should feature rounded terminals and consistent stroke weights to match the typeface.

## Components

- **Buttons:** Primary buttons use a solid gradient or flat fill of the Heritage Red. Secondary buttons use a glass-style background with a 1px border. All buttons should have a subtle scale-down effect (0.98) on click to feel "squishy" and tactile.
- **Glass Cards:** Feature a subtle 1px white border at 30% opacity. This "highlight" edge is essential for legibility over pastel background gradients.
- **Chips & Tags:** Use highly desaturated versions of their status colors (e.g., a very pale red for a "Pending" tag) with bold, high-contrast text.
- **Input Fields:** Use a subtle inset shadow to appear slightly recessed into the glass surface, providing a clear visual cue for interactable areas.
- **Icons:** Use dual-tone or high-quality 3D-inflected flat icons. Icons in the sidebar should use the Heritage Red only when active or notifying the user of an action item.
- **Notification Toasts:** Should appear as high-blur glass plates with a thick Primary Red left-accent bar to immediately draw the eye.