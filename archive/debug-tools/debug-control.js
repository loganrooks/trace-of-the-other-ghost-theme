/**
 * Debug Control - Console Commands for Managing Debug Output
 * 
 * Provides easy console commands to enable/disable debug logging
 * without needing to modify Ghost theme settings
 */

// Debug control functions
window.debugControl = {
  
  /**
   * Enable debug mode and restart footnote processing with verbose logs
   */
  enableDebug() {
    console.log('🔧 Enabling debug mode...');
    
    // Override the debug mode setting
    if (window.ghost_custom_settings) {
      window.ghost_custom_settings.debug_mode = true;
    } else {
      window.ghost_custom_settings = { debug_mode: true };
    }
    
    // Update any existing processors (handle both Map and Array)
    if (window.contentManager?.processors) {
      let footnoteProcessor = null;
      
      if (window.contentManager.processors instanceof Map) {
        // New architecture uses Map
        footnoteProcessor = window.contentManager.processors.get('footnotes');
      } else if (Array.isArray(window.contentManager.processors)) {
        // Old system uses Array
        footnoteProcessor = window.contentManager.processors.find(p => p.name === 'FootnoteProcessor');
      }
      
      if (footnoteProcessor) {
        footnoteProcessor.debugMode = true;
        console.log('✅ Footnote processor debug mode enabled');
      }
    }
    
    console.log('🔍 Debug mode enabled - verbose footnote logs will now show');
    console.log('💡 Use debugControl.disableDebug() to turn off');
  },
  
  /**
   * Disable debug mode to clean up console
   */
  disableDebug() {
    console.log('🔇 Disabling debug mode...');
    
    // Disable debug mode
    if (window.ghost_custom_settings) {
      window.ghost_custom_settings.debug_mode = false;
    }
    
    // Update any existing processors (handle both Map and Array)
    if (window.contentManager?.processors) {
      let footnoteProcessor = null;
      
      if (window.contentManager.processors instanceof Map) {
        // New architecture uses Map
        footnoteProcessor = window.contentManager.processors.get('footnotes');
      } else if (Array.isArray(window.contentManager.processors)) {
        // Old system uses Array
        footnoteProcessor = window.contentManager.processors.find(p => p.name === 'FootnoteProcessor');
      }
      
      if (footnoteProcessor) {
        footnoteProcessor.debugMode = false;
        console.log('✅ Footnote processor debug mode disabled');
      }
    }
    
    console.log('🧹 Debug mode disabled - console is now clean');
    console.log('💡 Use debugControl.enableDebug() to turn back on');
  },
  
  /**
   * Show current debug status
   */
  status() {
    const ghostDebugMode = window.ghost_custom_settings?.debug_mode || false;
    
    // Handle both Map and Array for processors
    let footnoteProcessor = null;
    let processorDebugMode = false;
    
    if (window.contentManager?.processors) {
      if (window.contentManager.processors instanceof Map) {
        // New architecture uses Map
        footnoteProcessor = window.contentManager.processors.get('footnotes');
      } else if (Array.isArray(window.contentManager.processors)) {
        // Old system uses Array
        footnoteProcessor = window.contentManager.processors.find(p => p.name === 'FootnoteProcessor');
      }
      processorDebugMode = footnoteProcessor?.debugMode || false;
    }
    
    console.log('📊 Debug Status:');
    console.log(`  Ghost debug_mode: ${ghostDebugMode}`);
    console.log(`  FootnoteProcessor debug: ${processorDebugMode}`);
    console.log(`  New architecture: ${!!window.themeCoordinator}`);
    console.log(`  Old system: ${!!window.contentManager && !window.themeCoordinator}`);
    console.log(`  Emergency diagnostic: ${typeof window.diagnoseFootnoteBreakage !== 'undefined'}`);
    console.log(`  Typing debug functions: ${typeof window.debugTypingAnimationIssues !== 'undefined'}`);
    
    if (ghostDebugMode || processorDebugMode) {
      console.log('🔍 Debug mode is ON - verbose logs enabled');
    } else {
      console.log('🔇 Debug mode is OFF - clean console');
    }
    
    return {
      ghostDebugMode,
      processorDebugMode,
      hasNewArchitecture: !!window.themeCoordinator,
      hasOldSystem: !!window.contentManager,
      emergencyDiagnostic: typeof window.diagnoseFootnoteBreakage !== 'undefined',
      typingDebug: typeof window.debugTypingAnimationIssues !== 'undefined'
    };
  },
  
  /**
   * Run a quick system check
   */
  quickCheck() {
    console.log('⚡ Running quick system check...');
    
    const footnoteRefs = document.querySelectorAll('.footnote-ref').length;
    const footnoteCards = document.querySelectorAll('[data-ref]').length;
    const tooltips = document.querySelectorAll('.footnote-tooltip').length;
    
    console.log(`📊 System Status:`);
    console.log(`  Footnote references: ${footnoteRefs}`);
    console.log(`  Footnote cards: ${footnoteCards}`);
    console.log(`  Active tooltips: ${tooltips}`);
    
    // Check which system is active
    const hasNewArchitecture = !!window.themeCoordinator;
    const hasOldSystem = !!window.contentManager;
    
    console.log(`  New architecture: ${hasNewArchitecture ? '✅' : '❌'}`);
    console.log(`  Old system: ${hasOldSystem ? '⚠️' : '❌'}`);
    
    if (hasNewArchitecture && hasOldSystem) {
      console.log('🚨 BOTH SYSTEMS RUNNING - This causes conflicts!');
    }
    
    if (footnoteRefs > 0 && footnoteCards > 0) {
      console.log('✅ Footnote elements present');
    } else {
      console.log('⚠️ Missing footnote elements');
    }
    
    return { footnoteRefs, footnoteCards, tooltips, hasNewArchitecture, hasOldSystem };
  },
  
  /**
   * Show available debug commands
   */
  help() {
    console.log('🛠️ Debug Control Commands:');
    console.log('  debugControl.enableDebug()  - Enable verbose footnote logs');
    console.log('  debugControl.disableDebug() - Clean up console logging');  
    console.log('  debugControl.status()       - Show current debug status');
    console.log('  debugControl.quickCheck()   - Quick system health check');
    console.log('  debugControl.help()         - Show this help');
    console.log('');
    console.log('🚨 Emergency Functions:');
    console.log('  diagnoseFootnoteBreakage()  - Full footnote diagnostic (no white box!)');
    console.log('  testManualTooltip()         - Test tooltip creation manually');
    console.log('  debugTypingAnimationIssues() - Typing animation debug');
    console.log('  testTypingManually()        - Manual typing test');
    console.log('  diagnoseWhiteBox()          - Find white box/overlay issues');
    console.log('  hideAllSuspiciousElements() - Hide suspicious elements');
    console.log('  removeSuspiciousElements()  - Remove suspicious elements');
    console.log('');
    console.log('🧹 Tooltip Functions:');
    console.log('  cleanupStuckTooltips()      - Remove stuck footnote tooltips');  
    console.log('  testFootnoteTooltip(N)      - Test specific footnote tooltip');
    console.log('  forceReinitializeFootnotes() - Force footnote system restart');
    console.log('  debugFootnoteEvents()       - Debug footnote event listeners');
    console.log('');
    console.log('🔧 System Management:');
    console.log('  resolveSystemConflicts()    - Fix old/new system conflicts');
    console.log('  disableFootnoteLogging()    - Stop excessive footnote console logs');
    console.log('');
    console.log('📊 Access Debug Data:');
    console.log('  window.footnoteDebugResults - Full footnote diagnostic results');
    console.log('  window.whiteBoxResults      - White box diagnostic results');
    console.log('');
    console.log('✅ All functions are attached to window object and accessible in console');
  }
};

console.log('🛠️ Debug Control loaded - use debugControl.help() for commands');

// Auto-show status on load
setTimeout(() => {
  const status = window.debugControl.status();
  if (status.ghostDebugMode || status.processorDebugMode) {
    console.log('⚠️ Notice: Debug mode is currently enabled');
    console.log('💡 Use debugControl.disableDebug() to clean up console');
  }
}, 1000);