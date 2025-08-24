/**
 * Unit Tests - ContentProcessor Base Class
 * Tests abstract base class functionality and contract enforcement
 * 
 * Created: August 23, 2025
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = window.document;
global.window = window;
global.performance = { now: () => Date.now() };

// Import the class to test
const { ContentProcessor } = require('../../assets/js/content-processor-base.js');

describe('ContentProcessor Base Class', () => {
  let mockConfig;
  let mockContainer;

  beforeEach(() => {
    // Set up test fixtures
    mockConfig = {
      processing: { sanitizeHTML: true },
      global: { theme: 'hacker' }
    };
    
    mockContainer = document.createElement('div');
    mockContainer.className = 'test-container';
  });

  describe('Abstract Class Enforcement', () => {
    test('cannot be instantiated directly', () => {
      expect(() => {
        new ContentProcessor(mockConfig, mockContainer);
      }).toThrow('ContentProcessor is abstract and cannot be instantiated directly');
    });

    test('requires subclass to implement required methods', () => {
      class IncompleteProcessor extends ContentProcessor {}
      
      expect(() => {
        new IncompleteProcessor(mockConfig, mockContainer);
      }).toThrow('IncompleteProcessor must implement: init, process, cleanup');
    });

    test('allows valid subclass instantiation', () => {
      class ValidProcessor extends ContentProcessor {
        async init() { return true; }
        process() {}
        cleanup() {}
      }
      
      expect(() => {
        new ValidProcessor(mockConfig, mockContainer);
      }).not.toThrow();
    });
  });

  describe('Base Functionality', () => {
    let processor;

    beforeEach(() => {
      class TestProcessor extends ContentProcessor {
        async init() {
          await this.baseInit();
          return true;
        }
        process() {
          this.incrementProcessed();
        }
        cleanup() {
          this.baseCleanup();
        }
      }
      
      processor = new TestProcessor(mockConfig, mockContainer);
    });

    test('initializes with correct default state', () => {
      expect(processor.initialized).toBe(false);
      expect(processor.config).toBe(mockConfig);
      expect(processor.container).toBe(mockContainer);
      expect(processor.statistics.processed).toBe(0);
      expect(processor.statistics.errors).toBe(0);
    });

    test('baseInit sets initialized state and statistics', async () => {
      await processor.init();
      
      expect(processor.initialized).toBe(true);
      expect(processor.statistics.startTime).toBeTruthy();
    });

    test('getStats returns complete statistics', async () => {
      await processor.init();
      processor.process();
      
      const stats = processor.getStats();
      
      expect(stats).toHaveProperty('processed', 1);
      expect(stats).toHaveProperty('errors', 0);
      expect(stats).toHaveProperty('isInitialized', true);
      expect(stats).toHaveProperty('processorType', 'TestProcessor');
      expect(stats).toHaveProperty('startTime');
    });
  });

  describe('Utility Methods', () => {
    let processor;

    beforeEach(() => {
      class TestProcessor extends ContentProcessor {
        async init() { return true; }
        process() {}
        cleanup() {}
      }
      
      processor = new TestProcessor(mockConfig, mockContainer);
    });

    test('createElement creates element with class', () => {
      const element = processor.createElement('div', 'test-class');
      
      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('test-class');
    });

    test('setAttributes sets multiple attributes', () => {
      const element = document.createElement('div');
      processor.setAttributes(element, {
        'id': 'test-id',
        'data-test': 'test-value'
      });
      
      expect(element.id).toBe('test-id');
      expect(element.getAttribute('data-test')).toBe('test-value');
    });

    test('setStyles sets multiple CSS properties', () => {
      const element = document.createElement('div');
      processor.setStyles(element, {
        'color': 'red',
        'fontSize': '16px'
      });
      
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
    });

    test('sanitizeHTML removes dangerous content when enabled', () => {
      const dangerousHTML = '<script>alert("xss")</script><p>Safe content</p>';
      const cleaned = processor.sanitizeHTML(dangerousHTML);
      
      expect(cleaned).not.toContain('<script>');
      expect(cleaned).toContain('Safe content');
    });

    test('sanitizeHTML passes through content when disabled', () => {
      processor.config.processing.sanitizeHTML = false;
      const html = '<script>alert("xss")</script><p>Content</p>';
      const result = processor.sanitizeHTML(html);
      
      expect(result).toBe(html);
    });
  });

  describe('Container Interaction', () => {
    let processor;

    beforeEach(() => {
      class TestProcessor extends ContentProcessor {
        async init() { return true; }
        process() {}
        cleanup() {}
      }
      
      // Set up container with test content
      mockContainer.innerHTML = `
        <p class="test-paragraph">Test content</p>
        <div class="test-div">Another element</div>
      `;
      
      processor = new TestProcessor(mockConfig, mockContainer);
    });

    test('findInContainer finds element within container', () => {
      const found = processor.findInContainer('.test-paragraph');
      
      expect(found).toBeTruthy();
      expect(found.textContent).toBe('Test content');
    });

    test('findAllInContainer finds multiple elements', () => {
      const found = processor.findAllInContainer('.test-paragraph, .test-div');
      
      expect(found).toHaveLength(2);
    });

    test('shouldProcess returns true for elements in container', () => {
      const testElement = mockContainer.querySelector('.test-paragraph');
      
      expect(processor.shouldProcess(testElement)).toBe(true);
    });

    test('shouldProcess returns false for elements outside container', () => {
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      
      expect(processor.shouldProcess(outsideElement)).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('baseInit throws error without config', async () => {
      class TestProcessor extends ContentProcessor {
        async init() {
          await this.baseInit();
          return true;
        }
        process() {}
        cleanup() {}
      }
      
      const processor = new TestProcessor(null, mockContainer);
      
      await expect(processor.init()).rejects.toThrow('Configuration is required');
    });

    test('baseInit throws error without container', async () => {
      class TestProcessor extends ContentProcessor {
        async init() {
          await this.baseInit();
          return true;
        }
        process() {}
        cleanup() {}
      }
      
      const processor = new TestProcessor(mockConfig, null);
      
      await expect(processor.init()).rejects.toThrow('Container element is required');
    });
  });
});

module.exports = {
  // Export test utilities for other test files
  createMockConfig: () => ({
    processing: { sanitizeHTML: true },
    global: { theme: 'hacker' },
    patterns: {
      footnotePattern: /\[\^(\d+)\]/g,
      extensionPattern: /\[\+\]\[((?:[^\[\]]|\[[^\]]*\])*)\]/g
    }
  }),
  
  createMockContainer: () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    return container;
  }
};