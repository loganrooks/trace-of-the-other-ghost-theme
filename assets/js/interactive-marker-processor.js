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
    marker.textContent = '[?]';
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
    
    // Register default animation modules
    if (typeof TypingAnimation !== 'undefined') {
      const typingAnimation = new TypingAnimation(this.logger);
      this.actionEngine.registerAnimation('typing', typingAnimation);
      this.logger.debug('Registered typing animation module');
    }
    
    this.logger.debug('ActionEngine initialized with animation modules');
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
          display: inline-block;
          background: #007cba;
          color: white;
          font-size: 0.8em;
          font-weight: bold;
          padding: 2px 6px;
          margin: 0 2px;
          border-radius: 3px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          user-select: none;
          position: relative;
          top: -1px;
        }
        
        .interactive-marker:hover,
        .interactive-marker:focus {
          background: #005a87;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 124, 186, 0.3);
          outline: none;
        }
        
        .interactive-marker:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0, 124, 186, 0.3);
        }
        
        .interactive-marker[aria-pressed="true"] {
          background: #28a745;
        }
        
        .interactive-marker-active {
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
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
}