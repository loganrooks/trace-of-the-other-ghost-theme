/**
 * DIRECT PATTERN TEST - Test footnote pattern directly on current content
 */

console.log('🔬 DIRECT PATTERN TEST LOADED');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔬 Running direct pattern test...');
    
    setTimeout(() => {
        testPatternsDirectly();
    }, 2000); // Wait for other systems
});

function testPatternsDirectly() {
    console.group('🔬 DIRECT PATTERN TEST');
    
    const container = document.querySelector('.post-content, .page-content');
    if (!container) {
        console.log('❌ No container found');
        console.groupEnd();
        return;
    }
    
    console.log('✅ Container found:', container);
    
    // Test our exact pattern
    const pattern = /\[\^(\d+)\]/g;
    console.log('Pattern:', pattern);
    
    // Get all paragraphs
    const paragraphs = container.querySelectorAll('p');
    console.log(`Found ${paragraphs.length} paragraphs`);
    
    let foundPatterns = 0;
    
    paragraphs.forEach((p, index) => {
        const html = p.innerHTML;
        const text = p.textContent;
        
        // Reset regex
        pattern.lastIndex = 0;
        const htmlMatches = html.match(pattern);
        
        pattern.lastIndex = 0;
        const textMatches = text.match(/\[\^(\d+)\]/g);
        
        if (htmlMatches || textMatches) {
            foundPatterns++;
            console.log(`Paragraph ${index}:`, {
                htmlMatches: htmlMatches,
                textMatches: textMatches,
                innerHTML: html.substring(0, 200) + '...',
                textContent: text.substring(0, 200) + '...'
            });
        }
    });
    
    console.log(`Total patterns found: ${foundPatterns}`);
    
    // Check if green superscripts exist
    const existingSuperscripts = container.querySelectorAll('sup[style*="color: #00ff00"], sup[style*="color:#00ff00"]');
    console.log(`Found ${existingSuperscripts.length} green superscripts already in DOM`);
    
    existingSuperscripts.forEach((sup, index) => {
        console.log(`Superscript ${index + 1}:`, {
            element: sup,
            textContent: sup.textContent,
            style: sup.getAttribute('style'),
            parentElement: sup.parentElement?.tagName
        });
    });
    
    // Manual test - try to find [^1] in entire container
    const containerHTML = container.innerHTML;
    const containerText = container.textContent;
    
    pattern.lastIndex = 0;
    const containerHTMLMatches = containerHTML.match(pattern);
    
    pattern.lastIndex = 0;
    const containerTextMatches = containerText.match(/\[\^(\d+)\]/g);
    
    console.log('Container-wide search:', {
        htmlMatches: containerHTMLMatches,
        textMatches: containerTextMatches,
        htmlLength: containerHTML.length,
        textLength: containerText.length
    });
    
    console.groupEnd();
}

// Manual trigger
window.testPatternsDirectly = testPatternsDirectly;