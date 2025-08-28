/**
 * Architecture Detection Debug
 * 
 * Best practices debugging for system initialization issues
 */

window.debugArchitectureDetection = function() {
  console.log('🔍 ARCHITECTURE DETECTION DEBUGGING');
  console.log('===================================');
  
  // Step 1: Check class availability
  console.log('📦 Step 1: Class Availability Check');
  const themeCoordinator = typeof window.ThemeSystemCoordinator !== 'undefined';
  const footnoteService = typeof window.FootnoteService !== 'undefined';
  
  console.log(`  window.ThemeSystemCoordinator: ${themeCoordinator ? '✅ Available' : '❌ Missing'}`);
  console.log(`  window.FootnoteService: ${footnoteService ? '✅ Available' : '❌ Missing'}`);
  console.log(`  Combined check: ${themeCoordinator && footnoteService ? '✅ Should use NEW' : '❌ Will use OLD'}`);
  
  // Step 2: Check running systems
  console.log('\n🏃 Step 2: Running Systems Check');
  const oldSystem = typeof window.ContentEnhancementSystem !== 'undefined';
  const newSystem = typeof window.themeCoordinator !== 'undefined';
  
  console.log(`  Old System (ContentEnhancementSystem): ${oldSystem ? '✅ Running' : '❌ Not running'}`);
  console.log(`  New System (themeCoordinator): ${newSystem ? '✅ Running' : '❌ Not running'}`);
  
  // Step 3: Script loading analysis
  console.log('\n📜 Step 3: Script Loading Analysis');
  const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
  const relevantScripts = scripts.filter(src => 
    src.includes('theme-system-coordinator') || 
    src.includes('footnote-service') ||
    src.includes('content-enhancement-manager') ||
    src.includes('architectural-implementation')
  );
  
  console.log('  Architecture-related scripts:');
  relevantScripts.forEach(src => {
    console.log(`    📄 ${src.split('/').pop()}`);
  });
  
  // Step 4: Initialization timing
  console.log('\n⏱️ Step 4: Initialization Timing Analysis');
  console.log(`  Document ready state: ${document.readyState}`);
  console.log(`  Window loaded: ${document.readyState === 'complete'}`);
  
  // Step 5: Check if we can recreate the decision logic
  console.log('\n🧠 Step 5: Decision Logic Recreation');
  console.log('  Recreating content-enhancement-manager.js line 581 logic:');
  console.log(`  if (window.ThemeSystemCoordinator && window.FootnoteService) {`);
  console.log(`    // ${window.ThemeSystemCoordinator ? 'ThemeSystemCoordinator exists' : 'ThemeSystemCoordinator missing'}`);
  console.log(`    // ${window.FootnoteService ? 'FootnoteService exists' : 'FootnoteService missing'}`);
  console.log(`    // Result: ${window.ThemeSystemCoordinator && window.FootnoteService ? 'SKIP old system' : 'START old system'}`);
  console.log(`  }`);
  
  return {
    themeCoordinator,
    footnoteService,
    shouldUseNew: themeCoordinator && footnoteService,
    oldSystemRunning: oldSystem,
    newSystemRunning: newSystem,
    scripts: relevantScripts
  };
};

window.debugTooltipCreation = function() {
  console.log('🔍 TOOLTIP CREATION DEBUGGING');
  console.log('=============================');
  
  // Step 1: Check if old system has tooltip functionality
  if (window.ContentEnhancementSystem) {
    console.log('📋 Old System Analysis:');
    const manager = window.ContentEnhancementSystem;
    console.log(`  Manager initialized: ${manager.initialized}`);
    console.log(`  Processors count: ${manager.processors?.size || 'Unknown'}`);
    
    // Check footnote processor specifically
    if (manager.processors) {
      const footnoteProcessor = manager.processors.get('footnotes');
      if (footnoteProcessor) {
        console.log('📝 FootnoteProcessor Details:');
        console.log(`    Config exists: ${!!footnoteProcessor.config}`);
        console.log(`    Tooltip behavior: ${footnoteProcessor.config?.behavior?.enableTooltips}`);
        console.log(`    Event handlers attached: ${footnoteProcessor.eventHandlers ? 'Yes' : 'No'}`);
        
        // Try to trigger tooltip manually
        const firstRef = document.querySelector('.footnote-ref a');
        if (firstRef) {
          console.log('🧪 Manual tooltip test:');
          console.log(`    First footnote ref found: ${firstRef.href}`);
          
          // Simulate mouseenter
          const event = new MouseEvent('mouseenter', { bubbles: true });
          firstRef.dispatchEvent(event);
          
          setTimeout(() => {
            const tooltips = document.querySelectorAll('.footnote-tooltip');
            console.log(`    Tooltips created after mouseenter: ${tooltips.length}`);
          }, 100);
        }
      } else {
        console.log('❌ FootnoteProcessor not found in old system');
      }
    }
  }
  
  // Step 2: Check new system
  if (window.themeCoordinator) {
    console.log('🏗️ New System Analysis:');
    const coordinator = window.themeCoordinator;
    console.log(`  Systems registered: ${coordinator.systems?.size || 'Unknown'}`);
    
    const footnoteService = coordinator.systems?.get('footnotes');
    if (footnoteService) {
      console.log('📝 FootnoteService Details:');
      console.log(`    Initialized: ${footnoteService.initialized}`);
      console.log(`    Footnote refs count: ${footnoteService.footnoteRefs?.length || 'Unknown'}`);
      console.log(`    Footnote content count: ${footnoteService.footnoteContent?.size || 'Unknown'}`);
      console.log(`    Disabled: ${footnoteService.disabled}`);
    } else {
      console.log('❌ FootnoteService not found in new system');
    }
  }
};

// Auto-run on page load to check timing
setTimeout(() => {
  console.log('🔍 Auto-running architecture detection debug...');
  const results = window.debugArchitectureDetection();
  
  if (!results.shouldUseNew && results.oldSystemRunning) {
    console.log('🔍 Old system is running, checking tooltip creation...');
    window.debugTooltipCreation();
  }
}, 1000);

// Quick browser console check
window.quickArchCheck = function() {
  console.log(`🏗️ ThemeSystemCoordinator: ${typeof window.ThemeSystemCoordinator !== 'undefined' ? '✅' : '❌'}`);
  console.log(`📝 FootnoteService: ${typeof window.FootnoteService !== 'undefined' ? '✅' : '❌'}`);
  console.log(`🏃 Old System: ${typeof window.ContentEnhancementSystem !== 'undefined' ? '✅ RUNNING' : '❌'}`);
  console.log(`🏃 New System: ${typeof window.themeCoordinator !== 'undefined' ? '✅ RUNNING' : '❌'}`);
  console.log(`📊 Decision: ${window.ThemeSystemCoordinator && window.FootnoteService ? 'Should use NEW' : 'Will use OLD'}`);
};

console.log('🔍 Architecture detection debug loaded');
console.log('💡 Quick check: quickArchCheck()');
console.log('💡 Full debug: debugArchitectureDetection()');
console.log('💡 Tooltip debug: debugTooltipCreation()');