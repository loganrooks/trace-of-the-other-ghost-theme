/**
 * Digital Talmud Layout System
 * Handles scroll-triggered marginalia materialization and dynamic grid adjustment
 */

class DigitalTalmud {
  constructor() {
    this.container = document.querySelector('.post-content, .page-content');
    this.mainText = null;
    this.marginalia = [];
    this.activePositions = new Set();
    this.materializedCount = 0;
    
    // Layout states
    this.layoutStates = ['none', 'left', 'right', 'both', 'full', 'intense'];
    this.currentLayout = 'none';
    
    // Performance throttling
    this.isProcessing = false;
    this.lastUpdate = 0;
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.log('[DIGITAL_TALMUD] Container not found');
      return;
    }
    
    this.setupMainTextFlow();
    this.findMarginalia();
    this.initializeObserver();
    this.addEventListeners();
    
    console.log('[DIGITAL_TALMUD] System initialized with', this.marginalia.length, 'marginalia voices');
  }
  
  setupMainTextFlow() {
    // Wrap all non-marginalia content in main text flow
    const children = Array.from(this.container.children);
    const mainTextElements = children.filter(child => 
      !child.classList.contains('marginalia-voice')
    );
    
    if (mainTextElements.length > 0) {
      const mainTextWrapper = document.createElement('div');
      mainTextWrapper.className = 'main-text-flow';
      
      mainTextElements.forEach(element => {
        mainTextWrapper.appendChild(element);
      });
      
      this.container.appendChild(mainTextWrapper);
      this.mainText = mainTextWrapper;
    }
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
      
      // Set up scroll trigger
      if (!element.dataset.scrollTrigger) {
        element.dataset.scrollTrigger = Math.min(20 + (index * 15), 90);
      }
      
      // Add unique ID
      element.dataset.marginaliaId = `marginalia-${index}`;
    });
  }
  
  initializeObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // Trigger when 10% visible
      threshold: [0.1, 0.5, 0.9]
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this), 
      options
    );
    
    this.marginalia.forEach(marginalia => {
      this.observer.observe(marginalia);
    });
  }
  
  handleIntersection(entries) {
    if (this.isProcessing) return;
    
    entries.forEach(entry => {
      const marginalia = entry.target;
      const scrollTrigger = parseFloat(marginalia.dataset.scrollTrigger) / 100;
      
      if (entry.isIntersecting && entry.intersectionRatio >= scrollTrigger) {
        this.materializeMarginalia(marginalia);
      }
    });
  }
  
  materializeMarginalia(marginalia) {
    if (marginalia.classList.contains('materializing')) return;
    
    this.isProcessing = true;
    
    // Add materialization effect
    marginalia.classList.add('materializing');
    
    // Track position
    const position = marginalia.dataset.position;
    this.activePositions.add(position);
    this.materializedCount++;
    
    // Update layout
    this.updateLayout();
    
    // Glitch effect for main text
    this.glitchMainText();
    
    // Log materialization
    console.log('[DIGITAL_TALMUD] Materialized:', position, 'voice', marginalia.dataset.voice);
    
    // Create fragment effect
    this.createFragmentEffect(marginalia);
    
    setTimeout(() => {
      this.isProcessing = false;
    }, 100);
  }
  
  updateLayout() {
    const hasLeft = this.activePositions.has('left') || 
                   this.activePositions.has('top-left') || 
                   this.activePositions.has('bottom-left');
                   
    const hasRight = this.activePositions.has('right') || 
                    this.activePositions.has('top-right') || 
                    this.activePositions.has('bottom-right');
                    
    const hasTop = this.activePositions.has('top');
    const hasBottom = this.activePositions.has('bottom');
    
    let newLayout = 'none';
    
    // Determine layout based on active positions
    if (this.materializedCount >= 6) {
      newLayout = 'intense';
    } else if (this.materializedCount >= 4 || (hasTop && hasBottom && hasLeft && hasRight)) {
      newLayout = 'full';
    } else if (hasLeft && hasRight) {
      newLayout = 'both';
    } else if (hasLeft) {
      newLayout = 'left';
    } else if (hasRight) {
      newLayout = 'right';
    }
    
    if (newLayout !== this.currentLayout) {
      this.applyLayout(newLayout);
      this.adjustMainTextSize(newLayout);
    }
  }
  
  applyLayout(layoutName) {
    // Remove old layout class
    this.container.classList.remove(`talmud-layout-${this.currentLayout}`);
    
    // Add new layout class
    this.container.classList.add(`talmud-layout-${layoutName}`);
    
    this.currentLayout = layoutName;
    
    console.log('[DIGITAL_TALMUD] Layout changed to:', layoutName);
    
    // Trigger layout change effect
    this.triggerLayoutChangeEffect();
  }
  
  adjustMainTextSize(layoutName) {
    if (!this.mainText) return;
    
    // Remove old size classes
    this.container.classList.remove(
      'main-text-squeezed-light',
      'main-text-squeezed-medium', 
      'main-text-squeezed-heavy'
    );
    
    // Apply new size class based on layout intensity
    switch (layoutName) {
      case 'left':
      case 'right':
        this.container.classList.add('main-text-squeezed-light');
        break;
      case 'both':
      case 'full':
        this.container.classList.add('main-text-squeezed-medium');
        break;
      case 'intense':
        this.container.classList.add('main-text-squeezed-heavy');
        break;
    }
  }
  
  glitchMainText() {
    if (!this.mainText) return;
    
    this.mainText.style.animation = 'none';
    setTimeout(() => {
      this.mainText.style.animation = 'random-glitch 0.3s ease-in-out';
    }, 10);
    
    setTimeout(() => {
      this.mainText.style.animation = '';
    }, 300);
  }
  
  createFragmentEffect(marginalia) {
    const voice = marginalia.dataset.voice;
    const position = marginalia.dataset.position;
    
    // Create code fragment
    const fragment = document.createElement('div');
    fragment.className = 'code-fragment marginalia-fragment';
    fragment.textContent = `// Voice ${voice} materialized at ${position}`;
    fragment.style.cssText = `
      position: fixed;
      left: ${Math.random() * window.innerWidth}px;
      top: ${Math.random() * window.innerHeight}px;
      color: ${marginalia.style.borderLeftColor || 'var(--hacker-green)'};
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      opacity: 0.8;
      pointer-events: none;
      z-index: 1000;
      animation: fragment-drift 4s ease-out forwards;
    `;
    
    document.body.appendChild(fragment);
    
    // Remove after animation
    setTimeout(() => {
      if (fragment.parentNode) {
        fragment.parentNode.removeChild(fragment);
      }
    }, 4500);
  }
  
  triggerLayoutChangeEffect() {
    // Brief screen distortion effect
    document.body.style.filter = 'hue-rotate(5deg) brightness(1.1)';
    
    setTimeout(() => {
      document.body.style.filter = '';
    }, 150);
  }
  
  addEventListeners() {
    // Keyboard shortcuts for testing
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'D':
            e.preventDefault();
            this.toggleDebugMode();
            break;
          case 'M':
            e.preventDefault();
            this.materializeAllMarginalia();
            break;
          case 'R':
            e.preventDefault();
            this.resetLayout();
            break;
        }
      }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseEffects();
      } else {
        this.resumeEffects();
      }
    });
  }
  
  toggleDebugMode() {
    document.body.classList.toggle('talmud-debug');
    console.log('[DIGITAL_TALMUD] Debug mode:', 
                document.body.classList.contains('talmud-debug') ? 'ON' : 'OFF');
  }
  
  materializeAllMarginalia() {
    this.marginalia.forEach((marginalia, index) => {
      setTimeout(() => {
        if (!marginalia.classList.contains('materializing')) {
          this.materializeMarginalia(marginalia);
        }
      }, index * 200);
    });
  }
  
  resetLayout() {
    this.marginalia.forEach(marginalia => {
      marginalia.classList.remove('materializing');
    });
    
    this.activePositions.clear();
    this.materializedCount = 0;
    this.applyLayout('none');
    this.adjustMainTextSize('none');
    
    console.log('[DIGITAL_TALMUD] Layout reset');
  }
  
  handleResize() {
    // Recalculate layout on resize
    this.updateLayout();
  }
  
  pauseEffects() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  
  resumeEffects() {
    if (this.observer) {
      this.marginalia.forEach(marginalia => {
        this.observer.observe(marginalia);
      });
    }
  }
  
  getStats() {
    return {
      marginalia: this.marginalia.length,
      materialized: this.materializedCount,
      activePositions: Array.from(this.activePositions),
      currentLayout: this.currentLayout
    };
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    document.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('resize', this.handleResize);
    
    console.log('[DIGITAL_TALMUD] System destroyed');
  }
}

// Auto-initialize on content load
let digitalTalmudInstance = null;

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a post or page
  if (document.querySelector('.post-content, .page-content')) {
    digitalTalmudInstance = new DigitalTalmud();
    
    // Make instance available globally for debugging
    window.DigitalTalmud = digitalTalmudInstance;
    
    console.log('[DIGITAL_TALMUD] Ready. Use Ctrl+Shift+D for debug mode');
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  if (digitalTalmudInstance) {
    digitalTalmudInstance.destroy();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DigitalTalmud };
}