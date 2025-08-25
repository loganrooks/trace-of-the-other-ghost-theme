/**
 * Automatic Processing Debug
 * 
 * Debug why the ContentEnhancementSystem isn't automatically processing elements
 */

window.debugAutomaticProcessing = function() {
  console.group('🔄 AUTOMATIC PROCESSING DEBUG');
  
  // Check if main system exists and is processing content
  if (window.ContentEnhancementSystem) {
    console.log('=== MAIN SYSTEM STATUS ===');
    console.log('ContentEnhancementSystem exists:', !!window.ContentEnhancementSystem);
    console.log('System initialized:', window.ContentEnhancementSystem.initialized);
    console.log('System processed:', window.ContentEnhancementSystem.processed);
    
    // Check processors
    if (window.ContentEnhancementSystem.processors) {
      console.log('Registered processors:', Array.from(window.ContentEnhancementSystem.processors.keys()));
      
      const deconstructProcessor = window.ContentEnhancementSystem.processors.get('deconstruction');
      if (deconstructProcessor) {
        console.log('Deconstruction processor found');
        console.log('Processor initialized:', deconstructProcessor.initialized || 'unknown');
        console.log('Processor container:', deconstructProcessor.container?.tagName);
        console.log('Processor effects Map size:', deconstructProcessor.effects.size);
      } else {
        console.log('❌ Deconstruction processor not found in main system');
      }
    } else {
      console.log('❌ No processors registered in main system');
    }
  } else {
    console.log('❌ ContentEnhancementSystem not found');
  }
  
  // Check for processing activity
  console.log('=== PROCESSING ACTIVITY TRACE ===');
  
  // Override processContent to log when it's called
  if (window.ContentEnhancementSystem && typeof window.ContentEnhancementSystem.processContent === 'function') {
    const originalProcessContent = window.ContentEnhancementSystem.processContent;
    window.ContentEnhancementSystem.processContent = function(...args) {
      console.log('🔄 ContentEnhancementSystem.processContent() CALLED with args:', args);
      console.trace('Call stack:');
      return originalProcessContent.apply(this, args);
    };
    console.log('✅ Wrapped processContent() to log calls');
  } else {
    console.log('❌ Cannot wrap processContent() - not found');
  }
  
  // Override DeconstructionProcessor.process to log when it's called
  if (window.ContentEnhancementSystem?.processors?.get('deconstruction')?.process) {
    const processor = window.ContentEnhancementSystem.processors.get('deconstruction');
    const originalProcess = processor.process;
    processor.process = function(...args) {
      console.log('🎭 DeconstructionProcessor.process() CALLED with args:', args);
      console.trace('Call stack:');
      return originalProcess.apply(this, args);
    };
    console.log('✅ Wrapped DeconstructionProcessor.process() to log calls');
  } else {
    console.log('❌ Cannot wrap DeconstructionProcessor.process() - not found');
  }
  
  // Manual trigger test
  console.log('=== MANUAL TRIGGER TEST ===');
  console.log('Attempting to manually trigger processContent()...');
  
  if (window.ContentEnhancementSystem && window.ContentEnhancementSystem.processContent) {
    window.ContentEnhancementSystem.processContent(true).then(result => {
      console.log('Manual processContent() result:', result);
      console.log('Check if effects appeared now...');
    }).catch(error => {
      console.error('Manual processContent() failed:', error);
    });
  } else {
    console.log('❌ Cannot manually trigger - processContent not available');
  }
  
  console.groupEnd();
};

// Also create a DOM ready state debugger
window.debugDOMReadyState = function() {
  console.group('📄 DOM READY STATE DEBUG');
  
  console.log('document.readyState:', document.readyState);
  console.log('DOMContentLoaded fired:', document.readyState === 'complete' || document.readyState === 'interactive');
  
  // Find deconstruction elements
  const deconstructElements = document.querySelectorAll('[data-deconstruct]');
  console.log(`Found ${deconstructElements.length} deconstruction elements in DOM`);
  
  if (deconstructElements.length > 0) {
    console.log('First element:', deconstructElements[0].outerHTML.substring(0, 100) + '...');
    console.log('First element classes:', deconstructElements[0].className);
  }
  
  // Check if system initialization happens after DOM ready
  let initStarted = false;
  let initCompleted = false;
  
  if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('🔄 DOMContentLoaded fired');
      setTimeout(() => {
        console.log('System state 100ms after DOMContentLoaded:');
        console.log('- Initialized:', window.ContentEnhancementSystem?.initialized);
        console.log('- Processed:', window.ContentEnhancementSystem?.processed);
      }, 100);
    });
    
    window.addEventListener('load', () => {
      console.log('🔄 Window load fired');
      setTimeout(() => {
        console.log('System state 100ms after window load:');
        console.log('- Initialized:', window.ContentEnhancementSystem?.initialized);
        console.log('- Processed:', window.ContentEnhancementSystem?.processed);
      }, 100);
    });
  } else {
    console.log('✅ DOM already complete');
  }
  
  console.groupEnd();
};

console.log('🔄 Automatic processing debugger loaded. Use:');
console.log('- debugAutomaticProcessing()');
console.log('- debugDOMReadyState()');