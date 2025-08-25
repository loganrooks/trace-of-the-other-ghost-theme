/**
 * Script Execution Debug
 * 
 * Tests whether scripts are loading but failing to execute/define classes
 */

window.scriptExecutionDebug = function() {
  console.group('🔍 SCRIPT EXECUTION DEBUG');
  
  console.log('=== CHECKING SCRIPT TAGS ===');
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const ourScripts = scripts.filter(script => 
    script.src.includes('/assets/js/') || 
    script.src.includes('content-') || 
    script.src.includes('deconstruction')
  );
  
  console.log(`Found ${ourScripts.length} theme JavaScript files:`);
  ourScripts.forEach(script => {
    console.log(`- ${script.src}`);
    console.log(`  loaded: ${script.readyState || 'unknown'}`);
    console.log(`  error: ${script.onerror ? 'has error handler' : 'no error handler'}`);
  });
  
  console.log('=== CHECKING CLASS DEFINITIONS ===');
  
  // Try to access ContentProcessor directly from script
  try {
    console.log('Attempting to access ContentProcessor...');
    if (typeof ContentProcessor !== 'undefined') {
      console.log('✅ ContentProcessor accessible');
    } else {
      console.log('❌ ContentProcessor not accessible');
      
      // Check if it might be in a different scope
      console.log('Checking window.ContentProcessor:', window.ContentProcessor);
      console.log('Checking global ContentProcessor:', globalThis.ContentProcessor);
    }
  } catch (error) {
    console.error('❌ Error accessing ContentProcessor:', error);
  }
  
  console.log('=== CHECKING SCRIPT ERRORS ===');
  
  // Override console.error temporarily to catch any errors
  const originalError = console.error;
  const scriptErrors = [];
  
  console.error = function(...args) {
    scriptErrors.push(args);
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.error = originalError;
    if (scriptErrors.length > 0) {
      console.log('❌ Found script errors:', scriptErrors);
    } else {
      console.log('✅ No script errors detected');
    }
  }, 100);
  
  console.log('=== MANUAL SCRIPT LOAD TEST ===');
  
  // Try to manually load and execute content-processor-base.js
  fetch('/assets/js/core/content-processor-base.js')
    .then(response => response.text())
    .then(scriptText => {
      console.log('✅ Successfully fetched content-processor-base.js');
      console.log('Script length:', scriptText.length);
      console.log('First 200 chars:', scriptText.substring(0, 200));
      
      // Try to execute it
      try {
        eval(scriptText);
        console.log('✅ Script executed successfully');
        console.log('ContentProcessor now available:', typeof ContentProcessor !== 'undefined');
      } catch (error) {
        console.error('❌ Error executing script:', error);
      }
    })
    .catch(error => {
      console.error('❌ Error fetching script:', error);
    });
  
  console.groupEnd();
};

// Also create a simpler conditional check
window.checkConditionalLoading = function() {
  console.log('🔍 Checking conditional loading...');
  console.log('Ghost settings enable_deconstruction:', window.ghost_custom_settings?.enable_deconstruction);
  console.log('ThemeConfig deconstruction:', window.ThemeConfig?.features?.deconstruction);
  
  // Check if the conditional script tag exists
  const allScripts = Array.from(document.querySelectorAll('script'));
  const deconstructionScript = allScripts.find(script => 
    script.src && script.src.includes('deconstruction-processor.js')
  );
  
  console.log('Deconstruction script tag exists:', !!deconstructionScript);
  if (deconstructionScript) {
    console.log('Script src:', deconstructionScript.src);
  }
};

console.log('🔍 Script execution debugger loaded. Use scriptExecutionDebug() or checkConditionalLoading()');