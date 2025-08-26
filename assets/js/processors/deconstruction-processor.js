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
    
    this.originalText = element.textContent.trim();
    this.words = [];
    this.collisionActive = false;
    this.scatterTimer = null;
    
    this.setupWordScattering(element, parameters);
  }

  setupWordScattering(element, parameters) {
    const words = this.originalText.split(/\s+/);
    const force = parameters.force || 'medium';
    const scatter = parameters.scatter || 'medium';
    
    // Clear element and create word spans
    element.innerHTML = '';
    element.classList.add('collision-container');
    
    words.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'collision-word';
      wordSpan.textContent = word;
      wordSpan.style.setProperty('--word-index', index);
      wordSpan.style.setProperty('--total-words', words.length);
      
      // Store original position for return animation
      const originalDelay = index * 0.1;
      wordSpan.style.setProperty('--original-delay', `${originalDelay}s`);
      
      element.appendChild(wordSpan);
      if (index < words.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
      
      this.words.push({
        element: wordSpan,
        word: word,
        index: index,
        scattered: false
      });
    });
    
    // Set collision parameters
    element.style.setProperty('--collision-force', this.getForceValue(force));
    element.style.setProperty('--scatter-range', this.getScatterValue(scatter));
  }

  getForceValue(force) {
    const values = {
      gentle: '0.5',
      medium: '1.0',
      strong: '1.5'
    };
    return values[force] || values.medium;
  }

  getScatterValue(scatter) {
    const values = {
      tight: '100px',
      medium: '200px',
      wide: '300px'
    };
    return values[scatter] || values.medium;
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    element.classList.add('deconstruct-collision');
    
    // Start collision sequence
    this.startCollisionSequence(element, parameters);
  }

  startCollisionSequence(element, parameters) {
    if (this.collisionActive) return;
    
    this.collisionActive = true;
    element.classList.add('collision-active');
    
    // Phase 1: Show the violence of bringing concepts together
    this.performMeaningViolence(element, parameters);
    
    // Phase 2: Fragmentation as concepts resist synthesis
    setTimeout(() => {
      this.fragmentMeaning(element, parameters);
    }, 1000);
    
    // Phase 3: Expose the remains - what survives meaning-making violence
    setTimeout(() => {
      this.exposeRemains(element, parameters);
    }, 3000);
  }

  performMeaningViolence(element, parameters) {
    // First, highlight each word to show them as individual concepts
    this.words.forEach((wordData, index) => {
      const word = wordData.element;
      setTimeout(() => {
        word.style.background = 'rgba(255, 200, 200, 0.3)';
        word.style.border = '1px solid rgba(200, 100, 100, 0.5)';
        word.style.padding = '2px 4px';
        word.style.margin = '2px';
        word.style.borderRadius = '3px';
        word.style.transform = 'scale(1.05)';
      }, index * 100);
    });
    
    // Add critique text that appears
    const critique = document.createElement('div');
    critique.className = 'collision-critique';
    critique.innerHTML = '<em>[Each word was whole before philosophy tried to make them agree]</em>';
    critique.style.cssText = `
      position: absolute;
      top: -2rem;
      left: 0;
      font-size: 0.8em;
      color: rgba(150, 100, 100, 0.7);
      font-style: italic;
      opacity: 0;
      transition: opacity 1s ease;
    `;
    element.appendChild(critique);
    
    setTimeout(() => {
      critique.style.opacity = '1';
    }, 500);
  }

  fragmentMeaning(element, parameters) {
    const force = parseFloat(element.style.getPropertyValue('--collision-force'));
    const scatterRange = parseInt(element.style.getPropertyValue('--scatter-range'));
    
    // Words violently resist being brought into relation
    this.words.forEach((wordData, index) => {
      const word = wordData.element;
      const randomAngle = Math.random() * 360;
      const randomDistance = (Math.random() * scatterRange * force) + 30;
      const randomRotation = (Math.random() - 0.5) * 180 * force;
      const randomDelay = Math.random() * 0.3;
      
      const x = Math.cos(randomAngle * Math.PI / 180) * randomDistance;
      const y = Math.sin(randomAngle * Math.PI / 180) * randomDistance;
      
      word.style.transition = `all ${1.0 + randomDelay}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      word.style.transform = `translate(${x}px, ${y}px) rotate(${randomRotation}deg) scale(${0.6 + Math.random() * 0.5})`;
      word.style.opacity = 0.4 + Math.random() * 0.4;
      
      // Some words become illegible - meaning destroyed in the collision
      if (Math.random() < 0.3) {
        word.style.textDecoration = 'line-through';
        word.style.color = '#999';
      }
      
      // Some words fragment into letters
      if (Math.random() < 0.2) {
        const letters = wordData.word.split('');
        word.innerHTML = letters.map(letter => 
          `<span style="display: inline-block; transform: rotate(${Math.random() * 20 - 10}deg) translateY(${Math.random() * 10 - 5}px);">${letter}</span>`
        ).join('');
      }
      
      wordData.scattered = true;
    });
  }

  exposeRemains(element, parameters) {
    // What survives the violence of meaning-making?
    const remains = document.createElement('div');
    remains.className = 'collision-remains';
    remains.innerHTML = '<em>[What remains after philosophy forces words to mean together?]</em>';
    remains.style.cssText = `
      position: absolute;
      bottom: -3rem;
      left: 0;
      font-size: 0.7em;
      color: rgba(100, 100, 100, 0.6);
      font-style: italic;
      opacity: 0;
      transition: opacity 2s ease;
    `;
    element.appendChild(remains);
    
    setTimeout(() => {
      remains.style.opacity = '1';
    }, 500);
    
    // Some words try to return, but they're changed
    this.words.forEach((wordData, index) => {
      const word = wordData.element;
      const returnDelay = index * 0.2 + Math.random() * 0.5;
      
      setTimeout(() => {
        word.style.transition = 'all 2s ease-in-out';
        word.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg) scale(${0.9 + Math.random() * 0.2})`;
        word.style.opacity = '0.8';
        
        // Words bear the scars of having been forced into relation
        word.style.background = 'rgba(200, 200, 200, 0.1)';
        word.style.borderColor = 'rgba(150, 150, 150, 0.3)';
        
        wordData.scattered = false;
      }, returnDelay * 1000);
    });
    
    // Reset collision state but keep the traces
    setTimeout(() => {
      this.collisionActive = false;
      element.classList.remove('collision-active');
      
      // Final critique
      const finalCritique = document.createElement('div');
      finalCritique.innerHTML = '<small>[The violence of systematic philosophy performed]</small>';
      finalCritique.style.cssText = `
        position: absolute;
        bottom: -4.5rem;
        right: 0;
        font-size: 0.6em;
        color: rgba(80, 80, 80, 0.5);
        font-style: italic;
      `;
      element.appendChild(finalCritique);
    }, (this.words.length * 0.2 + 2) * 1000);
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
    
    // Set container defaults (can be overridden per voice)
    const containerSize = element.dataset.size || parameters.size || 'normal';
    const containerDelay = element.dataset.delay || parameters.delay || 'normal';
    const voiceMode = element.dataset.mode || parameters.mode || 'interrupt';
    
    // Apply voice mode to container for CSS styling
    element.classList.add(`voice-mode-${voiceMode}`);
    
    voiceSpans.forEach((span, index) => {
      const voice = span.dataset.voice;
      span.classList.add(`voice-${voice}`);
      
      // Process individual voice size (falls back to container default)
      const spanSize = span.dataset.size || containerSize;
      const voiceSize = this.processSizeParameter(spanSize);
      span.style.setProperty('--voice-size', voiceSize);
      
      // Process individual voice delay/duration (falls back to container default)
      const spanDelay = span.dataset.delay || containerDelay;
      const voiceDuration = this.processDelayParameter(spanDelay);
      span.style.setProperty('--voice-duration', voiceDuration);
      
      // Set staggered interrupt delay based on index, voice-specific timing, and mode
      const baseDelayMultiplier = this.getDelayMultiplier(spanDelay);
      const interruptDelay = this.calculateModeDelay(index, baseDelayMultiplier, voiceMode);
      span.style.setProperty('--interrupt-delay', `${interruptDelay}s`);
      
      // Support additional voice-specific parameters
      if (span.dataset.interrupts === 'true') {
        span.classList.add('voice-interrupt');
      }
      
      // Support intensity parameter for visual emphasis
      if (span.dataset.intensity) {
        span.style.setProperty('--voice-intensity', span.dataset.intensity);
      }
    });
  }
  
  calculateModeDelay(index, baseMultiplier, mode) {
    switch (mode) {
      case 'interrupt':
        // Voices interrupt in sequence
        return index * baseMultiplier;
        
      case 'overlap':
        // Voices overlap more, shorter delays
        return index * (baseMultiplier * 0.3);
        
      case 'argue':
        // Voices cluster and argue - alternating fast/slow pattern
        return index % 2 === 0 ? index * 0.1 : index * 0.6;
        
      case 'cascade':
        // Voices cascade rapidly
        return index * 0.2;
        
      case 'simultaneous':
        // All voices appear simultaneously
        return 0;
        
      default:
        return index * baseMultiplier;
    }
  }
  
  getDelayMultiplier(delay) {
    const multiplierMap = {
      'fast': 0.2,
      'normal': 0.5,
      'slow': 0.8,
      'very-slow': 1.2
    };
    
    // If it's a predefined delay, use the multiplier
    if (multiplierMap[delay]) {
      return multiplierMap[delay];
    }
    
    // For custom durations, extract numeric value and scale
    const match = delay.match(/^(\d*\.?\d+)/);
    if (match) {
      const duration = parseFloat(match[1]);
      return Math.max(0.1, duration / 6); // Scale to reasonable multiplier
    }
    
    return 0.5; // Default
  }
  
  processSizeParameter(size) {
    const sizeMap = {
      'small': '0.8em',
      'normal': '1em', 
      'large': '1.2em',
      'xl': '1.4em',
      'tiny': '0.6em'
    };
    
    // If it's a predefined size, use the map
    if (sizeMap[size]) {
      return sizeMap[size];
    }
    
    // If it's a custom CSS value (contains units), use as-is
    if (/^\d*\.?\d+(em|rem|px|%)$/.test(size)) {
      return size;
    }
    
    // Default fallback
    return '1em';
  }
  
  processDelayParameter(delay) {
    const delayMap = {
      'fast': '1.5s',
      'normal': '3s',
      'slow': '5s',
      'very-slow': '8s'
    };
    
    // If it's a predefined delay, use the map
    if (delayMap[delay]) {
      return delayMap[delay];
    }
    
    // If it's a custom CSS duration (contains 's' or 'ms'), use as-is
    if (/^\d*\.?\d+(s|ms)$/.test(delay)) {
      return delay;
    }
    
    // Default fallback
    return '3s';
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
    this.traces = new Map();
    this.readings = new Map();
  }

  initialize(element, parameters) {
    super.initialize(element, parameters);
    
    this.originalText = element.textContent.trim();
    this.setupTemporalContainer(element, parameters);
  }

  setupTemporalContainer(element, parameters) {
    element.classList.add('temporal-container');
    element.style.position = 'relative';
    element.style.overflow = 'visible';
    
    // Store reading start time
    this.readings.set(element, {
      startTime: Date.now(),
      hauntings: [],
      traces: []
    });
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    
    element.classList.add('deconstruct-temporal', 'temporal-active');
    
    // Performative critique: expose the fiction of linear reading time
    this.critiquePresentMoment(element, parameters);
    
    // Show how "now" is contaminated by "then" and "not yet"
    this.contaminatePresent(element, parameters);
    
    // Demonstrate impossible simultaneity of reading
    this.exposeReadingParadox(element, parameters);
  }

  critiquePresentMoment(element, parameters) {
    const readingData = this.readings.get(element);
    const originalText = this.originalText;
    
    // Add temporal critique annotations
    const nowCritique = document.createElement('div');
    nowCritique.className = 'temporal-now-critique';
    nowCritique.innerHTML = '<em>[You think you are reading this "now" - but when is "now"?]</em>';
    nowCritique.style.cssText = `
      position: absolute;
      top: -2rem;
      left: 0;
      font-size: 0.7em;
      color: rgba(120, 120, 120, 0.7);
      font-style: italic;
      opacity: 0;
      transition: opacity 2s ease;
    `;
    element.appendChild(nowCritique);
    
    // Gradually reveal the critique
    setTimeout(() => {
      nowCritique.style.opacity = '1';
    }, 1000);
    
    // Show reading start time
    setTimeout(() => {
      const timeStamp = new Date(readingData.startTime).toLocaleTimeString();
      const startCritique = document.createElement('span');
      startCritique.innerHTML = ` [Started reading at ${timeStamp} - but that "then" haunts this "now"]`;
      startCritique.style.cssText = `
        color: rgba(100, 100, 120, 0.6);
        font-size: 0.6em;
      `;
      nowCritique.appendChild(startCritique);
    }, 3000);
  }

  contaminatePresent(element, parameters) {
    const words = this.originalText.split(/\s+/);
    const sentences = this.originalText.split(/[.!?]+/).filter(s => s.trim());
    
    // Create contamination from "already read" (past)
    setTimeout(() => {
      const pastContamination = document.createElement('div');
      pastContamination.className = 'past-contamination';
      pastContamination.innerHTML = '<span style="text-decoration: line-through; opacity: 0.4;">' + 
        words.slice(0, Math.floor(words.length / 3)).join(' ') + 
        '</span><em> [words you already read but that linger in this moment]</em>';
      pastContamination.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        font-size: 0.8em;
        color: rgba(100, 100, 100, 0.6);
        margin-top: 1rem;
        opacity: 0;
        transition: opacity 2s ease;
      `;
      element.appendChild(pastContamination);
      
      setTimeout(() => pastContamination.style.opacity = '1', 500);
    }, 2000);
    
    // Create contamination from "not yet read" (future)
    setTimeout(() => {
      const futureContamination = document.createElement('div');
      futureContamination.className = 'future-contamination';
      futureContamination.innerHTML = '<em>[The words you haven\'t read yet are already changing this moment] </em>' +
        '<span style="color: rgba(120, 120, 120, 0.3);">' + 
        words.slice(Math.floor(words.length * 2/3)).join(' ') + '</span>';
      futureContamination.style.cssText = `
        position: absolute;
        bottom: 100%;
        right: 0;
        width: 70%;
        font-size: 0.7em;
        color: rgba(120, 120, 120, 0.5);
        margin-bottom: 1rem;
        text-align: right;
        opacity: 0;
        transition: opacity 2s ease;
      `;
      element.appendChild(futureContamination);
      
      setTimeout(() => futureContamination.style.opacity = '1', 500);
    }, 4000);
  }

  startTraceSystem(element, parameters) {
    let scrollTraces = [];
    
    const createScrollTrace = () => {
      const trace = element.cloneNode(true);
      trace.className = 'temporal-trace';
      trace.style.position = 'fixed';
      trace.style.opacity = '0.1';
      trace.style.pointerEvents = 'none';
      trace.style.zIndex = '-1';
      trace.style.transform = `translateY(${Math.random() * 20 - 10}px)`;
      
      const rect = element.getBoundingClientRect();
      trace.style.top = rect.top + 'px';
      trace.style.left = rect.left + 'px';
      trace.style.width = rect.width + 'px';
      
      document.body.appendChild(trace);
      scrollTraces.push(trace);
      
      // Fade out trace
      setTimeout(() => {
        trace.style.transition = 'opacity 2s ease-out';
        trace.style.opacity = '0';
        setTimeout(() => {
          if (trace.parentNode) trace.parentNode.removeChild(trace);
          const index = scrollTraces.indexOf(trace);
          if (index > -1) scrollTraces.splice(index, 1);
        }, 2000);
      }, 1000);
      
      // Limit number of traces
      if (scrollTraces.length > 5) {
        const oldTrace = scrollTraces.shift();
        if (oldTrace.parentNode) oldTrace.parentNode.removeChild(oldTrace);
      }
    };
    
    // Create traces on scroll
    const scrollHandler = () => {
      if (Math.random() < 0.3) createScrollTrace();
    };
    
    window.addEventListener('scroll', scrollHandler);
    this.traces.set(element, { scrollHandler, scrollTraces });
  }

  createSpectralTrace(element, text, type) {
    const spectral = document.createElement('span');
    spectral.className = `spectral-${type}`;
    spectral.textContent = text;
    spectral.style.cssText = `
      position: absolute;
      opacity: 0;
      pointer-events: none;
      color: rgba(128, 128, 128, 0.6);
      font-style: italic;
      transform: translateY(-20px);
      transition: all 3s ease-out;
      z-index: 1;
    `;
    
    // Random positioning near the element
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 100;
    spectral.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    element.appendChild(spectral);
    
    // Animate in
    requestAnimationFrame(() => {
      spectral.style.opacity = Math.random() * 0.7 + 0.2;
      spectral.style.transform += ` scale(${0.8 + Math.random() * 0.4})`;
    });
    
    // Remove after haunting
    setTimeout(() => {
      spectral.style.opacity = '0';
      spectral.style.transform += ' translateY(-40px)';
      setTimeout(() => {
        if (spectral.parentNode) spectral.parentNode.removeChild(spectral);
      }, 3000);
    }, 2000 + Math.random() * 3000);
  }

  exposeReadingParadox(element, parameters) {
    const readingData = this.readings.get(element);
    
    // Show the impossible simultaneity of reading
    const paradoxCritique = document.createElement('div');
    paradoxCritique.className = 'reading-paradox';
    paradoxCritique.innerHTML = `
      <em>[Reading paradox: You cannot read all words simultaneously, yet meaning requires their co-presence]</em>
    `;
    paradoxCritique.style.cssText = `
      position: absolute;
      bottom: -3rem;
      left: 0;
      font-size: 0.6em;
      color: rgba(100, 100, 100, 0.5);
      font-style: italic;
      opacity: 0;
      transition: opacity 1s ease;
    `;
    element.appendChild(paradoxCritique);
    
    setTimeout(() => paradoxCritique.style.opacity = '1', 3000);
    
    // Demonstrate temporal reading effects
    const timeInterval = setInterval(() => {
      const elapsed = Date.now() - readingData.startTime;
      const seconds = Math.floor(elapsed / 1000);
      
      // After 10 seconds, show time awareness
      if (elapsed > 10000 && !element.querySelector('.time-aware')) {
        const timeAware = document.createElement('span');
        timeAware.className = 'time-aware';
        timeAware.innerHTML = ` <em>[${seconds} seconds elapsed - each second changes the meaning]</em>`;
        timeAware.style.cssText = `
          color: rgba(120, 100, 100, 0.6);
          font-size: 0.7em;
          margin-left: 0.5em;
        `;
        element.appendChild(timeAware);
      }
      
      // After 20 seconds, show reading degradation
      if (elapsed > 20000) {
        element.style.opacity = Math.max(0.7, 1 - (elapsed - 20000) / 100000);
        
        if (!element.querySelector('.degradation-notice')) {
          const notice = document.createElement('div');
          notice.className = 'degradation-notice';
          notice.innerHTML = '<small>[This text is aging while you read it - meaning decays over time]</small>';
          notice.style.cssText = `
            position: absolute;
            bottom: -4rem;
            right: 0;
            font-size: 0.5em;
            color: rgba(80, 80, 80, 0.4);
            font-style: italic;
          `;
          element.appendChild(notice);
        }
      }
      
      // Update time counter
      const timeAware = element.querySelector('.time-aware');
      if (timeAware) {
        timeAware.innerHTML = ` <em>[${seconds} seconds elapsed - the "now" of reading keeps slipping away]</em>`;
      }
    }, 1000);
    
    this.intervals.set(element, timeInterval);
  }

  addTemporalAnnotation(element, annotation) {
    const note = document.createElement('span');
    note.className = 'temporal-annotation';
    note.textContent = `[${annotation}]`;
    note.style.cssText = `
      font-size: 0.8em;
      color: rgba(100, 100, 100, 0.7);
      font-style: italic;
      margin-left: 0.5em;
    `;
    
    element.appendChild(note);
  }

  getSpeedInterval(speed) {
    const intervals = {
      slow: 3000,
      medium: 1500,
      fast: 800
    };
    return intervals[speed] || intervals.medium;
  }

  deactivate(element) {
    super.deactivate(element);
    
    if (this.intervals.has(element)) {
      clearInterval(this.intervals.get(element));
      this.intervals.delete(element);
    }
    
    if (this.traces.has(element)) {
      const traceData = this.traces.get(element);
      window.removeEventListener('scroll', traceData.scrollHandler);
      traceData.scrollTraces.forEach(trace => {
        if (trace.parentNode) trace.parentNode.removeChild(trace);
      });
      this.traces.delete(element);
    }
  }
}

/**
 * Syntactic Breakdown Effect - Grammar dissolution
 */
class SyntaxEffect extends BaseEffect {
  constructor(config, logger) {
    super(config, logger);
    this.intervals = new Map();
    this.originalStructures = new Map();
  }

  initialize(element, parameters) {
    super.initialize(element, parameters);
    
    this.originalText = element.textContent.trim();
    this.setupSyntaxDeconstruction(element, parameters);
  }

  setupSyntaxDeconstruction(element, parameters) {
    const chaos = parameters.chaos || 'medium';
    const preserve = parameters.preserve || 'none';
    
    element.classList.add('syntax-container');
    element.style.position = 'relative';
    
    // Store original for reference
    this.originalStructures.set(element, {
      text: this.originalText,
      chaos: chaos,
      preserve: preserve,
      words: this.originalText.split(/\s+/),
      sentences: this.originalText.split(/[.!?]+/).filter(s => s.trim()),
      clauses: this.originalText.split(/[,;:]+/)
    });
  }

  activate(element, parameters) {
    super.activate(element, parameters);
    element.classList.add('deconstruct-syntax', 'syntax-active');
    
    const structure = this.originalStructures.get(element);
    this.startSyntaxBreakdown(element, structure);
  }

  startSyntaxBreakdown(element, structure) {
    const chaosLevel = this.getChaosLevel(structure.chaos);
    
    // Phase 1: Punctuation Migration
    this.migratePunctuation(element, structure);
    
    // Phase 2: Word Order Disruption
    setTimeout(() => {
      this.disruptWordOrder(element, structure, chaosLevel);
    }, 1000);
    
    // Phase 3: Grammatical Dissolution
    setTimeout(() => {
      this.dissolveGrammar(element, structure, chaosLevel);
    }, 2500);
    
    // Phase 4: Linguistic Fragmentation
    setTimeout(() => {
      this.fragmentLanguage(element, structure, chaosLevel);
    }, 4000);
  }

  migratePunctuation(element, structure) {
    // Extract punctuation and make it wander
    const punctuationMarks = this.originalText.match(/[.!?;:,]/g) || [];
    let textWithoutPunct = this.originalText.replace(/[.!?;:,]/g, '');
    
    element.innerHTML = textWithoutPunct;
    
    // Add floating punctuation
    punctuationMarks.forEach((mark, index) => {
      setTimeout(() => {
        const floatingMark = document.createElement('span');
        floatingMark.className = 'floating-punctuation';
        floatingMark.textContent = mark;
        floatingMark.style.cssText = `
          position: absolute;
          transition: all 2s ease-in-out;
          color: rgba(150, 50, 50, 0.8);
          font-size: 1.2em;
          pointer-events: none;
          z-index: 2;
        `;
        
        // Random starting position
        const randomX = Math.random() * 300 - 150;
        const randomY = Math.random() * 200 - 100;
        floatingMark.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
        
        element.appendChild(floatingMark);
        
        // Animate punctuation drift
        const drift = () => {
          const newX = (Math.random() - 0.5) * 400;
          const newY = (Math.random() - 0.5) * 300;
          const newRotation = Math.random() * 720 - 360;
          floatingMark.style.transform = `translate(${newX}px, ${newY}px) rotate(${newRotation}deg) scale(${0.5 + Math.random()})`;
          floatingMark.style.opacity = Math.random() * 0.8 + 0.2;
        };
        
        const driftInterval = setInterval(drift, 2000);
        
        // Store interval for cleanup
        const intervals = this.intervals.get(element) || [];
        intervals.push(driftInterval);
        this.intervals.set(element, intervals);
      }, index * 300);
    });
  }

  disruptWordOrder(element, structure, chaosLevel) {
    const words = structure.words.slice(); // Copy array
    const disruptedWords = [];
    
    // Different disruption patterns based on chaos level
    switch (chaosLevel) {
      case 'low':
        // Gentle reordering - swap adjacent pairs
        for (let i = 0; i < words.length - 1; i += 2) {
          disruptedWords.push(words[i + 1] || words[i]);
          disruptedWords.push(words[i]);
        }
        break;
        
      case 'medium':
        // Moderate scrambling - reverse clauses
        const clauses = this.originalText.split(/[,;:]/);
        const reversedClauses = clauses.map(clause => {
          return clause.trim().split(/\s+/).reverse().join(' ');
        });
        element.textContent = reversedClauses.join(' / ');
        return;
        
      case 'high':
        // Complete randomization
        const shuffled = words.sort(() => Math.random() - 0.5);
        element.textContent = shuffled.join(' ');
        return;
    }
    
    if (disruptedWords.length > 0) {
      element.textContent = disruptedWords.join(' ');
    }
  }

  dissolveGrammar(element, structure, chaosLevel) {
    let text = element.textContent;
    
    // Remove grammatical connectors
    const connectors = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    connectors.forEach(connector => {
      if (structure.preserve !== 'structure') {
        const regex = new RegExp(`\\b${connector}\\b`, 'gi');
        text = text.replace(regex, `<span class="dissolved">${connector}</span>`);
      }
    });
    
    element.innerHTML = text;
    
    // Animate dissolved words
    element.querySelectorAll('.dissolved').forEach((word, index) => {
      setTimeout(() => {
        word.style.transition = 'all 1s ease-out';
        word.style.opacity = '0.3';
        word.style.fontSize = '0.7em';
        word.style.textDecoration = 'line-through';
        word.style.color = '#888';
      }, index * 200);
    });
  }

  fragmentLanguage(element, structure, chaosLevel) {
    const text = element.textContent;
    const fragments = [];
    
    // Break text into overlapping fragments
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length - 2; i += 2) {
      const fragment = words.slice(i, i + 3).join(' ');
      fragments.push(fragment);
    }
    
    // Clear and rebuild with fragments
    element.innerHTML = '';
    
    fragments.forEach((fragment, index) => {
      const fragmentSpan = document.createElement('span');
      fragmentSpan.className = 'language-fragment';
      fragmentSpan.textContent = fragment;
      fragmentSpan.style.cssText = `
        display: inline-block;
        margin: 0.2em;
        padding: 0.1em 0.3em;
        background: rgba(200, 200, 200, 0.1);
        border: 1px solid rgba(150, 150, 150, 0.3);
        border-radius: 3px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.5s ease;
      `;
      
      element.appendChild(fragmentSpan);
      
      // Staggered appearance
      setTimeout(() => {
        fragmentSpan.style.opacity = '0.8';
        fragmentSpan.style.transform = 'translateY(0)';
      }, index * 300);
      
      // Random repositioning
      setTimeout(() => {
        const randomX = (Math.random() - 0.5) * 50;
        const randomY = (Math.random() - 0.5) * 30;
        fragmentSpan.style.transform = `translate(${randomX}px, ${randomY}px)`;
      }, 2000 + index * 300);
    });
  }

  getChaosLevel(chaos) {
    const levels = {
      low: 'low',
      medium: 'medium', 
      high: 'high'
    };
    return levels[chaos] || 'medium';
  }

  deactivate(element) {
    super.deactivate(element);
    
    if (this.intervals.has(element)) {
      const intervals = this.intervals.get(element);
      intervals.forEach(interval => clearInterval(interval));
      this.intervals.delete(element);
    }
    
    // Restore original text
    const structure = this.originalStructures.get(element);
    if (structure) {
      element.textContent = structure.text;
      this.originalStructures.delete(element);
    }
  }
}


// Expose class globally for system access
window.DeconstructionProcessor = DeconstructionProcessor;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeconstructionProcessor;
}