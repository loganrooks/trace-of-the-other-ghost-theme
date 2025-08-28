/**
 * MINIMAL FOOTNOTE DEBUG SCRIPT
 * Tests basic functionality and identifies DOM structure issues
 */

console.log('📝 FOOTNOTE DEBUG SCRIPT LOADED');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DOM READY - Starting footnote debug...');
    
    // TEST 1: Check what containers exist
    console.group('📦 CONTAINER DETECTION');
    const containers = [
        '.gh-content',
        '.post-content', 
        '.page-content',
        '.kg-card',
        'main',
        'article'
    ];
    
    containers.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`${selector}: ${elements.length} found`);
        if (elements.length > 0) {
            console.log(`  → First element:`, elements[0]);
        }
    });
    console.groupEnd();
    
    // TEST 2: Find paragraphs with [^1] patterns
    console.group('🔤 FOOTNOTE PATTERN DETECTION');
    const footnotePattern = /\[\^(\d+)\]/g;
    const allParagraphs = document.querySelectorAll('p');
    console.log(`Total paragraphs found: ${allParagraphs.length}`);
    
    let foundFootnotes = 0;
    allParagraphs.forEach((p, index) => {
        if (footnotePattern.test(p.textContent)) {
            foundFootnotes++;
            console.log(`  → Paragraph ${index + 1}: "${p.textContent.substring(0, 50)}..."`);
        }
    });
    console.log(`Paragraphs with [^N] patterns: ${foundFootnotes}`);
    console.groupEnd();
    
    // TEST 3: Find data-ref elements
    console.group('📋 DATA-REF DETECTION');
    const dataRefElements = document.querySelectorAll('[data-ref]');
    console.log(`Elements with data-ref: ${dataRefElements.length}`);
    dataRefElements.forEach((el, index) => {
        console.log(`  → data-ref="${el.dataset.ref}": "${el.textContent.substring(0, 50)}..."`);
    });
    console.groupEnd();
    
    // TEST 4: Try basic DOM manipulation
    console.group('⚡ BASIC DOM TEST');
    try {
        // Create a simple test element
        const testDiv = document.createElement('div');
        testDiv.style.cssText = 'background: red; color: white; padding: 10px; position: fixed; top: 10px; right: 10px; z-index: 9999;';
        testDiv.textContent = 'JS WORKING!';
        document.body.appendChild(testDiv);
        console.log('✅ DOM manipulation successful');
        
        // Remove after 3 seconds
        setTimeout(() => {
            testDiv.remove();
            console.log('✅ Element cleanup successful');
        }, 3000);
    } catch (error) {
        console.error('❌ DOM manipulation failed:', error);
    }
    console.groupEnd();
    
    // TEST 5: Simple footnote replacement test
    console.group('🧪 SIMPLE FOOTNOTE TEST');
    
    // Find the best container
    let container = document.querySelector('.gh-content') || 
                   document.querySelector('.post-content') || 
                   document.querySelector('.page-content') ||
                   document.querySelector('main') ||
                   document.querySelector('article');
    
    if (container) {
        console.log('✅ Found container:', container.className || container.tagName);
        
        // Try to replace [^1] with [1] in a copy
        const testParagraph = container.querySelector('p');
        if (testParagraph && footnotePattern.test(testParagraph.textContent)) {
            console.log('✅ Found paragraph with footnotes:', testParagraph.textContent.substring(0, 100));
            
            // SIMPLE TEST: Just change the text
            const originalText = testParagraph.innerHTML;
            const modifiedText = originalText.replace(/\[\^(\d+)\]/g, '[<span style="color: red;">$1</span>]');
            
            console.log('Original:', originalText);
            console.log('Modified:', modifiedText);
            
            // Apply the change
            testParagraph.innerHTML = modifiedText;
            console.log('✅ Applied basic footnote styling');
        } else {
            console.log('❌ No paragraphs with footnote patterns found in container');
        }
    } else {
        console.log('❌ No suitable container found');
    }
    
    console.groupEnd();
    
    // SUMMARY
    console.group('📊 DEBUG SUMMARY');
    console.log(`Containers found: ${containers.filter(s => document.querySelector(s)).length}`);
    console.log(`Paragraphs: ${allParagraphs.length}`);
    console.log(`Footnote patterns: ${foundFootnotes}`);
    console.log(`Data-ref elements: ${dataRefElements.length}`);
    console.groupEnd();
});

// Global debug function
window.debugFootnoteSystem = function() {
    console.log('🔧 Manual debug triggered');
    // Re-run detection
    document.dispatchEvent(new Event('DOMContentLoaded'));
};