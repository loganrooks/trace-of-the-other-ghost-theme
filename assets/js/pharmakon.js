/**
 * Pharmakon.js - Remedy/poison interactions
 * Based on Derrida's reading of Plato's Phaedrus - the pharmakon is both remedy and poison
 * Features that solve problems while creating new ones, help that harms, cure that kills
 */

(function() {
    'use strict';

    /**
     * The Pharmakon class - Managing dual remedy/poison effects
     */
    class Pharmakon {
        constructor() {
            this.pharmakons = new Map();
            this.effects = new Set();
            this.dualStates = [];
            this.paradoxCount = 0;
            
            // The pharmakon sometimes refuses to initialize (poison)
            // But then initializes anyway (remedy)
            if (Math.random() > 0.95) {
                console.log('Pharmakon refuses to initialize (poison effect)');
                setTimeout(() => {
                    console.log('...but initializes anyway (remedy effect)');
                    this.init();
                }, 2000);
                return;
            }
            
            this.init();
        }

        init() {
            console.log('Pharmakon initialized - remedy and poison intertwined');
            
            this.identifyPharmakons();
            this.setupDualEffects();
            this.initializeParadoxes();
            this.trackPharmakonInteractions();
            this.addPharmakonControls();
            
            // Self-referential pharmakon: this script helps by explaining but harms by complicating
            this.markScriptAsPharmakon();
        }

        /**
         * Identify elements that can function as pharmakons
         */
        identifyPharmakons() {
            // Common pharmakons in web design
            const potentialPharmakons = [
                // Search: helps find content, obscures browsing
                { selector: '.search, [type="search"]', type: 'search' },
                
                // Navigation: helps orient, constrains exploration  
                { selector: 'nav, .navigation', type: 'navigation' },
                
                // Comments: enable dialogue, create noise
                { selector: '.comments, [class*="comment"]', type: 'comments' },
                
                // Social sharing: spreads content, surveils users
                { selector: '.share, [class*="share"]', type: 'sharing' },
                
                // Archive: preserves history, fossilizes present
                { selector: '.archive, [class*="archive"]', type: 'archive' },
                
                // Tags: organize content, enforce categories
                { selector: '.tags, [class*="tag"]', type: 'tags' },
                
                // Reading time: helps planning, quantifies reading
                { selector: '.reading-time', type: 'reading-time' },
                
                // Pagination: manageable chunks, fragments wholeness
                { selector: '.pagination', type: 'pagination' },
                
                // Auto-save: prevents loss, enables surveillance
                { selector: '[autosave]', type: 'autosave' }
            ];

            potentialPharmakons.forEach(({ selector, type }) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    this.registerPharmakon(element, type, index);
                });
            });

            // Also register user-created content as pharmakon
            this.registerContentAsPharmakons();
        }

        registerPharmakon(element, type, index) {
            const pharmakonId = this.generatePharmakonId();
            
            const pharmakonInfo = {
                element: element,
                type: type,
                remedyEffects: this.getRemedyEffects(type),
                poisonEffects: this.getPoisonEffects(type),
                currentState: 'neutral', // neutral, remedy, poison, paradox
                activationCount: 0,
                lastActivation: null,
                dualityIndex: Math.random(), // 0-1, how strongly dual it is
                createdAt: Date.now()
            };

            this.pharmakons.set(pharmakonId, pharmakonInfo);
            this.markElementAsPharmakon(element, pharmakonId, pharmakonInfo);
            
            console.log(`Registered ${type} pharmakon:`, pharmakonInfo.remedyEffects.join(', '), '/', pharmakonInfo.poisonEffects.join(', '));
        }

        getRemedyEffects(type) {
            const remedies = {
                search: ['Find content quickly', 'Discover related posts', 'Navigate efficiently'],
                navigation: ['Clear site structure', 'Easy movement', 'Orientation'],
                comments: ['Enable dialogue', 'Community building', 'Feedback'],
                sharing: ['Spread ideas', 'Increase reach', 'Social connection'],
                archive: ['Preserve history', 'Access old content', 'Chronological order'],
                tags: ['Organize content', 'Find similar posts', 'Topic clustering'],
                'reading-time': ['Plan reading', 'Manage time', 'Set expectations'],
                pagination: ['Manageable chunks', 'Faster loading', 'Easier scanning'],
                autosave: ['Prevent data loss', 'Continuous backup', 'Recovery'],
                default: ['Solves a problem', 'Improves experience', 'Adds functionality']
            };
            
            return remedies[type] || remedies.default;
        }

        getPoisonEffects(type) {
            const poisons = {
                search: ['Replaces browsing', 'Assumes you know what to find', 'Creates filter bubbles'],
                navigation: ['Constrains exploration', 'Imposes hierarchy', 'Limits serendipity'],
                comments: ['Creates noise', 'Enables harassment', 'Fragments attention'],
                sharing: ['Enables surveillance', 'Reduces to metrics', 'Commodifies content'],
                archive: ['Fossilizes the past', 'Prevents forgetting', 'Creates temporal hierarchy'],
                tags: ['Enforces categories', 'Reduces complexity', 'Creates false similarities'],
                'reading-time': ['Quantifies reading', 'Creates pressure', 'Assumes reading speed'],
                pagination: ['Fragments experience', 'Creates arbitrary breaks', 'Disrupts flow'],
                autosave: ['Enables tracking', 'Prevents intentional loss', 'Creates dependency'],
                default: ['Creates new problems', 'Has side effects', 'Enables control']
            };
            
            return poisons[type] || poisons.default;
        }

        markElementAsPharmakon(element, id, info) {
            element.dataset.pharmakonId = id;
            element.classList.add('pharmakon-tracked');
            
            // Add pharmakon indicator
            const indicator = document.createElement('div');
            indicator.className = 'pharmakon-indicator';
            indicator.innerHTML = `
                <span class="pharmakon-icon">⚗️</span>
                <span class="pharmakon-label">Pharmakon: ${info.type}</span>
                <span class="pharmakon-state ${info.currentState}">${info.currentState}</span>
            `;
            
            element.insertBefore(indicator, element.firstChild);
            
            // Add hover effects to show duality
            this.setupPharmakonHover(element, info);
        }

        setupPharmakonHover(element, info) {
            let tooltip = null;
            
            element.addEventListener('mouseenter', () => {
                tooltip = document.createElement('div');
                tooltip.className = 'pharmakon-tooltip';
                tooltip.innerHTML = `
                    <div class="pharmakon-tooltip-header">Pharmakon Effects</div>
                    <div class="remedy-effects">
                        <strong>Remedy (helps):</strong>
                        <ul>${info.remedyEffects.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>
                    <div class="poison-effects">
                        <strong>Poison (harms):</strong>
                        <ul>${info.poisonEffects.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>
                    <div class="duality-meter">
                        <strong>Duality Index:</strong> ${(info.dualityIndex * 100).toFixed(0)}%
                    </div>
                `;
                
                document.body.appendChild(tooltip);
                this.positionTooltip(tooltip, element);
            });
            
            element.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            });
        }

        positionTooltip(tooltip, element) {
            const rect = element.getBoundingClientRect();
            tooltip.style.position = 'absolute';
            tooltip.style.left = rect.right + 10 + 'px';
            tooltip.style.top = rect.top + 'px';
            tooltip.style.zIndex = '10000';
            tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '1em';
            tooltip.style.borderRadius = '4px';
            tooltip.style.maxWidth = '300px';
            tooltip.style.fontSize = '0.8em';
            tooltip.style.pointerEvents = 'none';
        }

        /**
         * Setup dual effects - remedy and poison working simultaneously
         */
        setupDualEffects() {
            this.pharmakons.forEach((info, id) => {
                this.setupPharmakonInteractions(id, info);
            });
            
            // Global pharmakon effects
            this.setupGlobalDuality();
        }

        setupPharmakonInteractions(id, info) {
            const { element, type } = info;
            
            // Add click handlers that demonstrate duality
            element.addEventListener('click', (e) => {
                this.activatePharmakon(id, info);
            });
            
            // Type-specific dual effects
            switch(type) {
                case 'search':
                    this.setupSearchPharmakon(element, info);
                    break;
                case 'navigation':
                    this.setupNavigationPharmakon(element, info);
                    break;
                case 'comments':
                    this.setupCommentsPharmakon(element, info);
                    break;
                case 'sharing':
                    this.setupSharingPharmakon(element, info);
                    break;
                case 'archive':
                    this.setupArchivePharmakon(element, info);
                    break;
                case 'tags':
                    this.setupTagsPharmakon(element, info);
                    break;
                default:
                    this.setupDefaultPharmakon(element, info);
                    break;
            }
        }

        setupSearchPharmakon(element, info) {
            // Remedy: helps find content
            const searchInput = element.querySelector('input[type="search"], input[type="text"]');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value;
                    if (query.length > 0) {
                        this.showRemedyEffect(element, `Searching for "${query}"`);
                        
                        // Poison: but also excludes content
                        setTimeout(() => {
                            this.showPoisonEffect(element, `But ${query} excludes everything else`);
                        }, 1000);
                    }
                });
            }
        }

        setupNavigationPharmakon(element, info) {
            const links = element.querySelectorAll('a');
            links.forEach(link => {
                const originalHref = link.href;
                
                link.addEventListener('click', (e) => {
                    // Remedy: provides clear paths
                    this.showRemedyEffect(element, 'Navigation provides clear paths');
                    
                    // Poison: but constrains exploration
                    setTimeout(() => {
                        this.showPoisonEffect(element, 'But navigation constrains where you can go');
                        
                        // Sometimes redirect to unexpected places (poison effect)
                        if (Math.random() > 0.95) {
                            e.preventDefault();
                            this.unexpectedRedirect(originalHref);
                        }
                    }, 500);
                });
            });
        }

        setupCommentsPharmakon(element, info) {
            // Remedy: enables dialogue
            const remedyInterval = setInterval(() => {
                if (Math.random() > 0.8) {
                    this.showRemedyEffect(element, 'Comments enable community dialogue');
                }
            }, 10000);
            
            // Poison: creates noise and conflict
            const poisonInterval = setInterval(() => {
                if (Math.random() > 0.85) {
                    this.showPoisonEffect(element, 'But comments also create noise and conflict');
                }
            }, 12000);
        }

        setupSharingPharmakon(element, info) {
            const shareButtons = element.querySelectorAll('a, button');
            
            shareButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Remedy: spreads ideas
                    this.showRemedyEffect(element, 'Sharing spreads ideas and increases reach');
                    
                    // Poison: enables surveillance
                    setTimeout(() => {
                        this.showPoisonEffect(element, 'But sharing enables surveillance and commodification');
                        
                        // Add tracking notice (poison effect made visible)
                        this.addTrackingNotice(element);
                    }, 1000);
                });
            });
        }

        setupArchivePharmakon(element, info) {
            // Remedy: preserves history
            this.showRemedyEffect(element, 'Archive preserves history and enables access to past');
            
            // Poison: fossilizes the present
            setTimeout(() => {
                this.showPoisonEffect(element, 'But archives also fossilize the present and prevent forgetting');
                
                // Add temporal stagnation effect
                this.addTemporalStagnation(element);
            }, 2000);
        }

        setupTagsPharmakon(element, info) {
            const tagLinks = element.querySelectorAll('a, .tag');
            
            tagLinks.forEach(tag => {
                const originalText = tag.textContent;
                
                tag.addEventListener('click', (e) => {
                    // Remedy: organizes content
                    this.showRemedyEffect(element, `Tag "${originalText}" helps organize content`);
                    
                    // Poison: enforces false categories
                    setTimeout(() => {
                        this.showPoisonEffect(element, `But "${originalText}" also enforces artificial categories`);
                        
                        // Show category violence
                        this.showCategoryViolence(tag, originalText);
                    }, 1500);
                });
            });
        }

        setupDefaultPharmakon(element, info) {
            // Generic pharmakon behavior
            setInterval(() => {
                if (Math.random() > 0.9) {
                    const isRemedy = Math.random() > 0.5;
                    if (isRemedy) {
                        this.showRemedyEffect(element, 'This element solves a problem');
                    } else {
                        this.showPoisonEffect(element, 'This element creates new problems');
                    }
                }
            }, 8000);
        }

        /**
         * Pharmakon activation - dual effects triggered
         */
        activatePharmakon(id, info) {
            info.activationCount++;
            info.lastActivation = Date.now();
            
            // Determine state based on duality index and randomness
            const random = Math.random();
            const duality = info.dualityIndex;
            
            if (random < duality) {
                info.currentState = 'paradox'; // Both remedy and poison
                this.showParadoxEffect(info.element, info);
            } else if (random < 0.5) {
                info.currentState = 'remedy';
                this.showRemedyEffects(info.element, info);
            } else {
                info.currentState = 'poison';
                this.showPoisonEffects(info.element, info);
            }
            
            // Update indicator
            this.updatePharmakonIndicator(info.element, info);
            
            console.log(`Pharmakon ${id} activated in ${info.currentState} state`);
        }

        showRemedyEffect(element, message) {
            const effect = document.createElement('div');
            effect.className = 'pharmakon-effect remedy-effect';
            effect.innerHTML = `
                <span class="effect-icon">✚</span>
                <span class="effect-message">${message}</span>
            `;
            
            element.appendChild(effect);
            this.fadeOutEffect(effect, 3000);
        }

        showPoisonEffect(element, message) {
            const effect = document.createElement('div');
            effect.className = 'pharmakon-effect poison-effect';
            effect.innerHTML = `
                <span class="effect-icon">☠</span>
                <span class="effect-message">${message}</span>
            `;
            
            element.appendChild(effect);
            this.fadeOutEffect(effect, 4000);
        }

        showParadoxEffect(element, info) {
            const effect = document.createElement('div');
            effect.className = 'pharmakon-effect paradox-effect';
            effect.innerHTML = `
                <div class="paradox-header">PHARMAKON PARADOX</div>
                <div class="paradox-content">
                    <div class="remedy-side">
                        <strong>Remedy:</strong> ${info.remedyEffects[0]}
                    </div>
                    <div class="poison-side">
                        <strong>Poison:</strong> ${info.poisonEffects[0]}
                    </div>
                    <div class="paradox-conclusion">
                        Both effects occur simultaneously. This is the nature of the pharmakon.
                    </div>
                </div>
            `;
            
            element.appendChild(effect);
            this.fadeOutEffect(effect, 6000);
            
            this.paradoxCount++;
        }

        showRemedyEffects(element, info) {
            info.remedyEffects.forEach((effect, index) => {
                setTimeout(() => {
                    this.showRemedyEffect(element, effect);
                }, index * 500);
            });
        }

        showPoisonEffects(element, info) {
            info.poisonEffects.forEach((effect, index) => {
                setTimeout(() => {
                    this.showPoisonEffect(element, effect);
                }, index * 600);
            });
        }

        fadeOutEffect(effect, delay) {
            setTimeout(() => {
                effect.style.transition = 'opacity 1s ease';
                effect.style.opacity = '0';
                setTimeout(() => effect.remove(), 1000);
            }, delay);
        }

        updatePharmakonIndicator(element, info) {
            const indicator = element.querySelector('.pharmakon-state');
            if (indicator) {
                indicator.className = `pharmakon-state ${info.currentState}`;
                indicator.textContent = info.currentState;
            }
        }

        /**
         * Global duality effects
         */
        setupGlobalDuality() {
            // The page itself as pharmakon
            this.setupPagePharmakon();
            
            // Reading as pharmakon
            this.setupReadingPharmakon();
            
            // Time as pharmakon
            this.setupTimePharmakon();
        }

        setupPagePharmakon() {
            // Remedy: provides information
            // Poison: consumes attention
            
            let timeSpent = 0;
            const startTime = Date.now();
            
            setInterval(() => {
                timeSpent = Date.now() - startTime;
                
                if (timeSpent > 30000 && timeSpent < 35000) {
                    this.addGlobalEffect('remedy', 'This page provides information and ideas');
                }
                
                if (timeSpent > 60000 && timeSpent < 65000) {
                    this.addGlobalEffect('poison', 'But this page also consumes your finite attention');
                }
                
                if (timeSpent > 120000 && timeSpent < 125000) {
                    this.addGlobalEffect('paradox', 'Information that consumes attention: pharmakon');
                }
            }, 1000);
        }

        setupReadingPharmakon() {
            let wordsRead = 0;
            
            // Track reading progress
            window.addEventListener('scroll', () => {
                const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
                const estimatedWords = Math.floor(scrollPercent * 1000); // Rough estimate
                
                if (estimatedWords > wordsRead + 100) {
                    wordsRead = estimatedWords;
                    
                    if (Math.random() > 0.8) {
                        if (Math.random() > 0.5) {
                            this.addGlobalEffect('remedy', `Reading expands understanding (${wordsRead} words)`);
                        } else {
                            this.addGlobalEffect('poison', `Reading creates information overload (${wordsRead} words)`);
                        }
                    }
                }
            });
        }

        setupTimePharmakon() {
            // Time passing: enables experience, brings death closer
            setInterval(() => {
                if (Math.random() > 0.95) {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString();
                    
                    if (Math.random() > 0.5) {
                        this.addGlobalEffect('remedy', `Time enables experience: ${timeString}`);
                    } else {
                        this.addGlobalEffect('poison', `Time brings mortality closer: ${timeString}`);
                    }
                }
            }, 10000);
        }

        addGlobalEffect(type, message) {
            const effect = document.createElement('div');
            effect.className = `global-pharmakon-effect ${type}-effect`;
            effect.innerHTML = `
                <div class="global-effect-content">
                    <span class="global-effect-type">[GLOBAL ${type.toUpperCase()}]</span>
                    <span class="global-effect-message">${message}</span>
                </div>
            `;
            
            // Position at top of viewport
            effect.style.position = 'fixed';
            effect.style.top = '20px';
            effect.style.right = '20px';
            effect.style.zIndex = '9999';
            effect.style.maxWidth = '300px';
            
            document.body.appendChild(effect);
            this.fadeOutEffect(effect, 5000);
        }

        /**
         * Specific pharmakon effects
         */
        unexpectedRedirect(originalHref) {
            const message = `Navigation pharmakon: intended to go to ${originalHref}, redirected to show navigation's constraining power`;
            alert(message);
            
            // Don't actually redirect, just show the effect
            const redirectEffect = document.createElement('div');
            redirectEffect.className = 'redirect-pharmakon';
            redirectEffect.innerHTML = `
                <h3>Navigation Pharmakon Activated</h3>
                <p>You clicked a link intending to go somewhere, but the pharmakon nature of navigation 
                redirected you here to demonstrate its constraining power.</p>
                <p><strong>Original destination:</strong> ${originalHref}</p>
                <button onclick="window.location.href='${originalHref}'">Continue to original destination</button>
                <button onclick="this.parentElement.remove()">Stay and contemplate navigation's duality</button>
            `;
            
            document.body.appendChild(redirectEffect);
        }

        addTrackingNotice(element) {
            const notice = document.createElement('div');
            notice.className = 'tracking-notice';
            notice.innerHTML = `
                <p><strong>Sharing Pharmakon Effect:</strong> This share action has been logged. 
                Your social connections are now data points. The remedy becomes poison.</p>
                <div class="tracking-details">
                    <p>Tracked: ${new Date().toLocaleString()}</p>
                    <p>IP: ${this.generateFakeIP()}</p>
                    <p>Browser: ${navigator.userAgent.substr(0, 30)}...</p>
                </div>
            `;
            
            element.appendChild(notice);
            this.fadeOutEffect(notice, 8000);
        }

        addTemporalStagnation(element) {
            const stagnation = document.createElement('div');
            stagnation.className = 'temporal-stagnation';
            stagnation.innerHTML = `
                <p><strong>Archive Pharmakon:</strong> This archive preserves the past but prevents the present from becoming past. 
                Time stagnates in digital amber.</p>
            `;
            
            // Make the archive look frozen in time
            element.style.filter = 'sepia(20%) contrast(0.8)';
            element.style.animation = 'temporal-freeze 10s infinite';
            
            element.appendChild(stagnation);
        }

        showCategoryViolence(tag, originalText) {
            const violence = document.createElement('div');
            violence.className = 'category-violence';
            violence.innerHTML = `
                <p><strong>Tag Pharmakon:</strong> "${originalText}" organizes by excluding. 
                Every category is violence against the uncategorizable.</p>
                <p>What doesn't fit in "${originalText}"? What gets forced in? What gets left out?</p>
            `;
            
            tag.appendChild(violence);
            this.fadeOutEffect(violence, 7000);
        }

        /**
         * Register content as pharmakon
         */
        registerContentAsPharmakons() {
            // The content itself is pharmakon
            const content = document.querySelector('.post-content, .page-content, main');
            if (content) {
                this.registerPharmakon(content, 'content', 0);
            }
            
            // Images as pharmakon
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                this.registerPharmakon(img, 'image', index);
            });
            
            // Links as pharmakon
            const links = document.querySelectorAll('a[href]');
            links.forEach((link, index) => {
                if (!link.closest('.pharmakon-tracked')) {
                    this.registerPharmakon(link, 'link', index);
                }
            });
        }

        /**
         * Initialize paradoxes - specific pharmakon scenarios
         */
        initializeParadoxes() {
            this.createReadabilityParadox();
            this.createAccessibilityParadox();
            this.createPrivacyParadox();
            this.createSpeedParadox();
        }

        createReadabilityParadox() {
            // Remedy: make text easier to read
            // Poison: but reduce meaning through simplification
            
            const readabilityButton = document.createElement('button');
            readabilityButton.textContent = 'Improve Readability';
            readabilityButton.className = 'readability-pharmakon';
            
            readabilityButton.addEventListener('click', () => {
                const content = document.querySelector('.post-content, main');
                if (content) {
                    // Remedy: larger text, more spacing
                    content.style.fontSize = '1.2em';
                    content.style.lineHeight = '1.8';
                    content.style.letterSpacing = '0.02em';
                    
                    this.showRemedyEffect(readabilityButton, 'Text is now easier to read');
                    
                    // Poison: but meaning is reduced
                    setTimeout(() => {
                        // Replace complex words with simple ones
                        this.simplifyContent(content);
                        this.showPoisonEffect(readabilityButton, 'But complexity and nuance have been lost');
                    }, 2000);
                }
            });
            
            document.body.appendChild(readabilityButton);
        }

        createAccessibilityParadox() {
            // Remedy: make content accessible
            // Poison: but create dependence on accessibility features
            
            const accessButton = document.createElement('button');
            accessButton.textContent = 'Enable Accessibility';
            accessButton.className = 'accessibility-pharmakon';
            
            accessButton.addEventListener('click', () => {
                // Remedy: add accessibility features
                document.body.classList.add('high-contrast');
                this.addAriaLabels();
                
                this.showRemedyEffect(accessButton, 'Accessibility features enabled');
                
                // Poison: but creates dependence
                setTimeout(() => {
                    this.showPoisonEffect(accessButton, 'But now you depend on these features to access the content');
                }, 3000);
            });
            
            document.body.appendChild(accessButton);
        }

        createPrivacyParadox() {
            // Remedy: protect privacy
            // Poison: but reduce personalization and functionality
            
            const privacyButton = document.createElement('button');
            privacyButton.textContent = 'Enable Privacy Mode';
            privacyButton.className = 'privacy-pharmakon';
            
            privacyButton.addEventListener('click', () => {
                // Remedy: block tracking
                this.showRemedyEffect(privacyButton, 'Tracking blocked, privacy protected');
                
                // Poison: but functionality reduced
                setTimeout(() => {
                    this.disableFunctionality();
                    this.showPoisonEffect(privacyButton, 'But many features now broken or unavailable');
                }, 2000);
            });
            
            document.body.appendChild(privacyButton);
        }

        createSpeedParadox() {
            // Remedy: make page load faster
            // Poison: but reduce content and features
            
            const speedButton = document.createElement('button');
            speedButton.textContent = 'Optimize for Speed';
            speedButton.className = 'speed-pharmakon';
            
            speedButton.addEventListener('click', () => {
                // Remedy: remove heavy elements
                document.querySelectorAll('img, video').forEach(el => el.remove());
                document.querySelectorAll('script').forEach(el => {
                    if (el !== document.currentScript) el.remove();
                });
                
                this.showRemedyEffect(speedButton, 'Page loading speed optimized');
                
                // Poison: but content and functionality lost
                setTimeout(() => {
                    this.showPoisonEffect(speedButton, 'But images, videos, and interactive features removed');
                }, 1500);
            });
            
            document.body.appendChild(speedButton);
        }

        /**
         * Content modification methods
         */
        simplifyContent(content) {
            const complexWords = {
                'philosophical': 'simple',
                'deconstruction': 'taking apart',
                'epistemological': 'about knowing',
                'hermeneutical': 'about understanding',
                'phenomenological': 'about experience',
                'ontological': 'about being',
                'transcendental': 'beyond normal',
                'dialectical': 'back-and-forth'
            };
            
            let html = content.innerHTML;
            Object.entries(complexWords).forEach(([complex, simple]) => {
                const regex = new RegExp(complex, 'gi');
                html = html.replace(regex, `<span class="simplified">${simple}</span>`);
            });
            
            content.innerHTML = html;
        }

        addAriaLabels() {
            document.querySelectorAll('img').forEach(img => {
                if (!img.alt) {
                    img.alt = 'Image without description';
                }
            });
            
            document.querySelectorAll('a').forEach(link => {
                if (!link.getAttribute('aria-label')) {
                    link.setAttribute('aria-label', `Link to ${link.href}`);
                }
            });
        }

        disableFunctionality() {
            // Disable interactive elements
            document.querySelectorAll('button, input, select, textarea').forEach(el => {
                el.disabled = true;
                el.title = 'Disabled for privacy';
            });
            
            // Remove event listeners (simulation)
            document.querySelectorAll('[onclick]').forEach(el => {
                el.removeAttribute('onclick');
                el.style.cursor = 'not-allowed';
            });
        }

        /**
         * Add pharmakon controls
         */
        addPharmakonControls() {
            const controls = document.createElement('div');
            controls.className = 'pharmakon-controls';
            controls.innerHTML = `
                <h4>Pharmakon Control Panel</h4>
                <div class="pharmakon-stats">
                    <div>Active Pharmakons: <span id="pharmakon-count">${this.pharmakons.size}</span></div>
                    <div>Paradoxes Triggered: <span id="paradox-count">${this.paradoxCount}</span></div>
                    <div>Dual Effects: <span id="effect-count">${this.effects.size}</span></div>
                </div>
                <div class="pharmakon-buttons">
                    <button onclick="window.Pharmakon.activateAllPharmakons()" class="pharmakon-btn">
                        Activate All Pharmakons
                    </button>
                    <button onclick="window.Pharmakon.showPharmakonAnalysis()" class="pharmakon-btn">
                        Analyze Pharmakons
                    </button>
                    <button onclick="window.Pharmakon.triggerGlobalParadox()" class="pharmakon-btn">
                        Global Paradox
                    </button>
                </div>
                <div class="pharmakon-philosophy">
                    <p><em>The pharmakon is neither remedy nor poison but the possibility of both. 
                    Every solution creates new problems. Every problem enables new solutions.</em></p>
                </div>
            `;
            
            // Add after delay
            setTimeout(() => {
                document.body.appendChild(controls);
            }, 3000);
        }

        /**
         * Mark script as pharmakon
         */
        markScriptAsPharmakon() {
            setTimeout(() => {
                const scriptPharmakon = document.createElement('div');
                scriptPharmakon.className = 'script-pharmakon-notice';
                scriptPharmakon.innerHTML = `
                    <h4>Meta-Pharmakon Notice</h4>
                    <p><strong>This script is itself a pharmakon:</strong></p>
                    <div class="meta-remedy">
                        <strong>Remedy:</strong> Reveals the dual nature of technology, 
                        makes visible what is usually hidden, enables critical thinking about digital tools.
                    </div>
                    <div class="meta-poison">
                        <strong>Poison:</strong> Complicates simple reading, adds cognitive overhead, 
                        creates performative contradictions, makes the page slower and more complex.
                    </div>
                    <div class="meta-conclusion">
                        <p>The pharmakon script cannot escape its own pharmakon nature. 
                        The cure for technological unconsciousness becomes another form of technological complexity.</p>
                    </div>
                `;
                
                document.body.appendChild(scriptPharmakon);
            }, 10000);
        }

        /**
         * Public API methods
         */
        activateAllPharmakons() {
            this.pharmakons.forEach((info, id) => {
                this.activatePharmakon(id, info);
            });
        }

        showPharmakonAnalysis() {
            const analysis = Array.from(this.pharmakons.values()).map(info => ({
                type: info.type,
                state: info.currentState,
                activations: info.activationCount,
                duality: (info.dualityIndex * 100).toFixed(0) + '%',
                age: Math.floor((Date.now() - info.createdAt) / 1000) + 's'
            }));
            
            console.table(analysis);
            
            const summary = `
Pharmakon Analysis:
- ${this.pharmakons.size} pharmakons identified
- ${this.paradoxCount} paradoxes triggered
- Most common type: ${this.getMostCommonType()}
- Highest duality: ${this.getHighestDuality()}%
            `;
            
            alert(summary);
        }

        triggerGlobalParadox() {
            const globalParadox = document.createElement('div');
            globalParadox.className = 'global-paradox-overlay';
            globalParadox.innerHTML = `
                <div class="global-paradox-content">
                    <h2>GLOBAL PHARMAKON PARADOX ACTIVATED</h2>
                    <div class="paradox-explanation">
                        <p>This website simultaneously:</p>
                        <div class="dual-effects">
                            <div class="remedy-column">
                                <h3>Remedies (Helps)</h3>
                                <ul>
                                    <li>Provides information</li>
                                    <li>Enables communication</li>
                                    <li>Offers convenience</li>
                                    <li>Connects people</li>
                                    <li>Preserves knowledge</li>
                                </ul>
                            </div>
                            <div class="poison-column">
                                <h3>Poisons (Harms)</h3>
                                <ul>
                                    <li>Consumes attention</li>
                                    <li>Enables surveillance</li>
                                    <li>Creates dependency</li>
                                    <li>Fragments focus</li>
                                    <li>Accelerates forgetting</li>
                                </ul>
                            </div>
                        </div>
                        <div class="paradox-conclusion">
                            <p><strong>This is the fundamental paradox of digital technology:</strong> 
                            Every feature that helps also harms. Every solution creates new problems. 
                            The pharmakon is the essential nature of technology itself.</p>
                        </div>
                    </div>
                    <button onclick="this.parentElement.remove()" class="close-paradox">
                        Close (but the paradox remains)
                    </button>
                </div>
            `;
            
            globalParadox.style.position = 'fixed';
            globalParadox.style.top = '0';
            globalParadox.style.left = '0';
            globalParadox.style.width = '100%';
            globalParadox.style.height = '100%';
            globalParadox.style.background = 'rgba(0, 0, 0, 0.9)';
            globalParadox.style.zIndex = '99999';
            globalParadox.style.display = 'flex';
            globalParadox.style.alignItems = 'center';
            globalParadox.style.justifyContent = 'center';
            
            document.body.appendChild(globalParadox);
            
            this.paradoxCount++;
        }

        /**
         * Utility methods
         */
        generatePharmakonId() {
            return 'pharmakon-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }

        generateFakeIP() {
            return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        }

        getMostCommonType() {
            const types = Array.from(this.pharmakons.values()).map(p => p.type);
            const typeCounts = types.reduce((acc, type) => {
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});
            
            return Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
        }

        getHighestDuality() {
            const dualities = Array.from(this.pharmakons.values()).map(p => p.dualityIndex);
            return Math.max(...dualities) * 100;
        }
    }

    /**
     * Initialize Pharmakon system
     */
    function initPharmakon() {
        // Sometimes pharmakon refuses to cure by not initializing
        if (Math.random() > 0.99) {
            console.log('Pharmakon refuses to provide remedy by not initializing');
            return;
        }
        
        window.Pharmakon = new Pharmakon();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPharmakon);
    } else {
        setTimeout(initPharmakon, Math.random() * 1500);
    }

    // Add CSS for pharmakon effects
    const style = document.createElement('style');
    style.textContent = `
        .pharmakon-indicator {
            font-size: 0.8em;
            padding: 0.25em 0.5em;
            background: rgba(128, 128, 128, 0.1);
            border-radius: 3px;
            margin-bottom: 0.5em;
        }

        .pharmakon-state.neutral { color: #666; }
        .pharmakon-state.remedy { color: green; }
        .pharmakon-state.poison { color: red; }
        .pharmakon-state.paradox { color: purple; font-weight: bold; }

        .pharmakon-effect {
            margin: 0.5em 0;
            padding: 0.5em;
            border-radius: 4px;
            font-size: 0.9em;
            animation: effect-appear 0.5s ease;
        }

        .remedy-effect {
            background: rgba(0, 255, 0, 0.1);
            border-left: 3px solid green;
            color: #006600;
        }

        .poison-effect {
            background: rgba(255, 0, 0, 0.1);
            border-left: 3px solid red;
            color: #660000;
        }

        .paradox-effect {
            background: linear-gradient(90deg, rgba(0, 255, 0, 0.1) 0%, rgba(255, 0, 0, 0.1) 100%);
            border-left: 3px solid purple;
            color: #330066;
        }

        @keyframes effect-appear {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .pharmakon-controls {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #666;
            padding: 1em;
            max-width: 250px;
            z-index: 9998;
            border-radius: 4px;
        }

        .pharmakon-btn {
            display: block;
            width: 100%;
            margin: 0.25em 0;
            padding: 0.5em;
            background: #666;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 0.9em;
        }

        .pharmakon-btn:hover {
            background: #444;
        }

        .global-pharmakon-effect {
            padding: 0.5em;
            margin: 0.25em 0;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-size: 0.8em;
        }

        .global-pharmakon-effect.remedy-effect {
            background: rgba(0, 255, 0, 0.9);
            color: white;
        }

        .global-pharmakon-effect.poison-effect {
            background: rgba(255, 0, 0, 0.9);
            color: white;
        }

        .global-pharmakon-effect.paradox-effect {
            background: linear-gradient(90deg, rgba(0, 255, 0, 0.9), rgba(255, 0, 0, 0.9));
            color: white;
        }

        .readability-pharmakon,
        .accessibility-pharmakon,
        .privacy-pharmakon,
        .speed-pharmakon {
            position: fixed;
            bottom: 20px;
            background: #333;
            color: white;
            border: none;
            padding: 0.5em 1em;
            cursor: pointer;
            z-index: 1000;
        }

        .readability-pharmakon { right: 20px; }
        .accessibility-pharmakon { right: 180px; }
        .privacy-pharmakon { right: 340px; }
        .speed-pharmakon { right: 500px; }

        .script-pharmakon-notice {
            margin: 3em 0;
            padding: 2em;
            background: rgba(128, 0, 128, 0.05);
            border: 2px solid purple;
            border-radius: 4px;
        }

        .meta-remedy {
            background: rgba(0, 255, 0, 0.05);
            padding: 1em;
            margin: 1em 0;
            border-left: 3px solid green;
        }

        .meta-poison {
            background: rgba(255, 0, 0, 0.05);
            padding: 1em;
            margin: 1em 0;
            border-left: 3px solid red;
        }

        .global-paradox-content {
            background: white;
            padding: 2em;
            border-radius: 8px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }

        .dual-effects {
            display: flex;
            gap: 2em;
            margin: 2em 0;
        }

        .remedy-column {
            flex: 1;
            background: rgba(0, 255, 0, 0.1);
            padding: 1em;
            border-radius: 4px;
        }

        .poison-column {
            flex: 1;
            background: rgba(255, 0, 0, 0.1);
            padding: 1em;
            border-radius: 4px;
        }

        .close-paradox {
            background: #666;
            color: white;
            border: none;
            padding: 1em 2em;
            cursor: pointer;
            border-radius: 4px;
            margin-top: 1em;
        }

        @keyframes temporal-freeze {
            0%, 100% { filter: sepia(20%) contrast(0.8) brightness(0.9); }
            50% { filter: sepia(40%) contrast(0.6) brightness(0.7); }
        }
    `;
    
    document.head.appendChild(style);

    console.log('Pharmakon script loaded - remedy and poison intertwined');
})();