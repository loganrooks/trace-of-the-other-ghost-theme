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

console.log('🚀 typing-animation.js loading...');

class TypingAnimation {
  constructor(logger = console) {
    this.logger = logger;
    this.name = 'typing';
    console.log('✅ TypingAnimation constructor called');
    
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
    // Only inject CSS when actually needed
    TypingAnimation.injectCSS();
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
    
    // Temporarily disable footnote hover to prevent conflicts during typing
    this.disableFootnoteHover();

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
      
      // Re-enable footnote hover after typing completes
      this.enableFootnoteHover();
      
      return controller;
      
    } catch (error) {
      // Re-enable footnote hover on error too
      this.enableFootnoteHover();
      
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
   * Detect if text contains RTL (right-to-left) characters
   * @param {string} text - Text to analyze
   * @returns {boolean} True if text contains RTL characters
   * @private
   */
  detectRTL(text) {
    // Hebrew: U+0590-U+05FF, U+FB1D-U+FB4F
    // Arabic: U+0600-U+06FF, U+0750-U+077F, U+08A0-U+08FF, U+FB50-U+FDFF, U+FE70-U+FEFF
    const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text);
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
      punctuationPause: this.defaults.punctuationPause,
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
      z-index: 500;
      word-wrap: break-word;
      overflow-wrap: break-word;
      pointer-events: auto;
      /* Ensure footnote tooltips can still appear above this */
      position: absolute;
      unicode-bidi: plaintext;
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
    
    // Set unicode-bidi to handle mixed LTR/RTL content properly
    targetElement.style.unicodeBidi = 'plaintext';
    
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
      unicode-bidi: plaintext;
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
   * Parse HTML content into typing tokens with proper tag wrapping
   * @param {string} htmlContent - HTML content to parse
   * @returns {Array} Array of tokens for progressive typing
   * @private
   */
  parseHtmlContent(htmlContent) {
    try {
      const tokens = [];
      
      this.logger.debug('=== HTML PARSING START ===');
      this.logger.debug('Input HTML:', htmlContent.substring(0, 100) + '...');
      
      // Pre-process content to handle line breaks properly
      const processedContent = htmlContent
        .replace(/\n\s*\n/g, '<br><br>')  // Double newlines = paragraph breaks
        .replace(/\n/g, '<br>')          // Single newlines = line breaks
        .trim();
      
      this.logger.debug('After line break processing:', processedContent.substring(0, 100) + '...');
      
      // Create a temporary DOM element to properly parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = processedContent;
      
      this.logger.debug('Created temp div, child nodes:', tempDiv.childNodes.length);
      this.logger.debug('Temp div contents:', tempDiv.textContent.substring(0, 50) + '...');
      
      // Recursively process all nodes
      this.processNode(tempDiv, tokens);
      
      this.logger.debug('=== HTML PARSING END ===');
      
      const charCount = tokens.filter(t => t.type === 'char').length;
      const wrapperCount = tokens.filter(t => t.type === 'wrapper').length;
      const tagCount = tokens.filter(t => t.type === 'tag').length;
      
      this.logger.debug(`Parsed HTML into ${tokens.length} tokens (${charCount} chars, ${wrapperCount} wrappers, ${tagCount} standalone tags)`);
      this.logger.debug('Sample tokens:', tokens.slice(0, 10).map(t => ({ 
        type: t.type, 
        content: t.content && t.content.length > 20 ? t.content.substring(0, 20) + '...' : t.content,
        tagName: t.tagName
      })));
      
      return tokens;
      
    } catch (parseError) {
      this.logger.error('❌ HTML parsing failed:', parseError);
      this.logger.error('Content that caused parse failure:', htmlContent);
      
      // Fallback: convert to simple character tokens
      const fallbackTokens = [];
      for (let i = 0; i < htmlContent.length; i++) {
        fallbackTokens.push({
          type: 'char',
          content: htmlContent[i],
          delay: true
        });
      }
      
      this.logger.warn(`Using fallback parsing: ${fallbackTokens.length} character tokens`);
      return fallbackTokens;
    }
  }

  /**
   * Recursively process DOM nodes into typing tokens
   * @param {Node} node - DOM node to process
   * @param {Array} tokens - Token array to populate
   * @private
   */
  processNode(node, tokens) {
    this.logger.debug(`Processing node: ${node.nodeName}, children: ${node.childNodes.length}`);
    
    for (let child of node.childNodes) {
      this.logger.debug(`Processing child: ${child.nodeName}, type: ${child.nodeType}`);
      
      if (child.nodeType === Node.TEXT_NODE) {
        // Add text characters
        const text = child.textContent;
        this.logger.debug(`Text node content: "${text}" (${text.length} chars)`);
        
        for (let i = 0; i < text.length; i++) {
          tokens.push({
            type: 'char',
            content: text[i],
            delay: true
          });
        }
        
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Handle element nodes as wrappers with their content
        const tagName = child.tagName.toLowerCase();
        const textContent = child.textContent;
        
        // Define block-level elements that need line breaks
        const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'ol', 'li'];
        const isBlockElement = blockElements.includes(tagName);
        
        this.logger.debug(`Element node: <${tagName}>, text content: "${textContent}", isBlock: ${isBlockElement}`);
        
        if (tagName === 'br') {
          // Self-closing tags
          this.logger.debug(`Creating standalone tag token for <${tagName}>`);
          
          tokens.push({
            type: 'tag',
            content: `<${tagName}>`,
            delay: false
          });
        } else if (isBlockElement) {
          // Block elements need line breaks before and after
          this.logger.debug(`Processing block element <${tagName}>`);
          
          // Add line break before block element (unless it's the first element)
          if (tokens.length > 0) {
            tokens.push({
              type: 'tag',
              content: '<br>',
              delay: false
            });
          }
          
          if (child.children.length > 0) {
            // Block element with child elements - recurse into children
            this.processNode(child, tokens);
          } else if (textContent && textContent.trim()) {
            // Block element with only text content - add as wrapper
            tokens.push({
              type: 'wrapper',
              tagName: tagName,
              element: child.cloneNode(true),
              content: textContent,
              delay: true
            });
          }
          
          // Add line break after block element
          tokens.push({
            type: 'tag',
            content: '<br>',
            delay: false
          });
          
        } else if (child.children.length > 0) {
          // Inline element has child elements - process children recursively
          // This handles cases like <span>Text with <strong>bold</strong> content</span>
          this.logger.debug(`Recursing into inline <${tagName}> with ${child.children.length} child elements`);
          this.processNode(child, tokens);
        } else if (textContent && textContent.trim()) {
          // Inline element with only text content - create a wrapper token
          // This handles cases like <strong>bold text</strong>
          this.logger.debug(`Creating wrapper token for inline <${tagName}> with pure text: "${textContent}"`);
          
          tokens.push({
            type: 'wrapper',
            tagName: tagName,
            element: child.cloneNode(true), // Clone with all attributes and children
            content: textContent,
            delay: true
          });
        } else {
          // Empty element - skip
          this.logger.debug(`Skipping empty element: <${tagName}>`);
        }
      }
    }
    
    this.logger.debug(`Finished processing node: ${node.nodeName}, tokens so far: ${tokens.length}`);
  }

  /**
   * Debug HTML processing pipeline
   * @param {string} content - Original content
   * @private
   */
  debugHtmlProcessing(content) {
    this.logger.debug('=== HTML PROCESSING DEBUG ===');
    this.logger.debug('Original content length:', content.length);
    this.logger.debug('Original content (first 200 chars):', content.substring(0, 200));
    
    // Check for HTML tags
    const htmlTagMatches = content.match(/<[^>]+>/g);
    this.logger.debug('HTML tags found:', htmlTagMatches ? htmlTagMatches.length : 0);
    if (htmlTagMatches) {
      this.logger.debug('Sample HTML tags:', htmlTagMatches.slice(0, 5));
    }
    
    // Check for specific formatting
    const hasLinks = /<a[^>]*>/i.test(content);
    const hasBold = /<(strong|b)[^>]*>/i.test(content);
    const hasItalic = /<(em|i)[^>]*>/i.test(content);
    
    this.logger.debug('Formatting detected:', {
      links: hasLinks,
      bold: hasBold,
      italic: hasItalic
    });
    
    // Check for RTL characters
    const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
    const hasRTL = rtlRegex.test(content);
    this.logger.debug('Contains RTL characters:', hasRTL);
    
    if (hasRTL) {
      const rtlMatches = content.match(rtlRegex);
      this.logger.debug('RTL character sample:', rtlMatches ? rtlMatches.slice(0, 5) : []);
    }
    
    this.logger.debug('=== END DEBUG ===');
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
    try {
      // Debug: Log the exact content we received
      this.debugHtmlProcessing(content);
      
      this.logger.debug('=== TYPING ANIMATION START ===');
      this.logger.debug('Animation elements:', animationElements.length);
      this.logger.debug('Content length:', content.length);
      this.logger.debug('Timing:', timing);
      
      // Parse HTML content into typing tokens
      this.logger.debug('About to parse HTML content...');
      const tokens = this.parseHtmlContent(content);
      
      if (tokens.length === 0) {
        this.logger.error('❌ No tokens generated from content!');
        return;
      }
      
      this.logger.debug(`✅ Generated ${tokens.length} tokens, starting typing...`);
    
      // Process each token
      for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        if (controller.cancelled) {
          this.logger.debug('Animation cancelled at token', tokenIndex);
          return;
        }
        
        const token = tokens[tokenIndex];
        this.logger.debug(`Processing token ${tokenIndex + 1}/${tokens.length}:`, {
          type: token.type,
          content: token.content ? token.content.substring(0, 20) : 'N/A',
          tagName: token.tagName || 'N/A'
        });
        
        try {
          if (token.type === 'char') {
            // Add character with typing delay
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
            
          } else if (token.type === 'wrapper') {
            // Handle wrapper elements (links, bold, italic, etc.) with proper content typing
            this.logger.debug('Processing wrapper token:', token.tagName, 'with content:', token.content);
            await this.addWrappedContent(animationElements, token, timing, controller);
            
          } else if (token.type === 'tag') {
            // Add standalone HTML tag instantly (like <br>)
            this.logger.debug('Processing standalone tag:', token.content);
            animationElements.forEach(({ element }) => {
              this.addHtmlTag(element, token.content);
            });
            // No delay for standalone tags
          } else {
            this.logger.warn('Unknown token type:', token.type, token);
          }
        } catch (tokenError) {
          this.logger.error(`Error processing token ${tokenIndex}:`, tokenError);
          this.logger.error('Problematic token:', token);
          // Continue with next token instead of failing completely
        }
      }
      
      this.logger.debug('✅ Typing animation completed successfully');
      
    } catch (error) {
      this.logger.error('❌ Typing animation failed:', error);
      this.logger.error('Content that caused failure:', content);
      throw error;
    }
  }


  /**
   * Add wrapped content (like <em>text</em>, <a href="">text</a>) with typing animation
   * @param {Array<Object>} animationElements - Animation elements
   * @param {Object} token - Wrapper token with element and content
   * @param {Object} timing - Timing configuration
   * @param {Object} controller - Animation controller
   * @returns {Promise<void>}
   * @private
   */
  async addWrappedContent(animationElements, token, timing, controller) {
    const { element: templateElement, content, tagName } = token;
    
    // Detect RTL content for proper styling
    const hasRTL = this.detectRTL(content);
    this.logger.debug(`Processing wrapper ${tagName} with content: "${content}", RTL: ${hasRTL}`);
    
    animationElements.forEach(({ element }) => {
      // Clone the template element with all attributes (including href for links)
      const wrapperElement = templateElement.cloneNode(true);
      
      // Clear any existing content to avoid duplication
      wrapperElement.innerHTML = '';
      
      // Apply RTL styling if content contains RTL characters
      if (hasRTL) {
        wrapperElement.style.direction = 'rtl';
        wrapperElement.style.textAlign = 'right';
        wrapperElement.style.unicodeBidi = 'embed';
        this.logger.debug(`Applied RTL styling to ${tagName} element`);
      }
      
      // For links, ensure they're clickable
      if (tagName === 'a') {
        wrapperElement.style.pointerEvents = 'auto';
        wrapperElement.style.cursor = 'pointer';
        this.logger.debug(`Made ${tagName} element clickable with href:`, wrapperElement.href);
      }
      
      // Append the wrapper element to the target first
      element.appendChild(wrapperElement);
    });
    
    // Type the content character by character into the wrapper elements
    for (let i = 0; i < content.length; i++) {
      if (controller.cancelled) return;
      
      const char = content[i];
      
      // Add character to each wrapper element
      animationElements.forEach(({ element }) => {
        const wrapperElement = element.lastChild; // The wrapper we just added
        const textNode = document.createTextNode(char);
        wrapperElement.appendChild(textNode);
      });
      
      // Calculate delay for this character
      let delay = timing.characterDelay;
      
      // Add pause for punctuation
      if (/[.!?;:,]/.test(char) && timing.punctuationPause > 0) {
        delay += timing.punctuationPause;
      }
      
      // Wait before next character (except for the last one)
      if (i < content.length - 1) {
        await this.delay(delay, controller);
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
    // Add character as text node without escaping - HTML parsing has already separated tags from text
    const textNode = document.createTextNode(char);
    element.appendChild(textNode);
  }

  /**
   * Add HTML tag instantly (no cursor, no delay)
   * @param {Element} element - Target element
   * @param {string} tag - HTML tag to add
   * @private
   */
  addHtmlTag(element, tag) {
    try {
      this.logger?.debug('Adding HTML tag:', tag);
      
      // Create a temporary element to parse and append the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tag;
      
      // Move all child nodes from temp div to target element
      while (tempDiv.firstChild) {
        element.appendChild(tempDiv.firstChild);
      }
      
      this.logger?.debug('Successfully added HTML tag to element');
    } catch (error) {
      this.logger?.error('Failed to add HTML tag:', tag, error);
      // Fallback: add as text content if HTML parsing fails
      const textNode = document.createTextNode(tag);
      element.appendChild(textNode);
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
  /**
   * Temporarily disable footnote hover during typing to prevent conflicts
   * @private
   */
  disableFootnoteHover() {
    // Add a class to document body to disable footnote interactions
    document.body.classList.add('typing-animation-active');
  }

  /**
   * Re-enable footnote hover after typing completes
   * @private  
   */
  enableFootnoteHover() {
    // Remove the class to re-enable footnote interactions
    document.body.classList.remove('typing-animation-active');
  }

  static injectCSS() {
    if (!document.getElementById('typing-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'typing-animation-styles';
      style.textContent = `
        /* Disable footnote interactions during typing animations */
        .typing-animation-active .footnote-ref,
        .typing-animation-active .footnote-extension {
          pointer-events: none !important;
        }
        
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
        
        /* Styling for HTML elements in typed content (from Ghost editor conversion) */
        .typing-animation-overlay a,
        .typing-animation-target a,
        .typing-animation-beside a {
          color: #007cba;
          text-decoration: underline;
          cursor: pointer;
        }
        
        .typing-animation-overlay a:hover,
        .typing-animation-target a:hover,
        .typing-animation-beside a:hover {
          color: #005a87;
          text-decoration: none;
        }
        
        .typing-animation-overlay strong,
        .typing-animation-target strong,
        .typing-animation-beside strong {
          font-weight: bold;
        }
        
        .typing-animation-overlay em,
        .typing-animation-target em,
        .typing-animation-beside em {
          font-style: italic;
        }
        
        .typing-animation-overlay code,
        .typing-animation-target code,
        .typing-animation-beside code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9em;
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

console.log('📝 CSS injection disabled for debugging - will inject only when needed');

console.log('📦 About to export TypingAnimation...');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TypingAnimation;
  console.log('✅ TypingAnimation exported to module.exports');
} else if (typeof window !== 'undefined') {
  window.TypingAnimation = TypingAnimation;
  console.log('✅ Real TypingAnimation exported to window - supports HTML, theme colors, proper styling');
} else {
  console.error('❌ No module or window available for export');
}