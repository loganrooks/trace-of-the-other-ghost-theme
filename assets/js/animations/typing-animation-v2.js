/**
 * TypingAnimationV2 - Clean, Element-Based Typing Animation
 * 
 * Key improvements over v1:
 * - Element-based instead of character-based parsing (no 2000+ tokens)
 * - Cleaner architecture with single responsibility
 * - Better performance and debugging
 * - Follows architectural best practices from ARCHITECTURAL_OVERHAUL_PLAN.md
 * 
 * Created: August 27, 2025
 */

class TypingAnimationV2 {
  constructor(logger = console) {
    this.name = 'TypingAnimationV2';
    this.logger = logger;
    this.version = '2.0.0';
    
    this.logger.debug(`✅ ${this.name} v${this.version} initialized`);
  }

  /**
   * Execute typing animation with clean element-based approach
   * @param {Object} config - Animation configuration
   * @param {Array<Element>} config.targetElements - Target elements to animate
   * @param {string} config.content - HTML content to type
   * @param {number} config.duration - Animation duration in ms
   * @param {string} config.overlay - Overlay method ('over', 'replace', 'beside')
   * @returns {Promise<void>}
   */
  async execute(config) {
    this.logger.debug('🎬 Starting TypingAnimationV2 execution', { config });
    
    try {
      const { targetElements, content, duration = 3000, overlay = 'over' } = config;
      
      if (!targetElements || targetElements.length === 0) {
        throw new Error('No target elements provided');
      }
      
      if (!content || !content.trim()) {
        throw new Error('No content provided');
      }
      
      // Parse content into logical elements (not thousands of tokens)
      const elements = this.parseToElements(content);
      this.logger.debug(`📝 Parsed content into ${elements.length} logical elements`);
      
      // Create animation containers
      const containers = this.createAnimationContainers(targetElements, overlay);
      
      // Type each element with appropriate timing
      const elementDelay = duration / elements.length;
      
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        
        this.logger.debug(`⌨️ Typing element ${i + 1}/${elements.length}:`, element.type);
        
        // Type this element into all containers
        await this.typeElement(element, containers, elementDelay);
        
        // Small delay between elements
        if (i < elements.length - 1) {
          await this.delay(100);
        }
      }
      
      this.logger.debug('✅ TypingAnimationV2 completed successfully');
      
    } catch (error) {
      this.logger.error('❌ TypingAnimationV2 failed:', error);
      throw error;
    }
  }

  /**
   * Parse HTML content into logical elements instead of individual characters
   * @param {string} htmlContent - HTML content to parse
   * @returns {Array<Object>} Array of element objects
   */
  parseToElements(htmlContent) {
    this.logger.debug('🔍 Parsing HTML into logical elements...');
    
    // Create temporary DOM to parse HTML properly
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent.trim();
    
    const elements = [];
    
    // Process each top-level node
    for (const node of tempDiv.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          elements.push({
            type: 'text',
            content: text,
            element: null
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        
        if (tagName === 'br') {
          elements.push({
            type: 'linebreak',
            content: '<br>',
            element: null
          });
        } else {
          // Clone the entire element with all its content and formatting
          elements.push({
            type: 'element',
            tagName: tagName,
            content: node.textContent,
            element: node.cloneNode(true)
          });
        }
      }
    }
    
    this.logger.debug(`📊 Parsed into ${elements.length} elements:`, elements.map(e => e.type));
    return elements;
  }

  /**
   * Create animation containers based on overlay method
   * @param {Array<Element>} targetElements - Target elements
   * @param {string} overlay - Overlay method
   * @returns {Array<Element>} Animation containers
   */
  createAnimationContainers(targetElements, overlay) {
    const containers = [];
    
    for (const target of targetElements) {
      let container;
      
      switch (overlay) {
        case 'over':
          container = this.createOverlayContainer(target);
          break;
        case 'replace':
          container = this.createReplaceContainer(target);
          break;
        case 'beside':
          container = this.createBesideContainer(target);
          break;
        default:
          throw new Error(`Unknown overlay method: ${overlay}`);
      }
      
      containers.push(container);
    }
    
    return containers;
  }

  /**
   * Create overlay container positioned over target
   * @param {Element} target - Target element
   * @returns {Element} Container element
   */
  createOverlayContainer(target) {
    const container = document.createElement('div');
    container.className = 'typing-animation-overlay';
    
    // Position over target
    const rect = target.getBoundingClientRect();
    container.style.cssText = `
      position: fixed;
      top: ${rect.top + window.scrollY}px;
      left: ${rect.left + window.scrollX}px;
      width: ${rect.width}px;
      min-height: ${rect.height}px;
      z-index: 500;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      line-height: 1.4;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
      pointer-events: none;
    `;
    
    document.body.appendChild(container);
    return container;
  }

  /**
   * Create replace container that replaces target content
   * @param {Element} target - Target element
   * @returns {Element} Container element
   */
  createReplaceContainer(target) {
    // Store original content
    target.dataset.originalContent = target.innerHTML;
    
    // Clear target and return it as container
    target.innerHTML = '';
    target.style.fontFamily = "'JetBrains Mono', monospace";
    
    return target;
  }

  /**
   * Create beside container next to target
   * @param {Element} target - Target element
   * @returns {Element} Container element
   */
  createBesideContainer(target) {
    const container = document.createElement('div');
    container.className = 'typing-animation-beside';
    container.style.cssText = `
      font-family: 'JetBrains Mono', monospace;
      color: #00ff00;
      background: rgba(0, 0, 0, 0.9);
      padding: 10px;
      margin: 10px 0;
      border-left: 3px solid #00ff00;
    `;
    
    target.parentNode.insertBefore(container, target.nextSibling);
    return container;
  }

  /**
   * Type a single element into all containers
   * @param {Object} element - Element to type
   * @param {Array<Element>} containers - Animation containers
   * @param {number} duration - Duration for this element
   * @returns {Promise<void>}
   */
  async typeElement(element, containers, duration) {
    switch (element.type) {
      case 'text':
        await this.typeText(element.content, containers, duration);
        break;
        
      case 'element':
        await this.typeHtmlElement(element.element, containers, duration);
        break;
        
      case 'linebreak':
        this.addLineBreak(containers);
        break;
        
      default:
        this.logger.warn('Unknown element type:', element.type);
    }
  }

  /**
   * Type plain text character by character
   * @param {string} text - Text to type
   * @param {Array<Element>} containers - Animation containers
   * @param {number} duration - Duration for typing this text
   * @returns {Promise<void>}
   */
  async typeText(text, containers, duration) {
    const charDelay = duration / text.length;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      containers.forEach(container => {
        container.insertAdjacentText('beforeend', char);
      });
      
      if (i < text.length - 1) {
        await this.delay(charDelay);
      }
    }
  }

  /**
   * Type HTML element with preserved formatting
   * @param {Element} element - HTML element to type
   * @param {Array<Element>} containers - Animation containers
   * @param {number} duration - Duration for typing this element
   * @returns {Promise<void>}
   */
  async typeHtmlElement(element, containers, duration) {
    // Create the element structure first
    containers.forEach(container => {
      const elementCopy = element.cloneNode(false); // Clone without content
      container.appendChild(elementCopy);
    });
    
    // Now type the content into the new elements
    const text = element.textContent;
    const charDelay = duration / text.length;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      containers.forEach(container => {
        const lastElement = container.lastElementChild;
        if (lastElement) {
          lastElement.insertAdjacentText('beforeend', char);
        }
      });
      
      if (i < text.length - 1) {
        await this.delay(charDelay);
      }
    }
  }

  /**
   * Add line break to all containers
   * @param {Array<Element>} containers - Animation containers
   */
  addLineBreak(containers) {
    containers.forEach(container => {
      container.appendChild(document.createElement('br'));
    });
  }

  /**
   * Delay utility function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clean up animation containers
   * @param {Array<Element>} containers - Containers to clean up
   */
  cleanup(containers) {
    containers.forEach(container => {
      if (container.classList.contains('typing-animation-overlay') || 
          container.classList.contains('typing-animation-beside')) {
        container.remove();
      } else if (container.dataset.originalContent) {
        // Restore original content for replace method
        container.innerHTML = container.dataset.originalContent;
        delete container.dataset.originalContent;
      }
    });
  }

  /**
   * Health check for system coordinator
   * @returns {Object} Health check results
   */
  static healthCheck() {
    return {
      canCreateElements: !!document.createElement('div'),
      cssSupported: CSS && CSS.supports('position', 'absolute'),
      animationSupported: 'animate' in document.createElement('div'),
      domReady: document.readyState === 'complete' || document.readyState === 'interactive'
    };
  }
}

// Make available globally
window.TypingAnimationV2 = TypingAnimationV2;

// Register with ActionEngine if available
if (window.contentManager?.processors) {
  const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
  if (interactiveProcessor?.actionEngine) {
    try {
      const typingV2 = new TypingAnimationV2(console);
      interactiveProcessor.actionEngine.registerAnimation('typingv2', typingV2);
      console.log('✅ TypingAnimationV2 registered with ActionEngine');
    } catch (error) {
      console.error('❌ Failed to register TypingAnimationV2:', error);
    }
  }
}

console.log('🚀 TypingAnimationV2 loaded - clean element-based typing animation');