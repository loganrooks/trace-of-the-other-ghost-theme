/**
 * Content Enhancement System - Configuration Manager
 * Unified configuration management preserving Ghost editor workflow philosophy
 * 
 * Philosophy: Maintain simple, typeable patterns ([^N], [+]) that writers can
 * use naturally in Ghost editor without context-switching or special UI elements
 * 
 * Created: August 23, 2025
 */

class ConfigurationManager {
  constructor(globalConfig = null) {
    // Use provided config or fall back to legacy, then default
    this.config = globalConfig || 
                  window.ContentEnhancementConfig || 
                  this.createFromLegacy() || 
                  this.getDefaultConfig();
                  
    this.processors = new Map();
    this.initialized = false;
  }

  /**
   * Initialize configuration manager
   * @returns {boolean} Success status
   */
  init() {
    try {
      if (!this.validate()) {
        console.error('[CONFIG_MANAGER] Configuration validation failed');
        return false;
      }

      // Apply default theme
      const defaultTheme = this.config.global?.theme || 'hacker';
      this.applyTheme(defaultTheme);

      this.initialized = true;
      console.log('[CONFIG_MANAGER] Initialized successfully with theme:', defaultTheme);
      return true;
    } catch (error) {
      console.error('[CONFIG_MANAGER] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Get configuration for specific processor
   * Merges global config with processor-specific config
   * @param {string} processorName - Name of processor (footnotes, extensions, etc.)
   * @returns {Object} Merged configuration
   */
  getProcessorConfig(processorName) {
    const globalConfig = this.config.global || {};
    const processorConfig = this.config.processors?.[processorName] || {};
    
    return {
      ...globalConfig,
      ...processorConfig,
      // Ensure processor has access to shared theme system
      themes: this.config.themes || {},
      // Preserve philosophy: easy typeable patterns
      patterns: {
        // Default patterns that preserve editor workflow
        footnotePattern: /\[\^(\d+)\]/g,  // [^1], [^2], etc.
        extensionPattern: /\[\+\]\[((?:[^\[\]]|\[[^\]]*\])*)\]/g, // [+][content]
        ...processorConfig.patterns
      }
    };
  }

  /**
   * Register a processor with the configuration manager
   * @param {string} name - Processor name
   * @param {ContentProcessor} processor - Processor instance
   */
  registerProcessor(name, processor) {
    this.processors.set(name, processor);
    console.log(`[CONFIG_MANAGER] Registered processor: ${name}`);
  }

  /**
   * Get registered processor
   * @param {string} name - Processor name
   * @returns {ContentProcessor|null} Processor instance
   */
  getProcessor(name) {
    return this.processors.get(name) || null;
  }

  /**
   * Apply theme to document
   * @param {string} themeName - Name of theme to apply
   */
  applyTheme(themeName) {
    const theme = this.config.themes?.[themeName];
    if (!theme) {
      console.warn(`[CONFIG_MANAGER] Theme "${themeName}" not found`);
      return;
    }

    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update global theme setting
    if (this.config.global) {
      this.config.global.theme = themeName;
    }

    console.log(`[CONFIG_MANAGER] Applied theme: ${themeName}`);
  }

  /**
   * Validate entire configuration structure
   * @returns {boolean} Is configuration valid
   */
  validate() {
    const required = ['global', 'processors', 'themes'];
    const missing = required.filter(key => !this.config.hasOwnProperty(key));
    
    if (missing.length > 0) {
      console.error('[CONFIG_MANAGER] Missing configuration sections:', missing);
      return false;
    }

    // Validate processor configs preserve editor workflow philosophy
    const processorConfigs = this.config.processors || {};
    for (const [name, config] of Object.entries(processorConfigs)) {
      if (!this.validateProcessorConfig(name, config)) {
        return false;
      }
    }

    console.log('[CONFIG_MANAGER] Configuration validation passed');
    return true;
  }

  /**
   * Validate individual processor configuration
   * Ensures it preserves the editor workflow philosophy
   * @param {string} name - Processor name
   * @param {Object} config - Processor configuration
   * @returns {boolean} Is processor config valid
   * @private
   */
  validateProcessorConfig(name, config) {
    // Ensure patterns are simple and typeable
    if (config.patterns) {
      const patterns = config.patterns;
      
      // Footnotes should use simple [^N] pattern
      if (patterns.footnotePattern && !patterns.footnotePattern.source.includes('\\[\\^')) {
        console.error(`[CONFIG_MANAGER] ${name}: footnotePattern must preserve [^N] syntax for editor workflow`);
        return false;
      }
      
      // Extensions should use simple [+][content] pattern  
      if (patterns.extensionPattern && !patterns.extensionPattern.source.includes('\\[\\+\\]')) {
        console.error(`[CONFIG_MANAGER] ${name}: extensionPattern must preserve [+] syntax for editor workflow`);
        return false;
      }
    }

    console.log(`[CONFIG_MANAGER] Processor config valid: ${name}`);
    return true;
  }

  /**
   * Create configuration from legacy footnote config
   * Preserves existing workflow while enabling modular architecture
   * @returns {Object|null} Converted configuration
   * @private
   */
  createFromLegacy() {
    const legacy = window.DigitalTalmudFootnoteConfig;
    if (!legacy) return null;

    console.log('[CONFIG_MANAGER] Converting legacy configuration to modular format');

    return {
      global: {
        theme: 'hacker',
        container: legacy.selectors?.container || '.post-content, .page-content',
        debug: false
      },
      
      processors: {
        footnotes: {
          // Preserve all existing footnote behavior and philosophy
          behavior: legacy.behavior || {},
          patterns: {
            footnotePattern: legacy.processing?.footnotePattern || /\[\^(\d+)\]/g,
            referenceAttribute: legacy.processing?.referenceAttribute || 'data-ref'
          },
          classes: legacy.classes || {},
          selectors: legacy.selectors || {},
          accessibility: legacy.accessibility || {},
          processing: legacy.processing || {}
        }
      },
      
      themes: legacy.themes || {
        hacker: {
          '--footnote-accent': '#00ff00',
          '--footnote-accent-dark': '#008800',
          '--footnote-bg': 'rgba(0, 0, 0, 0.95)'
        }
      }
    };
  }

  /**
   * Get default configuration preserving editor workflow philosophy
   * @returns {Object} Default configuration
   * @private
   */
  getDefaultConfig() {
    return {
      global: {
        theme: 'hacker',
        container: '.post-content, .page-content',
        debug: false
      },
      
      processors: {
        footnotes: {
          behavior: {
            enableTooltips: true,
            tooltipDelay: 150,
            enableKeyboardNav: true,
            enableSmoothScrolling: true
          },
          patterns: {
            // Preserve simple, typeable pattern that works in Ghost editor
            footnotePattern: /\[\^(\d+)\]/g,
            referenceAttribute: 'data-ref'
          },
          classes: {
            footnoteRef: 'footnote-ref',
            footnoteLink: 'footnote-link',
            footnoteCollection: 'footnote-collection',
            footnoteItem: 'footnote-item',
            footnoteTooltip: 'footnote-tooltip'
          },
          selectors: {
            container: '.post-content, .page-content',
            paragraphs: 'p, .marginalia-voice, blockquote, li',
            footnoteCards: '[data-ref]'
          }
        },
        
        extensions: {
          behavior: {
            enableAnimations: true,
            animationDuration: 300,
            autoClose: false
          },
          patterns: {
            // Preserve simple, typeable pattern: [+][content goes here]
            extensionPattern: /\[\+\]\[((?:[^\[\]]|\[[^\]]*\])*)\]/g
          },
          classes: {
            extensionTrigger: 'extension-trigger',
            extensionBox: 'paragraph-extension-box',
            extensionContent: 'extension-content'
          }
        }
      },
      
      themes: {
        hacker: {
          '--primary-accent': '#00ff00',
          '--extension-accent': '#ff8800',
          '--background': 'rgba(0, 0, 0, 0.95)',
          '--font-family': "'JetBrains Mono', monospace"
        },
        academic: {
          '--primary-accent': '#2563eb',
          '--extension-accent': '#1e40af',
          '--background': 'rgba(255, 255, 255, 0.95)',
          '--font-family': 'Georgia, serif'
        }
      }
    };
  }

  /**
   * Update configuration at runtime
   * @param {string} path - Configuration path (e.g., 'global.theme' or 'processors.footnotes.behavior.enableTooltips')
   * @param {*} value - New value
   * @returns {boolean} Success status
   */
  updateConfig(path, value) {
    try {
      const keys = path.split('.');
      let current = this.config;
      
      // Navigate to parent of target key
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Set the value
      const finalKey = keys[keys.length - 1];
      current[finalKey] = value;
      
      console.log(`[CONFIG_MANAGER] Updated ${path} = ${value}`);
      return true;
    } catch (error) {
      console.error(`[CONFIG_MANAGER] Failed to update ${path}:`, error);
      return false;
    }
  }

  /**
   * Get debug information about current configuration
   * @returns {Object} Debug information
   */
  debug() {
    return {
      initialized: this.initialized,
      configKeys: Object.keys(this.config),
      processorCount: this.processors.size,
      registeredProcessors: Array.from(this.processors.keys()),
      currentTheme: this.config.global?.theme,
      patterns: {
        footnote: this.config.processors?.footnotes?.patterns?.footnotePattern?.source,
        extension: this.config.processors?.extensions?.patterns?.extensionPattern?.source
      }
    };
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConfigurationManager;
}