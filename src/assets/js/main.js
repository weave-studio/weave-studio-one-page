(function() {
    'use strict';
  
    // =========================================================================
    // Weave Studio Template - JavaScript Foundation (Phase A5)
    // Enhanced interactive functionality with performance optimization
    // =========================================================================
    
    // Global constants and utilities
    const CONSTANTS = {
        BREAKPOINTS: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280
        },
        TIMING: {
        fast: 150,
        normal: 300,
        slow: 500
        },
        STORAGE_KEYS: {
        theme: 'weave-theme',
        language: 'weave-language',
        preferences: 'weave-preferences'
        }
    };
    
    // Utility functions
    const utils = {
        // DOM ready utility
        ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
        },
    
        // Debounce function for performance
        debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
            timeout = null;
            if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
        },
    
        // Throttle function for scroll events
        throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
            }
        };
        },
    
        // Query selector with error handling
        $(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn(`Invalid selector: ${selector}`, e);
            return null;
        }
        },
    
        // Query selector all with error handling
        $$(selector, context = document) {
        try {
            const elements = context.querySelectorAll(selector);
            return elements ? [...elements] : [];
        } catch (e) {
            console.warn(`Invalid selector: ${selector}`, e);
            return [];
        }
        }
    };
    
    // =========================================================================
    // Enhanced Theme Management
    // =========================================================================
    class ThemeManager {
        constructor() {
        this.currentTheme = this.getStoredTheme();
        this.toggleButton = null;
        this.mediaQuery = null;
        this.init();
        }
    
        init() {
        this.toggleButton = utils.$('[data-theme-toggle]');
        this.setupMediaQuery();
        this.setTheme(this.currentTheme, false);
        
        if (this.toggleButton) {
            this.setupToggleButton();
        }
    
        // Listen for system theme changes
        this.setupSystemThemeListener();
        
        // Dispatch initial theme event
        this.dispatchThemeEvent(this.currentTheme);
        }
    
        getStoredTheme() {
        const stored = localStorage.getItem(CONSTANTS.STORAGE_KEYS.theme);
        if (stored && ['light', 'dark'].includes(stored)) {
            return stored;
        }
        
        // Default to system preference
        return this.getSystemTheme();
        }
    
        getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
    
        setupMediaQuery() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        }
    
        setupToggleButton() {
        this.toggleButton.addEventListener('click', this.toggle.bind(this));
        this.toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
            }
        });
        this.updateToggleState();
        }
    
        setupSystemThemeListener() {
        if (this.mediaQuery) {
            this.mediaQuery.addEventListener('change', (e) => {
            // Only follow system if user hasn't manually set a preference
            const hasManualPreference = localStorage.getItem(CONSTANTS.STORAGE_KEYS.theme);
            if (!hasManualPreference) {
                this.setTheme(e.matches ? 'dark' : 'light', true);
            }
            });
        }
        }
    
        toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true);
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.theme, newTheme);
        }
    
        setTheme(theme, animate = false) {
        if (!['light', 'dark'].includes(theme)) {
            theme = this.getSystemTheme();
        }
    
        this.currentTheme = theme;
        
        // Add transition class for smooth theme switching
        if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.classList.add('theme-transitioning');
            setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
            }, CONSTANTS.TIMING.normal);
        }
    
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleState();
        this.dispatchThemeEvent(theme);
        }
    
        updateToggleState() {
        if (!this.toggleButton) return;
        
        const isDark = this.currentTheme === 'dark';
        this.toggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        
        // Update tooltip/label
        const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        this.toggleButton.setAttribute('aria-label', label);
        }
    
        dispatchThemeEvent(theme) {
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { 
            theme,
            isUserInitiated: true
            }
        }));
        }
    
        // Public methods
        getCurrentTheme() {
        return this.currentTheme;
        }
    
        isDarkMode() {
        return this.currentTheme === 'dark';
        }
    }
    
    // =========================================================================
    // Enhanced Mobile Navigation
    // =========================================================================
    class MobileNavigation {
        constructor() {
        this.toggleButton = null;
        this.navigation = null;
        this.isOpen = false;
        this.focusTrap = null;
        this.init();
        }
    
        init() {
        this.toggleButton = utils.$('.mobile-menu-toggle');
        this.navigation = utils.$('.main-navigation');
        
        if (this.toggleButton && this.navigation) {
            this.setupEventListeners();
            this.setupFocusTrap();
            this.setupResizeHandler();
        }
        }
    
        setupEventListeners() {
        // Toggle button click
        this.toggleButton.addEventListener('click', this.toggle.bind(this));
        
        // Keyboard support for toggle button
        this.toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
            }
        });
    
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.navigation.contains(e.target) && 
                !this.toggleButton.contains(e.target)) {
            this.close();
            }
        });
    
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
            this.close();
            this.toggleButton.focus();
            }
        });
    
        // Close navigation when clicking on links (mobile)
        const navLinks = utils.$$('.main-navigation__link', this.navigation);
        if (navLinks && navLinks.length > 0) {
            navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Delay closing to allow navigation
                setTimeout(() => this.close(), 100);
            });
            });
        }
        }
    
        setupFocusTrap() {
        const focusableElements = utils.$$('a, button, [tabindex]:not([tabindex="-1"])', this.navigation);
        
        if (focusableElements && focusableElements.length > 0) {
            this.focusTrap = {
            firstElement: focusableElements[0],
            lastElement: focusableElements[focusableElements.length - 1]
            };
    
            this.navigation.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
    
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === this.focusTrap.firstElement) {
                    e.preventDefault();
                    this.focusTrap.lastElement.focus();
                }
                } else {
                // Tab
                if (document.activeElement === this.focusTrap.lastElement) {
                    e.preventDefault();
                    this.focusTrap.firstElement.focus();
                }
                }
            }
            });
        }
        }
    
        setupResizeHandler() {
        const resizeHandler = utils.debounce(() => {
            // Close mobile menu if window becomes desktop size
            if (window.innerWidth >= CONSTANTS.BREAKPOINTS.tablet && this.isOpen) {
            this.close();
            }
        }, 250);
    
        window.addEventListener('resize', resizeHandler);
        }
    
        toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
        }
    
        open() {
        this.isOpen = true;
        this.toggleButton.setAttribute('aria-expanded', 'true');
        this.navigation.classList.add('is-open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first navigation item
        setTimeout(() => {
            if (this.focusTrap && this.focusTrap.firstElement) {
            this.focusTrap.firstElement.focus();
            }
        }, 100);
    
        // Dispatch event
        this.dispatchNavigationEvent('opened');
        }
    
        close() {
        this.isOpen = false;
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.navigation.classList.remove('is-open');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Dispatch event
        this.dispatchNavigationEvent('closed');
        }
    
        dispatchNavigationEvent(action) {
        window.dispatchEvent(new CustomEvent('navigation', {
            detail: { action, isOpen: this.isOpen }
        }));
        }
    }
    
    // =========================================================================
    // Enhanced Smooth Scrolling
    // =========================================================================
    class SmoothScroll {
        constructor() {
        this.headerHeight = 0;
        this.isScrolling = false;
        this.init();
        }
    
        init() {
        this.updateHeaderHeight();
        this.setupScrollLinks();
        this.setupResizeHandler();
        }
    
        updateHeaderHeight() {
        const header = utils.$('.site-header');
        this.headerHeight = header ? header.offsetHeight : 0;
        }
    
        setupScrollLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link || link.getAttribute('href') === '#') return;
    
            const targetId = link.getAttribute('href').substring(1);
            const target = utils.$(`#${targetId}`);
            
            if (target) {
            e.preventDefault();
            this.scrollToElement(target, link);
            }
        });
        }
    
        setupResizeHandler() {
        const resizeHandler = utils.debounce(() => {
            this.updateHeaderHeight();
        }, 250);
    
        window.addEventListener('resize', resizeHandler);
        }
    
        scrollToElement(target, trigger = null) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - this.headerHeight - 20;
        
        // Use native smooth scrolling
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    
        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
            // Set focus for accessibility
            target.focus({ preventScroll: true });
            
            // Update URL hash if needed
            if (trigger && target.id) {
            history.replaceState(null, null, `#${target.id}`);
            }
        }, 1000);
        }
    }
    
    // =========================================================================
    // Language Toggle System
    // =========================================================================
    class LanguageManager {
        constructor() {
          // Initialize available languages FIRST
          this.availableLanguages = ['en', 'he', 'ar']; // Example languages
          this.toggleButton = null;
          
          // Then get stored language (now availableLanguages is defined)
          this.currentLanguage = this.getStoredLanguage();
          
          this.init();
        }
      
        init() {
          this.toggleButton = utils.$('[data-language-toggle]');
          this.setLanguage(this.currentLanguage);
          
          if (this.toggleButton) {
            this.setupToggleButton();
          }
        }
      
        getStoredLanguage() {
          const stored = localStorage.getItem(CONSTANTS.STORAGE_KEYS.language);
          
          // Make sure availableLanguages exists and has the includes method
          if (stored && this.availableLanguages && this.availableLanguages.includes && this.availableLanguages.includes(stored)) {
            return stored;
          }
          
          // Default to document language or English
          return document.documentElement.lang || 'en';
        }
      
        setupToggleButton() {
          this.toggleButton.addEventListener('click', this.toggle.bind(this));
        }
      
        toggle() {
          const currentIndex = this.availableLanguages.indexOf(this.currentLanguage);
          const nextIndex = (currentIndex + 1) % this.availableLanguages.length;
          const newLanguage = this.availableLanguages[nextIndex];
          
          this.setLanguage(newLanguage);
          localStorage.setItem(CONSTANTS.STORAGE_KEYS.language, newLanguage);
        }
      
        setLanguage(language) {
          if (!this.availableLanguages.includes(language)) {
            language = 'en';
          }
      
          this.currentLanguage = language;
          document.documentElement.lang = language;
          
          // Set text direction for RTL languages
          const rtlLanguages = ['ar', 'he'];
          document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
          
          this.updateToggleButton();
          this.dispatchLanguageEvent(language);
        }
      
        updateToggleButton() {
          if (!this.toggleButton) return;
          
          this.toggleButton.textContent = this.currentLanguage.toUpperCase();
          this.toggleButton.setAttribute('aria-label', `Current language: ${this.currentLanguage}. Click to change.`);
        }
      
        dispatchLanguageEvent(language) {
          window.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language, direction: document.documentElement.dir }
          }));
        }
      
        getCurrentLanguage() {
          return this.currentLanguage;
        }
      
        isRTL() {
          return document.documentElement.dir === 'rtl';
        }
    }
    
    // =========================================================================
    // Basic Accessibility Manager
    // =========================================================================
    class AccessibilityManager {
        constructor() {
        this.init();
        }
    
        init() {
        this.setupFocusManagement();
        this.setupSkipLinks();
        this.setupReducedMotion();
        this.setupKeyboardNavigation();
        }
    
        setupFocusManagement() {
        // Add focus-visible polyfill behavior
        let hadKeyboardEvent = false;
    
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
            hadKeyboardEvent = true;
            document.body.classList.add('keyboard-navigation');
            }
        });
    
        document.addEventListener('mousedown', () => {
            hadKeyboardEvent = false;
            document.body.classList.remove('keyboard-navigation');
        });
        }
    
        setupSkipLinks() {
        const skipLinks = utils.$$('.skip-link');
        if (skipLinks && skipLinks.length > 0) {
            skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = utils.$(link.getAttribute('href'));
                if (target) {
                e.preventDefault();
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
                }
            });
            });
        }
        }
    
        setupReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (e) => {
            if (e.matches) {
            document.documentElement.style.scrollBehavior = 'auto';
            document.documentElement.classList.add('reduce-motion');
            } else {
            document.documentElement.style.scrollBehavior = '';
            document.documentElement.classList.remove('reduce-motion');
            }
        };
    
        handleReducedMotion(mediaQuery);
        mediaQuery.addEventListener('change', handleReducedMotion);
        }
    
        setupKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + M = Main content
            if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const mainContent = utils.$('#main-content, main');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
            }
    
            // Alt + N = Navigation
            if (e.altKey && e.key === 'n') {
            e.preventDefault();
            const navigation = utils.$('.main-navigation');
            if (navigation) {
                const firstLink = utils.$('a', navigation);
                if (firstLink) {
                firstLink.focus();
                }
            }
            }
        });
        }
    
        announce(message) {
        // Simple announcement without live region for now
        console.log('Accessibility announcement:', message);
        }
    }

    // =========================================================================
    // Search Functionality
    // =========================================================================
    class SearchManager {
        constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.searchIndex = [];
        this.isLoading = false;
        this.debounceDelay = 300;
        this.isOpen = false;
        this.init();
        }
    
        init() {
        this.searchInput = utils.$('[data-search-input]');
        this.searchResults = utils.$('[data-search-results]');
        
        if (this.searchInput) {
            this.setupSearch();
            this.buildSearchIndex();
        }
        }
    
        setupSearch() {
        const debouncedSearch = utils.debounce(this.performSearch.bind(this), this.debounceDelay);
        
        this.searchInput.addEventListener('input', debouncedSearch);
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
            this.clearSearch();
            }
            if (e.key === 'ArrowDown' && this.isOpen) {
            e.preventDefault();
            this.focusFirstResult();
            }
        });
    
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.length >= 2) {
            this.showResults();
            }
        });
    
        // Setup focus management
        this.setupFocusManagement();
        }
    
        setupFocusManagement() {
        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('[data-search]')) {
            this.clearSearch();
            }
        });
    
        // Handle keyboard navigation in results
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
    
            const results = utils.$$('.search-results__item');
            const currentFocus = document.activeElement;
            const currentIndex = results.indexOf(currentFocus);
    
            if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
            results[nextIndex]?.focus();
            }
    
            if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex === -1 || currentIndex === 0) {
                this.searchInput.focus();
            } else {
                results[currentIndex - 1]?.focus();
            }
            }
    
            if (e.key === 'Enter' && currentFocus.classList.contains('search-results__item')) {
            currentFocus.click();
            }
        });
        }
    
        async buildSearchIndex() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            // Try to fetch search index from server
            const response = await fetch('/search-index.json').catch(() => null);
            
            if (response && response.ok) {
            const data = await response.json();
            this.searchIndex = [
                ...(data.posts || []),
                ...(data.pages || [])
            ];
            } else {
            // Fallback: build index from current page content
            this.buildPageIndex();
            }
        } catch (error) {
            console.warn('Failed to load search index:', error);
            this.buildPageIndex();
        } finally {
            this.isLoading = false;
        }
        }
    
        buildPageIndex() {
        // Simple page-based search index
        const headings = utils.$$('h1, h2, h3, h4, h5, h6');
        const articles = utils.$$('article');
        const navLinks = utils.$$('.main-navigation a');
        
        this.searchIndex = [
            // Navigation items
            ...navLinks.map(link => ({
            title: link.textContent.trim(),
            content: `Navigate to ${link.textContent.trim()}`,
            url: link.href,
            type: 'navigation'
            })),
            
            // Page headings
            ...headings.map(heading => ({
            title: heading.textContent.trim(),
            content: this.getElementContext(heading),
            url: this.getElementUrl(heading),
            type: 'heading'
            })),
            
            // Articles (blog posts, pages)
            ...articles.map(article => ({
            title: this.getArticleTitle(article),
            content: this.getArticleContent(article),
            url: this.getElementUrl(article),
            type: 'page'
            }))
        ].filter(item => item.title && item.title.length > 2);
        }
    
        getElementContext(element) {
        const nextElement = element.nextElementSibling;
        if (nextElement && nextElement.tagName === 'P') {
            return nextElement.textContent.trim().substring(0, 150);
        }
        
        // Look for nearby text content
        const parent = element.parentElement;
        const allText = parent.textContent.replace(element.textContent, '').trim();
        return allText.substring(0, 150);
        }
    
        getElementUrl(element) {
        if (element.id) {
            return `${window.location.pathname}#${element.id}`;
        }
        return window.location.pathname;
        }
    
        getArticleTitle(article) {
        const heading = utils.$('h1, h2, h3', article);
        if (heading) return heading.textContent.trim();
        
        const title = utils.$('.page__title, .post__title', article);
        return title ? title.textContent.trim() : '';
        }
    
        getArticleContent(article) {
        // Get description or first paragraph
        const description = utils.$('.page__description, .post__description', article);
        if (description) return description.textContent.trim();
        
        const firstParagraph = utils.$('p', article);
        if (firstParagraph) return firstParagraph.textContent.trim().substring(0, 200);
        
        return article.textContent.trim().substring(0, 200);
        }
    
        performSearch(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            this.clearResults();
            return;
        }
    
        const results = this.searchIndex
            .filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.content.toLowerCase().includes(query)
            )
            .slice(0, 8) // Limit results
            .sort((a, b) => {
            // Prioritize title matches
            const aInTitle = a.title.toLowerCase().includes(query);
            const bInTitle = b.title.toLowerCase().includes(query);
            if (aInTitle && !bInTitle) return -1;
            if (!aInTitle && bInTitle) return 1;
            return 0;
            });
    
        this.displayResults(results, query);
        }
    
        displayResults(results, query) {
        if (!this.searchResults) return;
    
        if (results.length === 0) {
            this.searchResults.innerHTML = `
            <div class="search-results__empty">
                <p>No results found for "${this.escapeHtml(query)}"</p>
            </div>
            `;
        } else {
            const resultsList = results.map(result => `
            <a href="${result.url}" class="search-results__item" tabindex="-1">
                <div class="search-results__type">${this.getTypeIcon(result.type)} ${result.type}</div>
                <h3 class="search-results__title">${this.highlightQuery(result.title, query)}</h3>
                <p class="search-results__content">${this.highlightQuery(result.content, query)}</p>
            </a>
            `).join('');
    
            this.searchResults.innerHTML = `
            <div class="search-results__list" role="listbox" aria-label="Search results">
                ${resultsList}
            </div>
            `;
        }
    
        this.showResults();
        }
    
        getTypeIcon(type) {
        const icons = {
            navigation: '🔗',
            heading: '📖',
            page: '📄',
            post: '📝'
        };
        return icons[type] || '📄';
        }
    
        highlightQuery(text, query) {
        if (!query) return this.escapeHtml(text);
        
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
        }
    
        escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
        }
    
        escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    
        showResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
            this.isOpen = true;
            
            // Make results keyboard accessible
            const items = utils.$$('.search-results__item');
            items.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'option');
            item.setAttribute('aria-posinset', index + 1);
            item.setAttribute('aria-setsize', items.length);
            });
        }
        }
    
        focusFirstResult() {
        const firstResult = utils.$('.search-results__item');
        if (firstResult) {
            firstResult.focus();
        }
        }
    
        clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.clearResults();
        }
    
        clearResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
            this.searchResults.innerHTML = '';
            this.isOpen = false;
        }
        }
    
        // Public method to trigger search programmatically
        search(query) {
        if (this.searchInput) {
            this.searchInput.value = query;
            this.performSearch({ target: { value: query } });
        }
        }
    }

    // =========================================================================
    // Intersection Observer for Animations and Lazy Loading
    // =========================================================================
    class IntersectionManager {
        constructor() {
        this.observers = new Map();
        this.init();
        }
    
        init() {
        this.setupAnimationTriggers();
        this.setupLazyLoading();
        this.setupProgressiveEnhancement();
        }
    
        setupAnimationTriggers() {
        const animatedElements = utils.$$('[data-animate]');
        
        if (animatedElements && animatedElements.length > 0 && 'IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                this.triggerAnimation(entry.target);
                } else if (entry.target.dataset.animateRepeat === 'true') {
                this.resetAnimation(entry.target);
                }
            });
            }, {
            rootMargin: '-10%',
            threshold: 0.1
            });
    
            animatedElements.forEach(element => {
            // Set initial state
            this.setInitialAnimationState(element);
            animationObserver.observe(element);
            });
            
            this.observers.set('animation', animationObserver);
        }
        }
    
        setupLazyLoading() {
        const lazyElements = utils.$$('[data-lazy]');
        
        if (lazyElements && lazyElements.length > 0 && 'IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                this.loadLazyElement(entry.target);
                lazyObserver.unobserve(entry.target);
                }
            });
            }, {
            rootMargin: '50px 0px',
            threshold: 0.01
            });
    
            lazyElements.forEach(element => lazyObserver.observe(element));
            this.observers.set('lazy', lazyObserver);
        }
        }
    
        setupProgressiveEnhancement() {
        const enhancedElements = utils.$$('[data-enhance]');
        
        if (enhancedElements && enhancedElements.length > 0 && 'IntersectionObserver' in window) {
            const enhanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                this.enhanceElement(entry.target);
                enhanceObserver.unobserve(entry.target);
                }
            });
            }, {
            rootMargin: '100px 0px',
            threshold: 0.01
            });
    
            enhancedElements.forEach(element => enhanceObserver.observe(element));
            this.observers.set('enhance', enhanceObserver);
        }
        }
    
        setInitialAnimationState(element) {
        const animationType = element.dataset.animate || 'fadeInUp';
        
        // Don't set initial state if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
    
        switch (animationType) {
            case 'fadeInUp':
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            break;
            case 'fadeIn':
            element.style.opacity = '0';
            break;
            case 'slideInLeft':
            element.style.opacity = '0';
            element.style.transform = 'translateX(-30px)';
            break;
            case 'slideInRight':
            element.style.opacity = '0';
            element.style.transform = 'translateX(30px)';
            break;
            case 'scaleIn':
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            break;
            case 'rotateIn':
            element.style.opacity = '0';
            element.style.transform = 'rotate(-10deg) scale(0.8)';
            break;
        }
    
        element.style.transition = `all ${CONSTANTS.TIMING.slow}ms ${CONSTANTS.ease || 'ease-out'}`;
        }
    
        triggerAnimation(element) {
        const animationType = element.dataset.animate || 'fadeInUp';
        const delay = element.dataset.animateDelay || 0;
        
        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.classList.add('animated');
            return;
        }
    
        setTimeout(() => {
            switch (animationType) {
            case 'fadeInUp':
            case 'slideInLeft':
            case 'slideInRight':
            case 'scaleIn':
            case 'rotateIn':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0)';
                break;
            case 'fadeIn':
                element.style.opacity = '1';
                break;
            }
    
            element.classList.add('animated');
            
            // Custom animation callback
            if (element.dataset.animateCallback) {
            const callback = window[element.dataset.animateCallback];
            if (typeof callback === 'function') {
                callback(element);
            }
            }
    
        }, parseInt(delay));
        }
    
        resetAnimation(element) {
        if (element.dataset.animateRepeat === 'true') {
            this.setInitialAnimationState(element);
            element.classList.remove('animated');
        }
        }
    
        loadLazyElement(element) {
        const src = element.dataset.lazy;
        const type = element.dataset.lazyType || 'image';
    
        switch (type) {
            case 'image':
            if (element.tagName === 'IMG') {
                element.src = src;
                element.onload = () => {
                element.classList.add('loaded');
                element.removeAttribute('data-lazy');
                };
                element.onerror = () => {
                element.classList.add('error');
                console.warn('Failed to load lazy image:', src);
                };
            }
            break;
            
            case 'background':
            element.style.backgroundImage = `url(${src})`;
            element.classList.add('loaded');
            element.removeAttribute('data-lazy');
            break;
            
            case 'content':
            fetch(src)
                .then(response => response.text())
                .then(html => {
                element.innerHTML = html;
                element.classList.add('loaded');
                element.removeAttribute('data-lazy');
                })
                .catch(error => {
                console.warn('Failed to load lazy content:', error);
                element.classList.add('error');
                });
            break;
            
            case 'iframe':
            if (element.tagName === 'IFRAME') {
                element.src = src;
                element.onload = () => {
                element.classList.add('loaded');
                element.removeAttribute('data-lazy');
                };
            }
            break;
        }
        }
    
        enhanceElement(element) {
        const enhancement = element.dataset.enhance;
        
        switch (enhancement) {
            case 'syntax-highlight':
            this.enhanceSyntaxHighlighting(element);
            break;
            
            case 'interactive-code':
            this.enhanceInteractiveCode(element);
            break;
            
            case 'tooltip':
            this.enhanceTooltip(element);
            break;
            
            case 'accordion':
            this.enhanceAccordion(element);
            break;
            
            default:
            element.classList.add('enhanced');
        }
        }
    
        enhanceSyntaxHighlighting(element) {
        // Progressive enhancement for code blocks
        if (window.Prism) {
            window.Prism.highlightElement(element);
        }
        element.classList.add('enhanced');
        }
    
        enhanceInteractiveCode(element) {
        // Add copy button to code blocks
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'code-copy-btn';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(element.textContent).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
            });
        };
        
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(copyButton);
        element.classList.add('enhanced');
        }
    
        enhanceTooltip(element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip || element.title;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--color-gray-900);
            color: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
        `;
    
        element.style.position = 'relative';
        element.appendChild(tooltip);
    
        element.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
    
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    
        element.classList.add('enhanced');
        }
    
        enhanceAccordion(element) {
        const trigger = utils.$('[data-accordion-trigger]', element);
        const content = utils.$('[data-accordion-content]', element);
    
        if (trigger && content) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', content.id || `accordion-${Date.now()}`);
            content.style.display = 'none';
    
            trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
            });
        }
    
        element.classList.add('enhanced');
        }
    
        // Cleanup method
        destroy() {
        this.observers.forEach(observer => {
            if (observer.disconnect) {
            observer.disconnect();
            }
        });
        this.observers.clear();
        }
    
        // Public methods
        animateElement(element, type = 'fadeInUp') {
        element.dataset.animate = type;
        this.setInitialAnimationState(element);
        this.triggerAnimation(element);
        }
    }
    
    // =========================================================================
    // Form Enhancement Manager
    // =========================================================================
    class FormManager {
        constructor() {
        this.forms = [];
        this.init();
        }
    
        init() {
        const forms = utils.$$('form[data-enhance]');
        if (forms && forms.length > 0) {
            forms.forEach(form => this.enhanceForm(form));
        }
        }
    
        enhanceForm(form) {
        const enhancement = {
            form,
            validators: new Map(),
            isValid: false
        };
    
        this.setupValidation(enhancement);
        this.setupSubmission(enhancement);
        this.setupAccessibility(enhancement);
        
        this.forms.push(enhancement);
        }
    
        setupValidation(enhancement) {
        const { form } = enhancement;
        const inputs = utils.$$('input, textarea, select', form);
    
        if (inputs && inputs.length > 0) {
            inputs.forEach(input => {
            const validator = this.createValidator(input);
            if (validator) {
                enhancement.validators.set(input, validator);
                
                // Real-time validation
                input.addEventListener('blur', () => this.validateField(input, validator));
                input.addEventListener('input', utils.debounce(() => {
                if (input.classList.contains('was-validated')) {
                    this.validateField(input, validator);
                }
                }, 300));
            }
            });
        }
    
        // Form submission validation
        form.addEventListener('submit', (e) => {
            this.validateForm(enhancement, e);
        });
        }
    
        createValidator(input) {
        const rules = [];
        
        // Required validation
        if (input.hasAttribute('required')) {
            rules.push({
            test: (value) => value.trim().length > 0,
            message: 'This field is required'
            });
        }
    
        // Email validation
        if (input.type === 'email') {
            rules.push({
            test: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
            });
        }
    
        // URL validation
        if (input.type === 'url') {
            rules.push({
            test: (value) => !value || /^https?:\/\/.+/.test(value),
            message: 'Please enter a valid URL starting with http:// or https://'
            });
        }
    
        // Length validation
        const minLength = input.getAttribute('minlength');
        if (minLength) {
            rules.push({
            test: (value) => !value || value.length >= parseInt(minLength),
            message: `Must be at least ${minLength} characters`
            });
        }
    
        const maxLength = input.getAttribute('maxlength');
        if (maxLength) {
            rules.push({
            test: (value) => value.length <= parseInt(maxLength),
            message: `Must be no more than ${maxLength} characters`
            });
        }
    
        // Pattern validation
        const pattern = input.getAttribute('pattern');
        if (pattern) {
            rules.push({
            test: (value) => !value || new RegExp(pattern).test(value),
            message: input.title || 'Please match the required format'
            });
        }
    
        // Custom validation rules
        const customValidation = input.dataset.validation;
        if (customValidation) {
            switch (customValidation) {
            case 'phone':
                rules.push({
                test: (value) => !value || /^[\+]?[\d\s\-\(\)]+$/.test(value),
                message: 'Please enter a valid phone number'
                });
                break;
            case 'name':
                rules.push({
                test: (value) => !value || /^[a-zA-Z\s]+$/.test(value),
                message: 'Please enter only letters and spaces'
                });
                break;
            case 'strong-password':
                rules.push({
                test: (value) => !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
                message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
                });
                break;
            }
        }
    
        return rules.length > 0 ? rules : null;
        }
    
        validateField(input, validator) {
        const value = input.value;
        const errors = [];
    
        validator.forEach(rule => {
            if (!rule.test(value)) {
            errors.push(rule.message);
            }
        });
    
        this.displayFieldErrors(input, errors);
        input.classList.add('was-validated');
        
        return errors.length === 0;
        }
    
        displayFieldErrors(input, errors) {
        // Remove existing error messages
        const existingError = input.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    
        input.classList.remove('is-valid', 'is-invalid');
    
        if (errors.length > 0) {
            input.classList.add('is-invalid');
            input.setAttribute('aria-invalid', 'true');
    
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errors[0]; // Show first error
            errorElement.id = `${input.id || input.name}-error`;
            input.setAttribute('aria-describedby', errorElement.id);
    
            input.parentElement.appendChild(errorElement);
        } else {
            input.classList.add('is-valid');
            input.setAttribute('aria-invalid', 'false');
            input.removeAttribute('aria-describedby');
        }
        }
    
        validateForm(enhancement, event) {
        const { form, validators } = enhancement;
        let isValid = true;
    
        validators.forEach((validator, input) => {
            const fieldValid = this.validateField(input, validator);
            if (!fieldValid) {
            isValid = false;
            }
        });
    
        enhancement.isValid = isValid;
    
        if (!isValid) {
            event.preventDefault();
            
            // Focus first invalid field
            const firstInvalid = utils.$('.is-invalid', form);
            if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
    
            // Show form error summary
            this.showFormErrors(form);
        }
        }
    
        showFormErrors(form) {
        const errorSummary = utils.$('.form-error-summary', form);
        if (!errorSummary) {
            const summary = document.createElement('div');
            summary.className = 'form-error-summary';
            summary.innerHTML = `
            <h3>Please fix the following errors:</h3>
            <ul class="form-error-list"></ul>
            `;
            form.insertBefore(summary, form.firstChild);
        }
    
        const errorList = utils.$('.form-error-list', form);
        const errors = utils.$$('.field-error', form);
        
        errorList.innerHTML = errors.map(error => `<li>${error.textContent}</li>`).join('');
        }
    
        setupSubmission(enhancement) {
        const { form } = enhancement;
        
        form.addEventListener('submit', async (e) => {
            if (!enhancement.isValid) return;
    
            const submitButton = utils.$('[type="submit"]', form);
            const originalText = submitButton ? submitButton.textContent : '';
    
            try {
            // Show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                submitButton.classList.add('btn--loading');
            }
    
            // Handle form submission based on action
            if (form.action && !form.action.startsWith('#')) {
                // Let browser handle normal submission
                return;
            }
    
            // Handle AJAX submission
            e.preventDefault();
            await this.submitFormAjax(form);
            
            this.showSuccessMessage(form);
            form.reset();
            
            // Clear validation states
            const validatedInputs = utils.$$('.was-validated', form);
            validatedInputs.forEach(input => {
                input.classList.remove('was-validated', 'is-valid', 'is-invalid');
            });
            
            } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(form, error.message);
            } finally {
            // Restore button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.classList.remove('btn--loading');
            }
            }
        });
        }
    
        async submitFormAjax(form) {
        const formData = new FormData(form);
        const endpoint = form.dataset.endpoint || '/api/contact';
    
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
            'X-Requested-With': 'XMLHttpRequest'
            }
        });
    
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
    
        return response.json();
        }
    
        showSuccessMessage(form) {
        this.removeMessage(form);
        
        const message = document.createElement('div');
        message.className = 'form-message form-message--success';
        message.innerHTML = `
            <div class="form-message__icon">✓</div>
            <div class="form-message__text">Thank you! Your message has been sent successfully.</div>
        `;
        message.setAttribute('role', 'status');
        message.setAttribute('aria-live', 'polite');
    
        form.parentElement.insertBefore(message, form);
        
        setTimeout(() => {
            if (message.parentElement) {
            message.remove();
            }
        }, 5000);
        }
    
        showErrorMessage(form, errorText) {
        this.removeMessage(form);
        
        const message = document.createElement('div');
        message.className = 'form-message form-message--error';
        message.innerHTML = `
            <div class="form-message__icon">⚠</div>
            <div class="form-message__text">Error: ${errorText}</div>
        `;
        message.setAttribute('role', 'alert');
        message.setAttribute('aria-live', 'assertive');
    
        form.parentElement.insertBefore(message, form);
        
        setTimeout(() => {
            if (message.parentElement) {
            message.remove();
            }
        }, 5000);
        }
    
        removeMessage(form) {
        const existingMessage = form.parentElement.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        }
    
        setupAccessibility(enhancement) {
        const { form } = enhancement;
        
        // Ensure all inputs have labels
        const inputs = utils.$$('input, textarea, select', form);
        if (inputs && inputs.length > 0) {
            inputs.forEach(input => {
            if (!input.id) {
                input.id = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }
    
            let label = utils.$(`label[for="${input.id}"]`, form);
            if (!label) {
                label = input.closest('label');
            }
    
            if (!label && !input.getAttribute('aria-label')) {
                console.warn('Input without label:', input);
            }
            });
        }
        }
    
        // Public method to validate form programmatically
        validateFormById(formId) {
        const form = utils.$(`#${formId}`);
        if (form) {
            const enhancement = this.forms.find(f => f.form === form);
            if (enhancement) {
            this.validateForm(enhancement, { preventDefault: () => {} });
            return enhancement.isValid;
            }
        }
        return false;
        }
    }

    // =========================================================================
    // Simple Performance Monitor
    // =========================================================================
    class PerformanceMonitor {
        constructor() {
        this.isEnabled = this.shouldEnable();
        this.metrics = {};
        
        if (this.isEnabled) {
            this.init();
        }
        }
    
        shouldEnable() {
        // Enable in development or when debug flag is set
        return (
            window.location.hostname === 'localhost' ||
            window.location.search.includes('debug=true') ||
            window.location.search.includes('perf=true')
        );
        }
    
        init() {
        this.observePageLoad();
        this.observeCoreWebVitals();
        }
    
        observePageLoad() {
        window.addEventListener('load', () => {
            // Use setTimeout to ensure all metrics are available
            setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.metrics.pageLoad = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcp: navigation.connectEnd - navigation.connectStart,
                request: navigation.responseStart - navigation.requestStart,
                response: navigation.responseEnd - navigation.responseStart,
                domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                totalLoad: navigation.loadEventEnd - navigation.fetchStart
                };
                
                this.logMetrics('Page Load', this.metrics.pageLoad);
            }
            }, 0);
        });
        }
    
        observeCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                this.checkCoreWebVitals();
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
            console.warn('LCP observation not supported:', e);
            }
    
            // First Input Delay (FID)
            try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.checkCoreWebVitals();
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
            console.warn('FID observation not supported:', e);
            }
    
            // Cumulative Layout Shift (CLS)
            try {
            let clsValue = 0;
            
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
                });
                this.metrics.cls = clsValue;
                this.checkCoreWebVitals();
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
            console.warn('CLS observation not supported:', e);
            }
        }
        }
    
        checkCoreWebVitals() {
        const { lcp, fid, cls } = this.metrics;
        
        if (lcp !== undefined && fid !== undefined && cls !== undefined) {
            const vitals = {
            LCP: { value: lcp, threshold: 2500, unit: 'ms' },
            FID: { value: fid, threshold: 100, unit: 'ms' },
            CLS: { value: cls, threshold: 0.1, unit: '' }
            };
    
            console.group('🎯 Core Web Vitals');
            Object.entries(vitals).forEach(([metric, data]) => {
            const status = data.value <= data.threshold ? '✅' : '❌';
            const value = metric === 'CLS' ? data.value.toFixed(3) : Math.round(data.value);
            console.log(`${status} ${metric}: ${value}${data.unit} (threshold: ${data.threshold}${data.unit})`);
            });
            console.groupEnd();
        }
        }
    
        logMetrics(category, metrics) {
        if (!this.isEnabled) return;
    
        console.group(`⚡ ${category} Metrics`);
        Object.entries(metrics).forEach(([key, value]) => {
            const formattedValue = typeof value === 'number' ? `${Math.round(value)}ms` : value;
            console.log(`${key}: ${formattedValue}`);
        });
        console.groupEnd();
        }
    
        // Public method to get current metrics
        getMetrics() {
        return { ...this.metrics };
        }
    }
    
    // =========================================================================
    // Simple Error Handler
    // =========================================================================
    class ErrorHandler {
        constructor() {
        this.errorCount = 0;
        this.maxErrors = 10;
        this.reportedErrors = new Set();
        this.init();
        }
    
        init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        }
    
        handleError(event) {
        this.errorCount++;
        
        const errorInfo = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error ? event.error.stack : null,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
    
        this.reportError('JavaScript Error', errorInfo);
        }
    
        handlePromiseRejection(event) {
        this.errorCount++;
        
        const errorInfo = {
            reason: event.reason,
            stack: event.reason ? event.reason.stack : null,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
    
        this.reportError('Unhandled Promise Rejection', errorInfo);
        event.preventDefault(); // Prevent console logging
        }
    
        reportError(type, errorInfo) {
        // Prevent duplicate error reporting
        const errorKey = `${type}:${errorInfo.message || errorInfo.reason}`;
        if (this.reportedErrors.has(errorKey)) {
            return;
        }
        this.reportedErrors.add(errorKey);
    
        // Console logging
        console.group(`🚨 ${type}`);
        console.error(errorInfo);
        console.groupEnd();
    
        // Rate limiting
        if (this.errorCount > this.maxErrors) {
            console.warn('Error reporting rate limit exceeded');
            return;
        }
        }
    }
    
    // =========================================================================
    // Main Application Initializer
    // =========================================================================
    class WeaveStudioApp {
        constructor() {
        this.components = new Map();
        this.isInitialized = false;
        this.init();
        }
    
        init() {
        if (this.isInitialized) return;
        
        // Initialize core components only
        this.components.set('theme', new ThemeManager());
        this.components.set('navigation', new MobileNavigation());
        this.components.set('scroll', new SmoothScroll());
        this.components.set('language', new LanguageManager());
        this.components.set('accessibility', new AccessibilityManager());
        this.components.set('search', new SearchManager());
        this.components.set('intersection', new IntersectionManager());
        this.components.set('forms', new FormManager());
        this.components.set('performance', new PerformanceMonitor());
        this.components.set('errors', new ErrorHandler());
    
        // Set up global event listeners
        this.setupGlobalEvents();
        
        // Mark as initialized
        this.isInitialized = true;
        document.documentElement.classList.add('js-loaded');
        
        console.log('🚀 Weave Studio Template - JavaScript initialized');
        
        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('weave:ready', {
            detail: { components: Array.from(this.components.keys()) }
        }));
        }
    
        setupGlobalEvents() {
        // Handle window resize
        window.addEventListener('resize', utils.throttle(() => {
            window.dispatchEvent(new CustomEvent('weave:resize', {
            detail: { 
                width: window.innerWidth, 
                height: window.innerHeight 
            }
            }));
        }, 250));
    
        // Handle scroll
        window.addEventListener('scroll', utils.throttle(() => {
            window.dispatchEvent(new CustomEvent('weave:scroll', {
            detail: { 
                scrollY: window.pageYOffset,
                scrollPercent: (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            }
            }));
        }, 100));
    
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.components.get('accessibility').announce('Connection restored');
            document.documentElement.classList.remove('is-offline');
        });
    
        window.addEventListener('offline', () => {
            this.components.get('accessibility').announce('Connection lost');
            document.documentElement.classList.add('is-offline');
        });
        }
    
        // Public methods to access components
        getComponent(name) {
        return this.components.get(name);
        }
    
        // Cleanup method for SPA navigation
        destroy() {
        this.components.forEach(component => {
            if (component.destroy) {
            component.destroy();
            }
        });
        this.components.clear();
        this.isInitialized = false;
        }
    }
    
    // =========================================================================
    // Initialize Application
    // =========================================================================
    
    // Initialize when DOM is ready
    utils.ready(() => {
        // Create global app instance
        window.WeaveStudio = new WeaveStudioApp();
        
        // Expose utilities for debugging
        if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
        window.WeaveUtils = utils;
        window.WeaveConstants = CONSTANTS;
        }
    });
    
    // Export for module usage (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { WeaveStudioApp, utils, CONSTANTS };
    }
    
    })();