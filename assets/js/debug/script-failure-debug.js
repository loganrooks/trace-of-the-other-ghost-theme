/**
 * Script Failure Debug - Catch silent script failures
 * 
 * Debug why architectural-implementation.js isn't creating window.themeCoordinator
 */

// Track architectural-implementation.js execution
window.architecturalDebug = {
  scriptStarted: false,
  initStarted: false,
  coordinatorCreated: false,
  error: null,
  steps: []
};

// Add step tracking
window.trackArchitecturalStep = function(step, data = null) {
  window.architecturalDebug.steps.push({
    step,
    data,
    timestamp: new Date().toISOString(),
    time: performance.now()
  });
  console.log(`🏗️ ARCHITECTURAL STEP: ${step}`, data || '');
};

// Check architectural-implementation.js execution
window.checkArchitecturalExecution = function() {
  console.log('🔍 CHECKING ARCHITECTURAL-IMPLEMENTATION.JS EXECUTION');
  console.log('================================================');
  
  // Check if script is loaded
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const archScript = scripts.find(s => s.src.includes('architectural-implementation.js'));
  
  console.log(`📜 Script loaded: ${archScript ? '✅ Yes' : '❌ No'}`);
  if (archScript) {
    console.log(`📜 Script src: ${archScript.src}`);
    console.log(`📜 Script loaded: ${archScript.complete !== undefined ? archScript.complete : 'unknown'}`);
  }
  
  // Check execution tracking
  console.log('\n🏗️ Execution Tracking:');
  console.log(`  Script started: ${window.architecturalDebug.scriptStarted ? '✅' : '❌'}`);
  console.log(`  Init started: ${window.architecturalDebug.initStarted ? '✅' : '❌'}`);
  console.log(`  Coordinator created: ${window.architecturalDebug.coordinatorCreated ? '✅' : '❌'}`);
  console.log(`  Error: ${window.architecturalDebug.error || 'None'}`);
  
  // Check steps
  console.log('\n📊 Execution Steps:');
  if (window.architecturalDebug.steps.length === 0) {
    console.log('  ❌ No steps tracked - script may not be executing');
  } else {
    window.architecturalDebug.steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step.step} (${step.time.toFixed(2)}ms)`);
      if (step.data) console.log(`     Data:`, step.data);
    });
  }
  
  // Check window objects
  console.log('\n🪟 Window Objects:');
  console.log(`  window.ThemeSystemCoordinator: ${typeof window.ThemeSystemCoordinator !== 'undefined' ? '✅' : '❌'}`);
  console.log(`  window.FootnoteService: ${typeof window.FootnoteService !== 'undefined' ? '✅' : '❌'}`);
  console.log(`  window.themeCoordinator: ${typeof window.themeCoordinator !== 'undefined' ? '✅' : '❌'}`);
  
  // Try to manually run initialization
  console.log('\n🧪 Manual Initialization Test:');
  try {
    if (typeof window.initializeNewArchitecture === 'function') {
      console.log('  initializeNewArchitecture function: ✅ Available');
      console.log('  🚀 Attempting manual initialization...');
      
      window.initializeNewArchitecture().then(() => {
        console.log('  ✅ Manual initialization succeeded');
        console.log(`  window.themeCoordinator now: ${typeof window.themeCoordinator !== 'undefined' ? '✅' : '❌'}`);
      }).catch(error => {
        console.log('  ❌ Manual initialization failed:', error);
        window.architecturalDebug.error = error.message;
      });
    } else {
      console.log('  ❌ initializeNewArchitecture function not found');
    }
  } catch (error) {
    console.log('  ❌ Error during manual test:', error);
    window.architecturalDebug.error = error.message;
  }
  
  return window.architecturalDebug;
};

// Auto-run check
setTimeout(() => {
  console.log('🔍 Auto-running architectural execution check...');
  window.checkArchitecturalExecution();
}, 2000);

console.log('🔍 Script failure debug loaded');
console.log('💡 Use checkArchitecturalExecution() to debug architectural-implementation.js');