/**
 * Content Enhancement System - Enhancement Manager
 * Orchestrates multiple content processors for rich, interactive content
 * 
 * Philosophy: Maintains simple Ghost editor workflow while providing
 * sophisticated content enhancement through modular processors
 * 
 * Created: August 23, 2025
 */

class ContentEnhancementManager {
  constructor(config = null) {
    console.log('[ENHANCEMENT_MANAGER] Initializing modular content enhancement system');
    
    // Initialize configuration manager
    this.configManager = new ConfigurationManager(config);
    this.config = null; // Will be set after initialization
    
    // Find container
    this.container = null;
    
    // Processor registry
    this.processors = new Map();
    this.processorOrder = []; // Order of processing
    
    // System state
    this.initialized = false;
    this.processed = false;
    
    // Statistics tracking
    this.statistics = {
      startTime: null,
      endTime: null,
      totalProcessors: 0,
      successfulProcessors: 0,
      failedProcessors: 0,
      totalProcessedItems: 0,
      errors: []
    };
  }

  /**
   * Initialize the content enhancement system
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('[ENHANCEMENT_MANAGER] Starting system initialization...');
      this.statistics.startTime = performance.now();

      // Initialize configuration manager
      if (!this.configManager.init()) {
        throw new Error('Configuration manager initialization failed');
      }

      // Get unified configuration
      this.config = this.configManager.config;

      // Find container element
      this.container = document.querySelector(this.config.global?.container || '.post-content, .page-content');
      if (!this.container) {
        console.warn('[ENHANCEMENT_MANAGER] Container not found - system will not process content');
        return false;
      }

      // Register and initialize default processors
      await this.registerDefaultProcessors();

      // Initialize all processors
      await this.initializeProcessors();

      this.initialized = true;
      console.log(`[ENHANCEMENT_MANAGER] System initialized successfully with ${this.processors.size} processors`);
      return true;

    } catch (error) {
      console.error('[ENHANCEMENT_MANAGER] System initialization failed:', error);
      this.statistics.errors.push({
        phase: 'initialization',
        error: error.message,
        timestamp: performance.now()
      });
      return false;
    }
  }

  /**
   * Register default processors based on configuration and feature flags
   * UPDATED PROCESSING ORDER: Deconstruction → Footnotes → Marginalia → Extensions
   * @private
   */
  async registerDefaultProcessors() {
    const flags = window.CONTENT_ENHANCEMENT_FLAGS || {};
    
    // Register deconstruction processor FIRST - establishes unstable textual foundation
    // Check multiple config sources for deconstruction enablement
    const deconstructionEnabled = flags.ENABLE_DECONSTRUCTION === true || 
                                 this.config?.features?.deconstruction === true ||
                                 window.ghost_custom_settings?.enable_deconstruction === true;
    
    console.log('[ENHANCEMENT_MANAGER] Deconstruction check:', {
      legacyFlag: flags.ENABLE_DECONSTRUCTION,
      configFeature: this.config?.features?.deconstruction,
      ghostSetting: window.ghost_custom_settings?.enable_deconstruction,
      finalDecision: deconstructionEnabled
    });
    
    if (deconstructionEnabled) {
      console.log('[ENHANCEMENT_MANAGER] Registering deconstruction processor (FIRST - radical base layer)');
      try {
        if (typeof DeconstructionProcessor !== 'undefined') {
          await this.registerProcessor('deconstruction', DeconstructionProcessor);
          console.log('[ENHANCEMENT_MANAGER] ✅ Deconstruction processor registered successfully');
        } else {
          console.warn('[ENHANCEMENT_MANAGER] ⚠️ DeconstructionProcessor class not available');
        }
      } catch (error) {
        console.error('[ENHANCEMENT_MANAGER] ❌ Deconstruction processor registration failed:', error);
      }
    } else {
      console.log('[ENHANCEMENT_MANAGER] Deconstruction processor disabled');
    }
    
    // Register footnote processor SECOND (moved up in order)
    if (flags.USE_LEGACY_FOOTNOTES !== false) {
      console.log('[ENHANCEMENT_MANAGER] Using legacy footnote system');
      // Legacy system handled separately - don't register footnote processor
    } else {
      console.log('[ENHANCEMENT_MANAGER] Registering modern footnote processor (SECOND)');
      try {
        if (typeof FootnoteProcessor !== 'undefined') {
          await this.registerProcessor('footnotes', FootnoteProcessor);
          console.log('[ENHANCEMENT_MANAGER] ✅ Footnote processor registered successfully');
        } else {
          console.warn('[ENHANCEMENT_MANAGER] ⚠️ FootnoteProcessor class not available');
        }
      } catch (error) {
        console.error('[ENHANCEMENT_MANAGER] ❌ Footnote processor registration failed:', error);
      }
    }
    
    // Register marginalia processor THIRD - comments on deconstructed and footnoted text
    console.log('[ENHANCEMENT_MANAGER] Checking marginalia registration...', {
      ENABLE_MARGINALIA: flags.ENABLE_MARGINALIA,
      condition: flags.ENABLE_MARGINALIA !== false,
      MarginaliaProcessor: typeof MarginaliaProcessor
    });
    
    if (flags.ENABLE_MARGINALIA !== false) {
      console.log('[ENHANCEMENT_MANAGER] Registering marginalia processor (THIRD - comments on processed text)');
      try {
        if (typeof MarginaliaProcessor !== 'undefined') {
          await this.registerProcessor('marginalia', MarginaliaProcessor);
          console.log('[ENHANCEMENT_MANAGER] ✅ Marginalia processor registered successfully');
        } else {
          console.warn('[ENHANCEMENT_MANAGER] ⚠️ MarginaliaProcessor class not available');
        }
      } catch (error) {
        console.error('[ENHANCEMENT_MANAGER] ❌ Marginalia processor registration failed:', error);
      }
    } else {
      console.log('[ENHANCEMENT_MANAGER] Marginalia processor disabled');
    }
    
    // Register extension processor FOURTH (LAST) if enabled
    if (flags.ENABLE_EXTENSIONS === true) {
      console.log('[ENHANCEMENT_MANAGER] Registering paragraph extension processor (FOURTH - final layer)');
      try {
        if (typeof ParagraphExtensionProcessor !== 'undefined') {
          await this.registerProcessor('extensions', ParagraphExtensionProcessor);
          console.log('[ENHANCEMENT_MANAGER] ✅ Extension processor registered successfully');
        } else {
          console.warn('[ENHANCEMENT_MANAGER] ⚠️ ParagraphExtensionProcessor class not available');
        }
      } catch (error) {
        console.error('[ENHANCEMENT_MANAGER] ❌ Extension processor registration failed:', error);
      }
    }

    // Future processors can be added here based on feature flags
    // Processing order matters for DOM manipulation!
    // if (flags.ENABLE_MARGINALIA === true) {
    //   await this.registerProcessor('marginalia', MarginaliaProcessor);
    // }
  }

  /**
   * Register a content processor
   * @param {string} name - Processor name
   * @param {Function} ProcessorClass - Processor constructor
   * @returns {Promise<boolean>} Success status
   */
  async registerProcessor(name, ProcessorClass) {
    try {
      if (this.processors.has(name)) {
        console.warn(`[ENHANCEMENT_MANAGER] Processor '${name}' already registered - skipping`);
        return false;
      }

      // Get processor-specific configuration
      const processorConfig = this.configManager.getProcessorConfig(name);
      
      // Create processor instance
      const processor = new ProcessorClass(processorConfig, this.container);
      
      // Store processor
      this.processors.set(name, processor);
      this.processorOrder.push(name);
      
      // Register with configuration manager
      this.configManager.registerProcessor(name, processor);
      
      console.log(`[ENHANCEMENT_MANAGER] Registered processor: ${name}`);
      return true;

    } catch (error) {
      console.error(`[ENHANCEMENT_MANAGER] Failed to register processor '${name}':`, error);
      this.statistics.errors.push({
        phase: 'registration',
        processor: name,
        error: error.message,
        timestamp: performance.now()
      });
      return false;
    }
  }

  /**
   * Initialize all registered processors
   * @private
   */
  async initializeProcessors() {
    console.log(`[ENHANCEMENT_MANAGER] Initializing ${this.processors.size} processors...`);
    
    for (const [name, processor] of this.processors) {
      try {
        console.log(`[ENHANCEMENT_MANAGER] Initializing processor: ${name}`);
        const success = await processor.init();
        
        if (success) {
          this.statistics.successfulProcessors++;
          console.log(`[ENHANCEMENT_MANAGER] ✅ Processor '${name}' initialized successfully`);
        } else {
          this.statistics.failedProcessors++;
          console.error(`[ENHANCEMENT_MANAGER] ❌ Processor '${name}' initialization failed`);
        }
      } catch (error) {
        this.statistics.failedProcessors++;
        console.error(`[ENHANCEMENT_MANAGER] ❌ Processor '${name}' initialization threw error:`, error);
        this.statistics.errors.push({
          phase: 'processor_initialization',
          processor: name,
          error: error.message,
          timestamp: performance.now()
        });
      }
    }
    
    this.statistics.totalProcessors = this.processors.size;
    console.log(`[ENHANCEMENT_MANAGER] Processor initialization complete: ${this.statistics.successfulProcessors}/${this.statistics.totalProcessors} successful`);
  }

  /**
   * Process all content with registered processors
   * @param {boolean} force - Force reprocessing even if already processed
   * @returns {Promise<boolean>} Success status
   */
  async processContent(force = false) {
    if (!this.initialized) {
      console.error('[ENHANCEMENT_MANAGER] System not initialized - call initialize() first');
      return false;
    }

    if (this.processed && !force) {
      console.warn('[ENHANCEMENT_MANAGER] Content already processed - skipping (use force=true to override)');
      return true;
    }

    if (force) {
      console.log('[ENHANCEMENT_MANAGER] 🔄 Force reprocessing content...');
      this.processed = false; // Reset processed flag
    }

    try {
      console.log('[ENHANCEMENT_MANAGER] Starting content processing...');
      
      // Process with each registered processor in order
      for (const processorName of this.processorOrder) {
        const processor = this.processors.get(processorName);
        
        if (!processor) {
          console.error(`[ENHANCEMENT_MANAGER] Processor '${processorName}' not found`);
          continue;
        }

        try {
          console.log(`[ENHANCEMENT_MANAGER] Processing with: ${processorName}`);
          await processor.process();
          
          // Collect statistics
          const processorStats = processor.getStats();
          this.statistics.totalProcessedItems += processorStats.processed || 0;
          
          console.log(`[ENHANCEMENT_MANAGER] ✅ Processor '${processorName}' completed successfully`);
        } catch (error) {
          console.error(`[ENHANCEMENT_MANAGER] ❌ Processor '${processorName}' failed:`, error);
          this.statistics.errors.push({
            phase: 'processing',
            processor: processorName,
            error: error.message,
            timestamp: performance.now()
          });
          // Continue with other processors even if one fails
        }
      }

      this.processed = true;
      this.statistics.endTime = performance.now();
      
      console.log(`[ENHANCEMENT_MANAGER] Content processing completed: ${this.statistics.totalProcessedItems} items processed`);
      return true;

    } catch (error) {
      console.error('[ENHANCEMENT_MANAGER] Content processing failed:', error);
      this.statistics.errors.push({
        phase: 'processing',
        error: error.message,
        timestamp: performance.now()
      });
      return false;
    }
  }

  /**
   * Get processor by name
   * @param {string} name - Processor name
   * @returns {ContentProcessor|null} Processor instance
   */
  getProcessor(name) {
    return this.processors.get(name) || null;
  }

  /**
   * Get configuration manager
   * @returns {ConfigurationManager} Configuration manager instance
   */
  getConfigurationManager() {
    return this.configManager;
  }

  /**
   * Update configuration at runtime
   * @param {string} path - Configuration path
   * @param {*} value - New value
   * @returns {boolean} Success status
   */
  updateConfiguration(path, value) {
    const success = this.configManager.updateConfig(path, value);
    
    if (success) {
      console.log(`[ENHANCEMENT_MANAGER] Configuration updated: ${path} = ${value}`);
      // Notify processors of config change if needed
      this.notifyProcessorsOfConfigChange(path, value);
    }
    
    return success;
  }

  /**
   * Notify processors of configuration changes
   * @param {string} path - Configuration path
   * @param {*} value - New value
   * @private
   */
  notifyProcessorsOfConfigChange(path, value) {
    // Extract processor name from path
    const pathParts = path.split('.');
    if (pathParts[0] === 'processors' && pathParts[1]) {
      const processorName = pathParts[1];
      const processor = this.getProcessor(processorName);
      
      if (processor && typeof processor.onConfigChange === 'function') {
        processor.onConfigChange(path, value);
      }
    } else if (pathParts[0] === 'global') {
      // Global config change - notify all processors
      this.processors.forEach((processor, name) => {
        if (typeof processor.onConfigChange === 'function') {
          processor.onConfigChange(path, value);
        }
      });
    }
  }

  /**
   * Apply theme to all processors
   * @param {string} themeName - Theme name
   */
  applyTheme(themeName) {
    console.log(`[ENHANCEMENT_MANAGER] Applying theme: ${themeName}`);
    
    // Apply theme through configuration manager
    this.configManager.applyTheme(themeName);
    
    // Notify processors that might need to update their styling
    this.processors.forEach((processor, name) => {
      if (typeof processor.onThemeChange === 'function') {
        processor.onThemeChange(themeName);
      }
    });
  }

  /**
   * Clean up all processors and system resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    console.log('[ENHANCEMENT_MANAGER] Starting system cleanup...');
    
    // Cleanup all processors in reverse order
    const reverseOrder = [...this.processorOrder].reverse();
    
    for (const processorName of reverseOrder) {
      const processor = this.processors.get(processorName);
      
      if (processor) {
        try {
          console.log(`[ENHANCEMENT_MANAGER] Cleaning up processor: ${processorName}`);
          await processor.cleanup();
        } catch (error) {
          console.error(`[ENHANCEMENT_MANAGER] Cleanup failed for processor '${processorName}':`, error);
        }
      }
    }

    // Clear internal state
    this.processors.clear();
    this.processorOrder = [];
    this.initialized = false;
    this.processed = false;

    console.log('[ENHANCEMENT_MANAGER] System cleanup completed');
  }

  /**
   * Get comprehensive system statistics
   * @returns {Object} System statistics
   */
  getSystemStats() {
    const processingTime = this.statistics.endTime 
      ? this.statistics.endTime - this.statistics.startTime 
      : null;
    
    const processorStats = {};
    this.processors.forEach((processor, name) => {
      processorStats[name] = processor.getStats();
    });

    return {
      // System-level stats
      initialized: this.initialized,
      processed: this.processed,
      processingTime,
      
      // Processor stats
      totalProcessors: this.statistics.totalProcessors,
      successfulProcessors: this.statistics.successfulProcessors,
      failedProcessors: this.statistics.failedProcessors,
      processorOrder: [...this.processorOrder],
      
      // Content stats
      totalProcessedItems: this.statistics.totalProcessedItems,
      
      // Error tracking
      errorCount: this.statistics.errors.length,
      errors: [...this.statistics.errors],
      
      // Individual processor stats
      processors: processorStats,
      
      // Configuration info
      configuration: this.configManager.debug()
    };
  }

  /**
   * Debug information
   */
  debug() {
    console.group('[ENHANCEMENT_MANAGER] System Debug Information');
    
    const stats = this.getSystemStats();
    console.log('System Stats:', stats);
    
    console.log('Container:', this.container);
    console.log('Configuration Manager:', this.configManager);
    console.log('Registered Processors:', Array.from(this.processors.keys()));
    
    if (this.statistics.errors.length > 0) {
      console.group('Errors:');
      this.statistics.errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.phase}] ${error.error}`, error);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }

  /**
   * Check system health
   * @returns {Object} Health check results
   */
  healthCheck() {
    const health = {
      status: 'healthy',
      issues: [],
      recommendations: []
    };

    // Check if system is initialized
    if (!this.initialized) {
      health.status = 'unhealthy';
      health.issues.push('System not initialized');
      health.recommendations.push('Call initialize() method');
    }

    // Check if container exists
    if (!this.container) {
      health.status = 'warning';
      health.issues.push('No container element found');
      health.recommendations.push('Ensure container element exists in DOM');
    }

    // Check processor failure rate
    if (this.statistics.totalProcessors > 0) {
      const failureRate = this.statistics.failedProcessors / this.statistics.totalProcessors;
      if (failureRate > 0.5) {
        health.status = 'unhealthy';
        health.issues.push(`High processor failure rate: ${Math.round(failureRate * 100)}%`);
        health.recommendations.push('Check processor configurations and dependencies');
      } else if (failureRate > 0) {
        health.status = 'warning';
        health.issues.push(`Some processors failed: ${this.statistics.failedProcessors}/${this.statistics.totalProcessors}`);
      }
    }

    // Check for errors
    if (this.statistics.errors.length > 0) {
      if (health.status === 'healthy') {
        health.status = 'warning';
      }
      health.issues.push(`${this.statistics.errors.length} errors recorded`);
      health.recommendations.push('Check error log for details');
    }

    return health;
  }
}

/**
 * UNIFIED INITIALIZATION SYSTEM
 * Single initialization point for all content enhancement processors
 * Eliminates race conditions from multiple DOMContentLoaded listeners
 */
function initializeContentEnhancement() {
  // Prevent multiple initialization
  if (window.ContentEnhancementSystem) {
    console.log('[ENHANCEMENT_MANAGER] System already initialized - skipping');
    return;
  }
  
  const container = document.querySelector('.post-content, .page-content');
  if (!container) {
    console.warn('[ENHANCEMENT_MANAGER] No content container found - skipping initialization');
    return;
  }
  
  console.log('[ENHANCEMENT_MANAGER] 🚀 Initializing unified content enhancement system');
  
  // Create single system instance
  window.ContentEnhancementSystem = new ContentEnhancementManager();
  
  // Initialize all processors and process content
  window.ContentEnhancementSystem.initialize()
    .then(success => {
      if (success) {
        return window.ContentEnhancementSystem.processContent();
      }
      return false;
    })
    .then(success => {
      if (success) {
        console.log('[ENHANCEMENT_MANAGER] ✅ Content enhancement system initialized successfully');
      } else {
        console.error('[ENHANCEMENT_MANAGER] ❌ Content enhancement system failed');
      }
    })
    .catch(error => {
      console.error('[ENHANCEMENT_MANAGER] ❌ Content enhancement system error:', error);
    });
  
  // Make debug functions available globally
  window.debugContentEnhancement = () => {
    if (window.ContentEnhancementSystem) {
      window.ContentEnhancementSystem.debug();
    } else {
      console.warn('Content enhancement system not initialized');
    }
  };
  
  window.contentEnhancementHealth = () => {
    if (window.ContentEnhancementSystem) {
      return window.ContentEnhancementSystem.healthCheck();
    }
    return { status: 'not_initialized' };
  };
}

/**
 * SINGLE INITIALIZATION POINT
 * Run immediately if DOM ready, otherwise wait for DOMContentLoaded
 * This replaces all individual DOMContentLoaded listeners across the system
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentEnhancement);
} else {
  // DOM already loaded, run immediately
  initializeContentEnhancement();
}

// Expose class globally for system access
window.ContentEnhancementManager = ContentEnhancementManager;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentEnhancementManager;
}