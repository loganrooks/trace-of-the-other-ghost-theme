/**
 * Marginalia Processor - Pattern-based marginalia system
 * Converts [m][voice font-scale width position][content] patterns to styled marginalia
 * 
 * Follows same architecture as ParagraphExtensionProcessor for consistency
 * 
 * Created: August 23, 2025
 */

class MarginaliaProcessor extends ContentProcessor {
  constructor(config = {}, container = null) {
    super(config, container);
    
    // Set up structured logger
    this.logger = window.logger ? window.logger('marginalia') : console;
    
    // Marginalia-specific state
    this.marginalia = new Map();
    this.counter = 0;
    
    // Default parameters
    this.defaults = {
      voice: 1,
      fontScale: 1.0,
      width: 30,
      position: 'right'
    };
    
    this.logger.info('Initialized with pattern-based marginalia system', { container: !!container, config });
  }

  /**
   * Initialize the marginalia processor
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    try {
      this.logger.time('initialization');
      this.logger.info('Starting marginalia pattern processing...');
      
      if (!this.container) {
        this.logger.warn('No container found - marginalia processing disabled');
        return false;
      }

      this.logger.debug('Container found', { 
        tagName: this.container.tagName, 
        className: this.container.className,
        childCount: this.container.children.length 
      });

      // Set up pattern configuration
      this.setupPatterns();
      
      const duration = this.logger.timeEnd('initialization');
      this.logger.info(`Marginalia processor initialized in ${duration?.toFixed(2)}ms`);
      return true;
      
    } catch (error) {
      this.logger.error('Initialization failed', error);
      return false;
    }
  }

  /**
   * Process marginalia content - required by ContentProcessor base class
   * @returns {void}
   */
  process() {
    try {
      if (this.logger) {
        this.logger.time('processing');
        this.logger.debug('Starting marginalia processing...');
      }
      
      // Process [m][params][content] patterns
      this.processMarginaliaPatterns();
      
      // Keep existing HTML marginalia working (backward compatibility)
      this.processExistingHtmlMarginalia();
      
      if (this.logger) {
        const duration = this.logger.timeEnd('processing');
        this.logger.debug(`Processing completed: ${this.counter} marginalia processed in ${duration?.toFixed(2)}ms`);
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Processing failed', error);
      }
      throw error;
    }
  }

  /**
   * Set up marginalia pattern configuration
   * @private
   */
  setupPatterns() {
    // Marginalia pattern: [m][voice font-scale width position][content]
    // Examples: [m][2 1.4 40 left][Edward Said argues...] 
    //           [m][1][Quick note]
    // Use pattern from config for consistency
    // FIXED: Made content matching greedy to handle nested brackets like [^2]
    this.marginaliaPattern = this.config.patterns?.marginaliaPattern || /\[m\]\[([^\]]*)\]\[([\s\S]+)\]/g;
    
    this.logger.debug('Pattern configured with greedy matching for nested brackets', { pattern: this.marginaliaPattern.source });
  }

  /**
   * Process all marginalia patterns in the container
   * @private
   */
  processMarginaliaPatterns() {
    this.logger.time('pattern-processing');
    this.logger.group('Pattern Processing');
    
    const paragraphs = this.findAllInContainer(this.config.selectors?.paragraphs || 'p, .marginalia-voice, blockquote, li, div');
    let marginaliaId = 1;
    
    this.logger.debug(`Found ${paragraphs.length} elements to search for marginalia patterns`, {
      selector: this.config.selectors?.paragraphs || 'p, .marginalia-voice, blockquote, li, div',
      pattern: this.marginaliaPattern.source
    });

    paragraphs.forEach((paragraph, paraIndex) => {
      const originalHTML = paragraph.innerHTML;
      let hasMarginalia = false;
      let modifiedHTML = originalHTML;

      // Process all marginalia patterns in this paragraph
      modifiedHTML = modifiedHTML.replace(this.marginaliaPattern, (match, params, content) => {
        this.logger.debug(`Processing marginalia pattern: "${match.substring(0, 50)}..."`);
        hasMarginalia = true;
        
        // Parse parameters
        const parsedParams = this.parseMarginaliaParams(params);
        
        // Store marginalia data
        const marginaliaData = {
          id: `marginalia-${marginaliaId}`,
          content: content,
          voice: parsedParams.voice,
          fontScale: parsedParams.fontScale,
          width: parsedParams.width,
          position: parsedParams.position,
          paragraph: paragraph
        };
        
        this.marginalia.set(marginaliaId, marginaliaData);
        this.logger.debug(`Stored marginalia ${marginaliaId}`, parsedParams);

        // Create marginalia HTML
        const marginaliaHtml = this.createMarginaliaHtml(marginaliaId, marginaliaData);
        
        marginaliaId++;
        this.incrementProcessed();
        return marginaliaHtml;
      });

      if (hasMarginalia) {
        this.logger.debug(`Updated paragraph ${paraIndex} with marginalia`);
        paragraph.innerHTML = modifiedHTML;
      }
    });

    this.counter = marginaliaId - 1;
    this.logger.debug(`Final marginalia count: ${this.counter}`);
    this.logger.groupEnd();
  }

  /**
   * Parse marginalia parameters from pattern
   * @param {string} params - Parameter string (e.g., "2 1.4 40 left")
   * @returns {Object} Parsed parameters
   * @private
   */
  parseMarginaliaParams(params) {
    const parts = params.trim().split(/\s+/);
    
    return {
      voice: this.parseVoice(parts[0]),
      fontScale: this.parseFontScale(parts[1]),
      width: this.parseWidth(parts[2]),
      position: this.parsePosition(parts[3])
    };
  }

  /**
   * Parse voice parameter (1-6)
   * @param {string} value - Voice value
   * @returns {number} Parsed voice
   * @private
   */
  parseVoice(value) {
    if (!value) return this.defaults.voice;
    const voice = parseInt(value);
    return (voice >= 1 && voice <= 6) ? voice : this.defaults.voice;
  }

  /**
   * Parse font scale parameter (0.4-2.5)
   * @param {string} value - Font scale value
   * @returns {number} Parsed font scale
   * @private
   */
  parseFontScale(value) {
    if (!value) return this.defaults.fontScale;
    const scale = parseFloat(value);
    return (scale >= 0.4 && scale <= 2.5) ? scale : this.defaults.fontScale;
  }

  /**
   * Parse width parameter (5-90% of content area)
   * @param {string} value - Width value
   * @returns {number} Parsed width
   * @private
   */
  parseWidth(value) {
    if (!value) return this.defaults.width;
    const width = parseInt(value);
    // Allow wider range: 5-90% to support various marginalia widths
    return (width >= 5 && width <= 90) ? width : this.defaults.width;
  }

  /**
   * Parse position parameter (left/right/l/r)
   * @param {string} value - Position value
   * @returns {string} Parsed position
   * @private
   */
  parsePosition(value) {
    if (!value) return this.defaults.position;
    
    // Normalize to lowercase for comparison
    const normalized = value.toLowerCase().trim();
    
    // Accept both short and long forms
    if (normalized === 'left' || normalized === 'l') return 'left';
    if (normalized === 'right' || normalized === 'r') return 'right';
    
    // Invalid value - use default
    this.logger.warn(`Invalid position "${value}", using default: ${this.defaults.position}`);
    return this.defaults.position;
  }

  /**
   * Create marginalia HTML element
   * @param {number} marginaliaId - Marginalia ID
   * @param {Object} data - Marginalia data
   * @returns {string} HTML string
   * @private
   */
  createMarginaliaHtml(marginaliaId, data) {
    const classes = this.config.classes || {};
    
    return `<div class="${classes.marginalia || 'marginalia-voice'}" 
                 data-voice="${data.voice}"
                 data-font-scale="${data.fontScale}"
                 data-width="${data.width}"
                 data-position="${data.position}"
                 data-marginalia-id="${marginaliaId}">
              ${this.processMarginaliaContent(data.content)}
            </div>`;
  }

  /**
   * Process marginalia content (supports basic markdown-like syntax and multiline formatting)
   * @param {string} content - Raw marginalia content
   * @returns {string} Processed content
   * @private
   */
  processMarginaliaContent(content) {
    // Clean up multiline content while preserving intentional formatting
    const cleanContent = content
      .trim() // Remove leading/trailing whitespace
      .replace(/\n\s*\n/g, '</p><p>') // Double line breaks become paragraph breaks
      .replace(/\n/g, ' ') // Single line breaks become spaces
      .replace(/\s+/g, ' '); // Collapse multiple spaces
    
    // Process markdown-like syntax
    const processed = cleanContent
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Wrap in paragraph tags if we created paragraph breaks
    if (processed.includes('</p><p>')) {
      return `<p>${processed}</p>`;
    }
    
    return processed;
  }

  /**
   * Process existing HTML marginalia for backward compatibility
   * @private
   */
  processExistingHtmlMarginalia() {
    const existingMarginalia = this.findAllInContainer('.marginalia-voice');
    this.logger.debug(`Found ${existingMarginalia.length} existing HTML marginalia elements`);
    
    existingMarginalia.forEach((element, index) => {
      // Ensure existing marginalia have IDs for consistency
      if (!element.dataset.marginaliaId) {
        element.dataset.marginaliaId = `existing-${index + 1}`;
      }
      
      // Fix any missing CSS variables (will be done in CSS update)
      this.enhanceExistingMarginalia(element);
    });
  }

  /**
   * Enhance existing HTML marginalia elements
   * @param {Element} element - Marginalia element
   * @private
   */
  enhanceExistingMarginalia(element) {
    // Add default values for missing attributes
    if (!element.dataset.voice) element.dataset.voice = '1';
    if (!element.dataset.fontScale) element.dataset.fontScale = '1.0';
    if (!element.dataset.width) element.dataset.width = '30';
    if (!element.dataset.position) element.dataset.position = 'right';
  }

  /**
   * Clean up marginalia processor resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    this.logger.debug('Cleaning up marginalia system...');
    
    // Clear marginalia data
    this.marginalia.clear();
    this.counter = 0;
    
    this.baseCleanup();
    this.logger.debug('Cleanup completed');
  }

  /**
   * Get marginalia statistics
   * @returns {Object} Statistics
   */
  getStats() {
    const baseStats = super.getStats();
    
    return {
      ...baseStats,
      totalMarginalia: this.counter,
      patternMarginalia: this.marginalia.size,
      existingMarginalia: this.findAllInContainer('.marginalia-voice[data-marginalia-id^="existing-"]').length
    };
  }

  /**
   * Debug information
   */
  debug() {
    console.group('[MARGINALIA_PROCESSOR] Debug Information');
    
    const stats = this.getStats();
    console.log('Marginalia Stats:', stats);
    
    console.log('Pattern:', this.marginaliaPattern);
    console.log('Defaults:', this.defaults);
    console.log('Processed Marginalia:', Array.from(this.marginalia.entries()));
    
    console.groupEnd();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarginaliaProcessor;
}