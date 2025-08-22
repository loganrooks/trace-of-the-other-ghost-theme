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
    const pattern = this.config.processing.footnotePattern;
    const paragraphs = this.container.querySelectorAll(this.config.selectors.paragraphs);
    let globalNumber = 1;

    paragraphs.forEach((paragraph, paraIndex) => {
      const originalHTML = paragraph.innerHTML;
      let hasFootnotes = false;

      const modifiedHTML = originalHTML.replace(pattern, (match, originalNum) => {
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

        // Create semantic footnote reference
        const ref = this.createFootnoteReference(globalNumber, originalNum);
        globalNumber++;
        return ref;
      });

      if (hasFootnotes) {
        paragraph.innerHTML = modifiedHTML;
      }
    });

    this.counter = globalNumber - 1;
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
    const footnoteCards = this.container.querySelectorAll(this.config.selectors.footnoteCards);
    
    footnoteCards.forEach(card => {
      const refNumber = parseInt(card.getAttribute(this.config.processing.referenceAttribute));
      
      // Find corresponding footnote
      for (let [globalNum, footnoteData] of this.footnotes) {
        if (footnoteData.originalNumber == refNumber || globalNum == refNumber) {
          footnoteData.content = card;
          footnoteData.contentHTML = this.sanitizeHTML(card.innerHTML);
          card.id = `footnote-content-${globalNum}`;
          break;
        }
      }
    });
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

    // Reuse existing tooltip
    if (this.tooltips.has(footnoteNum)) {
      this.tooltips.get(footnoteNum).style.display = 'block';
      return;
    }

    // Create new tooltip
    const tooltip = this.createElement('div', this.config.classes.footnoteTooltip);
    tooltip.innerHTML = footnoteData.contentHTML;

    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    this.setStyles(tooltip, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.bottom + 5}px`,
      zIndex: '1000'
    });

    document.body.appendChild(tooltip);
    this.tooltips.set(footnoteNum, tooltip);
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