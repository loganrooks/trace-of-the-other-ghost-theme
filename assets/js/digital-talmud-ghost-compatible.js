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
    this.addDebugListeners();
    
    console.log('[DIGITAL_TALMUD_GHOST] Ghost-compatible static marginalia system initialized');
    console.log(`Found: ${this.marginalia.length} marginalia, ${document.querySelectorAll('.reference-note').length} reference notes`);
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