/**
 * Footnote System Legacy Adapter
 * Maintains exact compatibility with existing FootnoteSystem API
 * while using new modular architecture internally
 * 
 * Philosophy: Zero-downtime migration preserving all existing functionality
 * and the simple [^N] Ghost editor workflow
 * 
 * Created: August 23, 2025
 */

class FootnoteSystemLegacyAdapter {
  constructor(config = window.DigitalTalmudFootnoteConfig) {
    console.log('[LEGACY_ADAPTER] Initializing with backward compatibility layer');
    
    // Store original config for legacy API compatibility
    this.config = config;
    
    // Initialize modern system components
    this.configManager = new ConfigurationManager();
    this.modernConfig = this.configManager.getProcessorConfig('footnotes');
    
    // Find container
    this.container = document.querySelector(this.modernConfig.container || '.post-content, .page-content');
    
    // Initialize footnote processor with modern architecture
    this.footnoteProcessor = null;
    
    // Legacy state tracking (for API compatibility)
    this.footnotes = new Map();
    this.tooltips = new Map(); 
    this.counter = 0;
    
    // Auto-initialize
    this.init();
  }

  /**
   * Initialize system - maintains legacy API signature
   * @returns {boolean} Success status
   */
  init() {
    try {
      console.log('[LEGACY_ADAPTER] Starting initialization...');
      
      // Validate configuration using legacy method
      if (!this.config || !this.config.validate()) {
        console.error('[LEGACY_ADAPTER] Invalid configuration');
        return false;
      }

      if (!this.container) {
        console.warn('[LEGACY_ADAPTER] Container not found');
        return false;
      }

      // Initialize modern configuration manager
      if (!this.configManager.init()) {
        console.error('[LEGACY_ADAPTER] Modern configuration initialization failed');
        return false;
      }

      // Create and initialize footnote processor
      this.footnoteProcessor = new FootnoteProcessor(this.modernConfig, this.container);
      
      // Initialize processor
      this.footnoteProcessor.init().then(() => {
        // Process content
        this.footnoteProcessor.process();
        
        // Sync legacy state for API compatibility
        this.syncLegacyState();
        
        console.log(`[LEGACY_ADAPTER] Initialized: ${this.footnotes.size} footnotes (via modern architecture)`);
      }).catch(error => {
        console.error('[LEGACY_ADAPTER] Modern processor initialization failed:', error);
      });

      return true;
    } catch (error) {
      console.error('[LEGACY_ADAPTER] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Sync modern processor state with legacy API expectations
   * @private
   */
  syncLegacyState() {
    if (!this.footnoteProcessor) return;
    
    const processorStats = this.footnoteProcessor.getStats();
    this.counter = processorStats.footnoteCount || 0;
    
    // Mirror processor's footnotes map for legacy API compatibility
    this.footnotes = new Map(this.footnoteProcessor.footnotes);
    this.tooltips = new Map(this.footnoteProcessor.tooltips);
    
    console.log('[LEGACY_ADAPTER] Legacy state synchronized');
  }

  /**
   * Legacy method: Create progressive enhancement
   * Delegates to modern processor
   */
  createProgressiveEnhancement() {
    if (this.footnoteProcessor) {
      // This is now handled internally by the processor
      console.log('[LEGACY_ADAPTER] Progressive enhancement handled by modern processor');
    }
  }

  /**
   * Legacy method: Process footnote markers
   * Delegates to modern processor
   */
  processFootnoteMarkers() {
    if (this.footnoteProcessor) {
      // This is now handled internally by the processor
      console.log('[LEGACY_ADAPTER] Pattern processing handled by modern processor');
      this.syncLegacyState();
    }
  }

  /**
   * Legacy method: Connect footnote content
   * Delegates to modern processor
   */
  connectFootnoteContent() {
    if (this.footnoteProcessor) {
      // This is now handled internally by the processor
      console.log('[LEGACY_ADAPTER] Content connection handled by modern processor');
      this.syncLegacyState();
    }
  }

  /**
   * Legacy method: Create footnote collection
   * Delegates to modern processor
   */
  createFootnoteCollection() {
    if (this.footnoteProcessor) {
      // This is now handled internally by the processor
      console.log('[LEGACY_ADAPTER] Collection creation handled by modern processor');
    }
  }

  /**
   * Legacy method: Enhance interactions
   * Delegates to modern processor
   */
  enhanceInteractions() {
    if (this.footnoteProcessor) {
      // This is now handled internally by the processor
      console.log('[LEGACY_ADAPTER] Interaction enhancement handled by modern processor');
    }
  }

  /**
   * Legacy method: Create footnote reference
   * Delegates to modern processor for consistency
   * @param {number} globalNum - Global footnote number
   * @param {string} originalNum - Original number from pattern
   * @returns {string} HTML for footnote reference
   */
  createFootnoteReference(globalNum, originalNum) {
    if (this.footnoteProcessor) {
      return this.footnoteProcessor.createFootnoteReference(globalNum, originalNum);
    }
    
    // Fallback implementation for legacy compatibility
    return `<sup class="footnote-ref" id="fnref-${globalNum}">
      <a href="#footnote-${globalNum}" 
         data-footnote="${globalNum}" 
         class="footnote-link"
         role="doc-noteref">${globalNum}</a>
    </sup>`;
  }

  /**
   * Legacy method: Show tooltip
   * Maintains exact API signature for existing code
   * @param {Event} event - Mouse/focus event
   * @param {number} footnoteNum - Footnote number
   */
  showTooltip(event, footnoteNum) {
    if (this.footnoteProcessor) {
      this.footnoteProcessor.showTooltip(event, footnoteNum);
    }
  }

  /**
   * Legacy method: Hide tooltip
   * @param {number} footnoteNum - Footnote number
   */
  hideTooltip(footnoteNum) {
    if (this.footnoteProcessor) {
      this.footnoteProcessor.hideTooltip(footnoteNum);
    }
  }

  /**
   * Legacy method: Navigate to footnote
   * @param {string} elementId - Target element ID
   */
  navigateToFootnote(elementId) {
    if (this.footnoteProcessor) {
      this.footnoteProcessor.navigateToFootnote(elementId);
    }
  }

  /**
   * Legacy method: Toggle inline extension
   * @param {number} footnoteNum - Footnote number
   * @param {Element} linkElement - Footnote link element
   */
  toggleInlineExtension(footnoteNum, linkElement) {
    if (this.footnoteProcessor) {
      this.footnoteProcessor.toggleInlineExtension(footnoteNum, linkElement);
    }
  }

  /**
   * Legacy method: Mark system ready
   * Delegates to modern processor
   */
  markSystemReady() {
    if (this.footnoteProcessor) {
      // This is now handled internally by the processor
      console.log('[LEGACY_ADAPTER] System ready marking handled by modern processor');
    }
  }

  /**
   * Legacy method: Create element
   * Maintains exact API for existing code that might call this
   * @param {string} tag - HTML tag name
   * @param {string} className - CSS class name
   * @returns {Element} Created element
   */
  createElement(tag, className = '') {
    if (this.footnoteProcessor) {
      return this.footnoteProcessor.createElement(tag, className);
    }
    
    // Fallback implementation
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }

  /**
   * Legacy method: Set attributes
   * @param {Element} element - Target element
   * @param {Object} attributes - Attributes to set
   */
  setAttributes(element, attributes) {
    if (this.footnoteProcessor) {
      this.footnoteProcessor.setAttributes(element, attributes);
    } else {
      // Fallback implementation
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
  }

  /**
   * Legacy method: Set styles
   * @param {Element} element - Target element
   * @param {Object} styles - Styles to set
   */
  setStyles(element, styles) {
    if (this.footnoteProcessor) {
      this.footnoteProcessor.setStyles(element, styles);
    } else {
      // Fallback implementation
      Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value;
      });
    }
  }

  /**
   * Legacy method: Extract clean content
   * @param {string} html - HTML to clean
   * @returns {string} Cleaned HTML
   */
  extractCleanContent(html) {
    if (this.footnoteProcessor) {
      return this.footnoteProcessor.extractCleanContent(html);
    }
    
    // Basic fallback implementation
    return html;
  }

  /**
   * Legacy method: Sanitize HTML
   * @param {string} html - HTML to sanitize
   * @returns {string} Sanitized HTML
   */
  sanitizeHTML(html) {
    if (this.footnoteProcessor) {
      return this.footnoteProcessor.sanitizeHTML(html);
    }
    
    // Basic fallback implementation
    if (!this.config.processing?.sanitizeHTML) return html;
    
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }

  /**
   * Legacy method: Debug information
   * Enhanced to show modern architecture status
   */
  debug() {
    console.group('[LEGACY_ADAPTER] Debug Information');
    console.log(`Footnotes: ${this.footnotes.size}`);
    console.log(`Configuration:`, this.config);
    console.log(`Container:`, this.container);
    console.log(`Modern Processor:`, this.footnoteProcessor ? 'Active' : 'Not initialized');
    
    if (this.footnoteProcessor) {
      console.log(`Processor Stats:`, this.footnoteProcessor.getStats());
    }
    
    console.log(`Legacy footnote data:`, Array.from(this.footnotes.entries()));
    console.groupEnd();
  }

  /**
   * New method: Get modern processor instance
   * Allows advanced users to access modern features while maintaining compatibility
   * @returns {FootnoteProcessor|null} Modern processor instance
   */
  getModernProcessor() {
    return this.footnoteProcessor;
  }

  /**
   * New method: Get configuration manager
   * @returns {ConfigurationManager} Configuration manager instance
   */
  getConfigurationManager() {
    return this.configManager;
  }

  /**
   * New method: Check if running in legacy mode
   * @returns {boolean} Always true for legacy adapter
   */
  isLegacyMode() {
    return true;
  }

  /**
   * New method: Migrate to modern API
   * Provides path for users to gradually migrate away from legacy adapter
   * @returns {Object} Modern system components
   */
  migrateToModern() {
    console.log('[LEGACY_ADAPTER] Migration requested - returning modern components');
    
    return {
      configManager: this.configManager,
      footnoteProcessor: this.footnoteProcessor,
      container: this.container,
      modernConfig: this.modernConfig
    };
  }
}

// Ensure modern dependencies are loaded
if (typeof ConfigurationManager === 'undefined') {
  console.error('[LEGACY_ADAPTER] ConfigurationManager not loaded. Please include configuration-manager.js');
}

if (typeof ContentProcessor === 'undefined') {
  console.error('[LEGACY_ADAPTER] ContentProcessor not loaded. Please include content-processor-base.js');
}

if (typeof FootnoteProcessor === 'undefined') {
  console.error('[LEGACY_ADAPTER] FootnoteProcessor not loaded. Please include footnote-processor.js');
}

// Auto-initialize when configuration is loaded (maintains legacy behavior)
document.addEventListener('DOMContentLoaded', () => {
  // Check if we should use legacy adapter based on feature flags
  const useModernSystem = window.CONTENT_ENHANCEMENT_FLAGS?.USE_LEGACY_FOOTNOTES === false;
  
  if (!useModernSystem && window.DigitalTalmudFootnoteConfig && document.querySelector('.post-content, .page-content')) {
    console.log('[LEGACY_ADAPTER] Auto-initializing with legacy compatibility');
    window.FootnoteSystemInstance = new FootnoteSystemLegacyAdapter();
    
    // Maintain legacy debug function
    window.debugFootnotes = () => {
      if (window.FootnoteSystemInstance) {
        window.FootnoteSystemInstance.debug();
      }
    };
    
    // Add modern debug function
    window.debugModernFootnotes = () => {
      if (window.FootnoteSystemInstance && window.FootnoteSystemInstance.getModernProcessor()) {
        window.FootnoteSystemInstance.getModernProcessor().debug('Modern Processor Debug');
      }
    };
  } else if (useModernSystem) {
    console.log('[LEGACY_ADAPTER] Feature flag detected - skipping legacy adapter initialization');
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FootnoteSystemLegacyAdapter;
}