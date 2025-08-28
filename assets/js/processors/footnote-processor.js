/**
 * Content Enhancement System - Footnote Processor
 * Handles [^N] pattern processing, tooltips, and footnote collections
 * 
 * Philosophy: Preserves simple [^N] syntax for easy Ghost editor workflow
 * while providing rich interactive footnote functionality
 * 
 * Created: August 23, 2025
 */

class FootnoteProcessor extends ContentProcessor {
  constructor(config, container) {
    super(config, container);
    
    // Footnote-specific state
    this.footnotes = new Map();
    this.tooltips = new Map();
    this.counter = 0;
    
    // Debug mode from Ghost settings
    this.debugMode = window.ghost_custom_settings?.debug_mode || false;
  }

  /**
   * Debug logging helper - only logs if debug mode is enabled
   * @param {...any} args - Arguments to log
   */
  debugLog(...args) {
    if (this.debugMode) {
      console.log('[FOOTNOTE_DEBUG]', ...args);
    }
  }

  /**
   * Initialize footnote processor
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    try {
      await this.baseInit();
      
      // Validate footnote-specific configuration
      if (!this.config.patterns?.footnotePattern) {
        throw new Error('Footnote pattern configuration is required');
      }

      this.debugLog(`Initialized with pattern: ${this.config.patterns.footnotePattern}`);
      return true;
    } catch (error) {
      console.error('[FOOTNOTE_PROCESSOR] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Process all footnote patterns and content
   * @returns {void}
   */
  async process() {
    try {
      // Create progressive enhancement fallback if enabled
      this.createProgressiveEnhancement();
      
      // Main processing pipeline
      this.processFootnoteMarkers();
      this.connectFootnoteContent();
      this.createFootnoteCollection();
      this.enhanceInteractions();
      this.markSystemReady();

      this.statistics.endTime = performance.now();
      console.log(`[FOOTNOTE_PROCESSOR] Processing completed: ${this.footnotes.size} footnotes processed`);
    } catch (error) {
      this.incrementErrors();
      console.error('[FOOTNOTE_PROCESSOR] Processing failed:', error);
      throw error;
    }
  }

  /**
   * Clean up footnote processor resources
   * @returns {void}
   */
  cleanup() {
    // Remove event listeners
    const footnoteLinks = this.findAllInContainer(`.${this.config.classes?.footnoteLink || 'footnote-link'}`);
    footnoteLinks.forEach(link => {
      link.removeEventListener('click', this.handleFootnoteLinkClick);
      link.removeEventListener('mouseenter', this.handleMouseEnter);
      link.removeEventListener('mouseleave', this.handleMouseLeave);
    });

    // Remove tooltips from DOM
    this.tooltips.forEach(tooltip => {
      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    });

    // Clear state
    this.footnotes.clear();
    this.tooltips.clear();
    this.counter = 0;

    this.baseCleanup();
  }

  /**
   * Create progressive enhancement fallback for non-JavaScript users
   * Preserves the philosophy that content should work without JavaScript
   * @private
   */
  createProgressiveEnhancement() {
    if (!this.config.processing?.fallbackEnabled) return;

    const pattern = this.config.patterns.footnotePattern;
    const paragraphs = this.findAllInContainer(this.config.selectors?.paragraphs || 'p');
    const footnoteCards = document.querySelectorAll(this.config.selectors?.footnoteCards || '[data-ref]');

    if (footnoteCards.length === 0) return;

    // Create fallback container
    const fallbackSection = this.createElement('div', `${this.config.classes?.footnoteCollection || 'footnote-collection'}-fallback`);
    fallbackSection.innerHTML = `
      <hr role="separator">
      <h4>Notes</h4>
      <ol class="footnote-fallback-list" role="list"></ol>
    `;

    const fallbackList = fallbackSection.querySelector('.footnote-fallback-list');

    // Process footnote cards
    footnoteCards.forEach(card => {
      const refNum = card.getAttribute(this.config.patterns?.referenceAttribute || 'data-ref');
      const listItem = this.createElement('li');
      listItem.innerHTML = `<span id="fallback-fn-${refNum}">${card.innerHTML}</span>`;
      fallbackList.appendChild(listItem);
    });

    this.container.appendChild(fallbackSection);

    // Create fallback links in paragraphs
    paragraphs.forEach(paragraph => {
      const originalHTML = paragraph.innerHTML;
      const modifiedHTML = originalHTML.replace(pattern, (match, num) => {
        return `<sup><a href="#fallback-fn-${num}" class="footnote-fallback-link">${num}</a></sup>`;
      });
      
      if (modifiedHTML !== originalHTML) {
        paragraph.innerHTML = modifiedHTML;
      }
    });

    console.log('[FOOTNOTE_PROCESSOR] Progressive enhancement fallback created');
  }

  /**
   * Process [^N] patterns into semantic footnote references
   * Core method that transforms simple editor patterns into rich footnotes
   * @private
   */
  processFootnoteMarkers() {
    console.group('[FOOTNOTE_PROCESSOR] Pattern Processing Debug');
    
    const pattern = this.config.patterns.footnotePattern;
    const paragraphs = this.findAllInContainer(this.config.selectors?.paragraphs || 'p, .marginalia-voice, blockquote, li');
    let globalNumber = 1;
    
    console.log(`Pattern: ${pattern}`);
    console.log(`Found ${paragraphs.length} paragraphs to search`);

    paragraphs.forEach((paragraph, paraIndex) => {
      const originalHTML = paragraph.innerHTML;
      let hasFootnotes = false;

      const modifiedHTML = originalHTML.replace(pattern, (match, originalNum) => {
        console.log(`✅ Processing match: "${match}" → originalNum: "${originalNum}"`);
        hasFootnotes = true;
        
        // Store footnote data
        this.footnotes.set(globalNumber, {
          id: `footnote-${globalNumber}`,
          backrefId: `fnref-${globalNumber}`,
          originalNumber: originalNum,
          globalNumber: globalNumber,
          paragraph: paragraph,
          content: null,
          isExtension: false // Will be determined when connecting content
        });

        this.debugLog(`✅ Stored footnote ${globalNumber} with originalNumber: "${originalNum}"`);

        // Create semantic footnote reference
        const ref = this.createFootnoteReference(globalNumber, originalNum);
        globalNumber++;
        this.incrementProcessed();
        return ref;
      });

      if (hasFootnotes) {
        console.log(`✅ Updated paragraph ${paraIndex} HTML`);
        paragraph.innerHTML = modifiedHTML;
      }
    });

    this.counter = globalNumber - 1;
    this.debugLog(`Final footnotes count: ${this.counter}`);
    if (this.debugMode) console.groupEnd();
  }

  /**
   * Create accessible footnote reference HTML
   * Preserves the visual philosophy while adding semantic richness
   * @param {number} globalNum - Global footnote number
   * @param {string} originalNum - Original number from [^N] pattern
   * @returns {string} HTML for footnote reference
   * @private
   */
  createFootnoteReference(globalNum, originalNum) {
    const footnoteData = this.footnotes.get(globalNum);
    const classes = this.config.classes || {};
    
    // Visual styling respects theme system
    const baseColor = this.config.themes?.[this.config.theme]?.['--footnote-accent'] || '#00ff00';
    const extensionColor = this.config.themes?.[this.config.theme]?.['--extension-accent'] || '#ff8800';
    
    // Extensions will be marked visually differently
    const displayNumber = footnoteData.isExtension ? `${globalNum}+` : globalNum;
    const color = footnoteData.isExtension ? extensionColor : baseColor;
    const extensionClass = footnoteData.isExtension ? 'footnote-extension' : '';
    
    return `<sup style="color: ${color}; font-family: var(--footnote-font, 'JetBrains Mono', monospace); font-size: 0.75em; cursor: pointer; text-shadow: 0 0 3px ${color};" class="${classes.footnoteRef || 'footnote-ref'} ${extensionClass}" id="${footnoteData.backrefId}">
      <a href="#${footnoteData.id}" 
         data-footnote="${globalNum}" 
         data-is-extension="${footnoteData.isExtension}"
         class="${classes.footnoteLink || 'footnote-link'}"
         role="doc-noteref"
         aria-describedby="${footnoteData.id}"
         aria-label="Footnote ${globalNum}${footnoteData.isExtension ? ' with extension' : ''}"
         style="color: inherit; text-decoration: none;"
         tabindex="0">${displayNumber}</a>
    </sup>`;
  }

  /**
   * Connect footnote references to HTML card content
   * Handles the data-ref matching that enables the simple HTML format
   * @private
   */
  connectFootnoteContent() {
    if (this.debugMode) console.group('[FOOTNOTE_PROCESSOR] Connection Debug');
    
    // Search globally since Ghost may place footnote cards outside container
    const footnoteCards = document.querySelectorAll(this.config.selectors?.footnoteCards || '[data-ref]');
    this.debugLog(`Found ${footnoteCards.length} footnote cards`);
    
    footnoteCards.forEach((card, index) => {
      const refNumber = parseInt(card.getAttribute(this.config.patterns?.referenceAttribute || 'data-ref'));
      this.debugLog(`Card ${index + 1}: data-ref="${refNumber}"`);
      
      let matched = false;
      // Find corresponding footnote
      for (let [globalNum, footnoteData] of this.footnotes) {
        console.log(`  Checking against footnote ${globalNum}: originalNumber=${footnoteData.originalNumber}`);
        
        if (footnoteData.originalNumber == refNumber || globalNum == refNumber) {
          console.log(`  ✅ MATCH FOUND: footnote ${globalNum} ↔ data-ref="${refNumber}"`);
          footnoteData.content = card;
          footnoteData.contentHTML = this.sanitizeHTML(card.innerHTML);
          card.id = `footnote-content-${globalNum}`;
          
          // Check for extension attribute (preserves existing data-extension="true" system)
          footnoteData.isExtension = card.getAttribute('data-extension') === 'true';
          if (footnoteData.isExtension) {
            console.log(`  📝 EXTENSION detected for footnote ${globalNum}`);
            // Update the visual appearance of the reference
            this.updateReferenceForExtension(globalNum);
          }
          
          // Hide original HTML card to prevent duplicates
          card.style.display = 'none';
          console.log(`  ✅ HIDDEN original HTML card to prevent duplicate`);
          
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        console.log(`  ❌ NO MATCH for data-ref="${refNumber}"`);
      }
    });
    
    if (this.debugMode) console.groupEnd();
  }

  /**
   * Update footnote reference visual appearance for extensions
   * @param {number} globalNum - Global footnote number
   * @private
   */
  updateReferenceForExtension(globalNum) {
    const footnoteData = this.footnotes.get(globalNum);
    const linkElement = document.querySelector(`[data-footnote="${globalNum}"]`);
    
    if (linkElement && footnoteData.isExtension) {
      // Update display number
      linkElement.textContent = `${globalNum}+`;
      linkElement.setAttribute('data-is-extension', 'true');
      linkElement.setAttribute('aria-label', `Footnote ${globalNum} with extension`);
      
      // Update color
      const extensionColor = this.config.themes?.[this.config.theme]?.['--extension-accent'] || '#ff8800';
      linkElement.parentElement.style.color = extensionColor;
      linkElement.parentElement.style.textShadow = `0 0 3px ${extensionColor}`;
      linkElement.parentElement.classList.add('footnote-extension');
    }
  }

  /**
   * Create organized footnote collection at bottom of content
   * @private
   */
  createFootnoteCollection() {
    let collection = this.findInContainer(`.${this.config.classes?.footnoteCollection || 'footnote-collection'}`);
    
    if (!collection && this.footnotes.size > 0) {
      collection = this.createElement('div', this.config.classes?.footnoteCollection || 'footnote-collection');
      this.setAttributes(collection, {
        'role': 'doc-endnotes',
        'aria-label': 'Footnotes'
      });

      collection.innerHTML = `
        <hr class="footnote-separator" role="separator">
        <h4 class="footnote-title">Notes</h4>
        <div class="${this.config.classes?.footnoteList || 'footnote-list'}" role="list"></div>
      `;

      this.container.appendChild(collection);
    }

    const list = collection?.querySelector(`.${this.config.classes?.footnoteList || 'footnote-list'}`);
    if (list) {
      list.innerHTML = '';
      
      this.footnotes.forEach((footnoteData, globalNum) => {
        if (footnoteData.content) {
          const item = this.createFootnoteItem(footnoteData, globalNum);
          list.appendChild(item);
        }
      });
    }
  }

  /**
   * Create footnote item with proper semantic structure
   * @param {Object} footnoteData - Footnote data object
   * @param {number} globalNum - Global footnote number
   * @returns {Element} Footnote item element
   * @private
   */
  createFootnoteItem(footnoteData, globalNum) {
    const item = this.createElement('div', this.config.classes?.footnoteItem || 'footnote-item');
    this.setAttributes(item, {
      'id': footnoteData.id,
      'role': 'doc-endnote'
    });
    
    // Apply themed styling
    const accentColor = footnoteData.isExtension 
      ? (this.config.themes?.[this.config.theme]?.['--extension-accent'] || '#ff8800')
      : (this.config.themes?.[this.config.theme]?.['--footnote-accent'] || '#00ff00');
      
    this.setStyles(item, {
      border: `1px solid ${accentColor}`,
      backgroundColor: `${accentColor}0D`, // 5% opacity
      padding: '1rem',
      margin: '1rem 0',
      fontFamily: 'var(--footnote-font, "JetBrains Mono", monospace)',
      fontSize: '0.9em',
      borderLeft: `4px solid ${accentColor}`,
      boxShadow: `0 0 10px ${accentColor}1A` // 10% opacity
    });

    item.innerHTML = `
      <span class="footnote-number">
        <a href="#${footnoteData.backrefId}" 
           class="${this.config.classes?.footnoteBackref || 'footnote-backref'}" 
           data-target="${footnoteData.backrefId}"
           role="doc-backlink"
           aria-label="Return to footnote ${globalNum} reference in text"
           style="color: ${accentColor}; text-decoration: none; font-weight: bold;"
           tabindex="0">${globalNum}${footnoteData.isExtension ? '+' : ''}</a>
      </span>
      <div class="footnote-content">${footnoteData.contentHTML}</div>
    `;

    return item;
  }

  /**
   * Add interaction behaviors (event handling)
   * @private
   */
  enhanceInteractions() {
    if (!this.config.behavior?.enableKeyboardNav && !this.config.behavior?.enableTooltips) return;

    // Footnote reference interactions
    const footnoteLinks = this.findAllInContainer(`.${this.config.classes?.footnoteLink || 'footnote-link'}`);
    footnoteLinks.forEach(link => {
      this.addFootnoteLinkBehaviors(link);
    });

    // Back-reference interactions
    const backrefLinks = this.findAllInContainer(`.${this.config.classes?.footnoteBackref || 'footnote-backref'}`);
    backrefLinks.forEach(link => {
      this.addBackrefLinkBehaviors(link);
    });

    this.debugLog(`Enhanced ${footnoteLinks.length} footnote links and ${backrefLinks.length} back-references`);
  }

  /**
   * Add behaviors to footnote reference links
   * @param {Element} link - Footnote link element
   * @private
   */
  addFootnoteLinkBehaviors(link) {
    const footnoteNum = parseInt(link.dataset.footnote);
    const isExtension = link.dataset.isExtension === 'true';

    // Different behavior for extensions vs regular footnotes
    if (isExtension) {
      // Extensions: click to expand inline (preserving existing behavior)
      const clickHandler = (e) => {
        if (e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
        e.preventDefault();
        this.toggleInlineExtension(footnoteNum, link);
      };
      
      link.addEventListener('click', clickHandler);
      link.addEventListener('keydown', clickHandler);
    } else {
      // Regular footnotes: navigate to collection
      const clickHandler = (e) => {
        if (e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
        e.preventDefault();
        this.navigateToFootnote(`footnote-${footnoteNum}`);
      };
      
      link.addEventListener('click', clickHandler);
      link.addEventListener('keydown', clickHandler);
    }

    // Tooltips for both types
    if (this.config.behavior?.enableTooltips) {
      link.addEventListener('mouseenter', (e) => this.showTooltip(e, footnoteNum));
      link.addEventListener('mouseleave', () => this.hideTooltip(footnoteNum));
      link.addEventListener('focus', (e) => this.showTooltip(e, footnoteNum));
      link.addEventListener('blur', () => {
        setTimeout(() => this.hideTooltip(footnoteNum), this.config.behavior.tooltipDelay || 150);
      });
    }
  }

  /**
   * Add behaviors to back-reference links
   * @param {Element} link - Back-reference link element
   * @private
   */
  addBackrefLinkBehaviors(link) {
    const clickHandler = (e) => {
      if (e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
      e.preventDefault();
      this.navigateToFootnote(link.dataset.target);
    };
    
    link.addEventListener('click', clickHandler);
    link.addEventListener('keydown', clickHandler);
  }

  /**
   * Navigate to footnote with smooth scrolling
   * @param {string} elementId - Target element ID
   * @private
   */
  navigateToFootnote(elementId) {
    if (!this.config.behavior?.enableSmoothScrolling) {
      location.hash = elementId;
      return;
    }

    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: this.config.behavior.scrollOffset || 'center'
    });

    // Brief highlight effect
    targetElement.style.animation = 'var(--footnote-highlight, highlight 1s ease-out)';
    setTimeout(() => {
      targetElement.style.animation = '';
    }, 1000);
  }

  /**
   * Show tooltip for footnote
   * @param {Event} event - Mouse or focus event
   * @param {number} footnoteNum - Footnote number
   * @private
   */
  showTooltip(event, footnoteNum) {
    const footnoteData = this.footnotes.get(footnoteNum);
    if (!footnoteData?.content) return;

    // Get or create tooltip
    let tooltip = this.tooltips.get(footnoteNum);
    if (!tooltip) {
      tooltip = this.createElement('div', this.config.classes?.footnoteTooltip || 'footnote-tooltip');
      
      const cleanContent = this.extractCleanContent(footnoteData.contentHTML);
      tooltip.innerHTML = cleanContent;
      
      // Add arrow
      const arrow = this.createElement('div', 'footnote-tooltip-arrow');
      tooltip.appendChild(arrow);
      
      document.body.appendChild(tooltip);
      this.tooltips.set(footnoteNum, tooltip);
    }

    // Position tooltip (preserving existing positioning logic)
    this.positionTooltip(tooltip, event);
  }

  /**
   * Position tooltip relative to trigger element
   * Preserves existing positioning logic with viewport constraints
   * @param {Element} tooltip - Tooltip element
   * @param {Event} event - Trigger event
   * @private
   */
  positionTooltip(tooltip, event) {
    // Show tooltip to measure it
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'hidden';
    
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Safe margins from screen edges
    const HORIZONTAL_MARGIN = 20;
    const VERTICAL_MARGIN = 40;
    const ARROW_SIZE = 8;
    
    // Calculate initial position (centered under footnote)
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.bottom + ARROW_SIZE + 5;
    let arrowLeft = 50; // percentage
    let arrowClass = 'arrow-top';
    
    // Constrain horizontally - MUST stay within screen
    const minLeft = HORIZONTAL_MARGIN;
    const maxLeft = viewportWidth - tooltipRect.width - HORIZONTAL_MARGIN;
    
    if (left < minLeft) {
      left = minLeft;
      arrowLeft = ((rect.left + rect.width/2 - left) / tooltipRect.width) * 100;
    } else if (left > maxLeft) {
      left = maxLeft;
      arrowLeft = ((rect.left + rect.width/2 - left) / tooltipRect.width) * 100;
    }
    
    // Constrain arrow position
    arrowLeft = Math.max(10, Math.min(90, arrowLeft));
    
    // Vertical positioning - allow overflow but with limits
    const maxAllowedHeight = viewportHeight - VERTICAL_MARGIN;
    
    if (tooltipRect.height > maxAllowedHeight * 0.7 || 
        top + tooltipRect.height > viewportHeight + maxAllowedHeight) {
      // Show above footnote instead
      top = rect.top - tooltipRect.height - ARROW_SIZE - 5;
      arrowClass = 'arrow-bottom';
    }
    
    // Final constraint
    if (top < -maxAllowedHeight) {
      top = -maxAllowedHeight + VERTICAL_MARGIN;
      arrowClass = 'arrow-top';
    }

    // Apply positioning
    this.setStyles(tooltip, {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: '1000',
      display: 'block',
      visibility: 'visible'
    });
    
    // Position arrow
    const arrow = tooltip.querySelector('.footnote-tooltip-arrow');
    if (arrow) {
      arrow.className = `footnote-tooltip-arrow ${arrowClass}`;
      arrow.style.left = `${arrowLeft}%`;
    }
  }

  /**
   * Hide tooltip for footnote
   * @param {number} footnoteNum - Footnote number
   * @private
   */
  hideTooltip(footnoteNum) {
    const tooltip = this.tooltips.get(footnoteNum);
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  /**
   * Toggle inline extension display (preserves existing extension functionality)
   * @param {number} footnoteNum - Footnote number
   * @param {Element} linkElement - Footnote link element
   * @private
   */
  toggleInlineExtension(footnoteNum, linkElement) {
    const footnoteData = this.footnotes.get(footnoteNum);
    if (!footnoteData?.contentHTML || !footnoteData.isExtension) return;

    const existingBox = document.getElementById(`extension-box-${footnoteNum}`);
    
    if (existingBox) {
      // Toggle existing box
      if (existingBox.style.display === 'none') {
        existingBox.style.display = 'block';
        linkElement.classList.add('extension-expanded');
      } else {
        existingBox.style.display = 'none';
        linkElement.classList.remove('extension-expanded');
      }
      return;
    }

    // Create new extension box
    const extensionBox = this.createElement('div', 'footnote-extension-box');
    extensionBox.id = `extension-box-${footnoteNum}`;
    extensionBox.innerHTML = `
      <div class="extension-header">
        <span class="extension-label">Extended Note ${footnoteNum}</span>
        <button class="extension-close" aria-label="Close extension">×</button>
      </div>
      <div class="extension-content">
        ${footnoteData.contentHTML}
      </div>
    `;

    // Find the paragraph containing the footnote link
    let targetParagraph = linkElement.closest('p, .marginalia-voice, blockquote, li');
    if (!targetParagraph) {
      targetParagraph = linkElement.parentElement;
    }

    // Insert after the paragraph
    targetParagraph.insertAdjacentElement('afterend', extensionBox);

    // Add close button behavior
    const closeBtn = extensionBox.querySelector('.extension-close');
    closeBtn.addEventListener('click', () => {
      extensionBox.style.display = 'none';
      linkElement.classList.remove('extension-expanded');
    });

    // Mark link as expanded
    linkElement.classList.add('extension-expanded');

    this.debugLog(`Created inline extension for footnote ${footnoteNum}`);
  }

  /**
   * Mark system as ready and remove fallbacks
   * @private
   */
  markSystemReady() {
    this.container.classList.add(this.config.classes?.systemEnhanced || 'footnote-system-enhanced');
    
    // Remove fallback elements
    const fallbackSection = this.findInContainer(`.${this.config.classes?.footnoteCollection || 'footnote-collection'}-fallback`);
    if (fallbackSection) {
      fallbackSection.remove();
    }

    console.log('[FOOTNOTE_PROCESSOR] System marked as ready, fallbacks removed');
  }

  /**
   * Extract clean content for tooltips (removes duplicates and footnote markers)
   * @param {string} html - HTML content to clean
   * @returns {string} Cleaned HTML
   * @private
   */
  extractCleanContent(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove nested footnote markers that might cause duplicates
    const footnoteMarkers = temp.querySelectorAll('strong, sup, .footnote-ref, .footnote-link, [data-footnote]');
    footnoteMarkers.forEach(marker => {
      const text = marker.textContent.trim();
      if (/^[\d¹²³⁴⁵⁶⁷⁸⁹⁰]+$/.test(text)) {
        marker.remove();
      }
    });
    
    // Clean up footnote patterns
    let cleanText = temp.innerHTML
      .replace(/\[\^(\d+)\]/g, '')
      .replace(/^[\d¹²³⁴⁵⁶⁷⁸⁹⁰\s]*/, '')
      .trim();
    
    return this.sanitizeHTML(cleanText);
  }

  /**
   * Get footnote-specific statistics
   * @returns {Object} Enhanced statistics
   */
  getStats() {
    const baseStats = super.getStats();
    return {
      ...baseStats,
      footnoteCount: this.footnotes.size,
      tooltipCount: this.tooltips.size,
      extensionCount: Array.from(this.footnotes.values()).filter(f => f.isExtension).length,
      counter: this.counter
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FootnoteProcessor;
}