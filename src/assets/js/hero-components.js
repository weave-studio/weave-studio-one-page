/**
 * Debounce utility (if not available from main.js)
 */
if (typeof utils === 'undefined' || !utils.debounce) {
  window.utils = window.utils || {};
  utils.debounce = function(func, wait, immediate) {
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
  };
}

/**
 * Enhanced Text Rotator Class
 * Handles bilingual text rotation with smooth animations and accessibility
 */
class TextRotator {
  constructor(element, options = {}) {
    this.element = element;
    this.items = [...element.querySelectorAll('.text-rotator__item')];
    this.currentIndex = 0;
    this.isAnimating = false;
    
    // Configuration
    this.config = {
      interval: options.interval || 2000,
      animationDuration: options.animationDuration || 500,
      pauseOnHover: options.pauseOnHover !== false,
      respectReducedMotion: options.respectReducedMotion !== false,
      loop: options.loop !== false,
      ...options
    };
    
    // Accessibility support
    this.ariaLive = element.getAttribute('aria-live') || 'polite';
    this.language = element.dataset.rotator || 'en';
    
    this.init();
  }
  
  init() {
    if (this.items.length <= 1) {
      console.warn('TextRotator: Need at least 2 items to rotate');
      return;
    }
    
    this.setupAccessibility();
    this.setupEventListeners();
    this.start();
  }
  
  setupAccessibility() {
    // Ensure proper ARIA attributes
    this.element.setAttribute('aria-live', this.ariaLive);
    this.element.setAttribute('role', 'text');
    
    // Add unique IDs if needed
    this.items.forEach((item, index) => {
      if (!item.id) {
        item.id = `rotator-${this.language}-item-${index}`;
      }
      
      // Set initial state
      if (index === 0) {
        item.classList.add('is-active');
        item.setAttribute('aria-current', 'true');
      } else {
        item.classList.remove('is-active');
        item.removeAttribute('aria-current');
      }
    });
  }
  
  setupEventListeners() {
    // Pause on hover
    if (this.config.pauseOnHover) {
      this.element.addEventListener('mouseenter', () => this.pause());
      this.element.addEventListener('mouseleave', () => this.resume());
    }
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
    
    // Handle language changes
    window.addEventListener('languageChanged', (e) => {
      if (e.detail.lang === this.language) {
        this.resume();
      } else {
        this.pause();
      }
    });
    
    // Handle reduced motion preference changes
    if ('matchMedia' in window) {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      reducedMotionQuery.addEventListener('change', () => {
        this.handleReducedMotion(reducedMotionQuery.matches);
      });
      
      // Check initial state
      this.handleReducedMotion(reducedMotionQuery.matches);
    }
  }
  
  handleReducedMotion(isReduced) {
    if (isReduced && this.config.respectReducedMotion) {
      this.pause();
      // Show all items for users who prefer reduced motion
      this.items.forEach(item => {
        item.style.opacity = '0.7';
        item.style.position = 'static';
      });
      this.items[this.currentIndex].style.opacity = '1';
    } else {
      this.resume();
      // Reset to normal rotation
      this.items.forEach((item, index) => {
        item.style.opacity = '';
        item.style.position = index === this.currentIndex ? 'static' : 'absolute';
      });
    }
  }
  
  start() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    this.interval = setInterval(() => {
      this.next();
    }, this.config.interval);
  }
  
  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  resume() {
    if (!this.interval) {
      this.start();
    }
  }
  
  next() {
    if (this.isAnimating) return;
    
    const nextIndex = this.currentIndex + 1 >= this.items.length ? 0 : this.currentIndex + 1;
    this.goToIndex(nextIndex);
  }
  
  previous() {
    if (this.isAnimating) return;
    
    const prevIndex = this.currentIndex - 1 < 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.goToIndex(prevIndex);
  }
  
  goToIndex(index) {
    if (index === this.currentIndex || this.isAnimating || index >= this.items.length) {
      return;
    }
    
    this.isAnimating = true;
    
    const currentItem = this.items[this.currentIndex];
    const nextItem = this.items[index];
    
    // Start exit animation for current item
    currentItem.classList.add('is-leaving');
    currentItem.classList.remove('is-active');
    currentItem.removeAttribute('aria-current');
    
    // Wait for exit animation, then start enter animation
    setTimeout(() => {
      currentItem.classList.remove('is-leaving');
      
      // Start enter animation for next item
      nextItem.classList.add('is-active');
      nextItem.setAttribute('aria-current', 'true');
      
      // Update current index
      this.currentIndex = index;
      
      // Announce change to screen readers (throttled)
      this.announceChange(nextItem.textContent);
      
      // Reset animation flag
      setTimeout(() => {
        this.isAnimating = false;
      }, this.config.animationDuration);
      
    }, this.config.animationDuration / 2);
  }
  
  announceChange(text) {
    // Throttled announcement for screen readers
    if (this.announceTimeout) {
      clearTimeout(this.announceTimeout);
    }
    
    this.announceTimeout = setTimeout(() => {
      // Create a temporary element for announcement
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = text;
      
      document.body.appendChild(announcement);
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }, 500);
  }
  
  // Public API methods
  getCurrentIndex() {
    return this.currentIndex;
  }
  
  getCurrentItem() {
    return this.items[this.currentIndex];
  }
  
  getItems() {
    return [...this.items];
  }
  
  destroy() {
    this.pause();
    
    // Remove event listeners
    if (this.config.pauseOnHover) {
      this.element.removeEventListener('mouseenter', () => this.pause());
      this.element.removeEventListener('mouseleave', () => this.resume());
    }
    
    // Clear timeouts
    if (this.announceTimeout) {
      clearTimeout(this.announceTimeout);
    }
    
    // Reset elements
    this.items.forEach(item => {
      item.classList.remove('is-active', 'is-leaving');
      item.removeAttribute('aria-current');
      item.style.opacity = '';
      item.style.position = '';
    });
  }
}

/**
 * Text Rotator Manager
 * Handles multiple rotators and language switching
 */
class TextRotatorManager {
  constructor() {
    this.rotators = new Map();
    this.currentLanguage = document.documentElement.lang || 'en';
    this.init();
  }
  
  init() {
    this.findAndInitializeRotators();
    this.setupLanguageListener();
  }
  
  findAndInitializeRotators() {
    const rotatorElements = document.querySelectorAll('.text-rotator');
    
    rotatorElements.forEach(element => {
      const language = element.dataset.rotator || 'en';
      const rotatorId = `${language}-${Array.from(rotatorElements).indexOf(element)}`;
      
      // Initialize rotator
      const rotator = new TextRotator(element, {
        interval: 3500, // Slightly slower for readability
        animationDuration: 500,
        pauseOnHover: true,
        respectReducedMotion: true
      });
      
      this.rotators.set(rotatorId, {
        rotator,
        element,
        language
      });
      
      // Pause if not current language
      if (language !== this.currentLanguage) {
        rotator.pause();
      }
    });
  }
  
  setupLanguageListener() {
    window.addEventListener('languageChanged', (e) => {
      this.handleLanguageChange(e.detail.lang);
    });
    
    // Also listen for body class changes (fallback)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const bodyClasses = document.body.className;
          if (bodyClasses.includes('lang-he')) {
            this.handleLanguageChange('he');
          } else if (bodyClasses.includes('lang-en')) {
            this.handleLanguageChange('en');
          }
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  handleLanguageChange(newLanguage) {
    if (newLanguage === this.currentLanguage) return;
    
    this.currentLanguage = newLanguage;
    
    // Pause all rotators, then resume only the ones matching current language
    this.rotators.forEach(({ rotator, language }) => {
      if (language === newLanguage) {
        rotator.resume();
      } else {
        rotator.pause();
      }
    });
  }
  
  // Public API
  getRotator(language) {
    for (const [id, data] of this.rotators) {
      if (data.language === language) {
        return data.rotator;
      }
    }
    return null;
  }
  
  pauseAll() {
    this.rotators.forEach(({ rotator }) => rotator.pause());
  }
  
  resumeAll() {
    this.rotators.forEach(({ rotator }) => rotator.resume());
  }
  
  destroy() {
    this.rotators.forEach(({ rotator }) => rotator.destroy());
    this.rotators.clear();
  }
}

/**
 * Enhanced Scroll Indicator Handler
 * Handles smooth scrolling with offset for fixed headers
 */
class ScrollIndicatorHandler {
  constructor() {
    this.indicators = [];
    this.headerHeight = 0;
    this.init();
  }
  
  init() {
    this.updateHeaderHeight();
    this.setupScrollIndicators();
    this.setupResizeHandler();
  }
  
  updateHeaderHeight() {
    const header = document.querySelector('.site-header, header');
    this.headerHeight = header ? header.offsetHeight : 0;
  }
  
  setupScrollIndicators() {
    const indicators = document.querySelectorAll('[data-scroll-to]');
    
    indicators.forEach(indicator => {
      const targetId = indicator.dataset.scrollTo;
      const target = document.getElementById(targetId);
      
      if (target) {
        indicator.addEventListener('click', (e) => {
          e.preventDefault();
          this.scrollToTarget(target, indicator);
        });
        
        // Add keyboard support
        indicator.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.scrollToTarget(target, indicator);
          }
        });
        
        this.indicators.push({ indicator, target });
      }
    });
  }
  
  setupResizeHandler() {
    const resizeHandler = utils.debounce(() => {
      this.updateHeaderHeight();
    }, 250);
    
    window.addEventListener('resize', resizeHandler);
  }
  
  scrollToTarget(target, trigger) {
    const targetPosition = target.getBoundingClientRect().top + 
                          window.pageYOffset - 
                          this.headerHeight - 20;
    
    // Use smooth scrolling
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    // Update focus for accessibility
    setTimeout(() => {
      target.focus({ preventScroll: true });
      
      // Update URL hash if appropriate
      if (target.id && trigger.dataset.updateHash !== 'false') {
        history.replaceState(null, null, `#${target.id}`);
      }
    }, 500);
  }
}

/**
 * Initialize Hero Components
 * Main initialization function for Phase B2
 */
function initializeHeroComponents() {
  // Check if we're on a page with hero
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  console.log('🎯 Initializing Hero Components...');
  
  // Initialize text rotators
  if (window.textRotatorManager) {
    window.textRotatorManager.destroy();
  }
  window.textRotatorManager = new TextRotatorManager();
  
  // Initialize scroll indicators
  if (window.scrollIndicatorHandler) {
    // No destroy method needed, just replace
  }
  window.scrollIndicatorHandler = new ScrollIndicatorHandler();
  
  // Add page loaded class for CSS animations
  setTimeout(() => {
    document.documentElement.classList.add('page-loaded');
  }, 100);
  
  console.log('✅ Hero Components initialized');
}

/**
 * Cleanup function for SPA navigation
 */
function cleanupHeroComponents() {
  if (window.textRotatorManager) {
    window.textRotatorManager.destroy();
    window.textRotatorManager = null;
  }
  
  // Remove page loaded class
  document.documentElement.classList.remove('page-loaded');
}

// ==========================================================================
// Integration with Existing Main JavaScript
// ==========================================================================

// Add to existing WeaveStudioApp class or integrate directly
if (typeof WeaveStudioApp !== 'undefined') {
  // Extend existing app
  const originalInit = WeaveStudioApp.prototype.init;
  WeaveStudioApp.prototype.init = function() {
    originalInit.call(this);
    
    // Add hero components
    this.components.set('textRotator', {
      init: initializeHeroComponents,
      destroy: cleanupHeroComponents
    });
    
    // Initialize if we're on homepage
    if (document.querySelector('.hero')) {
      initializeHeroComponents();
    }
  };
} else {
  // Standalone initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeroComponents);
  } else {
    initializeHeroComponents();
  }
}

// ==========================================================================
// Utility Functions for Hero Components
// ==========================================================================

/**
 * Performance monitoring for hero section
 */
function monitorHeroPerformance() {
  if (!window.location.hostname.includes('localhost') && !window.location.search.includes('debug=true')) {
    return;
  }
  
  // Monitor text rotator performance
  const textRotators = document.querySelectorAll('.text-rotator');
  if (textRotators.length > 0) {
    console.log(`📊 Text Rotators initialized: ${textRotators.length}`);
    
    // Monitor animation frame rate
    let lastTime = performance.now();
    let frameCount = 0;
    
    function checkFrameRate() {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        if (fps < 50) {
          console.warn(`⚠️ Low FPS detected in hero animations: ${fps}fps`);
        } else {
          console.log(`✅ Hero animations running smoothly: ${fps}fps`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkFrameRate);
    }
    
    // Monitor for 5 seconds
    requestAnimationFrame(checkFrameRate);
    setTimeout(() => {
      // Stop monitoring
    }, 5000);
  }
}

// Initialize performance monitoring
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(monitorHeroPerformance, 1000);
  });
} else {
  setTimeout(monitorHeroPerformance, 1000);
}

// Export for testing/debugging
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TextRotator,
    TextRotatorManager,
    ScrollIndicatorHandler,
    initializeHeroComponents,
    cleanupHeroComponents
  };
}
