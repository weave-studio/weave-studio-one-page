// lighthouserc.js - Lighthouse CI Configuration for Automated Performance Audits
module.exports = {
    ci: {
      collect: {
        // URLs to audit
        url: [
          'http://localhost:8080/',
          'http://localhost:8080/about/',
          'http://localhost:8080/services/',
          'http://localhost:8080/contact/',
          'http://localhost:8080/blog/',
          'http://localhost:8080/faq/'
        ],
        
        // Lighthouse settings
        settings: {
          numberOfRuns: 3, // Run multiple times for consistent results
          
          // Chrome flags for headless testing
          chromeFlags: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection'
          ],
          
          // Performance settings
          preset: 'desktop',
          throttling: {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
            requestLatencyMs: 0,
            downloadThroughputKbps: 0,
            uploadThroughputKbps: 0
          },
          
          // Skip certain audits that may be inconsistent in CI
          skipAudits: [
            'uses-http2', // May vary by server
            'canonical'   // Handled by site configuration
          ],
          
          // Additional settings
          emulatedFormFactor: 'desktop',
          locale: 'en-US',
          disableStorageReset: false,
          maxWaitForLoad: 45000
        }
      },
      
      // Performance assertions - these will fail the build if not met
      assert: {
        assertions: {
          // Core Web Vitals (critical for user experience)
          'categories:performance': ['error', { minScore: 0.90 }],
          'categories:accessibility': ['error', { minScore: 0.95 }],
          'categories:best-practices': ['error', { minScore: 0.90 }],
          'categories:seo': ['error', { minScore: 0.95 }],
          
          // Specific performance metrics
          'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
          'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
          'total-blocking-time': ['error', { maxNumericValue: 300 }],
          'speed-index': ['error', { maxNumericValue: 3000 }],
          'interactive': ['error', { maxNumericValue: 3800 }],
          
          // Resource efficiency
          'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
          'unminified-css': ['error', { maxNumericValue: 0 }],
          'unminified-javascript': ['error', { maxNumericValue: 0 }],
          
          // Image optimization
          'modern-image-formats': ['warn', { maxNumericValue: 0 }],
          'uses-optimized-images': ['warn', { maxNumericValue: 0 }],
          'uses-responsive-images': ['warn', { maxNumericValue: 0 }],
          
          // Accessibility checks
          'color-contrast': ['error', { minScore: 1 }],
          'heading-order': ['error', { minScore: 1 }],
          'html-has-lang': ['error', { minScore: 1 }],
          'image-alt': ['error', { minScore: 1 }],
          'link-name': ['error', { minScore: 1 }],
          
          // SEO essentials
          'meta-description': ['error', { minScore: 1 }],
          'document-title': ['error', { minScore: 1 }],
          'crawlable-anchors': ['error', { minScore: 1 }]
        }
      },
      
      // Upload results (for CI/CD integration)
      upload: {
        target: 'temporary-public-storage'
      },
      
      // Server configuration for local testing
      server: {
        command: 'npm run preview',
        port: 8080,
        timeout: 30000
      }
    }
  };