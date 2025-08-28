/**
 * Interactive Marker Debug Function
 * Run debugInteractiveMarkers() in browser console
 */

window.debugInteractiveMarkers = function() {
    console.log('🔧 INTERACTIVE MARKER DEBUG');
    console.log('=' .repeat(40));
    
    // Test content with your exact failing pattern
    const testContent = `[m][2 1.1 32 r][Final margin: This catalogue...] [?][target:p1-3|fade:0.05|animate:typing|overlay:over|duration:4000][The remainder remains. It must— No. Not must. The word breaks against Saffuriyya The village that was. That is not. That appears anyway in discussions of paleonymy while THE MUNICIPAL ARCHIVE: Tzippori, established 1949 THE OLIVE GROVE: [continues growing where it always grew] THE ACADEMIC: "The question of naming—"]`;
    
    // 1. Check if classes are loaded
    console.log('\n1️⃣ Class Availability:');
    console.log('BracketParser:', typeof BracketParser !== 'undefined' ? '✅' : '❌');
    console.log('InteractiveMarkerProcessor:', typeof InteractiveMarkerProcessor !== 'undefined' ? '✅' : '❌');
    
    if (typeof BracketParser === 'undefined') {
        console.error('❌ BracketParser not loaded!');
        return;
    }
    
    // 2. Test bracket parser
    console.log('\n2️⃣ Testing Bracket Parser:');
    const parser = new BracketParser(console);
    
    // Simple test first
    const simple = '[?][target:p1][test]';
    const simpleResult = parser.findInteractiveMarkers(simple);
    console.log('Simple test result:', simpleResult.length, 'matches');
    
    // Your actual content
    const actualResult = parser.findInteractiveMarkers(testContent);
    console.log('Your content result:', actualResult.length, 'matches');
    
    if (actualResult.length > 0) {
        console.log('✅ SUCCESS! Found patterns:', actualResult);
    } else {
        console.log('❌ FAILED! No patterns found');
        
        // Debug why it failed
        const hasQuestion = testContent.includes('[?]');
        console.log('Contains [?]:', hasQuestion);
        
        if (hasQuestion) {
            const pos = testContent.indexOf('[?]');
            console.log('[?] at position:', pos);
            console.log('Context:', testContent.substring(pos, pos + 50));
        }
    }
    
    // 3. Test on actual DOM
    console.log('\n3️⃣ Testing DOM Content:');
    const content = document.querySelector('.post-content, .gh-content, article, main');
    if (content) {
        console.log('Found DOM element:', content.tagName);
        const domResult = parser.findInteractiveMarkers(content.innerHTML);
        console.log('DOM patterns found:', domResult.length);
    } else {
        console.log('❌ No content element found');
    }
    
    // 4. NEW: Check if InteractiveMarkerProcessor is actually running
    console.log('\n4️⃣ Testing Processor Initialization:');
    
    // Check if ContentEnhancementManager exists
    console.log('ContentEnhancementManager:', typeof ContentEnhancementManager !== 'undefined' ? '✅' : '❌');
    
    // Check if there's a global processor instance (check both possible names)
    const manager = window.ContentEnhancementSystem || window.contentEnhancementManager;
    if (manager) {
        console.log('✅ Manager instance found:', manager.constructor.name);
        console.log('Registered processors:', manager.processors ? manager.processors.size : 'Unknown');
        
        // Check if InteractiveMarkerProcessor is registered
        if (manager.processors) {
            const processorNames = Array.from(manager.processors.keys());
            console.log('Processor names:', processorNames);
            console.log('InteractiveMarkerProcessor registered:', processorNames.includes('InteractiveMarkerProcessor'));
        }
    } else {
        console.log('❌ No manager instance found');
        console.log('Checking what exists on window:');
        console.log('- window.ContentEnhancementSystem:', typeof window.ContentEnhancementSystem);
        console.log('- window.contentEnhancementManager:', typeof window.contentEnhancementManager);
        console.log('This means processors are not being initialized!');
    }
    
    // 5. NEW: Try to manually run the processor
    console.log('\n5️⃣ Manual Processor Test:');
    if (content && typeof InteractiveMarkerProcessor !== 'undefined') {
        try {
            console.log('🔧 Creating InteractiveMarkerProcessor manually...');
            const processor = new InteractiveMarkerProcessor({}, content);
            console.log('✅ Processor created successfully');
            
            console.log('🔧 Running processor.process()...');
            processor.process();
            console.log('✅ Processing completed');
            
            // Check if any interactive elements were created
            const interactiveElements = content.querySelectorAll('.interactive-marker');
            console.log('Interactive elements created:', interactiveElements.length);
            const markerElements = content.querySelectorAll('[data-marker-id]');
            console.log('Marker elements with data-marker-id:', markerElements.length);
            
            if (interactiveElements.length > 0) {
                console.log('✅ First marker element:', interactiveElements[0]);
                console.log('Marker attributes:', {
                    class: interactiveElements[0].className,
                    id: interactiveElements[0].dataset.markerId,
                    text: interactiveElements[0].textContent
                });
            }
            
        } catch (error) {
            console.error('❌ Processor error:', error);
            console.error('Stack trace:', error.stack);
        }
    }
    
    console.log('\n✅ Debug complete');
    return actualResult;
};