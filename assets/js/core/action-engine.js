/**
 * Action Engine - Orchestrates interactive marker actions
 * Coordinates target selection, state management, and animation execution
 * 
 * Responsibilities:
 * - Action parsing and validation
 * - State storage and restoration
 * - Animation coordination
 * - Error handling and recovery
 * 
 * Created: August 25, 2025
 */

class ActionEngine {
  constructor(container, logger = console) {
    this.container = container;
    this.logger = logger;
    
    // Initialize target selector
    this.targetSelector = new TargetSelector(container, logger);
    
    // State management
    this.activeActions = new Map();
    this.stateHistory = new Map();
    
    // Animation registry
    this.animationModules = new Map();
    
    this.logger.debug('ActionEngine initialized');
  }

  /**
   * Register an animation module
   * @param {string} name - Animation name
   * @param {Object} module - Animation module
   */
  registerAnimation(name, module) {
    if (typeof module.execute !== 'function') {
      throw new Error(`Animation module ${name} must have execute() method`);
    }
    
    this.animationModules.set(name, module);
    this.logger.debug(`Registered animation module: ${name}`);
  }

  /**
   * Execute a complete action sequence
   * @param {string} actionId - Unique action identifier
   * @param {Object} actions - Parsed action configuration
   * @param {string} content - Content to display
   * @returns {Promise<Object>} Action execution result
   */
  async execute(actionId, actions, content) {
    try {
      this.logger.info(`Executing action ${actionId}`, { actions });
      
      // Create action state
      const actionState = {
        id: actionId,
        actions: actions,
        content: content,
        targetElements: [],
        originalStates: new Map(),
        animationControllers: [],
        startTime: performance.now(),
        status: 'initializing'
      };
      
      // Store active action
      this.activeActions.set(actionId, actionState);
      
      // Execute action sequence
      const result = await this.executeSequence(actionState);
      
      // Mark as completed
      actionState.status = 'completed';
      actionState.endTime = performance.now();
      
      this.logger.info(`Action ${actionId} completed in ${(actionState.endTime - actionState.startTime).toFixed(2)}ms`);
      
      return result;
      
    } catch (error) {
      this.logger.error(`Action execution failed for ${actionId}:`, error);
      
      // Clean up failed action
      await this.cleanup(actionId);
      
      throw error;
    }
  }

  /**
   * Execute the complete action sequence
   * @param {Object} actionState - Action state object
   * @returns {Promise<Object>} Execution result
   * @private
   */
  async executeSequence(actionState) {
    const { actions, content } = actionState;
    
    // Phase 1: Target selection
    actionState.status = 'selecting-targets';
    actionState.targetElements = this.targetSelector.select(actions.target);
    
    if (actionState.targetElements.length === 0) {
      throw new Error(`No target elements found for: ${actions.target}`);
    }
    
    this.logger.debug(`Selected ${actionState.targetElements.length} target elements`);
    
    // Phase 2: Store original states
    actionState.status = 'storing-states';
    this.storeOriginalStates(actionState);
    
    // Phase 3: Apply delay if specified
    if (parseInt(actions.delay) > 0) {
      actionState.status = 'delaying';
      await this.delay(parseInt(actions.delay));
    }
    
    // Phase 4: Navigate to target (scroll to first target element)
    actionState.status = 'navigating';
    await this.navigateToTarget(actionState);
    
    // Phase 5: Apply fade effect
    if (parseFloat(actions.fade) < 1.0) {
      actionState.status = 'fading';
      await this.applyFadeEffect(actionState, parseFloat(actions.fade));
    }
    
    // Phase 6: Execute animation
    actionState.status = 'animating';
    const animationResult = await this.executeAnimation(actionState);
    
    return {
      success: true,
      actionId: actionState.id,
      targetCount: actionState.targetElements.length,
      duration: performance.now() - actionState.startTime,
      animationResult: animationResult
    };
  }

  /**
   * Store original states of target elements
   * @param {Object} actionState - Action state object
   * @private
   */
  storeOriginalStates(actionState) {
    actionState.targetElements.forEach((element, index) => {
      const originalState = {
        opacity: element.style.opacity || '1',
        display: element.style.display || 'block',
        visibility: element.style.visibility || 'visible',
        transform: element.style.transform || 'none',
        innerHTML: element.innerHTML,
        textContent: element.textContent,
        position: element.style.position || 'static',
        zIndex: element.style.zIndex || 'auto',
        // Store computed styles that might be affected
        computedStyles: {
          fontSize: window.getComputedStyle(element).fontSize,
          lineHeight: window.getComputedStyle(element).lineHeight,
          color: window.getComputedStyle(element).color,
          backgroundColor: window.getComputedStyle(element).backgroundColor
        }
      };
      
      actionState.originalStates.set(index, originalState);
    });
    
    // Store state in history for potential restoration
    this.stateHistory.set(actionState.id, {
      timestamp: Date.now(),
      originalStates: new Map(actionState.originalStates),
      targetElements: [...actionState.targetElements]
    });
    
    this.logger.debug(`Stored original states for ${actionState.targetElements.length} elements`);
  }

  /**
   * Navigate to target element (smooth scroll)
   * @param {Object} actionState - Action state object
   * @private
   */
  async navigateToTarget(actionState) {
    if (actionState.targetElements.length === 0) return;
    
    const firstTarget = actionState.targetElements[0];
    
    // Calculate scroll position
    const rect = firstTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top - (window.innerHeight / 4);
    
    // Smooth scroll to target
    window.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
    
    // Wait for scroll to complete
    await this.delay(500); // Standard smooth scroll duration
    
    this.logger.debug('Navigated to target element');
  }

  /**
   * Apply fade effect to target elements
   * @param {Object} actionState - Action state object
   * @param {number} fadeOpacity - Target opacity (0.0-1.0)
   * @private
   */
  async applyFadeEffect(actionState, fadeOpacity) {
    const fadeDuration = 500; // 500ms fade duration
    const fadeSteps = 20;
    const stepDuration = fadeDuration / fadeSteps;
    
    // Calculate fade progression for each element
    const fadePromises = actionState.targetElements.map(async (element, index) => {
      const originalOpacity = parseFloat(actionState.originalStates.get(index).opacity);
      const opacityDiff = originalOpacity - fadeOpacity;
      
      for (let step = 0; step <= fadeSteps; step++) {
        const progress = step / fadeSteps;
        const currentOpacity = originalOpacity - (opacityDiff * progress);
        
        element.style.opacity = currentOpacity.toString();
        
        if (step < fadeSteps) {
          await this.delay(stepDuration);
        }
      }
    });
    
    await Promise.all(fadePromises);
    
    this.logger.debug(`Applied fade effect to opacity ${fadeOpacity}`);
  }

  /**
   * Execute animation based on animation type
   * @param {Object} actionState - Action state object
   * @returns {Promise<Object>} Animation result
   * @private
   */
  async executeAnimation(actionState) {
    const animationType = actionState.actions.animate;
    const animationModule = this.animationModules.get(animationType);
    
    if (!animationModule) {
      throw new Error(`Animation module not found: ${animationType}`);
    }
    
    // Prepare animation configuration
    const animationConfig = {
      targetElements: actionState.targetElements,
      content: actionState.content,
      duration: parseInt(actionState.actions.duration) || 2000,
      overlay: actionState.actions.overlay || 'over',
      originalStates: actionState.originalStates
    };
    
    // Execute animation
    const controller = await animationModule.execute(animationConfig);
    
    // Store animation controller for potential cleanup
    if (controller) {
      actionState.animationControllers.push(controller);
    }
    
    this.logger.debug(`Executed ${animationType} animation`);
    
    return {
      type: animationType,
      duration: animationConfig.duration,
      targetCount: actionState.targetElements.length
    };
  }

  /**
   * Clean up an action and restore original state
   * @param {string} actionId - Action identifier to clean up
   * @returns {Promise<void>}
   */
  async cleanup(actionId) {
    const actionState = this.activeActions.get(actionId);
    if (!actionState) {
      this.logger.warn(`No active action found for cleanup: ${actionId}`);
      return;
    }
    
    try {
      // Cancel any running animations
      if (actionState.animationControllers) {
        actionState.animationControllers.forEach(controller => {
          if (controller && typeof controller.cancel === 'function') {
            controller.cancel();
          }
        });
      }
      
      // Restore original states
      await this.restoreStates(actionId);
      
      // Remove from active actions
      this.activeActions.delete(actionId);
      
      this.logger.debug(`Cleaned up action: ${actionId}`);
      
    } catch (error) {
      this.logger.error(`Cleanup failed for action ${actionId}:`, error);
    }
  }

  /**
   * Restore original states for an action
   * @param {string} actionId - Action identifier
   * @returns {Promise<void>}
   * @private
   */
  async restoreStates(actionId) {
    const stateHistory = this.stateHistory.get(actionId);
    if (!stateHistory) {
      this.logger.warn(`No state history found for action: ${actionId}`);
      return;
    }
    
    const { originalStates, targetElements } = stateHistory;
    
    // Restore each element
    originalStates.forEach((originalState, index) => {
      const element = targetElements[index];
      if (element && element.parentNode) {
        // Restore style properties
        element.style.opacity = originalState.opacity;
        element.style.display = originalState.display;
        element.style.visibility = originalState.visibility;
        element.style.transform = originalState.transform;
        element.style.position = originalState.position;
        element.style.zIndex = originalState.zIndex;
        
        // Restore content if it was modified
        if (element.innerHTML !== originalState.innerHTML) {
          element.innerHTML = originalState.innerHTML;
        }
      }
    });
    
    // Clean up state history
    this.stateHistory.delete(actionId);
    
    this.logger.debug(`Restored states for action: ${actionId}`);
  }

  /**
   * Cancel all active actions
   * @returns {Promise<void>}
   */
  async cancelAll() {
    const actionIds = Array.from(this.activeActions.keys());
    
    const cleanupPromises = actionIds.map(actionId => this.cleanup(actionId));
    await Promise.all(cleanupPromises);
    
    this.logger.info(`Cancelled ${actionIds.length} active actions`);
  }

  /**
   * Get information about active actions
   * @returns {Array<Object>} Active action information
   */
  getActiveActions() {
    return Array.from(this.activeActions.values()).map(actionState => ({
      id: actionState.id,
      status: actionState.status,
      targetCount: actionState.targetElements.length,
      duration: performance.now() - actionState.startTime,
      actions: actionState.actions
    }));
  }

  /**
   * Utility delay function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   * @private
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ActionEngine;
} else if (typeof window !== 'undefined') {
  window.ActionEngine = ActionEngine;
}