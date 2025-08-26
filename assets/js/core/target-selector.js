/**
 * Target Selector - Robust element selection for interactive markers
 * Handles paragraph ranges, CSS selectors, and custom selection patterns
 * 
 * Selection Patterns:
 * - p1-2: First two paragraphs
 * - p3: Third paragraph
 * - first-2-p: First two paragraphs (alternative syntax)
 * - #id: Element by ID
 * - .class: Elements by class
 * - h1,h2,h3: Multiple selectors
 * 
 * Created: August 25, 2025
 */

class TargetSelector {
  constructor(container, logger = console) {
    this.container = container;
    this.logger = logger;
    
    // Cache for performance
    this.paragraphCache = null;
    this.lastCacheTime = 0;
    this.cacheTimeout = 5000; // 5 second cache timeout
  }

  /**
   * Select target elements based on selector string
   * @param {string} selector - Selection pattern
   * @returns {Array<Element>} Selected elements
   */
  select(selector) {
    if (!selector || typeof selector !== 'string') {
      this.logger.warn('Invalid selector provided:', selector);
      return [];
    }

    const trimmedSelector = selector.trim();
    
    try {
      // Handle paragraph range patterns (p1-2, p3, first-2-p)
      if (this.isParagraphPattern(trimmedSelector)) {
        return this.selectParagraphs(trimmedSelector);
      }
      
      // Handle standard CSS selectors
      return this.selectByCSS(trimmedSelector);
      
    } catch (error) {
      this.logger.error(`Selection failed for "${selector}":`, error);
      return [];
    }
  }

  /**
   * Check if selector is a paragraph pattern
   * @param {string} selector - Selector to check
   * @returns {boolean} True if paragraph pattern
   * @private
   */
  isParagraphPattern(selector) {
    const paragraphPatterns = [
      /^p\d+(-\d+)?$/, // p1, p1-2, p3-5
      /^first-\d+-p$/, // first-2-p, first-5-p
      /^last-\d+-p$/,  // last-2-p, last-3-p
      /^paragraph-\d+(-\d+)?$/ // paragraph-1, paragraph-1-3
    ];
    
    return paragraphPatterns.some(pattern => pattern.test(selector));
  }

  /**
   * Select paragraphs based on paragraph patterns
   * @param {string} selector - Paragraph selector pattern
   * @returns {Array<Element>} Selected paragraph elements
   * @private
   */
  selectParagraphs(selector) {
    const paragraphs = this.getParagraphs();
    
    if (paragraphs.length === 0) {
      this.logger.warn('No paragraphs found in container');
      return [];
    }
    
    // Handle different paragraph selection patterns
    if (selector.match(/^p(\d+)(-(\d+))?$/)) {
      return this.selectParagraphRange(selector, paragraphs);
    }
    
    if (selector.match(/^first-(\d+)-p$/)) {
      const count = parseInt(selector.match(/^first-(\d+)-p$/)[1]);
      return paragraphs.slice(0, count);
    }
    
    if (selector.match(/^last-(\d+)-p$/)) {
      const count = parseInt(selector.match(/^last-(\d+)-p$/)[1]);
      return paragraphs.slice(-count);
    }
    
    if (selector.match(/^paragraph-(\d+)(-(\d+))?$/)) {
      return this.selectParagraphRange(selector.replace(/^paragraph-/, 'p'), paragraphs);
    }
    
    this.logger.warn(`Unrecognized paragraph pattern: ${selector}`);
    return [];
  }

  /**
   * Select paragraph range (p1-2, p3, etc.)
   * @param {string} selector - Range selector (p1-2, p3)
   * @param {Array<Element>} paragraphs - Available paragraphs
   * @returns {Array<Element>} Selected paragraphs
   * @private
   */
  selectParagraphRange(selector, paragraphs) {
    const match = selector.match(/^p(\d+)(-(\d+))?$/);
    if (!match) return [];
    
    const start = parseInt(match[1]) - 1; // Convert to 0-based indexing
    const end = match[3] ? parseInt(match[3]) - 1 : start; // If no end, select single paragraph
    
    // Validate range
    if (start < 0 || start >= paragraphs.length) {
      this.logger.warn(`Start index ${start + 1} out of range (1-${paragraphs.length})`);
      return [];
    }
    
    if (end < start || end >= paragraphs.length) {
      this.logger.warn(`End index ${end + 1} out of range or invalid (${start + 1}-${paragraphs.length})`);
      return [];
    }
    
    const selected = paragraphs.slice(start, end + 1);
    this.logger.debug(`Selected paragraphs ${start + 1}-${end + 1}:`, selected.length, 'elements');
    
    return selected;
  }

  /**
   * Select elements using CSS selectors
   * @param {string} selector - CSS selector
   * @returns {Array<Element>} Selected elements
   * @private
   */
  selectByCSS(selector) {
    try {
      const elements = Array.from(this.container.querySelectorAll(selector));
      
      if (elements.length === 0) {
        this.logger.warn(`No elements found for CSS selector: ${selector}`);
        return [];
      }
      
      this.logger.debug(`Selected ${elements.length} elements with CSS selector: ${selector}`);
      return elements;
      
    } catch (error) {
      this.logger.error(`Invalid CSS selector: ${selector}`, error);
      return [];
    }
  }

  /**
   * Get all paragraphs in container with caching
   * @returns {Array<Element>} Paragraph elements
   * @private
   */
  getParagraphs() {
    const now = Date.now();
    
    // Return cached paragraphs if still valid
    if (this.paragraphCache && (now - this.lastCacheTime) < this.cacheTimeout) {
      return this.paragraphCache;
    }
    
    // Find all paragraph elements
    const paragraphs = Array.from(this.container.querySelectorAll('p'));
    
    // Filter out empty paragraphs or those with only whitespace
    const validParagraphs = paragraphs.filter(p => {
      const text = p.textContent.trim();
      return text.length > 0 && text !== '&nbsp;';
    });
    
    // Update cache
    this.paragraphCache = validParagraphs;
    this.lastCacheTime = now;
    
    this.logger.debug(`Found ${validParagraphs.length} valid paragraphs (${paragraphs.length} total)`);
    return validParagraphs;
  }

  /**
   * Clear selection cache (useful when DOM changes)
   */
  clearCache() {
    this.paragraphCache = null;
    this.lastCacheTime = 0;
    this.logger.debug('Target selection cache cleared');
  }

  /**
   * Validate a selector without executing it
   * @param {string} selector - Selector to validate
   * @returns {Object} Validation result
   */
  validateSelector(selector) {
    if (!selector || typeof selector !== 'string') {
      return { valid: false, error: 'Selector must be a non-empty string' };
    }
    
    const trimmedSelector = selector.trim();
    
    try {
      if (this.isParagraphPattern(trimmedSelector)) {
        return this.validateParagraphPattern(trimmedSelector);
      } else {
        return this.validateCSSSelector(trimmedSelector);
      }
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Validate paragraph pattern
   * @param {string} selector - Paragraph selector pattern
   * @returns {Object} Validation result
   * @private
   */
  validateParagraphPattern(selector) {
    const paragraphs = this.getParagraphs();
    
    if (paragraphs.length === 0) {
      return { valid: false, error: 'No paragraphs found in container' };
    }
    
    if (selector.match(/^p(\d+)(-(\d+))?$/)) {
      const match = selector.match(/^p(\d+)(-(\d+))?$/);
      const start = parseInt(match[1]);
      const end = match[3] ? parseInt(match[3]) : start;
      
      if (start < 1 || start > paragraphs.length) {
        return { valid: false, error: `Start index ${start} out of range (1-${paragraphs.length})` };
      }
      
      if (end < start || end > paragraphs.length) {
        return { valid: false, error: `End index ${end} out of range or invalid` };
      }
      
      return { valid: true, elementCount: end - start + 1 };
    }
    
    if (selector.match(/^first-(\d+)-p$/)) {
      const count = parseInt(selector.match(/^first-(\d+)-p$/)[1]);
      if (count > paragraphs.length) {
        return { valid: false, error: `Requested ${count} paragraphs, but only ${paragraphs.length} available` };
      }
      return { valid: true, elementCount: count };
    }
    
    return { valid: true, elementCount: 1 };
  }

  /**
   * Validate CSS selector
   * @param {string} selector - CSS selector
   * @returns {Object} Validation result
   * @private
   */
  validateCSSSelector(selector) {
    try {
      // Test selector validity by attempting to query with it
      this.container.querySelector(selector);
      return { valid: true, type: 'css' };
    } catch (error) {
      return { valid: false, error: `Invalid CSS selector: ${error.message}` };
    }
  }

  /**
   * Get selection info for debugging
   * @param {string} selector - Selector to analyze
   * @returns {Object} Selection information
   */
  getSelectionInfo(selector) {
    const validation = this.validateSelector(selector);
    if (!validation.valid) {
      return validation;
    }
    
    const elements = this.select(selector);
    
    return {
      valid: true,
      selector: selector,
      elementCount: elements.length,
      elements: elements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        textPreview: el.textContent.substring(0, 50) + '...'
      }))
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TargetSelector;
} else if (typeof window !== 'undefined') {
  window.TargetSelector = TargetSelector;
}