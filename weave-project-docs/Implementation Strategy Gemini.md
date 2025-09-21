# Weave Studio One Page: Implementation Strategy

This document breaks down the transformation of the 11ty starter template into a production-ready, one-page website for Weave Studio. Each phase is divided into sub-steps designed to be completed in approximately 15 minutes.

---

## PHASE B1: BRANDING FOUNDATION (Days 1-2)

**Goal:** Transform the template into a Weave Studio branded foundation.

### Step 1.1: Update Business Information
- **Files to Edit:** `src/_data/site.js`
- **Commands to Run:** None
- **Success Criteria:** The `site.js` file contains Weave Studio's name, contact details, and other metadata. The site title updates in the browser tab.
- **Commit Message:** `feat(config): update site data with business information`

### Step 1.2: Convert to One-Page Scroll Navigation
- **Files to Edit:**
    - `src/_data/navigation.js`: Change links from `/[page]/` to `/#section-id`.
    - `src/pages/index.njk`: Add `id` attributes to each corresponding section.
    - `src/_includes/components/header.njk`: Ensure anchor links work correctly.
- **Commands to Run:** None
- **Success Criteria:** Clicking navigation links smoothly scrolls the user to the correct section on the homepage.
- **Commit Message:** `feat(nav): convert main navigation to one-page scroll`

### Step 1.3: Implement Brand Color Scheme
- **Files to Edit:** `src/assets/css/main.css` (or the primary CSS variables file).
- **Commands to Run:** None
- **Success Criteria:** The website's primary and accent colors reflect the Weave Studio brand palette. The blue background issue is resolved.
- **Commit Message:** `feat(ui): implement brand color scheme`

### Step 1.4: Replace Logo and Favicon
- **Files to Edit:**
    - Replace `src/assets/images/logo.svg`.
    - Replace `src/assets/images/favicon.ico`.
- **Commands to Run:**
    ```bash
    rm src/assets/images/logo.svg
    # Add new logo.svg to the same path
    ```
- **Success Criteria:** The Weave Studio logo appears in the header and the new favicon appears in the browser tab.
- **Commit Message:** `feat(assets): replace template logo and favicon`

---

## PHASE B2: HERO TRANSFORMATION (Days 3-5)

**Goal:** Build a compelling, animated hero section that communicates the core value proposition.

### Step 2.1: Structure the One-Page Layout
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** The `index.njk` file is cleared of multi-page content and structured with `section` elements for the new one-page design (e.g., `<section id="hero">`, `<section id="about">`, etc.).
- **Commit Message:** `feat(layout): structure index page for one-page layout`

### Step 2.2: Create Hero Text Rotator
- **Files to Edit:**
    - `src/pages/index.njk`: Add the HTML structure for the rotating text.
    - `src/assets/css/main.css`: Add CSS keyframe animations for the rotation effect.
- **Commands to Run:** None
- **Success Criteria:** The hero heading "We Create Beautiful..." rotates through "Websites," "E-commerce," and "Apps" using only CSS.
- **Commit Message:** `feat(hero): create css-based text rotator for hero heading`

### Step 2.3: Add Smooth-Scroll Chevron
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** A chevron icon exists at the bottom of the hero section. Clicking it smoothly scrolls the page to the "welcome/about" section.
- **Commit Message:** `feat(hero): add smooth-scroll chevron to hero section`

### Step 2.4: Implement Scroll-Triggered Navbar
- **Files to Edit:**
    - `src/assets/js/main.js` (or equivalent): Add a scroll event listener.
    - `src/assets/css/main.css`: Define styles for the transparent and solid navbar states.
- **Commands to Run:** None
- **Success Criteria:** The navbar is transparent when the user is at the top of the page and transitions to a solid background upon scrolling down.
- **Commit Message:** `feat(nav): implement scroll-triggered transparent navbar`

---

## PHASE B3: ONE-PAGE CONTENT ARCHITECTURE (Days 6-9)

**Goal:** Build out the core content sections of the website by adapting existing components.

### Step 3.1: Build Welcome/About Section
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** An "About" section exists with a circular profile image, a personal story, and business credibility points, reusing styles from the old about page.
- **Commit Message:** `feat(content): create welcome and about section`

### Step 3.2: Build Services Grid
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** A 6-card responsive grid displays the core services, adapting HTML from the template's services page.
- **Commit Message:** `feat(content): create services grid section`

### Step 3.3: Build "Why Choose Us" Section
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** A 3-column grid with icons and text highlights key differentiators (Speed, Quality, Support).
- **Commit Message:** `feat(content): create "why choose us" section`

### Step 3.4: Build Portfolio Preview Section
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** A 3-card preview of the best projects is displayed, reusing the case study component structure. A "View All" CTA is present.
- **Commit Message:** `feat(content): create portfolio preview section`

---

## PHASE B4: BLOG & FAQ INTEGRATION (Days 10-12)

**Goal:** Integrate dynamic content from the blog and FAQ to build authority and answer user questions.

### Step 4.1: Build Blog Preview Section
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** The homepage displays the 4 most recent blog posts in a grid, pulling from the existing 11ty collection.
- **Commit Message:** `feat(content): create blog preview section`

### Step 4.2: Create FAQ Data File
- **Files to Edit:** `src/_data/faq.js`
- **Commands to Run:** `touch src/_data/faq.js`
- **Success Criteria:** The `faq.js` file is created and populated with at least 8 common questions and answers.
- **Commit Message:** `feat(data): create faq data file`

### Step 4.3: Build FAQ Accordion Section
- **Files to Edit:**
    - Create `src/_includes/components/faq-accordion.njk`.
    - Add the new component to `src/pages/index.njk`.
- **Commands to Run:** None
- **Success Criteria:** An FAQ section on the homepage renders questions from `faq.js` in an accordion that animates smoothly on open/close.
- **Commit Message:** `feat(content): create faq accordion section`

---

## PHASE B5: CONTACT & CONVERSION (Days 13-14)

**Goal:** Optimize the contact section for higher conversion rates.

### Step 5.1: Enhance Contact Section
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** The contact form is displayed in a two-column layout next to contact information. The form includes new "Project Type" and "Budget Range" fields.
- **Commit Message:** `feat(contact): enhance contact form with new fields and layout`

### Step 5.2: Add Conversion-Focused CTAs
- **Files to Edit:** `src/pages/index.njk`
- **Commands to Run:** None
- **Success Criteria:** Multiple, varied CTAs ("Get Quote," "Start Project") are placed strategically after the services, portfolio, and FAQ sections.
- **Commit Message:** `feat(ui): add strategic call-to-action buttons`

---

## PHASE B6: CONTENT & SEO (Days 15-17)

**Goal:** Populate the site with professional copy, images, and blog posts.

### Step 6.1: Write and Add Professional Copy
- **Files to Edit:** `src/pages/index.njk`, `src/_data/site.js`, `src/_data/faq.js`
- **Commands to Run:** None
- **Success Criteria:** All placeholder text is replaced with professional, benefit-focused copy.
- **Commit Message:** `docs(content): replace placeholder text with professional copy`

### Step 6.2: Create and Add Starter Blog Posts
- **Files to Edit:** Create 5-8 new files in `src/blog/`.
- **Commands to Run:** None
- **Success Criteria:** The blog has several starter posts that build credibility and target relevant keywords.
- **Commit Message:** `feat(blog): add starter posts for launch`

### Step 6.3: Add Professional Images
- **Files to Edit:** Add new images to `src/assets/images/`.
- **Commands to Run:** None
- **Success Criteria:** Professional portfolio screenshots, a headshot for the about section, and branded featured images for blog posts are added and optimized.
- **Commit Message:** `feat(assets): add professional portfolio and brand images`

---

## PHASE B7: PERFORMANCE & POLISH (Days 18-19)

**Goal:** Optimize for speed, test across all browsers, and perform final QA.

### Step 7.1: Run Performance Audit and Optimization
- **Files to Edit:** All relevant files (`.js`, `.css`, `.njk`, images).
- **Commands to Run:** `npm run lighthouse`
- **Success Criteria:** Lighthouse scores are 90+ across the board. Images are compressed, CSS is critical, and JS is deferred where possible.
- **Commit Message:** `perf: optimize images, css, and javascript for performance`

### Step 7.2: Cross-Browser and Accessibility Testing
- **Files to Edit:** None (unless bugs are found).
- **Commands to Run:** `npm run test`
- **Success Criteria:** The site functions and appears as expected on Chrome, Firefox, Safari, and Edge. It is navigable via keyboard and screen reader.
- **Commit Message:** `fix(testing): resolve cross-browser and accessibility issues`

---

## PHASE B8: DEPLOYMENT & LAUNCH (Days 20-21)

**Goal:** Deploy the site to production and complete the launch checklist.

### Step 8.1: Configure Production Environment
- **Files to Edit:** `netlify.toml`
- **Commands to Run:** None
- **Success Criteria:** The custom domain is configured in Netlify, and production environment variables are set.
- **Commit Message:** `ci(deploy): configure production environment for netlify`

### Step 8.2: Final Deployment and Launch
- **Files to Edit:** None
- **Commands to Run:** `git push origin main` (or your production branch)
- **Success Criteria:** The site is live on the custom domain. The Netlify build is successful. All launch checklist items (form tests, sitemap submission) are complete.
- **Commit Message:** `🎉 Initial release`
