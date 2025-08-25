/**
 * Trace of the Other - Unified Theme Configuration
 * Single source of truth for all theme functionality
 * 
 * Replaces:
 * - CONTENT_ENHANCEMENT_FLAGS
 * - ContentEnhancementConfig
 * - DigitalTalmudFootnoteConfig
 * - Individual processor configurations
 * 
 * Philosophy: Maintains simple Ghost editor workflow while providing
 * rich interactive features through unified, modular architecture
 * 
 * Created: August 25, 2025 (Technical Debt Remediation)
 */

// UNIFIED THEME CONFIGURATION - Single source of truth
window.ThemeConfig = {
  // ==========================================
  // FEATURE FLAGS (replaces CONTENT_ENHANCEMENT_FLAGS)
  // ==========================================
  features: {
    // Core processors
    footnotes: true,                    // [^N] + HTML footnotes
    marginalia: true,                   // [m][params][content] + HTML marginalia
    extensions: false,                  // [+][content] paragraph extensions
    deconstruction: false,              // Future: radical text effects
    
    // Effects
    hackerEffects: true,               // Matrix rain, glitch effects
    differance: false,                 // Derrida-inspired temporal effects
    pharmakon: false,                  // Remedy/poison interactions
    supplement: false,                 // Additions that replace originals
    
    // Debug and development
    debugMode: false,                  // Debug panels and logging
    systemDiagnostic: false           // System health monitoring
  },
  
  // ==========================================
  // PROCESSOR CONFIGURATIONS
  // ==========================================
  processors: {
    // Footnote processor - handles multiple formats
    footnotes: {
      formats: ['markdown', 'html'],
      patterns: {
        markdown: /\[\^(\d+)\]/g,      // [^1], [^2], etc.
        html: '[data-ref]',            // <div data-ref="1">
        referenceAttribute: 'data-ref'
      },
      selectors: {
        container: '.post-content, .page-content',
        paragraphs: 'p, .marginalia-voice, blockquote, li',
        footnoteCards: '[data-ref]',
        existingFootnotes: '.footnote'
      },
      classes: {
        footnoteRef: 'footnote-ref',
        footnoteLink: 'footnote-link',
        footnoteCollection: 'footnote-collection',
        tooltip: 'footnote-tooltip'
      },
      behavior: {
        enableTooltips: true,
        enableSmoothScrolling: true,
        tooltipDelay: 150,
        enableKeyboardNav: true,
        enableProgressiveEnhancement: true
      }
    },
    
    // Marginalia processor - handles multiple formats  
    marginalia: {
      formats: ['pattern', 'html'],
      patterns: {
        pattern: /\[m\]\[([^\]]*)\]\[([\s\S]+)\]/g,  // [m][params][content]
        html: '.marginalia-voice'                     // HTML elements
      },
      selectors: {
        container: '.post-content, .page-content',
        paragraphs: 'p, .marginalia-voice, blockquote, li, div',
        existingMarginalia: '.marginalia-voice'
      },
      classes: {
        marginalia: 'marginalia-voice',
        container: 'marginalia-container'
      },
      defaults: {
        voice: 1,
        fontScale: 1.0,
        width: 30,
        position: 'right'
      }
    },
    
    // Extension processor
    extensions: {
      formats: ['pattern'],
      patterns: {
        pattern: /\[\+\]\[([^\]]+)\]/g              // [+][content]
      },
      selectors: {
        container: '.post-content, .page-content',
        paragraphs: 'p, .marginalia-voice, blockquote, li'
      },
      classes: {
        trigger: 'extension-trigger',
        content: 'extension-content',
        box: 'paragraph-extension-box'
      }
    },
    
    // Deconstruction processor - radical text effects
    deconstruction: {
      formats: ['html'],
      patterns: {
        selector: '[data-deconstruct]',            // HTML elements with data-deconstruct attribute
        effectTypes: ['dissolve', 'collision', 'recursion', 'voices', 'temporal', 'syntax']
      },
      selectors: {
        container: '.post-content, .page-content',
        elements: '[data-deconstruct]'
      },
      classes: {
        base: 'deconstruct-element',
        dissolve: 'deconstruct-dissolve',
        collision: 'deconstruct-collision', 
        recursion: 'deconstruct-recursion',
        voices: 'deconstruct-voices',
        temporal: 'deconstruct-temporal',
        syntax: 'deconstruct-syntax'
      },
      effects: {
        enableDissolve: true,
        enableCollision: true,
        enableRecursion: true,
        enableVoices: true,
        enableTemporal: true,
        enableSyntax: true
      },
      performance: {
        useIntersectionObserver: true,
        effectThrottle: 16,                        // ms between effect updates
        maxActiveEffects: 10
      },
      accessibility: {
        respectReducedMotion: true,
        preserveReadability: true,
        provideStaticFallback: true
      }
    }
  },
  
  // ==========================================
  // GHOST THEME INTEGRATION  
  // ==========================================
  ghost: {
    // Theme settings from Ghost admin panel
    settings: window.ghost_custom_settings || {},
    
    // Ghost-specific selectors and constraints
    selectors: {
      contentContainer: '.post-content, .page-content',
      postContent: '.post-content',
      pageContent: '.page-content'
    },
    
    // Ghost editor compatibility
    editor: {
      htmlCardSupport: true,
      markdownSupport: true,
      customPatterns: true
    }
  },
  
  // ==========================================
  // THEME SYSTEM
  // ==========================================
  themes: {
    // Current active theme
    current: 'hacker',
    
    // Available themes
    available: {
      hacker: {
        name: 'Hacker',
        colors: {
          primary: '#00ff00',
          secondary: '#ff8800',
          background: '#000000',
          text: '#ffffff'
        },
        fonts: {
          mono: 'JetBrains Mono, monospace',
          serif: 'Georgia, serif'
        }
      },
      academic: {
        name: 'Academic', 
        colors: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          background: '#ffffff',
          text: '#374151'
        },
        fonts: {
          mono: 'JetBrains Mono, monospace',
          serif: 'Georgia, serif'
        }
      },
      minimal: {
        name: 'Minimal',
        colors: {
          primary: '#374151',
          secondary: '#dc2626',
          background: '#ffffff', 
          text: '#374151'
        },
        fonts: {
          mono: 'system-ui, monospace',
          serif: 'system-ui, serif'
        }
      }
    }
  },
  
  // ==========================================
  // GLOBAL SETTINGS
  // ==========================================
  global: {
    // Performance
    enableLazyLoading: false,
    processChunkSize: 50,
    enableIntersectionObserver: true,
    
    // Accessibility
    respectReducedMotion: true,
    enableHighContrast: false,
    enableKeyboardNavigation: true,
    
    // Debug
    enableLogging: false,
    logLevel: 'INFO',  // DEBUG, INFO, WARN, ERROR, SILENT
    enableDebugPanels: false
  },
  
  // ==========================================
  // INITIALIZATION CONTROL
  // ==========================================
  initialization: {
    // Processing order (critical for DOM stability)
    processorOrder: [
      'deconstruction',    // First: establish radical base
      'marginalia',        // Second: add marginal voices
      'extensions',        // Third: paragraph extensions
      'footnotes'          // Last: preserve tooltip functionality
    ],
    
    // Auto-initialization settings
    autoInitialize: true,
    waitForDOMReady: true,
    retryOnFailure: true,
    maxRetries: 3
  }
};

// ==========================================
// BACKWARDS COMPATIBILITY LAYER
// ==========================================

// Create compatibility aliases for existing code
window.CONTENT_ENHANCEMENT_FLAGS = {
  // Map new structure to old flags for backwards compatibility
  get USE_LEGACY_FOOTNOTES() {
    return !window.ThemeConfig.features.footnotes;
  },
  get ENABLE_FOOTNOTES() {
    return window.ThemeConfig.features.footnotes;
  },
  get ENABLE_MARGINALIA() {
    return window.ThemeConfig.features.marginalia;
  },
  get ENABLE_EXTENSIONS() {
    return window.ThemeConfig.features.extensions;
  },
  get ENABLE_DECONSTRUCTION() {
    return window.ThemeConfig.features.deconstruction;
  },
  get ENABLE_DEBUG_PANELS() {
    return window.ThemeConfig.features.debugMode;
  }
};

// Legacy ContentEnhancementConfig alias
window.ContentEnhancementConfig = window.ThemeConfig;

// Legacy DigitalTalmudFootnoteConfig alias
// Maps old footnote config structure to new unified config
window.DigitalTalmudFootnoteConfig = {
  behavior: window.ThemeConfig.processors.footnotes.behavior,
  themes: window.ThemeConfig.themes.available,
  processing: {
    footnotePattern: window.ThemeConfig.processors.footnotes.patterns.markdown,
    referenceAttribute: window.ThemeConfig.processors.footnotes.patterns.referenceAttribute,
    fallbackEnabled: false,
    sanitizeHTML: true
  },
  selectors: window.ThemeConfig.processors.footnotes.selectors,
  classes: window.ThemeConfig.processors.footnotes.classes,
  
  // Validation function expected by legacy code
  validate: function() {
    return true;
  }
};

// ==========================================
// CONFIGURATION VALIDATION & SETUP
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 ThemeConfig: Unified configuration system loaded');
  
  // Apply Ghost theme settings if available
  if (window.ghost_custom_settings) {
    console.log('👻 Integrating Ghost theme settings');
    
    // Apply theme selection from Ghost admin
    if (window.ghost_custom_settings.footnote_theme) {
      window.ThemeConfig.themes.current = window.ghost_custom_settings.footnote_theme;
    }
    
    // Apply feature flags from Ghost admin
    if (window.ghost_custom_settings.enable_extensions) {
      window.ThemeConfig.features.extensions = true;
    }
    
    if (window.ghost_custom_settings.enable_modern_footnotes) {
      window.ThemeConfig.features.footnotes = true;
    }
    
    if (window.ghost_custom_settings.enable_deconstruction) {
      window.ThemeConfig.features.deconstruction = true;
      console.log('🔥 Deconstruction effects enabled via Ghost settings');
    }
    
    if (window.ghost_custom_settings.debug_mode) {
      window.ThemeConfig.features.debugMode = true;
      window.ThemeConfig.global.enableLogging = true;
      window.ThemeConfig.global.logLevel = 'DEBUG';
    }
    
    // Apply CSS custom properties from Ghost settings
    if (window.ghost_custom_settings.primary_accent_color) {
      document.documentElement.style.setProperty(
        '--footnote-accent', 
        window.ghost_custom_settings.primary_accent_color
      );
    }
    
    if (window.ghost_custom_settings.extension_accent_color) {
      document.documentElement.style.setProperty(
        '--extension-accent',
        window.ghost_custom_settings.extension_accent_color
      );
    }
  }
  
  // Validate configuration
  if (!window.ThemeConfig.processors.footnotes.patterns.markdown) {
    console.error('❌ ThemeConfig: Invalid footnote pattern configuration');
  }
  
  console.log('✅ ThemeConfig: Configuration validated and ready');
  
  // Make debug functions available globally if debug mode enabled
  if (window.ThemeConfig.features.debugMode) {
    window.debugThemeConfig = () => {
      console.group('🔍 Theme Configuration Debug');
      console.log('Features:', window.ThemeConfig.features);
      console.log('Ghost Settings:', window.ThemeConfig.ghost.settings);
      console.log('Current Theme:', window.ThemeConfig.themes.current);
      console.log('Processor Order:', window.ThemeConfig.initialization.processorOrder);
      console.groupEnd();
    };
    
    console.log('🐛 Debug mode enabled. Use debugThemeConfig() to inspect configuration.');
  }
});