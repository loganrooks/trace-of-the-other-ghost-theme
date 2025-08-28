/**
 * Configuration Debug
 * 
 * Debug why effectConfig.enableVoices is false
 */

window.debugEffectConfig = function() {
  console.group('⚙️ EFFECT CONFIGURATION DEBUG');
  
  // Check ThemeConfig
  console.log('=== THEME CONFIG ===');
  if (window.ThemeConfig) {
    console.log('ThemeConfig exists:', !!window.ThemeConfig);
    console.log('ThemeConfig.processors:', window.ThemeConfig.processors);
    console.log('ThemeConfig deconstruction effects:', window.ThemeConfig.processors?.deconstruction?.effects);
    console.log('ThemeConfig enableVoices:', window.ThemeConfig.processors?.deconstruction?.effects?.enableVoices);
  } else {
    console.log('❌ ThemeConfig not found');
  }
  
  // Check main system processor config
  console.log('=== MAIN PROCESSOR CONFIG ===');
  if (window.ContentEnhancementSystem?.processors?.get('deconstruction')) {
    const processor = window.ContentEnhancementSystem.processors.get('deconstruction');
    console.log('Main processor found');
    console.log('processor.config:', processor.config);
    console.log('processor.effectConfig:', processor.effectConfig);
    console.log('processor.effectConfig.enableVoices:', processor.effectConfig.enableVoices);
    console.log('typeof enableVoices:', typeof processor.effectConfig.enableVoices);
  } else {
    console.log('❌ Main processor not found');
  }
  
  // Check ConfigurationManager
  console.log('=== CONFIGURATION MANAGER ===');
  if (window.ContentEnhancementSystem?.configManager) {
    const configManager = window.ContentEnhancementSystem.configManager;
    console.log('ConfigManager exists');
    console.log('configManager.config:', configManager.config);
    
    if (configManager.config?.processors?.deconstruction) {
      console.log('ConfigManager deconstruction config:', configManager.config.processors.deconstruction);
      console.log('ConfigManager effects config:', configManager.config.processors.deconstruction.effects);
    }
  } else {
    console.log('❌ ConfigManager not found');
  }
  
  // Test manual processor config
  console.log('=== MANUAL PROCESSOR TEST ===');
  try {
    const container = document.querySelector('.post-content') || document.body;
    const testProcessor = new window.DeconstructionProcessor({}, container);
    console.log('Test processor created');
    console.log('test processor.config:', testProcessor.config);
    console.log('test processor.effectConfig:', testProcessor.effectConfig);
    console.log('test processor.effectConfig.enableVoices:', testProcessor.effectConfig.enableVoices);
  } catch (error) {
    console.error('❌ Failed to create test processor:', error);
  }
  
  console.groupEnd();
};

// Quick effect status check
window.checkVoicesEnabled = function() {
  const processor = window.ContentEnhancementSystem?.processors?.get('deconstruction');
  if (processor) {
    console.log('🎭 enableVoices status:', processor.effectConfig.enableVoices);
    console.log('Full effectConfig:', processor.effectConfig);
  } else {
    console.log('❌ No processor found');
  }
};

console.log('⚙️ Config debugger loaded. Use:');
console.log('- debugEffectConfig()');
console.log('- checkVoicesEnabled()');