/**
 * Hacker Effects System
 * Creates matrix-style background, code fragments, and glitch effects
 */

class HackerEffects {
  constructor() {
    this.isActive = true;
    this.matrixColumns = [];
    this.activeCodeFragments = []; // Track active fragments for cleanup
    this.maxMatrixColumns = 8; // Reduced limit for performance
    this.maxCodeFragments = 2;  // Reduced limit for performance
    this.performanceMode = this.detectPerformanceMode();
    this.codeFragments = [
      "function deconstruct(reality) {",
      "  if (!reality.stable) {",
      "    reality.glitch();",
      "  }",
      "}",
      "const ghost = new Platform();",
      "ghost.constraints.visible = true;",
      "while (writing) {",
      "  text.revise().erase().supplement();",
      "}",
      "// TODO: question authority",
      "margin.voices.forEach(voice => {",
      "  voice.invade(center);",
      "});",
      "ERROR: Philosophy not found",
      "WARNING: Meaning unstable",
      "> executing trace_of_other.exe",
      "SYSTEM: Reality.dll corrupted",
      "class Trace extends Other {",
      "  constructor() {",
      "    this.presence = false;",
      "    this.absence = true;",
      "  }",
      "}",
      "if (author.exists()) {",
      "  author.deconstruct();",
      "}",
      "/* Platform violence detected */",
      "log.write(\"Every word is shaped\");",
      "database.query(\"SELECT * FROM hidden\");",
      "void main() {",
      "  printf(\"Hello, Ghost\\n\");",
      "  return philosophy;",
      "}",
      "npm install deconstruction",
      "git commit -m \"Questioning git\"",
      "sudo rm -rf /certainty/",
      "ping localhost # Am I here?",
      "cd /margins && ls -la voices/",
      "[TRACE] Ghost CMS limiting expression",
      "[DEBUG] Handlebars constraining logic",
      "[ERROR] CSS fighting philosophy",
      "// The code knows it's being read"
    ];
    
    this.matrixChars = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z',
      '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
      '-', '_', '=', '+', '[', ']', '{', '}', '|', '\\',
      ':', ';', '"', "'", '<', '>', ',', '.', '?', '/',
      '~', '`'
    ];
    
    // Check if animations should be disabled
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isActive = false;
      return;
    }
    
    // Performance monitoring state
    this.performanceModeTriggered = false; // Prevent multiple triggers
    this.lastPerformanceCheck = 0;
    
    this.init();
  }
  
  init() {
    if (!this.isActive) return;
    
    // Create matrix background container
    this.createMatrixBackground();
    
    // Start matrix animation
    this.startMatrixRain();
    
    // Start code fragment generation
    this.startCodeFragments();
    
    // Add random glitch effects
    this.startRandomGlitches();
    
    // Initialize page effects
    this.initPageEffects();
    
    // Performance monitoring
    this.monitorPerformance();
    
    console.log('[HACKER_EFFECTS] System initialized', `Performance mode: ${this.performanceMode}`);
  }
  
  detectPerformanceMode() {
    // Detect mobile/low-performance devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isSlowConnection = navigator.connection && (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');
    
    if (isMobile || isLowEnd || isSlowConnection) {
      return 'low'; // Minimal effects
    }
    return 'normal'; // Full effects
  }
  
  createMatrixBackground() {
    const matrixBg = document.createElement('div');
    matrixBg.className = 'matrix-background';
    document.body.appendChild(matrixBg);
    this.matrixContainer = matrixBg;
    
    // Create side columns only where they'll be visible
    this.createSideColumns();
  }
  
  createSideColumns() {
    // Create left and right side areas for matrix effect only
    const leftSide = document.createElement('div');
    leftSide.className = 'matrix-side-area matrix-left';
    leftSide.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: calc((100vw - 1200px) / 2);
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
    `;
    
    const rightSide = document.createElement('div');
    rightSide.className = 'matrix-side-area matrix-right';
    rightSide.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: calc((100vw - 1200px) / 2);
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
    `;
    
    document.body.appendChild(leftSide);
    document.body.appendChild(rightSide);
    
    this.leftSideArea = leftSide;
    this.rightSideArea = rightSide;
    
    // Only create matrix columns if side areas are visible
    if (window.innerWidth > 1200) {
      this.sideColumnsActive = true;
    } else {
      this.sideColumnsActive = false;
    }
  }
  
  startMatrixRain() {
    // Only start matrix rain if we have visible side areas
    if (!this.sideColumnsActive) {
      console.log('[HACKER_EFFECTS] Skipping matrix rain - no visible side areas');
      return;
    }
    
    // Calculate columns only for the visible side areas
    const sideWidth = Math.max(0, (window.innerWidth - 1200) / 2);
    const baseColumnCount = Math.floor(sideWidth / 20) * 2; // Both sides
    const columnCount = this.performanceMode === 'low' ? Math.min(baseColumnCount, 3) : Math.min(baseColumnCount, this.maxMatrixColumns);
    
    // Create fewer initial columns for better performance
    const initialColumns = Math.min(columnCount * 0.3, 2);
    for (let i = 0; i < initialColumns; i++) {
      this.createMatrixColumn(i);
    }
    
    // Create new columns less frequently, respecting limits
    const interval = this.performanceMode === 'low' ? 5000 : 3000; // 5s for low-end, 3s for normal
    setInterval(() => {
      if (this.sideColumnsActive && this.matrixColumns.length < this.maxMatrixColumns) {
        this.createMatrixColumn(Math.floor(Math.random() * columnCount));
      }
    }, interval);
    
    console.log(`[HACKER_EFFECTS] Matrix rain started with ${columnCount} max columns in side areas`);
  }
  
  createMatrixColumn(index) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    
    // Generate random characters for the column
    const length = 15 + Math.floor(Math.random() * 25);
    let text = '';
    for (let i = 0; i < length; i++) {
      text += this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)] + '\n';
    }
    column.textContent = text;
    
    // Position in left or right side area only
    const isLeftSide = Math.random() > 0.5;
    const sideWidth = Math.max(0, (window.innerWidth - 1200) / 2);
    
    if (isLeftSide && this.leftSideArea && sideWidth > 50) {
      column.style.left = Math.random() * (sideWidth - 20) + 'px';
      this.leftSideArea.appendChild(column);
    } else if (!isLeftSide && this.rightSideArea && sideWidth > 50) {
      column.style.left = Math.random() * (sideWidth - 20) + 'px';
      this.rightSideArea.appendChild(column);
    } else {
      // If side areas too small, don't create column
      return;
    }
    
    column.style.animationDelay = Math.random() * 5 + 's';
    column.style.animationDuration = (8 + Math.random() * 10) + 's';
    
    this.matrixColumns.push(column);
    
    // Remove column after animation completes
    setTimeout(() => {
      if (column.parentNode) {
        column.parentNode.removeChild(column);
      }
      const columnIndex = this.matrixColumns.indexOf(column);
      if (columnIndex > -1) {
        this.matrixColumns.splice(columnIndex, 1);
      }
    }, 20000);
  }
  
  startCodeFragments() {
    if (this.performanceMode === 'low') {
      // Very infrequent code fragments on low-end devices
      setInterval(() => {
        if (Math.random() > 0.7 && this.activeCodeFragments.length < this.maxCodeFragments) { // 30% chance
          this.generateCodeFragment();
        }
      }, 8000 + Math.random() * 7000); // 8-15 seconds
    } else {
      // Normal frequency but still limited
      setInterval(() => {
        if (Math.random() > 0.5 && this.activeCodeFragments.length < this.maxCodeFragments) { // 50% chance
          this.generateCodeFragment();
        }
      }, 5000 + Math.random() * 5000); // 5-10 seconds
    }
  }
  
  generateCodeFragment() {
    const fragment = document.createElement('div');
    const fragmentText = this.codeFragments[Math.floor(Math.random() * this.codeFragments.length)];
    
    // Determine fragment type and styling
    let fragmentClass = 'code-fragment';
    if (fragmentText.includes('ERROR')) {
      fragmentClass += ' error';
    } else if (fragmentText.includes('WARNING')) {
      fragmentClass += ' warning';
    } else if (fragmentText.startsWith('//') || fragmentText.startsWith('/*')) {
      fragmentClass += ' comment';
    } else if (fragmentText.includes('function') || fragmentText.includes('class')) {
      fragmentClass += ' function';
    }
    
    fragment.className = fragmentClass;
    fragment.textContent = fragmentText;
    fragment.style.cssText = `
      position: fixed;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      opacity: 0.8;
      pointer-events: none;
      white-space: nowrap;
      animation: fragment-drift 8s ease-out forwards;
      z-index: -1;
    `;
    
    // Random position
    fragment.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    fragment.style.top = Math.random() * window.innerHeight + 'px';
    
    document.body.appendChild(fragment);
    this.activeCodeFragments.push(fragment);
    
    // Remove after animation with proper cleanup
    setTimeout(() => {
      if (fragment.parentNode) {
        fragment.parentNode.removeChild(fragment);
      }
      // Remove from active tracking
      const index = this.activeCodeFragments.indexOf(fragment);
      if (index > -1) {
        this.activeCodeFragments.splice(index, 1);
      }
    }, 8500);
  }
  
  startRandomGlitches() {
    if (this.performanceMode === 'low') {
      // Very minimal glitches on low-end devices
      setInterval(() => {
        const glitchableElements = document.querySelectorAll('.post-title, .site-title, .post-card-title h2');
        if (glitchableElements.length > 0 && Math.random() > 0.85) { // Only 15% chance
          const target = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
          this.applyRandomGlitch(target);
        }
      }, 15000 + Math.random() * 20000); // 15-35 seconds
      
      // Skip page-wide glitches on low-end devices
      return;
    }
    
    // Normal performance mode
    setInterval(() => {
      const glitchableElements = document.querySelectorAll('.post-title, .site-title, .post-card-title h2');
      if (glitchableElements.length > 0 && Math.random() > 0.8) { // Reduced to 20% chance
        const target = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
        this.applyRandomGlitch(target);
      }
    }, 10000 + Math.random() * 15000); // 10-25 seconds
    
    // Less frequent page-wide glitches
    setInterval(() => {
      if (Math.random() > 0.95) { // Reduced to 5% chance
        this.applyPageGlitch();
      }
    }, 45000 + Math.random() * 75000); // 45-120 seconds
  }
  
  applyRandomGlitch(element) {
    element.classList.add('glitch-random');
    
    setTimeout(() => {
      element.classList.remove('glitch-random');
    }, 300);
  }
  
  applyPageGlitch() {
    document.body.style.animation = 'random-glitch 0.2s ease-in-out';
    
    setTimeout(() => {
      document.body.style.animation = '';
    }, 200);
  }
  
  initPageEffects() {
    // Add page transition effect
    document.body.classList.add('page-transition');
    
    // Add scanlines to main content areas
    const contentAreas = document.querySelectorAll('.post, .post-card, .site-header');
    contentAreas.forEach(area => {
      area.classList.add('scanlines');
    });
    
    // Add screen flicker occasionally
    if (Math.random() > 0.8) {
      document.body.classList.add('screen-flicker');
      setTimeout(() => {
        document.body.classList.remove('screen-flicker');
      }, 5000 + Math.random() * 10000);
    }
  }
  
  monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Reduce effects if performance is poor, but only once every 5 seconds
        if (fps < 15 && this.isActive && !this.performanceModeTriggered && 
            currentTime - this.lastPerformanceCheck > 5000) {
          console.warn('[HACKER_EFFECTS] Low FPS detected, reducing background effects only');
          this.reduceEffects();
          this.performanceModeTriggered = true;
          this.lastPerformanceCheck = currentTime;
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (this.isActive) {
        requestAnimationFrame(checkFPS);
      }
    };
    
    requestAnimationFrame(checkFPS);
  }
  
  reduceEffects() {
    // ONLY reduce background effects - NEVER disable marginalia
    
    // Reduce number of matrix columns by half
    const columnsToRemove = this.matrixColumns.slice(this.matrixColumns.length / 2);
    columnsToRemove.forEach(column => {
      if (column.parentNode) {
        column.parentNode.removeChild(column);
      }
    });
    this.matrixColumns = this.matrixColumns.slice(0, this.matrixColumns.length / 2);
    
    // Disable expensive visual effects (but keep core functionality)
    document.querySelectorAll('.scanlines').forEach(el => {
      el.style.animationPlayState = 'paused'; // Pause instead of removing
    });
    
    // Reduce matrix animation speed
    document.querySelectorAll('.matrix-column').forEach(col => {
      col.style.animationDuration = '8s'; // Slower = less CPU
    });
    
    console.log('[HACKER_EFFECTS] Background effects reduced for performance - marginalia unaffected');
  }
  
  // Public methods for interaction
  triggerGlitch(element) {
    if (!this.isActive) return;
    
    if (element) {
      this.applyRandomGlitch(element);
    } else {
      this.applyPageGlitch();
    }
  }
  
  generateImmediateFragment(text) {
    if (!this.isActive) return;
    
    if (text) {
      // Create custom fragment with provided text
      const fragment = document.createElement('div');
      fragment.className = 'code-fragment';
      fragment.textContent = text;
      fragment.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-family: 'JetBrains Mono', monospace;
        color: var(--hacker-green-bright);
        animation: fragment-drift 3s ease-out forwards;
        z-index: 1000;
      `;
      
      document.body.appendChild(fragment);
      
      setTimeout(() => {
        if (fragment.parentNode) {
          fragment.parentNode.removeChild(fragment);
        }
      }, 3500);
    }
  }
  
  destroy() {
    this.isActive = false;
    
    // Remove matrix background
    if (this.matrixContainer && this.matrixContainer.parentNode) {
      this.matrixContainer.parentNode.removeChild(this.matrixContainer);
    }
    
    // Remove all code fragments
    document.querySelectorAll('.code-fragment').forEach(fragment => {
      if (fragment.parentNode) {
        fragment.parentNode.removeChild(fragment);
      }
    });
    
    console.log('[HACKER_EFFECTS] System destroyed');
  }
}

// Terminal cursor effect for specific elements
class TerminalCursor {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    this.element.classList.add('terminal-cursor');
  }
}

// Glitch text effect
class GlitchText {
  constructor(element, text) {
    this.element = element;
    this.originalText = text || element.textContent;
    this.init();
  }
  
  init() {
    this.element.classList.add('glitch-text');
    this.element.setAttribute('data-text', this.originalText);
  }
  
  updateText(newText) {
    this.originalText = newText;
    this.element.textContent = newText;
    this.element.setAttribute('data-text', newText);
  }
}

// Initialize effects when DOM is loaded
let hackerEffectsInstance = null;

document.addEventListener('DOMContentLoaded', function() {
  // Check if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('[HACKER_EFFECTS] Reduced motion preferred, skipping animations');
    return;
  }
  
  // Initialize hacker effects
  hackerEffectsInstance = new HackerEffects();
  
  // Add terminal cursors to specific elements
  document.querySelectorAll('.terminal-prompt').forEach(element => {
    new TerminalCursor(element);
  });
  
  // Add glitch text to titles
  document.querySelectorAll('.post-title, .site-title h1').forEach(element => {
    new GlitchText(element);
  });
  
  // Add interactive elements
  document.addEventListener('click', function(e) {
    if (e.target.matches('.post-title, .post-card-title a, .site-title a')) {
      if (hackerEffectsInstance) {
        hackerEffectsInstance.triggerGlitch(e.target);
      }
    }
  });
  
  // Keyboard interactions
  document.addEventListener('keydown', function(e) {
    // Trigger effects on certain key combinations
    if (e.ctrlKey && e.key === 'g') {
      e.preventDefault();
      if (hackerEffectsInstance) {
        hackerEffectsInstance.generateImmediateFragment('> Manual glitch triggered');
      }
    }
  });
  
  console.log('[HACKER_EFFECTS] System ready');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (hackerEffectsInstance) {
    if (document.hidden) {
      // Pause effects when page is hidden
      hackerEffectsInstance.isActive = false;
    } else {
      // Resume effects when page is visible
      hackerEffectsInstance.isActive = true;
    }
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  if (hackerEffectsInstance) {
    hackerEffectsInstance.destroy();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HackerEffects, TerminalCursor, GlitchText };
}