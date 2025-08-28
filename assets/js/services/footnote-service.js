/**
 * FootnoteService - Clean footnote system following architectural principles
 * 
 * Implementation of FootnoteService from ARCHITECTURAL_OVERHAUL_PLAN.md
 * Single responsibility: Footnote tooltip management with proper error handling
 * 
 * Created: August 27, 2025
 * Based on: ARCHITECTURAL_OVERHAUL_PLAN.md
 */

class FootnoteService {
  constructor(coordinator) {
    this.name = 'FootnoteService';
    this.version = '1.0.0';
    this.coordinator = coordinator;
    this.eventBus = coordinator.eventBus;
    this.cssManager = coordinator.cssManager;
    this.layerManager = coordinator.layerManager;
    this.initialized = false;
    this.disabled = false;
    this.tooltips = new Map();
    this.footnoteRefs = [];
    this.footnoteContent = new Map();
    
    console.log(`📝 ${this.name} v${this.version} created`);
  }

  /**
   * Health check - TDD anchor
   * @returns {Promise<Object>} Health check results
   */
  static async healthCheck() {
    const results = {
      footnoteRefsFound: document.querySelectorAll('.footnote-ref').length > 0,
      footnoteContentFound: document.querySelectorAll('[data-ref]').length > 0,
      cssLoaded: !!getComputedStyle(document.body).getPropertyValue('--footnote-accent'),
      domReady: document.readyState === 'complete' || document.readyState === 'interactive'
    };
    
    console.log('🏥 FootnoteService health check:', results);
    
    // All checks must pass
    const allHealthy = Object.values(results).every(v => v === true);
    if (!allHealthy) {
      throw new Error(`FootnoteService health check failed: ${JSON.stringify(results)}`);
    }
    
    return results;
  }

  /**
   * Initialize footnote service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    if (this.initialized) {
      console.warn('⚠️ FootnoteService already initialized');
      return true;
    }

    try {
      console.log('🔄 Initializing FootnoteService...');

      // Request appropriate z-index layer
      const zIndex = this.layerManager.requestLayer('footnotes', 'TOOLTIPS');

      // Inject scoped CSS
      this.cssManager.injectCSS('footnotes', this.getCSS(zIndex));

      // Find and process footnotes
      await this.discoverFootnotes();

      // Set up event listeners
      this.setupEventListeners();

      // Listen for exclusive mode
      this.eventBus.on('system:exclusive:start', (data) => {
        if (data.systemName !== 'footnotes') {
          this.disableInteractions();
        }
      });

      this.eventBus.on('system:exclusive:end', () => {
        this.enableInteractions();
      });

      this.initialized = true;
      console.log(`✅ FootnoteService initialized with ${this.footnoteRefs.length} footnote refs`);
      
      return true;

    } catch (error) {
      console.error('❌ FootnoteService initialization failed:', error);
      return false;
    }
  }

  /**
   * Discover footnotes in the document
   * @returns {Promise<void>}
   * @private
   */
  async discoverFootnotes() {
    // Find footnote references
    this.footnoteRefs = Array.from(document.querySelectorAll('.footnote-ref a'));
    console.log(`📝 Found ${this.footnoteRefs.length} footnote references`);

    // Find footnote content
    const contentElements = document.querySelectorAll('[data-ref]');
    console.log(`📝 Found ${contentElements.length} footnote content elements`);

    // Map content by reference number
    contentElements.forEach(element => {
      const refNumber = element.getAttribute('data-ref');
      if (refNumber) {
        this.footnoteContent.set(refNumber, {
          element,
          text: element.textContent,
          html: element.innerHTML
        });
      }
    });

    console.log(`📝 Mapped ${this.footnoteContent.size} footnote content items`);
  }

  /**
   * Set up event listeners with proper delegation
   * @private
   */
  setupEventListeners() {
    // Use event delegation for better performance
    document.addEventListener('mouseenter', (e) => {
      if (e.target?.closest?.('.footnote-ref a') && !this.disabled) {
        this.showTooltip(e);
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      if (e.target?.closest?.('.footnote-ref a')) {
        this.hideTooltip(e);
      }
    }, true);

    // Focus/blur for keyboard accessibility
    document.addEventListener('focus', (e) => {
      if (e.target?.closest?.('.footnote-ref a') && !this.disabled) {
        this.showTooltip(e);
      }
    }, true);

    document.addEventListener('blur', (e) => {
      if (e.target?.closest?.('.footnote-ref a')) {
        setTimeout(() => this.hideTooltip(e), 150);
      }
    }, true);

    console.log('👂 FootnoteService event listeners registered');
  }

  /**
   * Show tooltip for footnote reference
   * @param {Event} event - Mouse/focus event
   * @private
   */
  showTooltip(event) {
    try {
      const link = event.target?.closest?.('.footnote-ref a');
      if (!link) return;

      // Extract footnote number from href (#fn-1 -> 1)
      const href = link.getAttribute('href');
      const match = href.match(/#fn-(\w+)/);
      if (!match) return;

      const refNumber = match[1];
      const content = this.footnoteContent.get(refNumber);
      
      if (!content) {
        console.warn(`⚠️ No content found for footnote ${refNumber}`);
        return;
      }

      // Create or update tooltip
      let tooltip = this.tooltips.get(refNumber);
      if (!tooltip) {
        tooltip = this.createTooltip(refNumber, content.text);
        this.tooltips.set(refNumber, tooltip);
      }

      // Position and show tooltip
      this.positionTooltip(tooltip, link);
      tooltip.style.display = 'block';
      tooltip.style.visibility = 'visible';

      console.log(`💬 Showing tooltip for footnote ${refNumber}`);

    } catch (error) {
      console.error('❌ Error showing tooltip:', error);
    }
  }

  /**
   * Hide tooltip for footnote reference
   * @param {Event} event - Mouse/blur event
   * @private
   */
  hideTooltip(event) {
    try {
      const link = event.target?.closest?.('.footnote-ref a');
      if (!link) return;

      const href = link.getAttribute('href');
      const match = href.match(/#fn-(\w+)/);
      if (!match) return;

      const refNumber = match[1];
      const tooltip = this.tooltips.get(refNumber);
      
      if (tooltip) {
        tooltip.style.display = 'none';
        tooltip.style.visibility = 'hidden';
        console.log(`🫥 Hiding tooltip for footnote ${refNumber}`);
      }

    } catch (error) {
      console.error('❌ Error hiding tooltip:', error);
    }
  }

  /**
   * Create tooltip element
   * @param {string} refNumber - Footnote reference number
   * @param {string} text - Tooltip text content
   * @returns {HTMLElement} Tooltip element
   * @private
   */
  createTooltip(refNumber, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'footnote-tooltip';
    tooltip.id = `footnote-tooltip-${refNumber}`;
    tooltip.textContent = text;
    
    // Apply initial styles
    tooltip.style.cssText = `
      position: fixed;
      display: none;
      visibility: hidden;
      max-width: 300px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      pointer-events: none;
    `;

    document.body.appendChild(tooltip);
    console.log(`📦 Created tooltip for footnote ${refNumber}`);
    
    return tooltip;
  }

  /**
   * Position tooltip relative to trigger element
   * @param {HTMLElement} tooltip - Tooltip element
   * @param {HTMLElement} trigger - Trigger element
   * @private
   */
  positionTooltip(tooltip, trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Show tooltip to measure dimensions
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'hidden';
    
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Calculate position
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
    let top = triggerRect.top - tooltipRect.height - 10;
    
    // Adjust if tooltip would go off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    
    if (top < 10) {
      // Show below trigger if not enough space above
      top = triggerRect.bottom + 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  /**
   * Disable interactions during exclusive mode
   * @private
   */
  disableInteractions() {
    this.disabled = true;
    document.body.classList.add('footnotes-disabled');
    console.log('🔒 FootnoteService interactions disabled');
  }

  /**
   * Enable interactions after exclusive mode
   * @private
   */
  enableInteractions() {
    this.disabled = false;
    document.body.classList.remove('footnotes-disabled');
    console.log('🔓 FootnoteService interactions enabled');
  }

  /**
   * Get CSS for footnotes with proper z-index
   * @param {number} zIndex - Z-index from layer manager
   * @returns {string} CSS content
   * @private
   */
  getCSS(zIndex) {
    return `
      .footnotes-disabled .footnote-ref {
        pointer-events: none !important;
      }
      
      .footnote-tooltip {
        z-index: ${zIndex};
        background: var(--footnote-bg, rgba(0, 0, 0, 0.95));
        color: var(--footnote-accent, #00ff00);
        border: var(--footnote-border, 1px solid #008800);
        padding: 10px;
        border-radius: 4px;
        font-family: var(--footnote-font, 'JetBrains Mono', monospace);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: opacity 0.2s ease;
      }
      
      .footnote-tooltip::before {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid var(--footnote-border, #008800);
      }
    `;
  }

  /**
   * Get service statistics
   * @returns {Object} Service statistics
   */
  getStats() {
    return {
      initialized: this.initialized,
      footnoteRefs: this.footnoteRefs.length,
      footnoteContent: this.footnoteContent.size,
      activeTooltips: this.tooltips.size,
      disabled: this.disabled
    };
  }

  /**
   * Cleanup service resources
   */
  cleanup() {
    // Remove tooltips
    for (const tooltip of this.tooltips.values()) {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    }
    this.tooltips.clear();

    // Remove CSS
    this.cssManager.removeCSS('footnotes');

    // Clear references
    this.footnoteRefs = [];
    this.footnoteContent.clear();

    this.initialized = false;
    console.log('🧹 FootnoteService cleaned up');
  }
}

// Export
window.FootnoteService = FootnoteService;

console.log('📝 FootnoteService loaded - clean architecture implementation');