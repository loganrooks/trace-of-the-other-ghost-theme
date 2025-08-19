# Hacker Code Aesthetic Implementation Plan

## Vision
Transform the literary theme into a hyper post-modern hacker aesthetic with:
- **Black background** with **bright hacker green** glitching code
- **White main text** with **purple/grey accents**
- **Animated background** with code fragments that glitch and leave traces
- **Terminal/console** inspired typography and layout
- **Performance optimized** and **accessibility conscious**

## Phase 1: Base Hacker Aesthetic (Static) - 1 hour

### 1.1 Color Palette
```css
:root {
  /* Base colors */
  --bg-primary: #0a0a0a;        /* Almost black background */
  --text-primary: #f0f0f0;      /* Off-white text */
  --text-secondary: #b0b0b0;    /* Grey secondary text */
  
  /* Hacker green spectrum */
  --hacker-green: #00ff00;      /* Bright green */
  --hacker-green-dim: #00cc00;  /* Dimmer green */
  --hacker-green-dark: #008800; /* Dark green */
  
  /* Accent colors */
  --accent-purple: #8a2be2;     /* Blue-violet */
  --accent-grey: #606060;       /* Medium grey */
  --accent-red: #ff0040;        /* Error red */
  
  /* Effect colors */
  --glitch-cyan: #00ffff;       /* Cyan for RGB glitch */
  --glitch-magenta: #ff00ff;    /* Magenta for RGB glitch */
}
```

### 1.2 Typography System
```css
/* Import hacker-style fonts */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Share+Tech+Mono&display=swap');

body {
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
}

/* Headers - bigger terminal text */
h1, h2, h3 {
  font-family: 'Share Tech Mono', monospace;
  color: var(--hacker-green);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px var(--hacker-green-dim);
}

/* Code-like elements */
pre, code {
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid var(--hacker-green-dark);
  color: var(--hacker-green);
}
```

### 1.3 Terminal Layout Structure
```css
.site-wrapper {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
}

.site-header {
  border-bottom: 2px solid var(--hacker-green-dark);
  padding: 1rem 0;
  background: rgba(0, 0, 0, 0.9);
}

.terminal-prompt::before {
  content: "root@ghost:~$ ";
  color: var(--hacker-green);
  margin-right: 0.5rem;
}
```

## Phase 2: Animated Background System - 2 hours

### 2.1 Matrix-Style Falling Code
```css
.matrix-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.matrix-column {
  position: absolute;
  top: -100px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--hacker-green);
  opacity: 0.7;
  animation: matrix-fall linear infinite;
  text-shadow: 0 0 5px var(--hacker-green);
}

@keyframes matrix-fall {
  0% {
    transform: translateY(-100vh);
    opacity: 1;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}
```

### 2.2 Glitch Effects
```css
.glitch-text {
  position: relative;
  color: var(--text-primary);
  animation: glitch-main 2s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: var(--glitch-cyan);
  animation: glitch-1 0.3s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text::after {
  color: var(--glitch-magenta);
  animation: glitch-2 0.3s infinite linear alternate-reverse;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes glitch-main {
  0%, 98% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  1% {
    transform: translate(-2px, 1px);
    filter: hue-rotate(90deg);
  }
  2% {
    transform: translate(1px, -1px);
    filter: hue-rotate(180deg);
  }
}
```

### 2.3 Code Fragment System
```javascript
class CodeFragmentGenerator {
  constructor() {
    this.fragments = [
      "function deconstruct(reality) {",
      "  if (!reality.stable) {",
      "    reality.glitch();",
      "  }",
      "}",
      "const ghost = new Platform();",
      "ghost.constraints.visible = true;",
      "while (writing) {",
      "  text.revise().erase().supplement();",
      "}",
      "// TODO: question authority",
      "margin.voices.forEach(voice => {",
      "  voice.invade(center);",
      "});",
      "ERROR: Philosophy not found",
      "WARNING: Meaning unstable",
      "> executing trace_of_other.exe",
      "SYSTEM: Reality.dll corrupted"
    ];
    this.init();
  }
  
  generateFragment() {
    const fragment = document.createElement('div');
    fragment.className = 'code-fragment';
    fragment.textContent = this.getRandomFragment();
    fragment.style.cssText = `
      position: absolute;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--hacker-green);
      opacity: 0.8;
      pointer-events: none;
      white-space: nowrap;
      animation: fragment-drift 8s ease-out forwards;
    `;
    
    // Random position
    fragment.style.left = Math.random() * window.innerWidth + 'px';
    fragment.style.top = Math.random() * window.innerHeight + 'px';
    
    document.querySelector('.matrix-background').appendChild(fragment);
    
    // Remove after animation
    setTimeout(() => fragment.remove(), 8000);
  }
  
  startGeneration() {
    // Generate fragments every 2-5 seconds
    setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance
        this.generateFragment();
      }
    }, 2000 + Math.random() * 3000);
  }
}
```

## Phase 3: Interactive Hacker Elements - 1.5 hours

### 3.1 Terminal Cursor Effects
```css
.terminal-cursor::after {
  content: "█";
  color: var(--hacker-green);
  animation: cursor-blink 1s infinite;
  margin-left: 2px;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### 3.2 Hover Glitch Effects
```css
.post-card:hover {
  animation: post-glitch 0.3s ease-in-out;
}

.post-card:hover .post-title {
  text-shadow: 
    2px 0 var(--glitch-cyan),
    -2px 0 var(--glitch-magenta),
    0 0 10px var(--hacker-green);
}

@keyframes post-glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(1px, -1px); }
  60% { transform: translate(-1px, 2px); }
  80% { transform: translate(2px, -2px); }
}
```

### 3.3 Marginalia as Code Comments
```css
.margin-voice {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--hacker-green-dark);
  padding: 0.5rem;
  color: var(--hacker-green-dim);
  position: absolute;
  max-width: 200px;
}

.margin-voice::before {
  content: "// ";
  color: var(--accent-grey);
}

.voice-critic {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.voice-critic::before {
  content: "/* ERROR: ";
}

.voice-critic::after {
  content: " */";
}
```

## Phase 4: Performance Optimization - 1 hour

### 4.1 Accessibility & Performance Controls
```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .matrix-column,
  .glitch-text,
  .code-fragment {
    animation: none !important;
  }
  
  .matrix-background {
    display: none;
  }
}

/* Performance optimization */
.matrix-column,
.code-fragment {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU acceleration */
}
```

### 4.2 Modular Loading
```javascript
// Only load animations if supported and preferred
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  import('./hacker-animations.js').then(module => {
    module.initHackerEffects();
  });
}
```

## Phase 5: Advanced Features (Optional) - 2 hours

### 5.1 Sound Effects
```javascript
class HackerAudio {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.enabled = false;
  }
  
  playKeystroke() {
    if (!this.enabled) return;
    
    // Generate synthetic keystroke sound
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.frequency.setValueAtTime(800, this.context.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
    
    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.1);
  }
}
```

## Implementation Sequence

### Step 1: Base Theme Conversion (30 min)
1. Update `assets/css/main.css` with hacker color scheme
2. Replace fonts with monospace alternatives
3. Add terminal-style layout

### Step 2: Background System (45 min)
1. Create `assets/css/hacker-effects.css`
2. Add matrix background HTML structure
3. Implement CSS animations

### Step 3: Interactive Elements (45 min)
1. Add glitch effects to existing elements
2. Convert marginalia to code comment style
3. Add hover effects

### Step 4: JavaScript Enhancements (30 min)
1. Create `assets/js/hacker-effects.js`
2. Implement code fragment generator
3. Add performance monitoring

## File Structure
```
/assets/
  /css/
    main.css              (base hacker styles)
    hacker-effects.css    (animations & effects)
    hacker-responsive.css (mobile adaptations)
  /js/
    hacker-effects.js     (core animations)
    code-fragments.js     (background generation)
  /audio/ (optional)
    keystroke.mp3
```

## Testing Strategy

### Visual Testing
- [ ] Black background renders correctly
- [ ] White text has good contrast
- [ ] Green effects are visible but not overwhelming
- [ ] Animations don't interfere with reading

### Performance Testing
- [ ] GPU usage acceptable (<80%)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Mobile performance acceptable
- [ ] Battery impact minimal

### Accessibility Testing
- [ ] Screen readers can navigate
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards
- [ ] Epilepsy-safe (no rapid flashing)

## Success Criteria

**Visual Impact:**
- ✅ Distinctive hacker aesthetic
- ✅ Animated background enhances rather than distracts
- ✅ Code glitch effects work smoothly
- ✅ Professional yet post-modern feel

**Technical Quality:**
- ✅ 60fps animations on modern devices
- ✅ Graceful degradation on older devices  
- ✅ Accessibility compliant
- ✅ Mobile responsive

**Philosophical Integration:**
- ✅ Aesthetic supports deconstructive themes
- ✅ Technology becomes visible/questioned
- ✅ Platform constraints highlighted through style
- ✅ Digital medium nature emphasized

This plan creates a cohesive hacker aesthetic while maintaining performance and accessibility standards. The modular approach allows for gradual implementation and easy customization.