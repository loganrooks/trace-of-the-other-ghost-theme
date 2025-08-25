/**
 * Debug Theme Settings - Troubleshoot Ghost custom theme settings
 * Run this in browser console to check what's happening with theme settings
 */

function debugThemeSettings() {
    console.group('🔧 Theme Settings Debug');
    
    // Check if Ghost theme settings are available
    console.log('Ghost Custom Settings Object:', window.ghost_custom_settings);
    
    // Check individual settings
    if (window.ghost_custom_settings) {
        console.log('📊 Individual Settings:');
        Object.entries(window.ghost_custom_settings).forEach(([key, value]) => {
            console.log(`  ${key}:`, value, `(${typeof value})`);
        });
    } else {
        console.error('❌ Ghost custom settings not found!');
        console.log('🔍 Possible causes:');
        console.log('  1. Theme not properly installed');
        console.log('  2. Handlebars template syntax error'); 
        console.log('  3. Ghost version compatibility issue');
    }
    
    // Check feature flags
    console.log('🚩 Current Feature Flags:', window.CONTENT_ENHANCEMENT_FLAGS);
    
    // Check if extensions should be enabled
    const extensionsEnabled = window.ghost_custom_settings?.enable_extensions;
    console.log('🎨 Extensions Status:');
    console.log('  Theme Setting:', extensionsEnabled);
    console.log('  Feature Flag:', window.CONTENT_ENHANCEMENT_FLAGS?.ENABLE_EXTENSIONS);
    console.log('  Processor Flag:', window.CONTENT_ENHANCEMENT_FLAGS?.ENABLE_EXTENSION_PROCESSOR);
    
    if (!extensionsEnabled) {
        console.log('');
        console.log('💡 To enable extensions:');
        console.log('  1. Go to Ghost Admin → Design → Customize');
        console.log('  2. Find "Enable Extensions" setting');
        console.log('  3. Toggle it ON');
        console.log('  4. Click "Save"');
        console.log('  5. Refresh the page');
    }
    
    // Manual enable function
    console.log('');
    console.log('🚀 Manual Enable (temporary):');
    console.log('  Run: enableExtensionsManually()');
    
    console.groupEnd();
}

function enableExtensionsManually() {
    console.log('🔧 Manually enabling extensions...');
    
    // Override flags
    window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_EXTENSIONS = true;
    window.CONTENT_ENHANCEMENT_FLAGS.ENABLE_EXTENSION_PROCESSOR = true;
    
    // Initialize modern system if not already done
    if (typeof ContentEnhancementManager !== 'undefined') {
        console.log('🚀 Initializing modern content enhancement system...');
        
        if (window.ContentEnhancementSystem) {
            console.log('✅ System already exists - just enabling extensions');
        } else {
            window.ContentEnhancementSystem = new ContentEnhancementManager();
            window.ContentEnhancementSystem.initialize()
                .then(success => {
                    if (success) {
                        return window.ContentEnhancementSystem.processContent();
                    }
                    return false;
                })
                .then(success => {
                    if (success) {
                        console.log('✅ Extensions enabled! Look for orange + buttons');
                        console.log('🎯 Try typing [+][test content] in a paragraph');
                    } else {
                        console.error('❌ Failed to enable extensions');
                    }
                })
                .catch(error => {
                    console.error('❌ Extension system error:', error);
                });
        }
    } else {
        console.error('❌ Modern system not loaded. Check JavaScript files are included.');
    }
}

function testExtensionPattern() {
    console.log('🧪 Testing extension pattern matching...');
    
    const testText = 'This is a test.[+][This should become an orange button.]';
    const pattern = /\[\+\]\[((?:[^\[\]]|\[[^\]]*\])*)\]/g;
    
    const matches = testText.match(pattern);
    console.log('Test Text:', testText);
    console.log('Pattern:', pattern);
    console.log('Matches:', matches);
    
    if (matches) {
        console.log('✅ Pattern matching works');
        matches.forEach((match, i) => {
            const content = match.replace(/\[\+\]\[([^\]]*)\]/, '$1');
            console.log(`  Match ${i + 1}: "${match}" → Content: "${content}"`);
        });
    } else {
        console.log('❌ Pattern matching failed');
    }
}

// Auto-run debug on load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        if (window.CONTENT_ENHANCEMENT_FLAGS?.ENABLE_DEBUG_PANELS) {
            debugThemeSettings();
        }
    }, 2000);
});

// Make functions globally available
window.debugThemeSettings = debugThemeSettings;
window.enableExtensionsManually = enableExtensionsManually;
window.testExtensionPattern = testExtensionPattern;