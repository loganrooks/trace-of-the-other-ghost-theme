/**
 * Interactive Marker Processor - [?] pattern processing system
 * Handles [?][action-config][content] patterns for flexible interactive overlays
 * 
 * Philosophy: Extends existing ContentProcessor architecture while providing
 * maximum flexibility for interactive content experiences
 * 
 * Pattern: [?][action-config][content]
 * Example: [?][target:p1-2|fade:0.1|animate:typing|duration:2000][Poem content...]
 * 
 * Dependencies:
 * - ContentProcessor (base class)
 * - ActionEngine (core/action-engine.js)
 * - TargetSelector (core/target-selector.js)
 * 
 * Created: August 25, 2025
 */

class InteractiveMarkerProcessor extends ContentProcessor {
  constructor(config = {}, container = null) {
    super(config, container);
    
    // Set up structured logger
    this.logger = window.logger ? window.logger('interactive-marker') : console;
    
    // DEBUGGING: Log constructor call
    this.logger.info('🔧 InteractiveMarkerProcessor constructor called', {
      config: config,
      containerExists: !!container,
      containerTag: container?.tagName,
      containerClass: container?.className
    });
    
    // Interactive marker specific state
    this.markers = new Map();
    this.activeInteractions = new Map();
    this.counter = 0;
    
    // DEBUGGING: Check if BracketParser is available
    if (typeof BracketParser === 'undefined') {
      this.logger.error('❌ BracketParser not available during construction!');
      this.logger.error('Available globals:', Object.keys(window).filter(k => k.includes('Bracket')));
      throw new Error('BracketParser dependency not loaded');
    } else {
      this.logger.info('✅ BracketParser available during construction');
    }
    
    // Initialize bracket parser for proper pattern matching
    this.bracketParser = new BracketParser(this.logger);
    
    // Default action configuration
    this.defaultActions = {
      target: 'p1',
      fade: '0.2',
      animate: 'typing',
      overlay: 'over',
      duration: '2000',
      delay: '0'
    };
    
    this.logger.info('Initialized with interactive marker system', { 
      container: !!container, 
      config 
    });
  }

  /**
   * Initialize the interactive marker processor
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    try {
      this.logger.time('initialization');
      this.logger.info('Starting interactive marker processing...');
      
      if (!this.container) {
        this.logger.warn('No container found - interactive marker processing disabled');
        return false;
      }

      this.logger.debug('Container found', { 
        tagName: this.container.tagName, 
        className: this.container.className,
        childCount: this.container.children.length 
      });

      // Inject required CSS
      this.injectInteractiveMarkerCSS();
      
      // Initialize action engine
      await this.initializeActionEngine();
      
      const duration = this.logger.timeEnd('initialization');
      this.logger.info(`Interactive marker processor initialized in ${duration?.toFixed(2)}ms`);
      return true;
      
    } catch (error) {
      this.logger.error('Initialization failed', error);
      return false;
    }
  }

  /**
   * Process interactive marker patterns - required by ContentProcessor base class
   * @returns {void}
   */
  process() {
    try {
      this.logger.time('processing');
      this.logger.debug('Starting interactive marker processing...');
      
      // Process [?][action-config][content] patterns
      this.processInteractiveMarkers();
      
      if (this.logger) {
        const duration = this.logger.timeEnd('processing');
        this.logger.debug(`Processing completed: ${this.counter} interactive markers processed in ${duration?.toFixed(2)}ms`);
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Processing failed', error);
      }
      throw error;
    }
  }

  /**
   * Clean up processor resources
   * @returns {void}
   */
  cleanup() {
    try {
      // Cancel any active animations
      this.activeInteractions.forEach((interaction, markerId) => {
        this.cancelInteraction(markerId);
      });

      // Remove event listeners
      const markerElements = this.container.querySelectorAll('.interactive-marker');
      markerElements.forEach(marker => {
        const handler = this.markers.get(marker.dataset.markerId);
        if (handler?.clickHandler) {
          marker.removeEventListener('click', handler.clickHandler);
          marker.removeEventListener('keydown', handler.keydownHandler);
        }
      });

      // Clear state
      this.markers.clear();
      this.activeInteractions.clear();
      this.counter = 0;

      this.logger.info('Interactive marker processor cleaned up');
    } catch (error) {
      this.logger.error('Cleanup failed', error);
    }
  }

  /**
   * Process all [?][action-config][content] patterns in the container
   * Uses proper bracket counting to handle nested brackets correctly
   * @private
   */
  processInteractiveMarkers() {
    const textContent = this.container.innerHTML;
    
    // DEBUGGING: Log what content we're processing
    this.logger.info('🔍 Processing interactive markers...');
    this.logger.info('Content length:', textContent.length);
    this.logger.info('Content preview:', textContent.substring(0, 200) + '...');
    this.logger.info('Looking for [?] patterns...');
    
    // DEBUGGING: Check if content contains [?] patterns at all
    const simpleCheck = textContent.includes('[?]');
    this.logger.info('Simple [?] check:', simpleCheck);
    
    if (simpleCheck) {
      const positions = [];
      let pos = textContent.indexOf('[?]');
      while (pos !== -1) {
        positions.push(pos);
        pos = textContent.indexOf('[?]', pos + 1);
      }
      this.logger.info('[?] found at positions:', positions);
    }
    
    const matches = this.bracketParser.findInteractiveMarkers(textContent);
    
    this.logger.info(`✨ Found ${matches.length} interactive marker patterns`);
    
    if (matches.length === 0) {
      this.logger.warn('❌ No interactive markers found! Debugging...');
      
      // Try to find patterns manually for debugging
      const manualCheck = /\[\?\]/g;
      const manualMatches = [...textContent.matchAll(manualCheck)];
      this.logger.warn('Manual regex found:', manualMatches.length, 'simple [?] patterns');
      
      // Test bracket parser directly
      try {
        this.logger.warn('Testing bracket parser directly...');
        const testResult = this.bracketParser.findPattern(textContent, '[?]', 2);
        this.logger.warn('Direct bracket parser result:', testResult.length, 'patterns');
      } catch (error) {
        this.logger.error('Bracket parser error:', error);
      }
    }
    
    // Create marker elements for each match
    const markerElements = [];
    
    matches.forEach((match, index) => {
      const { fullMatch, actionConfig, content, startIndex } = match;
      const markerId = `interactive-marker-${this.counter++}`;
      
      try {
        // Parse action configuration
        const actions = this.parseActionConfig(actionConfig);
        
        // Create marker element
        const markerElement = this.createMarkerElement(markerId, actions, content);
        
        // Store marker data
        this.markers.set(markerId, {
          element: markerElement,
          actions: actions,
          content: content,
          originalMatch: fullMatch,
          clickHandler: null,
          keydownHandler: null
        });
        
        markerElements.push({
          markerId: markerId,
          element: markerElement,
          match: match
        });
        
        this.logger.debug(`Created interactive marker ${markerId}`, { 
          actions, 
          contentPreview: content.substring(0, 50) + '...',
          startIndex: startIndex
        });
        
      } catch (error) {
        this.logger.error(`Failed to process marker ${index}:`, error);
      }
    });
    
    // Use bracket parser's replacement utility
    this.container.innerHTML = this.bracketParser.replaceMatches(
      textContent,
      matches,
      (match) => {
        const markerElement = markerElements.find(el => el.match === match);
        return markerElement ? markerElement.element.outerHTML : match.fullMatch;
      }
    );
    
    // After DOM modification, attach event handlers
    this.attachEventHandlers();
  }


  /**
   * Parse action configuration string into action object
   * @param {string} actionConfig - Pipe-separated action config
   * @returns {Object} Parsed actions
   * @private
   */
  parseActionConfig(actionConfig) {
    const actions = { ...this.defaultActions };
    
    if (!actionConfig || actionConfig.trim() === '') {
      return actions;
    }
    
    const parts = actionConfig.split('|');
    
    parts.forEach(part => {
      const [key, value] = part.split(':');
      if (key && value) {
        actions[key.trim()] = value.trim();
      }
    });
    
    return actions;
  }

  /**
   * Create marker DOM element
   * @param {string} markerId - Unique marker identifier
   * @param {Object} actions - Parsed action configuration
   * @param {string} content - Marker content
   * @returns {HTMLElement} Marker element
   * @private
   */
  createMarkerElement(markerId, actions, content) {
    const marker = document.createElement('span');
    marker.className = 'interactive-marker';
    marker.dataset.markerId = markerId;
    marker.textContent = '?';
    marker.title = `Interactive content: ${actions.animate} animation`;
    marker.setAttribute('role', 'button');
    marker.setAttribute('tabindex', '0');
    marker.setAttribute('aria-label', `Interactive marker - ${actions.animate} animation`);
    
    return marker;
  }

  /**
   * Attach event handlers to all interactive markers
   * @private
   */
  attachEventHandlers() {
    this.markers.forEach((markerData, markerId) => {
      const element = this.container.querySelector(`[data-marker-id="${markerId}"]`);
      if (element) {
        // Create bound event handlers
        const clickHandler = this.handleMarkerClick.bind(this, markerId);
        const keydownHandler = this.handleMarkerKeydown.bind(this, markerId);
        
        // Store handlers for cleanup
        markerData.clickHandler = clickHandler;
        markerData.keydownHandler = keydownHandler;
        
        // Attach event listeners
        element.addEventListener('click', clickHandler);
        element.addEventListener('keydown', keydownHandler);
        
        this.logger.debug(`Attached event handlers for marker ${markerId}`);
      }
    });
  }

  /**
   * Handle interactive marker click
   * @param {string} markerId - Marker identifier
   * @param {Event} event - Click event
   * @private
   */
  async handleMarkerClick(markerId, event) {
    event.preventDefault();
    
    try {
      const markerData = this.markers.get(markerId);
      if (!markerData) {
        this.logger.error(`Marker data not found for ${markerId}`);
        return;
      }
      
      this.logger.info(`Interactive marker clicked: ${markerId}`);
      
      // Cancel any existing interaction for this marker
      if (this.activeInteractions.has(markerId)) {
        await this.cancelInteraction(markerId);
      }
      
      // Execute the interaction
      await this.executeInteraction(markerId, markerData);
      
    } catch (error) {
      this.logger.error(`Failed to handle marker click for ${markerId}:`, error);
    }
  }

  /**
   * Handle interactive marker keydown (accessibility)
   * @param {string} markerId - Marker identifier
   * @param {Event} event - Keydown event
   * @private
   */
  async handleMarkerKeydown(markerId, event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      await this.handleMarkerClick(markerId, event);
    }
  }

  /**
   * Execute interaction for a marker
   * @param {string} markerId - Marker identifier
   * @param {Object} markerData - Marker data object
   * @private
   */
  async executeInteraction(markerId, markerData) {
    const { actions, content } = markerData;
    
    try {
      this.logger.info(`Executing interaction for ${markerId}`, { actions });
      
      // Create interaction state
      const interaction = {
        markerId: markerId,
        actions: actions,
        content: content,
        targetElements: null,
        originalStates: new Map(),
        animationControllers: [],
        startTime: performance.now()
      };
      
      // Store active interaction
      this.activeInteractions.set(markerId, interaction);
      
      // Execute action sequence
      await this.executeActionSequence(interaction);
      
    } catch (error) {
      this.logger.error(`Interaction execution failed for ${markerId}:`, error);
      // Clean up failed interaction
      this.cancelInteraction(markerId);
    }
  }


  /**
   * Initialize action engine and required modules
   * @private
   */
  async initializeActionEngine() {
    // Initialize ActionEngine
    this.actionEngine = new ActionEngine(this.container, this.logger);
    
    this.logger.debug('=== INITIALIZING ACTION ENGINE ===');
    this.logger.debug('Checking for TypingAnimation availability...');
    this.logger.debug('typeof TypingAnimation:', typeof TypingAnimation);
    this.logger.debug('window.TypingAnimation exists:', typeof window.TypingAnimation !== 'undefined');
    
    // Attempt to register TypingAnimation with retry logic
    await this.registerTypingAnimationWithRetry();
    
    // List registered animations for debug
    if (this.actionEngine && this.actionEngine.animations) {
      const registeredAnimations = Object.keys(this.actionEngine.animations || {});
      this.logger.debug('Registered animation modules:', registeredAnimations);
    }
    
    this.logger.debug('=== ACTION ENGINE INITIALIZATION COMPLETE ===');
  }

  /**
   * Register TypingAnimation with retry mechanism in case of timing issues
   * @private
   */
  async registerTypingAnimationWithRetry(maxRetries = 3, delayMs = 100) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.logger.debug(`TypingAnimation registration attempt ${attempt}/${maxRetries}`);
      
      // Check if TypingAnimation is available
      if (typeof TypingAnimation !== 'undefined') {
        try {
          const typingAnimation = new TypingAnimation(this.logger);
          this.actionEngine.registerAnimation('typing', typingAnimation);
          this.logger.debug('✅ Successfully registered typing animation module (global)');
          return true;
        } catch (error) {
          this.logger.error('❌ Failed to create TypingAnimation instance (global):', error);
        }
      } else if (typeof window.TypingAnimation !== 'undefined') {
        try {
          const typingAnimation = new window.TypingAnimation(this.logger);
          this.actionEngine.registerAnimation('typing', typingAnimation);
          this.logger.debug('✅ Successfully registered typing animation module (window)');
          return true;
        } catch (error) {
          this.logger.error('❌ Failed to create window.TypingAnimation instance:', error);
        }
      } else {
        this.logger.warn(`❌ Attempt ${attempt}: TypingAnimation class not found`);
        
        // Log available Animation-related globals for debugging
        const animationGlobals = Object.keys(window).filter(k => 
          k.toLowerCase().includes('animation') || k.toLowerCase().includes('typing')
        );
        this.logger.debug('Available animation-related globals:', animationGlobals);
        
        // If not the final attempt, wait before retrying
        if (attempt < maxRetries) {
          this.logger.debug(`Waiting ${delayMs}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    
    this.logger.error('❌ Failed to register TypingAnimation after all attempts');
    this.logger.error('This will cause "Animation module not found: typing" errors');
    return false;
  }

  /**
   * Execute the sequence of actions for an interaction using ActionEngine
   * @param {Object} interaction - Interaction state object
   * @private
   */
  async executeActionSequence(interaction) {
    const { actions, content, markerId } = interaction;
    
    try {
      // Use ActionEngine to execute the complete sequence
      const result = await this.actionEngine.execute(markerId, actions, content);
      
      // Update interaction state with result
      interaction.result = result;
      interaction.status = 'completed';
      
      this.logger.debug(`Action sequence completed for ${markerId}`, result);
      
    } catch (error) {
      interaction.status = 'failed';
      interaction.error = error;
      throw error;
    }
  }

  /**
   * Cancel an active interaction
   * @param {string} markerId - Marker identifier
   * @private
   */
  async cancelInteraction(markerId) {
    const interaction = this.activeInteractions.get(markerId);
    if (!interaction) return;
    
    try {
      // Use ActionEngine to clean up the interaction
      if (this.actionEngine) {
        await this.actionEngine.cleanup(markerId);
      }
      
      // Remove from active interactions
      this.activeInteractions.delete(markerId);
      
      this.logger.debug(`Cancelled interaction for marker ${markerId}`);
    } catch (error) {
      this.logger.error(`Failed to cancel interaction for ${markerId}:`, error);
    }
  }

  /**
   * Utility delay function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   * @private
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Inject CSS for interactive markers
   * @private
   */
  injectInteractiveMarkerCSS() {
    if (!document.getElementById('interactive-marker-styles')) {
      const style = document.createElement('style');
      style.id = 'interactive-marker-styles';
      style.textContent = `
        .interactive-marker {
          /* Base styling similar to footnote links */
          position: relative;
          display: inline-flex;
          vertical-align: super;
          font-size: 0.75em;
          line-height: 1;
          margin: 0 0.1em;
          
          /* Box styling similar to extensions but larger */
          width: 2em;
          height: 2em;
          font-weight: 500;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid #00ffff;
          border-radius: 3px;
          padding: 0;
          
          /* Center the ? symbol */
          align-items: center;
          justify-content: center;
          
          /* Interactive styling */
          color: #00ffff;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
          text-shadow: 0 0 3px rgba(0, 255, 255, 0.5);
        }
        
        .interactive-marker:hover,
        .interactive-marker:focus {
          background: rgba(0, 255, 255, 0.2);
          border-color: #00ffff;
          box-shadow: 0 0 6px rgba(0, 255, 255, 0.4);
          transform: scale(1.05);
          outline: none;
        }
        
        .interactive-marker:active {
          transform: scale(0.95);
          box-shadow: 0 0 4px rgba(0, 255, 255, 0.4);
        }
        
        .interactive-marker[aria-pressed="true"] {
          background: rgba(0, 255, 255, 0.3);
          transform: scale(1.1);
        }
        
        .interactive-marker-active {
          animation: interactive-pulse 1s infinite;
        }
        
        @keyframes interactive-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .interactive-marker,
          .interactive-marker-active {
            animation: none;
            transition: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveMarkerProcessor;
} else if (typeof window !== 'undefined') {
  window.InteractiveMarkerProcessor = InteractiveMarkerProcessor;
  
  // Global debug function for troubleshooting
  window.debugInteractiveMarkerHTML = function() {
    const container = document.querySelector('.post-content, .content, main, body');
    if (!container) {
      console.error('No content container found');
      return;
    }
    
    console.log('=== INTERACTIVE MARKER HTML DEBUG ===');
    
    // Find all [?] patterns in HTML
    const htmlContent = container.innerHTML;
    console.log('Container HTML length:', htmlContent.length);
    
    // Look for [?] patterns - need to escape the ? character  
    const interactivePatterns = htmlContent.match(/\[\?\]\[([^\]]*)\]\[([^\]]*)\]/g);
    console.log('Interactive patterns found:', interactivePatterns ? interactivePatterns.length : 0);
    
    if (interactivePatterns) {
      interactivePatterns.forEach((pattern, i) => {
        console.log(`Pattern ${i + 1}:`, pattern);
        
        // Try to extract the content part
        const match = pattern.match(/\[\?\]\[([^\]]*)\]\[([^\]]*)\]/);
        if (match) {
          const config = match[1];
          const content = match[2];
          console.log(`  Config: "${config}"`);
          console.log(`  Content: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`);
          
          // Check if content contains HTML
          const hasHTML = /<[^>]+>/.test(content);
          console.log(`  Contains HTML: ${hasHTML}`);
          
          if (hasHTML) {
            const htmlTags = content.match(/<[^>]+>/g);
            console.log(`  HTML tags: ${htmlTags ? htmlTags.length : 0}`);
            if (htmlTags) {
              console.log(`  Sample tags:`, htmlTags.slice(0, 3));
            }
          }
        }
      });
    }
    
    // Check existing interactive markers
    const existingMarkers = container.querySelectorAll('.interactive-marker');
    console.log('Existing interactive markers in DOM:', existingMarkers.length);
    
    existingMarkers.forEach((marker, i) => {
      console.log(`Marker ${i + 1}:`, {
        id: marker.dataset.markerId,
        text: marker.textContent,
        classes: marker.className
      });
    });
    
    console.log('=== END DEBUG ===');
    
    return {
      patterns: interactivePatterns,
      markers: existingMarkers.length,
      containerLength: htmlContent.length
    };
  };
  
  // Debug function to manually trigger typing animation
  window.debugTypingAnimation = function(testContent) {
    console.log('=== MANUAL TYPING ANIMATION DEBUG ===');
    
    if (!testContent) {
      testContent = 'Test <strong>bold</strong> and <em>italic</em> text';
    }
    
    // Find an existing interactive marker processor
    const container = document.querySelector('.post-content, .content, main, body');
    if (!container) {
      console.error('No container found');
      return;
    }
    
    // Create a test typing animation
    const logger = window.logger ? window.logger('debug') : console;
    
    if (typeof window.TypingAnimation === 'undefined') {
      console.error('TypingAnimation class not available');
      return;
    }
    
    const typingAnimation = new window.TypingAnimation(logger);
    
    // Create a test element to type into
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: fixed;
      top: 100px;
      left: 100px;
      width: 300px;
      height: 200px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      z-index: 9999;
      border: 2px solid cyan;
    `;
    document.body.appendChild(testElement);
    
    // Test the typing animation directly
    typingAnimation.performTypingAnimation(
      [{ element: testElement }],
      testContent,
      { characterDelay: 50, punctuationPause: 100, lineBreakPause: 300 },
      { cancelled: false, timeouts: [], elements: [testElement] }
    ).then(() => {
      console.log('✅ Test typing animation completed');
    }).catch(error => {
      console.error('❌ Test typing animation failed:', error);
    });
    
    return {
      testElement: testElement,
      cleanup: () => testElement.remove()
    };
  };
}