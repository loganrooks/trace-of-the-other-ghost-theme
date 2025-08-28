/**
 * Marginalia Width Debugging System
 * 
 * Comprehensive debugging tool for marginalia width processing issues
 * Tests pattern matching, parameter parsing, CSS application, and rendering
 * 
 * Usage: DebugMarginaliaWidths.runFullDiagnostic()
 */

window.DebugMarginaliaWidths = {
  
  /**
   * Run complete diagnostic on marginalia width processing
   */
  runFullDiagnostic() {
    console.group('[MARGINALIA_WIDTH_DEBUG] Full Diagnostic Starting...');
    
    const results = {
      patternMatching: this.testPatternMatching(),
      parameterParsing: this.testParameterParsing(),
      cssApplication: this.testCSSApplication(),
      renderingIssues: this.testRenderingIssues(),
      cssRules: this.testCSSRules()
    };
    
    console.log('=== DIAGNOSTIC SUMMARY ===');
    Object.entries(results).forEach(([test, result]) => {
      console.log(`${test}: ${result.status}`, result.issues?.length ? result.issues : 'No issues found');
    });
    
    console.groupEnd();
    return results;
  },

  /**
   * Test pattern matching with problematic examples
   */
  testPatternMatching() {
    console.group('[PATTERN_MATCHING] Testing marginalia pattern recognition...');
    
    const problematicExamples = [
      '[m][2 1.2 28 r][Perhaps the most honest position is Darwish\'s: "I have learned and dismantled all the words in order to draw from them a / single word: Home."[^70] \nThe dismantling is never complete, the home never simply present.]',
      '[m][2 1.1 28 l][And Derrida? He demystifies presence itself but mystifies the "perhaps," the "à venir," as if undecidability were a kind of decision, as if the impossibility of justice were its possibility. Every critique generates its own ghosts.]',
      '[m][1 1.3 38 r][Posted to Instagram, 11:47 PM. By midnight, the exclusions were unbearable. Every name invoked—Kant, Hegel, Derrida—summoned a hundred unnamed others. The comment that triggered the break: "Where is Fanon? Where is Said? Where is Darwish? Are Palestinians only objects of analysis, never subjects of thought?"]',
      '[m][4 1.7 55 r][The text stops. What follows are fragments, traces of an interruption that occurred between posting and returning. The typography itself bears witness to a violence discovered too late.]',
      '[m][3 1.2 22 r][Palestinian ID cards: Green for West Bank. Blue for Gaza. Orange for residents of Jerusalem who are not citizens. Each color marks a different degree of rightlessness. Arendt would recognize this taxonomy immediately.]'
    ];

    const pattern = /\[m\]\[([^\]]*)\]\[([\s\S]+)\]/g;
    const issues = [];
    const matches = [];

    problematicExamples.forEach((example, index) => {
      console.log(`Testing example ${index + 1}:`, example.substring(0, 50) + '...');
      
      const match = pattern.exec(example);
      pattern.lastIndex = 0; // Reset regex
      
      if (match) {
        matches.push({
          example: index + 1,
          params: match[1],
          content: match[2].substring(0, 100) + '...',
          fullMatch: match[0].length
        });
        console.log(`✓ Match found - params: "${match[1]}", content length: ${match[2].length}`);
      } else {
        issues.push(`Example ${index + 1}: Pattern did not match`);
        console.error(`✗ No match found for example ${index + 1}`);
      }
    });

    console.log('Pattern matches found:', matches);
    console.groupEnd();

    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues,
      matches: matches
    };
  },

  /**
   * Test parameter parsing with width values
   */
  testParameterParsing() {
    console.group('[PARAMETER_PARSING] Testing width parameter parsing...');
    
    const testCases = [
      { params: '2 1.2 28 r', expectedWidth: 28 },
      { params: '2 1.1 28 l', expectedWidth: 28 },
      { params: '1 1.3 38 r', expectedWidth: 38 },
      { params: '4 1.7 55 r', expectedWidth: 55 },
      { params: '3 1.2 22 r', expectedWidth: 22 },
      { params: '1', expectedWidth: 30 }, // default
      { params: '2 1.5', expectedWidth: 30 }, // default
      { params: '2 1.5 invalid', expectedWidth: 30 }, // invalid should use default
    ];

    const issues = [];
    const results = [];

    // Mock the parsing functions from marginalia processor
    const parseWidth = (value) => {
      if (!value) return 30; // default
      const width = parseInt(value);
      return (width >= 5 && width <= 90) ? width : 30; // default
    };

    const parseMarginaliaParams = (params) => {
      const parts = params.trim().split(/\s+/);
      return {
        voice: parseInt(parts[0]) || 1,
        fontScale: parseFloat(parts[1]) || 1.0,
        width: parseWidth(parts[2]),
        position: parts[3] || 'right'
      };
    };

    testCases.forEach((testCase, index) => {
      console.log(`Testing params: "${testCase.params}"`);
      
      const parsed = parseMarginaliaParams(testCase.params);
      results.push({
        testCase: index + 1,
        params: testCase.params,
        parsed: parsed,
        expected: testCase.expectedWidth,
        actual: parsed.width,
        correct: parsed.width === testCase.expectedWidth
      });

      if (parsed.width !== testCase.expectedWidth) {
        issues.push(`Test ${index + 1}: Expected width ${testCase.expectedWidth}, got ${parsed.width}`);
        console.error(`✗ Width mismatch - expected: ${testCase.expectedWidth}, got: ${parsed.width}`);
      } else {
        console.log(`✓ Width parsed correctly: ${parsed.width}`);
      }
    });

    console.log('Parsing results:', results);
    console.groupEnd();

    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues,
      results: results
    };
  },

  /**
   * Test CSS application and data attributes
   */
  testCSSApplication() {
    console.group('[CSS_APPLICATION] Testing marginalia CSS application...');
    
    const marginalia = document.querySelectorAll('.marginalia-voice');
    const issues = [];
    const elementData = [];

    console.log(`Found ${marginalia.length} marginalia elements`);

    marginalia.forEach((element, index) => {
      const data = {
        index: index + 1,
        voice: element.dataset.voice,
        fontScale: element.dataset.fontScale,
        width: element.dataset.width,
        position: element.dataset.position,
        marginaliaId: element.dataset.marginaliaId,
        computedStyles: {}
      };

      // Get computed styles
      const computed = window.getComputedStyle(element);
      data.computedStyles = {
        width: computed.width,
        maxWidth: computed.maxWidth,
        fontSize: computed.fontSize,
        position: computed.position,
        transform: computed.transform,
        left: computed.left,
        right: computed.right
      };

      elementData.push(data);

      // Check for missing data attributes
      if (!element.dataset.width) {
        issues.push(`Element ${index + 1}: Missing data-width attribute`);
      }

      // Check if width is being applied via CSS variables
      const expectedWidth = element.dataset.width;
      if (expectedWidth) {
        const cssCustomProp = computed.getPropertyValue('--marginalia-width');
        if (!cssCustomProp && !computed.width.includes('%')) {
          issues.push(`Element ${index + 1}: Width ${expectedWidth}% not applied to CSS`);
        }
      }

      console.log(`Element ${index + 1}:`, data);
    });

    console.groupEnd();

    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues,
      elementData: elementData
    };
  },

  /**
   * Test for rendering issues
   */
  testRenderingIssues() {
    console.group('[RENDERING] Testing marginalia rendering issues...');
    
    const marginalia = document.querySelectorAll('.marginalia-voice');
    const issues = [];
    const renderingData = [];

    marginalia.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const data = {
        index: index + 1,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0,
        dataWidth: element.dataset.width,
        expectedWidth: null
      };

      // Calculate expected width based on container
      const container = element.closest('.post-content') || document.body;
      const containerRect = container.getBoundingClientRect();
      if (element.dataset.width) {
        data.expectedWidth = (containerRect.width * parseFloat(element.dataset.width)) / 100;
      }

      renderingData.push(data);

      if (!data.visible) {
        issues.push(`Element ${index + 1}: Not visible (width: ${rect.width}, height: ${rect.height})`);
      }

      if (data.expectedWidth && Math.abs(rect.width - data.expectedWidth) > 20) {
        issues.push(`Element ${index + 1}: Width mismatch - expected ~${data.expectedWidth}px, got ${rect.width}px`);
      }

      console.log(`Element ${index + 1} rendering:`, data);
    });

    console.groupEnd();

    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL', 
      issues: issues,
      renderingData: renderingData
    };
  },

  /**
   * Test CSS rules and custom properties
   */
  testCSSRules() {
    console.group('[CSS_RULES] Testing marginalia CSS rules...');
    
    const issues = [];
    const ruleData = [];

    // Check if marginalia CSS is loaded
    const stylesheets = Array.from(document.styleSheets);
    let marginaliaRulesFound = 0;

    stylesheets.forEach((sheet, sheetIndex) => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach((rule, ruleIndex) => {
          if (rule.selectorText && rule.selectorText.includes('marginalia')) {
            marginaliaRulesFound++;
            ruleData.push({
              sheet: sheetIndex,
              rule: ruleIndex,
              selector: rule.selectorText,
              cssText: rule.cssText
            });
          }
        });
      } catch (e) {
        console.warn(`Cannot access stylesheet ${sheetIndex}:`, e.message);
      }
    });

    console.log(`Found ${marginaliaRulesFound} marginalia-related CSS rules`);
    console.log('Marginalia CSS rules:', ruleData);

    if (marginaliaRulesFound === 0) {
      issues.push('No marginalia CSS rules found - CSS may not be loaded');
    }

    // Test CSS custom property support
    const testElement = document.createElement('div');
    testElement.style.setProperty('--test-prop', '100px');
    testElement.style.width = 'var(--test-prop)';
    document.body.appendChild(testElement);
    
    const computed = window.getComputedStyle(testElement);
    if (computed.width !== '100px') {
      issues.push('CSS custom properties not supported or not working');
    }
    
    document.body.removeChild(testElement);

    console.groupEnd();

    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues,
      ruleData: ruleData
    };
  },

  /**
   * Test a specific marginalia pattern
   */
  testSpecificPattern(patternText) {
    console.group(`[SPECIFIC_TEST] Testing pattern: ${patternText.substring(0, 50)}...`);
    
    const pattern = /\[m\]\[([^\]]*)\]\[([\s\S]+)\]/g;
    const match = pattern.exec(patternText);
    
    if (!match) {
      console.error('Pattern did not match');
      console.groupEnd();
      return { status: 'FAIL', error: 'Pattern did not match' };
    }

    const params = match[1];
    const content = match[2];
    
    console.log('Matched params:', params);
    console.log('Matched content length:', content.length);

    // Test parameter parsing
    const parts = params.trim().split(/\s+/);
    const parsed = {
      voice: parseInt(parts[0]) || 1,
      fontScale: parseFloat(parts[1]) || 1.0,
      width: parseInt(parts[2]) || 30,
      position: parts[3] || 'right'
    };

    console.log('Parsed parameters:', parsed);

    // Create test HTML
    const testHtml = `<div class="marginalia-voice" 
                         data-voice="${parsed.voice}"
                         data-font-scale="${parsed.fontScale}"
                         data-width="${parsed.width}"
                         data-position="${parsed.position}"
                         data-marginalia-id="test">
                      ${content.substring(0, 100)}...
                    </div>`;

    console.log('Generated HTML:', testHtml);
    
    console.groupEnd();
    
    return {
      status: 'PASS',
      match: match,
      parsed: parsed,
      html: testHtml
    };
  }

};

// Auto-run if requested
if (window.location.search.includes('debug=marginalia-width')) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      window.DebugMarginaliaWidths.runFullDiagnostic();
    }, 1000);
  });
}

console.log('[MARGINALIA_WIDTH_DEBUG] Debugger loaded. Run DebugMarginaliaWidths.runFullDiagnostic() to start.');