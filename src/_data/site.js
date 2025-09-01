// src/_data/site.js - Enhanced site configuration
module.exports = {
  name: "Weave Studio Template",
  tagline: "High-performance starter template",
  description: "A modern, accessible starter template for freelance web design projects built with 11ty, Vite, and Decap CMS.",
  url: process.env.SITE_URL || "http://localhost:8080",
  language: "en",
  locale: "en_US",
  direction: "ltr",
  author: "Weave Studio",
  email: process.env.CONTACT_EMAIL || "hello@weavestudio.co",
  twitter: "weavestudio", // Twitter handle without @
  
  // SEO and social
  keywords: "web design, 11ty, jamstack, starter template, accessible, performance",
  image: "/assets/images/og-default.jpg",
  themeColor: "#1a1a1a",
  
  // Logo
  logo: "/assets/images/logo.svg",
  
  // Social media - now managed via CMS
  social: require('./social.js').social || [],
  
  // Legal links
  legal: [
    {
      text: "Privacy Policy",
      url: "/privacy/"
    },
    {
      text: "Terms of Service", 
      url: "/terms/"
    }
  ]
};