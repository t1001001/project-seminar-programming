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

### Global Styles (`src/styles.scss`)

The application uses a global stylesheet at `src/styles.scss` that defines:

1. **Material Theme Configuration**
   - Custom color palettes for primary (green) and accent (dark) colors
   - Typography using Poppins font
   - Density settings

2. **Page Background**
   - `background-color: #F5F8F6` applied to `html` and `body`
   - Light gray background for the entire application

3. **Dialog Styling**
   ```scss
   .custom-dialog-container .mat-mdc-dialog-container {
     background-color: #FFF !important;
     border-radius: 12px !important;
   }
   ```
   - **CRITICAL**: All dialogs must use `panelClass: 'custom-dialog-container'` to get white background
   - This class is defined globally and applies to all Material dialogs

4. **Snackbar Styling**
   - `.success-snackbar` for success messages (green background)
   - Default snackbar styling with dark background

**Important**: When opening any Material dialog, always include:
```typescript
this.dialog.open(ComponentName, {
  panelClass: 'custom-dialog-container',  // Required for white background
  // ... other config
});
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

**Usage:**
- Use for create/add actions
- For edit actions specifically, include an `edit` icon (pen) before the button text
- Edit button example: `<mat-icon>edit</mat-icon> Edit`

### Update Button (Light Blue)
```css
background-color: #74C4FC;
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
background-color: #5AB8FA;
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(116, 196, 252, 0.3);
```

**Usage:**
- Use for update/edit actions that modify existing data
- Always use this specific blue color (#74C4FC) for consistency
- Pairs with Cancel (text button) and Delete (coral red) buttons

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

**Icon:**
- Always include a `delete` icon (trash can) before the button text
- Example: `<mat-icon>delete</mat-icon> Delete`

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
box-shadow: 0 4px 12px rgba(13, 242, 89, 0.3);
z-index: 100;
transition: all 0.2s ease;
```

**Hover State:**
```css
background-color: #0BE84D;
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(13, 242, 89, 0.4);
```

**Icon:**
- Always include an `add` icon (plus sign) before the button text
- Icon size: `24px`
- Icon margin-right: `0.5rem`
- Example: `<span class="material-icons">add</span> Create`

**Usage:**
- Use for primary create/add actions on overview/list pages
- Always use extended FAB (with text) rather than icon-only
- Fixed position at bottom-left of the page
- Stays visible while scrolling

**Responsive:**
```css
@media (max-width: 768px) {
  bottom: 1rem;
  left: 1rem;
}
```

### Button Usage Guidelines

**Action Type → Button Style:**
- **Create/Add**: Primary Button (Green `#0DF259`)
- **Update/Edit**: Update Button (Light Blue `#74C4FC`)
- **Delete/Remove**: Delete Button (Coral Red `#FF6B6B`)
- **Cancel/Back**: Text Button (Transparent, no background)
- **Main Page Action**: FAB (Green, floating)

**Important Rules:**
- ✅ Always use Light Blue (`#74C4FC`) for update/edit actions
- ✅ Always use Coral Red (`#FF6B6B`) for delete/remove actions
- ✅ Always use Green (`#0DF259`) for create/add actions
- ✅ Never mix button colors - each action type has one designated color
- ✅ Update buttons should always have dark text (`var(--fitness-dark)`)
- ✅ Delete buttons should always have white text
- ✅ Delete buttons must include a `delete` icon (trash can) before the text
- ✅ Edit buttons must include an `edit` icon (pen) before the text
- ✅ FAB buttons for create actions must include an `add` icon (plus sign) before the text

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

## 📢 Snackbar (Notifications)

### Configuration

```typescript
this.snackBar.open(message, action, {
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  panelClass: ['custom-snackbar-class'], // Optional
});
```

### Styling

**Default Snackbar:**
```scss
.mat-mdc-snack-bar-container {
  --mdc-snackbar-container-color: var(--fitness-dark);
  --mat-snack-bar-button-color: var(--fitness-primary);
}
```

**Error Variant:**
```scss
.error-snackbar {
  --mdc-snackbar-container-color: #FF6B6B;
  --mat-snack-bar-button-color: #FFFFFF;
}
```

### Guidelines

- **Duration**: 3-5 seconds
- **Position**: `horizontalPosition: 'center'`, `verticalPosition: 'bottom'`
- **Action Button Color**: Use `var(--fitness-primary)` for default, white for errors
- **Background**: Dark (`var(--fitness-dark)`) for default, coral red (`#FF6B6B`) for errors
- **Message**: Keep concise and clear
- **Panel Classes**: Use custom classes for variants (error, warning, info)

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

### Timeline Component

Used for displaying sequential events like training sessions.

**HTML Structure:**
```html
<div class="timeline">
  <!-- Loop for items -->
  <div class="timeline-item" [class.last-item]="last">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <mat-card class="session-card">
        <!-- Card Content -->
      </mat-card>
    </div>
  </div>
</div>
```

**SCSS Pattern:**
```scss
.timeline {
  position: relative;
  padding: 1rem 0 1rem 2rem;
  margin-left: 1rem;
  border-left: 2px solid rgba(13, 242, 89, 0.3); // Primary with opacity
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;

  &.last-item {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: -2.6rem;
  top: 1.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--fitness-primary);
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px rgba(13, 242, 89, 0.3);
  z-index: 1;
}

.timeline-content {
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px); // Vertical lift
  }
}
```

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

## 📚 Library Development Patterns

This section documents the consistent patterns used across all feature libraries (e.g., `exercises-lib`, `plans-lib`) to ensure uniformity and ease of development.

### Library Structure

All feature libraries follow this directory structure:

```
projects/[feature]-lib/src/lib/
├── provider-services/     # HTTP/API layer
├── logic-services/        # Business logic layer
├── ui/                    # Reusable UI components
└── views/                 # Smart container components (pages)
```

**Key Principles:**
- **Provider Services**: Handle all HTTP requests, define interfaces for data models
- **Logic Services**: Wrap provider services, add error handling, emit events for cross-component communication
- **UI Components**: Dumb/presentational components, receive data via `@Input()`, emit events via `@Output()`
- **Views**: Smart components that inject services, handle routing, manage state

### Component Configuration

#### Angular Component Decorator

**Standard Pattern:**
```typescript
@Component({
  selector: 'lib-component-name',  // or 'ex-component-name' for exercises
  imports: [
    MatDialogModule,      // Order: Material modules first
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,  // Then Angular modules
    AsyncPipe,           // Then pipes
  ],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

**Important:**
- ❌ Do NOT use `standalone: true` - it's redundant in modern Angular
- ✅ Always use `ChangeDetectionStrategy.OnPush` for performance
- ✅ Order imports: Material modules → Angular modules → Pipes → Custom components
- ✅ Use `styleUrl` (singular) not `styleUrls`

### Dialog Configuration

#### Opening Dialogs

**Required Pattern:**
```typescript
const dialogRef = this.dialog.open(ComponentName, {
  width: '500px',
  panelClass: 'custom-dialog-container',  // CRITICAL: Required for white background
});
```

**Critical Rules:**
- ✅ **ALWAYS** include `panelClass: 'custom-dialog-container'` - this applies the white background from global styles
- ✅ Standard width: `500px` for forms, `400px` for confirmations
- ✅ For delete dialogs, pass data: `data: { itemName: name }`

#### Form Dialog Component Structure

**TypeScript Pattern:**
```typescript
export class ItemFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ItemFormDialogComponent>);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<ItemData | null>(MAT_DIALOG_DATA, { optional: true });

  readonly form: FormGroup = this.fb.group({
    name: [this.data?.name || '', [Validators.required, Validators.minLength(2)]],
    description: [this.data?.description || ''],
  });

  get isEditMode(): boolean {
    return !!this.data;
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
```

**HTML Pattern:**
```html
<h2 mat-dialog-title>{{ isEditMode ? 'Edit Item' : 'Create Item' }}</h2>

<mat-dialog-content>
  <p class="required-hint">* Required fields</p>
  <form [formGroup]="form" class="item-form">
    <mat-form-field appearance="outline">
      <mat-label>Name *</mat-label>
      <input matInput formControlName="name" placeholder="Enter name" required />
      @if (form.get('name')?.invalid && form.get('name')?.touched) {
        <mat-error>Name is required (min 2 characters)</mat-error>
      }
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Description</mat-label>
      <textarea matInput formControlName="description" rows="3"
        placeholder="Enter description"></textarea>
    </mat-form-field>
  </form>
</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="onCancel()">Cancel</button>
  <button mat-raised-button 
    [class.update-btn]="isEditMode" 
    [class.create-btn]="!isEditMode" 
    (click)="onSave()"
    [disabled]="form.invalid">
    {{ isEditMode ? 'Update' : 'Create' }}
  </button>
</mat-dialog-actions>
```

**SCSS Pattern:**
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
  color: rgba(0, 0, 0, 0.6);
}

.item-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

mat-form-field {
  width: 100%;
}

// Button styles - see Buttons section for complete styles
```

### Card Components

#### Card Layout Pattern

**Wrapper Structure:**
```scss
.card-content-wrapper {
  background-color: #FFF;
  border-radius: 12px;
  border: 1px solid rgba(17, 24, 19, 0.1);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }
}
```

**Info Section:**
```scss
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--fitness-dark);
  }

  .description {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
    line-height: 1.5;
  }
}
```

**Actions Section:**
```scss
.actions-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}
```

**Stat Chips:**
```scss
.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f1f5f9;
  border-radius: 16px;
  font-size: 0.875rem;

  .label {
    color: #64748b;
    font-weight: 500;
  }

  .value {
    color: var(--fitness-dark);
    font-weight: 600;
  }
}
```

### Overview/List Pages

#### Page Structure

**Container:**
```scss
.page-container {
  padding: 2rem;
  position: relative;
  min-height: 100%;
}
```

**Header:**
```scss
.page-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--fitness-dark);
    margin: 0;
  }
}
```

**Grid Layout (for cards):**
```scss
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
```

**List Layout (for rows):**
```scss
.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

**Empty State:**
```scss
.empty-state {
  grid-column: 1 / -1;  // For grid layouts
  text-align: center;
  padding: 4rem;
  color: #64748b;
  background-color: #FFF;
  border-radius: 12px;
  border: 1px dashed rgba(17, 24, 19, 0.2);
}
```

### Critical Checklist for New Libraries

When creating a new feature library, ensure:

- [ ] Library structure follows `provider-services/`, `logic-services/`, `ui/`, `views/` pattern
- [ ] All components use `ChangeDetectionStrategy.OnPush`
- [ ] Components do NOT use `standalone: true`
- [ ] Dialog opens include `panelClass: 'custom-dialog-container'`
- [ ] Form dialogs support both create and edit modes via `MAT_DIALOG_DATA`
- [ ] Form dialogs include "* Required fields" hint
- [ ] Form validation uses `invalid && touched` pattern
- [ ] Cards use white background, 12px border radius, 1.5rem padding
- [ ] Cards have hover lift effect (`translateY(-2px)`)
- [ ] FAB positioned at `bottom: 2rem; left: 2rem` with green background
- [ ] Delete buttons use coral red (`#FF6B6B`) with delete icon
- [ ] Update buttons use light blue (`#74C4FC`)
- [ ] Create buttons use green (`#0DF259`)
- [ ] Cancel buttons are text-only (transparent background)
- [ ] All services use `inject()` instead of constructor injection
- [ ] Logic services include error handling and event subjects
- [ ] Detail pages use in-place editing pattern (not dialogs)
- [ ] Overview pages use either grid or list layout
- [ ] Responsive styles for mobile (`@media (max-width: 768px)`)

---

**Last Updated**: November 20, 2025
**Version**: 2.0
