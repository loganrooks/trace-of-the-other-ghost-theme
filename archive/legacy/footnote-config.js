/**
 * Digital Talmud Footnote System Configuration
 * Separates configuration from implementation for better maintainability
 */

window.DigitalTalmudFootnoteConfig = {
  // Behavior Configuration
  behavior: {
    enableTooltips: true,
    enableSmoothScrolling: true,
    tooltipDelay: 150,
    scrollOffset: 'center',
    enableKeyboardNav: true,
    enableProgressiveEnhancement: false
  },

  // Visual Theme Configuration (CSS Custom Properties)
  themes: {
    'hacker': {
      '--footnote-accent': '#00ff00',
      '--footnote-accent-dark': '#008800',
      '--footnote-accent-alpha': 'rgba(0, 255, 0, 0.1)',
      '--footnote-font': "'JetBrains Mono', monospace",
      '--footnote-bg': 'rgba(0, 0, 0, 0.95)',
      '--footnote-border': '1px solid var(--footnote-accent-dark)'
    },
    'academic': {
      '--footnote-accent': '#2563eb',
      '--footnote-accent-dark': '#1e40af',
      '--footnote-accent-alpha': 'rgba(37, 99, 235, 0.1)',
      '--footnote-font': 'Georgia, serif',
      '--footnote-bg': 'rgba(255, 255, 255, 0.95)',
      '--footnote-border': '1px solid var(--footnote-accent-dark)'
    },
    'minimal': {
      '--footnote-accent': '#374151',
      '--footnote-accent-dark': '#111827',
      '--footnote-accent-alpha': 'rgba(55, 65, 81, 0.1)',
      '--footnote-font': 'system-ui, sans-serif',
      '--footnote-bg': 'rgba(249, 250, 251, 0.95)',
      '--footnote-border': '1px solid var(--footnote-accent-dark)'
    }
  },

  // Content Processing Configuration
  processing: {
    footnotePattern: /\[\^(\d+)\]/g,
    referenceAttribute: 'data-ref',
    fallbackEnabled: false, // DISABLE progressive enhancement fallback
    sanitizeHTML: true,
    allowedTags: ['strong', 'em', 'code', 'a', 'ul', 'ol', 'li', 'blockquote', 'cite', 'br'],
    maxTooltipWidth: 320,
    maxFootnoteLength: 1000
  },

  // Accessibility Configuration
  accessibility: {
    addAriaLabels: true,
    enableHighContrast: true,
    respectReducedMotion: true,
    enableScreenReader: true,
    focusManagement: true
  },

  // CSS Class Names (for easy customization)
  classes: {
    footnoteRef: 'footnote-ref',
    footnoteLink: 'footnote-link',
    footnoteCollection: 'footnote-collection',
    footnoteItem: 'footnote-item',
    footnoteTooltip: 'footnote-tooltip',
    footnoteBackref: 'footnote-backref',
    systemEnhanced: 'footnote-system-enhanced'
  },

  // Selectors Configuration
  selectors: {
    container: '.post-content, .page-content',
    paragraphs: 'p, .marginalia-voice, blockquote, li', // Expanded to include marginalia and other text elements
    footnoteCards: '[data-ref]',
    footnoteSearchScope: 'article, .gh-content, .post-content, .page-content, main', // Broader search for footnote content
    marginalia: '.marginalia-voice'
  },

  // Apply theme to document
  applyTheme: function(themeName = 'hacker') {
    const theme = this.themes[themeName];
    if (!theme) {
      console.warn(`[FOOTNOTE_CONFIG] Theme "${themeName}" not found`);
      return;
    }

    const root = document.documentElement;
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    console.log(`[FOOTNOTE_CONFIG] Applied theme: ${themeName}`);
  },

  // Validate configuration
  validate: function() {
    const required = ['behavior', 'themes', 'processing', 'accessibility', 'classes', 'selectors'];
    const missing = required.filter(key => !this.hasOwnProperty(key));
    
    if (missing.length > 0) {
      console.error('[FOOTNOTE_CONFIG] Missing configuration sections:', missing);
      return false;
    }

    console.log('[FOOTNOTE_CONFIG] Configuration valid');
    return true;
  }
};

// Auto-apply default theme
document.addEventListener('DOMContentLoaded', () => {
  window.DigitalTalmudFootnoteConfig.applyTheme('hacker');
});