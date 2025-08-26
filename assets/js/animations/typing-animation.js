/**
 * Typing Animation Module - Character-by-character content display
 * Pluggable animation module for InteractiveMarkerProcessor
 * 
 * Features:
 * - Character-by-character typing effect
 * - Configurable typing speed and pauses
 * - Support for overlay methods (over, replace, beside)
 * - Handles line breaks and basic formatting
 * - Cancellable animations
 * - Performance optimized with requestAnimationFrame
 * 
 * Created: August 25, 2025
 */

class TypingAnimation {
  constructor(logger = console) {
    this.logger = logger;
    this.name = 'typing';
    
    // Default configuration
    this.defaults = {
      charactersPerSecond: 50,
      pauseOnPunctuation: 100,
      pauseOnLineBreak: 300,
      cursorVisible: false,  // Disable cursor to avoid clutter
      preserveFormatting: true
    };
  }

  /**
   * Execute typing animation
   * @param {Object} config - Animation configuration
   * @param {Array<Element>} config.targetElements - Elements to animate
   * @param {string} config.content - Content to type
   * @param {number} config.duration - Total animation duration (ms)
   * @param {string} config.overlay - Overlay method ('over', 'replace', 'beside')
   * @param {Map} config.originalStates - Original element states for restoration
   * @returns {Promise<Object>} Animation controller
   */
  async execute(config) {
    const {
      targetElements,
      content,
      duration = 2000,
      overlay = 'over',
      originalStates
    } = config;

    if (!targetElements || targetElements.length === 0) {
      throw new Error('No target elements provided for typing animation');
    }

    if (!content || typeof content !== 'string') {
      throw new Error('Invalid content provided for typing animation');
    }

    this.logger.debug(`Starting typing animation: ${content.length} characters over ${duration}ms`);

    // Create animation controller
    const controller = this.createAnimationController();
    
    try {
      // Calculate timing based on duration and content length
      const timing = this.calculateTiming(content, duration);
      
      // Prepare target elements based on overlay method
      const animationElements = await this.prepareElements(
        targetElements, 
        overlay, 
        originalStates, 
        controller
      );
      
      // Execute the typing animation
      await this.performTypingAnimation(
        animationElements,
        content,
        timing,
        controller
      );
      
      // Clean up cursors if animation completed successfully
      if (!controller.cancelled) {
        this.cleanupCursors(animationElements);
      }
      
      this.logger.debug('Typing animation completed successfully');
      
      return controller;
      
    } catch (error) {
      if (controller.cancel) {
        controller.cancel();
      }
      throw error;
    }
  }

  /**
   * Create animation controller with cancellation support
   * @returns {Object} Animation controller
   * @private
   */
  createAnimationController() {
    const controller = {
      cancelled: false,
      animationFrames: [],
      timeouts: [],
      elements: [],
      
      cancel: () => {
        controller.cancelled = true;
        
        // Cancel animation frames
        controller.animationFrames.forEach(frameId => {
          if (frameId) cancelAnimationFrame(frameId);
        });
        
        // Clear timeouts
        controller.timeouts.forEach(timeoutId => {
          if (timeoutId) clearTimeout(timeoutId);
        });
        
        // Clean up elements
        controller.elements.forEach(element => {
          if (element && element.parentNode) {
            element.remove();
          }
        });
        
        this.logger.debug('Typing animation cancelled');
      }
    };
    
    return controller;
  }

  /**
   * Calculate timing for typing animation
   * @param {string} content - Content to analyze
   * @param {number} duration - Target duration in ms
   * @returns {Object} Timing configuration
   * @private
   */
  calculateTiming(content, duration) {
    const characterCount = content.length;
    const baseCharacterDelay = duration / characterCount;
    
    // Count special characters that need pauses
    const punctuationCount = (content.match(/[.!?;:,]/g) || []).length;
    const lineBreakCount = (content.match(/\n/g) || []).length;
    
    // Adjust timing to account for pauses
    const totalPauseTime = (punctuationCount * this.defaults.pauseOnPunctuation) + 
                          (lineBreakCount * this.defaults.pauseOnLineBreak);
    
    const adjustedCharacterDelay = Math.max(10, (duration - totalPauseTime) / characterCount);
    
    return {
      characterDelay: adjustedCharacterDelay,
      punctuationPause: this.defaults.pauseOnPunctuation,
      lineBreakPause: this.defaults.pauseOnLineBreak,
      totalDuration: duration
    };
  }

  /**
   * Prepare elements for animation based on overlay method
   * @param {Array<Element>} targetElements - Target elements
   * @param {string} overlayMethod - Overlay method
   * @param {Map} originalStates - Original states
   * @param {Object} controller - Animation controller
   * @returns {Promise<Array<Object>>} Prepared animation elements
   * @private
   */
  async prepareElements(targetElements, overlayMethod, originalStates, controller) {
    const animationElements = [];
    
    for (let i = 0; i < targetElements.length; i++) {
      const targetElement = targetElements[i];
      const originalState = originalStates.get(i);
      
      let animationElement;
      
      switch (overlayMethod) {
        case 'over':
          animationElement = this.createOverlayElement(targetElement, controller);
          break;
          
        case 'replace':
          animationElement = this.setupReplaceElement(targetElement, originalState);
          break;
          
        case 'beside':
          animationElement = this.createBesideElement(targetElement, controller);
          break;
          
        default:
          throw new Error(`Unknown overlay method: ${overlayMethod}`);
      }
      
      animationElements.push({
        element: animationElement,
        targetElement: targetElement,
        originalState: originalState,
        method: overlayMethod
      });
    }
    
    return animationElements;
  }

  /**
   * Create overlay element positioned over target
   * @param {Element} targetElement - Target element
   * @param {Object} controller - Animation controller
   * @returns {Element} Overlay element
   * @private
   */
  createOverlayElement(targetElement, controller) {
    const overlay = document.createElement('div');
    overlay.className = 'typing-animation-overlay';
    
    // Get theme settings with fallback defaults
    const settings = window.ghost_custom_settings || {};
    const textColor = settings.interactive_text_color || '#ff0000';
    const bgOpacity = parseFloat(settings.interactive_bg_opacity || '0.8');
    
    // Position overlay over target element
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const scrollLeft = window.pageXOffset;
    
    overlay.style.cssText = `
      position: absolute;
      top: ${rect.top + scrollTop}px;
      left: ${rect.left + scrollLeft}px;
      width: ${rect.width}px;
      min-height: ${rect.height}px;
      background: rgba(0, 0, 0, ${bgOpacity});
      padding: ${window.getComputedStyle(targetElement).padding};
      margin: 0;
      font-family: ${window.getComputedStyle(targetElement).fontFamily};
      font-size: ${window.getComputedStyle(targetElement).fontSize};
      line-height: ${window.getComputedStyle(targetElement).lineHeight};
      color: ${textColor};
      z-index: 1000;
      word-wrap: break-word;
      overflow-wrap: break-word;
      pointer-events: none;
    `;
    
    document.body.appendChild(overlay);
    controller.elements.push(overlay);
    
    return overlay;
  }

  /**
   * Setup element for replace animation
   * @param {Element} targetElement - Target element
   * @param {Object} originalState - Original element state
   * @returns {Element} Target element (reused for replace)
   * @private
   */
  setupReplaceElement(targetElement, originalState) {
    // Clear existing content
    targetElement.innerHTML = '';
    
    // Add typing animation class
    targetElement.classList.add('typing-animation-target');
    
    return targetElement;
  }

  /**
   * Create beside element next to target
   * @param {Element} targetElement - Target element
   * @param {Object} controller - Animation controller
   * @returns {Element} Beside element
   * @private
   */
  createBesideElement(targetElement, controller) {
    const beside = document.createElement('div');
    beside.className = 'typing-animation-beside';
    
    beside.style.cssText = `
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-left: 3px solid #007cba;
      font-style: italic;
      position: relative;
    `;
    
    // Insert after target element
    if (targetElement.nextSibling) {
      targetElement.parentNode.insertBefore(beside, targetElement.nextSibling);
    } else {
      targetElement.parentNode.appendChild(beside);
    }
    
    controller.elements.push(beside);
    
    return beside;
  }

  /**
   * Parse HTML content into typing tokens (text chars + HTML tags)
   * @param {string} htmlContent - HTML content to parse
   * @returns {Array} Array of tokens for progressive typing
   * @private
   */
  parseHtmlContent(htmlContent) {
    const tokens = [];
    let currentPos = 0;
    
    // Regular expression to match HTML tags
    const tagRegex = /<[^>]+>/g;
    let match;
    
    while ((match = tagRegex.exec(htmlContent)) !== null) {
      // Add text before this tag as individual characters
      const textBefore = htmlContent.substring(currentPos, match.index);
      for (let i = 0; i < textBefore.length; i++) {
        tokens.push({
          type: 'char',
          content: textBefore[i],
          delay: true
        });
      }
      
      // Add the HTML tag (no typing delay)
      tokens.push({
        type: 'tag',
        content: match[0],
        delay: false
      });
      
      currentPos = tagRegex.lastIndex;
    }
    
    // Add remaining text after last tag
    const remainingText = htmlContent.substring(currentPos);
    for (let i = 0; i < remainingText.length; i++) {
      tokens.push({
        type: 'char',
        content: remainingText[i],
        delay: true
      });
    }
    
    this.logger.debug(`Parsed HTML into ${tokens.length} tokens (${tokens.filter(t => t.type === 'char').length} chars, ${tokens.filter(t => t.type === 'tag').length} tags)`);
    
    return tokens;
  }

  /**
   * Perform the actual typing animation
   * @param {Array<Object>} animationElements - Prepared elements
   * @param {string} content - Content to type
   * @param {Object} timing - Timing configuration
   * @param {Object} controller - Animation controller
   * @returns {Promise<void>}
   * @private
   */
  async performTypingAnimation(animationElements, content, timing, controller) {
    // Parse HTML content into typing tokens
    const tokens = this.parseHtmlContent(content);
    
    // Process each token
    for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
      if (controller.cancelled) return;
      
      const token = tokens[tokenIndex];
      
      if (token.type === 'char') {
        // Add character with typing delay and cursor
        animationElements.forEach(({ element }) => {
          this.addCharacterWithCursor(element, token.content);
        });
        
        // Calculate delay for this character
        let delay = timing.characterDelay;
        
        // Add pause for punctuation
        if (/[.!?;:,]/.test(token.content) && timing.punctuationPause > 0) {
          delay += timing.punctuationPause;
        }
        
        // Add pause for line breaks
        if (token.content === '\n' && timing.lineBreakPause > 0) {
          delay += timing.lineBreakPause;
        }
        
        // Wait before next token
        if (tokenIndex < tokens.length - 1) {
          await this.delay(delay, controller);
        }
        
      } else if (token.type === 'tag') {
        // Add HTML tag instantly (no delay, no cursor)
        animationElements.forEach(({ element }) => {
          this.addHtmlTag(element, token.content);
        });
        // No delay for tags
      }
    }
  }


  /**
   * Add a character to an element (HTML-aware typing without cursor issues)
   * @param {Element} element - Target element
   * @param {string} char - Character to add
   * @private
   */
  addCharacterWithCursor(element, char) {
    // Simply append the escaped character as text node
    const escapedChar = char === '<' ? '&lt;' : char === '>' ? '&gt;' : char === '&' ? '&amp;' : char;
    const textNode = document.createTextNode(escapedChar);
    element.appendChild(textNode);
  }

  /**
   * Add HTML tag instantly (no cursor, no delay)
   * @param {Element} element - Target element
   * @param {string} tag - HTML tag to add
   * @private
   */
  addHtmlTag(element, tag) {
    // Create a temporary element to parse and append the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tag;
    
    // Move all child nodes from temp div to target element
    while (tempDiv.firstChild) {
      element.appendChild(tempDiv.firstChild);
    }
  }


  /**
   * Clean up cursors from completed animation
   * @param {Array<Object>} animationElements - Animation elements
   * @private
   */
  cleanupCursors(animationElements) {
    // No cursors to clean up since cursor is disabled
    // This prevents any formatting issues from innerHTML manipulation
  }

  /**
   * Delay with cancellation support
   * @param {number} ms - Delay in milliseconds
   * @param {Object} controller - Animation controller
   * @returns {Promise<void>}
   * @private
   */
  delay(ms, controller) {
    return new Promise((resolve) => {
      if (controller.cancelled) {
        resolve();
        return;
      }
      
      const timeoutId = setTimeout(() => {
        if (!controller.cancelled) {
          resolve();
        }
      }, ms);
      
      controller.timeouts.push(timeoutId);
    });
  }

  /**
   * Inject CSS for typing animation
   * @static
   */
  static injectCSS() {
    if (!document.getElementById('typing-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'typing-animation-styles';
      style.textContent = `
        .typing-animation-overlay {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .typing-animation-target {
          transition: all 0.3s ease;
        }
        
        .typing-animation-beside {
          opacity: 0;
          animation: fade-in-beside 0.5s ease forwards;
        }
        
        @keyframes typing-cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes fade-in-beside {
          to { opacity: 1; }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .typing-cursor {
            animation: none;
            opacity: 0.7;
          }
          
          .typing-animation-beside {
            animation: none;
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Auto-inject CSS when module loads
TypingAnimation.injectCSS();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TypingAnimation;
} else if (typeof window !== 'undefined') {
  window.TypingAnimation = TypingAnimation;
}