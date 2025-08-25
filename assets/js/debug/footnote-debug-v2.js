/**
 * FOCUSED DEBUG - Test HTML replacement specifically
 */

console.log('🔧 FOOTNOTE DEBUG V2 LOADED');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Starting focused HTML replacement debug...');
    
    // Find the container (we know it's .post-content from debug)
    const container = document.querySelector('.post-content');
    console.log('📦 Container found:', container ? 'YES' : 'NO');
    
    if (container) {
        // Find paragraph with [^1]
        const paragraphs = container.querySelectorAll('p');
        console.log(`📝 Found ${paragraphs.length} paragraphs in container`);
        
        let targetParagraph = null;
        const footnotePattern = /\[\^(\d+)\]/;
        
        paragraphs.forEach((p, index) => {
            if (footnotePattern.test(p.textContent)) {
                targetParagraph = p;
                console.log(`✅ Target paragraph ${index}: "${p.textContent.substring(0, 100)}..."`);
                
                // Show current HTML structure
                console.group('📋 BEFORE MODIFICATION');
                console.log('textContent:', p.textContent);
                console.log('innerHTML:', p.innerHTML);
                console.log('outerHTML:', p.outerHTML);
                console.groupEnd();
                
                // Try the replacement
                console.group('⚡ ATTEMPTING REPLACEMENT');
                const originalHTML = p.innerHTML;
                console.log('Original HTML:', originalHTML);
                
                // Test the regex
                const matches = originalHTML.match(/\[\^(\d+)\]/g);
                console.log('Regex matches:', matches);
                
                // Apply replacement with proper styling
                const newHTML = originalHTML.replace(/\[\^(\d+)\]/g, '<sup style="color: #00ff00; font-family: \'JetBrains Mono\', monospace; font-size: 0.75em; cursor: pointer; text-shadow: 0 0 3px #00ff00;">$1</sup>');
                console.log('New HTML:', newHTML);
                
                if (originalHTML !== newHTML) {
                    console.log('✅ HTML will change');
                    p.innerHTML = newHTML;
                    console.log('✅ Applied replacement');
                    
                    // Verify it worked
                    setTimeout(() => {
                        console.group('📋 AFTER MODIFICATION');
                        console.log('New textContent:', p.textContent);
                        console.log('New innerHTML:', p.innerHTML);
                        console.groupEnd();
                    }, 100);
                } else {
                    console.log('❌ No change detected - regex didn\'t match');
                }
                console.groupEnd();
            }
        });
        
        if (!targetParagraph) {
            console.log('❌ No paragraph with [^N] pattern found');
        }
        
        // Also test data-ref element
        console.group('📋 DATA-REF TEST');
        const dataRefEl = document.querySelector('[data-ref="1"]');
        if (dataRefEl) {
            console.log('✅ Found data-ref element');
            console.log('Content:', dataRefEl.textContent.substring(0, 100));
            
            // Add themed styling
            dataRefEl.style.border = '1px solid #00ff00';
            dataRefEl.style.backgroundColor = 'rgba(0, 255, 0, 0.05)';
            dataRefEl.style.padding = '1rem';
            dataRefEl.style.margin = '1rem 0';
            dataRefEl.style.fontFamily = 'JetBrains Mono, monospace';
            dataRefEl.style.fontSize = '0.9em';
            dataRefEl.style.borderLeft = '4px solid #00ff00';
            dataRefEl.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.1)';
            console.log('✅ Added themed styling to data-ref element');
        } else {
            console.log('❌ No data-ref element found');
        }
        console.groupEnd();
        
    } else {
        console.log('❌ Container .post-content not found');
    }
    
    // Add a big visible test element
    console.group('🎯 VISIBILITY TEST');
    const testEl = document.createElement('div');
    testEl.style.cssText = `
        position: fixed;
        top: 50px;
        right: 50px;
        background: red;
        color: white;
        padding: 20px;
        border: 3px solid yellow;
        border-radius: 10px;
        z-index: 9999;
        font-size: 18px;
        font-weight: bold;
    `;
    testEl.innerHTML = 'DEBUG V2<br>ACTIVE!';
    document.body.appendChild(testEl);
    
    setTimeout(() => {
        testEl.remove();
    }, 5000);
    console.log('✅ Added 5-second visibility test element');
    console.groupEnd();
});

// Manual test function
window.testFootnoteReplacement = function() {
    console.log('🔧 Manual test triggered');
    
    const container = document.querySelector('.post-content');
    if (container) {
        const paragraphs = container.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (/\[\^(\d+)\]/.test(p.textContent)) {
                console.log('Found footnote paragraph, applying proper styling...');
                p.innerHTML = p.innerHTML.replace(/\[\^(\d+)\]/g, 
                    '<sup style="color: #00ff00 !important; font-family: \'JetBrains Mono\', monospace !important; font-size: 0.75em !important; cursor: pointer !important; text-shadow: 0 0 3px #00ff00 !important;">$1</sup>');
                console.log('Applied proper styling');
            }
        });
    }
};