(function() {
    'use strict';
  
    // DOM ready utility
    function ready(fn) {
      if (document.readyState !== 'loading') {
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    }
  
    // Theme management
    class ThemeManager {
      constructor() {
        this.init();
      }
  
      init() {
        this.toggleButton = document.querySelector('[data-theme-toggle]');
        if (this.toggleButton) {
          this.toggleButton.addEventListener('click', this.toggle.bind(this));
          this.updateToggleState();
        }
  
        // Listen for system theme changes
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
              this.setTheme(e.matches ? 'dark' : 'light');
            }
          });
        }
      }
  
      toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }
  
      setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleState();
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { 
          detail: { theme } 
        }));
      }
  
      updateToggleState() {
        if (!this.toggleButton) return;
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        this.toggleButton.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
      }
    }
  
    // Mobile navigation management
    class MobileNavigation {
      constructor() {
        this.init();
      }
  
      init() {
        this.toggleButton = document.querySelector('.mobile-menu-toggle');
        this.navigation = document.querySelector('.main-navigation');
        
        if (this.toggleButton && this.navigation) {
          this.toggleButton.addEventListener('click', this.toggle.bind(this));
          this.setupCloseOnOutsideClick();
          this.setupCloseOnEscape();
        }
      }
  
      toggle() {
        const isOpen = this.toggleButton.getAttribute('aria-expanded') === 'true';
        this.toggleButton.setAttribute('aria-expanded', !isOpen);
        this.navigation.classList.toggle('is-open', !isOpen);
        
        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = !isOpen ? 'hidden' : '';
      }
  
      close() {
        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.navigation.classList.remove('is-open');
        document.body.style.overflow = '';
      }
  
      setupCloseOnOutsideClick() {
        document.addEventListener('click', (e) => {
          if (!this.navigation.contains(e.target) && !this.toggleButton.contains(e.target)) {
            this.close();
          }
        });
      }
  
      setupCloseOnEscape() {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.navigation.classList.contains('is-open')) {
            this.close();
            this.toggleButton.focus();
          }
        });
      }
    }
  
    // Smooth scrolling for anchor links
    class SmoothScroll {
      constructor() {
        this.init();
      }
  
      init() {
        document.addEventListener('click', (e) => {
          const link = e.target.closest('a[href^="#"]');
          if (link && link.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
              const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
              const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
              
              // Update focus for accessibility
              target.focus({ preventScroll: true });
            }
          }
        });
      }
    }
  
    // Accessibility enhancements
    class AccessibilityManager {
      constructor() {
        this.init();
      }
  
      init() {
        this.setupFocusManagement();
        this.setupSkipLinks();
        this.setupReducedMotion();
      }
  
      setupFocusManagement() {
        // Add focus-visible polyfill behavior
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
          }
        });
  
        document.addEventListener('mousedown', () => {
          document.body.classList.remove('keyboard-navigation');
        });
      }
  
      setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      }
  
      setupReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          document.documentElement.style.scrollBehavior = 'auto';
        }
      }
    }
  
    // Performance monitoring (simplified version)
    class PerformanceMonitor {
      constructor() {
        this.init();
      }
  
      init() {
        // Only run in development or when explicitly enabled
        if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
          this.observePerformance();
        }
      }
  
      observePerformance() {
        // Monitor loading performance
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
              console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart);
            }
          }, 0);
        });
      }
    }
  
    // Error handling
    class ErrorHandler {
      constructor() {
        this.init();
      }
  
      init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
      }
  
      handleError(event) {
        console.error('JavaScript Error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      }
  
      handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        event.preventDefault();
      }
    }
  
    // Initialize all components when DOM is ready
    ready(() => {
      // Core functionality
      new ThemeManager();
      new MobileNavigation();
      new SmoothScroll();
      new AccessibilityManager();
      
      // Enhancement features
      new PerformanceMonitor();
      new ErrorHandler();
      
      // Signal that JavaScript has loaded
      document.documentElement.classList.add('js-loaded');
      
      console.log('Weave Studio Template - JavaScript initialized');
    });
  
  })();