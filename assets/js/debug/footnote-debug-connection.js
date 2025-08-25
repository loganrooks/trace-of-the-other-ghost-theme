/**
 * DEBUG: Footnote Connection Issues
 * Specifically debug why data-ref elements aren't being found
 */

console.log('🔍 FOOTNOTE CONNECTION DEBUG LOADED');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Starting connection debug...');
    
    // Wait a bit for everything to load
    setTimeout(() => {
        debugFootnoteConnection();
    }, 1500);
});

function debugFootnoteConnection() {
    console.group('🔍 FOOTNOTE CONNECTION DEBUG');
    
    // 1. Check containers
    console.log('--- CONTAINER CHECK ---');
    const containers = document.querySelectorAll('.post-content, .page-content');
    console.log(`Found ${containers.length} potential containers:`, containers);
    
    containers.forEach((container, index) => {
        console.log(`Container ${index + 1}:`, {
            tagName: container.tagName,
            className: container.className,
            id: container.id,
            childCount: container.children.length
        });
    });
    
    // 2. Search for data-ref elements ANYWHERE on page
    console.log('--- GLOBAL DATA-REF SEARCH ---');
    const allDataRefs = document.querySelectorAll('[data-ref]');
    console.log(`Found ${allDataRefs.length} elements with data-ref attribute globally:`, allDataRefs);
    
    allDataRefs.forEach((el, index) => {
        console.log(`data-ref ${index + 1}:`, {
            element: el,
            tagName: el.tagName,
            dataRef: el.getAttribute('data-ref'),
            textContent: el.textContent.substring(0, 100) + '...',
            parentElement: el.parentElement?.tagName,
            isInContainer: checkIfInContainer(el)
        });
    });
    
    // 3. Check specific data-ref="1"
    console.log('--- SPECIFIC DATA-REF="1" CHECK ---');
    const ref1 = document.querySelector('[data-ref="1"]');
    if (ref1) {
        console.log('✅ Found data-ref="1":', ref1);
        console.log('Parent chain:', getParentChain(ref1));
        console.log('Is in post-content?', ref1.closest('.post-content') !== null);
        console.log('Is in page-content?', ref1.closest('.page-content') !== null);
    } else {
        console.log('❌ No element with data-ref="1" found');
    }
    
    // 4. Check [^1] patterns
    console.log('--- PATTERN CHECK ---');
    const patterns = findFootnotePatterns();
    console.log(`Found ${patterns.length} [^N] patterns:`, patterns);
    
    // 5. Test footnote system selectors directly
    console.log('--- SELECTOR TEST ---');
    const config = window.DigitalTalmudFootnoteConfig;
    if (config) {
        const containerSelector = config.selectors.container;
        const footnoteCardSelector = config.selectors.footnoteCards;
        
        console.log(`Container selector: "${containerSelector}"`);
        console.log(`Footnote cards selector: "${footnoteCardSelector}"`);
        
        const testContainer = document.querySelector(containerSelector);
        console.log('Container found by system:', testContainer);
        
        if (testContainer) {
            const testCards = testContainer.querySelectorAll(footnoteCardSelector);
            console.log(`Cards found within container: ${testCards.length}`, testCards);
        }
    }
    
    console.groupEnd();
}

function checkIfInContainer(element) {
    const containers = document.querySelectorAll('.post-content, .page-content');
    for (let container of containers) {
        if (container.contains(element)) {
            return container.className;
        }
    }
    return false;
}

function getParentChain(element) {
    const chain = [];
    let current = element.parentElement;
    while (current && current !== document.body) {
        chain.push({
            tagName: current.tagName,
            className: current.className || '(no class)',
            id: current.id || '(no id)'
        });
        current = current.parentElement;
    }
    return chain;
}

function findFootnotePatterns() {
    const patterns = [];
    const container = document.querySelector('.post-content, .page-content');
    if (!container) return patterns;
    
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(p => {
        const matches = p.textContent.match(/\[\^(\d+)\]/g);
        if (matches) {
            patterns.push({
                paragraph: p.textContent.substring(0, 50) + '...',
                patterns: matches
            });
        }
    });
    
    return patterns;
}

// Manual debugging function
window.debugFootnoteConnection = debugFootnoteConnection;