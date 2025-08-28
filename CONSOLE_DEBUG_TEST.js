/**
 * CONSOLE DEBUG TEST
 * Run this in browser console to debug TypingAnimation availability
 */

console.log('=== CONSOLE DEBUG TEST ===');
console.log('Current time:', new Date().toISOString());

// Check if TypingAnimation is available
console.log('typeof TypingAnimation:', typeof TypingAnimation);
console.log('typeof window.TypingAnimation:', typeof window.TypingAnimation);

// Check what animation-related globals exist
const animationGlobals = Object.keys(window).filter(k => k.toLowerCase().includes('animation') || k.toLowerCase().includes('typing'));
console.log('Animation-related globals:', animationGlobals);

// Check if the scripts have loaded
const scripts = Array.from(document.querySelectorAll('script[src]'));
const animationScript = scripts.find(s => s.src.includes('typing-animation'));
console.log('Typing animation script element:', animationScript);
console.log('Script loaded?', animationScript ? 'yes' : 'no');

if (animationScript) {
  console.log('Script src:', animationScript.src);
  console.log('Script onload:', animationScript.onload);
  console.log('Script onerror:', animationScript.onerror);
}

// Check if we can create an instance
try {
  if (typeof TypingAnimation !== 'undefined') {
    const testInstance = new TypingAnimation(console);
    console.log('✅ Successfully created TypingAnimation instance');
    console.log('Instance name:', testInstance.name);
  } else if (typeof window.TypingAnimation !== 'undefined') {
    const testInstance = new window.TypingAnimation(console);
    console.log('✅ Successfully created window.TypingAnimation instance');
    console.log('Instance name:', testInstance.name);
  } else {
    console.error('❌ TypingAnimation not available');
  }
} catch (error) {
  console.error('❌ Failed to create TypingAnimation instance:', error);
}

// Check ActionEngine availability
console.log('typeof ActionEngine:', typeof ActionEngine);
console.log('typeof window.ActionEngine:', typeof window.ActionEngine);

// Try to get the processor instance
if (window.contentManager && window.contentManager.processors) {
  const interactiveProcessor = window.contentManager.processors.find(p => p.name === 'InteractiveMarkerProcessor');
  if (interactiveProcessor) {
    console.log('Interactive processor found:', interactiveProcessor);
    console.log('Action engine:', interactiveProcessor.actionEngine);
    if (interactiveProcessor.actionEngine && interactiveProcessor.actionEngine.animations) {
      console.log('Registered animations:', Object.keys(interactiveProcessor.actionEngine.animations));
    }
  }
}