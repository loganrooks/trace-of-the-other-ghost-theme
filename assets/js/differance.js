/**
 * Differance.js - Deferred loading, temporal play
 * Named after Derrida's concept of différance - the play of difference and deferral
 * This script plays with timing, delay, presence, and absence in digital text
 */

(function() {
    'use strict';

    /**
     * The Différance class - Managing presence through deferral
     */
    class Differance {
        constructor() {
            this.deferredElements = new Map();
            this.temporalEffects = [];
            this.loadingStates = new Set();
            this.timeouts = new Map();
            
            // Sometimes différance refuses to initialize
            if (Math.random() > 0.95) {
                console.log('Différance defers its own initialization');
                setTimeout(() => this.init(), Math.random() * 5000);
                return;
            }
            
            this.init();
        }

        init() {
            console.log('Différance initialized - presence deferred, meaning delayed');
            
            this.setupDeferredLoading();
            this.setupTemporalEffects();
            this.setupPresencePlay();
            this.observeTextChanges();
            
            // Self-referential commentary
            this.addPhilosophicalContext();
        }

        /**
         * Deferred loading - Content appears with delay and différance
         */
        setupDeferredLoading() {
            // Find elements that should load with delay
            const deferredElements = document.querySelectorAll(
                '.deferred, [data-defer], .load-delayed, .temporal-content'
            );

            deferredElements.forEach((element, index) => {
                const delay = this.calculateDelay(element, index);
                const elementId = this.generateElementId();
                
                // Store original content
                const originalContent = element.innerHTML;
                this.deferredElements.set(elementId, {
                    element: element,
                    originalContent: originalContent,
                    delay: delay,
                    loaded: false
                });

                // Replace with loading state
                this.showDeferredState(element, delay);
                
                // Schedule loading
                const timeoutId = setTimeout(() => {
                    this.loadDeferredElement(elementId);
                }, delay);
                
                this.timeouts.set(elementId, timeoutId);
            });
        }

        calculateDelay(element, index) {
            // Different delay calculation strategies
            const baseDelay = 1000;
            
            if (element.dataset.defer) {
                return parseInt(element.dataset.defer);
            }
            
            if (element.classList.contains('temporal-content')) {
                return baseDelay + (index * 500) + (Math.random() * 1000);
            }
            
            // Delay based on reading order (but sometimes disrupted)
            if (Math.random() > 0.8) {
                return baseDelay + (Math.random() * 3000); // Random disruption
            }
            
            return baseDelay + (index * 300);
        }

        showDeferredState(element, delay) {
            const states = [
                'Loading...',
                '...',
                '[Content deferred]',
                '[Meaning delayed]',
                '[Presence pending]',
                'différance at work...',
                'Text is loading (but what is loading?)',
                'Waiting for meaning to arrive...',
                'Content exists elsewhere, elsewhen...'
            ];

            const state = states[Math.floor(Math.random() * states.length)];
            const delaySeconds = (delay / 1000).toFixed(1);
            
            element.innerHTML = `
                <div class="deferred-loading">
                    <div class="loading-text">${state}</div>
                    <div class="loading-meta">
                        <span class="delay-time">Delay: ${delaySeconds}s</span>
                        <span class="loading-bar">
                            <div class="loading-progress" style="animation-duration: ${delay}ms;"></div>
                        </span>
                    </div>
                </div>
            `;
            
            element.classList.add('loading-deferred');
        }

        loadDeferredElement(elementId) {
            const deferredInfo = this.deferredElements.get(elementId);
            if (!deferredInfo || deferredInfo.loaded) return;

            const { element, originalContent } = deferredInfo;
            
            // Sometimes loading fails (philosophical failure)
            if (Math.random() > 0.9) {
                this.showLoadingFailure(element);
                return;
            }

            // Animate the arrival of content
            element.style.transition = 'opacity 0.5s ease';
            element.style.opacity = '0';

            setTimeout(() => {
                element.innerHTML = originalContent;
                element.classList.remove('loading-deferred');
                element.classList.add('loaded-deferred');
                element.style.opacity = '1';
                
                deferredInfo.loaded = true;
                
                // Add temporal trace
                this.addTemporalTrace(element, deferredInfo.delay);
                
            }, 250);
        }

        showLoadingFailure(element) {
            element.innerHTML = `
                <div class="loading-failure">
                    <div class="failure-text">Loading failed</div>
                    <div class="failure-explanation">
                        Sometimes différance defers indefinitely. 
                        The content exists, but arrival is impossible.
                        This failure is also part of the text.
                    </div>
                    <button onclick="location.reload()" class="retry-button">
                        Retry (though success is not guaranteed)
                    </button>
                </div>
            `;
            element.classList.add('loading-failed');
        }

        addTemporalTrace(element, delay) {
            const trace = document.createElement('div');
            trace.className = 'temporal-trace';
            trace.innerHTML = `
                <span class="trace-icon">⏰</span>
                <span class="trace-text">Loaded after ${(delay/1000).toFixed(1)}s delay</span>
            `;
            
            element.appendChild(trace);
            
            // Fade out trace after reading
            setTimeout(() => {
                trace.style.opacity = '0.3';
            }, 3000);
        }

        /**
         * Temporal effects - Text that changes over time
         */
        setupTemporalEffects() {
            this.setupTextFading();
            this.setupTemporalRevisions();
            this.setupChronologicalDisruption();
            this.setupReadingTimeEffects();
        }

        setupTextFading() {
            const fadingElements = document.querySelectorAll('.temporal-fade, [data-fade]');
            
            fadingElements.forEach(element => {
                const fadeDelay = parseInt(element.dataset.fade) || 5000;
                const fadeRate = parseFloat(element.dataset.fadeRate) || 0.02;
                
                setTimeout(() => {
                    const fadeInterval = setInterval(() => {
                        const currentOpacity = parseFloat(window.getComputedStyle(element).opacity);
                        
                        if (currentOpacity <= 0.1) {
                            clearInterval(fadeInterval);
                            element.style.opacity = '0.05';
                            this.addFadeTrace(element);
                            return;
                        }
                        
                        element.style.opacity = currentOpacity - fadeRate;
                    }, 100);
                }, fadeDelay);
            });
        }

        setupTemporalRevisions() {
            const revisionElements = document.querySelectorAll('.temporal-revision, [data-revise]');
            
            revisionElements.forEach(element => {
                const originalText = element.textContent;
                const revisions = this.generateRevisions(originalText);
                let currentRevision = 0;
                
                const revisionInterval = setInterval(() => {
                    if (currentRevision >= revisions.length) {
                        clearInterval(revisionInterval);
                        element.classList.add('revision-complete');
                        return;
                    }
                    
                    element.style.transition = 'opacity 0.3s ease';
                    element.style.opacity = '0.5';
                    
                    setTimeout(() => {
                        element.textContent = revisions[currentRevision];
                        element.style.opacity = '1';
                        currentRevision++;
                    }, 300);
                    
                }, 3000);
            });
        }

        generateRevisions(originalText) {
            const words = originalText.split(' ');
            const revisions = [];
            
            // Progressive revelation
            for (let i = 1; i <= words.length; i++) {
                revisions.push(words.slice(0, i).join(' ') + (i < words.length ? '...' : ''));
            }
            
            // Then show edits
            revisions.push(originalText.replace(/\b\w+\b/g, (word) => 
                Math.random() > 0.8 ? `~~${word}~~` : word
            ));
            
            return revisions;
        }

        setupChronologicalDisruption() {
            const posts = document.querySelectorAll('.post-card, article');
            
            if (posts.length > 1 && Math.random() > 0.7) {
                console.log('Chronological order disrupted by différance');
                
                // Shuffle posts randomly
                const container = posts[0].parentElement;
                const shuffled = Array.from(posts).sort(() => Math.random() - 0.5);
                
                shuffled.forEach(post => {
                    container.appendChild(post);
                });
                
                // Add disruption notice
                const notice = document.createElement('div');
                notice.className = 'temporal-disruption-notice';
                notice.innerHTML = `
                    <p><strong>Temporal disruption detected:</strong> 
                    Chronological order has been interrupted by différance. 
                    Time is not linear in digital space.</p>
                `;
                container.insertBefore(notice, container.firstChild);
            }
        }

        setupReadingTimeEffects() {
            this.startTime = Date.now();
            this.readingEvents = [];
            
            // Track reading progress
            window.addEventListener('scroll', () => {
                this.recordReadingEvent('scroll', window.scrollY);
            });
            
            // Track time on page
            setInterval(() => {
                this.updateReadingTime();
            }, 1000);
            
            // Track when user leaves
            window.addEventListener('beforeunload', () => {
                this.recordFinalReadingStats();
            });
        }

        updateReadingTime() {
            const elapsed = Date.now() - this.startTime;
            const readingTimeElements = document.querySelectorAll('.reading-time-dynamic');
            
            readingTimeElements.forEach(element => {
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} elapsed`;
            });
            
            // After certain time, add temporal commentary
            if (elapsed > 30000 && !this.longReadingNoticeAdded) {
                this.addLongReadingNotice();
                this.longReadingNoticeAdded = true;
            }
        }

        addLongReadingNotice() {
            const notice = document.createElement('div');
            notice.className = 'long-reading-notice';
            notice.innerHTML = `
                <p><em>You have been reading for over 30 seconds. Time accumulates. 
                Your attention becomes part of the text. The text changes through being read.</em></p>
            `;
            
            const content = document.querySelector('.post-content, .main-content');
            if (content) {
                content.appendChild(notice);
            }
        }

        /**
         * Presence play - Elements that appear and disappear
         */
        setupPresencePlay() {
            this.setupGlitchEffects();
            this.setupPresenceFlicker();
            this.setupAbsenceMarkers();
        }

        setupGlitchEffects() {
            const glitchElements = document.querySelectorAll('.glitch, [data-glitch]');
            
            glitchElements.forEach(element => {
                setInterval(() => {
                    if (Math.random() > 0.95) {
                        this.triggerGlitch(element);
                    }
                }, 1000);
            });
        }

        triggerGlitch(element) {
            const originalText = element.textContent;
            const glitchedText = this.glitchText(originalText);
            
            element.style.transition = 'none';
            element.textContent = glitchedText;
            element.style.color = '#ff0000';
            element.style.textShadow = '2px 0 #ff0000, -2px 0 #00ff00';
            
            setTimeout(() => {
                element.textContent = originalText;
                element.style.color = '';
                element.style.textShadow = '';
            }, 100 + Math.random() * 200);
        }

        glitchText(text) {
            return text.split('').map(char => {
                if (Math.random() > 0.8) {
                    const glitchChars = ['█', '▓', '▒', '░', '§', '¶', '‡', '†'];
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
                return char;
            }).join('');
        }

        setupPresenceFlicker() {
            const flickerElements = document.querySelectorAll('.presence-flicker, [data-flicker]');
            
            flickerElements.forEach(element => {
                setInterval(() => {
                    if (Math.random() > 0.9) {
                        element.style.opacity = '0';
                        setTimeout(() => {
                            element.style.opacity = '1';
                        }, 50 + Math.random() * 100);
                    }
                }, 2000);
            });
        }

        setupAbsenceMarkers() {
            // Randomly insert markers of absence
            const paragraphs = document.querySelectorAll('p');
            
            paragraphs.forEach((p, index) => {
                if (Math.random() > 0.95) {
                    setTimeout(() => {
                        this.insertAbsenceMarker(p);
                    }, index * 1000);
                }
            });
        }

        insertAbsenceMarker(afterElement) {
            const absence = document.createElement('div');
            absence.className = 'absence-marker';
            absence.innerHTML = `
                <span class="absence-text">[Something was here but is now absent]</span>
                <span class="absence-timestamp">${new Date().toLocaleTimeString()}</span>
            `;
            
            afterElement.insertAdjacentElement('afterend', absence);
            
            // Fade in the absence
            absence.style.opacity = '0';
            setTimeout(() => {
                absence.style.transition = 'opacity 1s ease';
                absence.style.opacity = '0.6';
            }, 100);
        }

        /**
         * Observer for text changes - Detecting mutations in the DOM
         */
        observeTextChanges() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        this.recordTextMutation(mutation);
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        recordTextMutation(mutation) {
            const timestamp = Date.now();
            const mutationType = mutation.type;
            const target = mutation.target;
            
            console.log(`Différance detected: ${mutationType} at ${timestamp}`);
            
            // Sometimes add mutation traces to the DOM
            if (Math.random() > 0.9) {
                this.addMutationTrace(target, mutationType, timestamp);
            }
        }

        addMutationTrace(target, type, timestamp) {
            const trace = document.createElement('span');
            trace.className = 'mutation-trace';
            trace.innerHTML = ` <span class="trace-marker">[DOM ${type} ${timestamp}]</span>`;
            
            if (target.nodeType === Node.TEXT_NODE && target.parentElement) {
                target.parentElement.appendChild(trace);
            } else if (target.nodeType === Node.ELEMENT_NODE) {
                target.appendChild(trace);
            }
        }

        /**
         * Philosophical context - Meta-commentary on différance
         */
        addPhilosophicalContext() {
            // Add commentary about différance itself
            setTimeout(() => {
                const commentary = document.createElement('div');
                commentary.className = 'differance-commentary';
                commentary.innerHTML = `
                    <h4>On Différance</h4>
                    <p>This page demonstrates Derrida's concept of différance - the play of difference and deferral. 
                    Content loads with delay, meaning is deferred, presence is always already absent. 
                    The digital medium makes this philosophical concept literal.</p>
                    <p>Each delay, each loading state, each glitch performs the impossibility of pure presence. 
                    Text is always arriving, never fully present.</p>
                    <div class="differance-effects-log">
                        <strong>Effects active:</strong>
                        <ul id="effects-list"></ul>
                    </div>
                `;
                
                const content = document.querySelector('.post-content, .site-content');
                if (content) {
                    content.appendChild(commentary);
                    this.updateEffectsList();
                }
            }, 5000);
        }

        updateEffectsList() {
            const list = document.getElementById('effects-list');
            if (!list) return;
            
            const effects = [
                `${this.deferredElements.size} elements with deferred loading`,
                `${this.temporalEffects.length} temporal effects active`,
                `${this.loadingStates.size} loading states tracked`,
                `Page active for ${Math.floor((Date.now() - this.startTime) / 1000)} seconds`
            ];
            
            list.innerHTML = effects.map(effect => `<li>${effect}</li>`).join('');
        }

        /**
         * Utility functions
         */
        generateElementId() {
            return 'differance-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }

        addFadeTrace(element) {
            const trace = document.createElement('div');
            trace.className = 'fade-trace';
            trace.textContent = '[Text faded from temporal decay]';
            element.insertAdjacentElement('afterend', trace);
        }

        recordReadingEvent(type, data) {
            this.readingEvents.push({
                type: type,
                data: data,
                timestamp: Date.now()
            });
        }

        recordFinalReadingStats() {
            const totalTime = Date.now() - this.startTime;
            console.log(`Reading session: ${totalTime}ms`);
            console.log(`Events recorded: ${this.readingEvents.length}`);
            console.log('Différance session complete - presence was never fully present');
        }

        /**
         * Public API for external interaction
         */
        defer(element, delay) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(element);
                }, delay);
            });
        }

        glitch(element) {
            this.triggerGlitch(element);
        }

        disrupt() {
            // Manually trigger temporal disruption
            this.setupChronologicalDisruption();
        }
    }

    /**
     * Initialize Différance when DOM is ready
     */
    function initDifferance() {
        // Sometimes différance refuses to start
        if (Math.random() > 0.98) {
            console.log('Différance refuses to initialize - deferral infinite');
            return;
        }
        
        window.Differance = new Differance();
    }

    // Initialize based on document ready state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDifferance);
    } else {
        // Document already loaded, but add delay anyway (différance at work)
        setTimeout(initDifferance, Math.random() * 1000);
    }

    // CSS for différance effects (injected dynamically)
    const style = document.createElement('style');
    style.textContent = `
        .deferred-loading {
            padding: 2em;
            background: rgba(0, 0, 0, 0.02);
            border: 1px dashed #ccc;
            text-align: center;
            font-style: italic;
        }

        .loading-progress {
            width: 0;
            height: 2px;
            background: #333;
            animation: loading-fill linear forwards;
        }

        @keyframes loading-fill {
            to { width: 100%; }
        }

        .loading-failure {
            padding: 2em;
            background: rgba(255, 0, 0, 0.05);
            border: 1px solid red;
            text-align: center;
        }

        .temporal-trace {
            font-size: 0.8em;
            color: #666;
            font-style: italic;
            margin-top: 0.5em;
            opacity: 0.7;
            transition: opacity 3s ease;
        }

        .temporal-disruption-notice {
            background: rgba(255, 100, 0, 0.1);
            border: 1px solid orange;
            padding: 1em;
            margin: 2em 0;
            border-radius: 4px;
        }

        .long-reading-notice {
            background: rgba(0, 100, 255, 0.05);
            border-left: 3px solid blue;
            padding: 1em;
            margin: 2em 0;
            font-style: italic;
        }

        .absence-marker {
            margin: 1em 0;
            padding: 0.5em;
            background: rgba(0, 0, 0, 0.03);
            border: 1px dashed #999;
            font-size: 0.9em;
            color: #666;
        }

        .mutation-trace {
            font-family: monospace;
            font-size: 0.7em;
            color: #999;
            opacity: 0.6;
        }

        .differance-commentary {
            margin: 3em 0;
            padding: 2em;
            background: rgba(0, 0, 0, 0.02);
            border-left: 4px solid #333;
        }

        .differance-commentary h4 {
            margin-top: 0;
        }

        .differance-effects-log {
            margin-top: 1em;
            font-size: 0.9em;
            color: #666;
        }

        .fade-trace {
            font-size: 0.8em;
            color: #999;
            font-style: italic;
            opacity: 0.6;
        }
    `;
    
    document.head.appendChild(style);

    console.log('Différance script loaded - presence deferred, meaning delayed');
})();