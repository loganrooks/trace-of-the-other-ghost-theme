/**
 * White Box Diagnostic - Find elements causing layout issues
 * 
 * Identifies elements that might be creating unwanted white boxes or overlays
 */

window.diagnoseWhiteBox = function() {
  console.log('🔍 WHITE BOX DIAGNOSTIC');
  console.log('======================');
  
  const results = {
    suspiciousElements: [],
    fixedElements: [],
    absoluteElements: [],
    overlayElements: [],
    whiteElements: []
  };
  
  // Check for elements with white backgrounds
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach((element, index) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // Skip elements that are too small to be the white box
    if (rect.width < 100 || rect.height < 50) return;
    
    const elementInfo = {
      element: element,
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      id: element.id,
      position: style.position,
      background: style.backgroundColor,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      zIndex: style.zIndex
    };
    
    // Check for suspicious positioning
    if (style.position === 'fixed') {
      results.fixedElements.push(elementInfo);
      console.log('🎯 Fixed element:', elementInfo);
    }
    
    if (style.position === 'absolute') {
      results.absoluteElements.push(elementInfo);
    }
    
    // Check for white backgrounds
    const bg = style.backgroundColor;
    if (bg.includes('255, 255, 255') || bg.includes('#fff') || bg === 'white' || bg === 'rgb(255, 255, 255)') {
      results.whiteElements.push(elementInfo);
      
      // If it's a large white element in a suspicious position, flag it
      if (rect.width > 200 && rect.height > 100 && (style.position === 'fixed' || style.position === 'absolute')) {
        results.suspiciousElements.push(elementInfo);
        console.warn('🚨 SUSPICIOUS WHITE ELEMENT:', elementInfo);
      }
    }
    
    // Check for overlay-related classes
    if (element.className && (
      element.className.includes('overlay') ||
      element.className.includes('typing-animation') ||
      element.className.includes('modal') ||
      element.className.includes('popup')
    )) {
      results.overlayElements.push(elementInfo);
      console.log('📦 Overlay-related element:', elementInfo);
    }
  });
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log(`  Fixed position elements: ${results.fixedElements.length}`);
  console.log(`  Absolute position elements: ${results.absoluteElements.length}`);
  console.log(`  White background elements: ${results.whiteElements.length}`);
  console.log(`  Overlay elements: ${results.overlayElements.length}`);
  console.log(`  🚨 SUSPICIOUS elements: ${results.suspiciousElements.length}`);
  
  if (results.suspiciousElements.length > 0) {
    console.log('🔧 RECOMMENDED ACTIONS:');
    results.suspiciousElements.forEach((elementInfo, index) => {
      console.log(`${index + 1}. Check element:`, elementInfo.element);
      console.log(`   - Remove with: element.remove()`);
      console.log(`   - Hide with: element.style.display = 'none'`);
    });
  }
  
  // Store results globally
  window.whiteBoxResults = results;
  
  return results;
};

window.hideAllSuspiciousElements = function() {
  if (!window.whiteBoxResults) {
    console.log('⚠️ Run diagnoseWhiteBox() first');
    return;
  }
  
  let hidden = 0;
  window.whiteBoxResults.suspiciousElements.forEach(elementInfo => {
    if (elementInfo.element && elementInfo.element.parentNode) {
      elementInfo.element.style.display = 'none';
      hidden++;
      console.log('✅ Hidden suspicious element:', elementInfo.element);
    }
  });
  
  console.log(`🔧 Hidden ${hidden} suspicious elements`);
};

window.removeSuspiciousElements = function() {
  if (!window.whiteBoxResults) {
    console.log('⚠️ Run diagnoseWhiteBox() first');
    return;
  }
  
  let removed = 0;
  window.whiteBoxResults.suspiciousElements.forEach(elementInfo => {
    if (elementInfo.element && elementInfo.element.parentNode) {
      elementInfo.element.remove();
      removed++;
      console.log('🗑️ Removed suspicious element:', elementInfo.element);
    }
  });
  
  console.log(`🔧 Removed ${removed} suspicious elements`);
};

// Auto-run on load to catch the white box
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.diagnoseWhiteBox, 1000);
  });
} else {
  setTimeout(window.diagnoseWhiteBox, 1000);
}

console.log('🔍 White box diagnostic loaded - will auto-run in 1 second');