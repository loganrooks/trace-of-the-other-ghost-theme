/**
 * HREF Format Diagnostic - The REAL problem
 * 
 * After hours of debugging, the issue is likely a simple href format mismatch
 */

window.diagnoseHrefFormat = function() {
  console.log('🔍 HREF FORMAT DIAGNOSTIC - THE REAL ISSUE');
  console.log('==========================================');
  
  // Step 1: Check actual DOM hrefs
  console.log('📋 Step 1: Actual DOM HREFs');
  const refs = document.querySelectorAll('.footnote-ref a');
  if (refs.length === 0) {
    console.log('  ❌ No footnote refs found');
    return;
  }
  
  const firstFive = Array.from(refs).slice(0, 5);
  firstFive.forEach((ref, i) => {
    const href = ref.getAttribute('href');
    console.log(`  Ref ${i + 1}: href="${href}"`);
    console.log(`    Full URL: ${ref.href}`);
    console.log(`    Hash only: ${ref.hash}`);
  });
  
  // Step 2: Check what FootnoteService expects
  console.log('\n📝 Step 2: FootnoteService Expectations');
  console.log('  FootnoteService expects: #fn-N format');
  console.log('  Regex pattern: /#fn-(\\w+)/');
  
  // Step 3: Test pattern matching
  console.log('\n🧪 Step 3: Pattern Matching Test');
  const testHref = refs[0].getAttribute('href');
  const pattern = /#fn-(\w+)/;
  const match = testHref.match(pattern);
  
  console.log(`  Test href: "${testHref}"`);
  console.log(`  Pattern match: ${match ? '✅ Matched' : '❌ NO MATCH'}`);
  if (match) {
    console.log(`  Extracted number: ${match[1]}`);
  } else {
    console.log('  ⚠️ THIS IS THE PROBLEM - href format doesn\'t match expected pattern');
    
    // Try alternative patterns
    console.log('\n  Testing alternative patterns:');
    const patterns = [
      { regex: /#footnote-(\d+)/, desc: '#footnote-N' },
      { regex: /#fn(\d+)/, desc: '#fnN' },
      { regex: /#note-(\d+)/, desc: '#note-N' },
      { regex: /#\d+/, desc: '#N' },
      { regex: /#.+/, desc: 'Any hash' }
    ];
    
    patterns.forEach(({regex, desc}) => {
      const altMatch = testHref.match(regex);
      console.log(`    ${desc}: ${altMatch ? '✅ Matches' : '❌'}`);
      if (altMatch) {
        console.log(`      Extracted: ${altMatch[0]}`);
      }
    });
  }
  
  // Step 4: Check footnote content data-ref format
  console.log('\n📦 Step 4: Footnote Content Format');
  const contents = document.querySelectorAll('[data-ref]');
  if (contents.length > 0) {
    const firstContent = contents[0];
    console.log(`  First content data-ref: "${firstContent.getAttribute('data-ref')}"`);
    console.log(`  Expected to match: footnote reference number`);
  }
  
  // Step 5: Proposed fix
  console.log('\n💡 Step 5: Fix Strategy');
  console.log('  Option 1: Update FootnoteService regex to match actual format');
  console.log('  Option 2: Transform hrefs to expected format during processing');
  console.log('  Option 3: Fix Ghost editor output to use correct format');
  
  // Manual tooltip test with correct extraction
  console.log('\n🧪 Step 6: Manual Tooltip Creation Test');
  if (refs[0]) {
    const href = refs[0].getAttribute('href');
    // Try to extract number regardless of format
    const numberMatch = href.match(/\d+/);
    if (numberMatch) {
      const num = numberMatch[0];
      console.log(`  Extracted number: ${num}`);
      const content = document.querySelector(`[data-ref="${num}"]`);
      if (content) {
        console.log(`  ✅ Found matching content for footnote ${num}`);
        console.log(`  Content: "${content.textContent.substring(0, 50)}..."`);
      } else {
        console.log(`  ❌ No content found with data-ref="${num}"`);
      }
    }
  }
  
  return {
    refCount: refs.length,
    contentCount: contents.length,
    sampleHref: refs[0]?.getAttribute('href'),
    patternMatches: refs[0]?.getAttribute('href')?.match(/#fn-(\w+)/) !== null
  };
};

// Auto-run
setTimeout(() => {
  console.log('🔍 Auto-running HREF format diagnostic...');
  window.diagnoseHrefFormat();
}, 1500);

console.log('🔍 HREF format diagnostic loaded');
console.log('💡 Run diagnoseHrefFormat() to find the REAL problem');