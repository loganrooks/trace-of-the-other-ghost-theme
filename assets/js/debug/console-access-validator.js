/**
 * Console Access Validator
 * 
 * Validates that all debug functions are properly accessible from browser console
 * and provides a summary of available debugging tools
 */

// Validate console access on page load
window.validateConsoleAccess = function() {
  console.log('🔍 CONSOLE ACCESS VALIDATION');
  console.log('============================');
  
  const expectedFunctions = [
    'diagnoseFootnoteBreakage',
    'testManualTooltip', 
    'debugTypingAnimationIssues',
    'testTypingManually',
    'debugTypingHTML',
    'diagnoseWhiteBox',
    'hideAllSuspiciousElements', 
    'removeSuspiciousElements',
    'debugControl'
  ];
  
  const available = [];
  const missing = [];
  
  expectedFunctions.forEach(funcName => {
    if (typeof window[funcName] !== 'undefined') {
      available.push(funcName);
      console.log(`✅ ${funcName} - ${typeof window[funcName]}`);
    } else {
      missing.push(funcName);
      console.log(`❌ ${funcName} - NOT FOUND`);
    }
  });
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`  ✅ Available functions: ${available.length}/${expectedFunctions.length}`);
  console.log(`  ❌ Missing functions: ${missing.length}`);
  
  if (missing.length > 0) {
    console.log(`\n⚠️ Missing functions: ${missing.join(', ')}`);
  }
  
  console.log(`\n💡 To see all available functions, type: debugControl.help()`);
  
  return {
    available,
    missing,
    totalExpected: expectedFunctions.length,
    allAccessible: missing.length === 0
  };
};

// Auto-validate on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.validateConsoleAccess, 3000);
  });
} else {
  setTimeout(window.validateConsoleAccess, 3000);
}

console.log('✅ Console access validator loaded - will auto-run in 3 seconds');