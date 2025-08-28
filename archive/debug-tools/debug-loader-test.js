/**
 * Debug Loader Test
 * 
 * Simple test to see which debug functions actually load
 */

// Test function registration
window.testDebugLoader = function() {
  console.log('🔍 DEBUG LOADER TEST');
  
  // List all debug-related functions
  const allFunctions = Object.keys(window).filter(key => 
    key.includes('debug') || key.includes('Debug') || key.includes('quick') || key.includes('check')
  );
  
  console.log('Available debug functions:', allFunctions);
  
  // Test specific functions
  const expectedFunctions = [
    'debugDeconstructionOnly',
    'quickDeconstructionStatus', 
    'checkVoicesEnabled',
    'debugEffectConfig',
    'emergencyDebug',
    'scriptExecutionDebug'
  ];
  
  expectedFunctions.forEach(funcName => {
    const exists = typeof window[funcName] === 'function';
    console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'exists' : 'missing'}`);
  });
  
  // Check if scripts are in DOM
  const scripts = Array.from(document.querySelectorAll('script[src*="debug"]'));
  console.log(`Found ${scripts.length} debug scripts in DOM:`);
  scripts.forEach(script => {
    console.log(`- ${script.src}`);
  });
};

// Simple status function that should always work
window.simpleStatus = function() {
  console.log('🎭 SIMPLE STATUS:');
  console.log('ContentEnhancementSystem exists:', !!window.ContentEnhancementSystem);
  const processor = window.ContentEnhancementSystem?.processors?.get('deconstruction');
  console.log('Deconstruction processor exists:', !!processor);
  if (processor) {
    console.log('Effect config exists:', !!processor.effectConfig);
    console.log('enableVoices value:', processor.effectConfig?.enableVoices);
    console.log('enableVoices type:', typeof processor.effectConfig?.enableVoices);
  }
  
  const element = document.querySelector('[data-deconstruct="voices"]');
  console.log('Element classes:', element?.className || 'element not found');
};

console.log('🔍 Debug loader test ready. Use:');
console.log('- testDebugLoader()');  
console.log('- simpleStatus()');