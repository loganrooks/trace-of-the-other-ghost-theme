# Static Marginalia & Footnote System for Ghost

## Overview
This system provides three types of annotations:
1. **Static Marginalia**: Always visible marginalia voices (no scroll triggers)
2. **Interactive Footnotes**: Hover-triggered marginalia-style popups
3. **Extended Notes**: Ghost callout cards for longer analysis

---

## 1. Static Marginalia HTML Cards

These are always visible and use the simplified static system:

### Edward Said Quote (Academic Citation)
```html
<div class="marginalia-voice" data-position="right" data-voice="2" data-width="25">
<em>"Every time I write 'Israel' or 'Palestine,' I perform a cut in the world. These names are not descriptions but acts of political force."</em><br>—Edward Said
</div>
```

### Self-Critique of "You" (Reflexive Doubt)
```html
<div class="marginalia-voice" data-position="left" data-voice="3" data-width="30">
Already this "you" assumes too much. Who is this subject who begins with particular critique? The comfortable critic? The situated observer? The claim to begin anywhere already claims too much.
</div>
```

### Spinoza Irony (Academic Critique)
```html
<div class="marginalia-voice" data-position="right" data-voice="1" data-width="35">
/* Every appeal to Spinoza in discussions of Israel-Palestine carries its own bitter irony. The philosopher of radical democracy becomes the name of a street in a settlement. His ethics of joy becomes a justification for occupation. How texts travel, how they betray themselves in their applications... */
</div>
```

### Justice in Hebrew/Arabic (Linguistic Analysis)
```html
<div class="marginalia-voice" data-position="right" data-voice="5" data-width="30">
The Hebrew <em>tzedek</em> and Arabic <em>'adl</em> both carry meanings that "justice" doesn't quite capture. <em>Tzedek</em> shares a root with <em>tzaddik</em> (righteous one) and suggests straightness, correctness. <em>'Adl</em> implies balance, equilibrium, setting straight. Both assume something can be made properly aligned.
</div>
```

### Political Urgency (Anger Voice)
```html
<div class="marginalia-voice" data-position="left" data-voice="4" data-width="25">
"WE DEMAND JUSTICE!" CHANTED AT EVERY DEMONSTRATION. BUT WHAT ARRIVES IS ALWAYS LAW, PROCEDURE, COMPROMISE. THE DEMAND REMAINS, INEXHAUSTIBLE. THE MORE LAW WE CREATE, THE MORE JUSTICE WITHDRAWS.
</div>
```

---

## 2. Interactive Footnotes

### In Main Text (Insert in paragraph blocks):
```html
Palestinian resistance takes many forms<sup class="footnote-marker" data-footnote="sumud">1</sup>, but the concept of <em>sumud</em> (steadfastness) offers something unique.
```

### Footnote Definition (Insert as HTML card after paragraph):
```html
<div class="footnote-definition" data-footnote-id="sumud" data-voice="2" data-position="right">
The Arabic word <em>sumud</em> (steadfastness) resists translation. To translate it as "resistance" makes it too active. To translate it as "endurance" makes it too passive. The word does its political work precisely by refusing the active/passive distinction that Western political theory assumes.
</div>
```

### Another Footnote Example:
```html
<!-- In text: -->
Every Palestinian village destroyed in 1948 had a name<sup class="footnote-marker" data-footnote="villages">2</sup>.

<!-- Definition: -->
<div class="footnote-definition" data-footnote-id="villages" data-voice="4" data-position="left">
418 VILLAGES. I HAVE NOT NAMED THEM. CANNOT NAME THEM HERE. THE LIST WOULD BE ANOTHER VIOLENCE—REDUCTION OF LIVED WORLDS TO TOPONYMS. YET NOT LISTING THEM IS ALSO VIOLENCE—ERASURE REDUX. THE APORIA OF WITNESS.
</div>
```

---

## 3. Extended Notes (Ghost Callout Cards)

For longer analysis that doesn't fit in marginalia, use Ghost's built-in callout cards:

### Example: Complex Theoretical Analysis
**Type**: Use Ghost's "💡 Info" callout card
**Content**:
> **On the Violence of Naming**
> 
> The very phrase "Israel-Palestine" performs a cut. "Israel/Palestine" suggests division. "Israel-Palestine" suggests hyphenation. "Historic Palestine" erases. "The Holy Land" sanctifies. Every naming is already a taking of sides.
> 
> Yet we cannot not name. Language requires us to cut, to decide, to perform the violence we critique. This is the impossible situation of writing about impossibility—every word betrays its own conditions.

### Example: Historical Context
**Type**: Use Ghost's "📚 Note" callout card
**Content**:
> **Palestinian ID Card System**
> 
> Green for West Bank residents. Blue for Gaza. Orange for Jerusalem residents who are not citizens. Each color marks a different degree of rightlessness, creating a taxonomy of dispossession that Hannah Arendt would have recognized immediately as the bureaucratic machinery of statelessness.

---

## 4. Data Attributes for Static System

### Required Attributes:
- `data-position`: "left" or "right" 
- `data-voice`: 1-6 (determines styling)
- `data-width`: 15-40 (percentage of available space)

### Optional Attributes:
- `data-font-scale`: 0.4-2.5 (font size multiplier)
- `data-font-size`: Direct CSS font size (e.g., "0.8rem")

### Voice Types:
- **Voice 1** (Green, JetBrains Mono): Technical/systemic critique
- **Voice 2** (Cyan, Share Tech Mono, italic): Quoted theorists, citations
- **Voice 3** (Purple, light weight): Authorial self-doubt, reflexive critique
- **Voice 4** (Red, uppercase): Political urgency, anger
- **Voice 5** (Orange, faded): Historical context, linguistic analysis
- **Voice 6** (Pink, underlined): Questions that challenge the main text

---

## 5. Usage in Ghost Editor

### Step 1: Main Content
Write your main text using Ghost's normal paragraph blocks, headings, etc.

### Step 2: Insert Static Marginalia
Add HTML cards with marginalia content at strategic points. These will always be visible.

### Step 3: Add Interactive Footnotes
- Insert footnote markers in paragraph blocks using `<sup>` tags
- Add footnote definitions as separate HTML cards immediately after the relevant paragraph
- The JavaScript system will create hover interactions

### Step 4: Extended Analysis
Use Ghost's callout cards for longer explanatory content that needs visual prominence.

---

## 6. Complete Example Flow

```html
<!-- Paragraph in Ghost editor -->
Philosophy cannot solve this. These words offer no blueprint for peace<sup class="footnote-marker" data-footnote="philosophy">1</sup>, no roadmap beyond the current horror.

<!-- HTML Card: Footnote Definition -->
<div class="footnote-definition" data-footnote-id="philosophy" data-voice="3" data-position="right">
Here I stopped, unable to write about violence as writing without seeming to aestheticize horror. The theoretical frame threatens to make suffering abstract. Yet isn't this what violence does—inscribe messages on bodies, write sovereignty through blood?
</div>

<!-- HTML Card: Static Marginalia -->
<div class="marginalia-voice" data-position="left" data-voice="2" data-width="30">
Mahmoud Darwish: <em>"We have triumphed. They have transformed us from a Cause into a people, from a people into a Cause, from a Cause into a people..."</em> The transformation never completes, never stabilizes.
</div>
```

This creates a rich layered reading experience where:
- Main text flows naturally
- Static marginalia provide constant commentary
- Footnotes appear on hover for additional context
- Callout cards highlight extended analysis

The system maintains the Digital Talmud philosophy while working within Ghost's technical constraints.