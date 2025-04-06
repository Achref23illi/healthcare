# Color Scheme and Typography Update

Based on our comprehensive CSS implementation, let's create specific files to update the color scheme and typography for the healthcare website. These files will contain the essential styles that can be directly applied to the existing codebase.

## 1. Color Scheme Update (`colors.css`)

```css
:root {
  /* Primary Colors - Indigo */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-200: #c7d2fe;
  --primary-300: #a5b4fc;
  --primary-400: #818cf8;
  --primary-500: #6366f1; /* Main primary color */
  --primary-600: #4f46e5;
  --primary-700: #4338ca;
  --primary-800: #3730a3;
  --primary-900: #312e81;
  --primary-950: #1e1b4b;
  
  /* Secondary Colors - Teal */
  --secondary-50: #f0fdfa;
  --secondary-100: #ccfbf1;
  --secondary-200: #99f6e4;
  --secondary-300: #5eead4;
  --secondary-400: #2dd4bf;
  --secondary-500: #14b8a6; /* Main secondary color */
  --secondary-600: #0d9488;
  --secondary-700: #0f766e;
  --secondary-800: #115e59;
  --secondary-900: #134e4a;
  --secondary-950: #042f2e;
  
  /* Accent Colors - Amber */
  --accent-50: #fffbeb;
  --accent-100: #fef3c7;
  --accent-200: #fde68a;
  --accent-300: #fcd34d;
  --accent-400: #fbbf24;
  --accent-500: #f59e0b; /* Main accent color */
  --accent-600: #d97706;
  --accent-700: #b45309;
  --accent-800: #92400e;
  --accent-900: #78350f;
  --accent-950: #451a03;
  
  /* Neutral Colors */
  --neutral-50: #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
  --neutral-950: #020617;
  
  /* Semantic Colors */
  --success-100: #dcfce7;
  --success-500: #22c55e;
  --success-700: #15803d;
  
  --warning-100: #fef9c3;
  --warning-500: #eab308;
  --warning-700: #a16207;
  
  --error-100: #fee2e2;
  --error-500: #ef4444;
  --error-700: #b91c1c;
  
  /* Background Colors */
  --bg-light: var(--neutral-50);
  --bg-card: #ffffff;
  --bg-dark: var(--neutral-900);
  
  /* Text Colors */
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-tertiary: var(--neutral-400);
  --text-on-primary: #ffffff;
  --text-on-secondary: #ffffff;
  
  /* Border Colors */
  --border-light: var(--neutral-200);
  --border-medium: var(--neutral-300);
  --border-dark: var(--neutral-400);
  
  /* Shadow Colors */
  --shadow-color: rgb(0 0 0 / 0.1);
  --shadow-color-strong: rgb(0 0 0 / 0.2);
}

/* Status Colors */
.status-normal {
  background-color: var(--success-100);
  color: var(--success-700);
}

.status-warning {
  background-color: var(--warning-100);
  color: var(--warning-700);
}

.status-critical {
  background-color: var(--error-100);
  color: var(--error-700);
}

/* Gradient Backgrounds */
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-700) 100%);
}

.bg-gradient-accent {
  background: linear-gradient(135deg, var(--accent-400) 0%, var(--accent-600) 100%);
}

/* Text Colors */
.text-primary-color {
  color: var(--primary-600);
}

.text-secondary-color {
  color: var(--secondary-600);
}

.text-accent-color {
  color: var(--accent-500);
}

.text-success {
  color: var(--success-500);
}

.text-warning {
  color: var(--warning-500);
}

.text-error {
  color: var(--error-500);
}

/* Background Colors */
.bg-primary-light {
  background-color: var(--primary-50);
}

.bg-primary {
  background-color: var(--primary-600);
  color: var(--text-on-primary);
}

.bg-secondary-light {
  background-color: var(--secondary-50);
}

.bg-secondary {
  background-color: var(--secondary-600);
  color: var(--text-on-secondary);
}

.bg-accent-light {
  background-color: var(--accent-50);
}

.bg-accent {
  background-color: var(--accent-500);
  color: white;
}

.bg-light {
  background-color: var(--bg-light);
}

.bg-card {
  background-color: var(--bg-card);
}

.bg-dark {
  background-color: var(--bg-dark);
  color: white;
}

/* Border Colors */
.border-primary {
  border-color: var(--primary-500);
}

.border-secondary {
  border-color: var(--secondary-500);
}

.border-accent {
  border-color: var(--accent-500);
}

.border-light {
  border-color: var(--border-light);
}

.border-medium {
  border-color: var(--border-medium);
}

.border-dark {
  border-color: var(--border-dark);
}
```

## 2. Typography Update (`typography.css`)

```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-serif: 'Merriweather', Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-mono: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Font Weights */
  --font-thin: 100;
  --font-extralight: 200;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
  
  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}

/* Base Typography */
body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* Headings */
h1, .h1 {
  font-family: var(--font-sans);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

h2, .h2 {
  font-family: var(--font-sans);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
  margin-bottom: 1.25rem;
}

h3, .h3 {
  font-family: var(--font-sans);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--text-primary);
  margin-bottom: 1rem;
}

h4, .h4 {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

h5, .h5 {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

h6, .h6 {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

/* Text Styles */
.text-xs {
  font-size: var(--text-xs);
}

.text-sm {
  font-size: var(--text-sm);
}

.text-base {
  font-size: var(--text-base);
}

.text-lg {
  font-size: var(--text-lg);
}

.text-xl {
  font-size: var(--text-xl);
}

.text-2xl {
  font-size: var(--text-2xl);
}

.text-3xl {
  font-size: var(--text-3xl);
}

.text-4xl {
  font-size: var(--text-4xl);
}

.text-5xl {
  font-size: var(--text-5xl);
}

/* Font Weights */
.font-thin {
  font-weight: var(--font-thin);
}

.font-extralight {
  font-weight: var(--font-extralight);
}

.font-light {
  font-weight: var(--font-light);
}

.font-normal {
  font-weight: var(--font-normal);
}

.font-medium {
  font-weight: var(--font-medium);
}

.font-semibold {
  font-weight: var(--font-semibold);
}

.font-bold {
  font-weight: var(--font-bold);
}

.font-extrabold {
  font-weight: var(--font-extrabold);
}

.font-black {
  font-weight: var(--font-black);
}

/* Line Heights */
.leading-none {
  line-height: var(--leading-none);
}

.leading-tight {
  line-height: var(--leading-tight);
}

.leading-snug {
  line-height: var(--leading-snug);
}

.leading-normal {
  line-height: var(--leading-normal);
}

.leading-relaxed {
  line-height: var(--leading-relaxed);
}

.leading-loose {
  line-height: var(--leading-loose);
}

/* Text Colors */
.text-primary {
  color: var(--text-primary);
}

.text-secondary {
  color: var(--text-secondary);
}

.text-tertiary {
  color: var(--text-tertiary);
}

.text-white {
  color: white;
}

/* Text Alignment */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-justify {
  text-align: justify;
}

/* Text Transforms */
.uppercase {
  text-transform: uppercase;
}

.lowercase {
  text-transform: lowercase;
}

.capitalize {
  text-transform: capitalize;
}

.normal-case {
  text-transform: none;
}

/* Text Decoration */
.underline {
  text-decoration: underline;
}

.line-through {
  text-decoration: line-through;
}

.no-underline {
  text-decoration: none;
}

/* Letter Spacing */
.tracking-tighter {
  letter-spacing: var(--tracking-tighter);
}

.tracking-tight {
  letter-spacing: var(--tracking-tight);
}

.tracking-normal {
  letter-spacing: var(--tracking-normal);
}

.tracking-wide {
  letter-spacing: var(--tracking-wide);
}

.tracking-wider {
  letter-spacing: var(--tracking-wider);
}

.tracking-widest {
  letter-spacing: var(--tracking-widest);
}

/* Special Text Styles */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-wrap {
  white-space: normal;
}

.text-nowrap {
  white-space: nowrap;
}

/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&display=swap');
```

## 3. Implementation Instructions

To update the color scheme and typography of the healthcare website, follow these steps:

1. **Add Font Dependencies**:
   - Add the Inter and Merriweather fonts to the project by including the Google Fonts link in the head of your HTML or importing them in your CSS.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&display=swap">
```

2. **Include CSS Files**:
   - Add the `colors.css` and `typography.css` files to your project.
   - Import these files in your main CSS file or include them in your HTML.

```html
<link rel="stylesheet" href="path/to/colors.css">
<link rel="stylesheet" href="path/to/typography.css">
```

3. **Apply to Existing Elements**:
   - Update the existing elements by adding the appropriate classes.
   - For example, to update a button:

```html
<!-- Before -->
<button class="old-button-class">Click Me</button>

<!-- After -->
<button class="btn btn-primary">Click Me</button>
```

4. **Update Component Styles**:
   - For components that need specific styling, use the utility classes provided.
   - For example, to style a card:

```html
<!-- Before -->
<div class="old-card-class">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>

<!-- After -->
<div class="card bg-card">
  <h3 class="card-title">Card Title</h3>
  <p class="text-secondary">Card content goes here.</p>
</div>
```

5. **Gradients and Special Effects**:
   - Use the gradient classes for sections that need visual emphasis.
   - For example, for a call-to-action section:

```html
<!-- Before -->
<section class="old-cta-class">
  <h2>Ready to Get Started?</h2>
  <p>Join thousands of doctors and patients today.</p>
  <button>Sign Up</button>
</section>

<!-- After -->
<section class="bg-gradient-primary text-white p-8 rounded-lg">
  <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
  <p class="text-lg mb-6">Join thousands of doctors and patients today.</p>
  <button class="btn btn-hero">Sign Up</button>
</section>
```

6. **Status Indicators**:
   - Use the status classes for patient status indicators:

```html
<!-- Before -->
<span class="old-status-normal">Normal</span>
<span class="old-status-warning">Warning</span>
<span class="old-status-critical">Critical</span>

<!-- After -->
<span class="status status-normal">Normal</span>
<span class="status status-warning">Warning</span>
<span class="status status-critical">Critical</span>
```

7. **Typography Hierarchy**:
   - Apply the typography classes to establish a clear hierarchy:

```html
<!-- Before -->
<h1 class="old-title-class">Main Title</h1>
<h2 class="old-subtitle-class">Subtitle</h2>
<p class="old-text-class">Regular paragraph text.</p>
<p class="old-small-text-class">Smaller text for notes.</p>

<!-- After -->
<h1 class="text-4xl font-bold text-primary mb-6">Main Title</h1>
<h2 class="text-2xl font-semibold text-secondary mb-4">Subtitle</h2>
<p class="text-base text-secondary mb-4">Regular paragraph text.</p>
<p class="text-sm text-tertiary">Smaller text for notes.</p>
```

By following these instructions, you'll be able to update the color scheme and typography of the healthcare website to create a more modern, professional, and visually appealing user interface.
