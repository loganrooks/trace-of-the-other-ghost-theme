/**
 * Simple Typing Animation Debug Functions
 * Standalone debug functions that don't depend on complex loading
 */

// Simple debug function - always available
window.debugTypingAnimationIssues = function() {
  console.log('=== SIMPLE TYPING ANIMATION DEBUG ===');
  console.log('Time:', new Date().toISOString());
  
  console.log('\n1. SCRIPT LOADING STATUS:');
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const typingScript = scripts.find(s => s.src.includes('typing-animation.js'));
  console.log('typing-animation.js script found:', typingScript ? 'YES' : 'NO');
  if (typingScript) {
    console.log('Script URL:', typingScript.src);
  }
  
  console.log('\n2. GLOBAL AVAILABILITY:');
  console.log('typeof TypingAnimation:', typeof TypingAnimation);
  console.log('typeof window.TypingAnimation:', typeof window.TypingAnimation);
  
  console.log('\n3. INSTANTIATION TEST:');
  if (typeof window.TypingAnimation !== 'undefined') {
    try {
      const instance = new window.TypingAnimation(console);
      console.log('✅ Can create TypingAnimation instance');
      console.log('Instance name:', instance.name);
      console.log('Execute method type:', typeof instance.execute);
    } catch (error) {
      console.error('❌ Cannot create TypingAnimation instance:', error);
    }
  } else {
    console.error('❌ window.TypingAnimation is undefined');
  }
  
  console.log('\n4. ACTION ENGINE STATUS:');
  if (window.contentManager?.processors) {
    const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
    if (interactiveProcessor?.actionEngine) {
      const registeredAnimations = Array.from(interactiveProcessor.actionEngine.animationModules.keys());
      console.log('Registered animation modules:', registeredAnimations);
      
      console.log('\n5. MANUAL REGISTRATION ATTEMPT:');
      if (typeof window.TypingAnimation !== 'undefined') {
        try {
          const typingInstance = new window.TypingAnimation(console);
          interactiveProcessor.actionEngine.registerAnimation('typing', typingInstance);
          console.log('✅ Manual registration successful');
          
          const nowRegistered = Array.from(interactiveProcessor.actionEngine.animationModules.keys());
          console.log('Now registered:', nowRegistered);
        } catch (error) {
          console.error('❌ Manual registration failed:', error);
        }
      }
    } else {
      console.error('❌ ActionEngine not found');
    }
  } else {
    console.error('❌ ContentManager not found');
  }
  
  console.log('\n=== DEBUG COMPLETE ===');
};

// Also create a simple test function
window.testTypingManually = function() {
  console.log('=== MANUAL TYPING TEST ===');
  
  if (typeof window.TypingAnimation === 'undefined') {
    console.error('❌ TypingAnimation not available');
    return;
  }
  
  try {
    const typing = new window.TypingAnimation(console);
    const testElement = document.querySelector('p') || document.body;
    
    console.log('🧪 Testing typing animation...');
    
    typing.execute({
      targetElements: [testElement],
      content: 'Test of <strong>bold</strong> and <em>italic</em> text with proper styling.',
      duration: 3000,
      overlay: 'over'
    }).then(() => {
      console.log('✅ Manual test completed');
    }).catch(error => {
      console.error('❌ Manual test failed:', error);
    });
  } catch (error) {
    console.error('❌ Manual test setup failed:', error);
  }
};

// HTML and RTL specific debug function  
window.debugTypingHTML = function() {
  console.log('=== TYPING ANIMATION HTML DEBUG ===');
  
  if (typeof window.TypingAnimation === 'undefined') {
    console.error('❌ TypingAnimation not available');
    return;
  }
  
  // Test content with HTML and RTL
  const testContent = `Test <strong>bold text</strong> and <em>italic text</em>
<a href="https://example.com">This is a link</a>
Hebrew text: בוות על כתבה על כתב
Arabic text: حاجز`;
  
  console.log('🧪 Testing HTML parsing with:', testContent);
  
  try {
    const typing = new window.TypingAnimation(console);
    
    // Test HTML parsing directly
    console.log('📝 Testing parseHtmlContent...');
    const tokens = typing.parseHtmlContent(testContent);
    
    console.log(`Generated ${tokens.length} tokens:`);
    tokens.forEach((token, index) => {
      if (index < 10) { // Show first 10 tokens
        console.log(`Token ${index}:`, {
          type: token.type,
          content: token.content ? token.content.substring(0, 50) : undefined,
          tagName: token.tagName
        });
      }
    });
    
    // Test RTL detection
    console.log('🔍 Testing RTL detection...');
    const rtlTest1 = 'בוות על כתבה על כתב';
    const rtlTest2 = 'حاجز';
    const ltrTest = 'This is English text';
    
    console.log('Hebrew RTL detected:', typing.detectRTL(rtlTest1));
    console.log('Arabic RTL detected:', typing.detectRTL(rtlTest2));
    console.log('English RTL detected:', typing.detectRTL(ltrTest));
    
    console.log('✅ HTML debug completed');
    
  } catch (error) {
    console.error('❌ HTML debug test failed:', error);
  }
};

console.log('🐛 Simple debug functions loaded: debugTypingAnimationIssues(), testTypingManually(), debugTypingHTML()');