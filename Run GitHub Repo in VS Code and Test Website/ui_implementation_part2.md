# UI Implementation - Part 2: Page-Specific Enhancements

Now let's implement specific enhancements for the main pages of the healthcare website, focusing on the homepage and dashboard.

## 1. Homepage Enhancements

### Hero Section
```css
.hero-section {
  position: relative;
  padding: var(--space-16) 0;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  color: white;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill-opacity="0.1" fill="white" x="0" y="0" width="50" height="50" /><rect fill-opacity="0.1" fill="white" x="50" y="50" width="50" height="50" /></svg>');
  background-size: 30px 30px;
  opacity: 0.1;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-6);
  color: white;
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  font-size: var(--text-xl);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  color: rgba(255, 255, 255, 0.9);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease-out 0.6s both;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.hero-image img:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Hero CTA Button */
.btn-hero {
  background-color: white;
  color: var(--primary-700);
  font-weight: var(--font-bold);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-base);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.btn-hero:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
  background-color: white;
  color: var(--primary-800);
}

.btn-hero-secondary {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-hero-secondary:hover {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
}
```

### Feature Cards Section
```css
.features-section {
  padding: var(--space-20) 0;
  background-color: var(--bg-light);
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto var(--space-16);
}

.section-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background-color: var(--primary-500);
  border-radius: var(--radius-full);
}

.section-description {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.feature-card {
  background-color: var(--bg-card);
  border-radius: var(--card-radius);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-50);
  color: var(--primary-600);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
  font-size: 2rem;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background-color: var(--primary-600);
  color: white;
  transform: scale(1.1);
}

.feature-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.feature-description {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
}

.feature-link {
  color: var(--primary-600);
  font-weight: var(--font-medium);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  transition: all 0.2s ease;
}

.feature-link:hover {
  color: var(--primary-700);
  gap: var(--space-2);
}
```

### Services Section
```css
.services-section {
  padding: var(--space-20) 0;
  background-color: white;
}

.services-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-8);
}

.service-card {
  background-color: var(--bg-light);
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.service-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.5s ease;
}

.service-card:hover .service-image {
  transform: scale(1.05);
}

.service-content {
  padding: var(--space-6);
}

.service-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.service-description {
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.service-action {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  background-color: var(--primary-50);
  color: var(--primary-700);
  border-radius: var(--radius-full);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.service-action:hover {
  background-color: var(--primary-100);
  color: var(--primary-800);
}
```

### Testimonials Section
```css
.testimonials-section {
  padding: var(--space-20) 0;
  background-color: var(--primary-50);
  position: relative;
  overflow: hidden;
}

.testimonials-section::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background-color: var(--primary-100);
  border-radius: 50%;
  transform: translate(150px, -150px);
  z-index: 0;
}

.testimonials-section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200px;
  height: 200px;
  background-color: var(--primary-100);
  border-radius: 50%;
  transform: translate(-100px, 100px);
  z-index: 0;
}

.testimonials-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
}

.testimonial-card {
  background-color: white;
  border-radius: var(--card-radius);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
  position: relative;
}

.testimonial-quote {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  position: relative;
}

.testimonial-quote::before {
  content: """;
  position: absolute;
  top: -20px;
  left: -10px;
  font-size: 4rem;
  color: var(--primary-100);
  font-family: serif;
  z-index: -1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.testimonial-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-100);
}

.testimonial-info {
  display: flex;
  flex-direction: column;
}

.testimonial-name {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.testimonial-role {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}
```

### Call-to-Action Section
```css
.cta-section {
  padding: var(--space-16) 0;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  color: white;
  text-align: center;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.cta-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
  color: white;
}

.cta-description {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  color: rgba(255, 255, 255, 0.9);
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
}
```

## 2. Dashboard Enhancements

### Dashboard Layout
```css
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.dashboard-main {
  flex: 1;
  background-color: var(--bg-light);
  overflow-y: auto;
}

.dashboard-header {
  background-color: white;
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}

.dashboard-search {
  position: relative;
  width: 300px;
}

.dashboard-search input {
  width: 100%;
  padding: var(--space-2) var(--space-4);
  padding-left: calc(var(--space-4) + 20px);
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background-color: var(--bg-light);
  font-size: var(--text-sm);
}

.dashboard-search::before {
  content: "🔍";
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.dashboard-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.dashboard-user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dashboard-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-100);
}

.dashboard-user-info {
  display: none;
}

@media (min-width: 768px) {
  .dashboard-user-info {
    display: block;
  }
}

.dashboard-user-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.dashboard-user-role {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.dashboard-content {
  padding: var(--space-6);
}

.dashboard-welcome {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  border-radius: var(--card-radius);
  padding: var(--space-8);
  color: white;
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-welcome-text h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2);
}

.dashboard-welcome-text p {
  opacity: 0.9;
}

.dashboard-welcome-actions {
  display: flex;
  gap: var(--space-3);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.dashboard-section {
  margin-bottom: var(--space-8);
}

.dashboard-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.dashboard-section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.dashboard-section-action {
  font-size: var(--text-sm);
  color: var(--primary-600);
  font-weight: var(--font-medium);
}
```

### Enhanced Patient List
```css
.patient-list {
  background-color: white;
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.patient-list-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.patient-list-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.patient-list-filter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.patient-list-filter select {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  font-size: var(--text-sm);
}

.patient-item {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.2s ease;
}

.patient-item:last-child {
  border-bottom: none;
}

.patient-item:hover {
  background-color: var(--neutral-50);
}

.patient-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--space-4);
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.patient-details {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.patient-status {
  margin-left: auto;
}
```

### Enhanced Appointment List
```css
.appointment-list {
  background-color: white;
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.appointment-item {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.2s ease;
}

.appointment-item:last-child {
  border-bottom: none;
}

.appointment-item:hover {
  background-color: var(--neutral-50);
}

.appointment-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  text-align: center;
  margin-right: var(--space-4);
}

.appointment-day {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.appointment-hour {
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.appointment-patient {
  display: flex;
  align-items: center;
  flex: 1;
}

.appointment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: var(--space-3);
}

.appointment-patient-info {
  display: flex;
  flex-direction: column;
}

.appointment-patient-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.appointment-type {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.appointment-actions {
  display: flex;
  gap: var(--space-2);
}

.appointment-action {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.appointment-action.primary {
  background-color: var(--primary-50);
  color: var(--primary-700);
}

.appointment-action.secondary {
  background-color: var(--neutral-100);
  color: var(--text-secondary);
}
```

## 3. Responsive Design Improvements

```css
/* Base Responsive Styles */
@media (max-width: 1200px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-title {
    font-size: var(--text-4xl);
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -250px;
    top: 0;
    height: 100vh;
    z-index: 100;
    transition: left 0.3s ease;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .dashboard-header {
    padding: var(--space-3) var(--space-4);
  }
  
  .dashboard-search {
    width: 200px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;

(Content truncated due to size limit. Use line ranges to read in chunks)