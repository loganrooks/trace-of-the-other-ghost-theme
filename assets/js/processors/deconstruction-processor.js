/**
 * Deconstruction Processor - Radical Text Effects System
 * 
 * Performs literal deconstruction on text through:
 * - Dissolution: Text gradual breakdown and character drift
 * - Language Collision: RTL/LTR text barriers and conflicts
 * - Recursive Commentary: Nested voices commenting on themselves
 * - Voice Interruption: Multiple voices arguing and overlapping
 * - Temporal Instability: Text changes over time, self-forgetting
 * - Syntactic Breakdown: Grammar dissolution and punctuation drift
 * 
 * Philosophy: The processor embodies deconstructive theory by literally
 * performing deconstruction on the text itself, not just describing it.
 * 
 * HTML Pattern: Uses `data-deconstruct` attributes for Ghost editor compatibility
 * 
 * Processing Order: FIRST - establishes unstable foundation for other processors
 * 
 * Created: August 25, 2025
 */

// Check if base class is available
if (typeof ContentProcessor === 'undefined') {
  console.error('❌ DeconstructionProcessor: ContentProcessor base class not available');
  console.error('Check that content-processor-base.js loaded before this script');
} else {
  console.log('✅ DeconstructionProcessor: Base class available, defining processor...');
}

class DeconstructionProcessor extends ContentProcessor {
  constructor(config = {}, container = null) {
    super(config, container);
    
    // Set up structured logger
    this.logger = window.logger ? window.logger('deconstruction') : console;
    
    // Processor-specific state
    this.deconstructElements = new Map();
    this.activeEffects = new Set();
    this.intersectionObserver = null;
    this.mutationObserver = null;
    this.animationFrame = null;
    
    // Effect configurations from processor-specific config
    // Note: this.config IS the deconstruction config (not nested under processors.deconstruction)
    this.effectConfig = this.config.effects || {};
    this.performanceConfig = this.config.performance || {};
    this.accessibilityConfig = this.config.accessibility || {};
    
    // Effect instances (will be initialized in init())
    this.effects = new Map();
    
    // Default settings
    this.defaults = {
      speed: 'normal',
      intensity: 'medium',
      respectMotion: true
    };
    
    this.logger.info('Initialized with radical deconstruction system', { 
      container: !!container, 
      config: this.effectConfig 
    });
  }

  /**
   * Initialize the deconstruction processor
   * @returns {Promise<boolean>} Success status
   */
  async init() {
    try {
      this.logger.time('initialization');
      this.logger.info('Starting deconstruction text processing...');
      
      if (!this.container) {
        this.logger.warn('No container found - deconstruction processing disabled');
        return false;
      }

      this.logger.debug('Container found', { 
        tagName: this.container.tagName, 
        className: this.container.className,
        childCount: this.container.children.length 
      });

      // Initialize effect classes
      await this.initializeEffects();
      
      // Set up observers for performance
      this.setupObservers();
      
      // Apply base initialization
      await this.baseInit();
      
      const duration = this.logger.timeEnd('initialization');
      this.logger.info(`Deconstruction processor initialized in ${duration?.toFixed(2)}ms`);
      return true;
      
    } catch (error) {
      this.logger.error('Initialization failed', error);
      return false;
    }
  }

  /**
   * Initialize effect handling classes
   * @private
   */
  async initializeEffects() {
    this.logger.debug('Initializing deconstruction effects...');
    
    // Initialize effect handlers
    this.effects.set('dissolve', new DissolveEffect(this.effectConfig, this.logger));
    this.effects.set('collision', new CollisionEffect(this.effectConfig, this.logger));
    this.effects.set('recursion', new RecursionEffect(this.effectConfig, this.logger));
    this.effects.set('voices', new VoiceEffect(this.effectConfig, this.logger));
    this.effects.set('temporal', new TemporalEffect(this.effectConfig, this.logger));
    this.effects.set('syntax', new SyntaxEffect(this.effectConfig, this.logger));
    
    this.logger.debug(`Initialized ${this.effects.size} effect types`);
  }

  /**
   * Set up performance observers
   * @private
   */
  setupObservers() {
    if (!this.performanceConfig.useIntersectionObserver) {
      return;
    }

    // Intersection Observer for lazy effect activation
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        if (entry.isIntersecting) {
          this.activateEffect(element);
        } else {
          this.deactivateEffect(element);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    this.logger.debug('Intersection Observer configured for lazy loading');
  }

  /**
   * Process deconstruction content - required by ContentProcessor base class
   * @returns {void}
   */
  process() {
    try {
      if (this.logger) {
        this.logger.time('processing');
        this.logger.debug('Starting deconstruction processing...');
      }
      
      // Find all deconstruction elements
      const elements = this.findAllInContainer('[data-deconstruct]');
      this.logger.debug(`Found ${elements.length} deconstruction elements`);

      elements.forEach((element, index) => {
        this.processDeconstructElement(element, index);
      });
      
      if (this.logger) {
        const duration = this.logger.timeEnd('processing');
        this.logger.debug(`Processing completed: ${elements.length} elements processed in ${duration?.toFixed(2)}ms`);
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Processing failed', error);
      }
      throw error;
    }
  }

  /**
   * Process a single deconstruction element
   * @param {Element} element - Element to process
   * @param {number} index - Element index
   * @private
   */
  processDeconstructElement(element, index) {
    const effectType = element.dataset.deconstruct;
    
    this.logger.debug(`Processing element ${index + 1}: effect type "${effectType}"`);

    // Validate effect type
    if (!this.effects.has(effectType)) {
      this.logger.warn(`Unknown effect type: ${effectType}`);
      return;
    }

    // Check if effect is enabled
    const enabledKey = `enable${effectType.charAt(0).toUpperCase() + effectType.slice(1)}`;
    if (!this.effectConfig[enabledKey]) {
      this.logger.debug(`Effect ${effectType} is disabled`);
      return;
    }

    // Apply base classes
    element.classList.add('deconstruct-element');
    element.classList.add(`deconstruct-${effectType}`);
    
    // Store element data
    const elementData = {
      id: `deconstruct-${index + 1}`,
      effectType: effectType,
      element: element,
      parameters: this.parseElementParameters(element),
      initialized: false,
      active: false
    };

    this.deconstructElements.set(element, elementData);

    // Set up intersection observation if enabled
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    } else {
      // Activate immediately if no lazy loading
      this.activateEffect(element);
    }

    this.incrementProcessed();
  }

  /**
   * Parse element parameters from data attributes
   * @param {Element} element - Element to parse
   * @returns {Object} Parsed parameters
   * @private
   */
  parseElementParameters(element) {
    const params = {
      speed: element.dataset.speed || this.defaults.speed,
      intensity: element.dataset.intensity || this.defaults.intensity,
      direction: element.dataset.direction,
      languages: element.dataset.languages,
      depth: parseInt(element.dataset.depth) || 1,
      mode: element.dataset.mode,
      decay: element.dataset.decay === 'true',
      fragment: element.dataset.fragment === 'true',
      severity: element.dataset.severity || 'moderate'
    };

    // Apply accessibility overrides
    if (this.accessibilityConfig.respectReducedMotion && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      params.speed = 'slow';
      params.intensity = 'mild';
    }

    return params;
  }

  /**
   * Activate effect for an element
   * @param {Element} element - Element to activate
   * @private
   */
  activateEffect(element) {
    const elementData = this.deconstructElements.get(element);
    if (!elementData || elementData.active) {
      return;
    }

    // Check active effects limit
    if (this.activeEffects.size >= this.performanceConfig.maxActiveEffects) {
      this.logger.debug('Maximum active effects reached, queuing');
      return;
    }

    const effect = this.effects.get(elementData.effectType);
    if (!effect) {
      return;
    }

    this.logger.debug(`Activating ${elementData.effectType} effect`, elementData.parameters);

    // Initialize effect if needed
    if (!elementData.initialized) {
      effect.initialize(element, elementData.parameters);
      elementData.initialized = true;
    }

    // Activate effect
    effect.activate(element, elementData.parameters);
    elementData.active = true;
    this.activeEffects.add(element);

    this.logger.debug(`Effect activated: ${elementData.effectType} (${this.activeEffects.size} active)`);
  }

  /**
   * Deactivate effect for an element
   * @param {Element} element - Element to deactivate
   * @private
   */
  deactivateEffect(element) {
    const elementData = this.deconstructElements.get(element);
    if (!elementData || !elementData.active) {
      return;
    }

    const effect = this.effects.get(elementData.effectType);
    if (effect && effect.deactivate) {
      effect.deactivate(element);
    }

    elementData.active = false;
    this.activeEffects.delete(element);

    this.logger.debug(`Effect deactivated: ${elementData.effectType} (${this.activeEffects.size} active)`);
  }

  /**
   * Clean up deconstruction processor resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    this.logger.debug('Cleaning up deconstruction system...');
    
    // Deactivate all effects
    this.activeEffects.forEach(element => {
      this.deactivateEffect(element);
    });

    // Clean up observers
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Clear state
    this.deconstructElements.clear();
    this.activeEffects.clear();
    
    this.baseCleanup();
    this.logger.debug('Cleanup completed');
  }

  /**
   * Get deconstruction statistics
   * @returns {Object} Statistics
   */
  getStats() {
    const baseStats = super.getStats();
    
    return {
      ...baseStats,
      totalElements: this.deconstructElements.size,
      activeEffects: this.activeEffects.size,
      effectTypes: Array.from(this.effects.keys()),
      enabledEffects: Object.entries(this.effectConfig)
        .filter(([key, value]) => key.startsWith('enable') && value)
        .map(([key]) => key.replace('enable', '').toLowerCase())
    };
  }

  /**
   * Debug information
   */
  debug() {
    console.group('[DECONSTRUCTION_PROCESSOR] Debug Information');
    
    const stats = this.getStats();
    console.log('Deconstruction Stats:', stats);
    
    console.log('Effect Configuration:', this.effectConfig);
    console.log('Performance Configuration:', this.performanceConfig);
    console.log('Accessibility Configuration:', this.accessibilityConfig);
    console.log('Active Elements:', Array.from(this.deconstructElements.entries()));
    
    console.groupEnd();
  }
}


// ===== EFFECT CLASSES =====
// Individual effect implementations

/**
 * Base Effect Class
 * Abstract foundation for all deconstruction effects
 */
class BaseEffect {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.activeElements = new Set();
  }

  initialize(element, parameters) {
    this.logger.debug(`Initializing ${this.constructor.name}`, parameters);
  }

  activate(element, parameters) {
    this.activeElements.add(element);
    this.logger.debug(`Activating ${this.constructor.name}`);
  }

  deactivate(element) {
    this.activeElements.delete(element);
    this.logger.debug(`Deactivating ${this.constructor.name}`);
  }
}

/**
 * Dissolution Effect - Text gradual breakdown
 */
class DissolveEffect extends BaseEffect {
  initialize(element, parameters) {
    super.initialize(element, parameters);
    
    // Wrap individual characters for animation
    this.wrapCharacters(element);
  }

  wrapCharacters(element) {
    const text = element.textContent;
    const wrappedHTML = text
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        return `<span class="char" style="--char-index: ${index}">${char}</span>`;
      })
      .join('');
    
    element.innerHTML = wrappedHTML;
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    
    element.classList.add('deconstruct-dissolve', 'dissolve-active');
    
    // Set speed based on parameters
    const speedMap = { slow: '4s', normal: '2s', fast: '1s' };
    element.style.setProperty('--dissolve-speed', speedMap[parameters.speed] || '2s');
  }

  deactivate(element) {
    super.deactivate(element);
    element.classList.remove('dissolve-active');
  }
}

/**
 * Language Collision Effect - RTL/LTR conflicts
 */
class CollisionEffect extends BaseEffect {
  initialize(element, parameters) {
    super.initialize(element, parameters);
    
    if (parameters.languages) {
      this.setupLanguageSpans(element, parameters.languages);
    }
  }

  setupLanguageSpans(element, languages) {
    const langArray = languages.split(',');
    const spans = element.querySelectorAll('[lang]');
    
    spans.forEach(span => {
      const lang = span.getAttribute('lang');
      if (['he', 'ar', 'fa'].includes(lang)) {
        span.setAttribute('dir', 'rtl');
        span.classList.add('rtl-text');
      } else {
        span.setAttribute('dir', 'ltr'); 
        span.classList.add('ltr-text');
      }
    });
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    element.classList.add('deconstruct-collision', 'collision-active');
  }
}

/**
 * Recursive Commentary Effect - Infinite regression
 */
class RecursionEffect extends BaseEffect {
  initialize(element, parameters) {
    super.initialize(element, parameters);
    
    this.createRecursiveLayers(element, parameters.depth || 3);
  }

  createRecursiveLayers(element, depth) {
    const originalText = element.textContent;
    let html = '';
    
    for (let level = 0; level < depth; level++) {
      const opacity = 1 - (level * 0.2);
      const indent = level * 2;
      html += `<div class="recursion-level" style="--level: ${level}; padding-left: ${indent}em; opacity: ${opacity}">
        ${originalText} ${level > 0 ? `(${level + 1})` : ''}
      </div>`;
    }
    
    element.innerHTML = html;
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    element.classList.add('deconstruct-recursion', 'recursion-active');
  }
}

/**
 * Voice Interruption Effect - Multiple voices colliding
 */
class VoiceEffect extends BaseEffect {
  initialize(element, parameters) {
    super.initialize(element, parameters);
    
    this.setupVoiceSpans(element, parameters);
  }

  setupVoiceSpans(element, parameters) {
    const voiceSpans = element.querySelectorAll('[data-voice]');
    
    voiceSpans.forEach((span, index) => {
      const voice = span.dataset.voice;
      span.classList.add(`voice-${voice}`);
      
      if (span.dataset.interrupts === 'true') {
        span.classList.add('voice-interrupt');
        span.style.setProperty('--interrupt-delay', `${index * 0.5}s`);
      }
    });
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    element.classList.add('deconstruct-voices', 'voices-active');
  }
}

/**
 * Temporal Instability Effect - Text changes over time
 */
class TemporalEffect extends BaseEffect {
  constructor(config, logger) {
    super(config, logger);
    this.intervals = new Map();
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    
    element.classList.add('deconstruct-temporal', 'temporal-active');
    
    if (parameters.decay) {
      this.startTemporalDecay(element, parameters);
    }
  }

  startTemporalDecay(element, parameters) {
    const originalText = element.textContent;
    let currentText = originalText;
    
    const interval = setInterval(() => {
      // Randomly remove characters
      if (currentText.length > originalText.length * 0.3) {
        const randomIndex = Math.floor(Math.random() * currentText.length);
        currentText = currentText.slice(0, randomIndex) + currentText.slice(randomIndex + 1);
        element.textContent = currentText;
      }
    }, 2000);
    
    this.intervals.set(element, interval);
  }

  deactivate(element) {
    super.deactivate(element);
    
    if (this.intervals.has(element)) {
      clearInterval(this.intervals.get(element));
      this.intervals.delete(element);
    }
  }
}

/**
 * Syntactic Breakdown Effect - Grammar dissolution
 */
class SyntaxEffect extends BaseEffect {
  initialize(element, parameters) {
    super.initialize(element, parameters);
    
    if (parameters.fragment) {
      this.wrapPunctuation(element);
    }
  }

  wrapPunctuation(element) {
    const html = element.innerHTML.replace(
      /([.!?;:,])/g,
      '<span class="punctuation">$1</span>'
    );
    element.innerHTML = html;
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    element.classList.add('deconstruct-syntax', 'syntax-active');
  }
}


// Expose class globally for system access
window.DeconstructionProcessor = DeconstructionProcessor;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeconstructionProcessor;
}