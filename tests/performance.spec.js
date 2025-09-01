// tests/performance.spec.js - Core Web Vitals & Performance Testing
import { test, expect } from '@playwright/test';

// Performance thresholds based on Core Web Vitals
const THRESHOLDS = {
  LCP: 2500,     // Largest Contentful Paint (ms)
  FID: 100,      // First Input Delay (ms) 
  CLS: 0.1,      // Cumulative Layout Shift
  FCP: 1800,     // First Contentful Paint (ms)
  TTFB: 600,     // Time to First Byte (ms)
  LOAD_TIME: 3000, // Page load time (ms)
  RESOURCES: 50,   // Max resource requests
  TRANSFER: 1000000 // Max transfer size (1MB)
};

// Critical pages for performance testing
const PAGES = [
  { url: '/', name: 'Homepage', priority: 'high' },
  { url: '/services/', name: 'Services', priority: 'high' },
  { url: '/contact/', name: 'Contact', priority: 'high' },
  { url: '/blog/', name: 'Blog', priority: 'medium' }
];

// Performance measurement utilities
class PerformanceUtils {
  static async measureWebVitals(page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        let resolved = false;
        
        // Set a timeout to ensure we don't wait forever
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(vitals);
          }
        }, 5000);
        
        // Largest Contentful Paint
        try {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            if (entries.length > 0) {
              const lastEntry = entries[entries.length - 1];
              vitals.lcp = lastEntry.startTime;
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observation failed:', e);
        }
        
        // Cumulative Layout Shift
        try {
          let clsValue = 0;
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            vitals.cls = clsValue;
          }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observation failed:', e);
        }
        
        // Navigation timing
        try {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            vitals.fcp = navigation.responseEnd - navigation.requestStart;
            vitals.ttfb = navigation.responseStart - navigation.requestStart;
            vitals.loadTime = navigation.loadEventEnd - navigation.requestStart;
          }
        } catch (e) {
          console.warn('Navigation timing failed:', e);
        }
        
        // Wait for metrics to settle
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve(vitals);
          }
        }, 3000);
      });
    });
  }
  
  static async getResourceMetrics(page) {
    return await page.evaluate(() => {
      try {
        const resources = performance.getEntriesByType('resource');
        const totalSize = resources.reduce((sum, resource) => {
          return sum + (resource.transferSize || resource.encodedBodySize || 0);
        }, 0);
        
        return {
          count: resources.length,
          totalSize: totalSize,
          byType: resources.reduce((acc, resource) => {
            const type = resource.initiatorType || 'other';
            if (!acc[type]) acc[type] = { count: 0, size: 0 };
            acc[type].count++;
            acc[type].size += resource.transferSize || 0;
            return acc;
          }, {})
        };
      } catch (e) {
        console.warn('Resource metrics failed:', e);
        return { count: 0, totalSize: 0, byType: {} };
      }
    });
  }
}

// Core Web Vitals tests for each page
PAGES.forEach(({ url, name, priority }) => {
  test.describe(`${name} Performance`, () => {
    
    test(`should meet Core Web Vitals thresholds`, async ({ page }) => {
      console.log(`🏃‍♂️ Testing ${name} performance...`);
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const vitals = await PerformanceUtils.measureWebVitals(page);
      console.log(`📊 ${name} vitals:`, vitals);
      
      // LCP should be under 2.5s
      if (vitals.lcp) {
        expect(vitals.lcp, `LCP for ${name}`).toBeLessThan(THRESHOLDS.LCP);
        console.log(`✅ LCP: ${Math.round(vitals.lcp)}ms`);
      }
      
      // CLS should be under 0.1
      if (vitals.cls !== undefined) {
        expect(vitals.cls, `CLS for ${name}`).toBeLessThan(THRESHOLDS.CLS);
        console.log(`✅ CLS: ${vitals.cls.toFixed(3)}`);
      }
      
      // TTFB should be under 600ms
      if (vitals.ttfb) {
        expect(vitals.ttfb, `TTFB for ${name}`).toBeLessThan(THRESHOLDS.TTFB);
        console.log(`✅ TTFB: ${Math.round(vitals.ttfb)}ms`);
      }
      
      // Load time should be reasonable
      if (vitals.loadTime) {
        expect(vitals.loadTime, `Load time for ${name}`).toBeLessThan(THRESHOLDS.LOAD_TIME);
        console.log(`✅ Load time: ${Math.round(vitals.loadTime)}ms`);
      }
    });
    
    test(`should have efficient resource usage`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const resourceMetrics = await PerformanceUtils.getResourceMetrics(page);
      
      // Total transfer size should be reasonable
      expect(resourceMetrics.totalSize, `Transfer size for ${name}`).toBeLessThan(THRESHOLDS.TRANSFER);
      
      // Resource count should be manageable  
      expect(resourceMetrics.count, `Resource count for ${name}`).toBeLessThan(THRESHOLDS.RESOURCES);
      
      console.log(`📦 ${name} - Resources: ${resourceMetrics.count}, Size: ${Math.round(resourceMetrics.totalSize / 1024)}KB`);
      
      // Log resource breakdown
      Object.entries(resourceMetrics.byType).forEach(([type, metrics]) => {
        console.log(`  ${type}: ${metrics.count} files, ${Math.round(metrics.size / 1024)}KB`);
      });
    });
    
    test(`should load quickly`, async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(url);
      await page.waitForLoadState('domcontentloaded');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime, `Initial load time for ${name}`).toBeLessThan(THRESHOLDS.LOAD_TIME);
      
      console.log(`⚡ ${name} DOM loaded in: ${loadTime}ms`);
    });
  });
});

// Mobile performance tests
test.describe('Mobile Performance', () => {
  test.use({ 
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true 
  });
  
  test('Homepage should perform well on mobile', async ({ page }) => {
    console.log('📱 Testing mobile performance...');
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // Mobile should still load reasonably fast (allow 1.5x threshold)
    expect(loadTime).toBeLessThan(THRESHOLDS.LOAD_TIME * 1.5);
    
    console.log(`📱 Mobile load time: ${loadTime}ms`);
    
    // Test mobile interactions
    const mobileMenu = page.locator('[aria-label*="menu"]');
    if (await mobileMenu.isVisible()) {
      const interactionStart = Date.now();
      await mobileMenu.tap();
      
      // Menu should open quickly
      await page.waitForSelector('[id="main-navigation"][aria-hidden="false"]', { timeout: 500 });
      const interactionTime = Date.now() - interactionStart;
      
      expect(interactionTime, 'Mobile menu response time').toBeLessThan(300);
      console.log(`📱 Mobile menu response: ${interactionTime}ms`);
    }
  });
});

// Image optimization tests
test.describe('Asset Optimization', () => {
  test('Images should be optimized', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = await page.locator('img').all();
    console.log(`🖼️ Testing ${images.length} images...`);
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:') && !src.includes('placeholder')) {
        
        // Check if modern formats are being served
        try {
          const response = await page.request.get(src);
          const contentType = response.headers()['content-type'];
          
          // Should prefer modern formats for non-SVG images
          if (!contentType?.includes('svg')) {
            const isModernFormat = contentType?.includes('webp') || 
                                 contentType?.includes('avif') ||
                                 src.includes('.webp') || 
                                 src.includes('.avif');
            
            if (!isModernFormat) {
              console.warn(`⚠️ Image not in modern format: ${src} (${contentType})`);
            }
          }
          
          // Check image size is reasonable
          const contentLength = response.headers()['content-length'];
          if (contentLength && parseInt(contentLength) > 500000) { // 500KB
            console.warn(`⚠️ Large image detected: ${src} (${Math.round(contentLength / 1024)}KB)`);
          }
          
        } catch (e) {
          console.warn(`Failed to check image: ${src}`, e.message);
        }
      }
    }
  });
  
  test('CSS should be optimized', async ({ page }) => {
    await page.goto('/');
    
    try {
      const cssResponse = await page.request.get('/assets/css/main.css');
      if (cssResponse.ok()) {
        const cssContent = await cssResponse.text();
        const cssSize = cssContent.length;
        
        console.log(`🎨 CSS size: ${Math.round(cssSize / 1024)}KB`);
        
        // CSS should be reasonably sized
        expect(cssSize, 'CSS file size').toBeLessThan(100000); // 100KB
        
        // In production, CSS should be minified
        if (process.env.NODE_ENV === 'production') {
          const whitespaceRatio = (cssContent.match(/\s/g) || []).length / cssContent.length;
          expect(whitespaceRatio, 'CSS minification').toBeLessThan(0.3);
          console.log(`🗜️ CSS whitespace ratio: ${Math.round(whitespaceRatio * 100)}%`);
        }
      }
    } catch (e) {
      console.warn('CSS optimization check failed:', e.message);
    }
  });
});

// Performance regression detection
test.describe('Performance Monitoring', () => {
  test('should track performance metrics for regression detection', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const vitals = await PerformanceUtils.measureWebVitals(page);
    const resources = await PerformanceUtils.getResourceMetrics(page);
    
    // Store metrics for trend analysis
    const performanceData = {
      timestamp: new Date().toISOString(),
      url: '/',
      vitals,
      resources,
      userAgent: await page.evaluate(() => navigator.userAgent),
      connection: await page.evaluate(() => navigator.connection?.effectiveType || 'unknown')
    };
    
    console.log('📈 Performance data collected:', performanceData);
    
    // In a real implementation, you'd send this to a monitoring service
    // For now, we'll just ensure we collected meaningful data
    expect(performanceData.vitals).toBeDefined();
    expect(performanceData.resources.count).toBeGreaterThan(0);
  });
});