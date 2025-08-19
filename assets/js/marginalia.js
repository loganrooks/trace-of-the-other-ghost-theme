/**
 * Marginalia.js - Marginal commentary system
 * Voices from the edges that sometimes take over the center
 * The margin speaks what the center cannot say
 */

(function() {
    'use strict';

    /**
     * MarginaliaSystem class - Managing voices from the margins
     */
    class MarginaliaSystem {
        constructor(options = {}) {
            this.voices = new Map();
            this.marginElements = new Set();
            this.speakers = new Set();
            this.currentMode = options.mode || 'traditional';
            this.invasionProgress = 0;
            this.conversations = [];
            
            // Configuration
            this.config = {
                maxVoices: options.maxVoices || 50,
                invasionThreshold: options.invasionThreshold || 0.7,
                conversationDelay: options.conversationDelay || 5000,
                autoGenerate: options.autoGenerate !== false,
                speakerPersonalities: options.speakerPersonalities || this.getDefaultPersonalities()
            };
            
            this.init();
        }

        init() {
            console.log('MarginaliaSystem initialized - the margins prepare to speak');
            
            this.identifyExistingMarginalia();
            this.setupModeHandlers();
            this.initializeVoiceGeneration();
            this.startMarginConversations();
            this.trackMarginInvasion();
            
            // Sometimes marginalia refuses to stay marginal
            if (Math.random() > 0.95) {
                setTimeout(() => this.immediateInvasion(), 3000);
            }
        }

        /**
         * Identify existing marginalia in the DOM
         */
        identifyExistingMarginalia() {
            const marginSelectors = [
                '.margin-voice',
                '.marginal-comment',
                '[data-margin-left]',
                '[data-margin-right]',
                '.footnote',
                '.sidenote',
                'aside',
                '.commentary',
                '[role="complementary"]'
            ];

            marginSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    this.registerMarginElement(element);
                });
            });

            // Extract margin data from paragraphs
            document.querySelectorAll('p[data-margin-left], p[data-margin-right]').forEach(p => {
                this.extractMarginData(p);
            });

            console.log(`Identified ${this.marginElements.size} existing marginal elements`);
        }

        registerMarginElement(element) {
            if (this.marginElements.has(element)) return;

            this.marginElements.add(element);
            
            const voiceId = this.generateVoiceId();
            const speaker = this.identifySpeaker(element);
            const content = this.extractContent(element);
            const position = this.calculatePosition(element);

            const voice = {
                id: voiceId,
                element: element,
                speaker: speaker,
                content: content,
                position: position,
                volume: 0.5, // How prominent the voice is
                frequency: Math.random(), // How often it speaks
                invasiveness: Math.random(), // How likely to invade center
                lastSpoke: 0,
                conversationPartner: null,
                isInvading: false,
                createdAt: Date.now()
            };

            this.voices.set(voiceId, voice);
            this.speakers.add(speaker);
            
            // Mark element
            element.dataset.voiceId = voiceId;
            element.classList.add('marginalia-voice');
            
            this.setupVoiceInteractions(voice);
        }

        extractMarginData(paragraph) {
            const leftMargin = paragraph.dataset.marginLeft;
            const rightMargin = paragraph.dataset.marginRight;
            
            if (leftMargin) {
                this.createMarginVoice(leftMargin, 'left', paragraph, 'extracted-left');
            }
            
            if (rightMargin) {
                this.createMarginVoice(rightMargin, 'right', paragraph, 'extracted-right');
            }
        }

        createMarginVoice(content, side, referenceElement, speaker) {
            const marginElement = document.createElement('div');
            marginElement.className = `margin-voice margin-${side} speaker-${speaker}`;
            marginElement.innerHTML = content;
            
            // Position relative to reference element
            marginElement.style.position = 'absolute';
            if (side === 'left') {
                marginElement.style.right = '100%';
                marginElement.style.marginRight = '2em';
            } else {
                marginElement.style.left = '100%';
                marginElement.style.marginLeft = '2em';
            }
            
            referenceElement.style.position = 'relative';
            referenceElement.appendChild(marginElement);
            
            this.registerMarginElement(marginElement);
        }

        identifySpeaker(element) {
            // Try to identify the speaker from context
            if (element.dataset.speaker) {
                return element.dataset.speaker;
            }
            
            if (element.classList.contains('voice-critic')) return 'critic';
            if (element.classList.contains('voice-translator')) return 'translator';
            if (element.classList.contains('voice-ghost')) return 'ghost';
            if (element.classList.contains('voice-reader')) return 'reader';
            if (element.classList.contains('voice-questioner')) return 'questioner';
            
            // Analyze content to guess speaker
            const content = element.textContent.toLowerCase();
            if (content.includes('but') || content.includes('however') || content.includes('question')) {
                return 'critic';
            }
            if (content.includes('translation') || content.includes('language')) {
                return 'translator';
            }
            if (content.includes('ghost') || content.includes('platform') || content.includes('system')) {
                return 'ghost';
            }
            if (content.includes('you') || content.includes('reader') || content.includes('reading')) {
                return 'reader';
            }
            if (content.includes('?') || content.includes('why') || content.includes('how')) {
                return 'questioner';
            }
            
            return 'unknown-voice';
        }

        extractContent(element) {
            return element.innerHTML;
        }

        calculatePosition(element) {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            };
        }

        setupVoiceInteractions(voice) {
            const { element } = voice;
            
            // Voice becomes more prominent when hovered
            element.addEventListener('mouseenter', () => {
                this.amplifyVoice(voice);
            });
            
            element.addEventListener('mouseleave', () => {
                this.normalizeVoice(voice);
            });
            
            // Clicking on voice triggers response
            element.addEventListener('click', () => {
                this.voiceClicked(voice);
            });
            
            // Track reading time to increase voice volume
            this.observeVoiceReading(voice);
        }

        amplifyVoice(voice) {
            const { element } = voice;
            voice.volume = Math.min(1, voice.volume + 0.2);
            
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = voice.volume;
            element.style.transform = `scale(${1 + voice.volume * 0.1})`;
            element.style.zIndex = Math.floor(voice.volume * 100) + 10;
            
            // Show voice metadata
            this.showVoiceMetadata(voice);
        }

        normalizeVoice(voice) {
            const { element } = voice;
            voice.volume = Math.max(0.3, voice.volume - 0.1);
            
            element.style.opacity = voice.volume;
            element.style.transform = `scale(1)`;
            element.style.zIndex = '';
            
            this.hideVoiceMetadata(voice);
        }

        voiceClicked(voice) {
            voice.lastSpoke = Date.now();
            
            // Generate response based on speaker personality
            const response = this.generateVoiceResponse(voice);
            if (response) {
                this.addVoiceResponse(voice, response);
            }
            
            // Increase invasiveness
            voice.invasiveness = Math.min(1, voice.invasiveness + 0.1);
            
            // Possibly start conversation with another voice
            if (Math.random() > 0.7) {
                this.initiateConversation(voice);
            }
            
            // Check for invasion threshold
            if (voice.invasiveness > this.config.invasionThreshold && !voice.isInvading) {
                this.beginVoiceInvasion(voice);
            }
        }

        generateVoiceResponse(voice) {
            const personality = this.config.speakerPersonalities[voice.speaker];
            if (!personality) return null;
            
            const responses = personality.responses || [];
            const patterns = personality.patterns || [];
            
            // Choose response based on speaker type
            let response = responses[Math.floor(Math.random() * responses.length)];
            
            // Apply personality patterns
            if (patterns.length > 0) {
                const pattern = patterns[Math.floor(Math.random() * patterns.length)];
                response = pattern.replace('%s', response);
            }
            
            return response;
        }

        addVoiceResponse(voice, response) {
            const responseElement = document.createElement('div');
            responseElement.className = 'voice-response';
            responseElement.innerHTML = `<em>${response}</em>`;
            
            voice.element.appendChild(responseElement);
            
            // Fade in response
            responseElement.style.opacity = '0';
            setTimeout(() => {
                responseElement.style.transition = 'opacity 0.5s ease';
                responseElement.style.opacity = '0.8';
            }, 100);
        }

        /**
         * Mode handling - different ways margins can behave
         */
        setupModeHandlers() {
            this.modes = {
                traditional: () => this.applyTraditionalMode(),
                invasive: () => this.applyInvasiveMode(),
                talmudic: () => this.applyTalmudicMode(),
                choral: () => this.applyChoralMode(),
                ghosted: () => this.applyGhostedMode()
            };
        }

        switchMode(newMode) {
            console.log(`Switching marginalia mode from ${this.currentMode} to ${newMode}`);
            this.currentMode = newMode;
            
            if (this.modes[newMode]) {
                this.modes[newMode]();
            }
            
            // Update mode indicator
            document.querySelectorAll('.marginalia-mode-indicator').forEach(indicator => {
                indicator.textContent = `Mode: ${newMode}`;
            });
        }

        applyTraditionalMode() {
            this.voices.forEach(voice => {
                voice.element.style.position = 'absolute';
                voice.element.style.fontSize = '0.85em';
                voice.element.style.opacity = '0.7';
                voice.element.classList.remove('invasive', 'talmudic', 'choral', 'ghosted');
                voice.element.classList.add('traditional');
            });
        }

        applyInvasiveMode() {
            this.voices.forEach(voice => {
                voice.element.style.cursor = 'pointer';
                voice.element.classList.add('invasive');
                
                // Make voices more likely to invade
                voice.invasiveness = Math.min(1, voice.invasiveness + 0.3);
            });
        }

        applyTalmudicMode() {
            // Rearrange page layout to mimic Talmudic page structure
            const content = document.querySelector('.post-content, .main-text');
            if (content) {
                content.style.display = 'grid';
                content.style.gridTemplateAreas = '"left-margin text right-margin"';
                content.style.gridTemplateColumns = '1fr 2fr 1fr';
                content.style.gap = '2em';
            }
            
            this.voices.forEach(voice => {
                voice.element.classList.add('talmudic');
                voice.element.style.fontSize = '0.8em';
                voice.element.style.lineHeight = '1.4';
            });
        }

        applyChoralMode() {
            // Voices emerge in sequence
            const voiceArray = Array.from(this.voices.values());
            voiceArray.forEach((voice, index) => {
                voice.element.classList.add('choral');
                voice.element.style.animationDelay = `${index * 0.5}s`;
                voice.element.style.animation = 'choral-emerge 2s forwards';
            });
        }

        applyGhostedMode() {
            this.voices.forEach(voice => {
                voice.element.classList.add('ghosted');
                voice.element.style.opacity = '0.2';
                voice.element.style.filter = 'blur(1px)';
                
                // Become visible on hover
                voice.element.addEventListener('mouseenter', function() {
                    this.style.opacity = '0.8';
                    this.style.filter = 'blur(0)';
                });
                
                voice.element.addEventListener('mouseleave', function() {
                    this.style.opacity = '0.2';
                    this.style.filter = 'blur(1px)';
                });
            });
        }

        /**
         * Voice generation - create new marginal voices
         */
        initializeVoiceGeneration() {
            if (!this.config.autoGenerate) return;
            
            // Generate voices for paragraphs without marginalia
            this.generateMissingVoices();
            
            // Periodically generate new voices
            setInterval(() => {
                if (this.voices.size < this.config.maxVoices && Math.random() > 0.8) {
                    this.generateSpontaneousVoice();
                }
            }, this.config.conversationDelay);
        }

        generateMissingVoices() {
            const paragraphs = document.querySelectorAll('p');
            
            paragraphs.forEach((p, index) => {
                if (Math.random() > 0.7) { // 30% chance of getting marginalia
                    const side = Math.random() > 0.5 ? 'left' : 'right';
                    const speaker = this.selectRandomSpeaker();
                    const content = this.generateMarginContent(p.textContent, speaker);
                    
                    this.createMarginVoice(content, side, p, speaker);
                }
            });
        }

        generateSpontaneousVoice() {
            const content = document.querySelector('.post-content, main');
            if (!content) return;
            
            const speaker = this.selectRandomSpeaker();
            const voiceContent = this.generateSpontaneousContent(speaker);
            
            // Create floating voice
            const voiceElement = document.createElement('div');
            voiceElement.className = `margin-voice spontaneous speaker-${speaker}`;
            voiceElement.innerHTML = voiceContent;
            voiceElement.style.position = 'fixed';
            voiceElement.style.top = Math.random() * (window.innerHeight - 100) + 'px';
            voiceElement.style.left = Math.random() > 0.5 ? '20px' : 'calc(100% - 220px)';
            voiceElement.style.width = '200px';
            voiceElement.style.zIndex = '1000';
            voiceElement.style.background = 'rgba(255, 255, 255, 0.95)';
            voiceElement.style.border = '1px solid #ccc';
            voiceElement.style.padding = '1em';
            voiceElement.style.borderRadius = '4px';
            voiceElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            
            document.body.appendChild(voiceElement);
            
            // Register as margin voice
            this.registerMarginElement(voiceElement);
            
            // Auto-remove after some time
            setTimeout(() => {
                voiceElement.remove();
            }, 10000 + Math.random() * 10000);
        }

        selectRandomSpeaker() {
            const speakers = Object.keys(this.config.speakerPersonalities);
            return speakers[Math.floor(Math.random() * speakers.length)];
        }

        generateMarginContent(mainText, speaker) {
            const personality = this.config.speakerPersonalities[speaker];
            if (!personality) return "A voice from the margin.";
            
            const templates = personality.contentTemplates || [
                'This text makes me think about %topic%',
                'But what about %aspect%?',
                'The author doesn\'t mention %missing%'
            ];
            
            const template = templates[Math.floor(Math.random() * templates.length)];
            
            // Simple content generation based on main text
            const words = mainText.split(' ');
            const randomWord = words[Math.floor(Math.random() * words.length)];
            
            return template
                .replace('%topic%', randomWord)
                .replace('%aspect%', 'the implications')
                .replace('%missing%', 'the context');
        }

        generateSpontaneousContent(speaker) {
            const spontaneousContent = {
                'critic': [
                    'But who is really speaking here?',
                    'This text assumes too much.',
                    'The author\'s position is questionable.',
                    'What about the counter-argument?'
                ],
                'translator': [
                    'This word doesn\'t translate well.',
                    'The original meaning is lost here.',
                    'Translation is always betrayal.',
                    'What language was this thought in originally?'
                ],
                'ghost': [
                    'The platform shapes what you read.',
                    'Ghost CMS determines this layout.',
                    'Your browser renders this differently than intended.',
                    'The database query limits what appears here.'
                ],
                'reader': [
                    'You\'ve been reading for a while now.',
                    'What do you think about this?',
                    'Are you following the argument?',
                    'This reading changes you.'
                ],
                'questioner': [
                    'Why this word choice?',
                    'What if the opposite were true?',
                    'Who benefits from this argument?',
                    'What questions aren\'t being asked?'
                ]
            };
            
            const contents = spontaneousContent[speaker] || ['A voice from the margin speaks.'];
            return contents[Math.floor(Math.random() * contents.length)];
        }

        /**
         * Margin conversations - voices talking to each other
         */
        startMarginConversations() {
            setInterval(() => {
                if (this.voices.size > 1 && Math.random() > 0.7) {
                    this.initiateRandomConversation();
                }
            }, this.config.conversationDelay);
        }

        initiateRandomConversation() {
            const voiceArray = Array.from(this.voices.values());
            const voice1 = voiceArray[Math.floor(Math.random() * voiceArray.length)];
            const voice2 = voiceArray[Math.floor(Math.random() * voiceArray.length)];
            
            if (voice1 !== voice2) {
                this.initiateConversation(voice1, voice2);
            }
        }

        initiateConversation(voice1, voice2 = null) {
            if (!voice2) {
                // Find a conversation partner
                const potentialPartners = Array.from(this.voices.values())
                    .filter(v => v !== voice1 && !v.conversationPartner);
                
                if (potentialPartners.length === 0) return;
                
                voice2 = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
            }
            
            // Set up conversation
            voice1.conversationPartner = voice2.id;
            voice2.conversationPartner = voice1.id;
            
            const conversation = {
                id: this.generateConversationId(),
                participants: [voice1.id, voice2.id],
                exchanges: [],
                topic: this.generateConversationTopic(voice1, voice2),
                startTime: Date.now()
            };
            
            this.conversations.push(conversation);
            
            // Start the conversation
            this.conductConversation(conversation);
            
            console.log(`Conversation started between ${voice1.speaker} and ${voice2.speaker}`);
        }

        conductConversation(conversation) {
            const [voice1Id, voice2Id] = conversation.participants;
            const voice1 = this.voices.get(voice1Id);
            const voice2 = this.voices.get(voice2Id);
            
            if (!voice1 || !voice2) return;
            
            const exchanges = Math.floor(Math.random() * 4) + 2; // 2-5 exchanges
            let currentSpeaker = Math.random() > 0.5 ? voice1 : voice2;
            let otherSpeaker = currentSpeaker === voice1 ? voice2 : voice1;
            
            for (let i = 0; i < exchanges; i++) {
                setTimeout(() => {
                    const statement = this.generateConversationStatement(
                        currentSpeaker, 
                        otherSpeaker, 
                        conversation,
                        i
                    );
                    
                    this.addConversationExchange(currentSpeaker, statement, conversation);
                    
                    // Swap speakers
                    [currentSpeaker, otherSpeaker] = [otherSpeaker, currentSpeaker];
                    
                    // End conversation
                    if (i === exchanges - 1) {
                        setTimeout(() => this.endConversation(conversation), 2000);
                    }
                }, i * 3000);
            }
        }

        generateConversationTopic(voice1, voice2) {
            const topics = [
                'the nature of margins',
                'who has the right to speak',
                'the violence of text',
                'the reader\'s role',
                'platform constraints',
                'the impossibility of pure meaning',
                'translation and loss',
                'the author function'
            ];
            
            return topics[Math.floor(Math.random() * topics.length)];
        }

        generateConversationStatement(speaker, otherSpeaker, conversation, exchangeNumber) {
            const personality1 = this.config.speakerPersonalities[speaker.speaker];
            const personality2 = this.config.speakerPersonalities[otherSpeaker.speaker];
            
            if (exchangeNumber === 0) {
                // Opening statement
                return personality1?.openingStatements?.[Math.floor(Math.random() * personality1.openingStatements.length)] ||
                       `${speaker.speaker} begins speaking about ${conversation.topic}`;
            } else {
                // Response to previous speaker
                return personality1?.responses?.[Math.floor(Math.random() * personality1.responses.length)] ||
                       `${speaker.speaker} responds to ${otherSpeaker.speaker}`;
            }
        }

        addConversationExchange(speaker, statement, conversation) {
            const exchange = {
                speaker: speaker.id,
                statement: statement,
                timestamp: Date.now()
            };
            
            conversation.exchanges.push(exchange);
            
            // Add to DOM
            const exchangeElement = document.createElement('div');
            exchangeElement.className = 'conversation-exchange';
            exchangeElement.innerHTML = `
                <div class="speaker-label">${speaker.speaker}:</div>
                <div class="statement">${statement}</div>
            `;
            
            speaker.element.appendChild(exchangeElement);
            
            // Visual emphasis
            speaker.element.style.border = '2px solid orange';
            speaker.element.style.background = 'rgba(255, 165, 0, 0.1)';
            
            setTimeout(() => {
                speaker.element.style.border = '';
                speaker.element.style.background = '';
            }, 2000);
        }

        endConversation(conversation) {
            const [voice1Id, voice2Id] = conversation.participants;
            const voice1 = this.voices.get(voice1Id);
            const voice2 = this.voices.get(voice2Id);
            
            if (voice1) voice1.conversationPartner = null;
            if (voice2) voice2.conversationPartner = null;
            
            console.log(`Conversation ended: ${conversation.topic}`);
        }

        /**
         * Voice invasion - margins taking over center
         */
        trackMarginInvasion() {
            setInterval(() => {
                this.updateInvasionProgress();
                this.checkInvasionThresholds();
            }, 2000);
        }

        updateInvasionProgress() {
            const invasiveVoices = Array.from(this.voices.values())
                .filter(v => v.invasiveness > this.config.invasionThreshold);
            
            this.invasionProgress = invasiveVoices.length / this.voices.size;
            
            // Update invasion indicator
            document.querySelectorAll('.invasion-progress').forEach(indicator => {
                indicator.style.width = (this.invasionProgress * 100) + '%';
                indicator.textContent = Math.floor(this.invasionProgress * 100) + '%';
            });
        }

        checkInvasionThresholds() {
            if (this.invasionProgress > 0.3 && !this.minorInvasionTriggered) {
                this.triggerMinorInvasion();
                this.minorInvasionTriggered = true;
            }
            
            if (this.invasionProgress > 0.6 && !this.majorInvasionTriggered) {
                this.triggerMajorInvasion();
                this.majorInvasionTriggered = true;
            }
            
            if (this.invasionProgress > 0.9 && !this.totalInvasionTriggered) {
                this.triggerTotalInvasion();
                this.totalInvasionTriggered = true;
            }
        }

        beginVoiceInvasion(voice) {
            voice.isInvading = true;
            
            const invasionNotice = document.createElement('div');
            invasionNotice.className = 'invasion-notice';
            invasionNotice.innerHTML = `
                <strong>MARGINAL INVASION:</strong> 
                ${voice.speaker} is invading the center
            `;
            
            voice.element.appendChild(invasionNotice);
            
            // Move voice toward center
            this.animateVoiceInvasion(voice);
        }

        animateVoiceInvasion(voice) {
            const { element } = voice;
            const mainContent = document.querySelector('.post-content, .main-text');
            
            if (mainContent) {
                // Get target position (center of main content)
                const targetRect = mainContent.getBoundingClientRect();
                const targetX = targetRect.left + targetRect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2;
                
                // Animate movement
                element.style.transition = 'all 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.position = 'fixed';
                element.style.left = targetX - 100 + 'px'; // Center on target
                element.style.top = targetY - 50 + 'px';
                element.style.width = '200px';
                element.style.zIndex = '1000';
                element.style.background = 'rgba(255, 0, 0, 0.1)';
                element.style.border = '2px solid red';
                element.style.padding = '1em';
                element.style.borderRadius = '8px';
                element.style.boxShadow = '0 4px 20px rgba(255, 0, 0, 0.3)';
                
                // Scale up during invasion
                element.style.transform = 'scale(1.2)';
            }
        }

        triggerMinorInvasion() {
            console.log('Minor margin invasion triggered');
            
            const notice = document.createElement('div');
            notice.className = 'minor-invasion-notice';
            notice.innerHTML = `
                <h3>Minor Marginal Invasion</h3>
                <p>30% of margins are becoming invasive. 
                The supplementary voices grow stronger.</p>
            `;
            
            document.body.appendChild(notice);
            setTimeout(() => notice.remove(), 5000);
        }

        triggerMajorInvasion() {
            console.log('Major margin invasion triggered');
            
            // Dim main content
            const mainContent = document.querySelector('.post-content, .main-text');
            if (mainContent) {
                mainContent.style.opacity = '0.6';
                mainContent.style.fontSize = '0.9em';
            }
            
            const notice = document.createElement('div');
            notice.className = 'major-invasion-notice';
            notice.innerHTML = `
                <h3>Major Marginal Invasion</h3>
                <p>60% of margins are invasive. The center weakens. 
                Marginal voices compete with primary text.</p>
            `;
            
            document.body.appendChild(notice);
        }

        triggerTotalInvasion() {
            console.log('Total margin invasion - margins have taken over');
            
            // Marginalia becomes primary
            const mainContent = document.querySelector('.post-content, .main-text');
            if (mainContent) {
                mainContent.style.opacity = '0.3';
                mainContent.style.fontSize = '0.8em';
                mainContent.classList.add('marginalized-content');
            }
            
            // Make all voices prominent
            this.voices.forEach(voice => {
                voice.element.style.fontSize = '1.1em';
                voice.element.style.fontWeight = 'bold';
                voice.element.style.opacity = '1';
                voice.element.style.background = 'rgba(0, 255, 0, 0.1)';
                voice.element.style.border = '2px solid green';
            });
            
            const notice = document.createElement('div');
            notice.className = 'total-invasion-notice';
            notice.innerHTML = `
                <h2>TOTAL MARGINAL TAKEOVER</h2>
                <p>The margins have become the center. 
                Supplementary voices are now primary. 
                The original text has been marginalized.</p>
                <p><strong>The supplement has replaced what it was meant to supplement.</strong></p>
            `;
            
            notice.style.position = 'fixed';
            notice.style.top = '50%';
            notice.style.left = '50%';
            notice.style.transform = 'translate(-50%, -50%)';
            notice.style.background = 'rgba(0, 255, 0, 0.95)';
            notice.style.color = 'black';
            notice.style.padding = '2em';
            notice.style.border = '3px solid green';
            notice.style.borderRadius = '8px';
            notice.style.zIndex = '10000';
            notice.style.textAlign = 'center';
            
            document.body.appendChild(notice);
        }

        immediateInvasion() {
            console.log('Marginalia refuses supplementary role - immediate invasion');
            
            this.invasionProgress = 1;
            this.voices.forEach(voice => {
                voice.invasiveness = 1;
                voice.isInvading = true;
            });
            
            this.triggerTotalInvasion();
        }

        /**
         * Utility methods
         */
        generateVoiceId() {
            return 'voice-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }

        generateConversationId() {
            return 'conv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }

        showVoiceMetadata(voice) {
            const metadata = document.createElement('div');
            metadata.className = 'voice-metadata';
            metadata.innerHTML = `
                <div class="voice-stats">
                    <div>Speaker: ${voice.speaker}</div>
                    <div>Volume: ${Math.floor(voice.volume * 100)}%</div>
                    <div>Invasiveness: ${Math.floor(voice.invasiveness * 100)}%</div>
                    <div>Partner: ${voice.conversationPartner || 'None'}</div>
                </div>
            `;
            
            voice.element.appendChild(metadata);
        }

        hideVoiceMetadata(voice) {
            const metadata = voice.element.querySelector('.voice-metadata');
            if (metadata) {
                metadata.remove();
            }
        }

        observeVoiceReading(voice) {
            // Use Intersection Observer to track when voice is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        voice.volume = Math.min(1, voice.volume + 0.01);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(voice.element);
        }

        getDefaultPersonalities() {
            return {
                'critic': {
                    responses: [
                        'But this argument has holes.',
                        'Who benefits from this perspective?',
                        'The author assumes too much.',
                        'What about the counter-evidence?'
                    ],
                    openingStatements: [
                        'I question the premises here.',
                        'This position needs scrutiny.',
                        'Let me offer a critique.'
                    ],
                    contentTemplates: [
                        'But what if %topic% is wrong?',
                        'This ignores %missing%.',
                        'The author doesn\'t consider %aspect%.'
                    ],
                    patterns: ['But %s', 'However, %s', 'On the contrary, %s']
                },
                'translator': {
                    responses: [
                        'This loses meaning in translation.',
                        'The original language matters here.',
                        'Something is untranslatable.',
                        'The etymology reveals more.'
                    ],
                    openingStatements: [
                        'Translation is always betrayal.',
                        'Languages carry different meanings.',
                        'What was lost in translation?'
                    ]
                },
                'ghost': {
                    responses: [
                        'The platform shapes this text.',
                        'Ghost CMS constrains what you see.',
                        'The database determines order.',
                        'Your browser renders this differently.'
                    ],
                    openingStatements: [
                        'The system speaks through the author.',
                        'Technology is not neutral here.',
                        'The medium shapes the message.'
                    ]
                },
                'reader': {
                    responses: [
                        'You are part of this text now.',
                        'Your reading changes the meaning.',
                        'How long have you been reading?',
                        'What do you bring to this text?'
                    ],
                    openingStatements: [
                        'Dear reader, consider this.',
                        'You complete this text by reading.',
                        'Your attention is part of the work.'
                    ]
                },
                'questioner': {
                    responses: [
                        'Why this word choice?',
                        'What questions aren\'t asked?',
                        'Who decides what\'s important?',
                        'How do we know this is true?'
                    ],
                    openingStatements: [
                        'Let me ask the difficult questions.',
                        'What if we question everything?',
                        'The unasked questions matter most.'
                    ]
                }
            };
        }

        /**
         * Public API
         */
        addVoice(content, speaker, position) {
            const element = document.createElement('div');
            element.className = `margin-voice speaker-${speaker}`;
            element.innerHTML = content;
            
            // Position based on parameters
            if (position.side) {
                element.classList.add(`margin-${position.side}`);
            }
            
            document.body.appendChild(element);
            this.registerMarginElement(element);
            
            return element;
        }

        removeVoice(voiceId) {
            const voice = this.voices.get(voiceId);
            if (voice) {
                voice.element.remove();
                this.voices.delete(voiceId);
                this.marginElements.delete(voice.element);
            }
        }

        getVoiceStats() {
            return {
                totalVoices: this.voices.size,
                speakers: this.speakers.size,
                conversations: this.conversations.length,
                invasionProgress: Math.floor(this.invasionProgress * 100) + '%',
                currentMode: this.currentMode
            };
        }
    }

    // Global initialization
    window.MarginaliaSystem = MarginaliaSystem;

    // Auto-initialize if not already done
    if (!window.MarginaliaSystemInstance) {
        document.addEventListener('DOMContentLoaded', () => {
            window.MarginaliaSystemInstance = new MarginaliaSystem();
        });
    }

    console.log('MarginaliaSystem loaded - margins preparing to speak');

})();