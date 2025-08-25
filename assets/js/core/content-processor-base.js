/**
 * Content Enhancement System - Base Processor Class
 * Provides abstract foundation for all content enhancement processors
 * 
 * Architecture: Modular processor system following SOLID principles
 * - Single Responsibility: Each processor handles one content type
 * - Open/Closed: Easy to add new processors without modifying existing
 * - Dependency Inversion: Processors depend on abstractions
 * - Interface Segregation: Clean, minimal interfaces
 * 
 * Created: August 23, 2025
 */

/**
 * Abstract base class for all content processors
 * Defines the contract that all content enhancement processors must follow
 */
class ContentProcessor {
  constructor(config, container) {
    if (new.target === ContentProcessor) {
      throw new Error('ContentProcessor is abstract and cannot be instantiated directly');
    }
    
    this.config = config;
    this.container = container;
    this.initialized = false;
    this.statistics = {
      processed: 0,
      errors: 0,
      startTime: null,
      endTime: null
    };
    
    // Validate required methods are implemented by subclasses
    this.validateImplementation();
  }

  /**
   * Initialize the processor - must be implemented by subclasses
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    throw new Error('init() must be implemented by subclass');
  }

  /**
   * Process content patterns - must be implemented by subclasses
   * @returns {void}
   */
  process() {
    throw new Error('process() must be implemented by subclass');
  }

  /**
   * Cleanup processor resources - must be implemented by subclasses
   * @returns {void}
   */
  cleanup() {
    throw new Error('cleanup() must be implemented by subclass');
  }

  /**
   * Get processing statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      ...this.statistics,
      processingTime: this.statistics.endTime 
        ? this.statistics.endTime - this.statistics.startTime 
        : null,
      isInitialized: this.initialized,
      processorType: this.constructor.name
    };
  }

  /**
   * Validate that subclass implements required methods
   * @private
   */
  validateImplementation() {
    const requiredMethods = ['init', 'process', 'cleanup'];
    const missingMethods = requiredMethods.filter(method => {
      return this.constructor.prototype[method] === ContentProcessor.prototype[method];
    });

    if (missingMethods.length > 0) {
      throw new Error(`${this.constructor.name} must implement: ${missingMethods.join(', ')}`);
    }
  }

  /**
   * Shared initialization logic for all processors
   * @protected
   */
  async baseInit() {
    this.statistics.startTime = performance.now();
    
    // Validate configuration
    if (!this.config) {
      throw new Error('Configuration is required');
    }

    // Validate container
    if (!this.container) {
      throw new Error('Container element is required');
    }

    this.initialized = true;
    console.log(`[${this.constructor.name}] Initialized successfully`);
    return true;
  }

  /**
   * Shared processing wrapper with error handling and statistics
   * @protected
   */
  async baseProcess() {
    if (!this.initialized) {
      throw new Error('Processor must be initialized before processing');
    }

    try {
      await this.process();
      this.statistics.endTime = performance.now();
      console.log(`[${this.constructor.name}] Processing completed: ${this.statistics.processed} items`);
    } catch (error) {
      this.statistics.errors++;
      console.error(`[${this.constructor.name}] Processing failed:`, error);
      throw error;
    }
  }

  /**
   * Shared cleanup logic
   * @protected
   */
  baseCleanup() {
    // Subclasses should call super.baseCleanup() after their own cleanup
    this.initialized = false;
    console.log(`[${this.constructor.name}] Cleaned up successfully`);
  }

  // === UTILITY METHODS ===
  // Shared utility methods that all processors can use

  /**
   * Create DOM element with class name
   * @param {string} tag - HTML tag name
   * @param {string} className - CSS class name
   * @returns {Element} Created element
   */
  createElement(tag, className = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }

  /**
   * Set multiple attributes on element
   * @param {Element} element - Target element
   * @param {Object} attributes - Attributes to set
   */
  setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  /**
   * Set multiple styles on element
   * @param {Element} element - Target element
   * @param {Object} styles - Styles to set
   */
  setStyles(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
  }

  /**
   * Basic HTML sanitization
   * @param {string} html - HTML to sanitize
   * @returns {string} Sanitized HTML
   */
  sanitizeHTML(html) {
    if (!this.config.processing?.sanitizeHTML) return html;
    
    const temp = document.createElement('div');
    const cleanHTML = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
    
    temp.innerHTML = cleanHTML;
    temp.querySelectorAll('script').forEach(script => script.remove());
    
    return temp.innerHTML;
  }

  /**
   * Find element within processor's container
   * @param {string} selector - CSS selector
   * @returns {Element|null} Found element
   */
  findInContainer(selector) {
    return this.container.querySelector(selector);
  }

  /**
   * Find all elements within processor's container
   * @param {string} selector - CSS selector
   * @returns {NodeList} Found elements
   */
  findAllInContainer(selector) {
    return this.container.querySelectorAll(selector);
  }

  /**
   * Check if processor should handle specific content
   * Override in subclasses for custom logic
   * @param {Element} element - Element to check
   * @returns {boolean} Should handle this element
   */
  shouldProcess(element) {
    // Default: process all elements in container
    return this.container.contains(element);
  }

  /**
   * Increment processed counter
   * @protected
   */
  incrementProcessed() {
    this.statistics.processed++;
  }

  /**
   * Increment error counter
   * @protected
   */
  incrementErrors() {
    this.statistics.errors++;
  }

  /**
   * Log debug information specific to this processor
   * @param {string} message - Debug message
   * @param {*} data - Additional data to log
   */
  debug(message, data = null) {
    console.group(`[${this.constructor.name}] ${message}`);
    if (data) {
      console.log(data);
    }
    console.log('Processor Stats:', this.getStats());
    console.groupEnd();
  }
}

// Expose class globally for system access
window.ContentProcessor = ContentProcessor;

/**
 * Interface definitions for type checking and documentation
 * These are used for validation and IDE support
 */

/**
 * Content Processor Interface
 * @interface ContentProcessorInterface
 */
const ContentProcessorInterface = {
  /**
   * Initialize the processor
   * @param {Element} container - Container element
   * @param {Object} config - Configuration object
   * @returns {Promise<boolean>} Success status
   */
  init: (container, config) => Promise.resolve(false),

  /**
   * Process content patterns
   * @returns {void}
   */
  process: () => {},

  /**
   * Clean up processor resources
   * @returns {void}
   */
  cleanup: () => {},

  /**
   * Get processing statistics
   * @returns {Object} Statistics object
   */
  getStats: () => ({})
};

/**
 * Configuration Interface
 * @interface ConfigurationInterface
 */
const ConfigurationInterface = {
  /**
   * Validate configuration
   * @returns {boolean} Is configuration valid
   */
  validate: () => false,

  /**
   * Get processor-specific configuration
   * @param {string} processorName - Name of processor
   * @returns {Object} Processor configuration
   */
  getProcessorConfig: (processorName) => ({}),

  /**
   * Apply theme to document
   * @param {string} themeName - Name of theme to apply
   * @returns {void}
   */
  applyTheme: (themeName) => {}
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    ContentProcessor, 
    ContentProcessorInterface, 
    ConfigurationInterface 
  };
}