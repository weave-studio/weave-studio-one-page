# System Patterns: Architecture & Design Decisions

## Core Architecture

### Build System: 11ty + Vite Integration
**Pattern:** Static Site Generator with Modern Build Tools
```
11ty (Eleventy) → Static Site Generation
Vite → Development Server + Asset Processing
Decap CMS → Git-based Content Management
```

**Key Benefits:**
- **Fast Development** - Hot reload with Vite's lightning-fast HMR
- **Optimized Production** - 11ty generates static HTML for maximum performance
- **Modern Asset Pipeline** - Vite handles CSS/JS bundling and optimization
- **Git-based CMS** - Content stored in repository, no database required

### Project Structure Pattern
```
src/
├── _data/              # Global data files (site.js, navigation.js)
├── _includes/          # Templates and reusable components
│   ├── layouts/        # Page layouts (base.njk, page.njk, post.njk)
│   ├── components/     # Reusable UI components
│   └── partials/       # Template fragments (head.njk, footer.njk)
├── assets/
│   ├── css/            # Stylesheets with component-based architecture
│   ├── js/             # JavaScript modules
│   └── images/         # Static images (auto-optimized by 11ty-img)
├── blog/               # Blog posts and templates
├── pages/              # Static pages (about, contact, services)
└── faq/                # FAQ content files
```

**Design Principle:** Separation of concerns with clear file organization

## Component Architecture

### Template Component Pattern
**Location:** `src/_includes/components/`
**Naming Convention:** `component-name.njk`

**Example Structure:**
```njk
{# Blog Preview Component #}
<section class="blog-preview" id="blog">
  <div class="container">
    <header class="section-header">
      <h2>{{ section.title }}</h2>
      <p>{{ section.description }}</p>
    </header>
    
    <div class="blog-grid">
      {% for post in collections.posts | limit(4) %}
        {% include "components/blog-card.njk" %}
      {% endfor %}
    </div>
    
    <div class="section-cta">
      <a href="/blog/" class="btn btn-outline">View All Posts</a>
    </div>
  </div>
</section>
```

**Key Patterns:**
- **Container Wrapper** - Consistent max-width and padding
- **Section Header** - Standardized title/description pattern
- **Grid Layouts** - CSS Grid for responsive component arrangement
- **CTA Integration** - Call-to-action buttons in consistent locations

### CSS Component Pattern
**Location:** `src/assets/css/components/`
**Naming Convention:** `component-name.css`

**Architecture:**
```css
/* Component: Blog Preview */
.blog-preview {
  /* Section-level styles */
  padding: var(--space-section);
  background: var(--color-surface);
}

.blog-preview .section-header {
  /* Header styles */
  text-align: center;
  margin-bottom: var(--space-lg);
}

.blog-grid {
  /* Grid layout */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}

.blog-card {
  /* Individual card styles */
  background: var(--color-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform 0.2s ease;
}
```

**Design Principles:**
- **CSS Custom Properties** - Consistent spacing, colors, and typography
- **Component Isolation** - Each component has its own CSS file
- **Responsive by Default** - Mobile-first grid layouts
- **Performance Optimized** - Minimal CSS with efficient selectors

## Bilingual Implementation Pattern

### Language Detection & Switching
**Location:** `src/_data/site.js`

**Configuration Pattern:**
```javascript
// Language configuration
languages: {
  default: "en",
  supported: ["en", "he"],
  auto_detect: true,
  fallback: "en"
},

// Localized content
localized: {
  en: {
    language: "en",
    locale: "en_US", 
    direction: "ltr",
    name: "Weave Studio",
    tagline: "Fast, Beautiful Websites for Small Businesses"
  },
  he: {
    language: "he",
    locale: "he_IL",
    direction: "rtl", 
    name: "Weave Studio",
    tagline: "אתרים מהירים ויפים לעסקים קטנים"
  }
}
```

### RTL (Right-to-Left) CSS Pattern
**Implementation:** CSS logical properties and direction-aware styling

```css
/* Base layout - works for both LTR and RTL */
.container {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-md);
}

/* Direction-specific adjustments */
[dir="rtl"] .text-rotator__item {
  text-align: right;
  left: auto;
  right: 0;
}

[dir="rtl"] .nav-menu {
  margin-inline-start: auto;
  margin-inline-end: 0;
}

/* Language-specific font loading */
.lang-he {
  font-family: 'Noto Sans Hebrew', 'Noto Serif Hebrew', sans-serif;
}

.lang-en {
  font-family: 'Inter', 'DM Serif Display', sans-serif;
}
```

**Key Patterns:**
- **Logical Properties** - `margin-inline`, `padding-inline` for direction independence
- **Direction Attributes** - `[dir="rtl"]` selectors for RTL-specific styles
- **Language Classes** - `.lang-he`, `.lang-en` for language-specific styling
- **Font Fallbacks** - Proper font stacks for each language

### Content Localization Pattern
**Template Implementation:**
```njk
{# Bilingual content rendering #}
<h1>
  {% if site.language == 'he' %}
    {{ site.tagline_he }}
  {% else %}
    {{ site.tagline }}
  {% endif %}
</h1>

{# Or using localized object #}
<h1>{{ site.localized[site.language].tagline }}</h1>

{# Navigation with language awareness #}
<nav class="nav-menu" dir="{{ site.localized[site.language].direction }}">
  {% for item in navigation.items %}
    <a href="{{ item.url }}" 
       class="nav-link"
       {% if item.url == page.url %}aria-current="page"{% endif %}>
      {{ item.text[site.language] or item.text.en }}
    </a>
  {% endfor %}
</nav>
```

## Data Management Patterns

### Global Data Pattern
**Location:** `src/_data/`
**Files:** `site.js`, `navigation.js`, `social.js`

**Site Configuration Pattern:**
```javascript
// src/_data/site.js
module.exports = {
  // Core site information
  name: "Weave Studio",
  url: process.env.SITE_URL || "https://weavewebdesign.com",
  
  // Business information
  author: "Assaf Yechiel",
  email: process.env.CONTACT_EMAIL || "info@weavewebdesign.com",
  
  // SEO and social
  description: "Professional web design...",
  keywords: "web design Tel Aviv, אתרי אינטרנט תל אביב...",
  
  // Environment-aware configuration
  environment: process.env.NODE_ENV || "development"
};
```

### Collection Patterns
**Blog Collection:**
```javascript
// .eleventy.js
eleventyConfig.addCollection("posts", function(collectionApi) {
  return collectionApi.getFilteredByGlob("src/blog/posts/*.md")
    .sort((a, b) => b.date - a.date);
});

eleventyConfig.addCollection("recentPosts", function(collectionApi) {
  return collectionApi.getFilteredByGlob("src/blog/posts/*.md")
    .sort((a, b) => b.date - a.date)
    .slice(0, 4);
});
```

**FAQ Collection:**
```javascript
eleventyConfig.addCollection("faq", function(collectionApi) {
  return collectionApi.getFilteredByGlob("src/faq/*.md")
    .sort((a, b) => a.data.order - b.data.order);
});
```

## Performance Optimization Patterns

### Image Optimization Pattern
**Implementation:** 11ty Image plugin with responsive images

```javascript
// .eleventy.js - Image shortcode
eleventyConfig.addShortcode("image", async function(src, alt, sizes = "100vw") {
  let metadata = await Image(src, {
    widths: [300, 600, 900, 1200],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/assets/images/",
    urlPath: "/assets/images/"
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
});
```

### CSS Optimization Pattern
**Critical CSS Inlining:**
```njk
{# In base layout #}
<style>
  {% include "css/critical.css" %}
</style>

{# Non-critical CSS #}
<link rel="preload" href="/assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/assets/css/main.css"></noscript>
```

### JavaScript Loading Pattern
**Module-based Architecture:**
```javascript
// src/assets/js/main.js
import { initNavigation } from './modules/navigation.js';
import { initTextRotator } from './modules/text-rotator.js';
import { initFAQ } from './modules/faq.js';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTextRotator();
  initFAQ();
});
```

## Accessibility Patterns

### Semantic HTML Pattern
```njk
{# Proper heading hierarchy #}
<main id="main-content">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">{{ site.tagline }}</h1>
  </section>
  
  <section aria-labelledby="services-heading">
    <h2 id="services-heading">Our Services</h2>
  </section>
</main>

{# Skip links #}
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### ARIA Implementation Pattern
```njk
{# FAQ Accordion with proper ARIA #}
<div class="faq-item">
  <button class="faq-question" 
          aria-expanded="false"
          aria-controls="faq-answer-{{ loop.index }}"
          id="faq-question-{{ loop.index }}">
    {{ faq.question }}
  </button>
  
  <div class="faq-answer" 
       id="faq-answer-{{ loop.index }}"
       aria-labelledby="faq-question-{{ loop.index }}"
       hidden>
    {{ faq.answer | markdown | safe }}
  </div>
</div>
```

### Focus Management Pattern
```css
/* Visible focus indicators */
.btn:focus-visible,
.nav-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip link styling */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

## Content Management Patterns

### Decap CMS Configuration Pattern
**Location:** `admin/config.yml`

```yaml
# CMS Configuration
backend:
  name: git-gateway
  branch: main

media_folder: "src/assets/images"
public_folder: "/assets/images"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/blog/posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Tags", name: "tags", widget: "list"}
      - {label: "Body", name: "body", widget: "markdown"}

  - name: "faq"
    label: "FAQ Items"
    folder: "src/faq"
    create: true
    fields:
      - {label: "Question", name: "question", widget: "string"}
      - {label: "Answer", name: "body", widget: "markdown"}
      - {label: "Order", name: "order", widget: "number"}
```

## Error Handling & Resilience Patterns

### Graceful Degradation Pattern
```njk
{# Fallback for missing data #}
{% set blogPosts = collections.recentPosts or [] %}
{% if blogPosts.length > 0 %}
  {# Render blog preview #}
{% else %}
  <p>Blog posts coming soon...</p>
{% endif %}

{# Image fallbacks #}
{% if post.featured_image %}
  {% image post.featured_image, post.title %}
{% else %}
  <div class="placeholder-image" aria-hidden="true"></div>
{% endif %}
```

### Progressive Enhancement Pattern
```javascript
// Feature detection before enhancement
if ('IntersectionObserver' in window) {
  // Implement scroll animations
  initScrollAnimations();
}

if (CSS.supports('display', 'grid')) {
  // Enhanced grid layouts
  document.body.classList.add('supports-grid');
}
```

These patterns ensure consistent, maintainable, and scalable code across the entire project while supporting the bilingual requirements and performance goals of the Weave Studio website.
