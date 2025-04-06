# User Experience Enhancements

Building on our previous UI improvements, let's focus on enhancing the user experience elements of the healthcare website to create a more engaging, intuitive, and satisfying interaction for users.

## 1. Micro-interactions and Feedback

```css
/* micro-interactions.css */

/* Button Hover and Focus States */
.btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.btn:focus::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

/* Input Focus Animation */
.form-input {
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.form-input:focus {
  transform: translateY(-2px);
}

/* Checkbox Animation */
.checkbox input[type="checkbox"],
.radio input[type="radio"] {
  position: relative;
  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}

.checkbox input[type="checkbox"]:checked,
.radio input[type="radio"]:checked {
  animation: pulse-checkbox 0.3s ease;
}

@keyframes pulse-checkbox {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Card Hover Effects */
.interactive-card {
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.interactive-card:hover {
  transform: translateY(-5px) rotateX(2deg) rotateY(2deg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* Navigation Link Hover Effect */
.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-500);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Loading States */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn.loading {
  position: relative;
  color: transparent !important;
  pointer-events: none;
}

.btn.loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Skeleton Loading Animation */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-100) 25%,
    var(--neutral-200) 50%,
    var(--neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-text {
  height: 1em;
  margin-bottom: 0.5em;
}

.skeleton-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.skeleton-card {
  padding: 1.5rem;
  border-radius: var(--card-radius);
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: var(--radius);
  background-color: var(--bg-card);
  box-shadow: var(--shadow-lg);
  animation: toast-in 0.3s ease forwards;
  max-width: 350px;
}

.toast.closing {
  animation: toast-out 0.3s ease forwards;
}

.toast-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: var(--font-semibold);
  margin-bottom: 0.25rem;
}

.toast-message {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
}

.toast-success {
  border-left: 4px solid var(--success-500);
}

.toast-success .toast-icon {
  color: var(--success-500);
}

.toast-error {
  border-left: 4px solid var(--error-500);
}

.toast-error .toast-icon {
  color: var(--error-500);
}

.toast-warning {
  border-left: 4px solid var(--warning-500);
}

.toast-warning .toast-icon {
  color: var(--warning-500);
}

.toast-info {
  border-left: 4px solid var(--primary-500);
}

.toast-info .toast-icon {
  color: var(--primary-500);
}

@keyframes toast-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
```

## 2. Form Validation and Feedback

```css
/* form-validation.css */

/* Input States */
.form-input.is-valid {
  border-color: var(--success-500);
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2322c55e' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
}

.form-input.is-invalid {
  border-color: var(--error-500);
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3e%3cpath fill='%23ef4444' d='M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0zm0 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-3a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
}

.form-input:disabled,
.form-input[readonly] {
  background-color: var(--neutral-100);
  opacity: 0.7;
  cursor: not-allowed;
}

/* Validation Messages */
.validation-message {
  display: none;
  margin-top: 0.25rem;
  font-size: var(--text-sm);
}

.validation-valid {
  color: var(--success-500);
}

.validation-invalid {
  color: var(--error-500);
}

.form-input.is-valid ~ .validation-valid,
.form-input.is-invalid ~ .validation-invalid {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Password Strength Meter */
.password-strength {
  margin-top: 0.5rem;
}

.password-strength-meter {
  height: 5px;
  background-color: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.password-strength-meter-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease, background-color 0.3s ease;
}

.password-strength-meter-bar.weak {
  width: 25%;
  background-color: var(--error-500);
}

.password-strength-meter-bar.medium {
  width: 50%;
  background-color: var(--warning-500);
}

.password-strength-meter-bar.strong {
  width: 75%;
  background-color: var(--success-500);
}

.password-strength-meter-bar.very-strong {
  width: 100%;
  background-color: var(--success-700);
}

.password-strength-text {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

/* Form Steps */
.form-steps {
  display: flex;
  margin-bottom: 2rem;
}

.form-step {
  flex: 1;
  text-align: center;
  position: relative;
}

.form-step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 1rem;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: var(--neutral-200);
}

.form-step.active:not(:last-child)::after,
.form-step.completed:not(:last-child)::after {
  background-color: var(--primary-500);
}

.form-step-indicator {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--neutral-200);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.form-step.active .form-step-indicator {
  background-color: var(--primary-500);
  color: white;
  box-shadow: 0 0 0 3px var(--primary-100);
}

.form-step.completed .form-step-indicator {
  background-color: var(--success-500);
  color: white;
}

.form-step-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.form-step.active .form-step-label {
  color: var(--primary-500);
  font-weight: var(--font-medium);
}

.form-step.completed .form-step-label {
  color: var(--success-500);
}
```

## 3. Interactive Dashboard Elements

```css
/* interactive-dashboard.css */

/* Stat Cards with Hover Effects */
.stat-card {
  background-color: var(--bg-card);
  border-radius: var(--card-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-700));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-card-icon {
  transform: scale(1.1);
}

.stat-card-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-card-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.stat-card-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--text-sm);
  margin-top: 0.5rem;
}

.stat-card-trend.positive {
  color: var(--success-500);
}

.stat-card-trend.negative {
  color: var(--error-500);
}

/* Interactive Patient List */
.patient-list-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
  cursor: pointer;
}

.patient-list-item:hover {
  background-color: var(--primary-50);
}

.patient-list-item.selected {
  background-color: var(--primary-100);
  border-left: 3px solid var(--primary-500);
}

.patient-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.patient-list-item:hover .patient-avatar {
  border-color: var(--primary-300);
}

.patient-list-item.selected .patient-avatar {
  border-color: var(--primary-500);
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.patient-details {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.patient-status {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.patient-status::before {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.patient-status.normal {
  background-color: var(--success-100);
  color: var(--success-700);
}

.patient-status.normal::before {
  background-color: var(--success-500);
}

.patient-status.warning {
  background-color: var(--warning-100);
  color: var(--warning-700);
}

.patient-status.warning::before {
  background-color: var(--warning-500);
}

.patient-status.critical {
  background-color: var(--error-100);
  color: var(--error-700);
}

.patient-status.critical::before {
  background-color: var(--error-500);
}

.patient-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.patient-list-item:hover .patient-actions {
  opacity: 1;
}

/* Interactive Charts */
.chart-container {
  background-color: var(--bg-card);
  border-radius: var(--card-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.chart-container:hover {
  box-shadow: var(--shadow-lg);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.chart-action {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.chart-action:hover {
  background-color: var(--primary-50);
  color: var(--primary-600);
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.chart-legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* Tooltip Styles */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 200px;
  background-color: var(--neutral-800);
  color: white;
  text-align: center;
  border-radius: var(--radius);
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: var(--text-xs);
  box-shadow: var(--shadow-lg);
}

.tooltip .tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--neutral-800) transparent transparent transparent;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
```

## 4. Onboarding and Empty States

```css
/* onboarding.css */

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  color: white;
  border-radius: var(--card-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-card::after {
  content: "";
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 120px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.welcome-message {
  margin-bottom: 1.5rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.welcome-actions {
  display: flex;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

/* Onboarding Steps */
.onboarding-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.onboarding-step {
  background-color: var(--bg-card);
  border-radius: var(--card-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
}

.onboarding-step:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.onboarding-step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-100);
  color: var(--primary-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.onboarding-step-content {
  flex: 1;
}

.onboarding-step-title {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.onboarding-step-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.onboarding-step-action {
  font-size: var(--text-sm);
}

.onboarding-step.completed {
  border-left: 3px solid var(--success-500);
}

.onboarding-step.completed .onboarding-step-number {
  background-color: var(--success-500);
  color: white;
}

/* Empty States */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: var(--bg-card);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-md);
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  color: var(--neutral-300);
}

.empty-state-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state-message {
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0 auto 1.5rem;
}

.empty-state-action {
  margin-top: 1rem;
}

/* First-time User Tips */
.tip-card {
  background-color: var(--primary-50);
  border-left: 4px solid var(--primary-500);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.tip-card-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  font-size: var(--text-lg);
}

.tip-card-title {
  font-weight: var(--font-semibold);
  color: var(--primary-700);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tip-card-title::before {
  content: "💡";
  font-size: 1.25rem;
}

.tip-card-content {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.tip-card-action {
  margin-top: 0.75rem;
  font-size: var(--text-sm);
}
```

## 5. Accessibility Enhancements

```css
/* accessibility.css */

/* Focus Styles */
:focus {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
}

/* Skip to Content Link */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background-color: var(--primary-600);
  color: white;
  padding: 0.5rem 1rem;
  z-index: 100;
  transition: top 0.3s ease;
}

.skip-to-content:focus {
  top: 0;
}

/* Improved Form Labels */
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: var(--font-medium);
}

/* Required Field Indicator */
.required-field::after {
  content: "*";
  color: var(--error-500);
  margin-left: 0.25rem;
}

/* Improved Button Focus */
.btn:focus {
  box-shadow: 0 0 0 3px var(--primary-200);
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  :root {
    --primary-500: #0000ff;
    --primary-600: #0000cc;
    --primary-700: #000099;
    
    --error-500: #ff0000;
    --success-500: #008000;
    --warning-500: #ff8000;
    
    --text-primary: #000000;
    --text-secondary: #333333;
    --text-tertiary: #666666;
    
    --border-light: #000000;
    --border-medium: #000000;
  }
  
  .btn,
  .form-input,
  .card,
  .table th,
  .table td {
    border: 1px solid black;
  }
  
  .text-tertiary {
    color: #555555;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Aria-expanded Animation */
[aria-expanded="true"] .icon-expand {
  transform: rotate(180deg);
}

.icon-expand {
  transition: transform 0.2s ease;
}
```

## 6. JavaScript Enhancements

```javascript
// ux-enhancements.js

// Toast Notifications
class ToastNotification {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  }
  
  show(options) {
    const { type = 'info', title, message, duration = 5000 } = options;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconMap = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type]}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;
    
    this.container.appendChild(toast);
    
    // Handle close button
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      this.close(toast);
    });
    
    // Auto close after duration
    if (duration) {
      setTimeout(() => {
        this.close(toast);
      }, duration);
    }
    
    return toast;
  }
  
  close(toast) {
    toast.classList.add('closing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }
  
  success(options) {
    return this.show({ ...options, type: 'success' });
  }
  
  error(options) {
    return this.show({ ...options, type: 'error' });
  }
  
  warning(options) {
    return this.show({ ...options, type: 'warning' });
  }
  
  info(options) {
    return this.show({ ...options, type: 'info' });
  }
}

// Initialize toast
const toast = new ToastNotification();

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateInput(input);
      });
    });
    
    form.addEventListener('submit', event => {
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
        
        // Show error toast
        toast.error({
          title: 'Validation Error',
          message: 'Please check the form for errors and try again.'
        });
        
        // Focus first invalid input
        const firstInvalid = form.querySelector('.form-input.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      } else {
        // Show success toast for demo purposes
        toast.success({
          title: 'Form Submitted',
          message: 'Your form has been successfully submitted.'
        });
      }
    });
  });
  
  function validateInput(input) {
    const value = input.value.trim();
    const validationMessage = input.nextElementSibling;
    let isValid = true;
    
    // Required validation
    if (input.hasAttribute('required') && value === '') {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (validationMessage) {
        validationMessage.textContent = 'This field is required.';
      }
      isValid = false;
    } 
    // Email validation
    else if (input.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (validationMessage) {
          validationMessage.textContent = 'Please enter a valid email address.';
        }
        isValid = false;
      } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
      }
    }
    // Password validation
    else if (input.type === 'password' && input.dataset.minLength && value !== '') {
      const minLength = parseInt(input.dataset.minLength);
      if (value.length < minLength) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (validationMessage) {
          validationMessage.textContent = `Password must be at least ${minLength} characters.`;
        }
        isValid = false;
      } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
      }
    }
    // Valid input
    else if (value !== '') {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    }
    
    return isValid;
  }
}

// Password Strength Meter
function initPasswordStrengthMeter() {
  const passwordInputs = document.querySelectorAll('.password-with-strength');
  
  passwordInputs.forEach(input => {
    const meterContainer = document.createElement('div');
    meterContainer.className = 'password-strength';
    
    const meter = document.createElement('div');
    meter.className = 'password-strength-meter';
    
    const bar = document.createElement('div');
    bar.className = 'password-strength-meter-bar';
    
    const text = document.createElement('div');
    text.className = 'password-strength-text';
    
    meter.appendChild(bar);
    meterContainer.appendChild(meter);
    meterContainer.appendChild(text);
    
    input.parentNode.insertBefore(meterContainer, input.nextSibling);
    
    input.addEventListener('input', () => {
      const value = input.value;
      const strength = calculatePasswordStrength(value);
      
      // Update the strength meter
      bar.className = 'password-strength-meter-bar';
      
      if (value === '') {
        bar.style.width = '0';
        text.textContent = '';
      } else if (strength < 30) {
        bar.classList.add('weak');
        text.textContent = 'Weak password';
      } else if (strength < 60) {
        bar.classList.add('medium');
        text.textContent = 'Medium password';
      } else if (strength < 80) {
        bar.classList.add('strong');
        text.textContent = 'Strong password';
      } else {
        bar.classList.add('very-strong');
        text.textContent = 'Very strong password';
      }
    });
  });
  
  function calculatePasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length contribution
    strength += Math.min(password.length * 4, 25);
    
    // Character variety contribution
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    
    const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecial].filter(Boolean).length;
    
    strength += varietyCount * 10;
    
    // Bonus for mixing character types
    if (hasLowercase && hasUppercase) strength += 10;
    if ((hasLowercase || hasUppercase) && hasNumbers) strength += 10;
    if ((hasLowercase || hasUppercase || hasNumbers) && hasSpecial) strength += 15;
    
    // Penalize repeated characters
    const repeatedChars = password.match(/(.)\1+/g) || [];
    strength -= repeatedChars.reduce((penalty, match) => penalty + match.length - 1, 0) * 2;
    
    return Math.max(0, Math.min(100, strength));
  }
}

// Multi-step Form
function initMultiStepForm() {
  const multiStepForms = document.querySelectorAll('.multi-step-form');
  
  multiStepForms.forEach(form => {
    const steps = form.querySelectorAll('.form-step-content');
    const stepIndicators = form.querySelectorAll('.form-step');
    const nextButtons = form.querySelectorAll('.btn-next-step');
    const prevButtons = form.querySelectorAll('.btn-prev-step');
    
    let currentStep = 0;
    
    // Initialize
    showStep(currentStep);
    
    // Next button click
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Validate current step
        const currentStepInputs = steps[currentStep].querySelectorAll('.form-input');
        let isValid = true;
        
        currentStepInputs.forEach(input => {
          if (input.hasAttribute('required') && input.value.trim() === '') {
            input.classList.add('is-invalid');
            isValid = false;
          } else {
            input.classList.remove('is-invalid');
          }
        });
        
        if (isValid) {
          currentStep++;
          showStep(currentStep);
        } else {
          toast.error({
            title: 'Validation Error',
            message: 'Please fill in all required fields.'
          });
        }
      });
    });
    
    // Previous button click
    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
      });
    });
    
    function showStep(stepIndex) {
      // Hide all steps
      steps.forEach(step => {
        step.style.display = 'none';
      });
      
      // Show current step
      steps[stepIndex].style.display = 'block';
      
      // Update step indicators
      stepIndicators.forEach((indicator, index) => {
        if (index < stepIndex) {
          indicator.classList.add('completed');
          indicator.classList.remove('active');
        } else if (index === stepIndex) {
          indicator.classList.add('active');
          indicator.classList.remove('completed');
        } else {
          indicator.classList.remove('active', 'completed');
        }
      });
      
      // Update buttons
      const isFirstStep = stepIndex === 0;
      const isLastStep = stepIndex === steps.length - 1;
      
      prevButtons.forEach(button => {
        button.style.display = isFirstStep ? 'none' : 'inline-flex';
      });
      
      nextButtons.forEach(button => {
        if (isLastStep) {
          button.textContent = 'Submit';
          button.classList.add('btn-primary');
        } else {
          button.textContent = 'Next';
          button.classList.remove('btn-primary');
        }
      });
    }
  });
}

// Tooltips
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(element => {
    const tooltipText = element.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip-text';
    tooltip.textContent = tooltipText;
    
    element.classList.add('tooltip');
    element.appendChild(tooltip);
  });
}

// Initialize all UX enhancements
document.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initPasswordStrengthMeter();
  initMultiStepForm();
  initTooltips();
  
  // Example toast notification
  setTimeout(() => {
    toast.info({
      title: 'Welcome to Medico',
      message: 'Your healthcare dashboard is ready to use.'
    });
  }, 1000);
});
```

## 7. Implementation Instructions

To enhance the user experience of the healthcare website, follow these steps:

1. **Add UX Enhancement Files**:
   - Include the CSS and JavaScript files in your project:
     - `micro-interactions.css` - Micro-interactions and feedback
     - `form-validation.css` - Form validation and feedback
     - `interactive-dashboard.css` - Interactive dashboard elements
     - `onboarding.css` - Onboarding and empty states
     - `accessibility.css` - Accessibility enhancements
     - `ux-enhancements.js` - JavaScript enhancements

2. **Implement Micro-interactions**:
   - Add ripple effects to buttons:

```html
<button class="btn btn-primary">Click Me</button>
```

3. **Add Form Validation**:
   - Enhance forms with validation:

```html
<form class="needs-validation">
  <div class="form-group">
    <label class="form-label required-field">Email</label>
    <input type="email" class="form-input" required>
    <div class="validation-invalid"></div>
  </div>
  
  <div class="form-group">
    <label class="form-label required-field">Password</label>
    <input type="password" class="form-input password-with-strength" required data-min-length="8">
    <div class="validation-invalid"></div>
  </div>
  
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

4. **Implement Interactive Dashboard Elements**:
   - Enhance dashboard statistics:

```html
<div class="stat-card">
  <div class="stat-card-icon" style="background-color: var(--primary-50); color: var(--primary-600);">
    <i class="icon-users"></i>
  </div>
  <div class="stat-card-value">2,458</div>
  <div class="stat-card-label">Total Patients</div>
  <div class="stat-card-trend positive">
    <i class="icon-trend-up"></i> 12% from last month
  </div>
</div>
```

5. **Add Interactive Patient List**:
   - Enhance patient listings:

```html
<div class="patient-list">
  <div class="patient-list-item">
    <img src="path/to/avatar.jpg" alt="John Smith" class="patient-avatar">
    <div class="patient-info">
      <div class="patient-name">John Smith</div>
      <div class="patient-details">42 years • Male • Diabetes</div>
    </div>
    <div class="patient-status normal">Normal</div>
    <div class="patient-actions">
      <button class="btn btn-sm btn-outline">View</button>
    </div>
  </div>
  <!-- More patient items -->
</div>
```

6. **Implement Toast Notifications**:
   - Add JavaScript to show notifications:

```javascript
// Show success notification
document.querySelector('.save-button').addEventListener('click', () => {
  toast.success({
    title: 'Changes Saved',
    message: 'Your changes have been successfully saved.'
  });
});

// Show error notification
document.querySelector('.error-button').addEventListener('click', () => {
  toast.error({
    title: 'Error',
    message: 'There was a problem processing your request.'
  });
});
```

7. **Add Onboarding Elements**:
   - Implement welcome cards for new users:

```html
<div class="welcome-card">
  <h2 class="welcome-title">Welcome to Medico, Dr. Smith!</h2>
  <p class="welcome-message">Get started with your healthcare dashboard by completing these quick steps.</p>
  <div class="welcome-actions">
    <button class="btn btn-hero">Take the Tour</button>
    <button class="btn btn-hero-secondary">Skip</button>
  </div>
</div>

<div class="onboarding-steps">
  <div class="onboarding-step">
    <div class="onboarding-step-number">1</div>
    <div class="onboarding-step-content">
      <h3 class="onboarding-step-title">Complete Your Profile</h3>
      <p class="onboarding-step-description">Add your professional details and contact information.</p>
      <button class="btn btn-sm btn-primary onboarding-step-action">Complete Profile</button>
    </div>
  </div>
  <!-- More onboarding steps -->
</div>
```

8. **Implement Empty States**:
   - Add empty states for sections without data:

```html
<div class="empty-state">
  <div class="empty-state-icon">📊</div>
  <h3 class="empty-state-title">No Data Available</h3>
  <p class="empty-state-message">There are no patients in your system yet. Add your first patient to get started.</p>
  <button class="btn btn-primary empty-state-action">Add Patient</button>
</div>
```

9. **Enhance Accessibility**:
   - Add skip to content link:

```html
<a href="#main-content" class="skip-to-content">Skip to content</a>
<main id="main-content">
  <!-- Main content -->
</main>
```

10. **Implement Multi-step Forms**:
    - Create step indicators for complex forms:

```html
<form class="multi-step-form">
  <div class="form-steps">
    <div class="form-step active">
      <div class="form-step-indicator">1</div>
      <div class="form-step-label">Personal Info</div>
    </div>
    <div class="form-step">
      <div class="form-step-indicator">2</div>
      <div class="form-step-label">Medical History</div>
    </div>
    <div class="form-step">
      <div class="form-step-indicator">3</div>
      <div class="form-step-label">Confirmation</div>
    </div>
  </div>
  
  <div class="form-step-content">
    <!-- Step 1 fields -->
    <button type="button" class="btn btn-next-step">Next</button>
  </div>
  
  <div class="form-step-content">
    <!-- Step 2 fields -->
    <button type="button" class="btn btn-prev-step">Previous</button>
    <button type="button" class="btn btn-next-step">Next</button>
  </div>
  
  <div class="form-step-content">
    <!-- Step 3 fields -->
    <button type="button" class="btn btn-prev-step">Previous</button>
    <button type="button" class="btn btn-next-step">Submit</button>
  </div>
</form>
```

11. **Add Tooltips**:
    - Implement tooltips for additional information:

```html
<button class="btn btn-primary" data-tooltip="This will save your changes to the database">Save Changes</button>
```

By implementing these user experience enhancements, the healthcare website will become more intuitive, engaging, and user-friendly. The micro-interactions provide visual feedback, the form validation helps users complete forms correctly, and the onboarding elements guide new users through the system. The accessibility enhancements ensure the website is usable by everyone, regardless of ability.
