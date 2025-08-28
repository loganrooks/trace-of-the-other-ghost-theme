/**
 * Configuration Inspection - Debug what config FootnoteProcessor is actually receiving
 * 
 * This will show us why tooltips aren't working despite enableTooltips being true in configs
 */

window.inspectFootnoteConfig = function() {
  console.log('🔍 FOOTNOTE CONFIGURATION INSPECTION');
  console.log('===================================');
  
  const results = {
    globalConfig: null,
    processorConfig: null,
    systemConfig: null,
    processorInstance: null
  };
  
  // Check what the FootnoteProcessor instance actually has
  const system = window.ContentEnhancementSystem || window.contentManager;
  if (system && system.processors) {
    const footnoteProcessor = system.processors.get('footnotes');
    if (footnoteProcessor) {
      results.processorInstance = {
        hasConfig: !!footnoteProcessor.config,
        config: footnoteProcessor.config,
        hasBehavior: !!footnoteProcessor.config?.behavior,
        enableTooltips: footnoteProcessor.config?.behavior?.enableTooltips,
        behaviorObject: footnoteProcessor.config?.behavior
      };
      
      console.log('📝 FootnoteProcessor Instance Config:');
      console.log('  - Has config object:', results.processorInstance.hasConfig);
      console.log('  - Has behavior object:', results.processorInstance.hasBehavior);
      console.log('  - enableTooltips value:', results.processorInstance.enableTooltips);
      console.log('  - Full behavior object:', results.processorInstance.behaviorObject);
      console.log('  - Full config object:', results.processorInstance.config);
      
      // Test the exact condition from the code
      const condition1 = !footnoteProcessor.config.behavior?.enableKeyboardNav && !footnoteProcessor.config.behavior?.enableTooltips;
      const condition2 = footnoteProcessor.config.behavior?.enableTooltips;
      
      console.log('🧪 Code Condition Tests:');
      console.log('  - Early return condition (should be false):', condition1);
      console.log('  - Tooltip enable condition (should be true):', condition2);
      
    } else {
      console.error('❌ FootnoteProcessor not found in system.processors');
    }
  } else {
    console.error('❌ ContentEnhancementSystem not found');
  }
  
  // Check global configurations
  console.log('\n🌐 Global Configuration Sources:');
  
  // Check theme config
  if (typeof window.ThemeConfig !== 'undefined') {
    results.globalConfig = window.ThemeConfig;
    console.log('✅ ThemeConfig found:', window.ThemeConfig);
  } else {
    console.log('❌ ThemeConfig not found');
  }
  
  // Check configuration manager
  if (system && system.configManager) {
    const processorConfig = system.configManager.getProcessorConfig('footnotes');
    results.processorConfig = processorConfig;
    console.log('✅ ConfigManager footnotes config:', processorConfig);
  } else {
    console.log('❌ ConfigManager not found');
  }
  
  // Summary diagnosis
  console.log('\n📋 DIAGNOSIS:');
  if (results.processorInstance && results.processorInstance.enableTooltips === true) {
    console.log('✅ Configuration appears correct - tooltips should work');
  } else if (results.processorInstance && results.processorInstance.enableTooltips === false) {
    console.log('❌ enableTooltips is explicitly false');
  } else if (results.processorInstance && results.processorInstance.enableTooltips === undefined) {
    console.log('❌ enableTooltips is undefined - configuration not reaching processor');
  } else {
    console.log('❌ Cannot determine tooltip configuration');
  }
  
  window.footnoteConfigResults = results;
  return results;
};

// Auto-run after system initialization
setTimeout(() => {
  console.log('🔍 Auto-running footnote config inspection...');
  window.inspectFootnoteConfig();
}, 4000);

console.log('🔍 Config inspection loaded - will auto-run in 4 seconds');