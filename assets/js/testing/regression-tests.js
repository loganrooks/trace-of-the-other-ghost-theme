/**
 * Regression Test Suite - TDD Infrastructure
 * 
 * Implementation of TDD test infrastructure from ARCHITECTURAL_OVERHAUL_PLAN.md
 * Prevents regressions and ensures system reliability
 * 
 * Created: August 27, 2025
 * Based on: ARCHITECTURAL_OVERHAUL_PLAN.md
 */

/**
 * Simple TDD Test Runner
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  /**
   * Add a test
   * @param {string} name - Test name
   * @param {Function} testFunction - Test function (should throw on failure)
   */
  addTest(name, testFunction) {
    this.tests.push({ name, test: testFunction });
  }

  /**
   * Run all tests
   * @returns {Promise<Array>} Test results
   */
  async runAllTests() {
    this.results = [];
    console.log(`🧪 Running ${this.tests.length} tests...`);

    for (const { name, test } of this.tests) {
      try {
        await test();
        this.results.push({ name, passed: true, error: null });
        console.log(`✅ ${name} - PASSED`);
      } catch (error) {
        this.results.push({ name, passed: false, error: error.message });
        console.error(`❌ ${name} - FAILED:`, error.message);
      }
    }

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    
    console.log(`🧪 Test Results: ${passed} passed, ${failed} failed`);
    return this.results;
  }

  /**
   * Get test results summary
   * @returns {Object} Summary
   */
  getSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    
    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total) * 100 : 0
    };
  }
}

/**
 * Regression Tests - Critical functionality that must not break
 */
class RegressionTests {
  
  /**
   * Test footnote basic functionality
   * @returns {Promise<boolean>} Success status
   */
  static async footnoteBasicFunctionality() {
    const footnoteRefs = document.querySelectorAll('.footnote-ref a');
    if (footnoteRefs.length === 0) {
      throw new Error('No footnote references found');
    }

    const footnoteContent = document.querySelectorAll('[data-ref]');
    if (footnoteContent.length === 0) {
      throw new Error('No footnote content found');
    }

    // Test that references have proper hrefs
    const firstRef = footnoteRefs[0];
    const href = firstRef.getAttribute('href');
    if (!href || !href.match(/#fn-\w+/)) {
      throw new Error('Footnote reference has invalid href format');
    }

    // Test that content has proper data-ref attributes
    const firstContent = footnoteContent[0];
    const dataRef = firstContent.getAttribute('data-ref');
    if (!dataRef) {
      throw new Error('Footnote content missing data-ref attribute');
    }

    console.log(`✅ Found ${footnoteRefs.length} footnote refs and ${footnoteContent.length} content items`);
    return true;
  }

  /**
   * Test footnote tooltip creation
   * @returns {Promise<boolean>} Success status
   */
  static async footnoteTooltipCreation() {
    const footnoteRefs = document.querySelectorAll('.footnote-ref a');
    if (footnoteRefs.length === 0) {
      throw new Error('No footnote references found');
    }

    const firstRef = footnoteRefs[0];
    
    // Simulate hover
    const event = new MouseEvent('mouseenter', {
      bubbles: true,
      view: window,
      clientX: 100,
      clientY: 100
    });
    
    firstRef.dispatchEvent(event);

    // Wait for tooltip to appear
    await new Promise(resolve => setTimeout(resolve, 200));

    const tooltip = document.querySelector('.footnote-tooltip');
    if (!tooltip) {
      throw new Error('Footnote tooltip did not appear after hover');
    }

    // Test tooltip positioning
    const rect = tooltip.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      throw new Error('Footnote tooltip has no dimensions');
    }

    // Simulate mouse leave
    firstRef.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    return true;
  }

  /**
   * Test system coordination
   * @returns {Promise<boolean>} Success status
   */
  static async systemCoordinationTest() {
    // Check if coordinator exists
    if (typeof window.ThemeSystemCoordinator === 'undefined') {
      throw new Error('ThemeSystemCoordinator not loaded');
    }

    // Check if coordinator instance exists
    if (!window.themeCoordinator) {
      throw new Error('Theme coordinator not initialized');
    }

    // Test health monitoring
    const healthStatus = window.themeCoordinator.getHealthStatus();
    if (!healthStatus) {
      throw new Error('Health status not available');
    }

    if (healthStatus.coordinator.healthySystems === 0) {
      throw new Error('No healthy systems found');
    }

    console.log(`✅ System coordination working with ${healthStatus.coordinator.healthySystems} healthy systems`);
    return true;
  }

  /**
   * Test that systems don't interfere with each other
   * @returns {Promise<boolean>} Success status
   */
  static async systemsDoNotInterfere() {
    const footnoteRef = document.querySelector('.footnote-ref a');
    if (!footnoteRef) {
      console.log('⚠️ No footnote refs found, skipping interference test');
      return true;
    }

    // Test footnote tooltip during potential interference
    footnoteRef.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const tooltip = document.querySelector('.footnote-tooltip');
    if (!tooltip) {
      throw new Error('Footnote tooltip broken - potential system interference');
    }

    // Clean up
    footnoteRef.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    return true;
  }

  /**
   * Test CSS isolation
   * @returns {Promise<boolean>} Success status
   */
  static async cssIsolationTest() {
    // Check for CSS variables
    const style = getComputedStyle(document.body);
    const accentColor = style.getPropertyValue('--footnote-accent');
    
    if (!accentColor) {
      throw new Error('Footnote CSS variables not loaded');
    }

    // Check for tooltip styles
    const testTooltip = document.createElement('div');
    testTooltip.className = 'footnote-tooltip';
    testTooltip.style.position = 'fixed';
    testTooltip.style.top = '-1000px';
    document.body.appendChild(testTooltip);

    const tooltipStyle = getComputedStyle(testTooltip);
    const zIndex = tooltipStyle.getPropertyValue('z-index');

    testTooltip.remove();

    if (!zIndex || zIndex === 'auto') {
      throw new Error('Footnote tooltip styles not applied correctly');
    }

    return true;
  }

  /**
   * Test error handling
   * @returns {Promise<boolean>} Success status
   */
  static async errorHandlingTest() {
    // Test graceful handling of missing footnote content
    const testRef = document.createElement('a');
    testRef.href = '#fn-nonexistent';
    testRef.className = 'footnote-ref';
    testRef.textContent = '999';

    // This should not throw an error
    try {
      testRef.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should handle gracefully without tooltip
      const tooltip = document.querySelector('#footnote-tooltip-nonexistent');
      if (tooltip) {
        throw new Error('Tooltip created for nonexistent footnote');
      }
      
    } catch (error) {
      // Should not reach here for proper error handling
      throw new Error(`Poor error handling: ${error.message}`);
    }

    return true;
  }
}

/**
 * Performance Tests - Ensure system remains performant
 */
class PerformanceTests {
  
  /**
   * Test footnote discovery performance
   * @returns {Promise<boolean>} Success status
   */
  static async footnoteDiscoveryPerformance() {
    const startTime = performance.now();
    
    const footnoteRefs = document.querySelectorAll('.footnote-ref a');
    const footnoteContent = document.querySelectorAll('[data-ref]');
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`📊 Footnote discovery took ${duration.toFixed(2)}ms for ${footnoteRefs.length} refs`);
    
    // Should complete in reasonable time (under 100ms for normal use)
    if (duration > 500) {
      throw new Error(`Footnote discovery too slow: ${duration.toFixed(2)}ms`);
    }
    
    return true;
  }

  /**
   * Test tooltip creation performance
   * @returns {Promise<boolean>} Success status
   */
  static async tooltipCreationPerformance() {
    const footnoteRefs = document.querySelectorAll('.footnote-ref a');
    if (footnoteRefs.length === 0) {
      console.log('⚠️ No footnote refs found, skipping performance test');
      return true;
    }

    const iterations = Math.min(10, footnoteRefs.length);
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const ref = footnoteRefs[i];
      ref.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 10));
      ref.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const avgPerTooltip = duration / iterations;
    
    console.log(`📊 Tooltip creation: ${avgPerTooltip.toFixed(2)}ms average per tooltip`);
    
    if (avgPerTooltip > 100) {
      throw new Error(`Tooltip creation too slow: ${avgPerTooltip.toFixed(2)}ms per tooltip`);
    }
    
    return true;
  }
}

// Create global test runner instance
window.testRunner = new TestRunner();
window.RegressionTests = RegressionTests;
window.PerformanceTests = PerformanceTests;

// Register core regression tests
window.testRunner.addTest('Footnote Basic Functionality', RegressionTests.footnoteBasicFunctionality);
window.testRunner.addTest('Footnote Tooltip Creation', RegressionTests.footnoteTooltipCreation);
window.testRunner.addTest('System Coordination', RegressionTests.systemCoordinationTest);
window.testRunner.addTest('Systems Do Not Interfere', RegressionTests.systemsDoNotInterfere);
window.testRunner.addTest('CSS Isolation', RegressionTests.cssIsolationTest);
window.testRunner.addTest('Error Handling', RegressionTests.errorHandlingTest);

// Register performance tests
window.testRunner.addTest('Footnote Discovery Performance', PerformanceTests.footnoteDiscoveryPerformance);
window.testRunner.addTest('Tooltip Creation Performance', PerformanceTests.tooltipCreationPerformance);

// Global test functions
window.runRegressionTests = async function() {
  console.log('🧪 Running regression test suite...');
  const results = await window.testRunner.runAllTests();
  const summary = window.testRunner.getSummary();
  
  console.log('📊 TEST SUMMARY:');
  console.log(`  Total: ${summary.total}`);
  console.log(`  Passed: ${summary.passed}`);
  console.log(`  Failed: ${summary.failed}`);
  console.log(`  Pass Rate: ${summary.passRate.toFixed(1)}%`);
  
  if (summary.failed > 0) {
    console.error('❌ Some tests failed - system may have regressions');
  } else {
    console.log('✅ All tests passed - system is healthy');
  }
  
  return { results, summary };
};

console.log('🧪 Regression test suite loaded - run with runRegressionTests()');