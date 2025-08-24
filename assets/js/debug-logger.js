/**
 * Structured Debug Logger - Best Practices Logging System
 * Replaces messy console.log spam with proper structured logging
 * 
 * Philosophy: Clean, selective, actionable debugging information
 * Created: August 24, 2025
 */

class DebugLogger {
  constructor() {
    this.loggers = new Map();
    this.globalLevel = this.getLogLevel();
    this.enabledNamespaces = this.getEnabledNamespaces();
    this.performanceTimers = new Map();
    this.errorCollection = [];
    
    // Log levels (higher number = more important)
    this.levels = {
      DEBUG: 0,
      INFO: 1, 
      WARN: 2,
      ERROR: 3,
      SILENT: 4
    };
    
    this.colors = {
      DEBUG: '#888888',
      INFO: '#0066cc', 
      WARN: '#ff8800',
      ERROR: '#ff0000'
    };
    
    this.init();
  }
  
  /**
   * Initialize global logger instance
   */
  init() {
    // Make debug functions globally available
    window.debugLogger = this;
    window.setLogLevel = (level) => this.setGlobalLevel(level);
    window.enableDebug = (namespace) => this.enableNamespace(namespace);
    window.disableDebug = (namespace) => this.disableNamespace(namespace);
    window.showErrors = () => this.showErrorSummary();
    window.clearLogs = () => this.clearAll();
    
    console.log('🔧 Debug Logger initialized. Use setLogLevel("DEBUG") or enableDebug("marginalia")');
  }
  
  /**
   * Get current log level from settings
   */
  getLogLevel() {
    // Check feature flags first
    if (window.CONTENT_ENHANCEMENT_FLAGS?.ENABLE_DEBUG_PANELS) {
      return 'DEBUG';
    }
    
    // Check localStorage override
    const stored = localStorage.getItem('debug-log-level');
    if (stored && this.levels.hasOwnProperty(stored)) {
      return stored;
    }
    
    // Default to INFO in development, WARN in production
    return window.location.hostname === 'localhost' ? 'INFO' : 'WARN';
  }
  
  /**
   * Get enabled debug namespaces
   */
  getEnabledNamespaces() {
    const stored = localStorage.getItem('debug-namespaces');
    if (stored) {
      return new Set(stored.split(','));
    }
    
    // Default: enable all in development, none in production
    if (window.location.hostname === 'localhost') {
      return new Set(['marginalia', 'extensions', 'footnotes', 'config']);
    }
    
    return new Set();
  }
  
  /**
   * Create or get logger for namespace
   */
  logger(namespace) {
    if (!this.loggers.has(namespace)) {
      this.loggers.set(namespace, new NamespacedLogger(namespace, this));
    }
    return this.loggers.get(namespace);
  }
  
  /**
   * Set global log level
   */
  setGlobalLevel(level) {
    if (!this.levels.hasOwnProperty(level)) {
      console.warn(`Invalid log level: ${level}. Use DEBUG, INFO, WARN, ERROR, SILENT`);
      return;
    }
    
    this.globalLevel = level;
    localStorage.setItem('debug-log-level', level);
    console.log(`🔧 Global log level set to ${level}`);
  }
  
  /**
   * Enable debugging for namespace
   */
  enableNamespace(namespace) {
    this.enabledNamespaces.add(namespace);
    localStorage.setItem('debug-namespaces', Array.from(this.enabledNamespaces).join(','));
    console.log(`🔧 Debug enabled for namespace: ${namespace}`);
  }
  
  /**
   * Disable debugging for namespace
   */
  disableNamespace(namespace) {
    this.enabledNamespaces.delete(namespace);
    localStorage.setItem('debug-namespaces', Array.from(this.enabledNamespaces).join(','));
    console.log(`🔧 Debug disabled for namespace: ${namespace}`);
  }
  
  /**
   * Check if logging is enabled for namespace and level
   */
  shouldLog(namespace, level) {
    // Check global level
    if (this.levels[level] < this.levels[this.globalLevel]) {
      return false;
    }
    
    // Check namespace filter (INFO and above always show, DEBUG requires namespace enable)
    if (level === 'DEBUG' && !this.enabledNamespaces.has(namespace)) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Start performance timer
   */
  time(namespace, operation) {
    const key = `${namespace}:${operation}`;
    this.performanceTimers.set(key, performance.now());
  }
  
  /**
   * End performance timer and log result
   */
  timeEnd(namespace, operation) {
    const key = `${namespace}:${operation}`;
    const start = this.performanceTimers.get(key);
    
    if (start) {
      const duration = performance.now() - start;
      this.performanceTimers.delete(key);
      
      if (this.shouldLog(namespace, 'DEBUG')) {
        console.log(
          `%c[${namespace.toUpperCase()}] ⏱️ ${operation}: ${duration.toFixed(2)}ms`,
          `color: ${this.colors.DEBUG}`
        );
      }
      
      return duration;
    }
    
    return null;
  }
  
  /**
   * Collect error for analysis
   */
  collectError(namespace, error, context = {}) {
    const errorRecord = {
      namespace,
      error: error.message || error,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    this.errorCollection.push(errorRecord);
    
    // Keep only last 50 errors
    if (this.errorCollection.length > 50) {
      this.errorCollection.shift();
    }
  }
  
  /**
   * Show error summary
   */
  showErrorSummary() {
    if (this.errorCollection.length === 0) {
      console.log('✅ No errors collected');
      return;
    }
    
    console.group(`❌ Error Summary (${this.errorCollection.length} errors)`);
    
    const byNamespace = {};
    this.errorCollection.forEach(error => {
      if (!byNamespace[error.namespace]) {
        byNamespace[error.namespace] = [];
      }
      byNamespace[error.namespace].push(error);
    });
    
    Object.entries(byNamespace).forEach(([namespace, errors]) => {
      console.groupCollapsed(`${namespace}: ${errors.length} errors`);
      errors.forEach(error => {
        console.error(`${error.timestamp}: ${error.error}`, error.context);
      });
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  /**
   * Clear all logs and errors
   */
  clearAll() {
    this.errorCollection = [];
    this.performanceTimers.clear();
    console.clear();
    console.log('🔧 Debug logs cleared');
  }
  
  /**
   * Show debug status
   */
  status() {
    console.group('🔧 Debug Logger Status');
    console.log(`Global Level: ${this.globalLevel}`);
    console.log(`Enabled Namespaces: ${Array.from(this.enabledNamespaces).join(', ') || 'none'}`);
    console.log(`Active Loggers: ${Array.from(this.loggers.keys()).join(', ') || 'none'}`);
    console.log(`Errors Collected: ${this.errorCollection.length}`);
    console.log(`Performance Timers: ${this.performanceTimers.size}`);
    console.groupEnd();
  }
}

/**
 * Namespaced logger for individual processors
 */
class NamespacedLogger {
  constructor(namespace, debugLogger) {
    this.namespace = namespace;
    this.debugLogger = debugLogger;
  }
  
  debug(message, ...args) {
    if (this.debugLogger.shouldLog(this.namespace, 'DEBUG')) {
      console.log(
        `%c[${this.namespace.toUpperCase()}] 🐛 ${message}`,
        `color: ${this.debugLogger.colors.DEBUG}`,
        ...args
      );
    }
  }
  
  info(message, ...args) {
    if (this.debugLogger.shouldLog(this.namespace, 'INFO')) {
      console.log(
        `%c[${this.namespace.toUpperCase()}] ℹ️ ${message}`,
        `color: ${this.debugLogger.colors.INFO}`,
        ...args
      );
    }
  }
  
  warn(message, ...args) {
    if (this.debugLogger.shouldLog(this.namespace, 'WARN')) {
      console.warn(
        `%c[${this.namespace.toUpperCase()}] ⚠️ ${message}`,
        `color: ${this.debugLogger.colors.WARN}`,
        ...args
      );
    }
  }
  
  error(message, error, context = {}) {
    if (this.debugLogger.shouldLog(this.namespace, 'ERROR')) {
      console.error(
        `%c[${this.namespace.toUpperCase()}] ❌ ${message}`,
        `color: ${this.debugLogger.colors.ERROR}`,
        error
      );
    }
    
    // Always collect errors regardless of log level
    this.debugLogger.collectError(this.namespace, error, { message, ...context });
  }
  
  time(operation) {
    this.debugLogger.time(this.namespace, operation);
  }
  
  timeEnd(operation) {
    return this.debugLogger.timeEnd(this.namespace, operation);
  }
  
  group(label) {
    if (this.debugLogger.shouldLog(this.namespace, 'DEBUG')) {
      console.group(`[${this.namespace.toUpperCase()}] ${label}`);
    }
  }
  
  groupEnd() {
    if (this.debugLogger.shouldLog(this.namespace, 'DEBUG')) {
      console.groupEnd();
    }
  }
}

// Initialize global debug logger
window.GlobalDebugLogger = new DebugLogger();

// Convenience functions for quick access
window.logger = (namespace) => window.GlobalDebugLogger.logger(namespace);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DebugLogger, NamespacedLogger };
}