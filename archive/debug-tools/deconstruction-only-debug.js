/**
 * Deconstruction-Only Debug (No Console Overflow)
 * 
 * Focused debug that avoids triggering verbose footnote logs
 */

window.debugDeconstructionOnly = async function() {
  console.group('🎭 DECONSTRUCTION-ONLY DEBUG');
  
  try {
    // Find the deconstruction element
    const element = document.querySelector('[data-deconstruct="voices"]');
    if (!element) {
      console.log('❌ No deconstruction element found');
      console.groupEnd();
      return;
    }
    
    console.log('=== ELEMENT STATUS ===');
    console.log('Element found:', !!element);
    console.log('Element classes BEFORE:', element.className);
    console.log('Voice spans:', element.querySelectorAll('[data-voice]').length);
    
    // Get main system deconstruction processor
    console.log('=== MAIN SYSTEM PROCESSOR ===');
    if (!window.ContentEnhancementSystem) {
      console.log('❌ ContentEnhancementSystem not found');
      console.groupEnd();
      return;
    }
    
    const mainProcessor = window.ContentEnhancementSystem.processors?.get('deconstruction');
    if (!mainProcessor) {
      console.log('❌ Deconstruction processor not found in main system');
      console.groupEnd();
      return;
    }
    
    console.log('✅ Main system deconstruction processor found');
    console.log('Processor effects Map size:', mainProcessor.effects.size);
    console.log('Processor initialized:', mainProcessor.initialized || 'unknown');
    
    // Test main system processor directly
    console.log('=== MAIN SYSTEM PROCESSOR TEST ===');
    console.log('Testing main system processor on element...');
    
    try {
      // DIRECTLY process with main system processor (avoid processContent() overflow)
      const result = mainProcessor.process(element);
      console.log('Main processor.process() result:', result);
      console.log('Element classes AFTER main processor:', element.className);
      
      // Check if voice effect was applied
      const voiceSpans = element.querySelectorAll('[data-voice]');
      if (voiceSpans.length > 0) {
        console.log('First voice span classes:', voiceSpans[0].className);
      }
      
    } catch (error) {
      console.error('❌ Main processor failed:', error.message);
      console.error('Error details:', error);
    }
    
    console.log('=== COMPARISON TEST ===');
    // Reset element for fair comparison
    element.className = '';
    element.querySelectorAll('[data-voice]').forEach(span => {
      span.className = span.className.replace(/voice-\w+/g, '').trim();
    });
    
    console.log('Element classes after reset:', element.className);
    
    // Test fresh processor (like manual debug does)
    console.log('Testing fresh processor...');
    try {
      const container = document.querySelector('.post-content') || document.body;
      const freshProcessor = new window.DeconstructionProcessor({}, container);
      await freshProcessor.init();
      
      const freshResult = freshProcessor.process(element);
      console.log('Fresh processor.process() result:', freshResult);
      console.log('Element classes AFTER fresh processor:', element.className);
      
    } catch (error) {
      console.error('❌ Fresh processor failed:', error.message);
    }
    
    console.log('=== SUMMARY ===');
    console.log('Main system exists:', !!window.ContentEnhancementSystem);
    console.log('Main processor exists:', !!mainProcessor);
    console.log('Element final classes:', element.className);
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
  
  console.groupEnd();
};

// Quick status check without triggering processing
window.quickDeconstructionStatus = function() {
  const element = document.querySelector('[data-deconstruct="voices"]');
  const mainProcessor = window.ContentEnhancementSystem?.processors?.get('deconstruction');
  
  console.log('🎭 QUICK STATUS:');
  console.log('Element exists:', !!element);
  console.log('Element classes:', element?.className || 'none');
  console.log('Main processor exists:', !!mainProcessor);
  console.log('Main processor effects:', mainProcessor?.effects.size || 0);
  console.log('System initialized:', window.ContentEnhancementSystem?.initialized || false);
  console.log('System processed:', window.ContentEnhancementSystem?.processed || false);
};

console.log('🎭 Deconstruction-only debugger loaded (no overflow). Use:');
console.log('- debugDeconstructionOnly()');
console.log('- quickDeconstructionStatus()');