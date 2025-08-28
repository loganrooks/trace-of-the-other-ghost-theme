/**
 * Footnote Tooltip Cleanup and Management
 * 
 * Provides utilities to clean up stuck tooltips and debug tooltip issues
 */

// Clean up all stuck footnote tooltips
window.cleanupStuckTooltips = function() {
  console.log('🧹 Cleaning up stuck footnote tooltips...');
  
  const stuckTooltips = document.querySelectorAll('.footnote-tooltip');
  let cleaned = 0;
  
  stuckTooltips.forEach(tooltip => {
    // Check if tooltip is stuck (visible but not properly positioned)
    const style = getComputedStyle(tooltip);
    const isStuck = (
      style.position === 'fixed' && 
      (tooltip.style.top === '100px' || tooltip.style.left === '100px')
    ) || style.display !== 'none';
    
    if (isStuck) {
      console.log('🗑️ Removing stuck tooltip:', tooltip);
      tooltip.remove();
      cleaned++;
    }
  });
  
  console.log(`✅ Cleaned up ${cleaned} stuck tooltips`);
  return cleaned;
};

// Test footnote tooltip creation manually
window.testFootnoteTooltip = function(footnoteNumber = 1) {
  console.log(`🧪 Testing footnote tooltip creation for footnote ${footnoteNumber}...`);
  
  const footnoteRef = document.querySelector(`.footnote-ref a[href="#fn-${footnoteNumber}"]`);
  const footnoteContent = document.querySelector(`[data-ref="${footnoteNumber}"]`);
  
  if (!footnoteRef) {
    console.error(`❌ No footnote reference found for footnote ${footnoteNumber}`);
    return false;
  }
  
  if (!footnoteContent) {
    console.error(`❌ No footnote content found for footnote ${footnoteNumber}`);
    return false;
  }
  
  console.log('✅ Found footnote ref:', footnoteRef);
  console.log('✅ Found footnote content:', footnoteContent.textContent.substring(0, 100) + '...');
  
  // Try to trigger the tooltip manually
  try {
    footnoteRef.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    
    setTimeout(() => {
      const tooltip = document.querySelector('.footnote-tooltip');
      if (tooltip) {
        console.log('✅ Tooltip appeared:', tooltip);
        console.log('📝 Tooltip content:', tooltip.textContent.substring(0, 100) + '...');
        
        // Clean up after test
        setTimeout(() => {
          footnoteRef.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          console.log('🧹 Test cleanup completed');
        }, 2000);
      } else {
        console.error('❌ No tooltip appeared after mouseenter event');
      }
    }, 100);
    
    return true;
  } catch (error) {
    console.error('❌ Error testing footnote tooltip:', error);
    return false;
  }
};

// Force re-initialize footnote tooltips
window.forceReinitializeFootnotes = function() {
  console.log('🔄 Force reinitializing footnote system...');
  
  // Clean up existing tooltips first
  window.cleanupStuckTooltips();
  
  // Check if we have the content manager
  const system = window.ContentEnhancementSystem || window.contentManager;
  if (!system) {
    console.error('❌ No ContentEnhancementSystem found');
    return false;
  }
  
  console.log('✅ Found ContentEnhancementSystem');
  
  // Get the footnote processor
  const footnoteProcessor = system.processors.get('footnotes') || system.processors.get('FootnoteProcessor');
  if (!footnoteProcessor) {
    console.error('❌ No footnote processor found');
    console.log('Available processors:', Array.from(system.processors.keys()));
    return false;
  }
  
  console.log('✅ Found footnote processor:', footnoteProcessor.name);
  
  try {
    // Force reprocess footnotes
    footnoteProcessor.process();
    console.log('✅ Footnote processor reprocessed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error reprocessing footnotes:', error);
    return false;
  }
};

// Debug footnote event listeners
window.debugFootnoteEvents = function() {
  console.log('🔍 Debugging footnote event listeners...');
  
  const footnoteRefs = document.querySelectorAll('.footnote-ref a');
  console.log(`Found ${footnoteRefs.length} footnote references`);
  
  footnoteRefs.forEach((ref, index) => {
    console.log(`Footnote ${index + 1}:`, ref.href);
    
    // Check for event listeners (this is limited but we can try)
    const events = ['mouseenter', 'mouseleave', 'click'];
    events.forEach(eventType => {
      // Add a test listener to see if events are working
      const testListener = () => console.log(`🎯 ${eventType} event fired on footnote ${index + 1}`);
      ref.addEventListener(eventType, testListener);
      
      // Remove after a short time
      setTimeout(() => ref.removeEventListener(eventType, testListener), 5000);
    });
  });
  
  console.log('🎯 Test event listeners added for 5 seconds');
  console.log('💡 Hover over footnote references to test events');
};

// Auto-cleanup on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.cleanupStuckTooltips, 2000);
  });
} else {
  setTimeout(window.cleanupStuckTooltips, 2000);
}

console.log('🧹 Tooltip cleanup utilities loaded:');
console.log('  - cleanupStuckTooltips()');
console.log('  - testFootnoteTooltip(N)');
console.log('  - forceReinitializeFootnotes()');
console.log('  - debugFootnoteEvents()');
console.log('⏰ Auto-cleanup will run in 2 seconds');