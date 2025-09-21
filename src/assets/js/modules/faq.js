/**
 * FAQ Accordion Module
 * Progressive enhancement for interactive FAQ accordion
 * WCAG 2.1 AA compliant with full keyboard and screen reader support
 */

export function initFAQ() {
  const faqSection = document.querySelector('.faq-section');
  if (!faqSection) {
    return;
  }

  const faqItems = faqSection.querySelectorAll('.faq-item');

  // Early return if no FAQ items found
  if (!faqItems.length) {
    return;
  }

  // Initialize each FAQ item
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    // Set up ARIA attributes
    setupAriaAttributes(question, answer, index);

    // Add event listeners
    setupEventListeners(question, answer, item);

    // Set initial state
    setInitialState(answer);
  });

  // Set up keyboard navigation between FAQ items
  setupKeyboardNavigation(faqItems);
}

/**
 * Set up ARIA attributes for accessibility
 */
function setupAriaAttributes(question, answer, index) {
  const answerId = `faq-answer-${index + 1}`;
  const questionId = `faq-question-${index + 1}`;

  // Question button attributes
  question.setAttribute('aria-expanded', 'false');
  question.setAttribute('aria-controls', answerId);
  question.setAttribute('id', questionId);

  // Answer attributes
  answer.setAttribute('id', answerId);
  answer.setAttribute('aria-labelledby', questionId);
  answer.setAttribute('aria-hidden', 'true');
}

/**
 * Set up event listeners for interactions
 */
function setupEventListeners(question, answer, item) {
  // Click event
  question.addEventListener('click', (event) => {
    event.preventDefault();
    toggleFAQ(question, answer);
  });

  // Touch events for mobile
  question.addEventListener('touchstart', (event) => {
    // Prevent default to avoid click event
    event.preventDefault();
    toggleFAQ(question, answer);
  }, { passive: false });

  // Keyboard events
  question.addEventListener('keydown', (event) => {
    handleKeydown(event, question, answer, item);
  });

  // Focus management
  question.addEventListener('focus', () => {
    item.classList.add('faq-item--focused');
  });

  question.addEventListener('blur', () => {
    item.classList.remove('faq-item--focused');
  });
}

/**
 * Set initial collapsed state
 */
function setInitialState(answer) {
  answer.style.maxHeight = '0px';
  answer.style.opacity = '0';
  answer.style.overflow = 'hidden';
  answer.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
  answer.setAttribute('aria-hidden', 'true');
}

/**
 * Toggle FAQ expand/collapse
 */
function toggleFAQ(question, answer) {
  const isExpanded = question.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    collapseFAQ(question, answer);
  } else {
    expandFAQ(question, answer);
  }
}

/**
 * Expand FAQ answer
 */
function expandFAQ(question, answer) {
  // Update ARIA attributes
  question.setAttribute('aria-expanded', 'true');
  answer.setAttribute('aria-hidden', 'false');

  // Add CSS class for styling
  question.classList.add('faq-question--expanded');

  // Animate expansion
  animateExpansion(answer);

  // Announce to screen readers
  announceToScreenReader('FAQ answer expanded');
}

/**
 * Collapse FAQ answer
 */
function collapseFAQ(question, answer) {
  // Update ARIA attributes
  question.setAttribute('aria-expanded', 'false');
  answer.setAttribute('aria-hidden', 'true');

  // Remove CSS class
  question.classList.remove('faq-question--expanded');

  // Animate collapse
  animateCollapse(answer);

  // Announce to screen readers
  announceToScreenReader('FAQ answer collapsed');
}

/**
 * Animate answer expansion
 */
function animateExpansion(answer) {
  // Get the actual content height
  const content = answer.querySelector('.faq-answer-content');
  if (!content) {
    return;
  }

  // Temporarily remove hidden attribute and set visibility to measure height
  const wasHidden = answer.hasAttribute('hidden');
  if (wasHidden) {
    answer.removeAttribute('hidden');
    answer.style.visibility = 'hidden';
    answer.style.position = 'absolute';
  }

  // Temporarily set height to auto to measure
  answer.style.maxHeight = 'none';
  answer.style.opacity = '1';
  const height = answer.scrollHeight;

  // Reset to 0 for animation
  answer.style.maxHeight = '0';
  answer.style.opacity = '0';

  // Restore visibility and positioning
  if (wasHidden) {
    answer.style.visibility = '';
    answer.style.position = '';
    answer.setAttribute('hidden', '');
  }

  // Force reflow
  answer.offsetHeight;

  // Animate to full height
  requestAnimationFrame(() => {
    answer.style.maxHeight = height + 'px';
    answer.style.opacity = '1';
  });
}

/**
 * Animate answer collapse
 */
function animateCollapse(answer) {
  // Get current height
  const height = answer.scrollHeight;

  // Set explicit height for animation
  answer.style.maxHeight = height + 'px';
  answer.style.opacity = '1';

  // Force reflow
  answer.offsetHeight;

  // Animate to collapsed state
  requestAnimationFrame(() => {
    answer.style.maxHeight = '0px';
    answer.style.opacity = '0';
  });
}

/**
 * Handle keyboard navigation
 */
function handleKeydown(event, question, answer, item) {
  const { key } = event;

  switch (key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      toggleFAQ(question, answer);
      break;

    case 'ArrowDown':
      event.preventDefault();
      focusNextItem(item);
      break;

    case 'ArrowUp':
      event.preventDefault();
      focusPreviousItem(item);
      break;

    case 'Home':
      event.preventDefault();
      focusFirstItem();
      break;

    case 'End':
      event.preventDefault();
      focusLastItem();
      break;
  }
}

/**
 * Set up keyboard navigation between FAQ items
 */
function setupKeyboardNavigation(faqItems) {
  // Store items for navigation
  window.faqItems = Array.from(faqItems);
}

/**
 * Focus next FAQ item
 */
function focusNextItem(currentItem) {
  if (!window.faqItems) return;

  const currentIndex = window.faqItems.indexOf(currentItem);
  const nextIndex = (currentIndex + 1) % window.faqItems.length;
  const nextItem = window.faqItems[nextIndex];

  if (nextItem) {
    const nextQuestion = nextItem.querySelector('.faq-question');
    if (nextQuestion) {
      nextQuestion.focus();
    }
  }
}

/**
 * Focus previous FAQ item
 */
function focusPreviousItem(currentItem) {
  if (!window.faqItems) return;

  const currentIndex = window.faqItems.indexOf(currentItem);
  const prevIndex = currentIndex === 0 ? window.faqItems.length - 1 : currentIndex - 1;
  const prevItem = window.faqItems[prevIndex];

  if (prevItem) {
    const prevQuestion = prevItem.querySelector('.faq-question');
    if (prevQuestion) {
      prevQuestion.focus();
    }
  }
}

/**
 * Focus first FAQ item
 */
function focusFirstItem() {
  if (!window.faqItems || !window.faqItems.length) return;

  const firstItem = window.faqItems[0];
  const firstQuestion = firstItem.querySelector('.faq-question');
  if (firstQuestion) {
    firstQuestion.focus();
  }
}

/**
 * Focus last FAQ item
 */
function focusLastItem() {
  if (!window.faqItems || !window.faqItems.length) return;

  const lastItem = window.faqItems[window.faqItems.length - 1];
  const lastQuestion = lastItem.querySelector('.faq-question');
  if (lastQuestion) {
    lastQuestion.focus();
  }
}

/**
 * Announce changes to screen readers
 */
function announceToScreenReader(message) {
  // Create or reuse announcement element
  let announcement = document.getElementById('faq-announcement');

  if (!announcement) {
    announcement = document.createElement('div');
    announcement.id = 'faq-announcement';
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
  }

  // Announce the message
  announcement.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    announcement.textContent = '';
  }, 1000);
}

/**
 * Handle reduced motion preferences
 */
function setupReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleMotionPreference(event) {
    const faqAnswers = document.querySelectorAll('.faq-answer');

    faqAnswers.forEach(answer => {
      if (event.matches) {
        // Disable animations
        answer.style.transition = 'none';
      } else {
        // Re-enable animations
        answer.style.transition = '';
      }
    });
  }

  // Set initial state
  handleMotionPreference(prefersReducedMotion);

  // Listen for changes
  prefersReducedMotion.addEventListener('change', handleMotionPreference);
}

// Initialize reduced motion handling when module loads
setupReducedMotion();

// Initialize language switching for FAQ content
setupLanguageSwitching();

/**
 * Set up language switching for FAQ content
 */
function setupLanguageSwitching() {
  // Listen for language change events
  window.addEventListener('languageChanged', (event) => {
    const newLang = event.detail.lang;
    updateFAQContent(newLang);
  });

  // Also check for initial language on page load
  document.addEventListener('DOMContentLoaded', () => {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    updateFAQContent(currentLang);
  });
}

/**
 * Update FAQ content based on selected language
 */
function updateFAQContent(lang) {
  // Update FAQ section title and subtitle
  const titleElement = document.querySelector('[data-faq-title]');
  const subtitleElement = document.querySelector('[data-faq-subtitle]');

  if (titleElement) {
    updateLanguageContent(titleElement, lang);
  }

  if (subtitleElement) {
    updateLanguageContent(subtitleElement, lang);
  }

  // Update all FAQ questions
  const questionElements = document.querySelectorAll('[data-faq-question]');
  questionElements.forEach(element => {
    updateLanguageContent(element, lang);
  });

  // Update all FAQ answers
  const answerElements = document.querySelectorAll('[data-faq-answer]');
  answerElements.forEach(element => {
    updateLanguageContent(element, lang);
  });
}

/**
 * Update language content for a specific element
 */
function updateLanguageContent(element, lang) {
  const langContents = element.querySelectorAll('.lang-content');

  langContents.forEach(content => {
    const contentLang = content.getAttribute('data-lang');
    if (contentLang === lang) {
      content.style.display = 'block';
      content.classList.add('lang-visible');


    } else {
      content.style.display = 'none';
      content.classList.remove('lang-visible');
    }
  });
}
