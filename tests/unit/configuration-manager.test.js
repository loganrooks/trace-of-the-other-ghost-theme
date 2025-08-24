/**
 * Unit Tests - Configuration Manager
 * Tests unified configuration management and workflow philosophy preservation
 * 
 * Created: August 23, 2025
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = window.document;
global.window = window;

// Import the class to test
const ConfigurationManager = require('../../assets/js/configuration-manager.js');

describe('Configuration Manager', () => {
  let configManager;
  let mockConfig;

  beforeEach(() => {
    // Clear global config
    delete window.ContentEnhancementConfig;
    delete window.DigitalTalmudFootnoteConfig;
    
    // Set up test configuration
    mockConfig = {
      global: {
        theme: 'hacker',
        container: '.post-content',
        debug: false
      },
      processors: {
        footnotes: {
          behavior: { enableTooltips: true },
          patterns: {
            footnotePattern: /\[\^(\d+)\]/g,
            referenceAttribute: 'data-ref'
          },
          classes: { footnoteLink: 'footnote-link' }
        },
        extensions: {
          behavior: { enableAnimations: true },
          patterns: {
            extensionPattern: /\[\+\]\[((?:[^\[\]]|\[[^\]]*\])*)\]/g
          }
        }
      },
      themes: {
        hacker: {
          '--primary-accent': '#00ff00',
          '--extension-accent': '#ff8800'
        }
      }
    };
  });

  describe('Initialization', () => {
    test('initializes with provided configuration', () => {
      configManager = new ConfigurationManager(mockConfig);
      
      expect(configManager.config).toBe(mockConfig);
      expect(configManager.initialized).toBe(false);
      expect(configManager.processors).toBeInstanceOf(Map);
    });

    test('falls back to default configuration when none provided', () => {
      configManager = new ConfigurationManager();
      
      expect(configManager.config).toBeTruthy();
      expect(configManager.config.global).toBeTruthy();
      expect(configManager.config.processors).toBeTruthy();
      expect(configManager.config.themes).toBeTruthy();
    });

    test('converts legacy configuration format', () => {
      // Set up legacy config
      window.DigitalTalmudFootnoteConfig = {
        behavior: { enableTooltips: true },
        selectors: { container: '.post-content' },
        classes: { footnoteLink: 'footnote-link' },
        themes: { hacker: { '--footnote-accent': '#00ff00' } }
      };
      
      configManager = new ConfigurationManager();
      
      expect(configManager.config.global).toBeTruthy();
      expect(configManager.config.processors.footnotes).toBeTruthy();
      expect(configManager.config.processors.footnotes.behavior.enableTooltips).toBe(true);
    });

    test('init validates configuration and applies theme', () => {
      configManager = new ConfigurationManager(mockConfig);
      
      const result = configManager.init();
      
      expect(result).toBe(true);
      expect(configManager.initialized).toBe(true);
    });
  });

  describe('Processor Configuration', () => {
    beforeEach(() => {
      configManager = new ConfigurationManager(mockConfig);
      configManager.init();
    });

    test('getProcessorConfig merges global and processor settings', () => {
      const footnoteConfig = configManager.getProcessorConfig('footnotes');
      
      expect(footnoteConfig.theme).toBe('hacker');
      expect(footnoteConfig.container).toBe('.post-content');
      expect(footnoteConfig.behavior.enableTooltips).toBe(true);
      expect(footnoteConfig.classes.footnoteLink).toBe('footnote-link');
    });

    test('includes default patterns preserving editor workflow', () => {
      const footnoteConfig = configManager.getProcessorConfig('footnotes');
      
      expect(footnoteConfig.patterns.footnotePattern).toEqual(/\[\^(\d+)\]/g);
      expect(footnoteConfig.patterns.extensionPattern).toEqual(/\[\+\]\[((?:[^\[\]]|\[[^\]]*\])*)\]/g);
    });

    test('processor-specific config overrides global settings', () => {
      // Add processor-specific override
      mockConfig.processors.footnotes.debug = true;
      configManager = new ConfigurationManager(mockConfig);
      
      const config = configManager.getProcessorConfig('footnotes');
      
      expect(config.debug).toBe(true); // Processor override
      expect(config.theme).toBe('hacker'); // Global setting
    });

    test('returns empty config for unknown processor with defaults', () => {
      const unknownConfig = configManager.getProcessorConfig('unknown');
      
      expect(unknownConfig.theme).toBe('hacker'); // Global default
      expect(unknownConfig.patterns.footnotePattern).toEqual(/\[\^(\d+)\]/g);
    });
  });

  describe('Processor Registration', () => {
    beforeEach(() => {
      configManager = new ConfigurationManager(mockConfig);
    });

    test('registers and retrieves processors', () => {
      const mockProcessor = { name: 'TestProcessor' };
      
      configManager.registerProcessor('test', mockProcessor);
      
      expect(configManager.getProcessor('test')).toBe(mockProcessor);
      expect(configManager.processors.size).toBe(1);
    });

    test('returns null for unregistered processor', () => {
      expect(configManager.getProcessor('nonexistent')).toBeNull();
    });
  });

  describe('Theme Management', () => {
    beforeEach(() => {
      configManager = new ConfigurationManager(mockConfig);
      // Mock document.documentElement.style
      document.documentElement.style = {
        setProperty: jest.fn()
      };
    });

    test('applies theme to document root', () => {
      configManager.applyTheme('hacker');
      
      expect(document.documentElement.style.setProperty)
        .toHaveBeenCalledWith('--primary-accent', '#00ff00');
      expect(document.documentElement.style.setProperty)
        .toHaveBeenCalledWith('--extension-accent', '#ff8800');
    });

    test('updates global theme setting when applied', () => {
      configManager.applyTheme('hacker');
      
      expect(configManager.config.global.theme).toBe('hacker');
    });

    test('warns for unknown theme', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      configManager.applyTheme('unknown');
      
      expect(consoleSpy).toHaveBeenCalledWith('[CONFIG_MANAGER] Theme "unknown" not found');
      consoleSpy.mockRestore();
    });
  });

  describe('Configuration Validation', () => {
    test('validates complete configuration structure', () => {
      configManager = new ConfigurationManager(mockConfig);
      
      expect(configManager.validate()).toBe(true);
    });

    test('fails validation for missing required sections', () => {
      const incompleteConfig = { global: {} }; // Missing processors and themes
      configManager = new ConfigurationManager(incompleteConfig);
      
      expect(configManager.validate()).toBe(false);
    });

    test('validates footnote pattern preserves editor workflow', () => {
      const invalidConfig = {
        ...mockConfig,
        processors: {
          ...mockConfig.processors,
          footnotes: {
            patterns: {
              footnotePattern: /invalid-pattern/g // Doesn't preserve [^N] syntax
            }
          }
        }
      };
      
      configManager = new ConfigurationManager(invalidConfig);
      
      expect(configManager.validate()).toBe(false);
    });

    test('validates extension pattern preserves editor workflow', () => {
      const invalidConfig = {
        ...mockConfig,
        processors: {
          ...mockConfig.processors,
          extensions: {
            patterns: {
              extensionPattern: /invalid-pattern/g // Doesn't preserve [+] syntax
            }
          }
        }
      };
      
      configManager = new ConfigurationManager(invalidConfig);
      
      expect(configManager.validate()).toBe(false);
    });
  });

  describe('Runtime Configuration Updates', () => {
    beforeEach(() => {
      configManager = new ConfigurationManager(mockConfig);
    });

    test('updates nested configuration values', () => {
      const result = configManager.updateConfig('global.debug', true);
      
      expect(result).toBe(true);
      expect(configManager.config.global.debug).toBe(true);
    });

    test('updates processor-specific settings', () => {
      const result = configManager.updateConfig('processors.footnotes.behavior.enableTooltips', false);
      
      expect(result).toBe(true);
      expect(configManager.config.processors.footnotes.behavior.enableTooltips).toBe(false);
    });

    test('creates nested paths that do not exist', () => {
      const result = configManager.updateConfig('new.nested.setting', 'value');
      
      expect(result).toBe(true);
      expect(configManager.config.new.nested.setting).toBe('value');
    });

    test('handles update errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Force an error by making config non-extensible
      Object.freeze(configManager.config);
      const result = configManager.updateConfig('global.theme', 'academic');
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Debug Information', () => {
    beforeEach(() => {
      configManager = new ConfigurationManager(mockConfig);
      configManager.init();
    });

    test('provides comprehensive debug information', () => {
      const mockProcessor = { name: 'TestProcessor' };
      configManager.registerProcessor('test', mockProcessor);
      
      const debug = configManager.debug();
      
      expect(debug).toHaveProperty('initialized', true);
      expect(debug).toHaveProperty('configKeys');
      expect(debug).toHaveProperty('processorCount', 1);
      expect(debug).toHaveProperty('registeredProcessors', ['test']);
      expect(debug).toHaveProperty('currentTheme', 'hacker');
      expect(debug).toHaveProperty('patterns');
      expect(debug.patterns).toHaveProperty('footnote');
      expect(debug.patterns).toHaveProperty('extension');
    });
  });

  describe('Editor Workflow Philosophy Preservation', () => {
    test('default config preserves simple typeable patterns', () => {
      configManager = new ConfigurationManager();
      const footnoteConfig = configManager.getProcessorConfig('footnotes');
      const extensionConfig = configManager.getProcessorConfig('extensions');
      
      // Footnote pattern should allow [^1], [^2], etc.
      expect('[^1]'.match(footnoteConfig.patterns.footnotePattern)).toBeTruthy();
      expect('[^123]'.match(footnoteConfig.patterns.footnotePattern)).toBeTruthy();
      
      // Extension pattern should allow [+][content]
      expect('[+][Simple content]'.match(extensionConfig.patterns.extensionPattern)).toBeTruthy();
      expect('[+][Complex [nested] content]'.match(extensionConfig.patterns.extensionPattern)).toBeTruthy();
    });

    test('legacy conversion maintains workflow patterns', () => {
      window.DigitalTalmudFootnoteConfig = {
        processing: {
          footnotePattern: /\[\^(\d+)\]/g
        }
      };
      
      configManager = new ConfigurationManager();
      const config = configManager.getProcessorConfig('footnotes');
      
      expect(config.patterns.footnotePattern.source).toContain('\\[\\^');
    });
  });
});

// Export test utilities
module.exports = {
  createMockConfig: () => ({
    global: {
      theme: 'hacker',
      container: '.post-content'
    },
    processors: {
      footnotes: {
        patterns: { footnotePattern: /\[\^(\d+)\]/g }
      }
    },
    themes: {
      hacker: { '--primary-accent': '#00ff00' }
    }
  })
};