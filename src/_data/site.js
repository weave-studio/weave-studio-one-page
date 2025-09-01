// src/_data/site.js - Weave Studio with auto language detection
module.exports = {
  name: "Weave Studio",
  tagline: "Fast, Beautiful Websites for Small Businesses",
  tagline_he: "אתרים מהירים ויפים לעסקים קטנים",
  description: "Professional web design and development that helps small businesses grow online with fast, conversion-optimized websites.",
  description_he: "עיצוב ופיתוח אתרים מקצועיים המסייעים לעסקים קטנים לצמוח באינטרנט עם אתרים מהירים ומותאמים להמרות.",
  
  url: process.env.SITE_URL || "https://weavewebdesign.com ",
  
  // Default to English, auto-detect based on location
  language: "en", // Default language
  locale: "en_US", // Default locale
  direction: "ltr", // Default direction
  
  // Business owner information
  author: "Assaf Yechiel",
  business_name: "Weave Studio",
  email: process.env.CONTACT_EMAIL || "info@weavewebdesign.com ",
  
  // Business details
  services: [
    "Web Design",
    "Web Development", 
    "E-commerce Solutions",
    "SEO Optimization",
    "Website Maintenance",
    "Consulting"
  ],
  
  // SEO and social
  keywords: "web design Tel Aviv, אתרי אינטרנט תל אביב, website design Israel, עיצוב אתרים ישראל, freelance web designer, web design, web development, small business websites, e-commerce, SEO, website maintenance",
  image: "/assets/images/og-weave-studio.jpg",
  themeColor: "#2563eb", // Primary blue
  
  // Logo
  logo: "/assets/images/weave-studio-logo.svg",
  
  // Language configuration
  languages: {
    default: "en",
    supported: ["en", "he"],
    auto_detect: true, // Enable automatic detection
    fallback: "en"
  },
  
  // Localized versions
  localized: {
    en: {
      language: "en",
      locale: "en_US", 
      direction: "ltr",
      name: "Weave Studio",
      tagline: "Fast, Beautiful Websites for Small Businesses",
      description: "Professional web design and development that helps small businesses grow online with fast, conversion-optimized websites."
    },
    he: {
      language: "he",
      locale: "he_IL",
      direction: "rtl", 
      name: "Weave Studio",
      tagline: "אתרים מהירים ויפים לעסקים קטנים",
      description: "עיצוב ופיתוח אתרים מקצועיים המסייעים לעסקים קטנים לצמוח באינטרנט עם אתרים מהירים ומותאמים להמרות."
    }
  },
  
  // Business hours (for structured data)
  business_hours: {
    timezone: "Asia/Jerusalem",
    workdays: "Sunday-Thursday",
    hours: "9:00-18:00"
  },
  
  // Social media - managed via separate file
  social: require('./social.js').social || [],
  
  // Legal links
  legal: [
    {
      text: "Privacy Policy",
      text_he: "מדיניות פרטיות", // Privacy Policy in Hebrew
      url: "/privacy/"
    },
    {
      text: "Terms of Service",
      text_he: "תנאי שימוש", // Terms of Service in Hebrew 
      url: "/terms/"
    }
    // ** Combine and change this to one Legal Notice page 
  ]
};