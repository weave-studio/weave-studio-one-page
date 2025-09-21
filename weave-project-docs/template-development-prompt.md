# Updated Prompt Template - Template First Development

## **Project Overview**
Create a comprehensive, reusable starter template for high-performance, accessible websites. This template follows a **template-first strategy** where we build the foundation once and customize it for multiple projects. The first implementation will be the **Weave Studio one-page website** - a freelance web design and development business showcasing modern, minimal design with comprehensive functionality.

### **Two-Phase Strategy:**
- **Phase A:** Build the starter template with all modern tooling and best practices
- **Phase B:** Customize the template specifically for Weave Studio's requirements

## **Technical Stack**
- **Build Tools:** 11ty (Eleventy) + Vite
- **CMS:** Decap CMS for client content management
- **Core Technologies:** HTML5, CSS3, JavaScript (ES6+)
- **Development Approach:** Mobile-first responsive design
- **Version Control:** Git with conventional commits
- **Code Quality:** Husky + ESLint + Prettier
- **CI/CD:** GitHub Actions for automated workflows
- **Testing:** Playwright + axe-core for comprehensive testing

## **Template Requirements**

### **Performance Priorities**
- Optimize for Core Web Vitals (LCP, FID, CLS)
- Implement lazy loading for images and non-critical content
- Minimize bundle sizes with code splitting and tree shaking
- Use modern image formats (WebP, AVIF) with fallbacks
- Implement critical CSS inlining
- Add service worker for advanced caching strategies
- Target Lighthouse scores 90+ across all metrics

### **Accessibility Standards**
- WCAG 2.1 AA compliance with automated testing
- Semantic HTML structure throughout
- Proper heading hierarchy (h1-h6)
- Alt text for all images and media
- Full keyboard navigation support
- Advanced focus management for interactive elements
- Screen reader compatibility with proper ARIA
- Color contrast ratios of 4.5:1 minimum
- Respect for reduced motion preferences

### **Internationalization Features**
- RTL layout support (Arabic, Hebrew)
- Language detection and switching infrastructure
- Text direction switching (dir="rtl")
- Mirrored layouts for RTL languages
- Optimized font loading strategies for multiple languages
- Cultural design adaptations

### **Dark Mode Implementation**
- System preference detection with fallbacks
- Toggle button for manual override
- CSS custom properties for comprehensive theme switching
- Smooth transitions between modes
- Persistent user preference storage
- Theme-aware component styling

### **Developer Experience**
- Hot reload development server
- Automated code formatting and linting
- Pre-commit hooks for code quality
- Automated testing on pull requests
- Multi-platform deployment workflows
- Comprehensive documentation and examples

## **Development Guidelines**

### **Performance Checklist**
- [ ] Compress and optimize all images automatically
- [ ] Implement intelligent lazy loading
- [ ] Minify CSS and JavaScript in production
- [ ] Use efficient fonts with font-display: swap
- [ ] Optimize third-party scripts and dependencies
- [ ] Implement caching headers and strategies
- [ ] Test on slow 3G connections
- [ ] Monitor Core Web Vitals continuously

### **Accessibility Checklist**
- [ ] Semantic HTML structure throughout
- [ ] Logical heading hierarchy
- [ ] Descriptive alt text for all images
- [ ] Full keyboard navigation
- [ ] Visible focus indicators
- [ ] Screen reader testing with real users
- [ ] Color contrast validation (4.5:1 minimum)
- [ ] Respect motion preferences
- [ ] ARIA attributes where appropriate

### **Code Quality Standards**
- [ ] Conventional commit messages
- [ ] Component-based architecture
- [ ] Comprehensive error handling
- [ ] Performance monitoring
- [ ] Security best practices
- [ ] Cross-browser compatibility
- [ ] Mobile-first responsive design
- [ ] Clean, maintainable code structure

### **Responsive Design Breakpoints**
- **Mobile:** 320px - 767px (primary focus)
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1439px
- **Large Desktop:** 1440px+
- **Ultra-wide:** 1920px+ (optional enhancement)

### **Template Customization Strategy**
- **Quick Start (5-10 minutes):** Site configuration, branding, basic content
- **Design Customization (30-60 minutes):** Colors, fonts, layout modifications
- **Advanced Customization (2-4 hours):** Custom components, integrations, workflows

## **Current Development Status**

### **Completed Phases:**
- ✅ **Phase A1:** Foundation & Build System (repo setup, package.json, dependencies)

### **Template Development Phases (Phase A):**
- **A2:** 11ty Configuration
- **A3:** CSS Design System
- **A4:** Base Templates & Components
- **A5:** JavaScript Foundation
- **A6:** Content Management Setup
- **A7:** Sample Content & Pages
- **A8:** Testing & Quality Assurance
- **A9:** CI/CD & Deployment
- **A10:** Documentation & Distribution

### **Weave Studio Implementation Phases (Phase B):**
- **B1:** Template Customization Setup
- **B2:** Hero Section & Branding
- **B3:** About & Services Content
- **B4:** Interactive Elements
- **B5:** Content Migration & SEO
- **B6:** Performance Optimization
- **B7:** Testing & Launch Preparation
- **B8:** Production Deployment

---

## **Usage Instructions**

**Copy this prompt when requesting development help:**

---

**I'm currently working on Phase [PHASE_CODE]: [PHASE_NAME].**

**Phase Requirements:**
[Paste specific phase requirements from the development plan]

**Please implement this phase with complete working code following all template guidelines above. Include:**
- Complete file contents for all new/modified files
- Clear implementation instructions
- Git commit message following conventional commits
- Testing considerations
- Next steps for the following phase

**Ensure the implementation:**
- Follows mobile-first responsive design
- Maintains accessibility standards (WCAG 2.1 AA)
- Optimizes for performance (Core Web Vitals)
- Uses semantic HTML and proper component architecture
- Includes error handling and edge cases
- Provides clear documentation and comments

---

## **Benefits of This Template-First Approach**

### **Immediate Value**
- **60-70% faster project initialization** for future clients
- **Consistent quality** across all projects
- **Professional workflows** with automated testing and deployment
- **Modern development practices** built-in from day one

### **Long-term Benefits**
- **Competitive advantage** through superior tooling
- **Scalable business model** with proven foundation
- **Client confidence** through professional processes
- **Community contribution** via open-source template

### **Template Features**
- 🚀 **Performance:** Lighthouse 90+ scores, Core Web Vitals optimized
- ♿ **Accessibility:** WCAG 2.1 AA compliant with automated testing
- 🎨 **Design System:** Comprehensive CSS custom properties and utilities
- 📱 **Responsive:** Mobile-first with intelligent breakpoints
- 🌙 **Dark Mode:** System-aware with manual override
- 🌐 **International:** RTL support and multi-language ready
- 📝 **Content Management:** Decap CMS for non-technical users
- 🛠️ **Developer Experience:** Modern tooling and workflows
- 🧪 **Testing:** Automated accessibility and performance testing
- 🚀 **Deployment:** Multi-platform CI/CD with GitHub Actions