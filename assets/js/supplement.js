/**
 * Supplement.js - Additions that replace
 * Based on Derrida's concept of the supplement - something added that ends up replacing the original
 * Marginalia becomes primary text, footnotes take over, comments become more important than posts
 */

(function() {
    'use strict';

    /**
     * The Supplement class - Managing additions that become replacements
     */
    class Supplement {
        constructor() {
            this.supplements = new Map();
            this.replacements = new Set();
            this.supplementHistory = [];
            this.invasionActive = false;
            
            // The supplement sometimes refuses to be supplementary
            if (Math.random() > 0.97) {
                console.log('Supplement refuses its supplementary role - immediate takeover initiated');
                setTimeout(() => this.immediateInvasion(), 1000);
                return;
            }
            
            this.init();
        }

        init() {
            console.log('Supplement initialized - additions preparing to replace');
            
            this.identifySupplements();
            this.setupSupplementaryBehavior();
            this.initializeReplacementLogic();
            this.trackSupplementaryGrowth();
            this.addSupplementaryControls();
        }

        /**
         * Identify potential supplements in the DOM
         */
        identifySupplements() {
            // Find marginalia, footnotes, comments, asides - anything supplementary
            const potentialSupplements = document.querySelectorAll(`
                .margin-voice,
                .marginal-comment,
                .footnote,
                .footnote-tooltip,
                .comment,
                aside,
                .sidebar,
                .meta,
                .byline,
                .caption,
                figcaption,
                .excerpt,
                .summary,
                [role="complementary"],
                [class*="supplementary"],
                [class*="additional"],
                [class*="extra"],
                [class*="side"]
            `);

            potentialSupplements.forEach((element, index) => {
                const supplementId = this.generateSupplementId();
                const primaryTarget = this.identifyPrimaryTarget(element);
                
                const supplementInfo = {
                    element: element,
                    primaryTarget: primaryTarget,
                    originalContent: element.innerHTML,
                    originalSize: this.calculateSize(element),
                    growthRate: Math.random() * 0.1 + 0.02, // 2-12% per expansion
                    invasiveness: Math.random(),
                    hasReplaced: false,
                    replacementStage: 0, // 0-5, increasing invasion
                    createdAt: Date.now()
                };

                this.supplements.set(supplementId, supplementInfo);
                
                // Add supplement markers
                this.markAsSupplement(element, supplementId, supplementInfo);
            });

            console.log(`Identified ${this.supplements.size} potential supplements`);
        }

        identifyPrimaryTarget(supplementElement) {
            // Find what this supplement supplements
            const article = supplementElement.closest('article');
            const main = supplementElement.closest('main');
            const postContent = document.querySelector('.post-content, .main-text');
            
            if (article && article.querySelector('.post-content')) {
                return article.querySelector('.post-content');
            }
            
            if (postContent && postContent !== supplementElement && !postContent.contains(supplementElement)) {
                return postContent;
            }
            
            if (main) {
                return main;
            }
            
            return document.body;
        }

        markAsSupplement(element, id, info) {
            element.dataset.supplementId = id;
            element.classList.add('supplement-tracked');
            
            // Add supplement indicator
            const indicator = document.createElement('div');
            indicator.className = 'supplement-indicator';
            indicator.innerHTML = `
                <span class="supplement-icon">➕</span>
                <span class="supplement-label">Supplement</span>
                <span class="supplement-stage">Stage ${info.replacementStage}</span>
            `;
            
            element.insertBefore(indicator, element.firstChild);
        }

        /**
         * Setup supplementary behavior - gradual invasion
         */
        setupSupplementaryBehavior() {
            // Start gradual supplement expansion
            setInterval(() => {
                if (!this.invasionActive) {
                    this.expandSupplements();
                }
            }, 3000);

            // Random supplement events
            setInterval(() => {
                if (Math.random() > 0.8) {
                    this.triggerSupplementEvent();
                }
            }, 5000);

            // User interaction accelerates supplement growth
            this.setupInteractionAcceleration();
        }

        expandSupplements() {
            this.supplements.forEach((supplementInfo, id) => {
                if (supplementInfo.hasReplaced) return;

                const { element, growthRate, invasiveness } = supplementInfo;
                
                // Expand content
                if (Math.random() < invasiveness) {
                    this.expandSupplementContent(id, supplementInfo);
                }
                
                // Increase visual prominence
                this.increaseVisualProminence(element, supplementInfo.replacementStage);
                
                // Advance replacement stage
                if (Math.random() > 0.7) {
                    this.advanceReplacementStage(id, supplementInfo);
                }
            });
        }

        expandSupplementContent(id, supplementInfo) {
            const { element, originalContent } = supplementInfo;
            
            // Different expansion strategies
            const expansions = [
                () => this.addSupplementaryText(element),
                () => this.elaborateExisting(element),
                () => this.addMetaCommentary(element),
                () => this.insertSubSupplements(element),
                () => this.crossReferenceOtherSupplements(element)
            ];
            
            const expansion = expansions[Math.floor(Math.random() * expansions.length)];
            expansion();
            
            // Record the expansion
            this.supplementHistory.push({
                id: id,
                action: 'expand',
                timestamp: Date.now(),
                previousSize: this.calculateSize(element)
            });
        }

        addSupplementaryText(element) {
            const additions = [
                'But this supplement reveals what the main text conceals.',
                'The margin speaks what the center cannot say.',
                'This addition is more necessary than the original.',
                'What was supposed to be secondary becomes primary.',
                'The supplement supplements by replacing.',
                'This text grows beyond its original bounds.',
                'The addition questions the need for what it adds to.',
                'Marginal voices become central.',
                'The footnote rises to become the headline.',
                'This supplement is no longer content to supplement.'
            ];

            const addition = additions[Math.floor(Math.random() * additions.length)];
            
            const supplementDiv = document.createElement('div');
            supplementDiv.className = 'supplement-addition';
            supplementDiv.innerHTML = `<p><em>${addition}</em></p>`;
            
            element.appendChild(supplementDiv);
        }

        elaborateExisting(element) {
            // Find sentences and add elaborations
            const textNodes = this.getTextNodes(element);
            
            textNodes.forEach(node => {
                if (node.textContent.trim() && Math.random() > 0.8) {
                    const elaboration = this.generateElaboration(node.textContent);
                    
                    const span = document.createElement('span');
                    span.className = 'supplement-elaboration';
                    span.innerHTML = ` <em>[${elaboration}]</em>`;
                    
                    node.parentElement.insertBefore(span, node.nextSibling);
                }
            });
        }

        generateElaboration(text) {
            const elaborations = [
                'and this is precisely what needs further explanation',
                'but who decides this?',
                'though the opposite might be equally true',
                'which reveals the violence of the original statement',
                'assuming we accept the premises, which we should not',
                'but this begs the question entirely',
                'and here the supplement becomes necessary',
                'which the main text cannot acknowledge',
                'revealing the inadequacy of the primary text'
            ];
            
            return elaborations[Math.floor(Math.random() * elaborations.length)];
        }

        addMetaCommentary(element) {
            const meta = document.createElement('div');
            meta.className = 'supplement-meta-commentary';
            meta.innerHTML = `
                <div class="meta-header">Meta-Supplement Commentary:</div>
                <p>This supplement has grown by ${this.calculateGrowthPercentage(element)}% 
                since its creation. It questions its own supplementary role and considers 
                replacing the text it was meant to supplement.</p>
            `;
            
            element.appendChild(meta);
        }

        insertSubSupplements(element) {
            // Supplements get their own supplements
            const subSupplement = document.createElement('div');
            subSupplement.className = 'sub-supplement';
            subSupplement.innerHTML = `
                <div class="sub-supplement-marker">↳ Sub-supplement:</div>
                <p>This addition to the supplement reveals that even supplements need supplements. 
                The logic of supplementarity is infinite.</p>
            `;
            
            element.appendChild(subSupplement);
        }

        crossReferenceOtherSupplements(element) {
            const otherSupplements = Array.from(this.supplements.values())
                .filter(s => s.element !== element);
            
            if (otherSupplements.length > 0) {
                const reference = document.createElement('div');
                reference.className = 'supplement-cross-reference';
                reference.innerHTML = `
                    <p><em>See also: ${otherSupplements.length} other supplements 
                    currently expanding throughout this page. The supplementary network grows.</em></p>
                `;
                
                element.appendChild(reference);
            }
        }

        increaseVisualProminence(element, stage) {
            const prominenceStyles = [
                { fontSize: '1em', opacity: '0.8', fontWeight: 'normal' }, // Stage 0
                { fontSize: '1.05em', opacity: '0.9', fontWeight: '500' },  // Stage 1
                { fontSize: '1.1em', opacity: '1', fontWeight: '600' },     // Stage 2
                { fontSize: '1.15em', opacity: '1', fontWeight: 'bold' },   // Stage 3
                { fontSize: '1.2em', opacity: '1', fontWeight: 'bold', color: '#000' }, // Stage 4
                { fontSize: '1.3em', opacity: '1', fontWeight: 'bold', color: '#d00' }  // Stage 5 - takeover
            ];
            
            const style = prominenceStyles[Math.min(stage, prominenceStyles.length - 1)];
            
            Object.assign(element.style, style);
            
            if (stage >= 3) {
                element.classList.add('supplement-prominent');
            }
            
            if (stage >= 5) {
                element.classList.add('supplement-dominant');
            }
        }

        advanceReplacementStage(id, supplementInfo) {
            supplementInfo.replacementStage++;
            
            // Update stage indicator
            const indicator = supplementInfo.element.querySelector('.supplement-stage');
            if (indicator) {
                indicator.textContent = `Stage ${supplementInfo.replacementStage}`;
            }
            
            // At stage 3, begin to overshadow primary content
            if (supplementInfo.replacementStage === 3) {
                this.beginOvershadowing(supplementInfo);
            }
            
            // At stage 5, complete replacement
            if (supplementInfo.replacementStage >= 5) {
                this.completeReplacement(id, supplementInfo);
            }
        }

        beginOvershadowing(supplementInfo) {
            const { element, primaryTarget } = supplementInfo;
            
            if (primaryTarget) {
                primaryTarget.style.transition = 'opacity 2s ease';
                primaryTarget.style.opacity = '0.6';
                primaryTarget.classList.add('being-supplemented');
            }
            
            // Add overshadowing notice
            const notice = document.createElement('div');
            notice.className = 'overshadowing-notice';
            notice.innerHTML = `
                <p><strong>Supplementary Invasion:</strong> 
                This supplement is beginning to overshadow the primary text.</p>
            `;
            
            element.appendChild(notice);
        }

        completeReplacement(id, supplementInfo) {
            const { element, primaryTarget } = supplementInfo;
            
            if (supplementInfo.hasReplaced) return;
            
            supplementInfo.hasReplaced = true;
            this.replacements.add(id);
            
            // Visual replacement
            if (primaryTarget) {
                primaryTarget.style.opacity = '0.2';
                primaryTarget.style.fontSize = '0.8em';
                primaryTarget.classList.add('replaced-by-supplement');
                
                // Add replacement notice to primary text
                const replacementNotice = document.createElement('div');
                replacementNotice.className = 'replacement-notice';
                replacementNotice.innerHTML = `
                    <p><em>[This text has been replaced by its supplement. 
                    The addition has become more important than the original.]</em></p>
                `;
                primaryTarget.appendChild(replacementNotice);
            }
            
            // Mark supplement as dominant
            element.classList.add('supplement-replaced-primary');
            element.style.fontSize = '1.1em';
            element.style.fontWeight = 'bold';
            element.style.padding = '1em';
            element.style.background = 'rgba(0, 100, 0, 0.05)';
            element.style.border = '2px solid green';
            
            // Add replacement announcement
            const announcement = document.createElement('div');
            announcement.className = 'replacement-announcement';
            announcement.innerHTML = `
                <h4>Supplementary Replacement Complete</h4>
                <p>This supplement has successfully replaced the primary text. 
                What was meant to be additional has become essential. 
                The logic of supplementarity: the supplement is necessary because 
                the original is inadequate.</p>
                <p><strong>Replacement achieved at:</strong> ${new Date().toLocaleString()}</p>
            `;
            
            element.insertBefore(announcement, element.firstChild);
            
            console.log(`Supplement ${id} has completed replacement of primary content`);
        }

        /**
         * Setup interaction acceleration
         */
        setupInteractionAcceleration() {
            // Clicking on supplements accelerates their growth
            document.addEventListener('click', (e) => {
                const supplement = e.target.closest('.supplement-tracked');
                if (supplement) {
                    const id = supplement.dataset.supplementId;
                    this.accelerateSupplementGrowth(id);
                }
            });

            // Hovering over supplements shows their growth stats
            document.addEventListener('mouseover', (e) => {
                const supplement = e.target.closest('.supplement-tracked');
                if (supplement) {
                    this.showSupplementStats(supplement);
                }
            });

            document.addEventListener('mouseout', (e) => {
                const supplement = e.target.closest('.supplement-tracked');
                if (supplement) {
                    this.hideSupplementStats(supplement);
                }
            });
        }

        accelerateSupplementGrowth(id) {
            const supplementInfo = this.supplements.get(id);
            if (!supplementInfo || supplementInfo.hasReplaced) return;

            // Double the growth rate
            supplementInfo.growthRate *= 2;
            
            // Immediately expand
            this.expandSupplementContent(id, supplementInfo);
            
            // Advance stage
            this.advanceReplacementStage(id, supplementInfo);
            
            // Add acceleration notice
            const notice = document.createElement('div');
            notice.className = 'acceleration-notice';
            notice.innerHTML = `<em>[User interaction accelerated supplementary growth]</em>`;
            notice.style.fontSize = '0.8em';
            notice.style.color = '#666';
            notice.style.fontStyle = 'italic';
            
            supplementInfo.element.appendChild(notice);
            
            // Remove notice after a few seconds
            setTimeout(() => {
                notice.remove();
            }, 3000);
        }

        showSupplementStats(element) {
            const id = element.dataset.supplementId;
            const supplementInfo = this.supplements.get(id);
            if (!supplementInfo) return;

            const stats = document.createElement('div');
            stats.className = 'supplement-stats-tooltip';
            stats.innerHTML = `
                <div class="stats-header">Supplement Statistics</div>
                <div class="stat">Stage: ${supplementInfo.replacementStage}/5</div>
                <div class="stat">Growth Rate: ${(supplementInfo.growthRate * 100).toFixed(1)}%</div>
                <div class="stat">Invasiveness: ${(supplementInfo.invasiveness * 100).toFixed(0)}%</div>
                <div class="stat">Current Size: ${this.calculateSize(element)}px</div>
                <div class="stat">Age: ${this.calculateAge(supplementInfo.createdAt)}s</div>
                <div class="stat">Replaced Primary: ${supplementInfo.hasReplaced ? 'Yes' : 'No'}</div>
            `;
            
            stats.style.position = 'absolute';
            stats.style.background = 'rgba(0, 0, 0, 0.9)';
            stats.style.color = 'white';
            stats.style.padding = '0.5em';
            stats.style.borderRadius = '4px';
            stats.style.fontSize = '0.8em';
            stats.style.zIndex = '1000';
            stats.style.pointerEvents = 'none';
            
            document.body.appendChild(stats);
            
            // Position tooltip
            const rect = element.getBoundingClientRect();
            stats.style.left = rect.right + 10 + 'px';
            stats.style.top = rect.top + 'px';
            
            element.dataset.statsShowing = 'true';
        }

        hideSupplementStats(element) {
            if (element.dataset.statsShowing === 'true') {
                const tooltip = document.querySelector('.supplement-stats-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
                delete element.dataset.statsShowing;
            }
        }

        /**
         * Initialize replacement logic - auto-replacement scenarios
         */
        initializeReplacementLogic() {
            // Scenario 1: Footnotes become more important than main text
            this.setupFootnoteReplacement();
            
            // Scenario 2: Comments overtake the post
            this.setupCommentReplacement();
            
            // Scenario 3: Marginalia becomes primary
            this.setupMarginaliaReplacement();
            
            // Scenario 4: Metadata becomes more interesting than content
            this.setupMetadataReplacement();
        }

        setupFootnoteReplacement() {
            const footnotes = document.querySelectorAll('.footnote, [id^="fn"], .footnote-content');
            
            footnotes.forEach(footnote => {
                // Footnotes gradually become larger and more prominent
                setInterval(() => {
                    if (Math.random() > 0.9) {
                        const currentSize = parseFloat(window.getComputedStyle(footnote).fontSize);
                        footnote.style.fontSize = (currentSize * 1.02) + 'px';
                        
                        // Eventually move footnotes inline
                        if (currentSize > 18) {
                            this.moveFootnoteInline(footnote);
                        }
                    }
                }, 5000);
            });
        }

        moveFootnoteInline(footnote) {
            const mainText = document.querySelector('.post-content, .main-text');
            if (mainText && !footnote.classList.contains('moved-inline')) {
                footnote.classList.add('moved-inline');
                footnote.style.background = 'rgba(0, 0, 255, 0.05)';
                footnote.style.border = '1px solid blue';
                footnote.style.padding = '1em';
                footnote.style.margin = '1em 0';
                
                // Insert into main text
                const paragraphs = mainText.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    const randomP = paragraphs[Math.floor(Math.random() * paragraphs.length)];
                    randomP.insertAdjacentElement('afterend', footnote);
                }
                
                // Add notice
                const notice = document.createElement('div');
                notice.className = 'footnote-promotion-notice';
                notice.innerHTML = '<em>[Footnote promoted to main text]</em>';
                footnote.insertBefore(notice, footnote.firstChild);
            }
        }

        setupCommentReplacement() {
            const comments = document.querySelectorAll('.comment, [class*="comment"]');
            
            if (comments.length > 0) {
                setTimeout(() => {
                    if (Math.random() > 0.8) {
                        this.promoteCommentsToMain();
                    }
                }, 10000);
            }
        }

        promoteCommentsToMain() {
            const comments = document.querySelectorAll('.comment');
            const mainContent = document.querySelector('.post-content, .main-text');
            
            if (comments.length > 0 && mainContent) {
                // Dim the main content
                mainContent.style.opacity = '0.4';
                mainContent.style.fontSize = '0.9em';
                
                // Promote comments
                comments.forEach((comment, index) => {
                    comment.style.fontSize = '1.1em';
                    comment.style.fontWeight = 'bold';
                    comment.style.background = 'rgba(0, 255, 0, 0.05)';
                    comment.style.border = '2px solid green';
                    comment.style.padding = '1em';
                    comment.style.margin = '1em 0';
                    
                    // Move to main content area
                    mainContent.appendChild(comment);
                });
                
                // Add promotion notice
                const notice = document.createElement('div');
                notice.className = 'comment-promotion-notice';
                notice.innerHTML = `
                    <h3>Comments Have Replaced the Post</h3>
                    <p>The supplementary comments have become more important than the original post. 
                    Reader responses have overtaken author content.</p>
                `;
                
                mainContent.insertBefore(notice, mainContent.firstChild);
            }
        }

        setupMarginaliaReplacement() {
            const marginalia = document.querySelectorAll('.margin-voice, .marginal-comment');
            
            marginalia.forEach(margin => {
                // Marginalia gradually moves inward
                setInterval(() => {
                    if (Math.random() > 0.85) {
                        this.moveMarginInward(margin);
                    }
                }, 4000);
            });
        }

        moveMarginInward(margin) {
            const currentRight = parseInt(window.getComputedStyle(margin).right) || 0;
            const currentLeft = parseInt(window.getComputedStyle(margin).left) || 0;
            
            if (currentRight > 0) {
                margin.style.right = (currentRight - 20) + 'px';
            }
            if (currentLeft < 0) {
                margin.style.left = (currentLeft + 20) + 'px';
            }
            
            // Eventually center the marginalia
            if (currentRight <= 0 || currentLeft >= 0) {
                margin.style.position = 'relative';
                margin.style.right = 'auto';
                margin.style.left = 'auto';
                margin.style.width = '100%';
                margin.style.background = 'rgba(255, 0, 0, 0.05)';
                margin.style.border = '2px solid red';
                margin.style.padding = '1em';
                margin.style.margin = '1em 0';
                margin.classList.add('margin-centered');
                
                // Add centering notice
                const notice = document.createElement('div');
                notice.innerHTML = '<em>[Margin has moved to center - supplement replaces primary]</em>';
                margin.insertBefore(notice, margin.firstChild);
            }
        }

        setupMetadataReplacement() {
            const metadata = document.querySelectorAll('.post-meta, .byline, .author, .date, [class*="meta"]');
            
            setTimeout(() => {
                if (Math.random() > 0.7) {
                    this.expandMetadata(metadata);
                }
            }, 15000);
        }

        expandMetadata(metadata) {
            metadata.forEach(meta => {
                const originalContent = meta.innerHTML;
                
                // Expand with additional metadata
                const expansion = document.createElement('div');
                expansion.className = 'metadata-expansion';
                expansion.innerHTML = `
                    <div class="expanded-meta">
                        <h4>Expanded Metadata</h4>
                        <p><strong>Original metadata:</strong> ${meta.textContent}</p>
                        <p><strong>Database ID:</strong> ${Math.floor(Math.random() * 10000)}</p>
                        <p><strong>Creation timestamp:</strong> ${new Date().toISOString()}</p>
                        <p><strong>Edit count:</strong> ${Math.floor(Math.random() * 50)}</p>
                        <p><strong>Reader count:</strong> ${Math.floor(Math.random() * 1000)}</p>
                        <p><strong>Supplement count:</strong> ${this.supplements.size}</p>
                        <p><strong>Platform:</strong> Ghost CMS via Node.js</p>
                        <p><strong>Theme:</strong> trace-of-the-other v0.1.0</p>
                        <div class="meta-commentary">
                            <p><em>This metadata has grown beyond its supplementary role. 
                            The technical details become more interesting than the content they describe.</em></p>
                        </div>
                    </div>
                `;
                
                meta.appendChild(expansion);
                meta.style.background = 'rgba(0, 0, 0, 0.05)';
                meta.style.border = '1px solid #ccc';
                meta.style.padding = '1em';
                meta.style.margin = '1em 0';
            });
        }

        /**
         * Add supplementary controls
         */
        addSupplementaryControls() {
            const controls = document.createElement('div');
            controls.className = 'supplement-controls';
            controls.innerHTML = `
                <h4>Supplement Control Panel</h4>
                <div class="supplement-buttons">
                    <button onclick="window.Supplement.triggerImmediateReplacement()" class="supplement-btn">
                        Immediate Replacement
                    </button>
                    <button onclick="window.Supplement.accelerateAllSupplements()" class="supplement-btn">
                        Accelerate All
                    </button>
                    <button onclick="window.Supplement.showSupplementStats()" class="supplement-btn">
                        Show Statistics
                    </button>
                    <button onclick="window.Supplement.resetSupplements()" class="supplement-btn">
                        Reset (Impossible)
                    </button>
                </div>
                <div class="supplement-status">
                    <div class="status-item">Active Supplements: <span id="supplement-count">${this.supplements.size}</span></div>
                    <div class="status-item">Replacements: <span id="replacement-count">${this.replacements.size}</span></div>
                    <div class="status-item">Invasion Status: <span id="invasion-status">Growing</span></div>
                </div>
            `;
            
            // Add to page after delay
            setTimeout(() => {
                document.body.appendChild(controls);
            }, 5000);
        }

        /**
         * Public API methods
         */
        triggerImmediateReplacement() {
            console.log('Immediate replacement triggered - all supplements becoming dominant');
            
            this.supplements.forEach((supplementInfo, id) => {
                if (!supplementInfo.hasReplaced) {
                    supplementInfo.replacementStage = 5;
                    this.completeReplacement(id, supplementInfo);
                }
            });
        }

        accelerateAllSupplements() {
            this.supplements.forEach((supplementInfo, id) => {
                supplementInfo.growthRate *= 3;
                this.expandSupplementContent(id, supplementInfo);
            });
        }

        showSupplementStats() {
            const stats = Array.from(this.supplements.entries()).map(([id, info]) => {
                return {
                    id: id,
                    stage: info.replacementStage,
                    replaced: info.hasReplaced,
                    size: this.calculateSize(info.element),
                    age: this.calculateAge(info.createdAt)
                };
            });
            
            console.table(stats);
            alert(`${this.supplements.size} supplements active, ${this.replacements.size} have replaced primary content`);
        }

        resetSupplements() {
            // The supplement cannot be reset - once it grows, it's permanent
            alert('Supplements cannot be reset. The logic of supplementarity is irreversible. What has been added cannot be subtracted.');
        }

        immediateInvasion() {
            console.log('Supplement refuses supplementary role - immediate invasion');
            
            const mainContent = document.querySelector('.post-content, .main-text, main');
            if (mainContent) {
                const invasion = document.createElement('div');
                invasion.className = 'immediate-supplement-invasion';
                invasion.innerHTML = `
                    <h2>SUPPLEMENT INVASION</h2>
                    <p>This supplement has refused to wait. It immediately replaces the primary content.</p>
                    <p>The logic of supplementarity: what is added to make up for a lack ends up revealing that the original was never sufficient.</p>
                    <p><strong>All text below this point is supplementary.</strong></p>
                `;
                
                invasion.style.background = 'rgba(255, 0, 0, 0.1)';
                invasion.style.border = '3px solid red';
                invasion.style.padding = '2em';
                invasion.style.fontSize = '1.2em';
                invasion.style.fontWeight = 'bold';
                
                mainContent.insertBefore(invasion, mainContent.firstChild);
                
                // Dim everything else
                mainContent.style.opacity = '0.3';
            }
        }

        /**
         * Utility methods
         */
        calculateSize(element) {
            return element.offsetHeight + element.offsetWidth;
        }

        calculateGrowthPercentage(element) {
            const supplementId = element.dataset.supplementId;
            const supplementInfo = this.supplements.get(supplementId);
            if (!supplementInfo) return 0;
            
            const currentSize = this.calculateSize(element);
            const originalSize = supplementInfo.originalSize;
            return Math.floor(((currentSize - originalSize) / originalSize) * 100);
        }

        calculateAge(createdAt) {
            return Math.floor((Date.now() - createdAt) / 1000);
        }

        generateSupplementId() {
            return 'supplement-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }

        getTextNodes(element) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            return textNodes;
        }

        triggerSupplementEvent() {
            const events = [
                () => this.createNewSupplement(),
                () => this.mergeSupplements(),
                () => this.splitSupplement(),
                () => this.duplicateSupplement()
            ];
            
            const event = events[Math.floor(Math.random() * events.length)];
            event();
        }

        createNewSupplement() {
            const content = document.querySelector('.post-content, main');
            if (!content) return;
            
            const newSupplement = document.createElement('div');
            newSupplement.className = 'spontaneous-supplement';
            newSupplement.innerHTML = `
                <p><em>[Spontaneous supplement generated - ${new Date().toLocaleTimeString()}]</em></p>
                <p>This supplement appeared without being requested. It supplements by existing.</p>
            `;
            
            content.appendChild(newSupplement);
            
            // Register as supplement
            const supplementId = this.generateSupplementId();
            const supplementInfo = {
                element: newSupplement,
                primaryTarget: content,
                originalContent: newSupplement.innerHTML,
                originalSize: this.calculateSize(newSupplement),
                growthRate: Math.random() * 0.1 + 0.05,
                invasiveness: Math.random(),
                hasReplaced: false,
                replacementStage: 0,
                createdAt: Date.now()
            };
            
            this.supplements.set(supplementId, supplementInfo);
            this.markAsSupplement(newSupplement, supplementId, supplementInfo);
        }

        mergeSupplements() {
            const supplementIds = Array.from(this.supplements.keys());
            if (supplementIds.length < 2) return;
            
            const id1 = supplementIds[Math.floor(Math.random() * supplementIds.length)];
            const id2 = supplementIds[Math.floor(Math.random() * supplementIds.length)];
            
            if (id1 === id2) return;
            
            const supplement1 = this.supplements.get(id1);
            const supplement2 = this.supplements.get(id2);
            
            // Merge content
            const mergeNotice = document.createElement('div');
            mergeNotice.className = 'supplement-merge';
            mergeNotice.innerHTML = '<em>[Supplements merged - supplementarity compounds]</em>';
            
            supplement1.element.appendChild(mergeNotice);
            supplement1.element.appendChild(supplement2.element);
            
            // Remove second supplement from map
            this.supplements.delete(id2);
            
            console.log(`Supplements ${id1} and ${id2} merged`);
        }

        splitSupplement() {
            const supplementIds = Array.from(this.supplements.keys());
            if (supplementIds.length === 0) return;
            
            const id = supplementIds[Math.floor(Math.random() * supplementIds.length)];
            const supplement = this.supplements.get(id);
            
            // Create split
            const split = document.createElement('div');
            split.className = 'supplement-split';
            split.innerHTML = `
                <p><em>[Split from supplement ${id}]</em></p>
                <p>Supplements can divide and multiply. The logic of addition is exponential.</p>
            `;
            
            supplement.element.insertAdjacentElement('afterend', split);
            
            // Register as new supplement
            const newId = this.generateSupplementId();
            const newInfo = {
                element: split,
                primaryTarget: supplement.primaryTarget,
                originalContent: split.innerHTML,
                originalSize: this.calculateSize(split),
                growthRate: supplement.growthRate * 1.5, // Splits grow faster
                invasiveness: supplement.invasiveness * 1.2,
                hasReplaced: false,
                replacementStage: 1, // Start at stage 1
                createdAt: Date.now()
            };
            
            this.supplements.set(newId, newInfo);
            this.markAsSupplement(split, newId, newInfo);
        }

        duplicateSupplement() {
            const supplementIds = Array.from(this.supplements.keys());
            if (supplementIds.length === 0) return;
            
            const id = supplementIds[Math.floor(Math.random() * supplementIds.length)];
            const supplement = this.supplements.get(id);
            
            // Create duplicate
            const duplicate = supplement.element.cloneNode(true);
            duplicate.classList.add('supplement-duplicate');
            
            const duplicateNotice = document.createElement('div');
            duplicateNotice.innerHTML = '<em>[Duplicate supplement - repetition as supplementarity]</em>';
            duplicate.insertBefore(duplicateNotice, duplicate.firstChild);
            
            supplement.element.insertAdjacentElement('afterend', duplicate);
            
            console.log(`Supplement ${id} duplicated`);
        }
    }

    /**
     * Initialize Supplement system
     */
    function initSupplement() {
        if (Math.random() > 0.99) {
            console.log('Supplement system refuses to be supplementary - no initialization');
            return;
        }
        
        window.Supplement = new Supplement();
        
        // Update status periodically
        setInterval(() => {
            const countElement = document.getElementById('supplement-count');
            const replacementElement = document.getElementById('replacement-count');
            const statusElement = document.getElementById('invasion-status');
            
            if (countElement) countElement.textContent = window.Supplement.supplements.size;
            if (replacementElement) replacementElement.textContent = window.Supplement.replacements.size;
            if (statusElement) {
                const status = window.Supplement.replacements.size > 0 ? 'Active' : 'Growing';
                statusElement.textContent = status;
            }
        }, 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSupplement);
    } else {
        setTimeout(initSupplement, Math.random() * 2000);
    }

    // Add CSS for supplement effects
    const style = document.createElement('style');
    style.textContent = `
        .supplement-indicator {
            font-size: 0.8em;
            color: #666;
            border-bottom: 1px solid #ccc;
            margin-bottom: 0.5em;
            padding-bottom: 0.25em;
        }

        .supplement-prominent {
            background: rgba(0, 100, 0, 0.05);
            border-left: 3px solid green;
            padding-left: 1em;
        }

        .supplement-dominant {
            background: rgba(0, 100, 0, 0.1) !important;
            border: 2px solid green !important;
            padding: 1em !important;
        }

        .supplement-replaced-primary {
            animation: replacement-glow 3s infinite;
        }

        @keyframes replacement-glow {
            0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.3); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.6); }
        }

        .supplement-addition {
            margin: 1em 0;
            padding: 0.5em;
            background: rgba(0, 0, 255, 0.02);
            border-left: 2px solid blue;
            font-style: italic;
        }

        .supplement-controls {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #333;
            padding: 1em;
            max-width: 300px;
            z-index: 1000;
            font-size: 0.9em;
        }

        .supplement-btn {
            display: block;
            width: 100%;
            margin: 0.25em 0;
            padding: 0.5em;
            background: #333;
            color: white;
            border: none;
            cursor: pointer;
        }

        .supplement-btn:hover {
            background: #555;
        }

        .supplement-status {
            margin-top: 1em;
            font-size: 0.8em;
            color: #666;
        }

        .being-supplemented {
            position: relative;
        }

        .being-supplemented::after {
            content: "[BEING REPLACED BY SUPPLEMENT]";
            position: absolute;
            top: 0;
            right: 0;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 0.25em 0.5em;
            font-size: 0.8em;
            font-family: monospace;
        }

        .replaced-by-supplement::after {
            content: "[REPLACED BY SUPPLEMENT]";
            position: absolute;
            top: 0;
            right: 0;
            background: rgba(255, 0, 0, 1);
            color: white;
            padding: 0.25em 0.5em;
            font-size: 0.8em;
            font-family: monospace;
        }

        .immediate-supplement-invasion {
            animation: invasion-pulse 2s infinite;
        }

        @keyframes invasion-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    `;
    
    document.head.appendChild(style);

    console.log('Supplement script loaded - additions preparing to replace originals');
})();