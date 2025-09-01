# Deployment Guide

## Netlify (Recommended)

### Auto Deploy
1. Push to GitHub
2. Connect repo at [netlify.com](https://netlify.com)
3. Build: `npm run build`
4. Publish: `_site` 
5. Deploy automatically

### Manual Deploy
```bash
npm run build
# Drag _site folder to netlify.com
```

## Vercel

### Auto Deploy  
1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Auto-detects 11ty settings
4. Deploy automatically

### CLI Deploy
```bash
npm install -g vercel
npm run build
vercel --prod
```

## GitHub Pages

### Enable Pages
1. Repo Settings > Pages
2. Source: "GitHub Actions"
3. Pushes to main trigger deployment

### Custom Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v2
        with:
          artifact_name: github-pages
          folder: _site
```

## Environment Variables

### Production Settings
```env
# .env
SITE_URL=https://yoursite.com
SITE_NAME=Your Site
CONTACT_EMAIL=your@email.com
```

## Custom Domains

### Netlify
Domain settings > Add custom domain > Update DNS

### Vercel  
Project settings > Domains > Add domain > Update DNS

### GitHub Pages
Settings > Pages > Custom domain > Update DNS