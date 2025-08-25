/**
 * Deconstruction Effects Debug
 * 
 * Specifically debug the effects Map and VoiceEffect
 */

window.debugDeconstructionEffects = async function() {
  console.group('🎭 DECONSTRUCTION EFFECTS DEBUG');
  
  try {
    // First check if the existing system has a working processor
    console.log('=== EXISTING SYSTEM CHECK ===');
    if (window.ContentEnhancementSystem && window.ContentEnhancementSystem.processors) {
      const existingProcessor = window.ContentEnhancementSystem.processors.get('deconstruction');
      if (existingProcessor) {
        console.log('Found existing deconstruction processor');
        console.log('Existing processor effects Map size:', existingProcessor.effects.size);
        console.log('Existing processor effects keys:', Array.from(existingProcessor.effects.keys()));
      } else {
        console.log('No existing deconstruction processor found');
      }
    }
    
    console.log('=== FRESH PROCESSOR TEST ===');
    // Create a DeconstructionProcessor instance
    const container = document.querySelector('.post-content, .page-content') || document.body;
    const processor = new window.DeconstructionProcessor({}, container);
    
    console.log('Effects Map size before init:', processor.effects.size);
    
    // Initialize the processor (this populates the effects Map)
    console.log('Calling processor.init()...');
    await processor.init();
    
    console.log('=== EFFECTS MAP INSPECTION ===');
    console.log('Effects Map size after init:', processor.effects.size);
    console.log('Effects Map keys:', Array.from(processor.effects.keys()));
    
    // Check each effect
    const effectNames = ['dissolve', 'collision', 'recursion', 'voices', 'temporal', 'syntax'];
    effectNames.forEach(name => {
      const exists = processor.effects.has(name);
      const effect = processor.effects.get(name);
      console.log(`Effect "${name}":`, {
        exists: exists,
        instance: effect ? effect.constructor.name : 'null',
        type: typeof effect
      });
    });
    
    console.log('=== VOICE EFFECT SPECIFIC ===');
    if (processor.effects.has('voices')) {
      const voiceEffect = processor.effects.get('voices');
      console.log('VoiceEffect instance:', voiceEffect);
      console.log('VoiceEffect methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(voiceEffect)));
    } else {
      console.log('❌ VoiceEffect not found in effects Map');
    }
    
    console.log('=== EFFECT CLASS DEFINITIONS ===');
    console.log('VoiceEffect class defined:', typeof VoiceEffect !== 'undefined');
    console.log('BaseEffect class defined:', typeof BaseEffect !== 'undefined');
    
    if (typeof VoiceEffect !== 'undefined') {
      console.log('VoiceEffect prototype:', VoiceEffect.prototype);
    }
    
    console.log('=== MANUAL EFFECT TEST ===');
    // Try to manually test the voices effect using the initialized processor
    const testElement = document.querySelector('[data-deconstruct="voices"]');
    if (testElement && processor.effects.has('voices')) {
      const voiceEffect = processor.effects.get('voices');
      
      console.log('Testing VoiceEffect on element...');
      console.log('Test element:', testElement.outerHTML.substring(0, 100) + '...');
      
      try {
        // Try to initialize the effect
        voiceEffect.initialize(testElement, { mode: 'interrupt' });
        console.log('✅ VoiceEffect.initialize() succeeded');
        
        // Try to activate the effect
        voiceEffect.activate(testElement, { mode: 'interrupt' });
        console.log('✅ VoiceEffect.activate() succeeded');
        
        // Check element changes
        console.log('Element classes after effect:', testElement.className);
        console.log('Element children after effect:', testElement.children.length);
        
        // Check for voice spans
        const voiceSpans = testElement.querySelectorAll('[data-voice]');
        console.log(`Found ${voiceSpans.length} voice spans in element`);
        
        if (voiceSpans.length > 0) {
          console.log('Voice span classes:', voiceSpans[0].className);
        }
        
      } catch (error) {
        console.error('❌ Manual effect test failed:', error);
        console.error('Full error:', error.stack);
      }
    } else {
      console.log('❌ Cannot test effect - reasons:', {
        elementExists: !!testElement,
        effectExists: processor.effects.has('voices'),
        effectsMapSize: processor.effects.size
      });
    }
    
  } catch (error) {
    console.error('❌ Effects debug failed:', error);
    console.error('Full error:', error.stack);
  }
  
  console.groupEnd();
};

console.log('🎭 Deconstruction effects debugger loaded. Use debugDeconstructionEffects()');