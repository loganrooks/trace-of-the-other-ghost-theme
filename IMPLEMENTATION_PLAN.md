# Ghost Theme Implementation Plan: trace-of-the-other

## Current State Analysis

### Critical Issues
1. **7 Ghost validation errors** preventing proper theme activation
2. **Over-engineered complexity** - too many dynamic features, confusing UX
3. **Poor typography/styling** - needs clean literary aesthetic
4. **Page darkening bug** - unintended visual effects
5. **Cannot display example_post.md** - theme not functional

### User Requirements
- Clean, literary design aesthetic
- Different fonts for different marginal voices
- Static implementation first, then gradual dynamic features
- Modular, best-practices architecture
- Working Ghost theme for immediate use

## Phase 1: Fix Critical Errors (30 minutes)

### 1.1 Fix Ghost Validation Errors

**File: default.hbs**
- [ ] Remove line 7: `<meta name="description" content="{{meta_description}}">`
- [ ] Change line 8: Replace `{{@version}}` with just "Ghost"
- [ ] Change line 169: Remove `{{@version}}` reference

**File: package.json**
```json
// Fix custom config types - change all to valid types:
"custom": {
    "margin_voices": {
        "type": "boolean",  // Was missing type
        "default": false
    },
    "navigation_layout": {
        "type": "select",  // Remove if unused
        "options": ["traditional", "rhizomatic"],
        "default": "traditional"
    }
}
```

**File: assets/css/main.css (NEW)**
```css
/* Required Koenig editor classes */
.kg-width-wide {
    max-width: 85vw;
    width: 85vw;
    margin-left: calc((850px - 100vw) / 2);
    margin-right: calc((850px - 100vw) / 2);
}

.kg-width-full {
    max-width: 100vw;
    width: 100vw;
    margin-left: calc((850px - 100vw) / 2);
    margin-right: calc((850px - 100vw) / 2);
}
```

**File: page.hbs**
- [ ] Add support for `{{#if @page.show_title_and_feature_image}}`
- [ ] Remove `{{@version}}` references

### 1.2 Testing Phase 1
```bash
# Test locally
ghost install local
ghost start
# Upload theme zip
# Check Ghost Admin > Settings > Design
# Verify all validation errors are resolved
```

## Phase 2: Simplify Architecture (45 minutes)

### 2.1 Create Minimal Template Structure

**Keep only essential files:**
```
/trace-of-the-other/
├── package.json (simplified)
├── default.hbs (minimal)
├── index.hbs (simple loop)
├── post.hbs (with marginalia support)
├── page.hbs (basic)
├── /assets/
│   ├── /css/
│   │   ├── main.css (primary styles)
│   │   ├── typography.css (fonts)
│   │   └── marginalia.css (voices)
│   └── /fonts/ (literary typefaces)
└── /partials/
    └── marginalia.hbs (static only)
```

**Remove these files:**
- All JavaScript files (initially)
- aporias.css, traces.css (too complex)
- All test files
- Complex partials (footnotes, ghosts, palimpsest)

### 2.2 Simplified package.json
```json
{
    "name": "trace-of-the-other",
    "description": "A literary Ghost theme with marginal voices",
    "version": "0.2.0",
    "engines": {
        "ghost": ">=5.0.0"
    },
    "author": {
        "name": "Author Name"
    },
    "config": {
        "posts_per_page": 10,
        "custom": {
            "show_marginalia": {
                "type": "boolean",
                "default": true
            }
        }
    }
}
```

## Phase 3: Literary Typography System (1 hour)

### 3.1 Font Strategy

**Base Typography (main.css):**
```css
/* Literary base font */
body {
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 18px;
    line-height: 1.7;
    color: #1a1a1a;
    background: #fdfdf8;
    max-width: 750px;
    margin: 0 auto;
    padding: 2rem;
}

/* No darkening, clean background */
* {
    background-color: transparent !important;
}

/* Main content */
.post-content {
    font-size: 1.1rem;
    line-height: 1.8;
}

h1, h2, h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 400;
}
```

**Marginal Voices (marginalia.css):**
```css
/* Different fonts for different voices */
.margin-voice {
    position: absolute;
    width: 200px;
    font-size: 0.9rem;
    line-height: 1.4;
    color: #666;
}

.margin-left {
    left: -220px;
}

.margin-right {
    right: -220px;
}

/* Voice personalities through typography */
.voice-critic {
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    color: #8b0000;
}

.voice-translator {
    font-family: 'Libre Baskerville', serif;
    font-style: italic;
    color: #4a4a4a;
}

.voice-reader {
    font-family: 'Open Sans', sans-serif;
    font-size: 0.8rem;
    color: #666;
}

.voice-ghost {
    font-family: 'Crimson Text', serif;
    opacity: 0.6;
    color: #999;
}

/* Responsive: Stack margins on mobile */
@media (max-width: 1200px) {
    .margin-voice {
        position: static;
        width: 100%;
        margin: 1rem 0;
        padding: 1rem;
        border-left: 3px solid #ddd;
        background: #f9f9f9;
    }
}
```

### 3.2 Font Loading
```html
<!-- In default.hbs <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital@0;1&family=Playfair+Display&family=Libre+Baskerville:ital@1&family=Open+Sans&display=swap" rel="stylesheet">
```

## Phase 4: Static Marginalia Implementation (45 minutes)

### 4.1 Post Template with Marginalia

**post.hbs:**
```handlebars
{{!< default}}

<article class="post-full {{post_class}}">
    <header class="post-header">
        <h1 class="post-title">{{title}}</h1>
        <div class="post-meta">
            <time datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time>
            {{#primary_author}}<span class="post-author">{{name}}</span>{{/primary_author}}
        </div>
    </header>

    <div class="post-content-wrapper">
        <div class="post-content">
            {{content}}
        </div>
        
        {{#if @custom.show_marginalia}}
        <aside class="marginalia-container">
            {{> "marginalia"}}
        </aside>
        {{/if}}
    </div>
</article>
```

**partials/marginalia.hbs:**
```handlebars
{{!-- Static marginalia voices --}}
<div class="margin-voice margin-left voice-critic">
    But who determines what is "content" and what is "marginal"?
</div>

<div class="margin-voice margin-right voice-translator">
    The word "post" implies completion, but texts are never finished.
</div>

{{!-- Parse content for data attributes --}}
{{#contentFor "marginalia-script"}}
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Find paragraphs with margin data
    const paragraphs = document.querySelectorAll('[data-margin-left], [data-margin-right]');
    
    paragraphs.forEach(p => {
        if (p.dataset.marginLeft) {
            const leftVoice = document.createElement('div');
            leftVoice.className = 'margin-voice margin-left voice-dynamic';
            leftVoice.textContent = p.dataset.marginLeft;
            p.style.position = 'relative';
            p.appendChild(leftVoice);
        }
        
        if (p.dataset.marginRight) {
            const rightVoice = document.createElement('div');
            rightVoice.className = 'margin-voice margin-right voice-dynamic';
            rightVoice.textContent = p.dataset.marginRight;
            p.style.position = 'relative';
            p.appendChild(rightVoice);
        }
    });
});
</script>
{{/contentFor}}
```

## Phase 5: Testing Strategy (30 minutes)

### 5.1 Local Testing Protocol

```bash
# 1. Create test Ghost instance
ghost install local --dir ghost-test
cd ghost-test
ghost start

# 2. Build theme
cd ../trace-of-the-other
npm init -y
zip -r trace-of-the-other.zip . -x "*.git*" -x "test/*" -x "*.md"

# 3. Upload and activate theme
# Ghost Admin > Settings > Design > Upload Theme

# 4. Create test post with marginalia
# Use example_post.md content
```

### 5.2 Test Checklist

**Validation Tests:**
- [ ] No errors in Ghost theme validator
- [ ] Theme activates successfully
- [ ] All templates render without errors

**Visual Tests:**
- [ ] Clean literary typography displays correctly
- [ ] No page darkening occurs
- [ ] Margins display on desktop (beside content)
- [ ] Margins stack properly on mobile
- [ ] Different voice fonts are distinguishable

**Content Tests:**
- [ ] example_post.md displays correctly
- [ ] Marginalia appears for marked paragraphs
- [ ] Navigation works
- [ ] Post metadata displays

**Browser Tests:**
- [ ] Chrome: Full functionality
- [ ] Firefox: Full functionality
- [ ] Safari: Full functionality
- [ ] Mobile: Responsive layout works

## Phase 6: Incremental Feature Roadmap

### Stage 1: Foundation (Current)
- Clean, working Ghost theme
- Static marginalia with different fonts
- Literary typography
- Mobile responsive

### Stage 2: Enhanced Marginalia (Week 2)
- Dynamic margin loading from post metadata
- Multiple voice types
- Margin density controls
- Print styles for marginalia

### Stage 3: Subtle Palimpsest (Week 3)
- CSS-only text layers
- Hover reveals for erased text
- Revision indicators
- No JavaScript required

### Stage 4: Gentle Dynamism (Week 4)
- Subtle fade-in effects
- Lazy loading for margins
- Reading progress indicators
- Minimal JavaScript

### Stage 5: Philosophy Features (Month 2)
- Temporal disruption (opt-in)
- Platform limitation markers
- Supplement mechanics
- Full pharmakon system

## Implementation Sequence

1. **Backup current work:** `git add . && git commit -m "backup: complex version"`
2. **Create clean branch:** `git checkout -b simplified-theme`
3. **Execute Phase 1:** Fix all Ghost validation errors (30 min)
4. **Test Phase 1:** Verify errors resolved
5. **Execute Phase 2:** Simplify file structure (45 min)
6. **Execute Phase 3:** Implement typography system (1 hour)
7. **Execute Phase 4:** Add static marginalia (45 min)
8. **Execute Phase 5:** Complete testing (30 min)
9. **Deploy:** Upload to Ghost instance
10. **Document:** Update README with setup instructions

## Success Criteria

### Immediate (Day 1)
- ✅ Ghost theme validates without errors
- ✅ Theme displays example_post.md correctly
- ✅ Marginalia shows with different fonts
- ✅ Clean literary design (no darkening)
- ✅ Mobile responsive

### Short-term (Week 1)
- ✅ Modular CSS architecture
- ✅ Clear separation of concerns
- ✅ Documentation for customization
- ✅ Performance optimized

### Long-term (Month 1)
- ✅ Progressive enhancement path clear
- ✅ Philosophy features can be added incrementally
- ✅ Theme is maintainable by others
- ✅ Best practices followed throughout

## Emergency Fallback

If issues persist, create minimal viable theme:
1. Use Ghost's Casper theme as base
2. Add only marginalia.css overlay
3. Modify post.hbs for margin support
4. Deploy immediately, enhance later

---

This plan is designed to be executed by any developer or AI assistant. Each phase has clear objectives, specific code changes, and testing criteria. The approach prioritizes getting a working theme first, then adding sophistication gradually.