/**
 * Emergency Debug Script
 * 
 * Always loads, doesn't depend on debug mode settings
 * Provides basic system diagnostic for troubleshooting
 */

// Immediately expose emergency debug functions
window.emergencyDebug = function() {
  console.group('🚨 EMERGENCY DEBUG - Basic System Check');
  
  console.log('=== SCRIPT LOADING STATUS ===');
  console.log('window.ThemeConfig exists:', typeof window.ThemeConfig !== 'undefined');
  console.log('window.ContentProcessor exists:', typeof window.ContentProcessor !== 'undefined');
  console.log('window.DeconstructionProcessor exists:', typeof window.DeconstructionProcessor !== 'undefined');
  console.log('window.ContentEnhancementManager exists:', typeof window.ContentEnhancementManager !== 'undefined');
  console.log('window.ContentEnhancementSystem exists:', typeof window.ContentEnhancementSystem !== 'undefined');
  
  console.log('=== GHOST SETTINGS ===');
  console.log('window.ghost_custom_settings:', window.ghost_custom_settings);
  
  console.log('=== DOM ELEMENTS ===');
  const elements = document.querySelectorAll('[data-deconstruct]');
  console.log('Found deconstruction elements:', elements.length);
  elements.forEach((el, i) => {
    console.log(`Element ${i + 1}:`, {
      effectType: el.dataset.deconstruct,
      classes: el.className,
      hasProcessedClass: el.classList.contains('deconstruct-element')
    });
  });
  
  console.log('=== STYLESHEETS ===');
  const stylesheets = Array.from(document.styleSheets);
  const deconstructCSS = stylesheets.find(sheet => 
    sheet.href && sheet.href.includes('deconstruction.css')
  );
  console.log('deconstruction.css loaded:', !!deconstructCSS);
  
  console.log('=== CONSOLE ERRORS CHECK ===');
  console.log('Check the Console tab for any red error messages');
  console.log('Check the Network tab for any 404 errors on JS/CSS files');
  
  console.groupEnd();
  
  // Try to manually initialize if possible
  if (typeof window.ContentEnhancementManager !== 'undefined' && !window.ContentEnhancementSystem) {
    console.log('🔧 Attempting manual initialization...');
    try {
      window.ContentEnhancementSystem = new ContentEnhancementManager();
      window.ContentEnhancementSystem.initialize().then(() => {
        console.log('✅ Manual initialization completed');
        return window.ContentEnhancementSystem.processContent();
      }).catch(error => {
        console.error('❌ Manual initialization failed:', error);
      });
    } catch (error) {
      console.error('❌ Manual initialization threw error:', error);
    }
  }
};

// Also create a simpler version
window.quickCheck = function() {
  console.log('🔍 Quick Check:');
  console.log('Scripts loaded:', {
    ThemeConfig: !!window.ThemeConfig,
    DeconstructionProcessor: typeof DeconstructionProcessor !== 'undefined',
    ContentEnhancementSystem: !!window.ContentEnhancementSystem
  });
  console.log('Elements found:', document.querySelectorAll('[data-deconstruct]').length);
  console.log('Ghost deconstruction setting:', window.ghost_custom_settings?.enable_deconstruction);
};

// Expose immediately on script load
console.log('🚨 Emergency debug loaded. Use emergencyDebug() or quickCheck()');

// Auto-run a basic check after a short delay
setTimeout(() => {
  if (document.readyState === 'complete') {
    console.log('🔍 Auto-running basic system check...');
    window.quickCheck();
  }
}, 2000);