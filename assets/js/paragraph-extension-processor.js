/**
 * Content Enhancement System - Paragraph Extension Processor
 * Handles [+][content] pattern processing for inline paragraph extensions
 * 
 * Philosophy: Preserves simple [+][content] syntax for easy Ghost editor workflow
 * Writers can add extended commentary without leaving the editor context
 * 
 * Created: August 23, 2025
 */

class ParagraphExtensionProcessor extends ContentProcessor {
  constructor(config, container) {
    super(config, container);
    
    // Extension-specific state
    this.extensions = new Map();
    this.counter = 0;
  }

  /**
   * Initialize paragraph extension processor
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    try {
      await this.baseInit();
      
      // Validate extension-specific configuration
      if (!this.config.patterns?.extensionPattern) {
        throw new Error('Extension pattern configuration is required');
      }

      console.log(`[EXTENSION_PROCESSOR] Initialized with pattern: ${this.config.patterns.extensionPattern}`);
      return true;
    } catch (error) {
      console.error('[EXTENSION_PROCESSOR] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Process all [+][content] patterns in paragraphs
   * @returns {void}
   */
  async process() {
    try {
      console.log('[EXTENSION_PROCESSOR] Starting pattern processing...');
      
      // Find and process all [+][content] patterns
      this.processExtensionPatterns();
      
      // Add interaction behaviors
      this.enhanceInteractions();

      this.statistics.endTime = performance.now();
      console.log(`[EXTENSION_PROCESSOR] Processing completed: ${this.extensions.size} extensions processed`);
    } catch (error) {
      this.incrementErrors();
      console.error('[EXTENSION_PROCESSOR] Processing failed:', error);
      throw error;
    }
  }

  /**
   * Clean up extension processor resources
   * @returns {void}
   */
  cleanup() {
    // Remove event listeners
    const extensionTriggers = this.findAllInContainer('.extension-trigger');
    extensionTriggers.forEach(trigger => {
      trigger.removeEventListener('click', this.handleExtensionClick);
      trigger.removeEventListener('keydown', this.handleExtensionKeydown);
    });

    // Remove extension boxes from DOM
    const extensionBoxes = this.findAllInContainer('.paragraph-extension-box');
    extensionBoxes.forEach(box => {
      if (box && box.parentNode) {
        box.parentNode.removeChild(box);
      }
    });

    // Clear state
    this.extensions.clear();
    this.counter = 0;

    this.baseCleanup();
  }

  /**
   * Process [+][content] patterns in paragraphs
   * Transforms simple editor syntax into interactive extension triggers
   * @private
   */
  processExtensionPatterns() {
    console.group('[EXTENSION_PROCESSOR] Pattern Processing Debug');
    
    const pattern = this.config.patterns.extensionPattern;
    const paragraphs = this.findAllInContainer(this.config.selectors?.paragraphs || 'p, .marginalia-voice, blockquote, li');
    let extensionId = 1;
    
    console.log(`Pattern: ${pattern}`);
    console.log(`Found ${paragraphs.length} paragraphs to search`);

    paragraphs.forEach((paragraph, paraIndex) => {
      const originalHTML = paragraph.innerHTML;
      let hasExtensions = false;
      let modifiedHTML = originalHTML;

      // Process all [+][content] patterns in this paragraph
      modifiedHTML = modifiedHTML.replace(pattern, (match, content) => {
        console.log(`✅ Processing extension match: "${match.substring(0, 50)}..."`);
        hasExtensions = true;
        
        const extensionData = {
          id: extensionId,
          content: content,
          paragraph: paragraph,
          trigger: null,
          box: null,
          isOpen: false
        };
        
        this.extensions.set(extensionId, extensionData);
        console.log(`✅ Stored extension ${extensionId}`);

        // Create extension trigger button
        const trigger = this.createExtensionTrigger(extensionId, content);
        extensionId++;
        this.incrementProcessed();
        return trigger;
      });

      if (hasExtensions) {
        console.log(`✅ Updated paragraph ${paraIndex} with extensions`);
        paragraph.innerHTML = modifiedHTML;
      }
    });

    this.counter = extensionId - 1;
    console.log(`Final extensions count: ${this.counter}`);
    console.groupEnd();
  }

  /**
   * Create extension trigger button HTML - Hacker style with glow like footnotes
   * @param {number} extensionId - Extension ID
   * @param {string} content - Extension content
   * @returns {string} HTML for extension trigger
   * @private
   */
  createExtensionTrigger(extensionId, content) {
    const extensionData = this.extensions.get(extensionId);
    const classes = this.config.classes || {};
    
    // Styled exactly like footnote markers but with + symbol and orange color
    return `<span class="${classes.extensionTrigger || 'extension-trigger'} footnote-ref" 
                  data-extension-id="${extensionId}"
                  data-extension-content="${this.escapeAttribute(content)}"
                  aria-label="Show extended commentary"
                  aria-expanded="false"
                  tabindex="0">
              <span class="footnote-link" data-is-extension="true">+</span>
            </span>`;
  }

  /**
   * Add interaction behaviors to extension triggers
   * @private
   */
  enhanceInteractions() {
    // Wait for DOM to be fully updated after pattern replacement
    setTimeout(() => {
      const extensionTriggers = this.findAllInContainer('.extension-trigger .footnote-link[data-is-extension="true"]');
      
      console.log(`[EXTENSION_PROCESSOR] Found ${extensionTriggers.length} extension triggers to enhance`);
      
      extensionTriggers.forEach((trigger, index) => {
        console.log(`[EXTENSION_PROCESSOR] Enhancing trigger ${index + 1}:`, trigger);
        
        // Store bound methods for later cleanup
        const clickHandler = this.handleExtensionClick.bind(this);
        const keydownHandler = this.handleExtensionKeydown.bind(this);
        
        // Remove existing listeners (if any) to prevent duplicates
        if (trigger._clickHandler) {
          trigger.removeEventListener('click', trigger._clickHandler);
        }
        if (trigger._keydownHandler) {
          trigger.removeEventListener('keydown', trigger._keydownHandler);
        }
        
        // Add new listeners
        trigger.addEventListener('click', clickHandler);
        trigger.addEventListener('keydown', keydownHandler);
        
        // Store handlers for cleanup
        trigger._clickHandler = clickHandler;
        trigger._keydownHandler = keydownHandler;
        
        // CSS handles hover effects - no need for JS
      });

      console.log(`[EXTENSION_PROCESSOR] Enhanced ${extensionTriggers.length} extension triggers with event listeners`);
    }, 100);
  }

  /**
   * Handle extension trigger click
   * @param {Event} event - Click event
   * @private
   */
  handleExtensionClick(event) {
    console.log('[EXTENSION_PROCESSOR] Extension button clicked!', event.target);
    
    event.preventDefault();
    event.stopPropagation();
    
    const trigger = event.target;
    const extensionContainer = trigger.closest('.extension-trigger');
    const extensionId = parseInt(extensionContainer.dataset.extensionId);
    
    console.log(`[EXTENSION_PROCESSOR] Processing click for extension ${extensionId}`);
    
    if (!extensionId) {
      console.error('[EXTENSION_PROCESSOR] No extension ID found on trigger:', extensionContainer);
      return;
    }
    
    this.toggleExtension(extensionId, trigger);
  }

  /**
   * Handle extension trigger keyboard navigation
   * @param {Event} event - Keydown event
   * @private
   */
  handleExtensionKeydown(event) {
    if (!['Enter', ' '].includes(event.key)) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const trigger = event.target;
    const extensionContainer = trigger.closest('.extension-trigger');
    const extensionId = parseInt(extensionContainer.dataset.extensionId);
    
    this.toggleExtension(extensionId, trigger);
  }

  /**
   * Toggle extension display
   * @param {number} extensionId - Extension ID
   * @param {Element} trigger - Trigger button element
   * @private
   */
  toggleExtension(extensionId, trigger) {
    const extensionData = this.extensions.get(extensionId);
    if (!extensionData) {
      console.error(`[EXTENSION_PROCESSOR] Extension ${extensionId} not found`);
      return;
    }

    const existingBox = document.getElementById(`extension-box-${extensionId}`);
    
    if (existingBox) {
      // Toggle existing extension
      if (extensionData.isOpen) {
        this.closeExtension(extensionId, trigger, existingBox);
      } else {
        this.openExtension(extensionId, trigger, existingBox);
      }
    } else {
      // Create new extension box
      this.createExtensionBox(extensionId, trigger);
    }
  }

  /**
   * Create new extension box - Hacker minimalistic style
   * @param {number} extensionId - Extension ID
   * @param {Element} trigger - Trigger button element
   * @private
   */
  createExtensionBox(extensionId, trigger) {
    const extensionData = this.extensions.get(extensionId);
    const classes = this.config.classes || {};
    
    // Create extension box
    const extensionBox = this.createElement('div', classes.extensionBox || 'paragraph-extension-box');
    extensionBox.id = `extension-box-${extensionId}`;
    
    // Hacker minimalistic styling - simple border, no fancy headers
    this.setStyles(extensionBox, {
      backgroundColor: 'transparent',
      border: '1px solid var(--extension-accent, #ff8800)',
      borderRadius: '0',
      borderLeft: '3px solid var(--extension-accent, #ff8800)',
      padding: '0.75rem 1rem',
      margin: '0.5rem 0',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.85em',
      lineHeight: '1.6',
      animation: this.config.behavior?.enableAnimations ? 'extensionSlideDown 0.2s ease-out' : 'none',
      position: 'relative'
    });

    // Create extension content - no header, no close button
    const processedContent = this.processExtensionContent(extensionData.content);
    
    extensionBox.innerHTML = `
      <div class="${classes.extensionContent || 'extension-content'}" style="
        color: var(--text-color, #e0e0e0);
        line-height: 1.6;
      ">
        ${processedContent}
      </div>
    `;

    // Find the paragraph containing the trigger
    let targetParagraph = trigger.closest('p, .marginalia-voice, blockquote, li');
    if (!targetParagraph) {
      targetParagraph = trigger.parentElement;
    }

    // Insert extension box after the paragraph
    targetParagraph.insertAdjacentElement('afterend', extensionBox);

    // Update extension state
    extensionData.box = extensionBox;
    extensionData.trigger = trigger;
    this.openExtension(extensionId, trigger, extensionBox);

    console.log(`[EXTENSION_PROCESSOR] Created extension box for extension ${extensionId}`);
  }

  /**
   * Open extension (visual state change) - Hacker minimalistic
   * @param {number} extensionId - Extension ID
   * @param {Element} trigger - Trigger button
   * @param {Element} box - Extension box
   * @private
   */
  openExtension(extensionId, trigger, box) {
    const extensionData = this.extensions.get(extensionId);
    
    // Update visual state - inverse coloring like before
    box.style.display = 'block';
    trigger.setAttribute('aria-expanded', 'true');
    trigger.textContent = '−'; // Change to minus sign
    
    // Apply inverse coloring (orange background, dark text) with !important to override CSS
    trigger.style.setProperty('border-color', '#ff8800', 'important');
    trigger.style.setProperty('background-color', '#ff8800', 'important');
    trigger.style.setProperty('color', '#000', 'important');
    
    // Update data state
    extensionData.isOpen = true;
    
    // Smooth scroll to show extension if it's below viewport
    if (this.config.behavior?.autoScrollToExtension !== false) {
      setTimeout(() => {
        const boxRect = box.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (boxRect.bottom > viewportHeight) {
          box.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }

  /**
   * Close extension (visual state change) - Hacker minimalistic
   * @param {number} extensionId - Extension ID
   * @param {Element} trigger - Trigger button
   * @param {Element} box - Extension box
   * @private
   */
  closeExtension(extensionId, trigger, box) {
    const extensionData = this.extensions.get(extensionId);
    
    // Update visual state - restore original colors
    if (this.config.behavior?.enableAnimations) {
      // Animate close
      box.style.animation = 'extensionSlideUp 0.2s ease-in forwards';
      setTimeout(() => {
        box.style.display = 'none';
        box.style.animation = '';
      }, 200);
    } else {
      box.style.display = 'none';
    }
    
    trigger.setAttribute('aria-expanded', 'false');
    trigger.textContent = '+'; // Back to plus sign
    
    // Restore original coloring (transparent background, orange text) with !important
    trigger.style.setProperty('background-color', 'rgba(255, 136, 0, 0.1)', 'important');
    trigger.style.setProperty('border-color', 'rgba(255, 136, 0, 0.5)', 'important');
    trigger.style.setProperty('color', '#ff8800', 'important');
    
    // Update data state
    extensionData.isOpen = false;
  }

  /**
   * Process extension content (supports basic markdown-like syntax)
   * @param {string} content - Raw extension content
   * @returns {string} Processed HTML content
   * @private
   */
  processExtensionContent(content) {
    let processed = content;
    
    // Handle nested brackets (already captured by regex)
    // Support basic formatting:
    processed = processed
      // Strong/bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      
      // Emphasis/italic: *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      
      // Code: `code`
      .replace(/`([^`]+)`/g, '<code style="background: rgba(255,136,0,0.2); padding: 2px 4px; border-radius: 3px;">$1</code>')
      
      // Line breaks: double newline becomes paragraph break
      .replace(/\n\n/g, '</p><p style="margin-top: 1rem;">')
      
      // Single newlines become <br>
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraph if needed
    if (!processed.startsWith('<') && processed.trim()) {
      processed = `<p>${processed}</p>`;
    }
    
    return this.sanitizeHTML(processed);
  }

  /**
   * Escape attribute value for safe HTML insertion
   * @param {string} value - Value to escape
   * @returns {string} Escaped value
   * @private
   */
  escapeAttribute(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Get extension-specific statistics
   * @returns {Object} Enhanced statistics
   */
  getStats() {
    const baseStats = super.getStats();
    return {
      ...baseStats,
      extensionCount: this.extensions.size,
      openExtensions: Array.from(this.extensions.values()).filter(ext => ext.isOpen).length,
      counter: this.counter
    };
  }

  /**
   * Check if processor should handle this element
   * Only process elements that might contain [+] patterns
   * @param {Element} element - Element to check
   * @returns {boolean} Should process this element
   */
  shouldProcess(element) {
    if (!super.shouldProcess(element)) return false;
    
    // Check if element or its children might contain extension patterns
    const text = element.textContent || '';
    return text.includes('[+]');
  }
}

// Add CSS animations for smooth transitions
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('extension-animations')) {
    const style = document.createElement('style');
    style.id = 'extension-animations';
    style.textContent = `
      @keyframes extensionSlideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
          max-height: 0;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
      }
      
      @keyframes extensionSlideUp {
        from {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
        to {
          opacity: 0;
          transform: translateY(-10px);
          max-height: 0;
        }
      }
      
      .paragraph-extension-box {
        overflow: hidden;
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .paragraph-extension-box {
          margin-left: -1rem;
          margin-right: -1rem;
          border-radius: 0;
          border-left: none;
          border-right: none;
        }
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .extension-content {
          color: #e0e0e0;
        }
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .paragraph-extension-box {
          border-width: 3px;
        }
        
        .extension-trigger {
          border: 2px solid white !important;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .paragraph-extension-box {
          animation: none !important;
          transition: none !important;
        }
        
        .extension-trigger {
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParagraphExtensionProcessor;
}