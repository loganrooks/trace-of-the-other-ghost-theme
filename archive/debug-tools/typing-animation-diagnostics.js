/**
 * Typing Animation Diagnostics
 * Comprehensive debugging for TypingAnimation registration issues
 * 
 * Usage: Call window.debugTypingAnimationIssues() in browser console
 * 
 * Created: August 26, 2025
 */

// Make debug function globally available
window.debugTypingAnimationIssues = function() {
  console.log('===========================================');
  console.log('🐛 TYPING ANIMATION DIAGNOSTIC REPORT');
  console.log('===========================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('User Agent:', navigator.userAgent);
  console.log('URL:', window.location.href);
  console.log('');
  
  // 1. Check script loading status
  console.log('📜 SCRIPT LOADING STATUS');
  console.log('-------------------------------------------');
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const typingScript = scripts.find(s => s.src.includes('typing-animation'));
  const interactiveScript = scripts.find(s => s.src.includes('interactive-marker-processor'));
  const actionEngineScript = scripts.find(s => s.src.includes('action-engine'));
  
  console.log('📄 typing-animation.js script element:', typingScript ? '✅ FOUND' : '❌ NOT FOUND');
  if (typingScript) {
    console.log('   - URL:', typingScript.src);
    console.log('   - Async:', typingScript.async);
    console.log('   - Defer:', typingScript.defer);
  }
  
  console.log('📄 interactive-marker-processor.js:', interactiveScript ? '✅ FOUND' : '❌ NOT FOUND');
  console.log('📄 action-engine.js:', actionEngineScript ? '✅ FOUND' : '❌ NOT FOUND');
  console.log('');
  
  // 2. Check global class availability  
  console.log('🌐 GLOBAL CLASS AVAILABILITY');
  console.log('-------------------------------------------');
  
  const typingAnimationGlobal = typeof TypingAnimation !== 'undefined';
  const typingAnimationWindow = typeof window.TypingAnimation !== 'undefined';
  const actionEngineGlobal = typeof ActionEngine !== 'undefined';
  const interactiveProcessorGlobal = typeof InteractiveMarkerProcessor !== 'undefined';
  
  console.log('TypingAnimation (global):', typingAnimationGlobal ? '✅ AVAILABLE' : '❌ NOT AVAILABLE');
  console.log('window.TypingAnimation:', typingAnimationWindow ? '✅ AVAILABLE' : '❌ NOT AVAILABLE');
  console.log('ActionEngine:', actionEngineGlobal ? '✅ AVAILABLE' : '❌ NOT AVAILABLE');
  console.log('InteractiveMarkerProcessor:', interactiveProcessorGlobal ? '✅ AVAILABLE' : '❌ NOT AVAILABLE');
  
  // Show all animation-related globals
  const animationGlobals = Object.keys(window).filter(k => 
    k.toLowerCase().includes('animation') || k.toLowerCase().includes('typing')
  );
  console.log('Animation-related globals:', animationGlobals);
  console.log('');
  
  // 3. Test TypingAnimation instantiation
  console.log('🧪 TYPING ANIMATION INSTANTIATION TEST');
  console.log('-------------------------------------------');
  
  let typingInstance = null;
  
  if (typingAnimationGlobal) {
    try {
      typingInstance = new TypingAnimation(console);
      console.log('✅ Successfully created TypingAnimation instance (global)');
      console.log('   - Name:', typingInstance.name);
      console.log('   - Execute method:', typeof typingInstance.execute);
    } catch (error) {
      console.error('❌ Failed to create TypingAnimation instance (global):', error);
    }
  } else if (typingAnimationWindow) {
    try {
      typingInstance = new window.TypingAnimation(console);
      console.log('✅ Successfully created window.TypingAnimation instance');
      console.log('   - Name:', typingInstance.name);
      console.log('   - Execute method:', typeof typingInstance.execute);
    } catch (error) {
      console.error('❌ Failed to create window.TypingAnimation instance:', error);
    }
  } else {
    console.error('❌ TypingAnimation class not available in any form');
  }
  console.log('');
  
  // 4. Check ContentManager and processors
  console.log('📊 CONTENT MANAGEMENT SYSTEM STATUS');
  console.log('-------------------------------------------');
  
  if (window.contentManager) {
    console.log('✅ Content Manager found');
    console.log('   - Processors:', window.contentManager.processors ? window.contentManager.processors.length : 'undefined');
    
    if (window.contentManager.processors) {
      const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
      if (interactiveProcessor) {
        console.log('✅ Interactive Marker Processor found');
        console.log('   - Has ActionEngine:', !!interactiveProcessor.actionEngine);
        
        if (interactiveProcessor.actionEngine) {
          const registeredAnimations = interactiveProcessor.actionEngine.animationModules 
            ? Array.from(interactiveProcessor.actionEngine.animationModules.keys())
            : [];
          console.log('   - Registered animations:', registeredAnimations);
        }
      } else {
        console.log('❌ Interactive Marker Processor NOT FOUND in content manager');
      }
    }
  } else {
    console.log('❌ Content Manager not found');
  }
  console.log('');
  
  // 5. Manual registration attempt
  console.log('🔧 MANUAL REGISTRATION ATTEMPT');
  console.log('-------------------------------------------');
  
  if (window.contentManager?.processors) {
    const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
    
    if (interactiveProcessor && interactiveProcessor.actionEngine && typingInstance) {
      try {
        interactiveProcessor.actionEngine.registerAnimation('typing', typingInstance);
        console.log('✅ Manual registration successful!');
        
        const nowRegistered = Array.from(interactiveProcessor.actionEngine.animationModules.keys());
        console.log('   - Now registered:', nowRegistered);
      } catch (error) {
        console.error('❌ Manual registration failed:', error);
      }
    } else {
      const missing = [];
      if (!interactiveProcessor) missing.push('InteractiveProcessor');
      if (!interactiveProcessor?.actionEngine) missing.push('ActionEngine');
      if (!typingInstance) missing.push('TypingAnimation instance');
      
      console.error('❌ Cannot attempt manual registration. Missing:', missing.join(', '));
    }
  }
  console.log('');
  
  // 6. Network diagnostics
  console.log('🌐 NETWORK DIAGNOSTICS');
  console.log('-------------------------------------------');
  
  if (typingScript) {
    // Try to fetch the script directly to check if it's accessible
    fetch(typingScript.src)
      .then(response => {
        console.log('✅ typing-animation.js network fetch:', response.status, response.statusText);
        return response.text();
      })
      .then(scriptContent => {
        const hasClass = scriptContent.includes('class TypingAnimation');
        const hasExport = scriptContent.includes('window.TypingAnimation');
        console.log('   - Contains class definition:', hasClass ? '✅' : '❌');
        console.log('   - Contains window export:', hasExport ? '✅' : '❌');
        console.log('   - Script length:', scriptContent.length, 'characters');
      })
      .catch(error => {
        console.error('❌ Failed to fetch typing-animation.js:', error);
      });
  }
  
  console.log('');
  console.log('🎯 RECOMMENDATIONS');
  console.log('-------------------------------------------');
  
  if (!typingScript) {
    console.log('🔴 CRITICAL: typing-animation.js script not found in DOM');
    console.log('   → Check default.hbs script loading order');
  } else if (!typingAnimationGlobal && !typingAnimationWindow) {
    console.log('🔴 CRITICAL: TypingAnimation class not exported to global scope');
    console.log('   → Script loaded but class not available');
    console.log('   → Check script execution errors');
  } else if (!interactiveProcessor?.actionEngine) {
    console.log('🔴 CRITICAL: ActionEngine not initialized');
    console.log('   → Check InteractiveMarkerProcessor initialization');
  } else {
    console.log('🟡 Issue appears to be registration timing');
    console.log('   → Scripts loaded, classes available, but registration failed');
  }
  
  console.log('');
  console.log('===========================================');
  console.log('🏁 DIAGNOSTIC COMPLETE');
  console.log('===========================================');
};

// Auto-run diagnostics if ?debug=typing is in URL
if (window.location.search.includes('debug=typing')) {
  // Wait for page load to ensure all scripts are loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(window.debugTypingAnimationIssues, 1000);
    });
  } else {
    setTimeout(window.debugTypingAnimationIssues, 1000);
  }
}

console.log('🐛 Typing Animation Diagnostics loaded. Run debugTypingAnimationIssues() to diagnose issues.');

// =================================================================
// HTML AND RTL DEBUGGING FUNCTIONS
// =================================================================

window.debugTypingHTML = function() {
  console.log('=== TYPING ANIMATION HTML DEBUG ===');
  
  if (typeof window.TypingAnimation === 'undefined') {
    console.error('❌ TypingAnimation not available');
    return;
  }
  
  // Test content with HTML and RTL
  const testContent = `Test <strong>bold text</strong> and <em>italic text</em>.
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
      console.log(`Token ${index}:`, {
        type: token.type,
        content: token.content ? token.content.substring(0, 50) : undefined,
        tagName: token.tagName,
        delay: token.delay
      });
    });
    
    // Test RTL detection
    console.log('🔍 Testing RTL detection...');
    const rtlTest1 = 'בוות על כתבה על כתב';
    const rtlTest2 = 'حاجز';
    const ltrTest = 'This is English text';
    
    console.log('Hebrew RTL detected:', typing.detectRTL(rtlTest1));
    console.log('Arabic RTL detected:', typing.detectRTL(rtlTest2));
    console.log('English RTL detected:', typing.detectRTL(ltrTest));
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
};

window.fixTypingHTML = function() {
  console.log('=== ATTEMPTING TO FIX TYPING HTML ISSUES ===');
  
  if (typeof window.TypingAnimation === 'undefined') {
    console.error('❌ TypingAnimation not available');
    return;
  }
  
  // Create a monkey-patch for better HTML and RTL handling
  const originalAddWrappedContent = window.TypingAnimation.prototype.addWrappedContent;
  const originalParseHtmlContent = window.TypingAnimation.prototype.parseHtmlContent;
  
  // Override addWrappedContent for better RTL handling
  window.TypingAnimation.prototype.addWrappedContent = async function(animationElements, token, timing, controller) {
    const { element: templateElement, content, tagName } = token;
    
    console.log('🔧 Fixed addWrappedContent for:', tagName, 'with content:', content);
    
    // Create wrapper elements with proper RTL detection
    const hasRTL = this.detectRTL(content);
    
    animationElements.forEach(({ element }) => {
      // Clone the template element
      const wrapperElement = templateElement.cloneNode(false);
      
      // Apply RTL styling if needed
      if (hasRTL) {
        wrapperElement.style.direction = 'rtl';
        wrapperElement.style.textAlign = 'right';
        wrapperElement.style.unicodeBidi = 'embed';
        console.log('📝 Applied RTL styling to element:', wrapperElement);
      } else {
        wrapperElement.style.unicodeBidi = 'plaintext';
      }
      
      // Append to target
      element.appendChild(wrapperElement);
    });
    
    // Type content character by character
    for (let i = 0; i < content.length; i++) {
      if (controller.cancelled) return;
      
      const char = content[i];
      
      animationElements.forEach(({ element }) => {
        const wrapperElement = element.lastChild;
        const textNode = document.createTextNode(char);
        wrapperElement.appendChild(textNode);
      });
      
      // Character delay
      let delay = timing.characterDelay;
      if (/[.!?;:,]/.test(char) && timing.punctuationPause > 0) {
        delay += timing.punctuationPause;
      }
      
      if (i < content.length - 1) {
        await this.delay(delay, controller);
      }
    }
  };
  
  // Override parseHtmlContent for better line break handling
  window.TypingAnimation.prototype.parseHtmlContent = function(htmlContent) {
    console.log('🔍 Enhanced HTML parsing for:', htmlContent.substring(0, 100));
    
    // Handle line breaks explicitly
    const contentWithBreaks = htmlContent
      .replace(/\n\s*\n/g, '<br><br>')  // Double newlines = paragraph breaks
      .replace(/\n/g, '<br>')          // Single newlines = line breaks
      .replace(/\r/g, '');             // Remove carriage returns
    
    console.log('After line break processing:', contentWithBreaks.substring(0, 100));
    
    // Use original parsing
    return originalParseHtmlContent.call(this, contentWithBreaks);
  };
  
  // Re-register with action engine if available
  if (window.contentManager?.processors) {
    const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
    if (interactiveProcessor?.actionEngine) {
      try {
        const patchedInstance = new window.TypingAnimation(console);
        interactiveProcessor.actionEngine.registerAnimation('typing', patchedInstance);
        console.log('✅ Re-registered patched TypingAnimation with ActionEngine');
      } catch (error) {
        console.error('❌ Failed to re-register patched TypingAnimation:', error);
      }
    }
  }
  
  console.log('🎉 Applied HTML and RTL fixes! Try clicking the ? marker again.');
};

console.log('🐛 HTML Debug functions loaded: debugTypingHTML(), fixTypingHTML()');