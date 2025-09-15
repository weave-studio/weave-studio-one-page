# Tech Context: Technology Stack & Development Setup

## Core Technology Stack

### Static Site Generator: Eleventy (11ty) v2.0.1
**Purpose:** Static site generation with flexible templating
**Key Features:**
- **Zero-config** static site generation
- **Multiple template engines** (Nunjucks, Markdown, Liquid, etc.)
- **Data cascade** for flexible content management
- **Plugin ecosystem** for extended functionality
- **Fast builds** with incremental compilation

**Configuration:** `.eleventy.js`
```javascript
module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(require("@11ty/eleventy-img"));
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"));
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));
  
  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
```

### Build Tool: Vite v5.0.10
**Purpose:** Development server and asset bundling
**Key Features:**
- **Lightning-fast HMR** (Hot Module Replacement)
- **ES modules** native support
- **CSS preprocessing** with PostCSS
- **Asset optimization** for production
- **Development proxy** integration with 11ty

**Integration Pattern:**
```javascript
// Development: Vite serves assets, 11ty serves HTML
// Production: 11ty builds static site with optimized assets
```

### Content Management: Decap CMS (formerly Netlify CMS)
**Purpose:** Git-based content management system
**Key Features:**
- **Git workflow** - content stored as markdown files
- **Editorial workflow** with draft/review/publish states
- **Media management** with automatic optimization
- **Custom widgets** for complex content types
- **No database** required - everything in repository

**Configuration:** `admin/config.yml`
```yaml
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
```

## Development Dependencies

### Core Build Tools
```json
{
  "@11ty/eleventy": "^2.0.1",
  "@11ty/eleventy-img": "^4.0.2",
  "@11ty/eleventy-navigation": "^0.3.5",
  "@11ty/eleventy-plugin-rss": "^1.2.0",
  "@11ty/eleventy-plugin-syntaxhighlight": "^5.0.2",
  "@11ty/eleventy-plugin-vite": "^1.0.0",
  "vite": "^5.0.10"
}
```

### CSS Processing
```json
{
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "postcss-cli": "^11.0.0",
  "postcss-import": "^15.1.0",
  "postcss-nested": "^6.0.1",
  "cssnano": "^6.0.1",
  "sass": "^1.69.5"
}
```

### Code Quality & Testing
```json
{
  "@axe-core/playwright": "^4.8.3",
  "@playwright/test": "^1.40.0",
  "@lhci/cli": "^0.12.0",
  "eslint": "^9.19.0",
  "prettier": "^3.4.2",
  "husky": "^8.0.3",
  "lint-staged": "^15.4.3"
}
```

### Deployment & CI/CD
```json
{
  "gh-pages": "^6.1.0",
  "netlify-cli": "^17.10.1",
  "concurrently": "^8.2.2",
  "cross-env": "^7.0.3"
}
```

## Runtime Dependencies

### Content Processing
```json
{
  "luxon": "^3.7.1",           // Date manipulation
  "markdown-it": "^14.1.0",    // Markdown processing
  "markdown-it-anchor": "^8.6.7", // Heading anchors
  "slugify": "^1.6.6"          // URL slug generation
}
```

### Image Optimization
```json
{
  "sharp": "^0.33.0"           // Image processing and optimization
}
```

## Development Environment Setup

### Node.js Requirements
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Environment Variables
```bash
# .env (development)
SITE_URL=http://localhost:8080
CONTACT_EMAIL=info@weavewebdesign.com
NODE_ENV=development

# .env.production
SITE_URL=https://weavewebdesign.com
CONTACT_EMAIL=info@weavewebdesign.com
NODE_ENV=production
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "eleventy --serve --watch",
    "build": "eleventy",
    "build:prod": "NODE_ENV=production eleventy",
    "preview": "npx serve _site -p 8080",
    "debug": "DEBUG=Eleventy* eleventy --serve --watch",
    "clean": "rm -rf _site"
  }
}
```

## CSS Architecture

### PostCSS Configuration
**File:** `postcss.config.js`
```javascript
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : [])
  ]
};
```

### CSS Custom Properties System
```css
:root {
  /* Colors */
  --color-primary-50: #eff6ff;
  --color-primary-600: #2563eb;
  --color-primary-900: #1e3a8a;
  
  /* Typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-serif: 'DM Serif Display', serif;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-section: 4rem;
  
  /* Layout */
  --container-max-width: 1200px;
  --content-max-width: 65ch;
  
  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

### Responsive Breakpoints
```css
/* Mobile-first approach */
@media (min-width: 768px) {  /* Tablet */
  /* Styles */
}

@media (min-width: 1024px) { /* Desktop */
  /* Styles */
}

@media (min-width: 1440px) { /* Large Desktop */
  /* Styles */
}
```

## JavaScript Architecture

### Module System
**Entry Point:** `src/assets/js/main.js`
```javascript
// ES6 modules with dynamic imports for code splitting
import { initNavigation } from './modules/navigation.js';
import { initTextRotator } from './modules/text-rotator.js';

// Conditional loading for performance
if (document.querySelector('.faq-section')) {
  import('./modules/faq.js').then(({ initFAQ }) => {
    initFAQ();
  });
}
```

### Component Modules Pattern
```javascript
// src/assets/js/modules/text-rotator.js
export function initTextRotator() {
  const rotators = document.querySelectorAll('.text-rotator');
  
  rotators.forEach(rotator => {
    const items = rotator.querySelectorAll('.text-rotator__item');
    let currentIndex = 0;
    
    function rotate() {
      items[currentIndex].classList.remove('is-active');
      currentIndex = (currentIndex + 1) % items.length;
      items[currentIndex].classList.add('is-active');
    }
    
    setInterval(rotate, 3000);
  });
}
```

## Testing & Quality Assurance

### Playwright Configuration
**File:** `playwright.config.js`
```javascript
module.exports = {
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ]
};
```

### Accessibility Testing
```javascript
// tests/accessibility.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Homepage should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
    
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Performance Testing
```javascript
// tests/performance.spec.js
test('Homepage should meet Core Web Vitals', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries);
      }).observe({ entryTypes: ['navigation', 'paint'] });
    });
  });
  
  // Assert LCP < 2.5s, FID < 100ms, CLS < 0.1
});
```

### Lighthouse CI Configuration
**File:** `lighthouserc.js`
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```

## Code Quality Tools

### ESLint Configuration
**File:** `eslint.config.mjs`
```javascript
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error'
    }
  }
];
```

### Prettier Configuration
**File:** `.prettierrc`
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Husky Git Hooks
**File:** `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Lint-staged Configuration:**
```json
{
  "lint-staged": {
    "*.{js,njk}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{md,json,css}": [
      "prettier --write"
    ]
  }
}
```

## Deployment Configuration

### Netlify Configuration
**File:** `netlify.toml`
```toml
[build]
  publish = "_site"
  command = "npm run build:prod"

[build.environment]
  NODE_ENV = "production"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Actions Workflow
**File:** `.github/workflows/deploy.yml`
```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build site
        run: npm run build:prod
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './_site'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Performance Optimization

### Image Optimization Setup
```javascript
// .eleventy.js
const Image = require("@11ty/eleventy-img");

eleventyConfig.addShortcode("image", async function(src, alt, sizes = "100vw") {
  let metadata = await Image(src, {
    widths: [300, 600, 900, 1200],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/assets/images/",
    urlPath: "/assets/images/",
    sharpWebpOptions: {
      quality: 80
    },
    sharpJpegOptions: {
      quality: 85
    }
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

### CSS Optimization
```javascript
// Production CSS minification
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [
      cssnano({
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true
        }]
      })
    ] : [])
  ]
};
```

## Browser Support

### Browserslist Configuration
```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}
```

### Feature Detection Pattern
```javascript
// Progressive enhancement with feature detection
if ('IntersectionObserver' in window) {
  // Implement scroll animations
}

if (CSS.supports('display', 'grid')) {
  document.body.classList.add('supports-grid');
}

if ('serviceWorker' in navigator) {
  // Register service worker
}
```

This technical setup provides a modern, performant, and maintainable foundation for the Weave Studio website while supporting all the bilingual, accessibility, and performance requirements outlined in the project brief.
