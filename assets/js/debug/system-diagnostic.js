/**
 * System Diagnostic - Comprehensive debugging for Ghost theme issues
 * Checks every step of the initialization process
 * 
 * Created: August 24, 2025
 */

window.systemDiagnostic = function() {
  console.group('🔍 SYSTEM DIAGNOSTIC - Full Stack Analysis');
  
  // 1. Check basic environment
  console.group('📋 Environment Check');
  console.log('URL:', window.location.href);
  console.log('User Agent:', navigator.userAgent);
  console.log('DOM Ready State:', document.readyState);
  console.log('Page Load Time:', performance.now());
  console.groupEnd();
  
  // 2. Check Ghost theme settings
  console.group('👻 Ghost Theme Settings');
  console.log('Ghost Custom Settings:', window.ghost_custom_settings);
  
  if (!window.ghost_custom_settings) {
    console.error('❌ CRITICAL: Ghost custom settings not found!');
    console.log('💡 This suggests Handlebars template issue or theme not properly installed');
  }
  console.groupEnd();
  
  // 3. Check feature flags
  console.group('🚩 Feature Flags');
  console.log('Content Enhancement Flags:', window.CONTENT_ENHANCEMENT_FLAGS);
  
  if (!window.CONTENT_ENHANCEMENT_FLAGS) {
    console.error('❌ CRITICAL: Feature flags not loaded!');
    console.log('💡 Check if content-enhancement-config.js is loading');
  } else {
    console.log('Use Legacy Footnotes:', window.CONTENT_ENHANCEMENT_FLAGS.USE_LEGACY_FOOTNOTES);
    console.log('Enable Marginalia:', window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_MARGINALIA);
    console.log('Enable Extensions:', window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_EXTENSIONS);
  }
  console.groupEnd();
  
  // 4. Check configuration system
  console.group('⚙️ Configuration System');
  console.log('ContentEnhancementConfig:', !!window.ContentEnhancementConfig);
  console.log('ConfigurationManager class:', typeof ConfigurationManager);
  
  if (typeof ConfigurationManager === 'undefined') {
    console.error('❌ CRITICAL: ConfigurationManager class not loaded!');
  }
  console.groupEnd();
  
  // 5. Check processor classes
  console.group('🏭 Processor Classes');
  console.log('ContentProcessor base:', typeof ContentProcessor);
  console.log('MarginaliaProcessor:', typeof MarginaliaProcessor);
  console.log('ParagraphExtensionProcessor:', typeof ParagraphExtensionProcessor);
  console.log('FootnoteProcessor:', typeof FootnoteProcessor);
  
  const missingClasses = [];
  if (typeof ContentProcessor === 'undefined') missingClasses.push('ContentProcessor');
  if (typeof MarginaliaProcessor === 'undefined') missingClasses.push('MarginaliaProcessor');
  if (typeof ParagraphExtensionProcessor === 'undefined') missingClasses.push('ParagraphExtensionProcessor');
  if (typeof FootnoteProcessor === 'undefined') missingClasses.push('FootnoteProcessor');
  
  if (missingClasses.length > 0) {
    console.error('❌ CRITICAL: Missing processor classes:', missingClasses);
    console.log('💡 Check script loading order in default.hbs');
  }
  console.groupEnd();
  
  // 6. Check content enhancement manager
  console.group('🎛️ Content Enhancement Manager');
  console.log('ContentEnhancementManager class:', typeof ContentEnhancementManager);
  console.log('ContentEnhancementSystem instance:', !!window.ContentEnhancementSystem);
  
  if (window.ContentEnhancementSystem) {
    console.log('System initialized:', window.ContentEnhancementSystem.initialized);
    console.log('Processors registered:', window.ContentEnhancementSystem.processors?.size || 0);
    console.log('Container found:', !!window.ContentEnhancementSystem.container);
    
    if (window.ContentEnhancementSystem.processors?.size > 0) {
      console.log('Registered processors:', Array.from(window.ContentEnhancementSystem.processors.keys()));
    }
  } else {
    console.error('❌ CRITICAL: ContentEnhancementSystem not initialized!');
  }
  console.groupEnd();
  
  // 7. Check legacy system
  console.group('🏛️ Legacy System');
  console.log('FootnoteSystemLegacyAdapter:', typeof FootnoteSystemLegacyAdapter);
  console.log('FootnoteSystemInstance:', !!window.FootnoteSystemInstance);
  console.log('DigitalTalmudFootnoteConfig:', !!window.DigitalTalmudFootnoteConfig);
  console.groupEnd();
  
  // 8. Check DOM containers
  console.group('📄 DOM Containers');
  const containers = ['.post-content', '.page-content', '.gh-content', 'article', 'main'];
  containers.forEach(selector => {
    const element = document.querySelector(selector);
    console.log(`${selector}:`, !!element, element?.tagName, `children: ${element?.children.length || 0}`);
  });
  
  // Check for marginalia pattern in DOM
  const postContent = document.querySelector('.post-content, .page-content');
  if (postContent) {
    const innerHTML = postContent.innerHTML;
    const hasMarginPattern = /\[m\]\[/.test(innerHTML);
    console.log('📝 Marginalia pattern found in DOM:', hasMarginPattern);
    
    if (hasMarginPattern) {
      const matches = innerHTML.match(/\[m\]\[([^\]]*)\]\[([^\]]*)\]/g) || [];
      console.log('📝 Marginalia patterns found:', matches.length, matches.slice(0, 3));
    }
  }
  console.groupEnd();
  
  // 9. Check script loading
  console.group('📜 Script Loading Check');
  const scripts = Array.from(document.querySelectorAll('script[src*="js/"]'));
  const requiredScripts = [
    'content-enhancement-config.js',
    'debug-logger.js', 
    'content-processor-base.js',
    'configuration-manager.js',
    'marginalia-processor.js',
    'content-enhancement-manager.js'
  ];
  
  requiredScripts.forEach(scriptName => {
    const found = scripts.some(script => script.src.includes(scriptName));
    console.log(`${scriptName}:`, found ? '✅' : '❌');
  });
  console.groupEnd();
  
  // 10. Advanced debugging recommendations
  console.group('🔧 Next Steps');
  
  if (!window.ContentEnhancementSystem) {
    console.log('🚨 PRIORITY 1: ContentEnhancementSystem not running');
    console.log('   → Check browser console for JavaScript errors');
    console.log('   → Verify all processor classes are loaded');
    console.log('   → Check if container element exists');
  }
  
  if (typeof MarginaliaProcessor === 'undefined') {
    console.log('🚨 PRIORITY 2: MarginaliaProcessor class not loaded');
    console.log('   → Check marginalia-processor.js is included');
    console.log('   → Check for syntax errors in the file');
  }
  
  if (!window.CONTENT_ENHANCEMENT_FLAGS?.ENABLE_MARGINALIA) {
    console.log('🚨 PRIORITY 3: Marginalia disabled in feature flags');
    console.log('   → Run: window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_MARGINALIA = true');
  }
  
  console.log('');
  console.log('📋 Debug Commands:');
  console.log('   systemDiagnostic() - Run this diagnostic again');  
  console.log('   debugMarginaliaWidth() - Deep debug CSS width issues');
  console.log('   autoRepairSystem() - Automatically detect and fix system issues');
  console.log('   debugMarginaliaContainer() - Deep debug container issues');
  console.log('   testMarginaliaRegistration() - Test marginalia registration manually');
  console.log('   manualInit() - Manually initialize system');
  console.log('   testMarginalia() - Test marginalia processing directly');
  
  console.groupEnd();
  console.groupEnd();
};

// Manual marginalia registration test
window.testMarginaliaRegistration = function() {
  console.group('🧪 Testing Marginalia Registration');
  
  if (!window.ContentEnhancementSystem) {
    console.error('❌ ContentEnhancementSystem not found');
    return false;
  }
  
  console.log('System state:', {
    initialized: window.ContentEnhancementSystem.initialized,
    processors: window.ContentEnhancementSystem.processors?.size || 0,
    registeredProcessors: window.ContentEnhancementSystem.processors ? 
      Array.from(window.ContentEnhancementSystem.processors.keys()) : []
  });
  
  console.log('Marginalia class check:', {
    MarginaliaProcessor: typeof MarginaliaProcessor,
    available: typeof MarginaliaProcessor === 'function'
  });
  
  if (typeof MarginaliaProcessor === 'function') {
    console.log('🚀 Attempting manual marginalia registration...');
    
    window.ContentEnhancementSystem.registerProcessor('marginalia', MarginaliaProcessor)
      .then(() => {
        console.log('✅ Manual marginalia registration successful!');
        console.log('Registered processors:', Array.from(window.ContentEnhancementSystem.processors.keys()));
        
        // Try to process content
        return window.ContentEnhancementSystem.processContent();
      })
      .then(() => {
        console.log('✅ Content processing completed');
        console.log('🎯 Check DOM for processed marginalia');
      })
      .catch(error => {
        console.error('❌ Manual registration failed:', error);
      });
  } else {
    console.error('❌ MarginaliaProcessor class not available');
  }
  
  console.groupEnd();
};

// Manual initialization function
window.manualInit = function() {
  console.group('🔧 Manual System Initialization');
  
  try {
    // Check if modern system should be used
    if (!window.CONTENT_ENHANCEMENT_FLAGS) {
      console.error('Feature flags not loaded - cannot continue');
      return false;
    }
    
    // Force enable marginalia
    window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_MARGINALIA = true;
    window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_MARGINALIA_PROCESSOR = true;
    console.log('✅ Marginalia flags enabled');
    
    // Initialize system if not already done
    if (!window.ContentEnhancementSystem && typeof ContentEnhancementManager !== 'undefined') {
      console.log('🚀 Creating ContentEnhancementSystem...');
      window.ContentEnhancementSystem = new ContentEnhancementManager();
      
      window.ContentEnhancementSystem.initialize()
        .then(success => {
          if (success) {
            console.log('✅ System initialized successfully');
            return window.ContentEnhancementSystem.processContent();
          }
          console.error('❌ System initialization failed');
          return false;
        })
        .then(success => {
          if (success) {
            console.log('✅ Content processing completed');
            console.log('🎯 Check DOM for marginalia elements');
          } else {
            console.error('❌ Content processing failed');
          }
        })
        .catch(error => {
          console.error('❌ Manual initialization failed:', error);
        });
        
    } else if (window.ContentEnhancementSystem) {
      console.log('📝 System exists - reprocessing content...');
      window.ContentEnhancementSystem.processContent();
    } else {
      console.error('❌ ContentEnhancementManager class not available');
    }
    
  } catch (error) {
    console.error('❌ Manual initialization error:', error);
  }
  
  console.groupEnd();
};

// Container debugging for marginalia processor
window.debugMarginaliaContainer = function() {
  console.group('🔍 MARGINALIA CONTAINER DEBUG');
  
  // 1. Check if processor exists
  const marginaliaProcessor = window.ContentEnhancementSystem?.processors?.get('marginalia');
  if (!marginaliaProcessor) {
    console.error('❌ Marginalia processor not found');
    console.groupEnd();
    return false;
  }
  
  console.log('✅ Marginalia processor found');
  
  // 2. Debug processor container
  console.group('📦 Processor Container Analysis');
  console.log('Container value:', marginaliaProcessor.container);
  console.log('Container type:', typeof marginaliaProcessor.container);
  console.log('Container constructor:', marginaliaProcessor.container?.constructor?.name);
  console.log('Is DOM element?', marginaliaProcessor.container instanceof Element);
  console.log('Has children property:', 'children' in (marginaliaProcessor.container || {}));
  console.log('Has querySelectorAll method:', typeof marginaliaProcessor.container?.querySelectorAll);
  
  if (marginaliaProcessor.container) {
    console.log('Container properties:', Object.keys(marginaliaProcessor.container));
  }
  console.groupEnd();
  
  // 3. Debug manager container
  console.group('🎛️ Manager Container Analysis');
  const managerContainer = window.ContentEnhancementSystem?.container;
  console.log('Manager container:', managerContainer);
  console.log('Manager container type:', typeof managerContainer);
  console.log('Manager container tagName:', managerContainer?.tagName);
  console.log('Manager container className:', managerContainer?.className);
  console.log('Manager container children count:', managerContainer?.children?.length);
  console.groupEnd();
  
  // 4. Check expected containers in DOM
  console.group('🌐 DOM Container Validation');
  const expectedContainers = ['.post-content', '.page-content', '.gh-content'];
  expectedContainers.forEach(selector => {
    const element = document.querySelector(selector);
    console.log(`${selector}:`, {
      found: !!element,
      tagName: element?.tagName,
      className: element?.className,
      childrenCount: element?.children?.length,
      hasQuerySelectorAll: typeof element?.querySelectorAll === 'function'
    });
  });
  console.groupEnd();
  
  // 5. Container fix recommendation
  console.group('🔧 Container Fix Analysis');
  const correctContainer = document.querySelector('.post-content') || document.querySelector('.page-content');
  
  if (!correctContainer) {
    console.error('❌ No valid content container found in DOM');
    console.log('💡 Available containers:', Array.from(document.querySelectorAll('div, article, main')).map(el => ({ 
      tag: el.tagName, 
      class: el.className, 
      id: el.id 
    })));
  } else {
    console.log('✅ Found valid container:', correctContainer);
    console.log('Container validation:', {
      hasChildren: typeof correctContainer.children !== 'undefined',
      hasQuerySelectorAll: typeof correctContainer.querySelectorAll === 'function',
      childrenCount: correctContainer.children.length
    });
    
    // Compare containers
    if (marginaliaProcessor.container !== correctContainer) {
      console.warn('⚠️ Processor has wrong container!');
      console.log('Expected:', correctContainer);
      console.log('Actual:', marginaliaProcessor.container);
      
      console.log('🚀 Container fix available: fixMarginaliaContainer()');
      window.fixMarginaliaContainer = function() {
        console.log('🔧 Fixing marginalia container...');
        marginaliaProcessor.container = correctContainer;
        console.log('✅ Container fixed, attempting initialization...');
        
        return marginaliaProcessor.init()
          .then(success => {
            if (success) {
              console.log('✅ Initialization successful! Processing with correct order...');
              
              // Force complete reprocessing in correct order to avoid breaking footnote tooltips
              console.log('🔄 Reprocessing all content in correct order (Marginalia → Extensions → Footnotes)...');
              return window.ContentEnhancementSystem.processContent(true);
            } else {
              console.error('❌ Initialization failed after container fix');
              return false;
            }
          })
          .then(success => {
            if (success) {
              console.log('✅ Complete content reprocessing successful!');
              console.log('🎯 Marginalia should be processed AND footnote tooltips preserved');
              return true;
            } else {
              console.error('❌ Content reprocessing failed');
              return false;
            }
          })
          .catch(error => {
            console.error('❌ Container fix failed:', error);
            return false;
          });
      };
    } else {
      console.log('✅ Processor has correct container');
    }
  }
  console.groupEnd();
  
  // 6. Processor state analysis
  console.group('⚙️ Processor State Analysis');
  console.log('Initialized:', marginaliaProcessor.initialized);
  console.log('Counter:', marginaliaProcessor.counter);
  console.log('Marginalia map size:', marginaliaProcessor.marginalia?.size || 0);
  console.log('Config:', marginaliaProcessor.config);
  console.groupEnd();
  
  console.log('');
  console.log('📋 Available Commands:');
  if (window.fixMarginaliaContainer) {
    console.log('   fixMarginaliaContainer() - Fix container and reinitialize');
  }
  console.log('   debugMarginaliaContainer() - Run this diagnostic again');
  console.log('   autoRepairSystem() - Automatically detect and fix system issues');
  
  console.groupEnd();
  return true;
};

// Automatic system repair function
window.autoRepairSystem = function() {
  console.group('🔧 AUTOMATIC SYSTEM REPAIR');
  
  console.log('🔍 Detecting system issues...');
  
  // Issue 1: Check if marginalia processor has wrong container
  const marginaliaProcessor = window.ContentEnhancementSystem?.processors?.get('marginalia');
  let issuesFound = 0;
  let repairsNeeded = [];
  
  if (marginaliaProcessor) {
    if (!(marginaliaProcessor.container instanceof Element)) {
      console.warn('⚠️ Issue detected: Marginalia processor has wrong container type');
      repairsNeeded.push('marginalia_container');
      issuesFound++;
    }
    
    if (!marginaliaProcessor.initialized) {
      console.warn('⚠️ Issue detected: Marginalia processor not initialized');
      repairsNeeded.push('marginalia_init');
      issuesFound++;
    }
  }
  
  // Issue 2: Check if system processed content before marginalia was ready
  if (window.ContentEnhancementSystem?.processed && repairsNeeded.length > 0) {
    console.warn('⚠️ Issue detected: Content processed before marginalia was properly initialized');
    repairsNeeded.push('content_reprocess');
    issuesFound++;
  }
  
  console.log(`🔍 Scan complete: ${issuesFound} issues found`);
  
  if (issuesFound === 0) {
    console.log('✅ No system issues detected - everything looks good!');
    console.groupEnd();
    return true;
  }
  
  console.log('🚀 Attempting automatic repairs...');
  
  // Repair marginalia container if needed
  if (repairsNeeded.includes('marginalia_container')) {
    console.log('🔧 Fixing marginalia container...');
    const correctContainer = document.querySelector('.post-content') || document.querySelector('.page-content');
    if (correctContainer) {
      marginaliaProcessor.container = correctContainer;
      console.log('✅ Marginalia container repaired');
    } else {
      console.error('❌ Cannot repair: No valid container found');
      console.groupEnd();
      return false;
    }
  }
  
  // Initialize marginalia if needed
  if (repairsNeeded.includes('marginalia_init')) {
    console.log('🔧 Initializing marginalia processor...');
    return marginaliaProcessor.init()
      .then(success => {
        if (success) {
          console.log('✅ Marginalia processor initialized');
          
          // Reprocess content if needed
          if (repairsNeeded.includes('content_reprocess')) {
            console.log('🔄 Reprocessing all content in correct order...');
            return window.ContentEnhancementSystem.processContent(true);
          }
          return true;
        } else {
          console.error('❌ Marginalia initialization failed');
          return false;
        }
      })
      .then(success => {
        if (success) {
          console.log('🎉 SYSTEM REPAIR COMPLETE!');
          console.log('✅ Marginalia should now work with preserved footnote tooltips');
        } else {
          console.error('❌ System repair failed during content reprocessing');
        }
        console.groupEnd();
        return success;
      })
      .catch(error => {
        console.error('❌ System repair failed:', error);
        console.groupEnd();
        return false;
      });
  }
  
  console.log('🎉 System repair complete!');
  console.groupEnd();
  return true;
};

// CSS Width Debugging - Best Practices Approach
window.debugMarginaliaWidth = function() {
  console.group('🔍 MARGINALIA WIDTH DEBUGGING');
  
  // 1. Find all marginalia elements in DOM
  const marginaliaElements = document.querySelectorAll('.marginalia-voice[data-width]');
  console.log(`Found ${marginaliaElements.length} marginalia elements with data-width`);
  
  if (marginaliaElements.length === 0) {
    console.error('❌ No marginalia elements found - pattern may not be processing');
    console.groupEnd();
    return false;
  }
  
  marginaliaElements.forEach((element, index) => {
    console.group(`📏 Element ${index + 1} Analysis`);
    
    // 2. Inspect HTML attributes
    console.log('HTML Attributes:');
    console.log('  data-width:', element.getAttribute('data-width'));
    console.log('  data-voice:', element.getAttribute('data-voice'));
    console.log('  data-font-scale:', element.getAttribute('data-font-scale'));
    console.log('  data-position:', element.getAttribute('data-position'));
    console.log('  class:', element.className);
    
    // 3. Get computed styles
    const computedStyles = window.getComputedStyle(element);
    console.log('Computed CSS:');
    console.log('  max-width:', computedStyles.maxWidth);
    console.log('  width:', computedStyles.width);
    console.log('  min-width:', computedStyles.minWidth);
    console.log('  display:', computedStyles.display);
    
    // 4. Check CSS custom properties
    const rootStyles = window.getComputedStyle(document.documentElement);
    console.log('CSS Variables:');
    console.log('  --content-width:', rootStyles.getPropertyValue('--content-width'));
    console.log('  --marginalia-max-width:', rootStyles.getPropertyValue('--marginalia-max-width'));
    
    // 5. Calculate expected width
    const dataWidth = element.getAttribute('data-width');
    const contentWidth = rootStyles.getPropertyValue('--content-width').trim();
    if (dataWidth && contentWidth) {
      console.log('Width Calculation:');
      console.log(`  Expected: calc(${contentWidth} * ${dataWidth} / 100)`);
      console.log(`  Expected: calc(${contentWidth} * 0.${dataWidth})`);
    }
    
    // 6. Check for conflicting CSS rules
    console.log('CSS Rule Analysis:');
    const allRules = [];
    
    // Get all stylesheets
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || sheet.rules || []).forEach(rule => {
          if (rule.selectorText && rule.selectorText.includes('.marginalia-voice')) {
            if (rule.style.maxWidth) {
              allRules.push({
                selector: rule.selectorText,
                maxWidth: rule.style.maxWidth,
                important: rule.style.getPropertyPriority('max-width') === 'important'
              });
            }
          }
        });
      } catch (e) {
        // Skip inaccessible stylesheets (CORS)
      }
    });
    
    console.log('  Conflicting max-width rules:', allRules);
    
    // 7. Test element dimensions
    const rect = element.getBoundingClientRect();
    console.log('Actual Dimensions:');
    console.log(`  width: ${rect.width}px`);
    console.log(`  height: ${rect.height}px`);
    
    // 8. Parent container analysis
    const parent = element.closest('.post-content, .page-content');
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      const percentage = ((rect.width / parentRect.width) * 100).toFixed(1);
      console.log('Container Analysis:');
      console.log(`  parent width: ${parentRect.width}px`);
      console.log(`  actual percentage: ${percentage}%`);
      console.log(`  expected percentage: ${dataWidth}%`);
      
      if (Math.abs(parseFloat(percentage) - parseFloat(dataWidth)) > 2) {
        console.warn('⚠️ Width mismatch detected!');
      }
    }
    
    console.groupEnd();
  });
  
  // 9. CSS Specificity Test
  console.group('🧪 CSS Specificity Test');
  console.log('Testing if data-width selectors are working...');
  
  // Create test element
  const testEl = document.createElement('div');
  testEl.className = 'marginalia-voice';
  testEl.setAttribute('data-width', '25');
  testEl.style.visibility = 'hidden';
  testEl.style.position = 'absolute';
  document.body.appendChild(testEl);
  
  const testStyles = window.getComputedStyle(testEl);
  console.log('Test element max-width:', testStyles.maxWidth);
  
  document.body.removeChild(testEl);
  console.groupEnd();
  
  console.log('');
  console.log('📋 Available Commands:');
  console.log('   debugMarginaliaWidth() - Run this diagnostic again');
  console.log('   fixMarginaliaWidth() - Apply width fix (if available)');
  
  console.groupEnd();
  return true;
};

// Direct marginalia test
window.testMarginalia = function() {
  console.group('🧪 Direct Marginalia Test');
  
  const testHTML = 'This is a test [m][2 1.4 40 r][Test marginalia content] sentence.';
  const pattern = /\[m\]\[([^\]]*)\]\[([\s\S]+)\]/g; // FIXED: Greedy matching for nested brackets
  
  console.log('Test HTML:', testHTML);
  console.log('Pattern:', pattern);
  
  const matches = [...testHTML.matchAll(pattern)];
  console.log('Matches found:', matches.length);
  
  matches.forEach((match, i) => {
    console.log(`Match ${i + 1}:`, {
      full: match[0],
      params: match[1], 
      content: match[2]
    });
  });
  
  console.groupEnd();
};

// Auto-run diagnostic when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(systemDiagnostic, 1000);
  });
} else {
  // Page already loaded
  setTimeout(systemDiagnostic, 100);
}