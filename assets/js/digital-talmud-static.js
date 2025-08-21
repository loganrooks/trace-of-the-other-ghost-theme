/**
 * Digital Talmud STATIC Marginalia System
 * Simplified approach: Always visible marginalia with proper width control
 * No complex animations, no IntersectionObserver, no state management
 * Includes interactive footnote system
 */

class DigitalTalmudStatic {
  constructor() {
    this.container = document.querySelector('.post-content, .page-content');
    this.marginalia = [];
    this.footnotes = new Map(); // footnote-id -> definition element
    this.footnotePopup = null; // Current hover popup
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.log('[DIGITAL_TALMUD_STATIC] Container not found');
      return;
    }
    
    // Simple setup: find marginalia and make them static
    this.findMarginalia();
    this.setupStaticMarginalia();
    
    // Setup interactive footnote system
    this.setupFootnotes();
    
    this.addDebugListeners();
    
    console.log('[DIGITAL_TALMUD_STATIC] Static marginalia system initialized with', this.marginalia.length, 'marginalia voices and', this.footnotes.size, 'footnotes');
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
      
      console.log(`[DIGITAL_TALMUD_STATIC] Found ${element.dataset.marginaliaId}: position=${element.dataset.position}, voice=${element.dataset.voice}`);
    });
  }
  
  setupStaticMarginalia() {
    this.marginalia.forEach((marginalia, index) => {
      // Calculate and apply width
      this.calculateWidth(marginalia);
      
      // Apply font size
      this.applyFontSize(marginalia);
      
      // Ensure marginalia is static and visible
      marginalia.style.display = 'block';
      marginalia.style.opacity = '1';
      marginalia.style.visibility = 'visible';
      marginalia.style.pointerEvents = 'all';
      
      // Apply positioning based on data-position
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
      
      // Ensure no clearing to allow multiple marginalia
      marginalia.style.clear = 'none';
      
      console.log(`[DIGITAL_TALMUD_STATIC] Setup complete for ${marginalia.dataset.marginaliaId}: width=${marginalia.style.width}`);
    });
  }
  
  calculateWidth(marginalia) {
    const content = marginalia.textContent || marginalia.innerText;
    const length = content.length;
    
    // Auto-assign width based on content length if not specified
    if (!marginalia.dataset.width) {
      if (length < 50) {
        marginalia.dataset.width = '15';
      } else if (length < 100) {
        marginalia.dataset.width = '20';
      } else if (length > 150) {
        marginalia.dataset.width = '30';
      } else {
        marginalia.dataset.width = '25';
      }
    }
    
    // Calculate max width - be more aggressive than before
    const requestedWidth = parseInt(marginalia.dataset.width);
    let maxAllowedWidth;
    
    if (requestedWidth >= 30) {
      // For high percentages, use viewport width
      maxAllowedWidth = Math.floor(window.innerWidth * (requestedWidth / 100));
      console.log(`[DIGITAL_TALMUD_STATIC] ${marginalia.dataset.marginaliaId}: Using viewport-based width ${requestedWidth}% = ${maxAllowedWidth}px`);
    } else {
      // For smaller percentages, use container width but be more generous
      const containerWidth = this.container.offsetWidth;
      maxAllowedWidth = Math.floor(containerWidth * (requestedWidth / 100) * 2); // Doubled for more space
      console.log(`[DIGITAL_TALMUD_STATIC] ${marginalia.dataset.marginaliaId}: Using container-based width ${requestedWidth}% * 2 = ${maxAllowedWidth}px`);
    }
    
    // Set CSS custom property and force width
    marginalia.style.setProperty('--marginalia-max-width', `${maxAllowedWidth}px`);
    marginalia.style.width = `${maxAllowedWidth}px`;
    marginalia.style.maxWidth = `${maxAllowedWidth}px`;
    marginalia.style.minWidth = '80px';
    marginalia.style.boxSizing = 'border-box';
    
    console.log(`[DIGITAL_TALMUD_STATIC] Width set for ${marginalia.dataset.marginaliaId}: ${length} chars, ${requestedWidth}% = ${maxAllowedWidth}px`);
  }
  
  applyFontSize(marginalia) {
    // Apply font scaling based on data attributes
    if (marginalia.dataset.fontScale) {
      const scale = parseFloat(marginalia.dataset.fontScale);
      if (scale >= 0.4 && scale <= 2.5) {
        const fontSize = scale * 0.7; // Base font size 0.7rem
        marginalia.style.fontSize = `${fontSize}rem`;
        console.log(`[DIGITAL_TALMUD_STATIC] Font scale ${scale} applied to ${marginalia.dataset.marginaliaId}: ${fontSize}rem`);
      }
    } else if (marginalia.dataset.fontSize) {
      marginalia.style.fontSize = marginalia.dataset.fontSize;
      console.log(`[DIGITAL_TALMUD_STATIC] Direct font size applied to ${marginalia.dataset.marginaliaId}: ${marginalia.dataset.fontSize}`);
    }
  }
  
  setupFootnotes() {
    // Find all footnote definitions and map them by ID
    const footnoteDefinitions = Array.from(document.querySelectorAll('.footnote-definition'));
    footnoteDefinitions.forEach(def => {
      const footnoteId = def.dataset.footnoteId;
      if (footnoteId) {
        this.footnotes.set(footnoteId, def);
        // Hide definitions initially (they'll be shown in popups)
        def.style.display = 'none';
        console.log(`[DIGITAL_TALMUD_STATIC] Found footnote definition: ${footnoteId}`);
      }
    });
    
    // Find all footnote markers and add hover functionality
    const footnoteMarkers = Array.from(document.querySelectorAll('.footnote-marker'));
    footnoteMarkers.forEach(marker => {
      const footnoteId = marker.dataset.footnote;
      if (footnoteId && this.footnotes.has(footnoteId)) {
        this.setupFootnoteMarker(marker, footnoteId);
        console.log(`[DIGITAL_TALMUD_STATIC] Setup footnote marker: ${footnoteId}`);
      }
    });
  }
  
  setupFootnoteMarker(marker, footnoteId) {
    const definition = this.footnotes.get(footnoteId);
    
    marker.addEventListener('mouseenter', (e) => {
      this.showFootnotePopup(e.target, definition);
    });
    
    marker.addEventListener('mouseleave', () => {
      this.hideFootnotePopup();
    });
    
    // Make marker visually distinct
    marker.style.cursor = 'pointer';
    marker.style.color = 'var(--hacker-green)';
    marker.style.textDecoration = 'underline';
    marker.style.textDecorationColor = 'rgba(0, 255, 0, 0.3)';
  }
  
  showFootnotePopup(marker, definition) {
    // Remove any existing popup
    this.hideFootnotePopup();
    
    // Create popup container
    this.footnotePopup = document.createElement('div');
    this.footnotePopup.className = 'footnote-popup marginalia-voice';
    
    // Copy content from definition
    this.footnotePopup.innerHTML = definition.innerHTML;
    
    // Copy styling attributes from definition
    if (definition.dataset.voice) {
      this.footnotePopup.dataset.voice = definition.dataset.voice;
    }
    if (definition.dataset.position) {
      this.footnotePopup.dataset.position = definition.dataset.position;
    }
    
    // Style the popup
    this.footnotePopup.style.position = 'absolute';
    this.footnotePopup.style.zIndex = '1000';
    this.footnotePopup.style.display = 'block';
    this.footnotePopup.style.opacity = '1';
    this.footnotePopup.style.visibility = 'visible';
    this.footnotePopup.style.pointerEvents = 'none'; // Don't interfere with mouse events
    this.footnotePopup.style.maxWidth = '300px';
    this.footnotePopup.style.padding = '0.8rem';
    this.footnotePopup.style.margin = '0';
    this.footnotePopup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    
    // Position popup relative to marker
    const markerRect = marker.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Determine position based on definition's data-position or auto-detect
    const preferredPosition = definition.dataset.position || 'right';
    let left, top;
    
    if (preferredPosition === 'left' || markerRect.left > window.innerWidth * 0.6) {
      // Position on left side
      left = markerRect.left + scrollLeft - 320; // popup width + margin
      this.footnotePopup.style.textAlign = 'right';
    } else {
      // Position on right side
      left = markerRect.right + scrollLeft + 20;
      this.footnotePopup.style.textAlign = 'left';
    }
    
    top = markerRect.top + scrollTop - 20; // Slightly above marker
    
    // Ensure popup stays within viewport
    if (left < 0) left = 10;
    if (left + 300 > window.innerWidth) left = window.innerWidth - 310;
    
    this.footnotePopup.style.left = `${left}px`;
    this.footnotePopup.style.top = `${top}px`;
    
    // Add to document
    document.body.appendChild(this.footnotePopup);
    
    console.log(`[DIGITAL_TALMUD_STATIC] Showing footnote popup at ${left}, ${top}`);
  }
  
  hideFootnotePopup() {
    if (this.footnotePopup) {
      document.body.removeChild(this.footnotePopup);
      this.footnotePopup = null;
      console.log(`[DIGITAL_TALMUD_STATIC] Hidden footnote popup`);
    }
  }
  
  addDebugListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'S':
            e.preventDefault();
            this.debugStatic();
            break;
          case 'W':
            e.preventDefault();
            this.recalculateWidths();
            break;
          case 'F':
            e.preventDefault();
            this.debugFootnotes();
            break;
        }
      }
    });
  }
  
  debugStatic() {
    console.group('[DIGITAL_TALMUD_STATIC] 🔍 STATIC DEBUG INFO');
    console.log(`Total marginalia: ${this.marginalia.length}`);
    
    this.marginalia.forEach((marginalia, index) => {
      const rect = marginalia.getBoundingClientRect();
      const computed = getComputedStyle(marginalia);
      
      console.group(`${marginalia.dataset.marginaliaId}:`);
      console.log(`Position: ${marginalia.dataset.position}`);
      console.log(`Voice: ${marginalia.dataset.voice}`);
      console.log(`Width setting: ${marginalia.dataset.width}%`);
      console.log(`Calculated width: ${marginalia.style.width}`);
      console.log(`Actual rendered: ${rect.width.toFixed(0)}px × ${rect.height.toFixed(0)}px`);
      console.log(`Screen position: ${rect.left.toFixed(0)}, ${rect.top.toFixed(0)}`);
      console.log(`CSS float: ${computed.float}`);
      console.log(`CSS display: ${computed.display}`);
      console.log(`CSS opacity: ${computed.opacity}`);
      console.log(`CSS visibility: ${computed.visibility}`);
      
      // Check if clipped
      const viewportWidth = window.innerWidth;
      const isClipped = rect.left < 0 || rect.right > viewportWidth;
      if (isClipped) {
        console.log(`🚨 CLIPPED: left=${rect.left.toFixed(0)}, right=${rect.right.toFixed(0)} (viewport: ${viewportWidth}px)`);
      } else {
        console.log(`✅ VISIBLE: fully within viewport`);
      }
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  debugFootnotes() {
    console.group('[DIGITAL_TALMUD_STATIC] 📝 FOOTNOTE DEBUG INFO');
    console.log(`Total footnotes: ${this.footnotes.size}`);
    
    // Debug footnote definitions
    console.group('Footnote Definitions:');
    this.footnotes.forEach((definition, footnoteId) => {
      console.log(`${footnoteId}:`);
      console.log(`  Content: ${definition.textContent.substring(0, 100)}...`);
      console.log(`  Voice: ${definition.dataset.voice || 'default'}`);
      console.log(`  Position: ${definition.dataset.position || 'auto'}`);
      console.log(`  Hidden: ${definition.style.display === 'none'}`);
    });
    console.groupEnd();
    
    // Debug footnote markers
    console.group('Footnote Markers:');
    const markers = Array.from(document.querySelectorAll('.footnote-marker'));
    markers.forEach(marker => {
      const footnoteId = marker.dataset.footnote;
      const hasDefinition = this.footnotes.has(footnoteId);
      console.log(`Marker "${footnoteId}": ${hasDefinition ? '✅ has definition' : '❌ missing definition'}`);
    });
    console.groupEnd();
    
    console.groupEnd();
  }
  
  recalculateWidths() {
    console.log('[DIGITAL_TALMUD_STATIC] Recalculating widths...');
    this.marginalia.forEach(marginalia => {
      this.calculateWidth(marginalia);
    });
    console.log('[DIGITAL_TALMUD_STATIC] Width recalculation complete');
  }
}

// Auto-initialize on content load
let digitalTalmudStaticInstance = null;

document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.post-content, .page-content')) {
    digitalTalmudStaticInstance = new DigitalTalmudStatic();
    
    // Make instance available globally for debugging
    window.DigitalTalmudStatic = digitalTalmudStaticInstance;
    
    console.log('[DIGITAL_TALMUD_STATIC] Ready. Use Ctrl+Shift+S for static debug, Ctrl+Shift+W to recalculate widths, Ctrl+Shift+F for footnote debug');
  }
});

// Recalculate on resize
window.addEventListener('resize', () => {
  if (digitalTalmudStaticInstance) {
    setTimeout(() => {
      digitalTalmudStaticInstance.recalculateWidths();
    }, 250);
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DigitalTalmudStatic };
}