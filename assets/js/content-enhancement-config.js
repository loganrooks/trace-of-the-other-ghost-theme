/**
 * Content Enhancement System - Unified Configuration
 * Supports both legacy footnote system and new modular architecture
 * 
 * Philosophy: Maintains simple Ghost editor workflow ([^N], [+]) while providing
 * rich interactive features through modular, extensible processors
 * 
 * Created: August 23, 2025
 */

// Global configuration for the modular content enhancement system
window.ContentEnhancementConfig = {
  // Global settings shared across all processors
  global: {
    theme: 'hacker',
    container: '.post-content, .page-content',
    debug: false,
    
    // Performance settings
    enableLazyLoading: false,
    processChunkSize: 50, // Process content in chunks for better performance
    
    // Accessibility settings
    respectReducedMotion: true,
    enableHighContrast: false
  },
  
  // Processor-specific configurations
  processors: {
    // Footnote processor configuration
    footnotes: {
      behavior: {
        enableTooltips: true,
        enableSmoothScrolling: true,
        tooltipDelay: 150,
        scrollOffset: 'center',
        enableKeyboardNav: true,
        enableProgressiveEnhancement: false // Disabled for cleaner implementation
      },
      
      patterns: {
        // Core pattern that preserves Ghost editor workflow
        footnotePattern: /\[\^(\d+)\]/g, // [^1], [^2], etc.
        referenceAttribute: 'data-ref'
      },
      
      classes: {
        footnoteRef: 'footnote-ref',
        footnoteLink: 'footnote-link',
        footnoteCollection: 'footnote-collection',
        footnoteList: 'footnote-list',
        footnoteItem: 'footnote-item',
        footnoteTooltip: 'footnote-tooltip',
        footnoteBackref: 'footnote-backref',
        systemEnhanced: 'footnote-system-enhanced'
      },
      
      selectors: {
        container: '.post-content, .page-content',
        paragraphs: 'p, .marginalia-voice, blockquote, li',
        footnoteCards: '[data-ref]',
        footnoteSearchScope: 'article, .gh-content, .post-content, .page-content, main',
        marginalia: '.marginalia-voice'
      },
      
      processing: {
        fallbackEnabled: false, // Clean implementation without fallback
        sanitizeHTML: true,
        allowedTags: ['strong', 'em', 'code', 'a', 'ul', 'ol', 'li', 'blockquote', 'cite', 'br'],
        maxTooltipWidth: 320,
        maxFootnoteLength: 1000
      },
      
      accessibility: {
        addAriaLabels: true,
        enableHighContrast: true,
        respectReducedMotion: true,
        enableScreenReader: true,
        focusManagement: true
      }
    },
    
    // Paragraph extension processor configuration
    extensions: {
      behavior: {
        enableAnimations: true,
        animationDuration: 300,
        autoClose: false,
        autoScrollToExtension: true,
        maxExtensionsPerParagraph: 5 // Prevent content overload
      },
      
      patterns: {
        // Core pattern preserving Ghost editor workflow: [+][content goes here]
        extensionPattern: /\[\+\]\[((?:[^\[\]]|\[[^\]]*\])*)\]/g
      },
      
      classes: {
        extensionTrigger: 'extension-trigger',
        extensionBox: 'paragraph-extension-box',
        extensionContent: 'extension-content',
        extensionHeader: 'extension-header',
        extensionClose: 'extension-close'
      },
      
      selectors: {
        paragraphs: 'p, .marginalia-voice, blockquote, li'
      },
      
      formatting: {
        supportMarkdown: true, // Enable basic markdown in extensions
        supportNestedBrackets: true,
        maxExtensionLength: 2000 // Prevent extremely long extensions
      },
      
      accessibility: {
        addAriaLabels: true,
        enableKeyboardNav: true,
        announceStateChanges: true
      }
    },
    
    // Marginalia processor configuration
    marginalia: {
      behavior: {
        enablePatternProcessing: true,
        enableBackwardCompatibility: true, // Support existing HTML blocks
        enableHoverEffects: true,
        enableVoiceInteractions: true
      },
      
      patterns: {
        // Core pattern: [m][voice font-scale width position][content] - supports multiline
        // FIXED: Made content matching greedy to handle nested brackets like [^2]
        marginaliaPattern: /\[m\]\[([^\]]*)\]\[([\s\S]+)\]/g
      },
      
      defaults: {
        voice: 1,        // Default voice (1-6)
        fontScale: 1.0,  // Default font scale (0.4-2.5)
        width: 30,       // Default width percentage (15-45)
        position: 'right' // Default position (left/right)
      },
      
      classes: {
        marginalia: 'marginalia-voice',
        marginaliaContent: 'marginalia-content'
      },
      
      selectors: {
        paragraphs: 'p, .marginalia-voice, blockquote, li, div',
        existingMarginalia: '.marginalia-voice'
      },
      
      validation: {
        minVoice: 1,
        maxVoice: 6,
        minFontScale: 0.4,
        maxFontScale: 2.5,
        minWidth: 15,
        maxWidth: 45,
        validPositions: ['left', 'right', 'l', 'r'] // Support both short and long forms
      },
      
      formatting: {
        supportMarkdown: true, // Enable basic markdown in marginalia
        maxMarginaliaLength: 1000 // Prevent extremely long marginalia
      }
    }
    
    // Future processors can be added here:
    // citations: { /* configuration for citation processor */ },
    // annotations: { /* configuration for annotation processor */ }
  },
  
  // Shared theme system across all processors
  themes: {
    hacker: {
      '--primary-accent': '#00ff00',
      '--primary-accent-dark': '#008800',
      '--primary-accent-alpha': 'rgba(0, 255, 0, 0.1)',
      
      '--extension-accent': '#ff8800',
      '--extension-accent-dark': '#cc5500',
      '--extension-accent-alpha': 'rgba(255, 136, 0, 0.1)',
      
      '--background': 'rgba(0, 0, 0, 0.95)',
      '--background-light': 'rgba(0, 0, 0, 0.8)',
      '--text-color': '#e0e0e0',
      '--text-color-dim': '#a0a0a0',
      
      '--font-family': "'JetBrains Mono', monospace",
      '--font-size-small': '0.85em',
      '--font-size-normal': '1em',
      
      '--border-radius': '4px',
      '--shadow-subtle': '0 2px 8px rgba(0, 0, 0, 0.3)',
      '--shadow-prominent': '0 4px 16px rgba(0, 0, 0, 0.4)',
      
      '--animation-fast': '0.15s',
      '--animation-normal': '0.3s',
      '--animation-slow': '0.6s'
    },
    
    academic: {
      '--primary-accent': '#2563eb',
      '--primary-accent-dark': '#1e40af',
      '--primary-accent-alpha': 'rgba(37, 99, 235, 0.1)',
      
      '--extension-accent': '#7c3aed',
      '--extension-accent-dark': '#5b21b6',
      '--extension-accent-alpha': 'rgba(124, 58, 237, 0.1)',
      
      '--background': 'rgba(255, 255, 255, 0.95)',
      '--background-light': 'rgba(248, 250, 252, 0.95)',
      '--text-color': '#1f2937',
      '--text-color-dim': '#6b7280',
      
      '--font-family': 'Georgia, serif',
      '--font-size-small': '0.9em',
      '--font-size-normal': '1em',
      
      '--border-radius': '6px',
      '--shadow-subtle': '0 1px 3px rgba(0, 0, 0, 0.1)',
      '--shadow-prominent': '0 4px 12px rgba(0, 0, 0, 0.15)',
      
      '--animation-fast': '0.2s',
      '--animation-normal': '0.4s',
      '--animation-slow': '0.8s'
    },
    
    minimal: {
      '--primary-accent': '#374151',
      '--primary-accent-dark': '#111827',
      '--primary-accent-alpha': 'rgba(55, 65, 81, 0.1)',
      
      '--extension-accent': '#dc2626',
      '--extension-accent-dark': '#991b1b',
      '--extension-accent-alpha': 'rgba(220, 38, 38, 0.1)',
      
      '--background': 'rgba(249, 250, 251, 0.95)',
      '--background-light': 'rgba(255, 255, 255, 0.95)',
      '--text-color': '#111827',
      '--text-color-dim': '#6b7280',
      
      '--font-family': 'system-ui, sans-serif',
      '--font-size-small': '0.875em',
      '--font-size-normal': '1rem',
      
      '--border-radius': '2px',
      '--shadow-subtle': '0 1px 2px rgba(0, 0, 0, 0.05)',
      '--shadow-prominent': '0 2px 8px rgba(0, 0, 0, 0.1)',
      
      '--animation-fast': '0.1s',
      '--animation-normal': '0.2s',
      '--animation-slow': '0.4s'
    }
  },
  
  // Feature flags for gradual migration and A/B testing
  features: {
    // Core features
    enableTooltips: true,
    enableAnimations: true,
    enableKeyboardNavigation: true,
    
    // Experimental features
    enableSmartPositioning: true, // Advanced tooltip positioning
    enableContentPreview: false, // Preview content on hover
    enableBulkActions: false, // Bulk expand/collapse
    enableSearchIntegration: false, // Search within footnotes/extensions
    
    // Performance features
    enableLazyRendering: false, // Render content only when needed
    enableVirtualScrolling: false, // For large footnote collections
    enableWorkerProcessing: false // Process content in web workers
  },
  
  // Development and debugging settings
  development: {
    enableDebugMode: false,
    enablePerformanceMonitoring: true,
    enableErrorReporting: true,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    enableTestMode: false // For automated testing
  },
  
  // Validation and utility methods
  validate: function() {
    const required = ['global', 'processors', 'themes'];
    const missing = required.filter(key => !this.hasOwnProperty(key));
    
    if (missing.length > 0) {
      console.error('[CONTENT_ENHANCEMENT_CONFIG] Missing configuration sections:', missing);
      return false;
    }
    
    // Validate processor configurations preserve editor workflow
    if (!this.validateEditorWorkflow()) {
      return false;
    }
    
    console.log('[CONTENT_ENHANCEMENT_CONFIG] Configuration validation passed');
    return true;
  },
  
  validateEditorWorkflow: function() {
    // Ensure footnote pattern preserves [^N] syntax
    const footnotePattern = this.processors.footnotes?.patterns?.footnotePattern;
    if (footnotePattern && !footnotePattern.source.includes('\\[\\^')) {
      console.error('[CONTENT_ENHANCEMENT_CONFIG] Footnote pattern must preserve [^N] editor workflow');
      return false;
    }
    
    // Ensure extension pattern preserves [+] syntax
    const extensionPattern = this.processors.extensions?.patterns?.extensionPattern;
    if (extensionPattern && !extensionPattern.source.includes('\\[\\+\\]')) {
      console.error('[CONTENT_ENHANCEMENT_CONFIG] Extension pattern must preserve [+] editor workflow');
      return false;
    }
    
    return true;
  },
  
  // Apply theme to document
  applyTheme: function(themeName = 'hacker') {
    const theme = this.themes[themeName];
    if (!theme) {
      console.warn(`[CONTENT_ENHANCEMENT_CONFIG] Theme "${themeName}" not found`);
      return;
    }

    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update global theme setting
    this.global.theme = themeName;
    console.log(`[CONTENT_ENHANCEMENT_CONFIG] Applied theme: ${themeName}`);
  },
  
  // Get processor configuration with global defaults merged
  getProcessorConfig: function(processorName) {
    const globalConfig = this.global || {};
    const processorConfig = this.processors[processorName] || {};
    
    return {
      ...globalConfig,
      ...processorConfig,
      themes: this.themes,
      features: this.features,
      development: this.development
    };
  },
  
  // Update configuration at runtime
  updateConfig: function(path, value) {
    try {
      const keys = path.split('.');
      let current = this;
      
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
      
      console.log(`[CONTENT_ENHANCEMENT_CONFIG] Updated ${path} = ${value}`);
      return true;
    } catch (error) {
      console.error(`[CONTENT_ENHANCEMENT_CONFIG] Failed to update ${path}:`, error);
      return false;
    }
  }
};

// Feature flags - integrates with Ghost custom theme settings
// Default values are overridden by theme settings if available
window.CONTENT_ENHANCEMENT_FLAGS = {
  // Migration control - use modern system to ensure proper processing order
  USE_LEGACY_FOOTNOTES: false,  // FIXED: Use modern system for correct Marginalia→Extensions→Footnotes order
  ENABLE_EXTENSIONS: window.ghost_custom_settings?.enable_extensions || false,
  ENABLE_MARGINALIA: window.ghost_custom_settings?.enable_marginalia !== false, // Enabled by default
  MIGRATION_MODE: true,        // Always enable gradual migration
  
  // Processor control - driven by theme settings
  ENABLE_FOOTNOTE_PROCESSOR: true,  // FIXED: Enable modern footnote processor
  ENABLE_EXTENSION_PROCESSOR: window.ghost_custom_settings?.enable_extensions || false,
  ENABLE_MARGINALIA_PROCESSOR: window.ghost_custom_settings?.enable_marginalia !== false, // Enabled by default
  
  // Feature control
  ENABLE_MODERN_TOOLTIPS: window.ghost_custom_settings?.enable_modern_footnotes || false,
  ENABLE_SMART_POSITIONING: true,    // Always enabled when modern system active
  ENABLE_THEME_SWITCHING: true,      // Runtime theme switching
  
  // Development and testing
  ENABLE_DEBUG_PANELS: window.ghost_custom_settings?.debug_mode || false,
  ENABLE_PERFORMANCE_MONITORING: window.ghost_custom_settings?.debug_mode || false,
  ENABLE_ERROR_BOUNDARIES: true      // Error recovery
};

// Auto-apply default theme and validate configuration
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Validate configuration
    if (window.ContentEnhancementConfig.validate()) {
      console.log('[CONTENT_ENHANCEMENT_CONFIG] Configuration loaded and validated successfully');
      
      // Apply default theme
      window.ContentEnhancementConfig.applyTheme('hacker');
      
      // Log feature flags status
      console.log('[CONTENT_ENHANCEMENT_FLAGS] Current flags:', window.CONTENT_ENHANCEMENT_FLAGS);
      
      // Set up global debug functions
      window.debugContentConfig = () => {
        console.group('[CONFIG DEBUG]');
        console.log('Configuration:', window.ContentEnhancementConfig);
        console.log('Feature Flags:', window.CONTENT_ENHANCEMENT_FLAGS);
        console.log('Applied Theme:', window.ContentEnhancementConfig.global.theme);
        
        // Show which system is active
        if (window.CONTENT_ENHANCEMENT_FLAGS.USE_LEGACY_FOOTNOTES) {
          console.log('Active System: Legacy Footnote System');
        } else {
          console.log('Active System: Modern Modular System');
        }
        
        console.groupEnd();
      };
      
      // Migration helper functions
      window.enableModernSystem = () => {
        console.log('[CONFIG] Enabling modern system...');
        window.CONTENT_ENHANCEMENT_FLAGS.USE_LEGACY_FOOTNOTES = false;
        window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_FOOTNOTE_PROCESSOR = true;
        console.log('[CONFIG] Modern system enabled. Reload page to take effect.');
      };
      
      window.enableExtensions = () => {
        console.log('[CONFIG] Enabling paragraph extensions...');
        window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_EXTENSIONS = true;
        window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_EXTENSION_PROCESSOR = true;
        console.log('[CONFIG] Extensions enabled. Reload page to take effect.');
      };
      
      window.switchTheme = (themeName) => {
        window.ContentEnhancementConfig.applyTheme(themeName);
      };
      
    } else {
      console.error('[CONTENT_ENHANCEMENT_CONFIG] Configuration validation failed');
    }
  } catch (error) {
    console.error('[CONTENT_ENHANCEMENT_CONFIG] Configuration setup failed:', error);
  }
});

// Backward compatibility: Ensure legacy footnote config is still available
// This allows gradual migration without breaking existing implementations
if (!window.DigitalTalmudFootnoteConfig && window.ContentEnhancementConfig) {
  console.log('[CONTENT_ENHANCEMENT_CONFIG] Creating legacy compatibility layer');
  
  const footnoteConfig = window.ContentEnhancementConfig.processors.footnotes;
  
  window.DigitalTalmudFootnoteConfig = {
    behavior: footnoteConfig.behavior,
    themes: window.ContentEnhancementConfig.themes,
    processing: footnoteConfig.processing,
    accessibility: footnoteConfig.accessibility,
    classes: footnoteConfig.classes,
    selectors: footnoteConfig.selectors,
    
    // Legacy API methods
    validate: () => window.ContentEnhancementConfig.validate(),
    applyTheme: (theme) => window.ContentEnhancementConfig.applyTheme(theme)
  };
}