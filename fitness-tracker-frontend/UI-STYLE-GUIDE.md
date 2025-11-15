# Fitness Tracker UI Style Guide

This document defines the consistent styling rules for all components in the Fitness Tracker application.

## 🎨 Color Palette

### CSS Variables
```css
--fitness-primary: #0DF259    /* Bright Green - Primary actions, accents */
--fitness-light-gray: #F5F8F6 /* Light Gray - Page background */
--fitness-white: #FFFFFF      /* White - Card backgrounds */
--fitness-dark: #111813       /* Dark - Text, borders */
```

### Semantic Colors
- **Primary Green**: `#0DF259` - Main brand color, active states, primary buttons
- **Light Green Hover**: `#0BE84D` - Hover state for green buttons
- **Coral Red**: `#FF6B6B` - Delete buttons, destructive actions
- **Dark Red Hover**: `#FF5252` - Hover state for delete buttons
- **Text Gray**: `#64748b` - Secondary text, labels
- **Light Gray Background**: `#f1f5f9` - Chips, tags

## 📦 Cards

### Base Card Styling
```css
background-color: #FFF;
border-radius: 12px;
border: 1px solid rgba(17, 24, 19, 0.1);
box-shadow: none;
transition: transform 0.2s ease;
cursor: pointer; /* For clickable cards */
```

### Card Hover Effect
```css
transform: translateY(-2px);
```

**Important:** Cards should NOT change border color on hover. Only apply the lift effect (translateY).

## 🔘 Buttons

### Primary Button (Green)
```css
background-color: var(--fitness-primary);
color: var(--fitness-dark);
border-radius: 8px;
padding: 0.5rem 1.5rem;
font-weight: 500;
text-transform: none;
box-shadow: none;
transition: all 0.2s ease;
```

**Hover State:**
```css
background-color: #0BE84D;
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(13, 242, 89, 0.3);
```

### Update Button (Blue)
```css
background-color: #3B82F6;
color: white;
border-radius: 8px;
padding: 0.5rem 1.5rem;
font-weight: 500;
text-transform: none;
box-shadow: none;
transition: all 0.2s ease;
```

**Hover State:**
```css
background-color: #2563EB;
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
```

### Delete Button (Coral Red)
```css
background-color: #FF6B6B;
color: white;
border-radius: 8px;
padding: 0.5rem 1.5rem;
font-weight: 500;
text-transform: none;
box-shadow: none;
transition: all 0.2s ease;
```

**Hover State:**
```css
background-color: #FF5252;
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
```

### Text Button (Cancel, Secondary Actions)
```css
color: var(--fitness-dark);
background-color: transparent;
border-radius: 0;
padding: 0.5rem 1rem;
font-weight: 500;
text-transform: none;
transition: all 0.2s ease;
```

**Hover State:**
```css
background-color: transparent;
color: var(--fitness-primary);
/* No lift effect - text only changes color */
```

### FAB (Floating Action Button)
```css
background-color: var(--fitness-primary);
color: var(--fitness-dark);
border-radius: 28px;
padding: 0 1.5rem;
height: 56px;
font-weight: 600;
text-transform: none;
box-shadow: 0 4px 12px rgba(13, 242, 89, 0.3);
transition: all 0.2s ease;
```

**Hover State:**
```css
background-color: #0BE84D;
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(13, 242, 89, 0.4);
```

## 🏷️ Tags & Chips

### Muscle Group Chips
```css
display: inline-block;
padding: 0.25rem 0.75rem;
background-color: #f1f5f9;
border-radius: 16px;
font-size: 0.875rem;
color: var(--fitness-dark);
```

## 📝 Typography

### Font Family
```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Headings
- **H1**: `2.5rem`, `font-weight: 700`, `color: var(--fitness-dark)`
- **H2**: `1.5rem`, `font-weight: 600`, `color: var(--fitness-dark)`
- **H3**: `1.25rem`, `font-weight: 600`, `color: var(--fitness-dark)`

### Body Text
- **Primary**: `1rem`, `color: var(--fitness-dark)`
- **Secondary**: `0.875rem`, `color: #64748b`

### Labels
```css
font-size: 0.875rem;
font-weight: 600;
color: #64748b;
text-transform: uppercase;
letter-spacing: 0.05em;
```

## 🎭 Icons

### Material Icons
- Use `<span class="material-icons">icon_name</span>`
- **Size**: `3rem` for large icons (cards, stats)
- **Size**: `24px` for buttons
- **Color**: `var(--fitness-primary)` for primary icons
- **Color**: `var(--fitness-dark)` for standard icons

## 🗨️ Dialogs

### Dialog Container
```css
background-color: #FFF;
border-radius: 12px;
```

**Usage:**
```typescript
this.dialog.open(Component, {
  width: '500px',
  panelClass: 'custom-dialog-container',
});
```

### Dialog Buttons
- **Primary Action**: Use primary button style (green)
- **Destructive Action**: Use delete button style (coral red)
- **Cancel**: Use text button style (no background, green on hover)

## 📱 Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) { }

/* Small Tablet */
@media (max-width: 900px) { }

/* Mobile */
@media (max-width: 768px) { }

/* Small Mobile */
@media (max-width: 480px) { }
```

## 🎯 Navigation

### Header Navigation Links
```css
color: var(--fitness-dark);
font-weight: 500;
font-size: 1rem;
transition: all 0.2s ease;
border-radius: 6px;
padding: 0.75rem 1.5rem;
background-color: transparent;
```

**Hover State:**
```css
color: var(--fitness-primary);
background-color: transparent;
```

**Active State:**
```css
background-color: var(--fitness-primary);
color: var(--fitness-dark);
```

## ✨ Animations & Transitions

### Standard Transition
```css
transition: all 0.2s ease;
```

### Hover Lift Effect
```css
transform: translateY(-2px);
```

### Shadow Transitions
- **Green**: `box-shadow: 0 4px 12px rgba(13, 242, 89, 0.3);`
- **Red**: `box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);`

## 📐 Spacing

### Standard Gaps
- **Small**: `0.5rem` (8px)
- **Medium**: `1rem` (16px)
- **Large**: `1.5rem` (24px)
- **Extra Large**: `2.5rem` (40px)

### Padding
- **Card Content**: `1.5rem`
- **Button**: `0.5rem 1.5rem`
- **Text Button**: `0.5rem 1rem`
- **Page Content**: `2rem`

## 📋 Layout Patterns

### Horizontal Card Layout

For cards that need to display multiple pieces of information efficiently:

```scss
.card-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.content-section {
  flex: 1; /* Takes available space */
}

.actions-section {
  flex-shrink: 0; /* Fixed width, doesn't shrink */
  align-self: flex-start; /* or flex-end */
}
```

**Key Principles:**
- Use `display: flex` with `justify-content: space-between` for main wrapper
- Content section uses `flex: 1` to take available space
- Actions section uses `flex-shrink: 0` to maintain fixed width
- Add `gap: 2rem` for consistent spacing
- Use `flex-wrap: wrap` on inner rows for responsive behavior
- Stack vertically on mobile with media queries

**When to Use:**
- List items with actions (edit, delete)
- Cards with multiple data fields
- Dashboard widgets with controls
- Any component where horizontal space utilization is important

## 🎨 Component Examples

### Exercise Card

**Layout Structure:**
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
  gap: 1rem;
}

.details-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.actions-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}
```

**Styling:**
- White background (`#FFF`)
- 12px border radius
- 1.5rem padding
- Horizontal layout with flexbox
- Info section (left): Exercise name, category, muscle groups, description
- Actions section (right): Delete button and view details hint
- Details row: Category and Muscle Groups displayed horizontally with 2rem gap
- Hover: Lift 2px (no shadow on card, only on buttons)
- Delete button anchored to the right

**Responsive:**
- On mobile (< 768px): Stack vertically
- Actions section becomes horizontal row at bottom

### Dialog
- White background
- 12px border radius
- Cancel button: Text-only, green on hover
- Primary button: Green background, lift on hover
- Delete button: Coral red, lift on hover

### FAB Button
- Fixed position: `bottom: 2rem; left: 2rem`
- Green background
- Extended with icon + text
- Shadow by default
- Lift and enhanced shadow on hover

## 🚫 Don'ts

- ❌ Don't use shadows on cards by default
- ❌ Don't use uppercase text transformation (except labels)
- ❌ Don't use emojis (use Material Icons instead)
- ❌ Don't use blue colors (replaced with green)
- ❌ Don't add background to text buttons on hover
- ❌ Don't use different border radius values (stick to 6px, 8px, 12px, 16px, 28px)

## ✅ Do's

- ✅ Use Material Icons for all icons
- ✅ Use CSS variables for colors
- ✅ Add transition to all interactive elements
- ✅ Use consistent hover effects (lift + shadow for buttons, color change for text)
- ✅ Keep card backgrounds white
- ✅ Keep page background light gray
- ✅ Use Poppins font throughout
- ✅ Add proper spacing between elements
- ✅ Make all components responsive

---

**Last Updated**: November 15, 2025
**Version**: 1.0
