/**
 * Deconstruction CSS Debug
 * 
 * Check if CSS rules actually exist for deconstruction effects
 */

window.debugDeconstructionCSS = function() {
  console.group('🎨 DECONSTRUCTION CSS DEBUG');
  
  try {
    // Get all stylesheets
    const stylesheets = Array.from(document.styleSheets);
    console.log(`Found ${stylesheets.length} stylesheets`);
    
    // Find deconstruction.css
    const deconstructionSheet = stylesheets.find(sheet => {
      try {
        return sheet.href && sheet.href.includes('deconstruction.css');
      } catch (e) {
        return false;
      }
    });
    
    console.log('=== STYLESHEET CHECK ===');
    if (deconstructionSheet) {
      console.log('✅ deconstruction.css found:', deconstructionSheet.href);
      
      try {
        const rules = Array.from(deconstructionSheet.cssRules || deconstructionSheet.rules || []);
        console.log(`Deconstruction CSS has ${rules.length} rules`);
        
        // Check for key selectors
        const keySelectors = [
          '.voices-active',
          '.voice-uncertain',
          '.voice-critical',
          '.voice-interrupt',
          '[data-deconstruct="voices"]',
          '.deconstruction-active'
        ];
        
        console.log('=== KEY SELECTOR CHECK ===');
        keySelectors.forEach(selector => {
          const hasRule = rules.some(rule => rule.selectorText && rule.selectorText.includes(selector.replace('.', '').replace('[', '').replace(']', '')));
          console.log(`${hasRule ? '✅' : '❌'} ${selector}: ${hasRule ? 'found' : 'missing'}`);
        });
        
        // Show first few rules
        console.log('=== SAMPLE RULES ===');
        rules.slice(0, 10).forEach((rule, index) => {
          if (rule.selectorText) {
            console.log(`${index + 1}. ${rule.selectorText}`);
          }
        });
        
      } catch (error) {
        console.error('❌ Cannot access CSS rules (CORS?):', error);
      }
    } else {
      console.log('❌ deconstruction.css NOT found in stylesheets');
    }
    
    // Check computed styles on test element
    console.log('=== COMPUTED STYLES CHECK ===');
    const testElement = document.querySelector('[data-deconstruct="voices"]');
    if (testElement) {
      const computedStyle = getComputedStyle(testElement);
      
      console.log('Test element computed styles:');
      console.log('- display:', computedStyle.display);
      console.log('- position:', computedStyle.position);
      console.log('- visibility:', computedStyle.visibility);
      console.log('- opacity:', computedStyle.opacity);
      console.log('- transform:', computedStyle.transform);
      console.log('- transition:', computedStyle.transition);
      console.log('- animation:', computedStyle.animation);
      console.log('- color:', computedStyle.color);
      console.log('- background:', computedStyle.background);
      
      // Check first voice span
      const voiceSpan = testElement.querySelector('[data-voice]');
      if (voiceSpan) {
        const spanStyle = getComputedStyle(voiceSpan);
        console.log('Voice span computed styles:');
        console.log('- color:', spanStyle.color);
        console.log('- font-weight:', spanStyle.fontWeight);
        console.log('- text-decoration:', spanStyle.textDecoration);
        console.log('- transform:', spanStyle.transform);
        console.log('- opacity:', spanStyle.opacity);
        console.log('- animation:', spanStyle.animation);
      }
    } else {
      console.log('❌ No test element found');
    }
    
    // Manual CSS injection test
    console.log('=== MANUAL CSS TEST ===');
    if (testElement) {
      console.log('Injecting test CSS...');
      
      const testCSS = `
        .voices-active {
          border: 2px solid red !important;
          background: rgba(255, 0, 0, 0.1) !important;
        }
        .voice-uncertain {
          color: blue !important;
          font-weight: bold !important;
        }
        .voice-critical {
          color: red !important;
          font-style: italic !important;
        }
      `;
      
      const style = document.createElement('style');
      style.textContent = testCSS;
      document.head.appendChild(style);
      
      console.log('✅ Test CSS injected');
      console.log('Check if red border appeared around voices element');
      
      // Remove after 5 seconds
      setTimeout(() => {
        document.head.removeChild(style);
        console.log('Test CSS removed');
      }, 5000);
    }
    
  } catch (error) {
    console.error('❌ CSS debug failed:', error);
  }
  
  console.groupEnd();
};

console.log('🎨 Deconstruction CSS debugger loaded. Use debugDeconstructionCSS()');