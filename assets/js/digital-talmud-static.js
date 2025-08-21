/**
 * Digital Talmud STATIC Marginalia System
 * Simplified approach: Always visible marginalia with proper width control
 * No complex animations, no IntersectionObserver, no state management
 */

class DigitalTalmudStatic {
  constructor() {
    this.container = document.querySelector('.post-content, .page-content');
    this.marginalia = [];
    
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
    this.addDebugListeners();
    
    console.log('[DIGITAL_TALMUD_STATIC] Static marginalia system initialized with', this.marginalia.length, 'marginalia voices');
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
    
    console.log('[DIGITAL_TALMUD_STATIC] Ready. Use Ctrl+Shift+S for static debug, Ctrl+Shift+W to recalculate widths');
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