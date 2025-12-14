# UI Style Guide

This document defines the styling rules and patterns for all components in this application. **All new components must follow these guidelines** to ensure visual consistency and dark mode compatibility.

> **Reference Implementations:** See `exercises-lib`, `sessions-lib`, and `plans-lib` for working examples.

---

## 🎨 Theme System

### Core Principle

**All components MUST use CSS custom properties for theming.** Never use hardcoded colors.

### Theme Variables

```scss
/* ═══════════════════════════════════════════════════════════════
   BRAND COLORS (consistent across light/dark modes)
   ═══════════════════════════════════════════════════════════════ */
--fitness-primary              // Main brand color (green)
--fitness-primary-hover        // Hover state for primary

/* ═══════════════════════════════════════════════════════════════
   ACTION COLORS (intentional, consistent across themes)
   ═══════════════════════════════════════════════════════════════ */
--fitness-action-update        // Light blue for edit/update
--fitness-action-update-hover  // Hover state
--fitness-action-delete        // Coral red for destructive actions
--fitness-action-delete-hover  // Hover state

/* ═══════════════════════════════════════════════════════════════
   BACKGROUNDS (adapt to light/dark mode)
   ═══════════════════════════════════════════════════════════════ */
--fitness-bg-page              // Page background
--fitness-bg-card              // Card surfaces
--fitness-bg-card-nested       // Nested cards (cards within cards)
--fitness-bg-elevated          // Dialogs, menus
--fitness-bg-chip              // Chips, badges, tags
--fitness-bg-input             // Form inputs

/* ═══════════════════════════════════════════════════════════════
   TEXT COLORS (adapt to light/dark mode)
   ═══════════════════════════════════════════════════════════════ */
--fitness-text-primary         // Main content
--fitness-text-secondary       // Labels, secondary info
--fitness-text-tertiary        // Placeholders, disabled
--fitness-dark                 // High contrast text

/* ═══════════════════════════════════════════════════════════════
   BORDERS & SHADOWS (adapt to light/dark mode)
   ═══════════════════════════════════════════════════════════════ */
--fitness-border               // Subtle borders
--fitness-border-strong        // Focus/active borders
--fitness-shadow               // Base shadow
--fitness-shadow-strong        // Elevated shadow
--fitness-shadow-glow          // Primary color glow effect
--fitness-shadow-glow-update   // Update action glow
--fitness-shadow-dropdown      // Dropdown/menu shadow

/* ═══════════════════════════════════════════════════════════════
   STATUS COLORS (semantic states)
   ═══════════════════════════════════════════════════════════════ */
--fitness-status-success       // Green - positive metrics
--fitness-status-info          // Blue - neutral insights
--fitness-status-warning       // Yellow - cautions
```

### Usage Rules

| ✅ DO | ❌ DON'T |
|-------|----------|
| `background-color: var(--fitness-bg-card);` | `background-color: #FFFFFF;` |
| `color: var(--fitness-text-primary);` | `color: #111813;` |
| `border: 1px solid var(--fitness-border);` | `border: 1px solid rgba(0,0,0,0.1);` |

### Theme Toggle

```typescript
import { ThemeService } from './services/theme.service';

private readonly themeService = inject(ThemeService);

// Toggle between light/dark
this.themeService.toggleTheme();

// Set specific theme
this.themeService.setTheme('dark');

// Read current theme
const theme = this.themeService.currentTheme();
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

**Layout Pattern:**
```scss
.card-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.actions-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
```

**Card Footer:**
```scss
.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid var(--fitness-border);
}
```

---

### Buttons

| Type | Variable | Usage |
|------|----------|-------|
| **Primary** | `--fitness-primary` | Create, Add, Confirm |
| **Update** | `--fitness-action-update` | Edit, Update |
| **Delete** | `--fitness-action-delete` | Delete, Remove |
| **Text** | transparent | Cancel, Back |

**Primary Button:**
```scss
.primary-btn, .create-btn {
  background-color: var(--fitness-primary);
  color: var(--fitness-dark);
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  text-transform: none;
  box-shadow: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--fitness-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--fitness-shadow-glow);
  }
}
```

**Update Button:**
```scss
.update-btn {
  background-color: var(--fitness-action-update);
  color: var(--fitness-dark);
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  text-transform: none;
  box-shadow: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--fitness-action-update-hover);
    transform: translateY(-2px);
    box-shadow: var(--fitness-shadow-glow-update);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  text-transform: none;
  box-shadow: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--fitness-action-delete-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--fitness-action-delete-rgb), 0.3);
  }
}
```

**Text/Cancel Button:**
```scss
.cancel-btn {
  color: var(--fitness-dark);
  background-color: transparent;
  border-radius: 0;
  padding: 0.5rem 1rem;
  font-weight: 500;
  text-transform: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: transparent;
    color: var(--fitness-primary);
  }
}
```

**FAB (Floating Action Button):**
```scss
.fab {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background-color: var(--fitness-primary);
  color: var(--fitness-dark);
  border-radius: 28px;
  padding: 0 1.5rem;
  height: 56px;
  font-weight: 600;
  text-transform: none;
  box-shadow: var(--fitness-shadow-glow);
  z-index: 100;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--fitness-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--fitness-shadow-glow-lg);
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    left: 1rem;
  }
}
```

**Button Icon Rules:**
- Delete buttons: Include `delete` icon
- Edit buttons: Include `edit` icon  
- Create/Add buttons: Include `add` icon

---

### Chips & Tags

**Stat Chip:**
```scss
.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.8rem;
  background-color: var(--fitness-bg-card);
  border-radius: 12px;
  border: 1px solid var(--fitness-border);
  font-weight: 500;
  color: var(--fitness-dark);
  min-width: 90px;

  .stat-icon {
    font-size: 1rem;
    width: 1rem;
    height: 1rem;
    color: var(--fitness-text-secondary);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--fitness-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-value {
    font-size: 0.85rem;
    color: var(--fitness-dark);
    font-weight: 600;
  }
}
```

**Category/Tag Chip:**
```scss
.tag-chip {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--fitness-bg-chip);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--fitness-dark);
}
```

**Order Chip:**
```scss
.order-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: var(--fitness-bg-chip);
  border: 1px solid var(--fitness-border);
  color: var(--fitness-text-secondary);
  font-weight: 500;
  font-size: 0.85rem;
  height: 1.25rem;

  .order-value {
    color: var(--fitness-dark);
    font-weight: 600;
  }
}
```

**Count Chip:**
```scss
.count-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.4rem;
  min-width: 1.4rem;
  padding: 0 0.45rem;
  background-color: var(--fitness-bg-chip);
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--fitness-text-secondary);
  border: 1px solid var(--fitness-border);
}
```

---

### Dialogs

**Opening Dialogs:**
```typescript
this.dialog.open(ComponentName, {
  width: '500px',                          // 500px for forms, 400px for confirmations
  maxWidth: '96vw',                        // Responsive max
  panelClass: 'custom-dialog-container',   // REQUIRED for white background
  data: { /* ... */ }
});
```

**Dialog Content Styling:**
```scss
mat-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 400px;
  padding: 1rem 0;
  overflow: visible !important;
}

.required-hint {
  margin: 0 0 1rem 0;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: var(--fitness-text-secondary);
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

mat-form-field {
  width: 100%;
}
```

**Dialog Actions:**
```scss
.dialog-actions, mat-dialog-actions {
  padding: 1rem 1.4rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
```

**Scrollable Dialogs:**
```scss
.dialog-content {
  max-height: 74vh;
  overflow-y: auto;
  overflow-x: visible;
}
```

---

### Snackbars

**Configuration:**
```typescript
this.snackBar.open(message, 'Close', {
  duration: 3000,                    // 3-5 seconds
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  panelClass: ['success-snackbar'],  // or 'error-snackbar'
});
```

**Success Snackbar:** Green background (uses primary color)  
**Error Snackbar:** Red background (hardcoded for visibility)

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
  position: relative;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--fitness-dark);
    margin: 0;
  }

  .subtitle {
    color: var(--fitness-text-secondary);
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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

### List Layout

```scss
.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

### Empty State

```scss
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2.5rem;
  color: var(--fitness-text-tertiary);
  background-color: var(--fitness-bg-chip);
  border-radius: 12px;
  border: 2px dashed var(--fitness-border);

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-weight: 500;
  }
}
```

---

## 🎯 Timeline Component

For displaying sequential items (sessions, events, etc.):

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

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;

  &.last-item {
    margin-bottom: 0;
  }

  &:has(.timeline-content:hover) .timeline-marker {
    transform: scale(1.1);
    box-shadow: 0 0 0 3px rgba(var(--fitness-primary-rgb), 0.4);
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
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.timeline-content {
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}
```

**Drag-Drop Timeline:**
```scss
.timeline-wrapper {
  --timeline-line-x: 1rem;
  --timeline-left-space: 2.735rem;
  position: relative;
  padding-left: var(--timeline-left-space);
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;

  &::before {
    content: '';
    position: absolute;
    left: var(--timeline-line-x);
    top: -0.75rem;
    bottom: -0.75rem;
    width: 2px;
    background: rgba(var(--fitness-primary-rgb), 0.4);
    border-radius: 4px;
  }
}

// Drag states
.timeline-item.cdk-drag-preview .drag-card {
  box-shadow: 0 0 0 2px rgba(var(--fitness-primary-rgb), 0.35), var(--fitness-shadow-glow);
  transform: scale(1.01);
  background: rgba(var(--fitness-primary-rgb), 0.12);
}

.timeline-item.cdk-drag-placeholder .drag-card {
  border: 2px dashed rgba(var(--fitness-primary-rgb), 0.8);
  background: var(--fitness-bg-card);
  box-shadow: 0 0 0 2px rgba(var(--fitness-primary-rgb), 0.3);
}

.timeline-item.cdk-drag-animating {
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
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
| H1 | 2.5rem | 700 |
| H2 | 1.5rem | 600 |
| H3 | 1.25rem | 600 |

**Labels:**
```scss
.label {
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
// Tablet
@media (max-width: 1024px) { }

// Small Tablet
@media (max-width: 900px) { }

// Mobile
@media (max-width: 768px) { }

// Small Mobile
@media (max-width: 480px) { }
```

**Common Responsive Patterns:**
```scss
@media (max-width: 768px) {
  .card-content-wrapper {
    flex-direction: column;
    gap: 1rem;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    font-size: 1.5rem;
  }
}
```

---

## ✨ Animations

**Standard Transition:**
```scss
transition: all 0.2s ease;
```

**Hover Lift:**
```scss
&:hover {
  transform: translateY(-2px);
}
```

**Glow Effects:**
```scss
box-shadow: var(--fitness-shadow-glow);        // Primary (green)
box-shadow: var(--fitness-shadow-glow-update); // Update (blue)
```

---

## 📐 Spacing

| Size | Value |
|------|-------|
| Small | 0.5rem (8px) |
| Medium | 1rem (16px) |
| Large | 1.5rem (24px) |
| Extra Large | 2.5rem (40px) |

**Common Paddings:**
- Card content: `1.5rem`
- Button: `0.5rem 1.5rem`
- Text button: `0.5rem 1rem`
- Page content: `2rem` - `2.5rem`

---

## ✅ Checklist for New Components

Before committing any new SCSS file:

### Theme Compliance
- [ ] No hardcoded `#` color values
- [ ] All backgrounds use `var(--fitness-bg-*)`
- [ ] All text uses `var(--fitness-text-*)`
- [ ] All borders use `var(--fitness-border*)`
- [ ] All shadows use `var(--fitness-shadow*)`
- [ ] Tested in both light AND dark modes

### Component Standards
- [ ] Cards: 12px border radius, 1.5rem padding
- [ ] Cards: Hover lift effect (translateY)
- [ ] Buttons: Correct color for action type
- [ ] Buttons: Include appropriate icon
- [ ] Dialogs: Include `panelClass: 'custom-dialog-container'`
- [ ] Forms: Include "* Required fields" hint

### Layout
- [ ] Responsive styles for mobile (`@media (max-width: 768px)`)
- [ ] Proper flex/grid layout
- [ ] Empty state handling

---

## 🚫 Don'ts

- ❌ Hardcoded colors (breaks dark mode)
- ❌ Shadows on cards by default
- ❌ Uppercase text (except labels)
- ❌ Emojis (use Material Icons)
- ❌ Background on text button hover
- ❌ Non-standard border radius (use 6/8/12/16/28px)

## ✅ Do's

- ✅ CSS variables for all colors
- ✅ Material Icons for all icons
- ✅ Transitions on interactive elements
- ✅ Consistent hover effects
- ✅ Poppins font family
- ✅ Proper spacing
- ✅ Responsive design

---

**Last Updated:** December 2025  
**Version:** 3.0  
**Reference Implementations:** `exercises-lib`, `sessions-lib`, `plans-lib`
