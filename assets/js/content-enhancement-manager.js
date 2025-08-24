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
   * IMPORTANT: Extensions MUST process BEFORE footnotes to avoid breaking footnote tooltips
   * @private
   */
  async registerDefaultProcessors() {
    const flags = window.CONTENT_ENHANCEMENT_FLAGS || {};
    
    // Register extension processor FIRST if enabled
    // This prevents breaking footnote event listeners
    if (flags.ENABLE_EXTENSIONS === true) {
      console.log('[ENHANCEMENT_MANAGER] Registering paragraph extension processor (FIRST - to preserve footnote functionality)');
      await this.registerProcessor('extensions', ParagraphExtensionProcessor);
    }
    
    // Register footnote processor AFTER extensions
    if (flags.USE_LEGACY_FOOTNOTES !== false) {
      console.log('[ENHANCEMENT_MANAGER] Using legacy footnote system');
      // Legacy system handled separately - don't register footnote processor
    } else {
      console.log('[ENHANCEMENT_MANAGER] Registering modern footnote processor (AFTER extensions)');
      await this.registerProcessor('footnotes', FootnoteProcessor);
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
   * @returns {Promise<boolean>} Success status
   */
  async processContent() {
    if (!this.initialized) {
      console.error('[ENHANCEMENT_MANAGER] System not initialized - call initialize() first');
      return false;
    }

    if (this.processed) {
      console.warn('[ENHANCEMENT_MANAGER] Content already processed - skipping');
      return true;
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

// Auto-initialize system IMMEDIATELY when extensions are enabled to process before legacy footnote system
function initializeExtensionsEarly() {
  const flags = window.CONTENT_ENHANCEMENT_FLAGS || {};
  
  // If extensions are enabled, process IMMEDIATELY to avoid footnote conflicts
  if (flags.ENABLE_EXTENSIONS === true) {
    const container = document.querySelector('.post-content, .page-content');
    
    if (container) {
      console.log('[ENHANCEMENT_MANAGER] EARLY initialization for extensions (to preserve footnote tooltips)');
      
      window.ContentEnhancementSystem = new ContentEnhancementManager();
      
      // Initialize and process content immediately
      window.ContentEnhancementSystem.initialize()
        .then(success => {
          if (success) {
            return window.ContentEnhancementSystem.processContent();
          }
          return false;
        })
        .then(success => {
          if (success) {
            console.log('[ENHANCEMENT_MANAGER] EARLY extension processing completed - footnote tooltips should work');
          } else {
            console.error('[ENHANCEMENT_MANAGER] Early extension processing failed');
          }
        })
        .catch(error => {
          console.error('[ENHANCEMENT_MANAGER] Early extension processing error:', error);
        });

      // Make debug functions available globally
      window.debugContentEnhancement = () => {
        if (window.ContentEnhancementSystem) {
          window.ContentEnhancementSystem.debug();
        }
      };

      window.contentEnhancementHealth = () => {
        if (window.ContentEnhancementSystem) {
          return window.ContentEnhancementSystem.healthCheck();
        }
        return { status: 'not_initialized' };
      };
    }
  }
}

// Run immediately if DOM already loaded, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtensionsEarly);
} else {
  // DOM already loaded, run immediately
  initializeExtensionsEarly();
}

// Also auto-initialize modern footnote system when legacy is disabled
document.addEventListener('DOMContentLoaded', () => {
  const flags = window.CONTENT_ENHANCEMENT_FLAGS || {};
  
  // Only initialize modern footnotes if legacy is disabled and extensions haven't already initialized
  if (flags.USE_LEGACY_FOOTNOTES === false && !window.ContentEnhancementSystem) {
    const container = document.querySelector('.post-content, .page-content');
    
    if (container) {
      console.log('[ENHANCEMENT_MANAGER] Auto-initializing modern footnote system');
      
      window.ContentEnhancementSystem = new ContentEnhancementManager();
      
      // Initialize and process content
      window.ContentEnhancementSystem.initialize()
        .then(success => {
          if (success) {
            return window.ContentEnhancementSystem.processContent();
          }
          return false;
        })
        .then(success => {
          if (success) {
            console.log('[ENHANCEMENT_MANAGER] Modern footnote system initialized successfully');
          } else {
            console.error('[ENHANCEMENT_MANAGER] Modern footnote system initialization failed');
          }
        })
        .catch(error => {
          console.error('[ENHANCEMENT_MANAGER] Modern footnote system error:', error);
        });
    }
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentEnhancementManager;
}