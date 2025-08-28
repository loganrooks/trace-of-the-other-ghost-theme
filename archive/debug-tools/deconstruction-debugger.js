/**
 * Deconstruction System Debugger
 * 
 * Comprehensive debugging tools for diagnosing deconstruction processor issues
 * 
 * Usage in browser console:
 * - DeconstructionDebugger.fullDiagnostic()
 * - DeconstructionDebugger.checkSystem()
 * - DeconstructionDebugger.testElement(element)
 */

window.DeconstructionDebugger = {
  
  /**
   * Run full system diagnostic
   */
  fullDiagnostic() {
    console.group('🔍 DECONSTRUCTION SYSTEM DIAGNOSTIC');
    
    const results = {
      configuration: this.checkConfiguration(),
      scripts: this.checkScriptLoading(),
      processor: this.checkProcessor(),
      elements: this.checkElements(),
      css: this.checkCSS()
    };
    
    console.log('=== DIAGNOSTIC SUMMARY ===');
    Object.entries(results).forEach(([test, result]) => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${test.toUpperCase()}: ${result.status}`);
      if (result.issues && result.issues.length > 0) {
        result.issues.forEach(issue => console.log(`   ⚠️ ${issue}`));
      }
    });
    
    // Provide recommendations
    this.generateRecommendations(results);
    
    console.groupEnd();
    return results;
  },

  /**
   * Check system configuration
   */
  checkConfiguration() {
    console.group('[CONFIG] Checking configuration system...');
    
    const issues = [];
    
    // Check if unified config exists
    if (!window.ThemeConfig) {
      issues.push('window.ThemeConfig not found');
    } else {
      console.log('✅ ThemeConfig found');
      
      // Check deconstruction feature flag
      if (!window.ThemeConfig.features.deconstruction) {
        issues.push('deconstruction feature disabled in ThemeConfig.features');
      } else {
        console.log('✅ Deconstruction feature enabled');
      }
      
      // Check processor config
      if (!window.ThemeConfig.processors.deconstruction) {
        issues.push('deconstruction processor config missing');
      } else {
        console.log('✅ Deconstruction processor config found');
        console.log('Config:', window.ThemeConfig.processors.deconstruction);
      }
    }
    
    // Check legacy flags
    if (!window.CONTENT_ENHANCEMENT_FLAGS) {
      issues.push('window.CONTENT_ENHANCEMENT_FLAGS not found');
    } else {
      console.log('✅ Legacy flags found');
      if (!window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_DECONSTRUCTION) {
        issues.push('ENABLE_DECONSTRUCTION flag is false');
      } else {
        console.log('✅ ENABLE_DECONSTRUCTION flag is true');
      }
    }
    
    // Check Ghost settings
    if (!window.ghost_custom_settings) {
      issues.push('window.ghost_custom_settings not found');
    } else {
      console.log('✅ Ghost settings found');
      if (!window.ghost_custom_settings.enable_deconstruction) {
        issues.push('enable_deconstruction disabled in Ghost settings');
      } else {
        console.log('✅ Deconstruction enabled in Ghost settings');
      }
    }
    
    console.groupEnd();
    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues
    };
  },

  /**
   * Check if scripts are loading
   */
  checkScriptLoading() {
    console.group('[SCRIPTS] Checking script loading...');
    
    const issues = [];
    const requiredClasses = [
      'ContentProcessor',
      'DeconstructionProcessor',
      'ContentEnhancementManager'
    ];
    
    requiredClasses.forEach(className => {
      if (typeof window[className] === 'undefined') {
        issues.push(`${className} class not loaded`);
      } else {
        console.log(`✅ ${className} loaded`);
      }
    });
    
    console.groupEnd();
    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues
    };
  },

  /**
   * Check processor initialization
   */
  checkProcessor() {
    console.group('[PROCESSOR] Checking processor system...');
    
    const issues = [];
    
    // Check if ContentEnhancementSystem exists
    if (!window.ContentEnhancementSystem) {
      issues.push('ContentEnhancementSystem not initialized');
    } else {
      console.log('✅ ContentEnhancementSystem found');
      
      // Check if it has processors
      if (!window.ContentEnhancementSystem.processors) {
        issues.push('No processors registered');
      } else {
        const processors = window.ContentEnhancementSystem.processors;
        console.log('Registered processors:', Array.from(processors.keys()));
        
        if (!processors.has('deconstruction')) {
          issues.push('DeconstructionProcessor not registered');
        } else {
          console.log('✅ DeconstructionProcessor registered');
          
          const processor = processors.get('deconstruction');
          console.log('Processor state:', {
            initialized: processor.initialized,
            processed: processor.processed || false,
            statistics: processor.statistics
          });
        }
      }
    }
    
    console.groupEnd();
    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues
    };
  },

  /**
   * Check deconstruction elements
   */
  checkElements() {
    console.group('[ELEMENTS] Checking deconstruction elements...');
    
    const issues = [];
    const elements = document.querySelectorAll('[data-deconstruct]');
    
    console.log(`Found ${elements.length} deconstruction elements`);
    
    if (elements.length === 0) {
      issues.push('No [data-deconstruct] elements found in DOM');
    } else {
      elements.forEach((element, index) => {
        console.log(`Element ${index + 1}:`, {
          effectType: element.dataset.deconstruct,
          classes: element.className,
          attributes: Object.fromEntries(
            Array.from(element.attributes).map(attr => [attr.name, attr.value])
          )
        });
        
        // Check if element has been processed
        if (!element.classList.contains('deconstruct-element')) {
          issues.push(`Element ${index + 1} not processed (missing .deconstruct-element class)`);
        }
      });
    }
    
    console.groupEnd();
    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues,
      elementCount: elements.length
    };
  },

  /**
   * Check CSS loading
   */
  checkCSS() {
    console.group('[CSS] Checking CSS loading...');
    
    const issues = [];
    
    // Check if deconstruction.css is loaded
    const stylesheets = Array.from(document.styleSheets);
    let deconstructionCSSFound = false;
    
    stylesheets.forEach(sheet => {
      if (sheet.href && sheet.href.includes('deconstruction.css')) {
        deconstructionCSSFound = true;
        console.log('✅ deconstruction.css loaded');
      }
    });
    
    if (!deconstructionCSSFound) {
      issues.push('deconstruction.css not found in stylesheets');
    }
    
    // Test CSS rule availability
    const testElement = document.createElement('div');
    testElement.setAttribute('data-deconstruct', 'test');
    testElement.className = 'deconstruct-element';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    if (computedStyle.position !== 'relative') {
      issues.push('CSS rules not applying correctly');
    } else {
      console.log('✅ CSS rules applying correctly');
    }
    
    document.body.removeChild(testElement);
    
    console.groupEnd();
    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      issues: issues
    };
  },

  /**
   * Test a specific element
   */
  testElement(element) {
    if (!element) {
      element = document.querySelector('[data-deconstruct]');
    }
    
    if (!element) {
      console.error('No deconstruction element found to test');
      return;
    }
    
    console.group(`🧪 Testing element: ${element.dataset.deconstruct}`);
    
    console.log('Element:', element);
    console.log('Dataset:', element.dataset);
    console.log('Classes:', element.className);
    console.log('Computed styles:', {
      position: window.getComputedStyle(element).position,
      transition: window.getComputedStyle(element).transition,
      overflow: window.getComputedStyle(element).overflow
    });
    
    // Try to manually activate effect
    if (window.ContentEnhancementSystem && 
        window.ContentEnhancementSystem.processors && 
        window.ContentEnhancementSystem.processors.has('deconstruction')) {
      
      const processor = window.ContentEnhancementSystem.processors.get('deconstruction');
      console.log('Processor found, attempting manual processing...');
      
      try {
        processor.processDeconstructElement(element, 0);
        console.log('✅ Manual processing completed');
      } catch (error) {
        console.error('❌ Manual processing failed:', error);
      }
    }
    
    console.groupEnd();
  },

  /**
   * Generate recommendations based on diagnostic results
   */
  generateRecommendations(results) {
    console.group('💡 RECOMMENDATIONS');
    
    if (results.configuration.status === 'FAIL') {
      console.log('🔧 Configuration Issues:');
      console.log('   1. Check Ghost theme settings: enable deconstruction');
      console.log('   2. Verify window.ThemeConfig.features.deconstruction = true');
      console.log('   3. Run: window.ThemeConfig.features.deconstruction = true; location.reload();');
    }
    
    if (results.scripts.status === 'FAIL') {
      console.log('📜 Script Loading Issues:');
      console.log('   1. Check browser network tab for 404 errors');
      console.log('   2. Verify script loading order in default.hbs');
      console.log('   3. Check for JavaScript errors preventing loading');
    }
    
    if (results.processor.status === 'FAIL') {
      console.log('⚙️ Processor Issues:');
      console.log('   1. Run: window.ContentEnhancementSystem.initialize()');
      console.log('   2. Check console for initialization errors');
      console.log('   3. Verify processor registration in content-enhancement-manager.js');
    }
    
    if (results.elements.status === 'FAIL') {
      console.log('🎯 Element Issues:');
      console.log('   1. Verify HTML structure matches examples');
      console.log('   2. Check if elements are inside .post-content or .page-content');
      console.log('   3. Run: window.ContentEnhancementSystem.processContent(true)');
    }
    
    if (results.css.status === 'FAIL') {
      console.log('🎨 CSS Issues:');
      console.log('   1. Check if deconstruction.css is being loaded');
      console.log('   2. Verify enable_deconstruction theme setting');
      console.log('   3. Check browser network tab for CSS 404 errors');
    }
    
    console.log('\n🚀 Quick Fixes to Try:');
    console.log('   window.ThemeConfig.features.deconstruction = true;');
    console.log('   window.ContentEnhancementSystem.processContent(true);');
    console.log('   DeconstructionDebugger.testElement();');
    
    console.groupEnd();
  },

  /**
   * Quick system check
   */
  checkSystem() {
    console.log('🔍 Quick System Check:');
    console.log('ThemeConfig exists:', !!window.ThemeConfig);
    console.log('Deconstruction enabled:', window.ThemeConfig?.features?.deconstruction);
    console.log('ContentEnhancementSystem exists:', !!window.ContentEnhancementSystem);
    console.log('DeconstructionProcessor loaded:', typeof DeconstructionProcessor !== 'undefined');
    console.log('Elements found:', document.querySelectorAll('[data-deconstruct]').length);
    
    if (window.ContentEnhancementSystem?.processors?.has('deconstruction')) {
      const processor = window.ContentEnhancementSystem.processors.get('deconstruction');
      console.log('Processor initialized:', processor.initialized);
      console.log('Processing stats:', processor.getStats());
    }
  }
};

// Auto-expose debugging functions
window.debugDeconstruction = () => window.DeconstructionDebugger.fullDiagnostic();
window.testDeconstructionElement = (el) => window.DeconstructionDebugger.testElement(el);

console.log('🐛 DeconstructionDebugger loaded. Use debugDeconstruction() for full diagnostic.');