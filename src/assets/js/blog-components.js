/**
 * Blog Preview Component JavaScript
 * Handles lazy loading, interaction tracking, and enhanced UX
 */

(function() {
    'use strict';

    // Constants
    const CONSTANTS = {
        SELECTORS: {
            blogSection: '.blog-preview-section',
            blogCards: '.blog-preview-card',
            blogImages: '.blog-preview-card__image img',
            blogOverlays: '.blog-preview-card__overlay-link',
            blogCTA: '.blog-preview-cta__actions a'
        },
        CLASSES: {
            loaded: 'is-loaded',
            visible: 'is-visible',
            error: 'has-error'
        },
        ANIMATION_DELAY: 100,
        INTERSECTION_THRESHOLD: 0.1
    };

    /**
     * Blog Preview Manager
     */
    class BlogPreview {
        constructor() {
            this.blogSection = document.querySelector(CONSTANTS.SELECTORS.blogSection);
            if (!this.blogSection) return;

            this.blogCards = document.querySelectorAll(CONSTANTS.SELECTORS.blogCards);
            this.images = document.querySelectorAll(CONSTANTS.SELECTORS.blogImages);
            
            this.init();
        }

        init() {
            this.setupIntersectionObserver();
            this.setupLazyLoading();
            this.setupInteractionTracking();
            this.setupEnhancedHovers();
            this.setupKeyboardNavigation();
            this.setupErrorHandling();
        }

        /**
         * Intersection Observer for scroll animations
         */
        setupIntersectionObserver() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                this.blogCards.forEach(card => {
                    card.classList.add(CONSTANTS.CLASSES.visible);
                });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add(CONSTANTS.CLASSES.visible);
                        }, index * CONSTANTS.ANIMATION_DELAY);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: CONSTANTS.INTERSECTION_THRESHOLD,
                rootMargin: '50px 0px'
            });

            this.blogCards.forEach(card => {
                observer.observe(card);
            });
        }

        /**
         * Lazy loading for blog images
         */
        setupLazyLoading() {
            if (!('IntersectionObserver' in window)) {
                // Load all images immediately for older browsers
                this.images.forEach(img => {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                });
                return;
            }

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '100px 0px'
            });

            this.images.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                } else {
                    img.classList.add(CONSTANTS.CLASSES.loaded);
                }
            });
        }

        /**
         * Load individual image with error handling
         */
        loadImage(img) {
            const src = img.dataset.src || img.src;
            if (!src) return;

            const tempImg = new Image();
            
            tempImg.onload = () => {
                img.src = src;
                img.classList.add(CONSTANTS.CLASSES.loaded);
                
                // Remove data-src after successful load
                if (img.dataset.src) {
                    delete img.dataset.src;
                }
            };
            
            tempImg.onerror = () => {
                img.classList.add(CONSTANTS.CLASSES.error);
                // Set fallback placeholder
                img.alt = 'Image failed to load';
                console.warn('Failed to load blog image:', src);
            };
            
            tempImg.src = src;
        }

        /**
         * Track user interactions for analytics
         */
        setupInteractionTracking() {
            // Track blog card clicks
            this.blogCards.forEach((card, index) => {
                const link = card.querySelector('a[href]');
                if (!link) return;

                link.addEventListener('click', (e) => {
                    this.trackEvent('blog_card_click', {
                        position: index + 1,
                        title: this.getCardTitle(card),
                        url: link.href
                    });
                });
            });

            // Track CTA clicks
            const ctaButtons = document.querySelectorAll(CONSTANTS.SELECTORS.blogCTA);
            ctaButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    this.trackEvent('blog_cta_click', {
                        text: button.textContent.trim(),
                        url: button.href
                    });
                });
            });

            // Track section visibility
            this.trackSectionVisibility();
        }

        /**
         * Enhanced hover effects with performance optimization
         */
        setupEnhancedHovers() {
            this.blogCards.forEach(card => {
                let hoverTimeout;
                
                const handleMouseEnter = () => {
                    clearTimeout(hoverTimeout);
                    card.style.willChange = 'transform';
                    
                    // Track hover for engagement metrics
                    this.trackEvent('blog_card_hover', {
                        title: this.getCardTitle(card)
                    });
                };
                
                const handleMouseLeave = () => {
                    hoverTimeout = setTimeout(() => {
                        card.style.willChange = 'auto';
                    }, 500);
                };

                card.addEventListener('mouseenter', handleMouseEnter);
                card.addEventListener('mouseleave', handleMouseLeave);

                // Touch device support
                card.addEventListener('touchstart', handleMouseEnter, { passive: true });
            });
        }

        /**
         * Enhanced keyboard navigation
         */
        setupKeyboardNavigation() {
            this.blogCards.forEach((card, index) => {
                const links = card.querySelectorAll('a');
                
                links.forEach(link => {
                    link.addEventListener('keydown', (e) => {
                        switch(e.key) {
                            case 'Enter':
                            case ' ':
                                if (e.key === ' ') {
                                    e.preventDefault();
                                }
                                this.trackEvent('blog_keyboard_activation', {
                                    position: index + 1,
                                    key: e.key
                                });
                                break;
                                
                            case 'ArrowRight':
                            case 'ArrowDown':
                                e.preventDefault();
                                this.focusNextCard(index);
                                break;
                                
                            case 'ArrowLeft':
                            case 'ArrowUp':
                                e.preventDefault();
                                this.focusPreviousCard(index);
                                break;
                        }
                    });
                });
            });
        }

        /**
         * Error handling and recovery
         */
        setupErrorHandling() {
            // Global error handler for blog section
            window.addEventListener('error', (e) => {
                if (e.target && e.target.closest && e.target.closest(CONSTANTS.SELECTORS.blogSection)) {
                    console.warn('Blog section error:', e);
                    this.handleBlogError(e.target);
                }
            });

            // Handle broken images
            this.images.forEach(img => {
                img.addEventListener('error', () => {
                    this.handleImageError(img);
                });
            });
        }

        /**
         * Focus navigation helpers
         */
        focusNextCard(currentIndex) {
            const nextIndex = (currentIndex + 1) % this.blogCards.length;
            const nextCard = this.blogCards[nextIndex];
            const nextLink = nextCard.querySelector('a');
            if (nextLink) {
                nextLink.focus();
            }
        }

        focusPreviousCard(currentIndex) {
            const prevIndex = currentIndex === 0 ? this.blogCards.length - 1 : currentIndex - 1;
            const prevCard = this.blogCards[prevIndex];
            const prevLink = prevCard.querySelector('a');
            if (prevLink) {
                prevLink.focus();
            }
        }

        /**
         * Track section visibility for engagement metrics
         */
        trackSectionVisibility() {
            if (!('IntersectionObserver' in window)) return;

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackEvent('blog_section_view', {
                            visibility_ratio: entry.intersectionRatio
                        });
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            sectionObserver.observe(this.blogSection);
        }

        /**
         * Error handling methods
         */
        handleImageError(img) {
            const card = img.closest('.blog-preview-card');
            if (card) {
                card.classList.add('has-image-error');
                
                // Replace with placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'blog-preview-card__placeholder';
                placeholder.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                `;
                
                img.parentNode.replaceChild(placeholder, img);
            }
        }

        handleBlogError(element) {
            console.warn('Blog component error detected, attempting recovery');
            
            // Add error state class
            if (element.closest) {
                const container = element.closest('.blog-preview-card') || element.closest('.blog-preview-section');
                if (container) {
                    container.classList.add('has-error');
                }
            }
        }

        /**
         * Helper methods
         */
        getCardTitle(card) {
            const titleElement = card.querySelector('.blog-preview-card__title a');
            return titleElement ? titleElement.textContent.trim() : 'Unknown';
        }

        trackEvent(eventName, data = {}) {
            // Analytics tracking - adapt to your analytics provider
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'Blog Preview',
                    ...data
                });
            } else if (typeof ga !== 'undefined') {
                ga('send', 'event', 'Blog Preview', eventName, data);
            }
            
            // Console logging for development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log(`Blog Event: ${eventName}`, data);
            }
        }
    }

    /**
     * Blog Reading Time Estimator
     */
    class ReadingTimeEstimator {
        constructor() {
            this.wordsPerMinute = 200;
            this.init();
        }

        init() {
            // Update reading times if they're dynamically calculated
            const readingTimeElements = document.querySelectorAll('[data-reading-time]');
            readingTimeElements.forEach(element => {
                this.updateReadingTime(element);
            });
        }

        updateReadingTime(element) {
            const contentSelector = element.dataset.readingTime;
            const contentElement = document.querySelector(contentSelector);
            
            if (contentElement) {
                const wordCount = this.countWords(contentElement.textContent);
                const minutes = Math.ceil(wordCount / this.wordsPerMinute);
                element.textContent = `${minutes} min read`;
            }
        }

        countWords(text) {
            return text.trim().split(/\s+/).length;
        }
    }

    /**
     * Blog Search Enhancement (if search is added later)
     */
    class BlogSearchEnhancer {
        constructor() {
            this.searchInput = document.querySelector('.blog-search-input');
            if (this.searchInput) {
                this.init();
            }
        }

        init() {
            this.setupSearchFiltering();
            this.setupSearchTracking();
        }

        setupSearchFiltering() {
            let searchTimeout;
            
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterBlogCards(e.target.value);
                }, 300);
            });
        }

        setupSearchTracking() {
            this.searchInput.addEventListener('search', (e) => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'blog_search', {
                        search_term: e.target.value,
                        event_category: 'Blog'
                    });
                }
            });
        }

        filterBlogCards(searchTerm) {
            const cards = document.querySelectorAll(CONSTANTS.SELECTORS.blogCards);
            const term = searchTerm.toLowerCase();
            
            cards.forEach(card => {
                const title = card.querySelector('.blog-preview-card__title')?.textContent.toLowerCase() || '';
                const excerpt = card.querySelector('.blog-preview-card__excerpt')?.textContent.toLowerCase() || '';
                
                const matches = title.includes(term) || excerpt.includes(term);
                card.style.display = matches ? 'block' : 'none';
            });
        }
    }

    /**
     * Initialize all blog components
     */
    function initializeBlogComponents() {
        // Initialize main blog preview functionality
        new BlogPreview();
        
        // Initialize reading time estimator
        new ReadingTimeEstimator();
        
        // Initialize search enhancement if needed
        new BlogSearchEnhancer();
        
        // Emit event for other scripts
        document.dispatchEvent(new CustomEvent('blogComponentsLoaded', {
            detail: { timestamp: Date.now() }
        }));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBlogComponents);
    } else {
        initializeBlogComponents();
    }

    // Export for potential external use
    window.WeaveStudio = window.WeaveStudio || {};
    window.WeaveStudio.BlogPreview = BlogPreview;

})();