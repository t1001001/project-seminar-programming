# UI Style Guide

This document defines the styling rules and patterns for all components in this application. **All new components must follow these guidelines** to ensure visual consistency and dark mode compatibility.

> **Reference Implementations:** See `exercises-lib`, `sessions-lib`, `plans-lib`, and `workouts-lib` for working examples.

---

## 🎨 Theme System

### Core Principle

**All components MUST use CSS custom properties for theming.** Never use hardcoded colors.

### Theme Variables (styles.scss)

```scss
/* ═══════════════════════════════════════════════════════════════
   BRAND COLORS (consistent across light/dark modes)
   ═══════════════════════════════════════════════════════════════ */
--fitness-primary: #0DF259         // Main brand color (green)
--fitness-primary-rgb: 13, 242, 89 // RGB for rgba() usage
--fitness-primary-hover: #0BE84D   // Hover state

/* ═══════════════════════════════════════════════════════════════
   ACTION COLORS (intentional, consistent across themes)
   ═══════════════════════════════════════════════════════════════ */
--fitness-action-update: #74C4FC        // Light blue for edit/update
--fitness-action-update-rgb: 116, 196, 252
--fitness-action-update-hover: #5AB8FA

--fitness-action-delete: #FF6B6B        // Coral red for destructive
--fitness-action-delete-rgb: 255, 107, 107
--fitness-action-delete-hover: #FF5252

/* ═══════════════════════════════════════════════════════════════
   BACKGROUNDS (adapt to light/dark mode)
   ═══════════════════════════════════════════════════════════════ */
--fitness-bg-page              // Page background (#F5F8F6 / #0f1511)
--fitness-bg-card              // Card surfaces (#FFFFFF / #1a1f1c)
--fitness-bg-card-nested       // Nested cards (#f8faf9 / #222723)
--fitness-bg-elevated          // Dialogs, menus
--fitness-bg-chip              // Chips, badges, tags
--fitness-bg-input             // Form inputs

/* ═══════════════════════════════════════════════════════════════
   TEXT COLORS (adapt to light/dark mode)
   ═══════════════════════════════════════════════════════════════ */
--fitness-text-primary         // Main content
--fitness-text-secondary       // Labels, secondary info
--fitness-text-tertiary        // Placeholders, disabled
--fitness-dark                 // High contrast text (inverts in dark mode)

/* ═══════════════════════════════════════════════════════════════
   BORDERS & SHADOWS (adapt to light/dark mode)
   ═══════════════════════════════════════════════════════════════ */
--fitness-border               // Subtle borders
--fitness-border-strong        // Focus/active borders
--fitness-shadow               // Base shadow
--fitness-shadow-strong        // Elevated shadow
--fitness-shadow-glow-sm       // Small primary glow
--fitness-shadow-glow          // Primary color glow
--fitness-shadow-glow-lg       // Large primary glow
--fitness-shadow-glow-update   // Update action glow
--fitness-shadow-dropdown      // Dropdown/menu shadow

/* ═══════════════════════════════════════════════════════════════
   STATUS COLORS (semantic states)
   ═══════════════════════════════════════════════════════════════ */
--fitness-status-success       // Green - positive metrics
--fitness-status-success-rgb   // RGB variant
--fitness-status-info          // Blue - neutral insights
--fitness-status-info-rgb
--fitness-status-warning       // Yellow - cautions, in-progress
--fitness-status-warning-rgb
```

### Usage Rules

| ✅ DO | ❌ DON'T |
|-------|----------|
| `background-color: var(--fitness-bg-card);` | `background-color: #FFFFFF;` |
| `color: var(--fitness-text-primary);` | `color: #111813;` |
| `border: 1px solid var(--fitness-border);` | `border: 1px solid rgba(0,0,0,0.1);` |
| `rgba(var(--fitness-primary-rgb), 0.15)` | `rgba(13, 242, 89, 0.15)` |

### Theme Toggle

```typescript
import { ThemeService } from './services/theme.service';

private readonly themeService = inject(ThemeService);

this.themeService.toggleTheme();         // Toggle light/dark
this.themeService.setTheme('dark');      // Set specific theme
const theme = this.themeService.currentTheme(); // Read current
```

---

## 🧭 Header & Navigation

### Sticky Glassmorphism Header (app.scss)

```scss
.app-toolbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: color-mix(in srgb, var(--fitness-bg-page), transparent 10%) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--fitness-text-primary) !important;
  box-shadow: 0 4px 20px var(--fitness-shadow) !important;
  border-bottom: 1px solid var(--fitness-border);
  height: 100px !important;
  transition: all 0.3s ease;
}
```

### Navigation Links with Animated Underline

```scss
.app-nav a {
  color: var(--fitness-text-secondary);
  font-weight: 600;
  text-decoration: none;
  position: relative;
  padding: 0.75rem 0;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--fitness-primary);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
    border-radius: 3px;
    box-shadow: var(--fitness-shadow-glow-sm);
  }

  &:hover, &.active-link {
    color: var(--fitness-text-primary);
    &::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }
}
```

### Icon Button Pill Container

```scss
.header-actions-pill {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.125rem 0.25rem;
  background-color: color-mix(in srgb, var(--fitness-bg-elevated), transparent 70%);
  border: 1px solid color-mix(in srgb, var(--fitness-border), transparent 50%);
  border-radius: 50px;
  transition: all 0.2s ease;
}
```

---

## 📦 Components

### Cards

**Base Pattern:**
```scss
.card {
  background-color: var(--fitness-bg-card);
  border-radius: 12px;
  border: 1px solid var(--fitness-border);
  box-shadow: none;
  padding: 1.5rem;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }
}
```

**Nested Card Pattern:**
```scss
.parent-card {
  background-color: var(--fitness-bg-card);
}

.nested-card {
  background-color: var(--fitness-bg-card-nested);
  border-radius: 12px;
  border: 1px solid var(--fitness-border);
  padding: 1rem;
}
```

**Card with Status Border:**
```scss
.detail-card.in-progress {
  border: 2px solid rgba(var(--fitness-status-warning-rgb), 0.6) !important;
  box-shadow: 0 0 20px rgba(var(--fitness-status-warning-rgb), 0.15) !important;
}
```

---

### Buttons

| Type | Variable | Usage |
|------|----------|-------|
| **Primary** | `--fitness-primary` | Create, Add, Confirm, Start |
| **Update** | `--fitness-action-update` | Update (submit form changes) |
| **Delete** | `--fitness-action-delete` | Delete, Remove |
| **Text** | transparent | Cancel, Back |
| **Secondary** | transparent + border | Guest access, alternative actions |

**Primary Button:**
```scss
.primary-btn, .login-btn {
  background-color: var(--fitness-primary) !important;
  color: var(--fitness-dark) !important;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  text-transform: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--fitness-primary-hover) !important;
    transform: translateY(-2px);
    box-shadow: var(--fitness-shadow-glow);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

**Secondary/Outline Button:**
```scss
.access-btn {
  background-color: transparent !important;
  border: 1px solid var(--fitness-border) !important;
  color: var(--fitness-text-primary) !important;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--fitness-bg-chip) !important;
  }
}
```

**Delete Button:**
```scss
.delete-btn {
  background-color: var(--fitness-action-delete);
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--fitness-action-delete-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--fitness-action-delete-rgb), 0.3);
  }
}
```

**Back/Text Button:**
```scss
.back-btn {
  color: var(--fitness-text-primary) !important;
  font-weight: 500 !important;
  text-transform: none !important;
  background-color: transparent;

  mat-icon {
    margin-right: 0.5rem;
  }

  &:hover {
    color: var(--fitness-primary) !important;
  }
}
```

**Button Group (Equal Width):**
```scss
.button-group {
  display: flex;
  gap: 1rem;
  align-items: stretch;

  button {
    flex: 1;
    height: 48px !important;
  }
}
```

---

### Status Chips

**Semantic Status Chip:**
```scss
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;

  mat-icon {
    font-size: 1rem;
    width: 1rem;
    height: 1rem;
  }

  &.completed {
    background-color: rgba(var(--fitness-primary-rgb), 0.15);
    color: var(--fitness-primary);
  }

  &.in-progress {
    background-color: rgba(var(--fitness-status-warning-rgb), 0.15);
    color: var(--fitness-status-warning);
  }
}
```

**Stat Item with Comparison State:**
```scss
.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.8rem;
  background-color: var(--fitness-bg-card);
  border-radius: 10px;
  border: 1px solid var(--fitness-border);
  font-weight: 500;

  &.better {
    background-color: rgba(var(--fitness-status-success-rgb), 0.15);
    border-color: rgba(var(--fitness-status-success-rgb), 0.4);
    color: var(--fitness-status-success);
    font-weight: 600;
  }

  &.worse {
    background-color: rgba(var(--fitness-action-delete-rgb), 0.15);
    border-color: rgba(var(--fitness-action-delete-rgb), 0.4);
    color: var(--fitness-action-delete);
    font-weight: 600;
  }
}
```

**Category Chip:**
```scss
.category-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  background-color: var(--fitness-bg-chip);
  border: 1px solid var(--fitness-border);
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--fitness-text-secondary);
  font-weight: 500;
  text-transform: capitalize;
}
```

---

### Forms & Inputs

**Material Form Field Overrides:**
```scss
::ng-deep {
  .mat-mdc-form-field {
    .mdc-text-field--filled {
      background-color: var(--fitness-bg-input) !important;
      border-radius: 8px 8px 0 0;
    }

    .mdc-floating-label {
      color: var(--fitness-text-secondary);
    }

    .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
      border-bottom-color: var(--fitness-primary);
    }

    input {
      color: var(--fitness-text-primary);
    }
  }
}
```

**Error Message:**
```scss
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--fitness-action-delete);
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: rgba(var(--fitness-action-delete-rgb), 0.1);
  border-radius: 8px;
  border: 1px solid var(--fitness-action-delete);

  mat-icon {
    font-size: 1.25rem;
    width: 1.25rem;
    height: 1.25rem;
  }
}
```

---

### Dialogs

**Opening Dialogs:**
```typescript
this.dialog.open(ComponentName, {
  width: '500px',                          // 500px for forms, 400px for confirmations
  maxWidth: '96vw',
  panelClass: 'custom-dialog-container',   // REQUIRED for themed background
  data: { /* ... */ }
});
```

**Global Dialog Styling (styles.scss):**
```scss
.custom-dialog-container .mat-mdc-dialog-container {
  background-color: var(--fitness-bg-card) !important;
  border-radius: 12px !important;
  border: 1px solid var(--fitness-border);
}
```

---

### Snackbars

**Configuration:**
```typescript
this.snackBar.open(message, 'Close', {
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  panelClass: ['success-snackbar'],  // or 'error-snackbar'
});
```

**Snackbar Styles (styles.scss):**
```scss
.success-snackbar .mdc-snackbar__surface {
  background-color: var(--fitness-primary) !important;
}

.error-snackbar .mdc-snackbar__surface {
  background-color: var(--fitness-action-delete) !important;
}
```

---

## 📐 Layout

### Page Container

```scss
.page-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem;
  box-sizing: border-box;
  overflow-x: hidden;
}
```

### View Header

```scss
.view-header {
  background-color: transparent;
  padding: 1rem 0 1rem 1.5rem;
  border-left: 5px solid var(--fitness-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--fitness-dark);
    margin: 0;
  }
}
```

### Grid Layout

```scss
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
```

### Empty State

```scss
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem;
  color: var(--fitness-text-tertiary);
  background-color: var(--fitness-bg-chip);
  border-radius: 12px;
  border: 2px dashed var(--fitness-border);

  mat-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }
}
```

---

## 🎯 Timeline Component

**Basic Timeline:**
```scss
.timeline {
  position: relative;
  padding: 1rem 0 1rem 2rem;
  margin-left: 1rem;

  &::before {
    content: '';
    position: absolute;
    left: -0.1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(var(--fitness-primary-rgb), 0.35);
    border-radius: 4px;
  }
}

.timeline-marker {
  position: absolute;
  left: -2.735rem;
  top: 1.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--fitness-primary);
  border: 3px solid var(--fitness-bg-page);
  box-shadow: 0 0 0 2px rgba(var(--fitness-primary-rgb), 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
```

---

## ✨ Advanced Animations

### Glassmorphism Cards

```scss
.buzzword-card {
  background: color-mix(in srgb, var(--fitness-bg-elevated), transparent 90%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid var(--fitness-border);
  border-radius: 16px;
  transition: all 0.3s ease-out;
}
```

### Animated Border (CSS @property)

```scss
@property --border-progress {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.card::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 4px;
  background: conic-gradient(var(--fitness-primary) var(--border-progress), transparent 0deg);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  --border-progress: 0deg;
  transition: --border-progress 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}

.card.active::after {
  opacity: 1;
  --border-progress: 360deg;
}
```

### Scroll Indicator Animation

```scss
@keyframes scrollWheel {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(12px);
  }
}

.wheel {
  animation: scrollWheel 1.5s infinite;
}
```

---

## 📝 Typography

**Font Family:**
```scss
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Headings:**

| Level | Size | Weight |
|-------|------|--------|
| H1 (Page) | 2.5rem | 700 |
| H1 (Card) | 2rem | 700 |
| H2 | 1.5rem | 600 |
| H3 | 1.25rem | 600 |
| H4 | 1.1rem | 600 |

**Labels:**
```scss
.label, .detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--fitness-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## 📱 Responsive Breakpoints

```scss
@media (max-width: 1200px) { }  // Large tablets, small desktops
@media (max-width: 900px)  { }  // Tablets - mobile nav kicks in
@media (max-width: 768px)  { }  // Mobile
@media (max-width: 640px)  { }  // Small mobile
@media (max-width: 480px)  { }  // Extra small mobile
```

**Mobile Header Pattern (900px):**
```scss
@media (max-width: 900px) {
  .app-toolbar {
    height: 72px !important;
  }

  .app-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: var(--fitness-bg-card);
    border-radius: 0 0 16px 16px;
    box-shadow: var(--fitness-shadow-dropdown);
    transform: translateY(-10px);
    opacity: 0;
    visibility: hidden;

    &.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
  }
}
```

---

## 📐 Spacing Reference

| Size | Value |
|------|-------|
| XS | 0.25rem (4px) |
| SM | 0.5rem (8px) |
| MD | 1rem (16px) |
| LG | 1.5rem (24px) |
| XL | 2rem (32px) |
| 2XL | 2.5rem (40px) |

**Common Paddings:**
- Card content: `1.5rem` / `2rem`
- Nested card: `1rem`
- Button: `0.5rem 1.5rem`
- Page content: `2.5rem`
- Mobile page: `1rem` - `1.5rem`

---

## ✅ Checklist for New Components

### Theme Compliance
- [ ] No hardcoded `#` color values
- [ ] All backgrounds use `var(--fitness-bg-*)`
- [ ] All text uses `var(--fitness-text-*)` or `var(--fitness-dark)`
- [ ] All borders use `var(--fitness-border*)`
- [ ] All shadows use `var(--fitness-shadow*)`
- [ ] Status colors use `var(--fitness-status-*)`
- [ ] Tested in both light AND dark modes

### Component Standards
- [ ] Cards: 12px border radius, proper padding
- [ ] Cards: Hover lift effect (`translateY(-2px)`)
- [ ] Buttons: Correct color for action type
- [ ] Buttons: Include appropriate Material Icon
- [ ] Dialogs: Include `panelClass: 'custom-dialog-container'`
- [ ] Forms: Include "* Required fields" hint
- [ ] Inputs: Override Material styles for theme

### Layout
- [ ] Responsive styles for mobile (`@media (max-width: 768px)`)
- [ ] Proper flex/grid layout
- [ ] Empty state handling with dashed border

---

## 🚫 Don'ts

- ❌ Hardcoded colors (breaks dark mode)
- ❌ Shadows on cards by default
- ❌ Uppercase text (except labels)
- ❌ Emojis in UI (use Material Icons)
- ❌ Background on text button hover
- ❌ Non-standard border radius (use 6/8/12/16/28/999px)
- ❌ Missing `::ng-deep` for Material overrides in components

## ✅ Do's

- ✅ CSS variables for all colors
- ✅ Material Icons for all icons
- ✅ Transitions on interactive elements (`0.2s ease`)
- ✅ Consistent hover effects
- ✅ Poppins font family
- ✅ `color-mix()` for transparent backgrounds
- ✅ `rgba(var(--*-rgb), opacity)` for colored transparency
- ✅ Responsive design at all breakpoints

---

**Last Updated:** January 2026  
**Version:** 4.0  
**Reference Implementations:** `exercises-lib`, `sessions-lib`, `plans-lib`, `workouts-lib`
