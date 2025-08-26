/**
 * Console Debug Test for Interactive Markers
 * 
 * Run this in the browser console to test the exact failing content.
 * This will help us isolate whether the issue is:
 * 1. BracketParser not loading
 * 2. Processors not running
 * 3. Content being modified by Ghost
 * 4. Logic bugs in the parser
 */

// Test content - your exact failing content
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

function debugBracketParser() {
    console.log('🔧 BRACKET PARSER DEBUG TEST');
    console.log('='.repeat(50));
    
    // Test 1: Check if classes are loaded
    console.log('\n1. Checking class availability...');
    console.log('BracketParser available:', typeof BracketParser !== 'undefined');
    console.log('InteractiveMarkerProcessor available:', typeof InteractiveMarkerProcessor !== 'undefined');
    
    if (typeof BracketParser === 'undefined') {
        console.error('❌ BracketParser not loaded! Check script loading order.');
        return;
    }
    
    // Test 2: Test basic functionality
    console.log('\n2. Testing basic bracket parser...');
    const parser = new BracketParser(console);
    
    // Test 3: Simple pattern test
    console.log('\n3. Testing simple pattern...');
    const simpleTest = '[?][target:p1][Simple content]';
    console.log('Simple test input:', simpleTest);
    
    const simpleResults = parser.findInteractiveMarkers(simpleTest);
    console.log('Simple test results:', simpleResults);
    
    // Test 4: Test with actual failing content
    console.log('\n4. Testing with your actual content...');
    console.log('Content length:', testContent.length);
    console.log('Content preview:', testContent.substring(0, 100) + '...');
    
    // Check if [?] exists in content
    const hasQuestionMark = testContent.includes('[?]');
    console.log('Contains [?]:', hasQuestionMark);
    
    if (hasQuestionMark) {
        const questionMarkPos = testContent.indexOf('[?]');
        console.log('[?] position:', questionMarkPos);
        console.log('Context around [?]:', testContent.substring(questionMarkPos - 20, questionMarkPos + 50));
    }
    
    // Try to find patterns
    console.log('\n5. Searching for interactive markers...');
    const interactiveResults = parser.findInteractiveMarkers(testContent);
    console.log('Interactive marker results:', interactiveResults);
    
    // Try to find marginalia patterns
    console.log('\n6. Searching for marginalia patterns...');
    const marginaliaResults = parser.findMarginaliaPatterns(testContent);
    console.log('Marginalia results:', marginaliaResults);
    
    // Test 7: Manual bracket counting test
    console.log('\n7. Testing bracket counting manually...');
    const testSections = [
        'target:p1-3|fade:0.05|animate:typing|overlay:over|duration:4000',
        'continues growing where it always grew'
    ];
    
    testSections.forEach((section, i) => {
        console.log(`Testing section ${i + 1}: "${section}"`);
        const testString = '[' + section + ']';
        const result = parser.extractBracketSection(testString, 1);
        console.log('Result:', result);
    });
    
    // Test 8: Check what processors would actually receive
    console.log('\n8. Testing what processors would receive...');
    const postContent = document.querySelector('.post-content');
    if (postContent) {
        console.log('Found .post-content element');
        console.log('Post content HTML length:', postContent.innerHTML.length);
        console.log('Post content preview:', postContent.innerHTML.substring(0, 200) + '...');
        
        const postResults = parser.findInteractiveMarkers(postContent.innerHTML);
        console.log('Results from actual post content:', postResults);
    } else {
        console.log('No .post-content element found');
        console.log('Available elements with content:');
        ['main', 'article', '.content', '[class*="content"]', '[class*="post"]'].forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`  ${selector}:`, elements.length, 'elements');
        });
    }
    
    console.log('\n✅ Debug test complete!');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    debugBracketParser();
} else {
    console.log('Run debugBracketParser() to start the test');
}