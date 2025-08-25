/**
 * Robust Content Enhancement System Initialization
 * 
 * Handles initialization with comprehensive error handling and logging
 * Attempts multiple initialization strategies if first approach fails
 */

// Global error handler for catching any JavaScript errors
window.addEventListener('error', (event) => {
  console.error('🚨 JavaScript Error:', event.error);
  console.error('Script:', event.filename, 'Line:', event.lineno);
});

// Initialize content enhancement system with multiple fallback strategies
function initializeContentEnhancement() {
  console.log('🚀 Starting content enhancement system initialization...');
  
  // Strategy 1: Check if system already exists
  if (window.ContentEnhancementSystem) {
    console.log('✅ ContentEnhancementSystem already exists - skipping initialization');
    return;
  }
  
  // Strategy 2: Try standard initialization
  try {
    if (typeof ContentEnhancementManager === 'undefined') {
      console.error('❌ ContentEnhancementManager class not found');
      console.log('Available classes:', {
        ContentProcessor: typeof ContentProcessor !== 'undefined',
        DeconstructionProcessor: typeof DeconstructionProcessor !== 'undefined',
        MarginaliaProcessor: typeof MarginaliaProcessor !== 'undefined',
        FootnoteProcessor: typeof FootnoteProcessor !== 'undefined'
      });
      return;
    }
    
    console.log('✅ ContentEnhancementManager found, creating instance...');
    window.ContentEnhancementSystem = new ContentEnhancementManager();
    
    console.log('🔧 Initializing system...');
    window.ContentEnhancementSystem.initialize()
      .then(success => {
        if (success) {
          console.log('✅ System initialized successfully');
          console.log('🔄 Processing content...');
          return window.ContentEnhancementSystem.processContent();
        } else {
          console.error('❌ System initialization failed');
        }
      })
      .then(processed => {
        if (processed) {
          console.log('✅ Content processing completed');
          
          // Check if deconstruction elements were processed
          const elements = document.querySelectorAll('[data-deconstruct]');
          const processedElements = document.querySelectorAll('[data-deconstruct].deconstruct-element');
          console.log(`📊 Deconstruction: ${processedElements.length}/${elements.length} elements processed`);
        } else {
          console.error('❌ Content processing failed');
        }
      })
      .catch(error => {
        console.error('❌ Initialization chain failed:', error);
        console.error('Full error:', error.stack);
      });
      
  } catch (error) {
    console.error('❌ Failed to create ContentEnhancementManager:', error);
    console.error('Full error:', error.stack);
  }
}

// Multiple initialization attempts
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded, attempting initialization...');
  
  // Immediate attempt
  initializeContentEnhancement();
  
  // Fallback attempt after 1 second
  setTimeout(() => {
    if (!window.ContentEnhancementSystem) {
      console.log('🔄 Retrying initialization after 1 second...');
      initializeContentEnhancement();
    }
  }, 1000);
  
  // Final attempt after 3 seconds
  setTimeout(() => {
    if (!window.ContentEnhancementSystem) {
      console.log('🔄 Final initialization attempt after 3 seconds...');
      initializeContentEnhancement();
    }
  }, 3000);
});

// Also try on window load as backup
window.addEventListener('load', () => {
  console.log('🪟 Window loaded');
  if (!window.ContentEnhancementSystem) {
    console.log('🔄 Window load initialization attempt...');
    initializeContentEnhancement();
  }
});

console.log('🎯 Initialization script loaded and ready');