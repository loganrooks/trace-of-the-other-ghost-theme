/**
 * Generate comprehensive marginalia width CSS rules
 * 
 * Creates CSS rules for all width values from 5-90
 * to fix marginalia width processing issues
 */

function generateMarginaliaWidthCSS() {
  console.log('Generating comprehensive marginalia width CSS rules...');
  
  let css = '/* === COMPREHENSIVE MARGINALIA WIDTH RULES === */\n';
  css += '/* Auto-generated CSS rules for all width values 5-90 */\n\n';
  
  // Generate rules for all widths from 5 to 90
  for (let width = 5; width <= 90; width++) {
    css += `.marginalia-voice[data-width="${width}"] { max-width: calc(var(--container-width) * 0.${width.toString().padStart(2, '0')}) !important; } /* ${width}% of container space */\n`;
  }
  
  css += '\n/* === END AUTO-GENERATED WIDTH RULES === */\n';
  
  console.log('Generated CSS rules for widths 5-90');
  console.log('CSS length:', css.length, 'characters');
  
  return css;
}

function injectMarginaliaWidthCSS() {
  console.log('Injecting comprehensive marginalia width CSS...');
  
  // Remove existing auto-generated styles if they exist
  const existingStyle = document.getElementById('marginalia-width-fix');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Generate and inject CSS
  const css = generateMarginaliaWidthCSS();
  const style = document.createElement('style');
  style.id = 'marginalia-width-fix';
  style.textContent = css;
  document.head.appendChild(style);
  
  console.log('✓ Marginalia width CSS injected successfully');
  
  // Test the fix with specific problematic values
  const testValues = [22, 28, 38, 55];
  testValues.forEach(width => {
    const elements = document.querySelectorAll(`.marginalia-voice[data-width="${width}"]`);
    console.log(`Found ${elements.length} marginalia with width ${width}`);
    elements.forEach((element, index) => {
      const computedWidth = window.getComputedStyle(element).maxWidth;
      console.log(`  Element ${index + 1}: max-width = ${computedWidth}`);
    });
  });
  
  return true;
}

// Auto-inject if requested
if (window.location.search.includes('fix=marginalia-width')) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectMarginaliaWidthCSS, 500);
  });
}

// Export functions
window.MarginaliaWidthFix = {
  generateCSS: generateMarginaliaWidthCSS,
  inject: injectMarginaliaWidthCSS
};

console.log('[MARGINALIA_WIDTH_FIX] Loaded. Run MarginaliaWidthFix.inject() to apply fix.');