/**
 * TraceEffectsService - Productive Deconstructive Effects
 * 
 * Implements genuinely deconstructive effects that enhance reading
 * rather than breaking it. Reveals hidden structures, questions
 * assumptions gracefully, and adds layers of meaning.
 */

class TraceEffectsService {
    constructor() {
        this.eventBus = window.themeSystemCoordinator?.eventBus;
        this.settings = window.ghost_custom_settings || {};
        this.enabled = this.settings.enable_trace_effects !== false;
        this.intensity = this.settings.trace_intensity || 'subtle';
        this.tracedElements = new Set();
        this.palimpsestLayers = new Map();
        this.revisionHistory = new Map();
    }

    init() {
        if (!this.enabled) return;
        
        console.log('[TraceEffects] Initializing productive deconstructive effects');
        
        this.attachEventListeners();
        this.processExistingContent();
        this.initPalimpsest();
        this.initSemanticInstability();
        this.initTemporalLayers();
        this.initPlatformAwareness();
    }

    /**
     * 1. PALIMPSEST EFFECTS - Show text history and evolution
     */
    initPalimpsest() {
        // Find elements with revision markers
        const revisedElements = document.querySelectorAll('[data-revised], .has-history');
        
        revisedElements.forEach(element => {
            this.createPalimpsestLayer(element);
        });

        // Add CSS for palimpsest effects
        this.injectPalimpsestStyles();
    }

    createPalimpsestLayer(element) {
        const originalText = element.textContent;
        const revisions = element.dataset.revisions ? 
            JSON.parse(element.dataset.revisions) : 
            this.generateSyntheticRevisions(originalText);
        
        // Create ghost text layers
        const wrapper = document.createElement('div');
        wrapper.className = 'palimpsest-wrapper';
        wrapper.style.position = 'relative';
        
        // Add previous versions as ghost layers
        revisions.forEach((revision, index) => {
            const ghostLayer = document.createElement('span');
            ghostLayer.className = 'palimpsest-ghost';
            ghostLayer.textContent = revision.text;
            ghostLayer.style.cssText = `
                position: absolute;
                opacity: ${0.15 - (index * 0.05)};
                color: var(--ghost-text-color, #666);
                text-decoration: line-through;
                pointer-events: none;
                z-index: ${-index - 1};
                transform: translateY(${index * 2}px);
            `;
            wrapper.appendChild(ghostLayer);
        });
        
        // Wrap original content
        element.style.position = 'relative';
        element.style.zIndex = '1';
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        
        // Add hover interaction
        wrapper.addEventListener('mouseenter', () => {
            this.revealPalimpsest(wrapper);
        });
        
        wrapper.addEventListener('mouseleave', () => {
            this.hidePalimpsest(wrapper);
        });
    }

    generateSyntheticRevisions(text) {
        // Generate plausible previous versions
        const words = text.split(' ');
        const revisions = [];
        
        if (words.length > 3) {
            // Create a deletion revision
            revisions.push({
                text: words.slice(0, -Math.floor(words.length * 0.3)).join(' ') + '...',
                type: 'deletion',
                timestamp: 'earlier draft'
            });
        }
        
        return revisions;
    }

    revealPalimpsest(wrapper) {
        const ghosts = wrapper.querySelectorAll('.palimpsest-ghost');
        ghosts.forEach((ghost, index) => {
            ghost.style.transition = 'opacity 0.5s ease';
            ghost.style.opacity = 0.3 - (index * 0.1);
        });
    }

    hidePalimpsest(wrapper) {
        const ghosts = wrapper.querySelectorAll('.palimpsest-ghost');
        ghosts.forEach((ghost, index) => {
            ghost.style.opacity = 0.15 - (index * 0.05);
        });
    }

    /**
     * 2. SEMANTIC INSTABILITY - Words that reveal multiple meanings
     */
    initSemanticInstability() {
        // Find key terms marked for semantic play
        const unstableTerms = document.querySelectorAll('[data-semantic], .key-term');
        
        unstableTerms.forEach(term => {
            this.makeSemanticUnstable(term);
        });
    }

    makeSemanticUnstable(element) {
        const originalText = element.textContent;
        const alternatives = element.dataset.alternatives ? 
            element.dataset.alternatives.split(',') :
            this.generateAlternatives(originalText);
        
        if (alternatives.length === 0) return;
        
        let currentIndex = 0;
        element.style.cursor = 'help';
        element.style.borderBottom = '1px dotted var(--semantic-border, #999)';
        
        // Create tooltip for etymology/alternatives
        const tooltip = document.createElement('div');
        tooltip.className = 'semantic-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: var(--tooltip-bg, rgba(0,0,0,0.9));
            color: var(--tooltip-text, white);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.9em;
            display: none;
            z-index: 1000;
            max-width: 250px;
            pointer-events: none;
        `;
        
        element.addEventListener('mouseenter', (e) => {
            // Show alternatives
            tooltip.innerHTML = `
                <div style="margin-bottom: 4px; opacity: 0.7;">could also be:</div>
                ${alternatives.map(alt => `<div>→ ${alt}</div>`).join('')}
            `;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 5) + 'px';
            tooltip.style.display = 'block';
            
            // Cycle through alternatives
            this.semanticInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % (alternatives.length + 1);
                element.textContent = currentIndex === 0 ? originalText : alternatives[currentIndex - 1];
                element.style.fontStyle = currentIndex === 0 ? 'normal' : 'italic';
            }, 2000);
        });
        
        element.addEventListener('mouseleave', () => {
            clearInterval(this.semanticInterval);
            element.textContent = originalText;
            element.style.fontStyle = 'normal';
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        });
    }

    generateAlternatives(word) {
        // Simple thesaurus-like alternatives
        const alternatives = {
            'truth': ['certainty', 'belief', 'construct'],
            'author': ['writer', 'creator', 'voice', 'ghost'],
            'original': ['first', 'source', 'copy'],
            'meaning': ['sense', 'significance', 'intention'],
            'text': ['writing', 'script', 'trace'],
            'read': ['interpret', 'decode', 'consume'],
            'write': ['inscribe', 'mark', 'erase']
        };
        
        return alternatives[word.toLowerCase()] || [];
    }

    /**
     * 3. TEMPORAL LAYERS - Question linear time
     */
    initTemporalLayers() {
        const timestampElements = document.querySelectorAll('time, .post-date, [datetime]');
        
        timestampElements.forEach(element => {
            this.destabilizeTime(element);
        });
    }

    destabilizeTime(element) {
        const originalTime = element.textContent;
        const datetime = element.getAttribute('datetime');
        
        element.style.cursor = 'help';
        element.title = 'When is now?';
        
        element.addEventListener('mouseenter', () => {
            // Add temporal uncertainty
            const uncertainties = [
                originalTime + '?',
                'just now',
                'always already',
                'not yet',
                'again'
            ];
            
            let index = 0;
            this.timeInterval = setInterval(() => {
                element.textContent = uncertainties[index];
                element.style.opacity = index === 0 ? '1' : '0.7';
                index = (index + 1) % uncertainties.length;
            }, 1500);
        });
        
        element.addEventListener('mouseleave', () => {
            clearInterval(this.timeInterval);
            element.textContent = originalTime;
            element.style.opacity = '1';
        });
    }

    /**
     * 4. PLATFORM AWARENESS - Make Ghost constraints visible
     */
    initPlatformAwareness() {
        // Add subtle indicators where Ghost limits functionality
        this.markPlatformConstraints();
    }

    markPlatformConstraints() {
        // Find elements that represent Ghost limitations
        const constraints = [
            { selector: '.post-content img', message: 'Ghost controls how images are stored' },
            { selector: '.author-name', message: 'Single author - Ghost assumes one voice' },
            { selector: '.published-date', message: 'Fixed in time - Ghost preserves chronology' }
        ];
        
        constraints.forEach(constraint => {
            const elements = document.querySelectorAll(constraint.selector);
            elements.forEach(element => {
                // Add subtle indicator
                const indicator = document.createElement('span');
                indicator.className = 'platform-constraint-indicator';
                indicator.textContent = '⚠';
                indicator.style.cssText = `
                    opacity: 0;
                    transition: opacity 0.3s;
                    cursor: help;
                    margin-left: 4px;
                    font-size: 0.8em;
                    color: var(--constraint-color, #666);
                `;
                indicator.title = constraint.message;
                
                element.appendChild(indicator);
                
                element.addEventListener('mouseenter', () => {
                    indicator.style.opacity = '0.5';
                });
                
                element.addEventListener('mouseleave', () => {
                    indicator.style.opacity = '0';
                });
            });
        });
    }

    /**
     * 5. READING TRACES - Show where readers have been
     */
    initReadingTraces() {
        // Track which parts of text have been read
        const paragraphs = document.querySelectorAll('.post-content p');
        
        paragraphs.forEach(p => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.markAsRead(entry.target);
                    }
                });
            }, { threshold: 0.8 });
            
            observer.observe(p);
        });
    }

    markAsRead(element) {
        if (this.tracedElements.has(element)) return;
        
        this.tracedElements.add(element);
        element.classList.add('has-been-read');
        
        // Subtle visual indication
        element.style.transition = 'border-left 1s ease';
        element.style.borderLeft = '2px solid transparent';
        
        setTimeout(() => {
            element.style.borderLeft = '2px solid var(--trace-color, rgba(0,255,0,0.1))';
        }, 100);
    }

    /**
     * Helper Methods
     */
    attachEventListeners() {
        // Listen for content updates
        if (this.eventBus) {
            this.eventBus.on('content:updated', () => {
                this.processExistingContent();
            });
        }
        
        // Process dynamically added content
        const observer = new MutationObserver(() => {
            this.processExistingContent();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    processExistingContent() {
        // Re-initialize effects for new content
        if (this.intensity === 'off') return;
        
        // Debounce processing
        clearTimeout(this.processTimeout);
        this.processTimeout = setTimeout(() => {
            this.initPalimpsest();
            this.initSemanticInstability();
            this.initTemporalLayers();
            this.initReadingTraces();
        }, 100);
    }

    injectPalimpsestStyles() {
        if (document.getElementById('trace-effects-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'trace-effects-styles';
        styles.textContent = `
            .palimpsest-wrapper {
                display: inline-block;
                position: relative;
            }
            
            .palimpsest-ghost {
                user-select: none;
                filter: blur(0.5px);
            }
            
            .has-been-read {
                position: relative;
            }
            
            .semantic-tooltip {
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .platform-constraint-indicator {
                display: inline-block;
                vertical-align: super;
            }
            
            /* Intensity levels */
            body[data-trace-intensity="subtle"] .palimpsest-ghost {
                opacity: 0.05 !important;
            }
            
            body[data-trace-intensity="visible"] .palimpsest-ghost {
                opacity: 0.2 !important;
            }
            
            body[data-trace-intensity="prominent"] .palimpsest-ghost {
                opacity: 0.4 !important;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Public API
     */
    setIntensity(level) {
        this.intensity = level;
        document.body.setAttribute('data-trace-intensity', level);
    }

    disable() {
        this.enabled = false;
        // Clean up effects
        document.querySelectorAll('.palimpsest-wrapper').forEach(wrapper => {
            const content = wrapper.querySelector(':not(.palimpsest-ghost)');
            wrapper.parentNode.insertBefore(content, wrapper);
            wrapper.remove();
        });
    }

    getHealth() {
        return {
            service: 'TraceEffectsService',
            enabled: this.enabled,
            intensity: this.intensity,
            tracedElements: this.tracedElements.size,
            palimpsestLayers: this.palimpsestLayers.size
        };
    }
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.traceEffectsService = new TraceEffectsService();
        window.traceEffectsService.init();
    });
} else {
    window.traceEffectsService = new TraceEffectsService();
    window.traceEffectsService.init();
}