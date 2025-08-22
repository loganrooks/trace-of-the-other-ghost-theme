/**
 * Digital Talmud GHOST-COMPATIBLE Static Marginalia System
 * Simplified approach for Ghost CMS editor constraints:
 * - Static marginalia via HTML cards (always visible)
 * - Reference notes via HTML cards 
 * - No complex footnote popups (Ghost doesn't support HTML in paragraphs)
 * - Focus on what actually works in Ghost editor
 */

class DigitalTalmudGhostCompatible {
  constructor() {
    this.container = document.querySelector('.post-content, .page-content');
    this.marginalia = [];
    this.footnotes = new Map(); // Track footnote references and content
    this.footnoteTooltips = new Map(); // Cache tooltip elements
    this.footnoteCounter = 0; // Track global footnote numbering
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.log('[DIGITAL_TALMUD_GHOST] Container not found');
      return;
    }
    
    // Simple setup: find marginalia and make them static
    this.findMarginalia();
    this.setupStaticMarginalia();
    this.addReferenceNoteInteractivity();
    
    // NEW: Initialize footnote system
    this.initializeFootnoteSystem();
    
    this.addDebugListeners();
    
    console.log('[DIGITAL_TALMUD_GHOST] Ghost-compatible static marginalia system initialized');
    console.log(`Found: ${this.marginalia.length} marginalia, ${document.querySelectorAll('.reference-note').length} reference notes, ${this.footnotes.size} footnotes`);
  }
  
  findMarginalia() {
    this.marginalia = Array.from(document.querySelectorAll('.marginalia-voice'));
    
    this.marginalia.forEach((element, index) => {
      // Assign default position if not specified
      if (!element.dataset.position) {
        element.dataset.position = index % 2 === 0 ? 'left' : 'right';
      }
      
      // Assign default voice if not specified
      if (!element.dataset.voice) {
        element.dataset.voice = (index % 6) + 1;
      }
      
      // Add unique ID
      element.dataset.marginaliaId = `marginalia-${index}`;
      
      console.log(`[DIGITAL_TALMUD_GHOST] Found ${element.dataset.marginaliaId}: position=${element.dataset.position}, voice=${element.dataset.voice}`);
    });
  }
  
  setupStaticMarginalia() {
    this.marginalia.forEach((marginalia, index) => {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // MOBILE: DO NOTHING - LET CSS HANDLE EVERYTHING
        console.log(`[DIGITAL_TALMUD_GHOST] Mobile: CSS-only for ${marginalia.dataset.marginaliaId}`);
        
        // Remove ALL JavaScript-applied styles to let CSS take over
        marginalia.style.cssText = '';
        
        return; // Exit early, don't apply any JS styles
      }
      
      // DESKTOP ONLY from here
      this.calculateWidth(marginalia);
      this.applyFontSize(marginalia);
      
      marginalia.style.display = 'block';
      marginalia.style.opacity = '1';
      marginalia.style.visibility = 'visible';
      marginalia.style.pointerEvents = 'all';
      
      const position = marginalia.dataset.position;
      if (position.includes('left')) {
        marginalia.style.float = 'left';
        marginalia.style.textAlign = 'right';
        marginalia.style.marginLeft = '-6rem';
        marginalia.style.marginRight = '1rem';
      } else if (position.includes('right')) {
        marginalia.style.float = 'right';
        marginalia.style.textAlign = 'left';
        marginalia.style.marginRight = '-6rem';
        marginalia.style.marginLeft = '1rem';
      }
      
      marginalia.style.clear = 'none';
      
      console.log(`[DIGITAL_TALMUD_GHOST] Desktop setup complete for ${marginalia.dataset.marginaliaId}`);
    });
  }
  
  addReferenceNoteInteractivity() {
    // Add subtle hover effects to reference notes
    const referenceNotes = Array.from(document.querySelectorAll('.reference-note'));
    referenceNotes.forEach((note, index) => {
      note.addEventListener('mouseenter', () => {
        // Subtle pulse effect on hover
        note.style.transform = 'translateX(4px)';
        note.style.borderLeftWidth = '6px';
      });
      
      note.addEventListener('mouseleave', () => {
        note.style.transform = 'translateX(0)';
        note.style.borderLeftWidth = '4px';
      });
      
      console.log(`[DIGITAL_TALMUD_GHOST] Added interactivity to reference note ${index + 1}`);
    });
  }
  
  // ===== FOOTNOTE SYSTEM =====
  
  initializeFootnoteSystem() {
    return this.safeExecute(() => {
      console.log('[DIGITAL_TALMUD_GHOST] Initializing footnote system...');
      
      // Step 0: Create basic fallback footnotes for progressive enhancement
      this.createProgressiveEnhancementFallback();
      
      // Step 1: Scan for [^1] patterns in paragraph blocks
      this.scanFootnoteMarkers();
      
      // Step 2: Connect footnote references to HTML cards
      this.connectFootnoteContent();
      
      // Step 3: Create footnote collection at end of post
      this.createFootnoteCollection();
      
      // Step 4: Add interactive enhancements
      this.enhanceFootnoteInteractions();
      
      // Step 5: Remove fallback elements (they're now replaced with enhanced versions)
      this.removeFallbackElements();
      
      // Step 6: Mark enhanced system as loaded
      this.container.classList.add('footnote-system-enhanced');
      
      console.log(`[DIGITAL_TALMUD_GHOST] Footnote system initialized: ${this.footnotes.size} footnotes found`);
    }, 'Failed to initialize footnote system');
  }
  
  // Progressive Enhancement: Create basic HTML fallback
  createProgressiveEnhancementFallback() {
    // This creates basic HTML footnotes that work without JavaScript
    // They'll be enhanced/replaced by the full system
    const footnotePattern = /\[\^(\d+)\]/g;
    const paragraphs = this.container.querySelectorAll('p');
    const footnoteCards = this.container.querySelectorAll('[data-ref]');
    
    // Create a basic footnote section if data-ref cards exist
    if (footnoteCards.length > 0) {
      const fallbackSection = document.createElement('div');
      fallbackSection.className = 'footnote-fallback';
      fallbackSection.innerHTML = `
        <hr>
        <h4>Notes</h4>
        <ol class="footnote-fallback-list"></ol>
      `;
      
      const fallbackList = fallbackSection.querySelector('.footnote-fallback-list');
      
      // Add footnote content to fallback list
      footnoteCards.forEach(card => {
        const refNum = card.dataset.ref;
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span id="fallback-fn-${refNum}">${card.innerHTML}</span>`;
        fallbackList.appendChild(listItem);
      });
      
      this.container.appendChild(fallbackSection);
      
      // Convert [^1] to basic HTML links in paragraphs
      paragraphs.forEach(paragraph => {
        const originalHTML = paragraph.innerHTML;
        const modifiedHTML = originalHTML.replace(footnotePattern, (match, num) => {
          return `<sup><a href="#fallback-fn-${num}" class="footnote-fallback-link">${num}</a></sup>`;
        });
        
        if (modifiedHTML !== originalHTML) {
          paragraph.innerHTML = modifiedHTML;
        }
      });
      
      console.log(`[DIGITAL_TALMUD_GHOST] Created progressive enhancement fallback with ${footnoteCards.length} footnotes`);
    }
  }
  
  // Remove fallback elements after enhanced system is in place
  removeFallbackElements() {
    const fallbackSection = this.container.querySelector('.footnote-fallback');
    if (fallbackSection) {
      fallbackSection.remove();
    }
    
    // Remove fallback links (they've been replaced with enhanced versions)
    const fallbackLinks = this.container.querySelectorAll('.footnote-fallback-link');
    fallbackLinks.forEach(link => {
      const parent = link.parentElement; // <sup>
      if (parent && parent.tagName === 'SUP') {
        // This will be replaced by enhanced footnote, so just remove the fallback
        parent.remove();
      }
    });
  }
  
  scanFootnoteMarkers() {
    const footnotePattern = /\[\^(\d+)\]/g;
    let globalFootnoteNumber = 1;
    
    // Find all paragraph blocks (not in markdown cards)
    const paragraphs = this.container.querySelectorAll('p');
    
    paragraphs.forEach((paragraph, paraIndex) => {
      let modifiedHTML = paragraph.innerHTML;
      let hasFootnotes = false;
      
      // Replace each [^N] with clickable footnote reference
      modifiedHTML = modifiedHTML.replace(footnotePattern, (match, originalNum) => {
        hasFootnotes = true;
        const footnoteId = `footnote-${globalFootnoteNumber}`;
        const backrefId = `fnref-${globalFootnoteNumber}`;
        
        // Store footnote reference data
        this.footnotes.set(globalFootnoteNumber, {
          id: footnoteId,
          backrefId: backrefId,
          originalNumber: originalNum,
          globalNumber: globalFootnoteNumber,
          paragraph: paragraph,
          content: null // Will be filled by connectFootnoteContent
        });
        
        // Create accessible clickable footnote reference
        const footnoteRef = `<sup class="footnote-ref" id="${backrefId}">
          <a href="#${footnoteId}" 
             data-footnote="${globalFootnoteNumber}" 
             class="footnote-link"
             role="doc-noteref"
             aria-describedby="${footnoteId}"
             aria-label="Footnote ${globalFootnoteNumber}"
             tabindex="0">${globalFootnoteNumber}</a>
        </sup>`;
        
        globalFootnoteNumber++;
        return footnoteRef;
      });
      
      if (hasFootnotes) {
        paragraph.innerHTML = modifiedHTML;
        console.log(`[DIGITAL_TALMUD_GHOST] Processed paragraph ${paraIndex + 1}: found footnote markers`);
      }
    });
    
    this.footnoteCounter = globalFootnoteNumber - 1;
    console.log(`[DIGITAL_TALMUD_GHOST] Scanned ${paragraphs.length} paragraphs, found ${this.footnoteCounter} footnote references`);
  }
  
  connectFootnoteContent() {
    // Find all HTML cards with data-ref attributes
    const footnoteCards = this.container.querySelectorAll('[data-ref]');
    
    footnoteCards.forEach(card => {
      const refNumber = parseInt(card.dataset.ref);
      
      // Find corresponding footnote reference
      this.footnotes.forEach((footnoteData, globalNum) => {
        if (footnoteData.originalNumber == refNumber || globalNum == refNumber) {
          // Store content reference
          footnoteData.content = card;
          footnoteData.contentHTML = card.innerHTML;
          
          // Add unique ID to the card for linking
          card.id = `footnote-content-${globalNum}`;
          
          console.log(`[DIGITAL_TALMUD_GHOST] Connected footnote ${globalNum} to content card [data-ref="${refNumber}"]`);
        }
      });
    });
    
    // Check for unconnected footnotes
    let unconnectedCount = 0;
    this.footnotes.forEach((footnoteData, globalNum) => {
      if (!footnoteData.content) {
        console.warn(`[DIGITAL_TALMUD_GHOST] Footnote ${globalNum} has no matching content card`);
        unconnectedCount++;
      }
    });
    
    if (unconnectedCount > 0) {
      console.warn(`[DIGITAL_TALMUD_GHOST] Warning: ${unconnectedCount} footnotes have no content`);
    }
  }
  
  createFootnoteCollection() {
    // Check if footnotes collection already exists
    let footnoteCollection = this.container.querySelector('.footnote-collection');
    
    if (!footnoteCollection && this.footnotes.size > 0) {
      footnoteCollection = document.createElement('div');
      footnoteCollection.className = 'footnote-collection';
      footnoteCollection.setAttribute('role', 'doc-endnotes');
      footnoteCollection.setAttribute('aria-label', 'Footnotes');
      footnoteCollection.innerHTML = `
        <hr class="footnote-separator" role="separator">
        <h4 class="footnote-title">Notes</h4>
        <div class="footnote-list" role="list"></div>
      `;
      
      // Add to end of post content
      this.container.appendChild(footnoteCollection);
      console.log(`[DIGITAL_TALMUD_GHOST] Created footnote collection container`);
    }
    
    const footnoteList = footnoteCollection?.querySelector('.footnote-list');
    if (footnoteList) {
      // Clear existing content
      footnoteList.innerHTML = '';
      
      // Add each footnote to the collection
      this.footnotes.forEach((footnoteData, globalNum) => {
        if (footnoteData.content) {
          const footnoteItem = document.createElement('div');
          footnoteItem.className = 'footnote-item';
          footnoteItem.id = footnoteData.id;
          footnoteItem.setAttribute('role', 'listitem');
          footnoteItem.setAttribute('role', 'doc-endnote');
          
          // Sanitize HTML content to prevent XSS
          const sanitizedContent = this.sanitizeHTML(footnoteData.contentHTML);
          
          footnoteItem.innerHTML = `
            <span class="footnote-number">
              <a href="#${footnoteData.backrefId}" 
                 class="footnote-backref" 
                 data-target="${footnoteData.backrefId}"
                 role="doc-backlink"
                 aria-label="Return to footnote ${globalNum} reference in text"
                 tabindex="0">${globalNum}</a>
            </span>
            <div class="footnote-content">${sanitizedContent}</div>
          `;
          
          footnoteList.appendChild(footnoteItem);
        }
      });
      
      console.log(`[DIGITAL_TALMUD_GHOST] Populated footnote collection with ${footnoteList.children.length} footnotes`);
    }
  }
  
  enhanceFootnoteInteractions() {
    // Add click and keyboard handlers for footnote references (text -> footnote)
    const footnoteLinks = this.container.querySelectorAll('.footnote-link');
    footnoteLinks.forEach(link => {
      // Click handler
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const footnoteNum = parseInt(link.dataset.footnote);
        const targetId = `footnote-${footnoteNum}`;
        this.smoothScrollToElement(targetId);
      });
      
      // Keyboard navigation (Enter and Space)
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const footnoteNum = parseInt(link.dataset.footnote);
          const targetId = `footnote-${footnoteNum}`;
          this.smoothScrollToElement(targetId);
        }
      });
      
      // Add hover tooltips
      link.addEventListener('mouseenter', (e) => {
        this.showFootnoteTooltip(e, parseInt(link.dataset.footnote));
      });
      
      link.addEventListener('mouseleave', (e) => {
        this.hideFootnoteTooltip(parseInt(link.dataset.footnote));
      });
      
      // Focus handlers for keyboard users
      link.addEventListener('focus', (e) => {
        this.showFootnoteTooltip(e, parseInt(link.dataset.footnote));
      });
      
      link.addEventListener('blur', (e) => {
        // Small delay to allow mouse users to interact with tooltip
        setTimeout(() => {
          this.hideFootnoteTooltip(parseInt(link.dataset.footnote));
        }, 150);
      });
    });
    
    // Add click and keyboard handlers for back-references (footnote -> text)
    const backrefLinks = this.container.querySelectorAll('.footnote-backref');
    backrefLinks.forEach(link => {
      // Click handler
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.target;
        this.smoothScrollToElement(targetId);
      });
      
      // Keyboard navigation
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const targetId = link.dataset.target;
          this.smoothScrollToElement(targetId);
        }
      });
    });
    
    console.log(`[DIGITAL_TALMUD_GHOST] Enhanced ${footnoteLinks.length} footnote links and ${backrefLinks.length} back-references with full accessibility support`);
  }
  
  smoothScrollToElement(elementId) {
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      // Add brief highlight effect
      targetElement.style.transition = 'background-color 0.3s ease';
      targetElement.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
      setTimeout(() => {
        targetElement.style.backgroundColor = '';
      }, 1000);
      
      console.log(`[DIGITAL_TALMUD_GHOST] Smooth scrolled to ${elementId}`);
    } else {
      console.warn(`[DIGITAL_TALMUD_GHOST] Target element not found: ${elementId}`);
    }
  }
  
  showFootnoteTooltip(event, footnoteNum) {
    const footnoteData = this.footnotes.get(footnoteNum);
    if (!footnoteData || !footnoteData.content) return;
    
    // Check if tooltip already exists
    if (this.footnoteTooltips.has(footnoteNum)) {
      const existingTooltip = this.footnoteTooltips.get(footnoteNum);
      existingTooltip.style.display = 'block';
      return;
    }
    
    // Create new tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'footnote-tooltip';
    tooltip.innerHTML = footnoteData.contentHTML;
    
    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.zIndex = '1000';
    
    document.body.appendChild(tooltip);
    this.footnoteTooltips.set(footnoteNum, tooltip);
    
    console.log(`[DIGITAL_TALMUD_GHOST] Showed tooltip for footnote ${footnoteNum}`);
  }
  
  hideFootnoteTooltip(footnoteNum) {
    const tooltip = this.footnoteTooltips.get(footnoteNum);
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }
  
  // HTML Sanitization for security
  sanitizeHTML(html) {
    // Create a temporary element to parse HTML safely
    const temp = document.createElement('div');
    
    // Basic HTML sanitization - remove script tags and dangerous attributes
    const cleanHTML = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '');
    
    temp.innerHTML = cleanHTML;
    
    // Additional security: remove any remaining script elements
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    return temp.innerHTML;
  }
  
  // Error handling wrapper for footnote operations
  safeExecute(operation, errorMessage, defaultReturn = null) {
    try {
      return operation();
    } catch (error) {
      console.error(`[DIGITAL_TALMUD_GHOST] ${errorMessage}:`, error);
      return defaultReturn;
    }
  }
  
  calculateWidth(marginalia) {
    const content = marginalia.textContent || marginalia.innerText;
    const length = content.length;
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // MOBILE DEBUG: Don't calculate anything, let CSS handle it
      console.log(`[DIGITAL_TALMUD_GHOST] MOBILE DEBUG: Letting CSS handle width for ${marginalia.dataset.marginaliaId}`);
      
      // Remove any width styles that might override CSS
      marginalia.style.removeProperty('width');
      marginalia.style.removeProperty('max-width');
      marginalia.style.removeProperty('min-width');
      
      return;
    }
    
    // Desktop calculation only
    let requestedWidth = parseInt(marginalia.dataset.width || '30');
    const contentArea = this.container.offsetWidth;
    let maxAllowedWidth = Math.floor(contentArea * (requestedWidth / 100));
    maxAllowedWidth = Math.max(maxAllowedWidth, 150);
    
    // Apply the calculated width for desktop
    marginalia.style.width = `${maxAllowedWidth}px`;
    marginalia.style.maxWidth = `${maxAllowedWidth}px`;
    marginalia.style.minWidth = '120px';
    marginalia.style.boxSizing = 'border-box';
    
    console.log(`[DIGITAL_TALMUD_GHOST] Desktop width set for ${marginalia.dataset.marginaliaId}: ${maxAllowedWidth}px`);
  }
  
  applyFontSize(marginalia) {
    const isMobile = window.innerWidth <= 768;
    
    // Apply font scaling based on data attributes
    if (marginalia.dataset.fontScale) {
      const scale = parseFloat(marginalia.dataset.fontScale);
      if (scale >= 0.4 && scale <= 2.5) {
        // Smaller base font size on mobile
        const baseSize = isMobile ? 0.6 : 0.7; 
        const fontSize = scale * baseSize;
        marginalia.style.fontSize = `${fontSize}rem`;
        console.log(`[DIGITAL_TALMUD_GHOST] Font scale ${scale} applied: ${fontSize}rem (mobile base: ${baseSize})`);
      }
    } else if (marginalia.dataset.fontSize) {
      marginalia.style.fontSize = marginalia.dataset.fontSize;
      console.log(`[DIGITAL_TALMUD_GHOST] Direct font size applied: ${marginalia.dataset.fontSize}`);
    } else if (isMobile) {
      // Default smaller font size on mobile (already set in CSS)
      console.log(`[DIGITAL_TALMUD_GHOST] Using CSS mobile default font size: 0.7rem`);
    }
  }
  
  addDebugListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'G':
            e.preventDefault();
            this.debugGhost();
            break;
          case 'W':
            e.preventDefault();
            this.recalculateWidths();
            break;
          case 'M':
            e.preventDefault();
            this.debugMobile();
            break;
        }
      }
    });
  }
  
  debugMobile() {
    console.group('[DIGITAL_TALMUD_GHOST] 📱 MOBILE MARGINALIA DEBUG');
    
    this.marginalia.forEach((marginalia, index) => {
      const rect = marginalia.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(marginalia);
      const parent = marginalia.parentElement;
      const parentRect = parent ? parent.getBoundingClientRect() : null;
      
      console.group(`Marginalia ${index + 1}:`);
      console.log('Element:', marginalia);
      console.log('BoundingRect:', rect);
      console.log('Parent:', parent?.tagName, parent?.className);
      console.log('Parent BoundingRect:', parentRect);
      console.log('Computed width:', computedStyle.width);
      console.log('Computed max-width:', computedStyle.maxWidth);
      console.log('Computed position:', computedStyle.position);
      console.log('Computed left/right:', computedStyle.left, computedStyle.right);
      console.log('Computed overflow:', computedStyle.overflow);
      console.log('Computed outline:', computedStyle.outline);
      console.log('Is clipped:', rect.right > window.innerWidth);
      console.log('Viewport width:', window.innerWidth);
      console.log('Element right edge:', rect.right);
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  debugGhost() {
    console.group('[DIGITAL_TALMUD_GHOST] 👻 GHOST EDITOR DEBUG INFO');
    
    console.group('📦 Content Structure:');
    console.log(`Container: ${this.container ? this.container.tagName + '.' + this.container.className : 'Not found'}`);
    console.log(`Content area width: ${this.container ? this.container.offsetWidth + 'px' : 'Unknown'}`);
    console.log(`Site wrapper: ${document.querySelector('.site-wrapper') ? 'Found' : 'Not found'}`);
    console.groupEnd();
    
    console.group('📝 Marginalia:');
    console.log(`Total marginalia: ${this.marginalia.length}`);
    this.marginalia.forEach((marginalia, index) => {
      const rect = marginalia.getBoundingClientRect();
      console.log(`${marginalia.dataset.marginaliaId}:`);
      console.log(`  Position: ${marginalia.dataset.position}, Voice: ${marginalia.dataset.voice}`);
      console.log(`  Width setting: ${marginalia.dataset.width}%, Rendered: ${rect.width.toFixed(0)}px`);
      console.log(`  Screen position: ${rect.left.toFixed(0)}, ${rect.top.toFixed(0)}`);
      console.log(`  Visible: ${rect.width > 0 && rect.height > 0 ? '✅' : '❌'}`);
    });
    console.groupEnd();
    
    console.group('📄 Reference Notes:');
    const referenceNotes = Array.from(document.querySelectorAll('.reference-note'));
    console.log(`Total reference notes: ${referenceNotes.length}`);
    referenceNotes.forEach((note, index) => {
      const refId = note.dataset.ref || `${index + 1}`;
      console.log(`Reference ${refId}: ${note.textContent.substring(0, 60)}...`);
    });
    console.groupEnd();
    
    console.group('🎨 Background Visibility:');
    const siteWrapper = document.querySelector('.site-wrapper');
    if (siteWrapper) {
      const rect = siteWrapper.getBoundingClientRect();
      console.log(`Site wrapper width: ${rect.width}px`);
      console.log(`Viewport width: ${window.innerWidth}px`);
      console.log(`Background visible area: ${window.innerWidth - rect.width}px`);
      console.log(`Background visible: ${rect.width < window.innerWidth ? '✅' : '❌'}`);
    }
    console.groupEnd();
    
    console.group('🔗 Footnote System:');
    console.log(`Total footnotes: ${this.footnotes.size}`);
    console.log(`Footnote counter: ${this.footnoteCounter}`);
    
    if (this.footnotes.size > 0) {
      this.footnotes.forEach((footnoteData, globalNum) => {
        console.log(`Footnote ${globalNum}:`);
        console.log(`  Original: [^${footnoteData.originalNumber}]`);
        console.log(`  IDs: ${footnoteData.id} ⟷ ${footnoteData.backrefId}`);
        console.log(`  Has content: ${footnoteData.content ? '✅' : '❌'}`);
        if (footnoteData.content) {
          console.log(`  Content preview: ${footnoteData.contentHTML.substring(0, 50).replace(/\n/g, ' ')}...`);
        }
      });
    }
    
    const footnoteLinks = this.container.querySelectorAll('.footnote-link');
    const backrefLinks = this.container.querySelectorAll('.footnote-backref');
    const footnoteCollection = this.container.querySelector('.footnote-collection');
    
    console.log(`Footnote links in text: ${footnoteLinks.length}`);
    console.log(`Back-reference links: ${backrefLinks.length}`);
    console.log(`Footnote collection: ${footnoteCollection ? '✅' : '❌'}`);
    
    if (footnoteCollection) {
      const footnoteItems = footnoteCollection.querySelectorAll('.footnote-item');
      console.log(`Footnote items in collection: ${footnoteItems.length}`);
    }
    
    console.log(`Cached tooltips: ${this.footnoteTooltips.size}`);
    console.groupEnd();
    
    console.groupEnd();
  }
  
  recalculateWidths() {
    console.log('[DIGITAL_TALMUD_GHOST] Recalculating widths...');
    this.marginalia.forEach(marginalia => {
      this.calculateWidth(marginalia);
    });
    console.log('[DIGITAL_TALMUD_GHOST] Width recalculation complete');
  }
}

// Auto-initialize on content load
let digitalTalmudGhostInstance = null;

document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.post-content, .page-content')) {
    digitalTalmudGhostInstance = new DigitalTalmudGhostCompatible();
    
    // Make instance available globally for debugging
    window.DigitalTalmudGhost = digitalTalmudGhostInstance;
    
    console.log('[DIGITAL_TALMUD_GHOST] Ready. Debug keys: Ctrl+Shift+G (Ghost debug), Ctrl+Shift+W (recalculate widths), Ctrl+Shift+M (mobile debug)');
  }
});

// Recalculate on resize
window.addEventListener('resize', () => {
  if (digitalTalmudGhostInstance) {
    setTimeout(() => {
      digitalTalmudGhostInstance.recalculateWidths();
    }, 250);
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DigitalTalmudGhostCompatible };
}