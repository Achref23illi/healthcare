# Responsive Design Improvements

Building on our previous UI enhancements, let's focus specifically on improving the responsive design aspects of the healthcare website to ensure it works seamlessly across all device sizes.

## 1. Responsive Design Framework

```css
/* responsive.css */

/* Base Responsive Grid System */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive Grid */
.grid {
  display: grid;
  gap: 1.5rem;
}

/* Grid Columns */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* Responsive Breakpoints */
@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
  .sm\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sm\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .container { padding: 0 2rem; }
  .md\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .xl\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .xl\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .xl\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Flex Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

/* Responsive Flex Direction */
@media (min-width: 640px) {
  .sm\:flex-row { flex-direction: row; }
  .sm\:flex-col { flex-direction: column; }
}

@media (min-width: 768px) {
  .md\:flex-row { flex-direction: row; }
  .md\:flex-col { flex-direction: column; }
}

@media (min-width: 1024px) {
  .lg\:flex-row { flex-direction: row; }
  .lg\:flex-col { flex-direction: column; }
}

/* Responsive Display */
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }

@media (min-width: 640px) {
  .sm\:hidden { display: none; }
  .sm\:block { display: block; }
  .sm\:inline-block { display: inline-block; }
  .sm\:flex { display: flex; }
}

@media (min-width: 768px) {
  .md\:hidden { display: none; }
  .md\:block { display: block; }
  .md\:inline-block { display: inline-block; }
  .md\:flex { display: flex; }
}

@media (min-width: 1024px) {
  .lg\:hidden { display: none; }
  .lg\:block { display: block; }
  .lg\:inline-block { display: inline-block; }
  .lg\:flex { display: flex; }
}

/* Responsive Text Alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

@media (min-width: 640px) {
  .sm\:text-left { text-align: left; }
  .sm\:text-center { text-align: center; }
  .sm\:text-right { text-align: right; }
}

@media (min-width: 768px) {
  .md\:text-left { text-align: left; }
  .md\:text-center { text-align: center; }
  .md\:text-right { text-align: right; }
}

@media (min-width: 1024px) {
  .lg\:text-left { text-align: left; }
  .lg\:text-center { text-align: center; }
  .lg\:text-right { text-align: right; }
}

/* Responsive Spacing */
.p-0 { padding: 0; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

.px-0 { padding-left: 0; padding-right: 0; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }

.py-0 { padding-top: 0; padding-bottom: 0; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }

.m-0 { margin: 0; }
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }
.m-6 { margin: 1.5rem; }
.m-8 { margin: 2rem; }

.mx-0 { margin-left: 0; margin-right: 0; }
.mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
.mx-4 { margin-left: 1rem; margin-right: 1rem; }
.mx-6 { margin-left: 1.5rem; margin-right: 1.5rem; }
.mx-8 { margin-left: 2rem; margin-right: 2rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

.my-0 { margin-top: 0; margin-bottom: 0; }
.my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
.my-4 { margin-top: 1rem; margin-bottom: 1rem; }
.my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
.my-8 { margin-top: 2rem; margin-bottom: 2rem; }

@media (min-width: 640px) {
  .sm\:p-4 { padding: 1rem; }
  .sm\:p-6 { padding: 1.5rem; }
  .sm\:p-8 { padding: 2rem; }
  .sm\:px-4 { padding-left: 1rem; padding-right: 1rem; }
  .sm\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .sm\:py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .sm\:py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
}

@media (min-width: 768px) {
  .md\:p-4 { padding: 1rem; }
  .md\:p-6 { padding: 1.5rem; }
  .md\:p-8 { padding: 2rem; }
  .md\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .md\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  .md\:py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .md\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
}

@media (min-width: 1024px) {
  .lg\:p-6 { padding: 1.5rem; }
  .lg\:p-8 { padding: 2rem; }
  .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  .lg\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
}

/* Responsive Width */
.w-full { width: 100%; }
.w-auto { width: auto; }
.w-1/2 { width: 50%; }
.w-1/3 { width: 33.333333%; }
.w-2/3 { width: 66.666667%; }
.w-1/4 { width: 25%; }
.w-3/4 { width: 75%; }

@media (min-width: 640px) {
  .sm\:w-full { width: 100%; }
  .sm\:w-auto { width: auto; }
  .sm\:w-1/2 { width: 50%; }
  .sm\:w-1/3 { width: 33.333333%; }
  .sm\:w-2/3 { width: 66.666667%; }
}

@media (min-width: 768px) {
  .md\:w-full { width: 100%; }
  .md\:w-auto { width: auto; }
  .md\:w-1/2 { width: 50%; }
  .md\:w-1/3 { width: 33.333333%; }
  .md\:w-2/3 { width: 66.666667%; }
}

@media (min-width: 1024px) {
  .lg\:w-full { width: 100%; }
  .lg\:w-auto { width: auto; }
  .lg\:w-1/2 { width: 50%; }
  .lg\:w-1/3 { width: 33.333333%; }
  .lg\:w-2/3 { width: 66.666667%; }
}
```

## 2. Mobile Navigation Improvements

```css
/* mobile-nav.css */

/* Mobile Navigation */
.mobile-nav {
  display: none;
}

.mobile-nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-nav-toggle {
    display: block;
  }
  
  .mobile-nav {
    display: block;
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100vh;
    background-color: var(--bg-card);
    z-index: 50;
    transition: left 0.3s ease;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
  }
  
  .mobile-nav.open {
    left: 0;
  }
  
  .mobile-nav-overlay.open {
    display: block;
  }
  
  .mobile-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--border-light);
  }
  
  .mobile-nav-close {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .mobile-nav-items {
    padding: 1rem 0;
  }
  
  .mobile-nav-item {
    display: block;
    padding: 0.75rem 1.5rem;
    color: var(--text-secondary);
    font-weight: var(--font-medium);
    border-left: 3px solid transparent;
    transition: all 0.2s ease;
  }
  
  .mobile-nav-item:hover {
    background-color: var(--primary-50);
    color: var(--primary-700);
    border-left-color: var(--primary-500);
  }
  
  .mobile-nav-item.active {
    background-color: var(--primary-50);
    color: var(--primary-700);
    border-left-color: var(--primary-500);
  }
  
  .mobile-nav-divider {
    height: 1px;
    background-color: var(--border-light);
    margin: 0.5rem 0;
  }
  
  .mobile-nav-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-light);
    margin-top: auto;
  }
}
```

## 3. Responsive Dashboard Layout

```css
/* responsive-dashboard.css */

.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.dashboard-sidebar {
  width: 250px;
  flex-shrink: 0;
  background-color: var(--bg-card);
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  z-index: 10;
  transition: all 0.3s ease;
}

.dashboard-main {
  flex: 1;
  background-color: var(--bg-light);
  min-width: 0; /* Prevent flex item from overflowing */
}

.dashboard-content {
  padding: 1.5rem;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-grid-item {
  background-color: var(--bg-card);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
}

.dashboard-grid-item.span-2 {
  grid-column: span 2;
}

.dashboard-grid-item.span-3 {
  grid-column: span 3;
}

.dashboard-grid-item.span-4 {
  grid-column: span 4;
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .dashboard-grid-item.span-4 {
    grid-column: span 3;
  }
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid-item.span-3,
  .dashboard-grid-item.span-4 {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .dashboard-sidebar-fixed {
    display: none;
  }
  
  .dashboard-sidebar-collapsible {
    display: block;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .dashboard-grid {
    gap: 1rem;
  }
}

@media (max-width: 576px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-grid-item.span-2,
  .dashboard-grid-item.span-3,
  .dashboard-grid-item.span-4 {
    grid-column: span 1;
  }
  
  .dashboard-content {
    padding: 0.75rem;
  }
}

/* Collapsible Sidebar for Tablet */
.dashboard-sidebar-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

@media (max-width: 992px) and (min-width: 769px) {
  .dashboard-sidebar {
    width: 80px;
  }
  
  .dashboard-sidebar.expanded {
    width: 250px;
  }
  
  .dashboard-sidebar-toggle {
    display: block;
  }
  
  .sidebar-item-text {
    display: none;
  }
  
  .dashboard-sidebar.expanded .sidebar-item-text {
    display: block;
  }
  
  .sidebar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
  }
  
  .dashboard-sidebar.expanded .sidebar-item {
    justify-content: flex-start;
    padding: 0.75rem 1.5rem;
  }
  
  .sidebar-item-icon {
    font-size: 1.5rem;
  }
}
```

## 4. Responsive Tables

```css
/* responsive-tables.css */

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: left;
}

.table th {
  background-color: var(--neutral-100);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.table td {
  border-bottom: 1px solid var(--border-light);
}

/* Card Table for Mobile */
@media (max-width: 768px) {
  .table-card-view thead {
    display: none;
  }
  
  .table-card-view tbody tr {
    display: block;
    margin-bottom: 1rem;
    border-radius: var(--card-radius);
    box-shadow: var(--shadow-sm);
    background-color: var(--bg-card);
  }
  
  .table-card-view tbody td {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    text-align: right;
    border-bottom: 1px solid var(--border-light);
  }
  
  .table-card-view tbody td:last-child {
    border-bottom: none;
  }
  
  .table-card-view tbody td::before {
    content: attr(data-label);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    text-align: left;
  }
}

/* Stacked Table for Mobile */
@media (max-width: 768px) {
  .table-stacked thead {
    display: none;
  }
  
  .table-stacked tbody tr {
    display: block;
    margin-bottom: 1rem;
  }
  
  .table-stacked tbody td {
    display: block;
    text-align: right;
    padding: 0.5rem 1rem;
  }
  
  .table-stacked tbody td::before {
    content: attr(data-label);
    float: left;
    font-weight: var(--font-medium);
    color: var(--text-primary);
  }
}
```

## 5. Responsive Forms

```css
/* responsive-forms.css */

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.form-input {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-light);
  border: 1px solid var(--border-medium);
  border-radius: var(--input-radius);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-400);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.form-helper {
  display: block;
  margin-top: 0.25rem;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.form-error {
  display: block;
  margin-top: 0.25rem;
  font-size: var(--text-sm);
  color: var(--error-500);
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.form-col-12 { grid-column: span 12; }
.form-col-6 { grid-column: span 6; }
.form-col-4 { grid-column: span 4; }
.form-col-3 { grid-column: span 3; }

@media (max-width: 992px) {
  .form-col-4 { grid-column: span 6; }
  .form-col-3 { grid-column: span 6; }
}

@media (max-width: 768px) {
  .form-grid {
    gap: 1rem;
  }
  
  .form-col-6 { grid-column: span 12; }
  .form-col-4 { grid-column: span 12; }
  .form-col-3 { grid-column: span 12; }
}

/* Inline Form */
.form-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
}

.form-inline .form-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .form-inline {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-inline .form-group {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .form-inline .form-group:last-child {
    margin-bottom: 0;
  }
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 576px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}
```

## 6. Responsive Images and Media

```css
/* responsive-media.css */

.img-fluid {
  max-width: 100%;
  height: auto;
}

.img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.aspect-ratio {
  position: relative;
  width: 100%;
}

.aspect-ratio::before {
  content: "";
  display: block;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.aspect-ratio-1x1::before {
  padding-top: 100%; /* 1:1 Aspect Ratio */
}

.aspect-ratio-4x3::before {
  padding-top: 75%; /* 4:3 Aspect Ratio */
}

.aspect-ratio-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Responsive Video */
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe,
.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Image Grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 576px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
```

## 7. Implementation Instructions

To improve the responsive design of the healthcare website, follow these steps:

1. **Add Responsive CSS Files**:
   - Include the responsive CSS files in your project:
     - `responsive.css` - Base responsive framework
     - `mobile-nav.css` - Mobile navigation improvements
     - `responsive-dashboard.css` - Responsive dashboard layout
     - `responsive-tables.css` - Responsive tables
     - `responsive-forms.css` - Responsive forms
     - `responsive-media.css` - Responsive images and media

2. **Update HTML Structure**:
   - Wrap main content in container classes:

```html
<div class="container">
  <!-- Page content -->
</div>
```

3. **Implement Responsive Grid**:
   - Use the responsive grid classes for layouts:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

4. **Add Mobile Navigation**:
   - Implement the mobile navigation structure:

```html
<!-- Mobile Navigation Toggle -->
<button class="mobile-nav-toggle" aria-label="Toggle navigation">
  <i class="icon-menu"></i>
</button>

<!-- Mobile Navigation Overlay -->
<div class="mobile-nav-overlay"></div>

<!-- Mobile Navigation -->
<nav class="mobile-nav">
  <div class="mobile-nav-header">
    <div class="logo">Medico</div>
    <button class="mobile-nav-close" aria-label="Close navigation">
      <i class="icon-close"></i>
    </button>
  </div>
  <div class="mobile-nav-items">
    <a href="#" class="mobile-nav-item active">Dashboard</a>
    <a href="#" class="mobile-nav-item">Patients</a>
    <a href="#" class="mobile-nav-item">Appointments</a>
    <div class="mobile-nav-divider"></div>
    <a href="#" class="mobile-nav-item">Settings</a>
    <a href="#" class="mobile-nav-item">Logout</a>
  </div>
</nav>
```

5. **Make Tables Responsive**:
   - Wrap tables in responsive containers and add data attributes for mobile view:

```html
<div class="table-responsive">
  <table class="table table-card-view">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Name">John Smith</td>
        <td data-label="Status">Active</td>
        <td data-label="Date">2023-04-15</td>
        <td data-label="Actions">
          <button class="btn btn-sm btn-primary">View</button>
        </td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
</div>
```

6. **Update Forms for Responsiveness**:
   - Use the responsive form grid:

```html
<form>
  <div class="form-grid">
    <div class="form-col-6">
      <div class="form-group">
        <label class="form-label">First Name</label>
        <input type="text" class="form-input">
      </div>
    </div>
    <div class="form-col-6">
      <div class="form-group">
        <label class="form-label">Last Name</label>
        <input type="text" class="form-input">
      </div>
    </div>
    <div class="form-col-12">
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" class="form-input">
      </div>
    </div>
  </div>
  <div class="form-actions">
    <button type="button" class="btn btn-outline">Cancel</button>
    <button type="submit" class="btn btn-primary">Submit</button>
  </div>
</form>
```

7. **Optimize Images**:
   - Use responsive image classes:

```html
<img src="path/to/image.jpg" alt="Description" class="img-fluid">

<!-- For maintaining aspect ratio -->
<div class="aspect-ratio aspect-ratio-16x9">
  <img src="path/to/image.jpg" alt="Description" class="aspect-ratio-content img-cover">
</div>
```

8. **Add JavaScript for Mobile Navigation**:
   - Implement the toggle functionality:

```javascript
// Mobile Navigation Toggle
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mobileNavClose = document.querySelector('.mobile-nav-close');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

// Open mobile navigation
mobileNavToggle.addEventListener('click', () => {
  mobileNav.classList.add('open');
  mobileNavOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Close mobile navigation
function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileNavOverlay.classList.remove('open');
  document.body.style.overflow = ''; // Restore scrolling
}

mobileNavClose.addEventListener('click', closeMobileNav);
mobileNavOverlay.addEventListener('click', closeMobileNav);
```

9. **Test on Multiple Devices**:
   - Test the responsive design on various devices and screen sizes
   - Use browser developer tools to simulate different viewport sizes
   - Check for any layout issues, text overflow, or touch target problems

By implementing these responsive design improvements, the healthcare website will provide a better user experience across all devices, from desktop computers to mobile phones. The layout will adapt smoothly to different screen sizes, and users will be able to access all features regardless of the device they're using.
