// Simple FAQ Accordion
(function() {
    'use strict';

    function initFAQ() {
        const toggles = document.querySelectorAll('[data-faq-toggle]');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                const faqItem = this.closest('[data-faq-item]');
                const content = faqItem.querySelector('[data-faq-content]');
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                // Toggle ARIA attributes
                this.setAttribute('aria-expanded', !isExpanded);
                content.setAttribute('aria-hidden', isExpanded);
                
                // Toggle content height
                if (isExpanded) {
                    content.style.maxHeight = '0px';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFAQ);
    } else {
        initFAQ();
    }
})();