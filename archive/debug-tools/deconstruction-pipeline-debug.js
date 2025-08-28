/**
 * Deconstruction Processing Pipeline Debug
 * 
 * Traces the complete flow from HTML elements to deconstruction effects
 */

window.debugDeconstructionPipeline = function() {
  console.group('🔍 DECONSTRUCTION PIPELINE DEBUG');
  
  // Step 1: Check class availability
  console.log('=== STEP 1: CLASS AVAILABILITY ===');
  console.log('window.ContentProcessor exists:', typeof window.ContentProcessor !== 'undefined');
  console.log('window.DeconstructionProcessor exists:', typeof window.DeconstructionProcessor !== 'undefined');
  console.log('window.ContentEnhancementManager exists:', typeof window.ContentEnhancementManager !== 'undefined');
  console.log('window.ContentEnhancementSystem exists:', typeof window.ContentEnhancementSystem !== 'undefined');
  
  if (typeof window.DeconstructionProcessor !== 'undefined') {
    console.log('✅ DeconstructionProcessor accessible');
  } else {
    console.log('❌ DeconstructionProcessor NOT accessible');
    console.groupEnd();
    return;
  }
  
  // Step 2: Find deconstruct elements
  console.log('=== STEP 2: HTML ELEMENTS ===');
  const deconstructElements = document.querySelectorAll('[data-deconstruct]');
  console.log(`Found ${deconstructElements.length} elements with data-deconstruct attribute`);
  
  if (deconstructElements.length === 0) {
    console.log('❌ No deconstruction elements found in DOM');
    console.log('Checking for any data-* attributes...');
    const dataElements = document.querySelectorAll('[data-*]');
    console.log(`Found ${dataElements.length} elements with any data attributes`);
    Array.from(dataElements).slice(0, 5).forEach(el => {
      console.log('- Element:', el.tagName, Array.from(el.attributes).map(attr => attr.name));
    });
  } else {
    console.log('✅ Deconstruction elements found:');
    deconstructElements.forEach((el, index) => {
      console.log(`- Element ${index + 1}:`, {
        tag: el.tagName,
        deconstructType: el.getAttribute('data-deconstruct'),
        mode: el.getAttribute('data-mode'),
        classes: el.className,
        content: el.textContent.substring(0, 50) + '...'
      });
    });
  }
  
  // Step 3: Check ContentEnhancementSystem
  console.log('=== STEP 3: SYSTEM REGISTRATION ===');
  if (window.ContentEnhancementSystem) {
    console.log('✅ ContentEnhancementSystem exists');
    
    // Try to access processors
    try {
      const processors = window.ContentEnhancementSystem.processors || window.ContentEnhancementSystem.processorInstances;
      if (processors) {
        console.log('Registered processors:', Object.keys(processors));
        
        if (processors.deconstruction) {
          console.log('✅ DeconstructionProcessor is registered');
          console.log('Processor instance:', processors.deconstruction.constructor.name);
        } else {
          console.log('❌ DeconstructionProcessor NOT registered');
        }
      } else {
        console.log('❌ Cannot access processor list');
      }
    } catch (error) {
      console.error('❌ Error accessing processors:', error);
    }
  } else {
    console.log('❌ ContentEnhancementSystem not found');
  }
  
  // Step 4: Manual processing test
  console.log('=== STEP 4: MANUAL PROCESSING TEST ===');
  
  if (deconstructElements.length > 0 && typeof window.DeconstructionProcessor !== 'undefined') {
    const testElement = deconstructElements[0];
    console.log('Testing processing on first element:', testElement);
    
    try {
      // Create a DeconstructionProcessor instance with proper container
      const container = document.querySelector('.post-content, .page-content') || document.body;
      const testProcessor = new window.DeconstructionProcessor({}, container);
      console.log('✅ DeconstructionProcessor instance created with container:', container.tagName);
      
      // Test if element matches selector
      const matches = testProcessor.getSelector ? testElement.matches(testProcessor.getSelector()) : true;
      console.log('Element matches processor selector:', matches);
      
      // Try to process the element
      console.log('Attempting to process element...');
      const result = testProcessor.process(testElement);
      console.log('Processing result:', result);
      
      // Check if element was modified
      console.log('Element classes after processing:', testElement.className);
      console.log('Element children count:', testElement.children.length);
      
    } catch (error) {
      console.error('❌ Manual processing failed:', error);
      console.error('Full error:', error.stack);
    }
  }
  
  // Step 5: Check for CSS
  console.log('=== STEP 5: CSS AVAILABILITY ===');
  const stylesheets = Array.from(document.styleSheets);
  const deconstructionCSS = stylesheets.some(sheet => {
    try {
      return sheet.href && sheet.href.includes('deconstruction.css');
    } catch (e) {
      return false;
    }
  });
  console.log('Deconstruction CSS loaded:', deconstructionCSS);
  
  // Step 6: Check configuration
  console.log('=== STEP 6: CONFIGURATION ===');
  const flags = window.CONTENT_ENHANCEMENT_FLAGS || {};
  console.log('CONTENT_ENHANCEMENT_FLAGS:', flags);
  console.log('Ghost settings enable_deconstruction:', window.ghost_custom_settings?.enable_deconstruction);
  console.log('ThemeConfig deconstruction enabled:', window.ThemeConfig?.features?.deconstruction);
  
  // Step 7: Check registration conditions (same logic as ContentEnhancementManager)
  console.log('=== STEP 7: REGISTRATION CONDITIONS ===');
  
  // Try to get the config like ContentEnhancementManager does
  let managerConfig = null;
  if (window.ContentEnhancementSystem && window.ContentEnhancementSystem.config) {
    managerConfig = window.ContentEnhancementSystem.config;
  }
  
  const deconstructionEnabled = flags.ENABLE_DECONSTRUCTION === true || 
                               managerConfig?.features?.deconstruction === true ||
                               window.ghost_custom_settings?.enable_deconstruction === true;
  
  console.log('Registration condition check:', {
    legacyFlag: flags.ENABLE_DECONSTRUCTION,
    managerConfigFeature: managerConfig?.features?.deconstruction,
    themeConfigFeature: window.ThemeConfig?.features?.deconstruction,
    ghostSetting: window.ghost_custom_settings?.enable_deconstruction,
    finalDecision: deconstructionEnabled
  });
  
  console.log('DeconstructionProcessor type check:', typeof DeconstructionProcessor !== 'undefined');
  
  console.groupEnd();
};

// Also create a simple element inspector
window.inspectDeconstructElement = function(element) {
  if (!element) {
    const elements = document.querySelectorAll('[data-deconstruct]');
    if (elements.length === 0) {
      console.log('❌ No deconstruction elements found');
      return;
    }
    element = elements[0];
    console.log('Using first deconstruction element found');
  }
  
  console.group('🔍 ELEMENT INSPECTION');
  console.log('Element:', element);
  console.log('Tag:', element.tagName);
  console.log('Attributes:');
  Array.from(element.attributes).forEach(attr => {
    console.log(`  ${attr.name}: ${attr.value}`);
  });
  console.log('Classes:', element.className);
  console.log('Content length:', element.textContent.length);
  console.log('Children:', element.children.length);
  console.log('Parent:', element.parentElement?.tagName);
  console.groupEnd();
};

// Manual initialization test
window.testManualInitialization = function() {
  console.group('🔧 MANUAL INITIALIZATION TEST');
  
  try {
    console.log('Creating new ContentEnhancementManager...');
    const testManager = new window.ContentEnhancementManager();
    
    console.log('Calling initialize()...');
    testManager.initialize().then(result => {
      console.log('Initialization result:', result);
      console.log('Processors registered:', Array.from(testManager.processors.keys()));
      console.log('Processor order:', testManager.processorOrder);
    }).catch(error => {
      console.error('Initialization failed:', error);
    });
    
  } catch (error) {
    console.error('Manual initialization test failed:', error);
  }
  
  console.groupEnd();
};

console.log('🔍 Deconstruction pipeline debugger loaded. Use:');
console.log('- debugDeconstructionPipeline()');
console.log('- inspectDeconstructElement()'); 
console.log('- testManualInitialization()');