const { DateTime } = require('luxon');
const Image = require('@11ty/eleventy-img');
const path = require('path');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const slugify = require('slugify');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);

  // Configure enhanced markdown
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'after',
      class: 'header-anchor',
      symbol: '#',
      level: [1, 2, 3, 4]
    }),
    slugify: (str) => slugify(str, { lower: true, strict: true })
  });

  eleventyConfig.setLibrary('md', markdownLibrary);

  // Markdown filter for templates
  eleventyConfig.addFilter('md', function(content) {
    if (!content) return '';
    return markdownLibrary.render(content);
  });

  // Date filter
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
  });

  // Date formatting filters for blog posts
  eleventyConfig.addFilter('dateIso', (dateObj) => {
    if (!dateObj) return '';
    return new Date(dateObj).toISOString();
  });

  eleventyConfig.addFilter('dateReadable', (dateObj) => {
    if (!dateObj) return '';
    return new Date(dateObj).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addFilter('dateReadableHe', (dateObj) => {
    if (!dateObj) return '';
    return new Date(dateObj).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Excerpt filter for blog previews
  eleventyConfig.addFilter('excerpt', (content, length = 150) => {
    if (!content) return '';
    
    // Remove HTML tags
    const stripped = content.replace(/<[^>]*>/g, '');
    
    if (stripped.length <= length) {
      return stripped;
    }
    
    // Find the last space within the length limit
    const truncated = stripped.substr(0, length);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return (lastSpace > 0 ? truncated.substr(0, lastSpace) : truncated) + '...';
  });

  // Add limit filter for arrays
  eleventyConfig.addFilter('limit', function(array, limit) {
    return array.slice(0, limit);
  });

  // Reading time calculator
  eleventyConfig.addFilter('readingTime', (content) => {
    if (!content) return '1 min read';
    
    // Remove HTML and count words
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Average reading speed
    
    return `${minutes} min read`;
  });

  // Recent posts for sidebar/widgets
  eleventyConfig.addCollection('recentPosts', function (collection) {
    return collection.getFilteredByGlob('src/blog/posts/*.md') // Fixed the typo
      .filter(post => !post.data.draft)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  });

  // Add blog preview collection for homepage
  eleventyConfig.addCollection('blogPreview', function (collection) {
    return collection.getFilteredByGlob('src/blog/posts/*.md')
      .filter(post => !post.data.draft)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4); // Only 4 posts for homepage preview
  });

  // FAQ collection
  eleventyConfig.addCollection('faqItems', function (collection) {
    return collection.getFilteredByGlob('src/faq/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
});

  // FAQ by category collection
  eleventyConfig.addCollection('faqByCategory', function (collection) {
    const faq = collection.getFilteredByGlob('src/faq/*.md')
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
    
    const categories = {};
    faq.forEach(item => {
      const category = item.data.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    return categories;
  });

  // Blog post navigation filters
  eleventyConfig.addFilter("getPreviousCollectionItem", function(collection, page) {
    if (!collection || !page) return null;
    const index = collection.findIndex(item => item.inputPath === page.inputPath);
    return index > 0 ? collection[index - 1] : null;
  });

  eleventyConfig.addFilter("getNextCollectionItem", function(collection, page) {
    if (!collection || !page) return null;
    const index = collection.findIndex(item => item.inputPath === page.inputPath);
    return index < collection.length - 1 ? collection[index + 1] : null;
  });

  // Image optimization shortcode
  eleventyConfig.addAsyncShortcode('image', async function (src, alt, sizes = '100vw', loading = 'lazy') {
    if (alt === undefined) {
      throw new Error(`Missing \`alt\` on image from: ${src}`);
    }

    if (src.startsWith('http://') || src.startsWith('https://')) {
      return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" />`;
    }

    let metadata = await Image(src, {
      widths: [320, 640, 960, 1200],
      formats: ['avif', 'webp', 'jpeg'],
      urlPath: '/assets/images/',
      outputDir: './_site/assets/images/',
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
        return `${name}-${width}w.${format}`;
      }
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: loading,
      decoding: 'async'
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Static file passthrough
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/css');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy('src/robots.txt');
  eleventyConfig.addPassthroughCopy('src/favicon.ico');
  eleventyConfig.addPassthroughCopy('admin');
  eleventyConfig.addPassthroughCopy('src/_redirects');
  eleventyConfig.addPassthroughCopy('src/_headers');

  // Add collections
  eleventyConfig.addCollection('posts', function (collection) {
    return collection.getFilteredByGlob('src/blog/posts/*.md')
      .filter(post => !post.data.draft)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  eleventyConfig.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (!['all', 'nav', 'post', 'posts', 'draft'].includes(tag)) {
          tagSet.add(tag);
        }
      });
    });
    return Array.from(tagSet).sort();
  });

  // Enhanced collections for case studies
eleventyConfig.addCollection('case_studies', function (collection) {
    return collection.getFilteredByGlob('src/case-studies/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => {
        if (a.data.completion_date && b.data.completion_date) {
          return new Date(b.data.completion_date) - new Date(a.data.completion_date);
        }
        return new Date(b.date) - new Date(a.date);
      });
  });
  
  // Featured posts collection
  eleventyConfig.addCollection('featuredPosts', function (collection) {
    return collection.getFilteredByGlob('src/blog/posts/*.md')
      .filter(post => post.data.featured && !post.data.draft)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  });

  // Services collection - ordered by display order, featured first
  eleventyConfig.addCollection('services', function (collection) {
    return collection.getFilteredByGlob('src/services/*.md')
      .filter(service => !service.data.draft)
      .sort((a, b) => {
        // Sort by order field, then by featured status, then by title
        const orderA = a.data.order || 999;
        const orderB = b.data.order || 999;
        
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // If same order, featured items first
        if (a.data.featured !== b.data.featured) {
          return b.data.featured ? 1 : -1;
        }
        
        // Finally sort by title
        return a.data.title.localeCompare(b.data.title);
      });
  });

  // Featured services for homepage - limit to 6
  eleventyConfig.addCollection('featuredServices', function (collection) {
    return collection.getFilteredByGlob('src/services/*.md')
      .filter(service => service.data.featured && !service.data.draft)
      .sort((a, b) => {
        const orderA = a.data.order || 999;
        const orderB = b.data.order || 999;
        return orderA - orderB;
      })
      .slice(0, 6); // Limit to 6 services for homepage grid
  });

  // Portfolio/Case Studies collection (using existing structure)
  eleventyConfig.addCollection('portfolio', function (collection) {
    const caseStudies = collection.getFilteredByGlob('src/case-study/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => {
        if (a.data.completion_date && b.data.completion_date) {
          return new Date(b.data.completion_date) - new Date(a.data.completion_date);
        }
        return new Date(b.date) - new Date(a.date);
      });
      
    const portfolioItems = collection.getFilteredByGlob('src/portfolio/*.md')
      .filter(item => !item.data.draft)
      .sort((a, b) => {
        if (a.data.completion_date && b.data.completion_date) {
          return new Date(b.data.completion_date) - new Date(a.data.completion_date);
        }
        return new Date(b.date) - new Date(a.date);
      });
      
    return [...caseStudies, ...portfolioItems];
  });

  // Featured portfolio items for homepage preview
  eleventyConfig.addCollection('featuredPortfolio', function (collection) {
    const allPortfolio = collection.getFilteredByGlob(['src/case-study/*.md', 'src/portfolio/*.md'])
      .filter(item => item.data.featured && !item.data.draft)
      .sort((a, b) => {
        if (a.data.completion_date && b.data.completion_date) {
          return new Date(b.data.completion_date) - new Date(a.data.completion_date);
        }
        return new Date(b.date) - new Date(a.date);
      });
      
    return allPortfolio.slice(0, 3); // Limit to 3 for preview
  });
  
  // Add enhanced shortcodes for better content creation
  eleventyConfig.addPairedShortcode('highlight', function (content, type = 'info') {
    return `<div class="highlight highlight--${type}" role="note">
      <div class="highlight__content">${content}</div>
    </div>`;
  });
  
  eleventyConfig.addShortcode('button', function(text, url, style = 'primary') {
    const external = url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}" class="btn btn--${style}" ${external}>${text}</a>`;
  });

  // Add shortcodes
  eleventyConfig.addPairedShortcode('callout', function (content, type = 'info') {
    const styles = {
      info: 'background: #e6f3ff; border-left: 4px solid #0066cc; color: #003d7a;',
      warning: 'background: #fff3cd; border-left: 4px solid #ffc107; color: #856404;',
      success: 'background: #d1eddd; border-left: 4px solid #28a745; color: #155724;',
      error: 'background: #f8d7da; border-left: 4px solid #dc3545; color: #721c24;'
    };
    
    return `<div class="callout callout--${type}" style="${styles[type] || styles.info} padding: 1rem; margin: 1rem 0;" role="note">
      <div class="callout__content">${content}</div>
    </div>`;
  });

        // Enhanced callout shortcode for CMS
  eleventyConfig.addPairedShortcode('callout', function (content, type = 'info') {
    const styles = {
      info: 'background: #e6f3ff; border-left: 4px solid #0066cc; color: #003d7a;',
      warning: 'background: #fff3cd; border-left: 4px solid #ffc107; color: #856404;',
      success: 'background: #d1eddd; border-left: 4px solid #28a745; color: #155724;',
      error: 'background: #f8d7da; border-left: 4px solid #dc3545; color: #721c24;'
    };
    
    return `<div class="callout callout--${type}" style="${styles[type] || styles.info} padding: 1rem; margin: 1rem 0; border-radius: 0.25rem;" role="note">
      <div class="callout__content">${content}</div>
    </div>`;
  });

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  eleventyConfig.addShortcode('buildTime', () => `${new Date().toISOString()}`);

  eleventyConfig.addShortcode('youtube', function(videoId, title) {
    return `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 1rem 0;">
      <iframe 
        src="https://www.youtube.com/embed/${videoId}" 
        title="${title}"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
        allowfullscreen
        loading="lazy">
      </iframe>
    </div>`;
  });

  // Production optimizations
  if (process.env.NODE_ENV === 'production') {
    const htmlmin = require('html-minifier');
    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
      if (outputPath && outputPath.endsWith('.html')) {
        return htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        });
      }
      return content;
    });
  }

  return {
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  };
};
