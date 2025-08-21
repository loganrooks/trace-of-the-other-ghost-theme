// Debug script to test glitch animation manually
console.log('[GLITCH TEST] Testing marginalia glitch animation...');

// Find the first marginalia
const marginalia = document.querySelector('.marginalia-voice');

if (!marginalia) {
  console.error('[GLITCH TEST] No marginalia found!');
} else {
  console.log('[GLITCH TEST] Found marginalia:', marginalia);
  
  // Test 1: Check if CSS is loaded
  const computedStyle = getComputedStyle(marginalia);
  console.log('[GLITCH TEST] Current opacity:', computedStyle.opacity);
  console.log('[GLITCH TEST] Current transform:', computedStyle.transform);
  
  // Test 2: Manually trigger glitch animation
  console.log('[GLITCH TEST] Adding materializing class...');
  marginalia.style.transition = 'none';
  marginalia.classList.add('materializing');
  marginalia.style.opacity = '1';
  marginalia.style.visibility = 'visible';
  
  // Test 3: Check if animation is running
  setTimeout(() => {
    const animatedStyle = getComputedStyle(marginalia);
    console.log('[GLITCH TEST] After 100ms - opacity:', animatedStyle.opacity);
    console.log('[GLITCH TEST] Animation list:', animatedStyle.animation);
    
    // Remove class after animation should complete
    setTimeout(() => {
      marginalia.classList.remove('materializing');
      console.log('[GLITCH TEST] Animation test complete');
    }, 800);
  }, 100);
}