/**
 * ThemeSystemCoordinator - Central system management
 * 
 * Implementation of the architectural plan from ARCHITECTURAL_OVERHAUL_PLAN.md
 * Provides single source of truth for system management with health monitoring
 * 
 * Created: August 27, 2025
 * Based on: ARCHITECTURAL_OVERHAUL_PLAN.md
 */

class ThemeSystemCoordinator {
  constructor() {
    this.name = 'ThemeSystemCoordinator';
    this.version = '1.0.0';
    this.systems = new Map();
    this.healthMonitor = new HealthMonitor();
    this.layerManager = new LayerManager();
    this.eventBus = new EventBus();
    this.cssManager = new CSSManager();
    this.initialized = false;
    
    console.log(`🚀 ${this.name} v${this.version} created`);
  }

  /**
   * Register a system with health checks
   * @param {string} name - System name
   * @param {Object} system - System instance
   * @param {Function} healthCheck - Health check function
   * @returns {boolean} Success status
   */
  registerSystem(name, system, healthCheck) {
    try {
      if (this.systems.has(name)) {
        console.warn(`⚠️ System '${name}' already registered - skipping`);
        return false;
      }

      this.systems.set(name, { 
        system, 
        healthCheck, 
        healthy: false,
        lastHealthCheck: null,
        errors: []
      });
      
      this.healthMonitor.addCheck(name, healthCheck);
      console.log(`✅ Registered system: ${name}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to register system '${name}':`, error);
      return false;
    }
  }

  /**
   * Initialize all systems safely with health monitoring
   * @returns {Promise<boolean>} Overall success status
   */
  async initialize() {
    if (this.initialized) {
      console.log('⚠️ ThemeSystemCoordinator already initialized');
      return true;
    }

    console.log('🔄 Initializing ThemeSystemCoordinator...');
    
    try {
      // Run health checks first
      const healthResults = await this.healthMonitor.runAllChecks();
      
      let successCount = 0;
      let totalSystems = this.systems.size;
      
      // Initialize systems that passed health checks
      for (const [name, healthResult] of healthResults) {
        const systemInfo = this.systems.get(name);
        
        if (healthResult.healthy) {
          try {
            if (systemInfo.system.initialize) {
              await systemInfo.system.initialize();
            }
            
            systemInfo.healthy = true;
            systemInfo.lastHealthCheck = new Date();
            successCount++;
            
            console.log(`✅ ${name} initialized successfully`);
            
          } catch (error) {
            console.error(`❌ ${name} initialization failed:`, error);
            systemInfo.healthy = false;
            systemInfo.errors.push({
              phase: 'initialization',
              error: error.message,
              timestamp: new Date()
            });
          }
        } else {
          console.error(`❌ ${name} failed health check:`, healthResult.error);
          systemInfo.healthy = false;
          systemInfo.errors.push({
            phase: 'health_check',
            error: healthResult.error,
            timestamp: new Date()
          });
        }
      }
      
      this.initialized = true;
      
      console.log(`🎉 ThemeSystemCoordinator initialized: ${successCount}/${totalSystems} systems healthy`);
      
      // Emit initialization complete event
      this.eventBus.emit('coordinator:initialized', {
        successCount,
        totalSystems,
        healthySystems: Array.from(this.systems.entries())
          .filter(([_, info]) => info.healthy)
          .map(([name]) => name)
      });
      
      return successCount > 0;
      
    } catch (error) {
      console.error('❌ ThemeSystemCoordinator initialization failed:', error);
      return false;
    }
  }

  /**
   * Request temporary exclusive mode (disable other interactions)
   * @param {string} systemName - Name of requesting system
   * @param {number} duration - Duration in milliseconds
   * @returns {Promise<void>}
   */
  async requestExclusive(systemName, duration = 5000) {
    console.log(`🔒 ${systemName} requesting exclusive mode for ${duration}ms`);
    
    this.eventBus.emit('system:exclusive:start', { 
      systemName, 
      duration,
      timestamp: Date.now()
    });
    
    return new Promise(resolve => {
      setTimeout(() => {
        this.eventBus.emit('system:exclusive:end', { 
          systemName,
          timestamp: Date.now()
        });
        console.log(`🔓 ${systemName} exclusive mode ended`);
        resolve();
      }, duration);
    });
  }

  /**
   * Get system health status
   * @param {string} systemName - Optional specific system name
   * @returns {Object} Health status information
   */
  getHealthStatus(systemName = null) {
    if (systemName) {
      return this.systems.get(systemName) || null;
    }
    
    const status = {
      coordinator: {
        initialized: this.initialized,
        totalSystems: this.systems.size,
        healthySystems: 0,
        unhealthySystems: 0
      },
      systems: {}
    };
    
    for (const [name, info] of this.systems) {
      status.systems[name] = {
        healthy: info.healthy,
        lastHealthCheck: info.lastHealthCheck,
        errorCount: info.errors.length,
        lastError: info.errors[info.errors.length - 1] || null
      };
      
      if (info.healthy) {
        status.coordinator.healthySystems++;
      } else {
        status.coordinator.unhealthySystems++;
      }
    }
    
    return status;
  }

  /**
   * Force health check for all systems
   * @returns {Promise<Map>} Health check results
   */
  async runHealthChecks() {
    console.log('🏥 Running system health checks...');
    return await this.healthMonitor.runAllChecks();
  }

  /**
   * Get system by name
   * @param {string} name - System name
   * @returns {Object|null} System instance
   */
  getSystem(name) {
    const systemInfo = this.systems.get(name);
    return systemInfo ? systemInfo.system : null;
  }
}

/**
 * HealthMonitor - System health monitoring with TDD anchors
 */
class HealthMonitor {
  constructor() {
    this.checks = new Map();
  }

  /**
   * Add health check for a system
   * @param {string} systemName - System name
   * @param {Function} checkFunction - Health check function
   */
  addCheck(systemName, checkFunction) {
    this.checks.set(systemName, checkFunction);
    console.log(`🏥 Health check registered for: ${systemName}`);
  }

  /**
   * Run all registered health checks
   * @returns {Promise<Map>} Results map
   */
  async runAllChecks() {
    const results = new Map();
    
    for (const [name, checkFn] of this.checks) {
      try {
        const result = await checkFn();
        results.set(name, { 
          healthy: true, 
          result,
          timestamp: Date.now()
        });
      } catch (error) {
        results.set(name, { 
          healthy: false, 
          error: error.message,
          timestamp: Date.now()
        });
        console.error(`🏥 Health check failed for ${name}:`, error);
      }
    }
    
    return results;
  }
}

/**
 * LayerManager - Z-index and visual layer management
 */
class LayerManager {
  constructor() {
    this.layers = {
      BACKGROUND: 0,
      CONTENT: 100,
      INTERACTIVE: 500,
      TOOLTIPS: 1000,
      OVERLAYS: 1500,
      MODALS: 2000,
      DEBUG: 9999
    };
    this.allocations = new Map();
  }

  /**
   * Request a z-index layer
   * @param {string} systemName - System requesting the layer
   * @param {string} layerName - Layer name from this.layers
   * @returns {number} Z-index value
   */
  requestLayer(systemName, layerName) {
    if (!this.layers.hasOwnProperty(layerName)) {
      console.error(`❌ Unknown layer: ${layerName}`);
      return this.layers.CONTENT;
    }

    const zIndex = this.layers[layerName];
    this.allocations.set(systemName, { layer: layerName, zIndex });
    
    console.log(`📐 ${systemName} allocated ${layerName} layer (z-index: ${zIndex})`);
    return zIndex;
  }

  /**
   * Report z-index conflicts
   * @returns {Array} Array of conflicts
   */
  reportConflicts() {
    const conflicts = new Map();
    
    for (const [system, allocation] of this.allocations) {
      const { zIndex } = allocation;
      if (!conflicts.has(zIndex)) conflicts.set(zIndex, []);
      conflicts.get(zIndex).push(system);
    }
    
    return Array.from(conflicts.entries()).filter(([_, systems]) => systems.length > 1);
  }
}

/**
 * EventBus - Decoupled system communication
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
    this.eventLog = [];
    this.maxLogSize = 100;
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    // Log event
    this.eventLog.push({
      event,
      data,
      timestamp: Date.now()
    });
    
    // Trim log if too long
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`🚫 Event listener error for '${event}':`, error);
      }
    });
  }

  /**
   * Get recent event log
   * @param {number} limit - Number of events to return
   * @returns {Array} Recent events
   */
  getEventLog(limit = 10) {
    return this.eventLog.slice(-limit);
  }
}

/**
 * CSSManager - Isolated CSS injection without conflicts
 */
class CSSManager {
  constructor() {
    this.injectedStyles = new Map();
  }

  /**
   * Inject CSS for a system
   * @param {string} systemName - System name
   * @param {string} css - CSS content
   */
  injectCSS(systemName, css) {
    if (this.injectedStyles.has(systemName)) {
      this.injectedStyles.get(systemName).remove();
    }

    const style = document.createElement('style');
    style.id = `${systemName}-styles`;
    style.textContent = css;
    document.head.appendChild(style);
    this.injectedStyles.set(systemName, style);

    console.log(`🎨 CSS injected for: ${systemName}`);
  }

  /**
   * Remove CSS for a system
   * @param {string} systemName - System name
   */
  removeCSS(systemName) {
    const style = this.injectedStyles.get(systemName);
    if (style) {
      style.remove();
      this.injectedStyles.delete(systemName);
      console.log(`🗑️ CSS removed for: ${systemName}`);
    }
  }
}

// Export classes
window.ThemeSystemCoordinator = ThemeSystemCoordinator;
window.HealthMonitor = HealthMonitor;
window.LayerManager = LayerManager;
window.EventBus = EventBus;
window.CSSManager = CSSManager;

console.log('🏗️ ThemeSystemCoordinator architecture loaded - following ARCHITECTURAL_OVERHAUL_PLAN.md');