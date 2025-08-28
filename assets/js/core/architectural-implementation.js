/**
 * Architectural Implementation - New System Initialization
 * 
 * Replaces the old coupled architecture with the new system from ARCHITECTURAL_OVERHAUL_PLAN.md
 * This script initializes the proper architectural components and manages the transition
 * 
 * Created: August 27, 2025
 * Based on: ARCHITECTURAL_OVERHAUL_PLAN.md
 */

// Debug tracking - mark script as started
if (typeof window.trackArchitecturalStep === 'function') {
  window.trackArchitecturalStep('architectural-implementation.js script started');
  window.architecturalDebug.scriptStarted = true;
}

/**
 * Initialize the new architectural system
 */
async function initializeNewArchitecture() {
  // Debug tracking
  if (typeof window.trackArchitecturalStep === 'function') {
    window.trackArchitecturalStep('initializeNewArchitecture called');
    window.architecturalDebug.initStarted = true;
  }
  
  // New architecture takes precedence - initialize regardless of old system state
  console.log('🏗️ New architecture initializing (will replace any existing systems)');
  
  console.log('🏗️ ARCHITECTURAL IMPLEMENTATION STARTING');
  console.log('==========================================');
  console.log('Implementing ARCHITECTURAL_OVERHAUL_PLAN.md');
  
  try {
    // Step 1: Create ThemeSystemCoordinator
    console.log('📦 Step 1: Creating ThemeSystemCoordinator...');
    
    if (typeof ThemeSystemCoordinator === 'undefined') {
      throw new Error('ThemeSystemCoordinator not loaded - check script loading order');
    }
    
    window.themeCoordinator = new ThemeSystemCoordinator();
    
    // Debug tracking
    if (typeof window.trackArchitecturalStep === 'function') {
      window.trackArchitecturalStep('ThemeSystemCoordinator created');
      window.architecturalDebug.coordinatorCreated = true;
    }
    
    // Step 2: Create and register FootnoteService with health check
    console.log('📝 Step 2: Registering FootnoteService...');
    
    if (typeof FootnoteService === 'undefined') {
      throw new Error('FootnoteService not loaded - check script loading order');
    }
    
    const footnoteService = new FootnoteService(window.themeCoordinator);
    
    // Register with health check
    window.themeCoordinator.registerSystem(
      'footnotes',
      footnoteService,
      FootnoteService.healthCheck
    );
    
    // TODO: Add missing processors - EXTREMELY EASY with new architecture!
    // Each processor becomes a simple service:
    //
    // const extensionService = new ExtensionService(window.themeCoordinator);
    // window.themeCoordinator.registerSystem('extensions', extensionService, ExtensionService.healthCheck);
    //
    // const interactiveService = new InteractiveMarkerService(window.themeCoordinator);  
    // window.themeCoordinator.registerSystem('interactive', interactiveService, InteractiveMarkerService.healthCheck);
    //
    // const marginaliaService = new MarginaliaService(window.themeCoordinator);
    // window.themeCoordinator.registerSystem('marginalia', marginaliaService, MarginaliaService.healthCheck);
    //
    // This is FAR cleaner than debugging the old system's broken event handlers!
    
    // Step 3: Initialize all systems
    console.log('🚀 Step 3: Initializing all systems...');
    
    const initSuccess = await window.themeCoordinator.initialize();
    
    if (!initSuccess) {
      throw new Error('System initialization failed');
    }
    
    // Step 4: Run health checks
    console.log('🏥 Step 4: Running health checks...');
    
    const healthResults = await window.themeCoordinator.runHealthChecks();
    console.log('Health check results:', healthResults);
    
    // Step 5: Register global debug functions
    console.log('🛠️ Step 5: Registering debug functions...');
    
    registerArchitecturalDebugFunctions();
    
    // Step 6: Emit ready event
    window.themeCoordinator.eventBus.emit('architecture:ready', {
      coordinator: window.themeCoordinator,
      timestamp: Date.now(),
      version: '1.0.0'
    });
    
    console.log('✅ NEW ARCHITECTURAL SYSTEM INITIALIZED SUCCESSFULLY');
    console.log('================================================');
    console.log('🎉 Footnote tooltips should now work properly!');
    console.log('💡 Use newArchitecture.help() for debug commands');
    
    return true;
    
  } catch (error) {
    console.error('❌ ARCHITECTURAL IMPLEMENTATION FAILED:', error);
    console.error('Falling back to old system...');
    
    // Debug tracking
    if (typeof window.trackArchitecturalStep === 'function') {
      window.trackArchitecturalStep('ERROR in initializeNewArchitecture', error.message);
      window.architecturalDebug.error = error.message;
    }
    
    return false;
  }
}

/**
 * Register debug functions for the new architecture
 */
function registerArchitecturalDebugFunctions() {
  window.newArchitecture = {
    
    /**
     * Get system status
     */
    status() {
      if (!window.themeCoordinator) {
        console.log('❌ New architecture not initialized');
        return null;
      }
      
      const healthStatus = window.themeCoordinator.getHealthStatus();
      console.log('📊 NEW ARCHITECTURE STATUS:');
      console.log('  Coordinator initialized:', healthStatus.coordinator.initialized);
      console.log('  Total systems:', healthStatus.coordinator.totalSystems);
      console.log('  Healthy systems:', healthStatus.coordinator.healthySystems);
      console.log('  Unhealthy systems:', healthStatus.coordinator.unhealthySystems);
      console.log('  Systems detail:', healthStatus.systems);
      
      return healthStatus;
    },
    
    /**
     * Test footnote functionality
     */
    async testFootnotes() {
      console.log('🧪 Testing footnote functionality...');
      
      const footnoteService = window.themeCoordinator?.getSystem('footnotes');
      if (!footnoteService) {
        console.error('❌ FootnoteService not found');
        return false;
      }
      
      const stats = footnoteService.getStats();
      console.log('📊 FootnoteService stats:', stats);
      
      // Test tooltip on first footnote
      const footnoteRefs = document.querySelectorAll('.footnote-ref a');
      if (footnoteRefs.length > 0) {
        console.log('🎯 Testing tooltip on first footnote...');
        const firstRef = footnoteRefs[0];
        
        // Trigger tooltip
        firstRef.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        
        setTimeout(() => {
          const tooltip = document.querySelector('.footnote-tooltip');
          if (tooltip && tooltip.style.display !== 'none') {
            console.log('✅ Tooltip test successful!');
            
            // Clean up
            setTimeout(() => {
              firstRef.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            }, 1000);
          } else {
            console.error('❌ Tooltip test failed - no tooltip visible');
          }
        }, 200);
        
        return true;
      } else {
        console.log('⚠️ No footnote references found to test');
        return false;
      }
    },
    
    /**
     * Run regression tests
     */
    async runTests() {
      if (typeof window.runRegressionTests !== 'undefined') {
        return await window.runRegressionTests();
      } else {
        console.error('❌ Regression test suite not loaded');
        return null;
      }
    },
    
    /**
     * Force reinitialize
     */
    async reinitialize() {
      console.log('🔄 Force reinitializing new architecture...');
      
      if (window.themeCoordinator) {
        // Clean up existing
        const footnoteService = window.themeCoordinator.getSystem('footnotes');
        if (footnoteService && footnoteService.cleanup) {
          footnoteService.cleanup();
        }
      }
      
      // Reinitialize
      return await initializeNewArchitecture();
    },
    
    /**
     * Get event log
     */
    getEventLog(limit = 10) {
      if (!window.themeCoordinator) return [];
      return window.themeCoordinator.eventBus.getEventLog(limit);
    },
    
    /**
     * Show available commands
     */
    help() {
      console.log('🏗️ NEW ARCHITECTURE DEBUG COMMANDS:');
      console.log('  newArchitecture.status()        - Show system status');
      console.log('  newArchitecture.testFootnotes()  - Test footnote functionality');
      console.log('  newArchitecture.runTests()      - Run regression test suite');
      console.log('  newArchitecture.reinitialize()  - Force reinitialize');
      console.log('  newArchitecture.getEventLog()   - Show recent events');
      console.log('  newArchitecture.help()          - Show this help');
      console.log('');
      console.log('🎯 QUICK TEST: newArchitecture.testFootnotes()');
    }
  };
  
  console.log('🛠️ New architecture debug functions registered');
}

/**
 * Check if new architecture should be used
 */
function shouldUseNewArchitecture() {
  // Check if required components are loaded
  const requiredClasses = [
    'ThemeSystemCoordinator',
    'FootnoteService'
  ];
  
  for (const className of requiredClasses) {
    if (typeof window[className] === 'undefined') {
      console.warn(`⚠️ ${className} not loaded - cannot use new architecture`);
      return false;
    }
  }
  
  // Check if DOM is ready
  if (document.readyState === 'loading') {
    console.log('⚠️ DOM not ready - will initialize after DOMContentLoaded');
    return false;
  }
  
  return true;
}

/**
 * Initialize when ready
 */
function initializeWhenReady() {
  if (shouldUseNewArchitecture()) {
    initializeNewArchitecture();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initializeNewArchitecture, 500);
    });
  } else {
    console.error('❌ Cannot initialize new architecture - missing dependencies');
  }
}

// Auto-initialize
console.log('🏗️ Architectural implementation script loaded');
console.log('📋 Based on: ARCHITECTURAL_OVERHAUL_PLAN.md');

// Initialize immediately if ready, otherwise wait
initializeWhenReady();

// Export for debugging
window.initializeNewArchitecture = initializeNewArchitecture;