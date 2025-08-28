/**
 * TypingAnimation Bulletproof Loader
 * Ensures TypingAnimation is available globally with comprehensive fallbacks
 * 
 * This script MUST load after typing-animation.js
 * Created: August 26, 2025
 */

(function() {
  'use strict';
  
  console.log('🚀 TypingAnimation Bulletproof Loader starting...');
  
  // Check if TypingAnimation is already available (and not our fallback)
  if (typeof window.TypingAnimation !== 'undefined' && 
      window.TypingAnimation.name !== 'MinimalTypingAnimation') {
    console.log('✅ Real TypingAnimation already available globally');
    setupDebugFunctions();
    return;
  }
  
  if (typeof TypingAnimation !== 'undefined' &&
      TypingAnimation.name !== 'MinimalTypingAnimation') {
    console.log('✅ Real TypingAnimation found in global scope, copying to window');
    window.TypingAnimation = TypingAnimation;
    setupDebugFunctions();
    return;
  }
  
  // TypingAnimation not found - try to recreate it from scratch
  console.warn('⚠️ TypingAnimation not found, creating minimal implementation...');
  
  // Minimal TypingAnimation class that can handle basic functionality
  window.TypingAnimation = class MinimalTypingAnimation {
    constructor(logger = console) {
      this.logger = logger;
      this.name = 'typing';
      this.logger.info('🔧 Using minimal TypingAnimation fallback');
    }
    
    async execute(config) {
      const {
        targetElements,
        content,
        duration = 2000,
        overlay = 'over',
        originalStates
      } = config;
      
      this.logger.info('🎭 Executing minimal typing animation for:', content?.substring(0, 50));
      
      if (!targetElements || targetElements.length === 0) {
        throw new Error('No target elements provided for animation');
      }
      
      const targetElement = targetElements[0];
      
      // Create overlay element
      const overlayElement = document.createElement('div');
      overlayElement.style.cssText = `
        position: absolute;
        background: rgba(0, 255, 0, 0.1);
        color: #00ff00;
        padding: 10px;
        border: 1px solid #00ff00;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        line-height: 1.4;
        z-index: 1000;
        max-width: 400px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
      `;
      
      // Position overlay relative to target
      const rect = targetElement.getBoundingClientRect();
      overlayElement.style.left = (rect.left + window.scrollX) + 'px';
      overlayElement.style.top = (rect.bottom + window.scrollY + 10) + 'px';
      
      document.body.appendChild(overlayElement);
      
      // Type content character by character
      const text = content || 'Interactive content would appear here...';
      const characterDelay = Math.max(50, duration / text.length);
      
      let displayedText = '';
      const controller = {
        cancelled: false,
        cleanup: () => {
          if (overlayElement && overlayElement.parentNode) {
            overlayElement.parentNode.removeChild(overlayElement);
          }
        }
      };
      
      for (let i = 0; i < text.length; i++) {
        if (controller.cancelled) break;
        
        displayedText += text[i];
        overlayElement.textContent = displayedText + '|'; // Add cursor
        
        await new Promise(resolve => setTimeout(resolve, characterDelay));
      }
      
      // Remove cursor
      if (!controller.cancelled) {
        overlayElement.textContent = displayedText;
      }
      
      this.logger.info('✅ Minimal typing animation completed');
      return controller;
    }
  };
  
  console.log('🔧 Minimal TypingAnimation implementation created');
  setupDebugFunctions();
  
  function setupDebugFunctions() {
    // Enhanced debug function
    window.debugTypingAnimationIssues = function() {
      console.log('===========================================');
      console.log('🐛 TYPING ANIMATION DIAGNOSTIC REPORT');
      console.log('===========================================');
      
      console.log('TypingAnimation availability:');
      console.log('  - typeof TypingAnimation:', typeof TypingAnimation);
      console.log('  - typeof window.TypingAnimation:', typeof window.TypingAnimation);
      console.log('  - Can create instance:', typeof window.TypingAnimation !== 'undefined' ? 'YES' : 'NO');
      
      if (typeof window.TypingAnimation !== 'undefined') {
        try {
          const instance = new window.TypingAnimation(console);
          console.log('  - Instance name:', instance.name);
          console.log('  - Execute method:', typeof instance.execute);
          console.log('✅ TypingAnimation is working');
        } catch (error) {
          console.error('❌ Failed to create TypingAnimation instance:', error);
        }
      }
      
      // Check if interactive markers can use it
      if (window.contentManager?.processors) {
        const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
        if (interactiveProcessor?.actionEngine) {
          console.log('ActionEngine animation modules:', 
            Array.from(interactiveProcessor.actionEngine.animationModules.keys()));
            
          // Try to register manually
          if (typeof window.TypingAnimation !== 'undefined') {
            try {
              const typingInstance = new window.TypingAnimation(console);
              interactiveProcessor.actionEngine.registerAnimation('typing', typingInstance);
              console.log('✅ Manual registration successful!');
            } catch (error) {
              console.error('❌ Manual registration failed:', error);
            }
          }
        }
      }
      
      console.log('===========================================');
    };
    
    // Simple test function
    window.testTypingAnimation = function() {
      if (typeof window.TypingAnimation === 'undefined') {
        console.error('❌ TypingAnimation not available');
        return;
      }
      
      const typing = new window.TypingAnimation(console);
      const testElement = document.querySelector('p') || document.body;
      
      typing.execute({
        targetElements: [testElement],
        content: 'This is a test of the typing animation system.',
        duration: 2000,
        overlay: 'over'
      }).then(() => {
        console.log('✅ Test completed successfully');
      }).catch(error => {
        console.error('❌ Test failed:', error);
      });
    };
    
    console.log('🐛 Debug functions available: debugTypingAnimationIssues(), testTypingAnimation()');
  }
})();

// Also force registration with any existing ActionEngines
setTimeout(() => {
  if (typeof window.TypingAnimation !== 'undefined' && window.contentManager?.processors) {
    const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
    if (interactiveProcessor?.actionEngine) {
      try {
        const typingInstance = new window.TypingAnimation(console);
        interactiveProcessor.actionEngine.registerAnimation('typing', typingInstance);
        console.log('🔄 Forced TypingAnimation registration on ActionEngine');
      } catch (error) {
        console.error('❌ Forced registration failed:', error);
      }
    }
  }
}, 500);