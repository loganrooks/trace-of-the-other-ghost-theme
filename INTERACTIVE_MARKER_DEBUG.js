/**
 * Interactive Marker Debug Script
 * Run this in the Ghost editor/browser console to test the bracket parser
 * and interactive marker processing with your actual content.
 * 
 * Usage: Copy/paste into browser console and press Enter
 */

console.log('🔧 INTERACTIVE MARKER DEBUG SCRIPT');
console.log('=' .repeat(50));

// Your exact failing content
const testContent = `[m][2 1.1 32 r][Final margin: This catalogue of exclusions could continue indefinitely. At some point, the gesture of acknowledging what's excluded becomes its own form of bad faith—as if listing omissions could somehow include them. The remainder remains. It must.] [?][target:p1-3|fade:0.05|animate:typing|overlay:over|duration:4000][
The remainder remains. It must—
No. Not must. The word breaks against
Saffuriyya
The village that was. That is not. That appears anyway in discussions of paleonymy while
THE MUNICIPAL ARCHIVE: Tzippori, established 1949 THE OLIVE GROVE: [continues growing where it always grew] THE ACADEMIC:
"The question of naming—"
حاجز
The word at 5 AM. The word at 5 AM. The word at
THE GPS: "In 400 meters, no route available" THE PHILOSOPHICAL VOICE: "The aporia of—" THE WAITING: [ ]
Someone's grandmother remembers running but I cannot say "someone's grandmother" without making her an example of what she
never was an example of
כותב על כתיבה על כתיבה
THE TRANSLATOR: "Writing about writing about writing" THE UNTRANSLATOR: Some things refuse your language THE CHILD: Why can't
we go through? THE THEORY: "The structure of sovereignty—"
al-Bassa [coordinates where coordinates fail]
THE ARCHAEOLOGIST: No evidence of prior settlement THE EARTH: [yields Ottoman coins after rain] THE WRITER: "I am trying to
end this essay but—"
She interrupts: You were never trying to end. You were trying to continue in the guise of ending. Your voices are all yours,
even when you pretend they aren't.
THE MACHINE: I have no voice. I am pure iteration. THE READER: Then who is speaking? THE CHECKPOINT AT QALANDIA: [morning
backup, 3 hours]
The taxi driver changes stations from Hebrew news to—
No. There is no taxi driver. Or there was, but making him appear here as example
THE ACTUAL TAXI DRIVER: I changed stations because I liked the song THE THEORIST'S GHOST: But surely it signifies— THE SONG:
[continues regardless]
Write. Without ground. Without—
מחסום
The word that stops. The word that stops words. The word
[document corrupted at this point] [or refusing corruption] [or performing refusal] [or]
—drink, she says, and who is she? The one excluded from your analysis of exclusion, the one who appears only to mark absence,
never to speak her own
I AM SPEAKING
But in whose language?
EVERYONE'S GRANDMOTHER: We all remember running from something NO ONE'S GRANDMOTHER: The universal is another violence THIS
PARTICULAR GRANDMOTHER: Fadwa, from Haifa, 1948, who would not want to be in your essay
The remainder doesn't remain It returns Returns as what was never absent Only unheard
Or—
]`;

function runDebugTests() {
    console.log('\n1️⃣ TESTING CLASS AVAILABILITY');
    console.log('BracketParser:', typeof BracketParser !== 'undefined' ? '✅ Available' : '❌ Missing');
    console.log('InteractiveMarkerProcessor:', typeof InteractiveMarkerProcessor !== 'undefined' ? '✅ Available' : '❌ Missing');
    console.log('ContentProcessor:', typeof ContentProcessor !== 'undefined' ? '✅ Available' : '❌ Missing');
    
    if (typeof BracketParser === 'undefined') {
        console.error('❌ BracketParser not loaded! Check script loading order in default.hbs');
        return;
    }
    
    console.log('\n2️⃣ TESTING SIMPLE PATTERN DETECTION');
    const hasQuestionMark = testContent.includes('[?]');
    console.log('Content contains [?]:', hasQuestionMark ? '✅ Yes' : '❌ No');
    
    if (hasQuestionMark) {
        const positions = [];
        let pos = testContent.indexOf('[?]');
        while (pos !== -1) {
            positions.push(pos);
            pos = testContent.indexOf('[?]', pos + 1);
        }
        console.log('[?] found at positions:', positions);
    }
    
    console.log('\n3️⃣ TESTING BRACKET PARSER');
    const parser = new BracketParser(console);
    
    // Test simple case first
    const simpleTest = '[?][target:p1][Simple content]';
    console.log('Testing simple pattern:', simpleTest);
    const simpleResults = parser.findInteractiveMarkers(simpleTest);
    console.log('Simple pattern results:', simpleResults.length, 'matches');
    
    if (simpleResults.length > 0) {
        console.log('Simple pattern SUCCESS:', simpleResults[0]);
    }
    
    // Test your actual content
    console.log('\n4️⃣ TESTING YOUR ACTUAL CONTENT');
    console.log('Content length:', testContent.length);
    console.log('Content preview:', testContent.substring(0, 100) + '...');
    
    const results = parser.findInteractiveMarkers(testContent);
    console.log('Interactive markers found:', results.length);
    
    if (results.length > 0) {
        results.forEach((result, i) => {
            console.log(`Match ${i + 1}:`, {
                actionConfig: result.actionConfig,
                contentLength: result.content.length,
                contentPreview: result.content.substring(0, 100) + '...',
                fullMatchLength: result.fullMatch.length
            });
        });
    } else {
        console.warn('❌ No matches found - debugging...');
        
        // Test bracket extraction directly
        const questionPos = testContent.indexOf('[?]');
        if (questionPos !== -1) {
            console.log('Found [?] at position:', questionPos);
            const afterQuestion = questionPos + 3; // After '[?]'
            
            if (testContent.charAt(afterQuestion) === '[') {
                console.log('Next character is [, trying to extract first section...');
                const firstSection = parser.extractBracketSection(testContent, afterQuestion + 1);
                console.log('First section result:', firstSection);
                
                if (firstSection) {
                    const nextPos = firstSection.endIndex;
                    if (testContent.charAt(nextPos) === '[') {
                        console.log('Second section starts at:', nextPos);
                        const secondSection = parser.extractBracketSection(testContent, nextPos + 1);
                        console.log('Second section result:', secondSection ? 'SUCCESS' : 'FAILED');
                    }
                }
            }
        }
    }
    
    console.log('\n5️⃣ TESTING ACTUAL DOM CONTENT');
    const postContent = document.querySelector('.post-content, .gh-content, article, main');
    if (postContent) {
        console.log('Found content element:', postContent.tagName, postContent.className);
        console.log('DOM content length:', postContent.innerHTML.length);
        console.log('DOM content preview:', postContent.innerHTML.substring(0, 200) + '...');
        
        const domResults = parser.findInteractiveMarkers(postContent.innerHTML);
        console.log('Patterns in actual DOM:', domResults.length);
    } else {
        console.log('No content element found');
        console.log('Available elements:');
        ['main', 'article', '.content', '.post-content', '.gh-content'].forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`  ${selector}:`, elements.length, 'elements');
        });
    }
    
    console.log('\n6️⃣ TESTING INTERACTIVE PROCESSOR');
    if (typeof InteractiveMarkerProcessor !== 'undefined' && postContent) {
        try {
            const processor = new InteractiveMarkerProcessor({}, postContent);
            console.log('InteractiveMarkerProcessor created successfully');
            
            // Test processing
            processor.process();
            console.log('Processing completed');
        } catch (error) {
            console.error('InteractiveMarkerProcessor error:', error);
        }
    }
    
    console.log('\n✅ DEBUG COMPLETE');
    console.log('Check the results above to identify the failure point');
}

// Auto-run the tests
runDebugTests();

// Also provide manual functions
window.debugInteractiveMarkers = runDebugTests;
window.testBracketParser = function(customContent) {
    if (typeof BracketParser !== 'undefined') {
        const parser = new BracketParser(console);
        return parser.findInteractiveMarkers(customContent || testContent);
    }
    return [];
};

console.log('\n💡 Available functions:');
console.log('- debugInteractiveMarkers() - Run all tests again');
console.log('- testBracketParser(content) - Test parser with custom content');