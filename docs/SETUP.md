# Setup Guide

## Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/weave-studio/weave-starter-template.git my-project
cd my-project
npm install
```

### 2. Configure
```bash
# Copy environment file
cp .env.example .env

# Edit site settings
# File: src/_data/site.js
```

### 3. Customize Brand
```bash
# Update colors in: src/assets/css/main.css
:root {
  --color-primary-600: #your-color;
}

# Update navigation: src/_data/navigation.js
# Replace logo: src/assets/images/logo.svg
```

### 4. Start Development
```bash
npm run dev
# Visit http://localhost:8080
```

## Content Management

### CMS Interface
```bash
# Visit /admin for content editing
# Or edit markdown files directly
```

### Add Blog Posts
```markdown
<!-- src/blog/posts/my-post.md -->
---
title: "Post Title"
description: "SEO description"
date: 2025-08-25
tags: ["posts", "web-design"]
---

Your content here...
```

## Testing
```bash
npm run test        # All tests
npm run test:a11y   # Accessibility  
npm run lighthouse  # Performance
```

## Troubleshooting

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Issues
```bash
npm run dev -- --port=3000
```