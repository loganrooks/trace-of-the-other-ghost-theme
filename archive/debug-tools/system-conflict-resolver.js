/**
 * System Conflict Resolver
 * 
 * Resolves conflicts between old and new architecture systems
 * and provides clean transition tools
 */

window.resolveSystemConflicts = function() {
  console.log('🔧 RESOLVING SYSTEM CONFLICTS');
  console.log('============================');
  
  const hasNewArchitecture = !!window.themeCoordinator;
  const hasOldSystem = !!window.ContentEnhancementSystem;
  
  console.log(`New architecture present: ${hasNewArchitecture ? '✅' : '❌'}`);
  console.log(`Old system present: ${hasOldSystem ? '⚠️' : '❌'}`);
  
  if (hasNewArchitecture && hasOldSystem) {
    console.log('🚨 CONFLICT DETECTED: Both systems are running');
    console.log('🔧 Disabling old system...');
    
    // Clean up old system
    if (window.ContentEnhancementSystem.cleanup) {
      window.ContentEnhancementSystem.cleanup();
    }
    
    // Remove old event listeners by clearing the old system
    delete window.ContentEnhancementSystem;
    
    console.log('✅ Old system disabled');
    console.log('🎯 New architecture is now the sole handler');
    
    // Test new system
    setTimeout(() => {
      console.log('🧪 Testing new system...');
      if (window.newArchitecture && window.newArchitecture.testFootnotes) {
        window.newArchitecture.testFootnotes();
      }
    }, 500);
    
  } else if (hasNewArchitecture && !hasOldSystem) {
    console.log('✅ CLEAN STATE: Only new architecture running');
    
    // Test new system
    setTimeout(() => {
      console.log('🧪 Testing footnote functionality...');
      if (window.newArchitecture && window.newArchitecture.testFootnotes) {
        window.newArchitecture.testFootnotes();
      }
    }, 500);
    
  } else if (!hasNewArchitecture && hasOldSystem) {
    console.log('⚠️ LEGACY MODE: Only old system running');
    console.log('💡 New architecture failed to initialize');
    
  } else {
    console.log('❌ NO SYSTEMS: Neither architecture is running');
    console.log('🔧 Try: newArchitecture.reinitialize()');
  }
  
  return {
    hasNewArchitecture,
    hasOldSystem,
    conflictResolved: hasNewArchitecture && !hasOldSystem
  };
};

// Disable verbose footnote logging specifically
window.disableFootnoteLogging = function() {
  console.log('🔇 Disabling footnote processing logs...');
  
  // Try to disable debug mode on any existing footnote processors
  if (window.contentManager?.processors) {
    let processor = null;
    
    if (window.contentManager.processors instanceof Map) {
      processor = window.contentManager.processors.get('footnotes');
    } else if (Array.isArray(window.contentManager.processors)) {
      processor = window.contentManager.processors.find(p => p.name === 'FootnoteProcessor');
    }
    
    if (processor && processor.debugMode !== undefined) {
      processor.debugMode = false;
      console.log('✅ Disabled footnote processor debug logging');
    }
  }
  
  // Also ensure global debug mode is off
  if (window.ghost_custom_settings) {
    window.ghost_custom_settings.debug_mode = false;
    console.log('✅ Disabled global debug mode');
  }
  
  console.log('🧹 Footnote console spam should now be stopped');
};

// Auto-run conflict resolution - DISABLED - preventing dual initialization instead
// setTimeout(() => {
//   console.log('🔧 Auto-running system conflict resolution...');
//   window.resolveSystemConflicts();
// }, 3000);

console.log('🔧 System conflict resolver loaded - call resolveSystemConflicts() manually if needed');