/**
 * Digital Talmud FLIP Intrusion System
 * Handles scroll-triggered marginalia intrusion using FLIP animations and CSS Float
 * 
 * WIDTH CONTROL:
 * - data-width="15|20|25|30" - Sets max width as viewport percentage
 * - data-size="small|medium|large" - Predefined size categories
 * - Auto-calculated based on content length
 * - Never exceeds 30% of container width to ensure text wrapping
 * 
 * SCROLL TRIGGERS:
 * - Only fires when element center reaches viewport center
 * - Uses Intersection Observer with precise center detection
 * - Eliminates premature intrusion issues
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
    
    // Scroll state tracking
    this.scrollTracker = {
      lastScrollY: window.scrollY,
      direction: 'down',
      velocity: 0,
      isScrolling: false
    };
    
    // Marginalia states for hysteresis
    this.STATES = {
      INACTIVE: 'inactive',
      ACTIVATING: 'activating', 
      ACTIVE: 'active',
      DEACTIVATING: 'deactivating'
    };
    
    // Configuration
    this.config = {
      READING_ZONE: 0.25,        // 25% down viewport (more permissive)
      HYSTERESIS_DISTANCE: 300,  // pixels
      ACTIVATION_DELAY: 50,      // ms (faster activation)
      DEACTIVATION_DELAY: 500    // ms
    };
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.log('[DIGITAL_TALMUD] Container not found');
      return;
    }
    
    // Process marginalia at their natural positions
    this.findMarginalia();
    this.setupDirectObserver();
    this.addEventListeners();
    
    // Ensure text starts full width
    this.resetToFullWidth();
    
    console.log('[DIGITAL_TALMUD] Direct observation system initialized with', this.marginalia.length, 'marginalia voices');
  }
  
  resetToFullWidth() {
    // Remove any layout classes
    this.container.classList.remove('has-marginalia');
    
    // Ensure container uses normal block flow
    this.container.style.display = 'block';
    
    // Identify main text for FLIP animations
    this.mainText = this.container;
  }
  
  // No longer needed - observe marginalia directly at their natural positions
  
  setupDirectObserver() {
    // Observe marginalia directly at their natural Ghost card positions
    const options = {
      root: null,
      rootMargin: '0px 0px 0px 0px', // No margins - observe any intersection with viewport
      threshold: [0, 0.001, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5] // Even lower thresholds
    };
    
    console.log('[DIGITAL_TALMUD] Setting up direct observer with 80% viewport detection zone');
    
    this.observer = new IntersectionObserver((entries) => {
      console.log(`[DIGITAL_TALMUD] 🔍 IntersectionObserver callback fired with ${entries.length} entries`);
      
      entries.forEach(entry => {
        const marginalia = entry.target;
        
        console.log(`[DIGITAL_TALMUD] 📊 Processing entry for ${marginalia.dataset.marginaliaId}:`);
        console.log(`  isIntersecting: ${entry.isIntersecting}`);
        console.log(`  intersectionRatio: ${entry.intersectionRatio.toFixed(4)}`);
        console.log(`  target bounds: top=${entry.boundingClientRect.top.toFixed(0)}, bottom=${entry.boundingClientRect.bottom.toFixed(0)}`);
        console.log(`  root bounds: top=${entry.rootBounds.top}, bottom=${entry.rootBounds.bottom}`);
        
        // Update marginalia state based on its actual position
        this.updateMarginaliaState(marginalia, entry);
        
        // Update debug state attribute for visual debugging
        if (document.body.classList.contains('talmud-debug')) {
          marginalia.dataset.debugState = marginalia.state;
        }
      });
    }, options);
    
    // Setup scroll tracking for hysteresis
    this.setupScrollTracking();
    
    // Observe all marginalia directly
    let observedCount = 0;
    this.marginalia.forEach((marginalia, index) => {
      // Initialize marginalia state
      marginalia.state = this.STATES.INACTIVE;
      marginalia.activationScrollY = null;
      marginalia.stateChangeTime = Date.now();
      
      // Critical: Ensure element is actually in DOM and observable
      const rect = marginalia.getBoundingClientRect();
      const computedStyle = getComputedStyle(marginalia);
      
      console.log(`[DIGITAL_TALMUD] Pre-observation check ${index}:`);
      console.log(`  Element: ${marginalia.tagName}.${marginalia.className}`);
      console.log(`  Position: top=${rect.top}, height=${rect.height}`);
      console.log(`  Display: ${computedStyle.display}, Opacity: ${computedStyle.opacity}`);
      console.log(`  Visibility: ${computedStyle.visibility}`);
      
      // Observe the marginalia element itself
      this.observer.observe(marginalia);
      observedCount++;
      
      console.log(`[DIGITAL_TALMUD] ✅ Observing ${marginalia.dataset.marginaliaId} at natural position`);
    });
    
    console.log(`[DIGITAL_TALMUD] Total marginalia observed: ${observedCount}/${this.marginalia.length}`);
    
    // CRITICAL TEST: Force an immediate intersection check after a delay
    setTimeout(() => {
      console.log('[DIGITAL_TALMUD] 🚨 FORCED INTERSECTION TEST - checking if observer is working...');
      this.marginalia.forEach(marginalia => {
        const rect = marginalia.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        console.log(`${marginalia.dataset.marginaliaId}: inViewport=${inViewport}, top=${rect.top.toFixed(0)}, state=${marginalia.state}`);
        
        if (inViewport && marginalia.state === this.STATES.INACTIVE) {
          console.log(`🚨 ${marginalia.dataset.marginaliaId} should have triggered IntersectionObserver but didn't!`);
        }
      });
    }, 1000);
  }
  
  setupScrollTracking() {
    let scrollTimeout;
    let debugLogInterval;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Update scroll state
      this.scrollTracker.direction = currentScrollY > this.scrollTracker.lastScrollY ? 'down' : 'up';
      this.scrollTracker.velocity = Math.abs(currentScrollY - this.scrollTracker.lastScrollY);
      this.scrollTracker.isScrolling = true;
      this.scrollTracker.lastScrollY = currentScrollY;
      
      // Enhanced debugging - log marginalia positions during scroll
      if (document.body.classList.contains('talmud-debug') && this.marginalia.length > 0) {
        console.log(`[DIGITAL_TALMUD] 📍 SCROLL EVENT: y=${currentScrollY}, direction=${this.scrollTracker.direction}, velocity=${this.scrollTracker.velocity}`);
        
        // Log current position of each marginalia relative to viewport
        this.marginalia.forEach(marginalia => {
          const rect = marginalia.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const topPercentage = (rect.top / viewportHeight * 100).toFixed(1);
          const bottomPercentage = (rect.bottom / viewportHeight * 100).toFixed(1);
          
          console.log(`  ${marginalia.dataset.marginaliaId}: top=${topPercentage}%, bottom=${bottomPercentage}%, state=${marginalia.state}`);
          
          // Check if marginalia should be in observation zone
          const inObservationZone = rect.top <= viewportHeight * 0.9 && rect.bottom >= viewportHeight * 0.1;
          if (inObservationZone) {
            console.log(`    🎯 ${marginalia.dataset.marginaliaId} IS IN OBSERVATION ZONE (10%-90%)`);
          }
        });
      }
      
      // Clear previous timeout and set new one
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.scrollTracker.isScrolling = false;
      }, 150);
      
      // Update hysteresis for active marginalia
      this.updateHysteresis();
    }, { passive: true });
  }
  
  updateMarginaliaState(marginalia, entry) {
    const rect = marginalia.getBoundingClientRect();
    const currentTime = Date.now();
    const isInReadingZone = entry.isIntersecting && entry.intersectionRatio > 0.001; // Ultra-low threshold
    const isScrollingDown = this.scrollTracker.direction === 'down';
    const hasMinimumIntersection = entry.intersectionRatio > 0.001; // Ultra-low fallback threshold
    
    // Debug logging for visibility issues
    if (entry.isIntersecting) {
      console.log(`[DIGITAL_TALMUD] 👀 ${marginalia.dataset.marginaliaId} is intersecting:`);
      console.log(`  Intersection ratio: ${entry.intersectionRatio.toFixed(3)}`);
      console.log(`  In reading zone: ${isInReadingZone}`);
      console.log(`  Minimum intersection: ${hasMinimumIntersection}`);
      console.log(`  Scrolling down: ${isScrollingDown}`);
      console.log(`  Current state: ${marginalia.state}`);
    }
    
    switch (marginalia.state) {
      case this.STATES.INACTIVE:
        // Primary activation: reading zone + scrolling down
        if (isInReadingZone && isScrollingDown) {
          console.log(`[DIGITAL_TALMUD] 🟡 ${marginalia.dataset.marginaliaId} entering ACTIVATING state (primary trigger)`);
          marginalia.state = this.STATES.ACTIVATING;
          marginalia.stateChangeTime = currentTime;
          
          setTimeout(() => {
            if (marginalia.state === this.STATES.ACTIVATING) {
              this.activateMarginalia(marginalia);
            }
          }, this.config.ACTIVATION_DELAY);
        }
        // Fallback activation: any intersection at all (for debugging)
        else if (entry.isIntersecting) {
          console.log(`[DIGITAL_TALMUD] 🟡 ${marginalia.dataset.marginaliaId} entering ACTIVATING state (ANY intersection trigger)`);
          marginalia.state = this.STATES.ACTIVATING;
          marginalia.stateChangeTime = currentTime;
          
          setTimeout(() => {
            if (marginalia.state === this.STATES.ACTIVATING) {
              this.activateMarginalia(marginalia);
            }
          }, this.config.ACTIVATION_DELAY);
        }
        break;
        
      case this.STATES.ACTIVATING:
        if (!isInReadingZone) {
          // Cancel activation if marginalia left reading zone
          marginalia.state = this.STATES.INACTIVE;
          marginalia.stateChangeTime = currentTime;
          console.log(`[DIGITAL_TALMUD] ❌ ${marginalia.dataset.marginaliaId} activation cancelled`);
        }
        break;
        
      case this.STATES.ACTIVE:
        // Hysteresis handled in updateHysteresis()
        break;
        
      case this.STATES.DEACTIVATING:
        // Complete deactivation after delay
        if (currentTime - marginalia.stateChangeTime > this.config.DEACTIVATION_DELAY) {
          this.completeDeactivation(marginalia);
        }
        break;
    }
  }
  
  // Simplified - no longer need complex zone calculations since we observe marginalia directly
  
  updateHysteresis() {
    this.marginalia.forEach(marginalia => {
      if (marginalia.state === this.STATES.ACTIVE && marginalia.activationScrollY) {
        const scrolledDistance = this.scrollTracker.lastScrollY - marginalia.activationScrollY;
        
        // Also check if marginalia has scrolled significantly out of view
        const rect = marginalia.getBoundingClientRect();
        const isWellAboveViewport = rect.bottom < -50; // 50px above viewport
        
        // Deactivate if scrolled past hysteresis distance OR if marginalia is well above viewport
        if (scrolledDistance > this.config.HYSTERESIS_DISTANCE || isWellAboveViewport) {
          console.log(`[DIGITAL_TALMUD] ${marginalia.dataset.marginaliaId} entering DEACTIVATING state (scrolled ${scrolledDistance}px past, aboveViewport: ${isWellAboveViewport})`);
          marginalia.state = this.STATES.DEACTIVATING;
          marginalia.stateChangeTime = Date.now();
        }
      }
    });
  }
  
  activateMarginalia(marginalia) {
    if (marginalia.classList.contains('intruding')) return;
    
    console.log(`[DIGITAL_TALMUD] 🚀 ACTIVATING ${marginalia.dataset.marginaliaId}`);
    
    // Record activation scroll position for hysteresis
    marginalia.activationScrollY = this.scrollTracker.lastScrollY;
    marginalia.state = this.STATES.ACTIVE;
    marginalia.stateChangeTime = Date.now();
    
    // Make marginalia visible and position it
    marginalia.style.visibility = 'visible'; // Make visible first
    this.showMarginalia(marginalia);
    
    // Highlight referenced text phrase if specified (search in nearby content)
    if (marginalia.dataset.targetPhrase) {
      this.highlightNearbyPhrase(marginalia, marginalia.dataset.targetPhrase);
    }
    
    // Smooth entrance animation
    marginalia.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    marginalia.style.opacity = '1';
    marginalia.style.transform = 'translateY(0) scale(1)';
    
    marginalia.classList.add('intruding');
    
    console.log(`[DIGITAL_TALMUD] ✅ ${marginalia.dataset.marginaliaId} FULLY ACTIVATED (scroll: ${marginalia.activationScrollY})`);
  }
  
  completeDeactivation(marginalia) {
    if (!marginalia.classList.contains('intruding')) return;
    
    console.log(`[DIGITAL_TALMUD] 🔄 DEACTIVATING ${marginalia.dataset.marginaliaId}`);
    
    // Remove text highlighting
    this.removeTextHighlight(marginalia.dataset.targetPhrase);
    
    // Smooth exit animation
    marginalia.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    marginalia.style.opacity = '0';
    marginalia.style.transform = 'translateY(10px) scale(0.9)';
    
    setTimeout(() => {
      marginalia.style.visibility = 'hidden'; // Use visibility instead of display
      marginalia.classList.remove('intruding');
      marginalia.style.float = 'none';
      marginalia.style.clear = 'none';
      
      // Reset state
      marginalia.state = this.STATES.INACTIVE;
      marginalia.activationScrollY = null;
      
      // Update counters
      const position = marginalia.dataset.position;
      if (position.includes('left')) this.activeMarginalia.left--;
      if (position.includes('right')) this.activeMarginalia.right--;
      this.updateLayout();
      
      console.log(`[DIGITAL_TALMUD] ✅ ${marginalia.dataset.marginaliaId} FULLY DEACTIVATED`);
    }, 400);
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
      
      // Add unique ID
      element.dataset.marginaliaId = `marginalia-${index}`;
      
      // Auto-detect content length and set appropriate size + width
      this.optimizeBoxSize(element);
      
      // Apply font size if specified
      this.applyFontSize(element);
      
      // Start marginalia invisible but observable (NOT display:none!)
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px) scale(0.8)';
      element.style.transition = 'none'; // Will be set dynamically
      element.style.visibility = 'visible'; // MUST be visible for reliable IntersectionObserver
      element.style.pointerEvents = 'none'; // Don't interfere with page interaction
      
      console.log(`[DIGITAL_TALMUD] Initialized ${element.dataset.marginaliaId} as hidden but observable`);
    });
  }
  
  optimizeBoxSize(marginalia) {
    const content = marginalia.textContent || marginalia.innerText;
    const length = content.length;
    
    // Assign size based on content length
    if (length < 50) {
      marginalia.dataset.size = 'small';
      if (!marginalia.dataset.width) marginalia.dataset.width = '15';
    } else if (length < 100) {
      marginalia.dataset.size = 'medium';
      if (!marginalia.dataset.width) marginalia.dataset.width = '20';
    } else if (length > 150) {
      marginalia.dataset.size = 'large';
      if (!marginalia.dataset.width) marginalia.dataset.width = '25';
    } else {
      if (!marginalia.dataset.width) marginalia.dataset.width = '20';
    }
    
    // Calculate optimal max width based on container
    const containerWidth = this.container.offsetWidth;
    const maxAllowedWidth = Math.floor(containerWidth * 0.3); // Never more than 30%
    
    // Set CSS custom property for dynamic width control
    marginalia.style.setProperty('--marginalia-max-width', `${maxAllowedWidth}px`);
    marginalia.style.setProperty('--content-length', Math.min(length / 80, 2.5));
    
    console.log(`[DIGITAL_TALMUD] Optimized ${marginalia.dataset.marginaliaId}: ${length} chars, ${marginalia.dataset.width}vw, max ${maxAllowedWidth}px`);
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
    // Reset all marginalia states
    this.marginalia.forEach(marginalia => {
      // Force complete deactivation
      marginalia.state = this.STATES.INACTIVE;
      marginalia.activationScrollY = null;
      marginalia.stateChangeTime = Date.now();
      
      // Remove visual elements
      marginalia.classList.remove('intruding');
      marginalia.style.display = 'none';
      marginalia.style.float = 'none';
      marginalia.style.clear = 'none';
      marginalia.style.opacity = '0';
      marginalia.style.transform = 'translateY(20px) scale(0.8)';
      
      // Remove text highlighting
      if (marginalia.dataset.targetPhrase) {
        this.removeTextHighlight(marginalia.dataset.targetPhrase);
      }
    });
    
    // Reset container
    this.resetToFullWidth();
    
    // Reset counters
    this.activeMarginalia = { left: 0, right: 0 };
    this.intrudedCount = 0;
    
    console.log('[DIGITAL_TALMUD] Complete layout and state reset');
  }
  
  applyFontSize(marginalia) {
    // Numerical scale system (0.4 - 2.5 range)
    if (marginalia.dataset.fontScale) {
      const scale = parseFloat(marginalia.dataset.fontScale);
      if (scale >= 0.4 && scale <= 2.5) {
        marginalia.style.setProperty('--font-scale', scale);
        marginalia.style.fontSize = `${scale * 0.7}rem`; // Base 0.7rem * scale
        console.log(`[DIGITAL_TALMUD] Applied font scale ${scale} to ${marginalia.dataset.marginaliaId}`);
      } else {
        console.warn(`[DIGITAL_TALMUD] Font scale ${scale} out of range (0.4-2.5) for ${marginalia.dataset.marginaliaId}`);
      }
    }
    
    // Direct font size override
    else if (marginalia.dataset.fontSize) {
      marginalia.style.fontSize = marginalia.dataset.fontSize;
      console.log(`[DIGITAL_TALMUD] Applied direct font size ${marginalia.dataset.fontSize} to ${marginalia.dataset.marginaliaId}`);
    }
    
    // Predefined font categories (backward compatibility)
    else if (marginalia.dataset.font) {
      const fontMap = {
        'tiny': 0.6,
        'small': 0.8,
        'medium': 1.0,
        'large': 1.3,
        'huge': 1.8
      };
      
      const scale = fontMap[marginalia.dataset.font];
      if (scale) {
        marginalia.style.fontSize = `${scale * 0.7}rem`;
        console.log(`[DIGITAL_TALMUD] Applied predefined font '${marginalia.dataset.font}' (${scale}) to ${marginalia.dataset.marginaliaId}`);
      }
    }
  }
  
  highlightNearbyPhrase(marginalia, phrase) {
    if (!phrase) return;
    
    // Search in nearby paragraphs (before and after the marginalia)
    const nearbyElements = this.findNearbyTextElements(marginalia);
    
    for (let element of nearbyElements) {
      if (element.textContent.toLowerCase().includes(phrase.toLowerCase())) {
        const text = element.innerHTML;
        const regex = new RegExp(`(${this.escapeRegex(phrase)})`, 'gi');
        
        if (regex.test(element.textContent)) {
          const highlightedText = text.replace(regex, 
            '<mark class="marginalia-highlight" data-phrase="$1">$1</mark>'
          );
          element.innerHTML = highlightedText;
          console.log(`[DIGITAL_TALMUD] Highlighted phrase "${phrase}" in nearby element`);
          break; // Only highlight first occurrence
        }
      }
    }
  }
  
  findNearbyTextElements(marginalia) {
    const elements = [];
    let current = marginalia;
    
    // Look for text elements before marginalia
    for (let i = 0; i < 3; i++) {
      current = current.previousElementSibling;
      if (current && (current.tagName === 'P' || current.tagName.match(/^H[1-6]$/))) {
        elements.unshift(current);
      } else {
        break;
      }
    }
    
    current = marginalia;
    // Look for text elements after marginalia  
    for (let i = 0; i < 3; i++) {
      current = current.nextElementSibling;
      if (current && (current.tagName === 'P' || current.tagName.match(/^H[1-6]$/))) {
        elements.push(current);
      } else {
        break;
      }
    }
    
    return elements;
  }
  
  removeTextHighlight(phrase) {
    if (!phrase) return;
    
    const highlights = document.querySelectorAll('.marginalia-highlight');
    highlights.forEach(highlight => {
      if (highlight.dataset.phrase && 
          highlight.dataset.phrase.toLowerCase() === phrase.toLowerCase()) {
        highlight.outerHTML = highlight.innerHTML;
      }
    });
  }
  
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  materializeAllMarginalia() {
    console.log('[DIGITAL_TALMUD] 🚀 Force-activating all marginalia for testing');
    console.log(`Found ${this.marginalia.length} marginalia elements to activate`);
    
    if (this.marginalia.length === 0) {
      console.error('[DIGITAL_TALMUD] ❌ NO MARGINALIA FOUND! Check if HTML cards have class "marginalia-voice"');
      return;
    }
    
    this.marginalia.forEach((marginalia, index) => {
      console.log(`Force-activating ${index + 1}/${this.marginalia.length}: ${marginalia.dataset.marginaliaId}`);
      setTimeout(() => {
        // Force activate regardless of state
        marginalia.activationScrollY = this.scrollTracker.lastScrollY;
        marginalia.state = this.STATES.ACTIVATING; // Set to activating first
        this.activateMarginalia(marginalia);
      }, index * 300);
    });
  }
  
  toggleDebugMode() {
    document.body.classList.toggle('talmud-debug');
    const isDebugMode = document.body.classList.contains('talmud-debug');
    
    if (isDebugMode) {
      console.log('[DIGITAL_TALMUD] 🔍 DEBUG MODE ACTIVATED');
      console.log('Available debug shortcuts:');
      console.log('- Ctrl+Shift+I: Log debug info');
      console.log('- Ctrl+Shift+M: Show all marginalia');
      console.log('- Ctrl+Shift+R: Reset layout');
      this.logDebugInfo();
    } else {
      console.log('[DIGITAL_TALMUD] Debug mode deactivated');
    }
  }
  
  logDebugInfo() {
    console.group('[DIGITAL_TALMUD] 🔍 Debug Information (Direct Observation)');
    console.log(`Total marginalia: ${this.marginalia.length}`);
    console.log(`Active marginalia: L${this.activeMarginalia.left} R${this.activeMarginalia.right}`);
    
    console.group('📊 Scroll State:');
    console.log(`Direction: ${this.scrollTracker.direction}`);
    console.log(`Position: ${this.scrollTracker.lastScrollY}px`);
    console.log(`Velocity: ${this.scrollTracker.velocity}px`);
    console.log(`Is scrolling: ${this.scrollTracker.isScrolling}`);
    console.log(`Observation zone: 10% from top/bottom (activation when marginalia enters this zone)`);
    console.log(`Hysteresis distance: ${this.config.HYSTERESIS_DISTANCE}px`);
    console.groupEnd();
    
    console.group('📝 Marginalia Details:');
    this.marginalia.forEach((m, i) => {
      const stateIcons = {
        [this.STATES.INACTIVE]: '⭕ INACTIVE',
        [this.STATES.ACTIVATING]: '🟡 ACTIVATING', 
        [this.STATES.ACTIVE]: '✅ ACTIVE',
        [this.STATES.DEACTIVATING]: '🟠 DEACTIVATING'
      };
      
      const status = stateIcons[m.state] || '❓ UNKNOWN';
      console.log(`${i + 1}. ${m.dataset.marginaliaId} ${status}`);
      console.log(`   Position: ${m.dataset.position || 'auto'}`);
      console.log(`   Voice: ${m.dataset.voice || 'auto'}`);
      console.log(`   Target phrase: "${m.dataset.targetPhrase || 'none'}"`);
      console.log(`   Font scale: ${m.dataset.fontScale || 'default'} | Size: ${m.dataset.fontSize || 'calculated'}`);
      
      // Show actual marginalia position
      const rect = m.getBoundingClientRect();
      console.log(`   DOM position: top=${rect.top.toFixed(0)}px, bottom=${rect.bottom.toFixed(0)}px, height=${rect.height.toFixed(0)}px`);
      
      if (m.activationScrollY) {
        const scrollDistance = this.scrollTracker.lastScrollY - m.activationScrollY;
        console.log(`   Activation scroll: ${m.activationScrollY}px (distance: ${scrollDistance}px)`);
      }
    });
    console.groupEnd();
    
    console.group('🖥️ Viewport Info:');
    console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`Container width: ${this.container.offsetWidth}px`);
    console.log(`Observation: marginalia observed directly at their Ghost card positions`);
    console.groupEnd();
    
    console.groupEnd();
  }
  
  recalculateWidths() {
    this.marginalia.forEach(marginalia => {
      this.optimizeBoxSize(marginalia);
    });
    console.log('[DIGITAL_TALMUD] Widths recalculated for new viewport size');
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  toggleDebugMode() {
    document.body.classList.toggle('talmud-debug');
    console.log('[DIGITAL_TALMUD] Debug mode:', 
                document.body.classList.contains('talmud-debug') ? 'ON' : 'OFF');
  }
  
  manualIntersectionCheck() {
    console.log('[DIGITAL_TALMUD] 🔧 MANUAL INTERSECTION CHECK:');
    this.marginalia.forEach(marginalia => {
      const rect = marginalia.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      console.log(`${marginalia.dataset.marginaliaId}:`);
      console.log(`  Position: top=${rect.top.toFixed(0)}, left=${rect.left.toFixed(0)}, width=${rect.width.toFixed(0)}, height=${rect.height.toFixed(0)}`);
      console.log(`  Viewport: ${viewportWidth}x${viewportHeight}`);
      console.log(`  Visible: ${rect.top < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0}`);
      console.log(`  State: ${marginalia.state}`);
      console.log(`  Style: display=${getComputedStyle(marginalia).display}, visibility=${getComputedStyle(marginalia).visibility}, opacity=${getComputedStyle(marginalia).opacity}`);
      
      // Check if element should be intersecting
      const shouldIntersect = rect.top < viewportHeight && rect.bottom > 0;
      console.log(`  Should intersect viewport: ${shouldIntersect}`);
      
      if (!shouldIntersect && rect.top > viewportHeight) {
        console.log(`  📍 Element is ${(rect.top - viewportHeight).toFixed(0)}px BELOW viewport`);
      } else if (!shouldIntersect && rect.bottom < 0) {
        console.log(`  📍 Element is ${Math.abs(rect.bottom).toFixed(0)}px ABOVE viewport`);
      }
    });
  }

  addEventListeners() {
    // Enhanced keyboard shortcuts for testing
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
          case 'I':
            e.preventDefault();
            this.logDebugInfo();
            break;
          case 'C':
            e.preventDefault();
            console.log('[DIGITAL_TALMUD] 🎯 Manual intersection check triggered via Ctrl+Shift+C');
            this.manualIntersectionCheck();
            break;
        }
      }
    });
    
    // Recalculate widths on window resize
    window.addEventListener('resize', this.debounce(() => {
      this.recalculateWidths();
    }, 250));
  }
  
  getStats() {
    return {
      marginalia: this.marginalia.length,
      intruded: this.intrudedCount,
      active: {
        left: this.activeMarginalia.left,
        right: this.activeMarginalia.right
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        center: window.innerHeight / 2
      }
    };
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('resize', this.recalculateWidths);
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