/**
 * Emergency Footnote Diagnostic
 * Identifies exactly what's breaking the footnote system
 * 
 * Created: August 27, 2025
 */

// Emergency diagnostic function
window.diagnoseFootnoteBreakage = function() {
  console.log('🚨 EMERGENCY FOOTNOTE DIAGNOSTIC');
  console.log('=====================================');
  console.log('Timestamp:', new Date().toISOString());
  
  const results = {
    elements: {},
    css: {},
    javascript: {},
    events: {},
    errors: []
  };
  
  try {
    // 1. Check DOM Elements
    console.log('🔍 Checking DOM elements...');
    const footnoteRefs = document.querySelectorAll('.footnote-ref');
    const footnoteContent = document.querySelectorAll('[data-ref]');
    const tooltips = document.querySelectorAll('.footnote-tooltip');
    
    results.elements = {
      footnoteRefs: footnoteRefs.length,
      footnoteContent: footnoteContent.length,
      existingTooltips: tooltips.length,
      firstRefHtml: footnoteRefs[0]?.outerHTML || 'NONE'
    };
    
    console.log('📊 Elements found:');
    console.log(`  - Footnote refs: ${footnoteRefs.length}`);
    console.log(`  - Footnote content: ${footnoteContent.length}`);
    console.log(`  - Existing tooltips: ${tooltips.length}`);
    
    // 2. Check CSS Variables and Computed Styles
    console.log('🎨 Checking CSS...');
    const bodyStyle = getComputedStyle(document.body);
    results.css = {
      accentColor: bodyStyle.getPropertyValue('--footnote-accent'),
      bgColor: bodyStyle.getPropertyValue('--footnote-bg'),
      borderColor: bodyStyle.getPropertyValue('--footnote-border'),
      fontSize: bodyStyle.fontSize,
      fontFamily: bodyStyle.fontFamily
    };
    
    console.log('🎨 CSS Variables:');
    Object.entries(results.css).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value || 'NOT FOUND'}`);
    });
    
    // 3. Check JavaScript Global Objects
    console.log('⚙️ Checking JavaScript globals...');
    results.javascript = {
      footnoteSystem: typeof window.footnoteSystem !== 'undefined',
      contentManager: typeof window.contentManager !== 'undefined',
      ContentEnhancementSystem: typeof window.ContentEnhancementSystem !== 'undefined',
      typingAnimation: typeof window.TypingAnimation !== 'undefined',
      actionEngine: typeof window.ActionEngine !== 'undefined',
      jQuery: typeof window.$ !== 'undefined'
    };
    
    console.log('⚙️ Global objects:');
    Object.entries(results.javascript).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value ? '✅' : '❌'}`);
    });
    
    // Additional diagnosis for content enhancement system
    if (window.ContentEnhancementSystem || window.contentManager) {
      const system = window.ContentEnhancementSystem || window.contentManager;
      console.log('🔍 Content Enhancement System Details:');
      console.log(`  - Initialized: ${system.initialized || false}`);
      console.log(`  - Processors count: ${system.processors ? system.processors.size : 0}`);
      
      if (system.processors) {
        const processorNames = [];
        for (let [name] of system.processors) {
          processorNames.push(name);
        }
        console.log(`  - Registered processors: ${processorNames.join(', ')}`);
        
        // Check specifically for FootnoteProcessor (registered as "footnotes")
        const footnoteProcessor = system.processors.get('footnotes') || system.processors.get('FootnoteProcessor');
        if (footnoteProcessor) {
          console.log('📝 FootnoteProcessor Details:');
          console.log(`  - Processor name: ${footnoteProcessor.name || 'N/A'}`);
          console.log(`  - Footnotes count: ${footnoteProcessor.footnotes ? footnoteProcessor.footnotes.size : 'N/A'}`);
          console.log(`  - Debug mode: ${footnoteProcessor.debugMode || false}`);
          console.log(`  - Initialized: ${footnoteProcessor.initialized || false}`);
        } else {
          console.log('❌ FootnoteProcessor not found - checked both "footnotes" and "FootnoteProcessor" keys');
          console.log('🔍 Available processor keys:', processorNames);
        }
      }
    }
    
    // 4. Test Event System
    console.log('🎯 Testing event system...');
    if (footnoteRefs.length > 0) {
      const testRef = footnoteRefs[0];
      let eventTriggered = false;
      
      // Add test listener
      const testListener = () => {
        eventTriggered = true;
        console.log('✅ Mouse event triggered successfully');
      };
      
      testRef.addEventListener('mouseenter', testListener);
      
      // Simulate hover
      testRef.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      
      setTimeout(() => {
        results.events.mouseEventWorks = eventTriggered;
        console.log(`🎯 Mouse events: ${eventTriggered ? '✅ Working' : '❌ Broken'}`);
        
        // Clean up
        testRef.removeEventListener('mouseenter', testListener);
      }, 100);
    }
    
    // 5. Check for JavaScript Errors
    console.log('🚨 Checking for JavaScript errors...');
    window.addEventListener('error', (e) => {
      const error = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      };
      results.errors.push(error);
      console.error('🚨 JavaScript Error Detected:', error);
    });
    
    // 6. Check Script Loading
    console.log('📜 Checking script loading...');
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const footnoteScripts = scripts.filter(s => 
      s.src.includes('footnote') || 
      s.src.includes('typing-animation') ||
      s.src.includes('interactive-marker')
    );
    
    results.scripts = footnoteScripts.map(script => ({
      src: script.src,
      loaded: script.readyState || 'unknown'
    }));
    
    console.log('📜 Relevant scripts:');
    footnoteScripts.forEach(script => {
      console.log(`  - ${script.src.split('/').pop()}: ${script.readyState || 'loaded'}`);
    });
    
    // 7. Manual Tooltip Test (DISABLED - was creating stuck white box)
    // This test was causing the white box issue by creating tooltips that didn't clean up properly
    console.log('🧪 Manual tooltip test skipped (use testManualTooltip() to run manually)');
    
    // Store a manual test function instead of running automatically
    window.testManualTooltip = function() {
      console.log('🧪 Running manual tooltip test...');
      
      if (footnoteRefs.length > 0 && footnoteContent.length > 0) {
        const testRef = footnoteRefs[0];
        const refNumber = testRef.textContent.trim();
        const contentElement = document.querySelector(`[data-ref="${refNumber}"]`);
        
        if (contentElement) {
          console.log('🧪 Found matching content for ref:', refNumber);
          console.log('🧪 Content:', contentElement.textContent.substring(0, 50) + '...');
          
          try {
            const tooltip = document.createElement('div');
            tooltip.id = 'manual-test-tooltip'; // Give it a unique ID for cleanup
            tooltip.className = 'footnote-tooltip manual-test';
            tooltip.textContent = contentElement.textContent;
            tooltip.style.cssText = `
              position: fixed;
              top: 100px;
              left: 100px;
              background: rgba(0, 255, 0, 0.9);
              color: black;
              border: 2px solid #00ff00;
              padding: 15px;
              z-index: 10000;
              font-size: 14px;
              max-width: 300px;
              font-family: 'JetBrains Mono', monospace;
            `;
            
            document.body.appendChild(tooltip);
            console.log('✅ Manual test tooltip created - will auto-remove in 3 seconds');
            
            // More robust cleanup with multiple fallback methods
            const cleanup = () => {
              const existingTooltip = document.getElementById('manual-test-tooltip');
              if (existingTooltip) {
                existingTooltip.remove();
                console.log('✅ Manual test tooltip removed successfully');
              }
            };
            
            // Primary cleanup
            setTimeout(cleanup, 3000);
            
            // Backup cleanup in case the first fails
            setTimeout(() => {
              document.querySelectorAll('.manual-test').forEach(el => el.remove());
            }, 5000);
            
            return tooltip;
            
          } catch (error) {
            console.error('❌ Manual tooltip creation failed:', error);
          }
        } else {
          console.error('❌ No matching content found for ref:', refNumber);
        }
      } else {
        console.error('❌ No footnote refs or content found');
      }
    };
    
  } catch (error) {
    console.error('🚨 Diagnostic itself failed:', error);
    results.diagnosticError = error.message;
  }
  
  // 8. Generate Report
  console.log('📋 DIAGNOSTIC SUMMARY');
  console.log('=====================================');
  
  if (results.elements.footnoteRefs === 0) {
    console.log('🔴 CRITICAL: No footnote references found');
  } else if (results.elements.footnoteContent === 0) {
    console.log('🔴 CRITICAL: No footnote content found');
  } else if (!results.css.accentColor) {
    console.log('🔴 CRITICAL: Footnote CSS not loaded');
  } else if (results.errors.length > 0) {
    console.log('🔴 CRITICAL: JavaScript errors detected');
  } else {
    console.log('🟡 Elements and CSS appear normal - investigating event system...');
  }
  
  // Store results globally for inspection
  window.footnoteDebugResults = results;
  
  console.log('📋 Full results stored in window.footnoteDebugResults');
  console.log('=====================================');
  
  return results;
};

// Auto-run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.diagnoseFootnoteBreakage);
} else {
  // If already loaded, wait a moment for all scripts to initialize
  setTimeout(window.diagnoseFootnoteBreakage, 1000);
}

console.log('🚨 Emergency footnote diagnostic loaded - will auto-run on page load');