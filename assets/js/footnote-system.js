/**
 * Digital Talmud Footnote System - Logic Layer
 * Pure logic implementation separated from styling concerns
 * Configurable, maintainable, future-proof architecture
 */

class FootnoteSystem {
  constructor(config = window.DigitalTalmudFootnoteConfig) {
    this.config = config;
    this.container = null;
    this.footnotes = new Map();
    this.tooltips = new Map();
    this.counter = 0;
    
    this.init();
  }

  init() {
    // Validate configuration
    if (!this.config || !this.config.validate()) {
      console.error('[FOOTNOTE_SYSTEM] Invalid configuration');
      return false;
    }

    // Find container
    this.container = document.querySelector(this.config.selectors.container);
    if (!this.container) {
      console.warn('[FOOTNOTE_SYSTEM] Container not found');
      return false;
    }

    try {
      // Initialize system
      this.createProgressiveEnhancement();
      this.processFootnoteMarkers();
      this.connectFootnoteContent();
      this.createFootnoteCollection();
      this.enhanceInteractions();
      this.markSystemReady();
      
      console.log(`[FOOTNOTE_SYSTEM] Initialized: ${this.footnotes.size} footnotes`);
      return true;
    } catch (error) {
      console.error('[FOOTNOTE_SYSTEM] Initialization failed:', error);
      return false;
    }
  }

  // Pure logic - creates semantic HTML structure
  createProgressiveEnhancement() {
    if (!this.config.processing.fallbackEnabled) return;

    const pattern = this.config.processing.footnotePattern;
    const paragraphs = this.container.querySelectorAll(this.config.selectors.paragraphs);
    const footnoteCards = this.container.querySelectorAll(this.config.selectors.footnoteCards);

    if (footnoteCards.length === 0) return;

    // Create fallback container
    const fallbackSection = this.createElement('div', this.config.classes.footnoteCollection + '-fallback');
    fallbackSection.innerHTML = `
      <hr role="separator">
      <h4>Notes</h4>
      <ol class="footnote-fallback-list" role="list"></ol>
    `;

    const fallbackList = fallbackSection.querySelector('.footnote-fallback-list');

    // Process footnote cards
    footnoteCards.forEach(card => {
      const refNum = card.getAttribute(this.config.processing.referenceAttribute);
      const listItem = this.createElement('li');
      listItem.innerHTML = `<span id="fallback-fn-${refNum}">${card.innerHTML}</span>`;
      fallbackList.appendChild(listItem);
    });

    this.container.appendChild(fallbackSection);

    // Create fallback links
    paragraphs.forEach(paragraph => {
      const originalHTML = paragraph.innerHTML;
      const modifiedHTML = originalHTML.replace(pattern, (match, num) => {
        return `<sup><a href="#fallback-fn-${num}" class="footnote-fallback-link">${num}</a></sup>`;
      });
      
      if (modifiedHTML !== originalHTML) {
        paragraph.innerHTML = modifiedHTML;
      }
    });
  }

  // Process [^1] patterns into semantic footnote references
  processFootnoteMarkers() {
    console.group('[FOOTNOTE_SYSTEM] Pattern Processing Debug');
    
    const pattern = this.config.processing.footnotePattern;
    const paragraphs = this.container.querySelectorAll(this.config.selectors.paragraphs);
    let globalNumber = 1;
    
    console.log(`Pattern: ${pattern}`);
    console.log(`Found ${paragraphs.length} paragraphs to search`);

    paragraphs.forEach((paragraph, paraIndex) => {
      const originalHTML = paragraph.innerHTML;
      const textContent = paragraph.textContent;
      
      // Test pattern matching
      const matches = originalHTML.match(pattern);
      const textMatches = textContent.match(/\[\^(\d+)\]/g);
      
      if (matches || textMatches) {
        console.log(`Paragraph ${paraIndex}:`, {
          htmlMatches: matches,
          textMatches: textMatches,
          originalHTML: originalHTML.substring(0, 100) + '...',
          textContent: textContent.substring(0, 100) + '...'
        });
      }
      
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
          content: null
        });

        console.log(`✅ Stored footnote ${globalNumber} with originalNumber: "${originalNum}"`);

        // Create semantic footnote reference
        const ref = this.createFootnoteReference(globalNumber, originalNum);
        globalNumber++;
        return ref;
      });

      if (hasFootnotes) {
        console.log(`✅ Updated paragraph ${paraIndex} HTML`);
        paragraph.innerHTML = modifiedHTML;
      }
    });

    this.counter = globalNumber - 1;
    console.log(`Final footnotes count: ${this.counter}`);
    console.log('Final footnotes Map:', Array.from(this.footnotes.entries()));
    console.groupEnd();
  }

  // Create accessible footnote reference HTML
  createFootnoteReference(globalNum, originalNum) {
    const footnoteData = this.footnotes.get(globalNum);
    const classes = this.config.classes;
    
    return `<sup style="color: #00ff00; font-family: 'JetBrains Mono', monospace; font-size: 0.75em; cursor: pointer; text-shadow: 0 0 3px #00ff00;" class="${classes.footnoteRef}" id="${footnoteData.backrefId}">
      <a href="#${footnoteData.id}" 
         data-footnote="${globalNum}" 
         class="${classes.footnoteLink}"
         role="doc-noteref"
         aria-describedby="${footnoteData.id}"
         aria-label="Footnote ${globalNum}"
         style="color: inherit; text-decoration: none;"
         tabindex="0">${globalNum}</a>
    </sup>`;
  }

  // Connect footnote references to HTML card content
  connectFootnoteContent() {
    console.group('[FOOTNOTE_SYSTEM] Connection Debug');
    
    // Search for footnote cards globally since Ghost may place them outside .post-content
    const footnoteCards = document.querySelectorAll(this.config.selectors.footnoteCards);
    console.log(`Found ${footnoteCards.length} footnote cards`);
    
    console.log(`Footnotes Map size: ${this.footnotes.size}`);
    console.log('Footnotes Map contents:', Array.from(this.footnotes.entries()));
    
    footnoteCards.forEach((card, index) => {
      const refNumber = parseInt(card.getAttribute(this.config.processing.referenceAttribute));
      console.log(`Card ${index + 1}: data-ref="${refNumber}"`);
      
      let matched = false;
      // Find corresponding footnote
      for (let [globalNum, footnoteData] of this.footnotes) {
        console.log(`  Checking against footnote ${globalNum}: originalNumber=${footnoteData.originalNumber} (type: ${typeof footnoteData.originalNumber})`);
        
        if (footnoteData.originalNumber == refNumber || globalNum == refNumber) {
          console.log(`  ✅ MATCH FOUND: footnote ${globalNum} ↔ data-ref="${refNumber}"`);
          footnoteData.content = card;
          footnoteData.contentHTML = this.sanitizeHTML(card.innerHTML);
          card.id = `footnote-content-${globalNum}`;
          
          // HIDE original HTML card to prevent duplicates
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
    
    console.groupEnd();
  }

  // Create organized footnote collection
  createFootnoteCollection() {
    let collection = this.container.querySelector(`.${this.config.classes.footnoteCollection}`);
    
    if (!collection && this.footnotes.size > 0) {
      collection = this.createElement('div', this.config.classes.footnoteCollection);
      this.setAttributes(collection, {
        'role': 'doc-endnotes',
        'aria-label': 'Footnotes'
      });

      collection.innerHTML = `
        <hr class="footnote-separator" role="separator">
        <h4 class="footnote-title">Notes</h4>
        <div class="${this.config.classes.footnoteList}" role="list"></div>
      `;

      this.container.appendChild(collection);
    }

    const list = collection?.querySelector(`.${this.config.classes.footnoteList}`);
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

  // Create footnote item with proper semantic structure
  createFootnoteItem(footnoteData, globalNum) {
    const item = this.createElement('div', this.config.classes.footnoteItem);
    this.setAttributes(item, {
      'id': footnoteData.id,
      'role': 'doc-endnote'
    });
    
    // Apply themed styling
    this.setStyles(item, {
      border: '1px solid #00ff00',
      backgroundColor: 'rgba(0, 255, 0, 0.05)',
      padding: '1rem',
      margin: '1rem 0',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.9em',
      borderLeft: '4px solid #00ff00',
      boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)'
    });

    item.innerHTML = `
      <span class="footnote-number">
        <a href="#${footnoteData.backrefId}" 
           class="${this.config.classes.footnoteBackref}" 
           data-target="${footnoteData.backrefId}"
           role="doc-backlink"
           aria-label="Return to footnote ${globalNum} reference in text"
           style="color: #00ff00; text-decoration: none; font-weight: bold;"
           tabindex="0">${globalNum}</a>
      </span>
      <div class="footnote-content">${footnoteData.contentHTML}</div>
    `;

    return item;
  }

  // Add interaction behaviors (pure event handling)
  enhanceInteractions() {
    if (!this.config.behavior.enableKeyboardNav && !this.config.behavior.enableTooltips) return;

    // Footnote reference interactions
    const footnoteLinks = this.container.querySelectorAll(`.${this.config.classes.footnoteLink}`);
    footnoteLinks.forEach(link => {
      this.addFootnoteLinkBehaviors(link);
    });

    // Back-reference interactions
    const backrefLinks = this.container.querySelectorAll(`.${this.config.classes.footnoteBackref}`);
    backrefLinks.forEach(link => {
      this.addBackrefLinkBehaviors(link);
    });
  }

  addFootnoteLinkBehaviors(link) {
    const footnoteNum = parseInt(link.dataset.footnote);

    // Navigation
    ['click', 'keydown'].forEach(eventType => {
      link.addEventListener(eventType, (e) => {
        if (eventType === 'keydown' && !['Enter', ' '].includes(e.key)) return;
        e.preventDefault();
        this.navigateToFootnote(`footnote-${footnoteNum}`);
      });
    });

    // Tooltips
    if (this.config.behavior.enableTooltips) {
      link.addEventListener('mouseenter', (e) => this.showTooltip(e, footnoteNum));
      link.addEventListener('mouseleave', () => this.hideTooltip(footnoteNum));
      link.addEventListener('focus', (e) => this.showTooltip(e, footnoteNum));
      link.addEventListener('blur', () => {
        setTimeout(() => this.hideTooltip(footnoteNum), this.config.behavior.tooltipDelay);
      });
    }
  }

  addBackrefLinkBehaviors(link) {
    ['click', 'keydown'].forEach(eventType => {
      link.addEventListener(eventType, (e) => {
        if (eventType === 'keydown' && !['Enter', ' '].includes(e.key)) return;
        e.preventDefault();
        this.navigateToFootnote(link.dataset.target);
      });
    });
  }

  // Navigation with configurable behavior
  navigateToFootnote(elementId) {
    if (!this.config.behavior.enableSmoothScrolling) {
      location.hash = elementId;
      return;
    }

    const targetElement = document.getElementById(elementId);
    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: this.config.behavior.scrollOffset || 'center'
    });

    // Brief highlight effect (controlled by CSS)
    targetElement.style.animation = 'var(--footnote-highlight)';
    setTimeout(() => {
      targetElement.style.animation = '';
    }, 1000);
  }

  // Tooltip management
  showTooltip(event, footnoteNum) {
    const footnoteData = this.footnotes.get(footnoteNum);
    if (!footnoteData?.content) return;

    // Get or create tooltip
    let tooltip = this.tooltips.get(footnoteNum);
    if (!tooltip) {
      // Create new tooltip with clean content (no duplicates)
      tooltip = this.createElement('div', this.config.classes.footnoteTooltip);
      
      // Extract clean content, avoiding any nested footnote markers
      const cleanContent = this.extractCleanContent(footnoteData.contentHTML);
      tooltip.innerHTML = cleanContent;
      
      // Add arrow
      const arrow = this.createElement('div', 'footnote-tooltip-arrow');
      tooltip.appendChild(arrow);
      
      document.body.appendChild(tooltip);
      this.tooltips.set(footnoteNum, tooltip);
    }

    // Show tooltip to measure it
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'hidden'; // Measure without showing
    
    // ALWAYS recalculate position on each hover
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Safe margins from screen edges
    const MARGIN = 20;
    const ARROW_SIZE = 8;
    
    // Calculate initial position (centered under footnote)
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.bottom + ARROW_SIZE + 5;
    let arrowLeft = 50; // percentage
    let arrowClass = 'arrow-top';
    
    // Constrain horizontally with margins
    const minLeft = MARGIN;
    const maxLeft = viewportWidth - tooltipRect.width - MARGIN;
    
    if (left < minLeft) {
      // Tooltip would go off left edge
      left = minLeft;
      arrowLeft = ((rect.left + rect.width/2 - left) / tooltipRect.width) * 100;
    } else if (left > maxLeft) {
      // Tooltip would go off right edge  
      left = maxLeft;
      arrowLeft = ((rect.left + rect.width/2 - left) / tooltipRect.width) * 100;
    }
    
    // Constrain arrow position to stay within tooltip bounds
    arrowLeft = Math.max(10, Math.min(90, arrowLeft));
    
    // Check if tooltip would go off bottom of screen
    if (top + tooltipRect.height > viewportHeight - MARGIN) {
      // Show above footnote instead
      top = rect.top - tooltipRect.height - ARROW_SIZE - 5;
      arrowClass = 'arrow-bottom';
      
      // If still off screen (footnote near top), position at top with margin
      if (top < MARGIN) {
        top = MARGIN;
        arrowClass = 'arrow-top';
      }
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

  hideTooltip(footnoteNum) {
    const tooltip = this.tooltips.get(footnoteNum);
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  // Mark system as ready (removes fallbacks)
  markSystemReady() {
    this.container.classList.add(this.config.classes.systemEnhanced);
    
    // Remove fallback elements
    const fallbackSection = this.container.querySelector(`.${this.config.classes.footnoteCollection}-fallback`);
    if (fallbackSection) {
      fallbackSection.remove();
    }
  }

  // Utility methods for clean DOM manipulation
  createElement(tag, className = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }

  setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  setStyles(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
  }

  // Extract clean content for tooltips (removes duplicates and footnote markers)
  extractCleanContent(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove any nested footnote markers or numbers that might cause duplicates
    const footnoteMarkers = temp.querySelectorAll('strong, sup, .footnote-ref, .footnote-link, [data-footnote]');
    footnoteMarkers.forEach(marker => {
      // If it's just a number/marker (like ¹, ², 1, 2), remove it
      const text = marker.textContent.trim();
      if (/^[\d¹²³⁴⁵⁶⁷⁸⁹⁰]+$/.test(text)) {
        marker.remove();
      }
    });
    
    // Clean up any remaining footnote patterns
    let cleanText = temp.innerHTML
      .replace(/\[\^(\d+)\]/g, '') // Remove [^1] patterns
      .replace(/^[\d¹²³⁴⁵⁶⁷⁸⁹⁰\s]*/, '') // Remove leading numbers/superscripts
      .trim();
    
    return this.sanitizeHTML(cleanText);
  }

  // HTML sanitization (basic implementation)
  sanitizeHTML(html) {
    if (!this.config.processing.sanitizeHTML) return html;
    
    const temp = document.createElement('div');
    const cleanHTML = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
    
    temp.innerHTML = cleanHTML;
    temp.querySelectorAll('script').forEach(script => script.remove());
    
    return temp.innerHTML;
  }

  // Debug information
  debug() {
    console.group('[FOOTNOTE_SYSTEM] Debug Information');
    console.log(`Footnotes: ${this.footnotes.size}`);
    console.log(`Configuration:`, this.config);
    console.log(`Container:`, this.container);
    console.log(`Footnote data:`, Array.from(this.footnotes.entries()));
    console.groupEnd();
  }
}

// Auto-initialize when configuration is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.DigitalTalmudFootnoteConfig && document.querySelector('.post-content, .page-content')) {
    window.FootnoteSystemInstance = new FootnoteSystem();
    
    // Make debug available globally
    window.debugFootnotes = () => {
      if (window.FootnoteSystemInstance) {
        window.FootnoteSystemInstance.debug();
      }
    };
  }
});