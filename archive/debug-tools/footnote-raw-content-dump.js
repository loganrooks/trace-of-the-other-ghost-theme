/**
 * RAW CONTENT DUMP - Show exactly what's in the DOM
 */

console.log('📋 RAW CONTENT DUMP LOADED');

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        dumpRawContent();
    }, 3000); // Wait even longer
});

function dumpRawContent() {
    console.group('📋 RAW CONTENT DUMP');
    
    const container = document.querySelector('.post-content, .page-content');
    if (!container) {
        console.log('❌ No container found');
        console.groupEnd();
        return;
    }
    
    console.log('=== FULL CONTAINER HTML ===');
    console.log(container.innerHTML);
    
    console.log('=== FULL CONTAINER TEXT ===');
    console.log(container.textContent);
    
    console.log('=== PARAGRAPH BY PARAGRAPH ===');
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
        const html = p.innerHTML;
        const text = p.textContent;
        
        // Check for any footnote-like patterns
        const patterns = [
            /\[\^(\d+)\]/g,  // [^1]
            /\[(\d+)\]/g,    // [1]  
            /\^(\d+)/g,      // ^1
            /footnote/i,     // any mention of footnote
            /data-ref/i,     // data-ref
            /¹|²|³|⁴|⁵/g    // Unicode superscripts
        ];
        
        let hasAnyPattern = false;
        const foundPatterns = [];
        
        patterns.forEach((pattern, pIndex) => {
            pattern.lastIndex = 0; // reset regex
            const htmlMatches = html.match(pattern);
            pattern.lastIndex = 0; 
            const textMatches = text.match(pattern);
            
            if (htmlMatches || textMatches) {
                hasAnyPattern = true;
                foundPatterns.push({
                    patternIndex: pIndex,
                    pattern: pattern.toString(),
                    htmlMatches: htmlMatches,
                    textMatches: textMatches
                });
            }
        });
        
        if (hasAnyPattern) {
            console.log(`--- PARAGRAPH ${index} (HAS PATTERNS) ---`);
            console.log('HTML:', html);
            console.log('TEXT:', text);
            console.log('PATTERNS FOUND:', foundPatterns);
        }
    });
    
    console.log('=== ALL DATA-REF ELEMENTS ===');
    const dataRefs = document.querySelectorAll('[data-ref]');
    dataRefs.forEach((el, index) => {
        console.log(`Data-ref ${index + 1}:`, {
            element: el,
            dataRef: el.getAttribute('data-ref'),
            html: el.innerHTML,
            text: el.textContent.substring(0, 100) + '...'
        });
    });
    
    console.log('=== ALL CLICKABLE ELEMENTS (that might be footnotes) ===');
    const clickables = container.querySelectorAll('a, span[style*="cursor"], [onclick], sup a, .footnote');
    clickables.forEach((el, index) => {
        console.log(`Clickable ${index + 1}:`, {
            element: el,
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent,
            href: el.href || 'none',
            style: el.getAttribute('style') || 'none',
            onclick: el.getAttribute('onclick') || 'none'
        });
    });
    
    console.groupEnd();
}

// Manual trigger
window.dumpRawContent = dumpRawContent;