/**
 * Digital Talmud FLIP Intrusion System
 * Handles scroll-triggered marginalia intrusion using FLIP animations and CSS Grid
 */

class DigitalTalmud {
  constructor() {
    this.container = document.querySelector('.post-content, .page-content');
    this.marginalia = [];
    this.triggerElements = [];
    this.intrudedCount = 0;
    this.activeMarginalia = {
      left: 0,
      right: 0
    };
    
    // FLIP animation state
    this.isAnimating = false;
    this.animationQueue = [];
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.log('[DIGITAL_TALMUD] Container not found');
      return;
    }
    
    // Don't wrap main text initially - let it start full width
    this.findMarginalia();
    this.setupTriggerElements();
    this.setupIntersectionObserver();
    this.addEventListeners();
    
    // Ensure text starts full width with no grid constraints
    this.resetToFullWidth();
    
    console.log('[DIGITAL_TALMUD] FLIP Intrusion system initialized with', this.marginalia.length, 'marginalia voices');
  }
  
  resetToFullWidth() {
    // Remove any layout classes
    this.container.classList.remove('has-marginalia');
    
    // Ensure container uses normal block flow
    this.container.style.display = 'block';
    
    // Identify main text for FLIP animations
    this.mainText = this.container;
  }
  
  setupTriggerElements() {
    // Find all paragraphs and other trigger elements in container
    const paragraphs = this.container.querySelectorAll('p, h1, h2, h3, blockquote');
    paragraphs.forEach((p, index) => {
      // Skip marginalia elements
      if (!p.classList.contains('marginalia-voice')) {
        p.dataset.triggerIndex = index;
        this.triggerElements.push(p);
      }
    });
  }
  
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -20% 0px', // Trigger when element is 80% visible
      threshold: 0.8
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.checkForMarginalia(entry.target);
        }
      });
    }, options);
    
    // Observe all trigger elements
    this.triggerElements.forEach(element => {
      this.observer.observe(element);
    });
  }
  
  checkForMarginalia(triggerElement) {
    const triggerIndex = parseInt(triggerElement.dataset.triggerIndex);
    
    // Find marginalia that should intrude at this trigger point
    const marginaliaToIntrude = this.marginalia.filter(m => {
      const triggerAt = m.dataset.triggersAt;
      return triggerAt === `paragraph:${triggerIndex}` || 
             (!m.classList.contains('intruding') && !triggerAt && Math.random() > 0.7);
    });
    
    marginaliaToIntrude.forEach(marginalia => {
      if (!this.isAnimating) {
        this.queueIntrusion(marginalia);
      }
    });
  }
  
  queueIntrusion(marginalia) {
    this.animationQueue.push(marginalia);
    if (!this.isAnimating) {
      this.processAnimationQueue();
    }
  }
  
  async processAnimationQueue() {
    if (this.animationQueue.length === 0) return;
    
    this.isAnimating = true;
    const marginalia = this.animationQueue.shift();
    
    await this.intrudeMarginalia(marginalia);
    
    this.isAnimating = false;
    
    // Process next in queue after a brief delay
    if (this.animationQueue.length > 0) {
      setTimeout(() => this.processAnimationQueue(), 300);
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
      
      // Set trigger point if not specified
      if (!element.dataset.triggersAt) {
        element.dataset.triggersAt = `paragraph:${Math.floor(index * 2)}`;
      }
      
      // Add unique ID
      element.dataset.marginaliaId = `marginalia-${index}`;
      
      // Auto-detect content length and set appropriate size
      this.optimizeBoxSize(element);
      
      // Ensure marginalia starts hidden
      element.style.display = 'none';
    });
  }
  
  optimizeBoxSize(marginalia) {
    const content = marginalia.textContent || marginalia.innerText;
    const length = content.length;
    
    // Assign size based on content length - more aggressive sizing for smaller boxes
    if (length < 60) {
      marginalia.dataset.size = 'small';
    } else if (length > 150) {
      marginalia.dataset.size = 'large';
    }
    
    // Set CSS custom property for responsive font sizing
    marginalia.style.setProperty('--content-length', Math.min(length / 80, 2.5));
  }
  
  async intrudeMarginalia(marginalia) {
    if (marginalia.classList.contains('intruding')) return;
    
    console.log('[DIGITAL_TALMUD] Intruding:', marginalia.dataset.position, 'voice', marginalia.dataset.voice);
    
    // FLIP Step 1: First - Record current positions
    const elementsToAnimate = this.getElementsToAnimate();
    const firstPositions = this.recordPositions(elementsToAnimate);
    
    // FLIP Step 2: Last - Apply the layout change
    this.showMarginalia(marginalia);
    this.updateLayout();
    
    // Force layout recalculation
    this.container.offsetHeight;
    
    // Record new positions
    const lastPositions = this.recordPositions(elementsToAnimate);
    
    // FLIP Step 3: Invert - Calculate deltas and apply inverse transforms
    this.applyInverseTransforms(elementsToAnimate, firstPositions, lastPositions);
    
    // FLIP Step 4: Play - Animate to final positions
    await this.animateToFinalPositions(elementsToAnimate);
    
    // Clean up transforms
    this.cleanupTransforms(elementsToAnimate);
    
    this.intrudedCount++;
  }
  
  getElementsToAnimate() {
    // Get all main text elements (excluding marginalia)
    return Array.from(this.container.querySelectorAll('p, h1, h2, h3, blockquote, img, .kg-image-card'))
      .filter(el => !el.classList.contains('marginalia-voice'));
  }
  
  recordPositions(elements) {
    return elements.map(el => ({
      element: el,
      rect: el.getBoundingClientRect()
    }));
  }
  
  showMarginalia(marginalia) {
    // Show marginalia with float positioning
    marginalia.style.display = 'block';
    marginalia.classList.add('intruding');
    
    // Apply float based on position
    const position = marginalia.dataset.position;
    if (position.includes('left')) {
      marginalia.style.float = 'left';
      marginalia.style.clear = 'left';
      this.activeMarginalia.left++;
    } else if (position.includes('right')) {
      marginalia.style.float = 'right';
      marginalia.style.clear = 'right';
      this.activeMarginalia.right++;
    }
  }
  
  updateLayout() {
    // Simply add class to indicate marginalia is present
    // Float positioning handles the actual layout
    if (this.activeMarginalia.left > 0 || this.activeMarginalia.right > 0) {
      this.container.classList.add('has-marginalia');
    } else {
      this.container.classList.remove('has-marginalia');
    }
  }
  
  applyInverseTransforms(elements, firstPositions, lastPositions) {
    elements.forEach((element, index) => {
      const first = firstPositions[index].rect;
      const last = lastPositions[index].rect;
      
      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;
      
      element.classList.add('flip-preparing');
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  }
  
  animateToFinalPositions(elements) {
    return new Promise(resolve => {
      // Use requestAnimationFrame to ensure transforms are applied
      requestAnimationFrame(() => {
        elements.forEach(element => {
          element.classList.remove('flip-preparing');
          element.classList.add('flip-animating');
          element.style.transform = 'none';
        });
        
        // Wait for animation to complete
        setTimeout(resolve, 800);
      });
    });
  }
  
  cleanupTransforms(elements) {
    elements.forEach(element => {
      element.classList.remove('flip-animating');
      element.style.transform = '';
    });
  }
  
  resetLayout() {
    // Reset all marginalia
    this.marginalia.forEach(marginalia => {
      marginalia.classList.remove('intruding');
      marginalia.style.display = 'none';
      marginalia.style.float = 'none';
      marginalia.style.clear = 'none';
    });
    
    // Reset container
    this.resetToFullWidth();
    
    // Reset counters
    this.activeMarginalia = { left: 0, right: 0 };
    this.intrudedCount = 0;
    
    console.log('[DIGITAL_TALMUD] Layout reset');
  }
  
  materializeAllMarginalia() {
    this.marginalia.forEach((marginalia, index) => {
      setTimeout(() => {
        if (!marginalia.classList.contains('intruding')) {
          this.queueIntrusion(marginalia);
        }
      }, index * 200); // Staggered intrusion
    });
  }
  
  toggleDebugMode() {
    document.body.classList.toggle('talmud-debug');
    console.log('[DIGITAL_TALMUD] Debug mode:', 
                document.body.classList.contains('talmud-debug') ? 'ON' : 'OFF');
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
  }
  
  getStats() {
    return {
      marginalia: this.marginalia.length,
      materialized: this.materializedCount
    };
  }
  
  destroy() {
    window.removeEventListener('scroll', this.scrollHandler);
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