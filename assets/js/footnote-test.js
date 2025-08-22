/**
 * FOOTNOTE SYSTEM TESTING - Step by step feature verification
 * This script helps us test each feature incrementally
 */

console.log('🧪 FOOTNOTE TESTING SCRIPT LOADED');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Starting footnote system tests...');
    
    // Wait for footnote system to initialize
    setTimeout(() => {
        testBasicClickToScroll();
        testBackReferences();
        testTooltipsOnDesktop();
        testMobileExperience();
    }, 1000);
});

function testBasicClickToScroll() {
    console.group('🧪 TEST 1: Basic Click-to-Scroll');
    
    const footnoteLinks = document.querySelectorAll('.footnote-link');
    console.log(`Found ${footnoteLinks.length} footnote links`);
    
    if (footnoteLinks.length === 0) {
        console.error('❌ No footnote links found - system may not be processing [^1] patterns');
        console.groupEnd();
        return;
    }
    
    footnoteLinks.forEach((link, index) => {
        const footnoteNum = link.dataset.footnote;
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        console.log(`Link ${index + 1}: ${link.textContent} → #${targetId}`);
        console.log(`Target exists: ${target ? '✅ YES' : '❌ NO'}`);
        
        if (target) {
            // Test if click handler is attached
            const hasClickHandler = link.onclick || link.addEventListener;
            console.log(`Click handler: ${hasClickHandler ? '✅ YES' : '❌ NO'}`);
        }
    });
    
    console.groupEnd();
}

function testBackReferences() {
    console.group('🧪 TEST 2: Back References');
    
    const backrefLinks = document.querySelectorAll('.footnote-backref');
    console.log(`Found ${backrefLinks.length} back-reference links`);
    
    backrefLinks.forEach((link, index) => {
        const targetId = link.dataset.target;
        const target = document.getElementById(targetId);
        
        console.log(`Back-ref ${index + 1}: → #${targetId}`);
        console.log(`Target exists: ${target ? '✅ YES' : '❌ NO'}`);
    });
    
    console.groupEnd();
}

function testTooltipsOnDesktop() {
    console.group('🧪 TEST 3: Desktop Tooltips');
    
    const isMobile = window.innerWidth <= 768;
    console.log(`Device type: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);
    
    if (isMobile) {
        console.log('⏭️ Skipping tooltip test on mobile device');
        console.groupEnd();
        return;
    }
    
    const footnoteLinks = document.querySelectorAll('.footnote-link');
    let tooltipTestResults = [];
    
    footnoteLinks.forEach((link, index) => {
        // Simulate mouseenter
        const event = new MouseEvent('mouseenter', { bubbles: true });
        link.dispatchEvent(event);
        
        // Check if tooltip was created
        setTimeout(() => {
            const tooltips = document.querySelectorAll('.footnote-tooltip');
            const hasTooltip = tooltips.length > 0;
            tooltipTestResults.push({
                link: index + 1,
                hasTooltip: hasTooltip
            });
            
            if (index === footnoteLinks.length - 1) {
                console.log('Tooltip test results:', tooltipTestResults);
            }
        }, 200);
    });
    
    console.groupEnd();
}

function testMobileExperience() {
    console.group('🧪 TEST 4: Mobile Experience');
    
    const isMobile = window.innerWidth <= 768;
    console.log(`Device type: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);
    
    if (!isMobile) {
        console.log('⏭️ Skipping mobile test on desktop device');
        console.groupEnd();
        return;
    }
    
    // Test mobile-specific behaviors
    const footnoteLinks = document.querySelectorAll('.footnote-link');
    console.log(`Mobile footnote links: ${footnoteLinks.length}`);
    
    // Check if tooltips are disabled on mobile
    const tooltipConfig = window.DigitalTalmudFootnoteConfig?.behavior?.enableTooltips;
    console.log(`Tooltip config: ${tooltipConfig ? 'ENABLED' : 'DISABLED'}`);
    console.log('📱 On mobile, should rely on click-to-scroll only');
    
    console.groupEnd();
}

// Add manual testing function
window.testFootnoteFeature = function(featureName) {
    console.log(`🧪 Manual test: ${featureName}`);
    
    switch(featureName) {
        case 'click':
            testBasicClickToScroll();
            break;
        case 'back':
            testBackReferences();
            break;
        case 'tooltip':
            testTooltipsOnDesktop();
            break;
        case 'mobile':
            testMobileExperience();
            break;
        default:
            console.log('Available tests: click, back, tooltip, mobile');
    }
};

// Add visual test indicators
window.addTestIndicators = function() {
    const footnoteLinks = document.querySelectorAll('.footnote-link');
    footnoteLinks.forEach((link, index) => {
        link.style.border = '2px solid yellow';
        link.style.padding = '2px';
        link.title = `TEST: Footnote ${index + 1} - Click to test navigation`;
    });
    
    const backrefLinks = document.querySelectorAll('.footnote-backref');
    backrefLinks.forEach((link, index) => {
        link.style.border = '2px solid orange';
        link.style.padding = '2px';
        link.title = `TEST: Back-reference ${index + 1} - Click to test return navigation`;
    });
    
    console.log('✅ Added visual test indicators');
};