# Deconstruction Processor - Ghost Editor Examples

## How to Use in Ghost Editor

These examples show HTML patterns that can be pasted into HTML cards in the Ghost editor to create radical deconstruction effects.

### 1. Dissolution Effect

Text gradually breaks apart with character drift and fading.

```html
<div data-deconstruct="dissolve" data-speed="slow">
    <strong>[voice uncertain, perhaps the text speaking to itself]</strong>
    What happens when the remainder returns? When the supplement becomes primary? 
    These words dissolve as they question their own authority.
</div>
```

**Parameters:**
- `data-speed`: `slow` | `normal` | `fast`
- `data-direction`: `down` | `up` | `scatter`

### 2. Language Collision Effect

RTL/LTR text barriers and conflicts at language boundaries.

```html
<div data-deconstruct="collision" data-languages="he,ar,en">
    <strong>[languages colliding at the barrier]</strong>
    <span lang="en">Machsom</span> 
    <span lang="he" dir="rtl">מחסום</span> 
    <span lang="en">checkpoint</span> 
    <span lang="ar" dir="rtl">حاجز</span>
    <span lang="en">— where meaning breaks</span>
</div>
```

**Parameters:**
- `data-languages`: Comma-separated language codes
- `data-intensity`: `mild` | `moderate` | `severe`

### 3. Recursive Commentary Effect

Infinite regression of voices commenting on themselves.

```html
<div data-deconstruct="recursion" data-depth="4">
    <strong>[infinite regression speaking itself]</strong>
    The critique of critique of critique reveals the impossibility of 
    pure critique, which itself becomes the object of critique.
</div>
```

**Parameters:**
- `data-depth`: `1` to `5` (number of recursive levels)
- `data-style`: `nested` | `spiral` | `fractal`

### 4. Voice Interruption Effect

Multiple voices interrupting and arguing with each other.

```html
<div data-deconstruct="voices" data-mode="interrupt">
    <span data-voice="uncertain">What happens when philosophy—</span>
    <span data-voice="critical" data-interrupts="true">Making particular into universal.</span>
    <span data-voice="uncertain">—tries to speak the unspeakable?</span>
    <span data-voice="angry" data-interrupts="true">While Palestinians die!</span>
    <span data-voice="uncertain">The remainder always returns...</span>
</div>
```

**Parameters:**
- `data-mode`: `interrupt` | `overlap` | `argue`
- `data-voice`: `uncertain` | `critical` | `nostalgic` | `angry`
- `data-interrupts`: `true` | `false`

### 5. Temporal Instability Effect

Text changes over time, words "forget" themselves.

```html
<div data-deconstruct="temporal" data-decay="true">
    <strong>[temporal confusion]</strong>
    These words appear while others disappear, creating a palimpsest 
    of meaning where past and present collapse into each other.
    What remains when memory fails?
</div>
```

**Parameters:**
- `data-decay`: `true` | `false`
- `data-rate`: `slow` | `normal` | `fast`

### 6. Syntactic Breakdown Effect

Grammar dissolves, punctuation drifts away from meaning.

```html
<div data-deconstruct="syntax" data-fragment="true" data-severity="moderate">
    <strong>[syntax abandoning itself]</strong>
    While... trying to... maintain coherence, the very structure 
    of language breaks down! Words drift? Meaning scatters. 
    What remains: fragments, traces, the impossible remainder.
</div>
```

**Parameters:**
- `data-fragment`: `true` | `false`
- `data-severity`: `mild` | `moderate` | `severe`

## Advanced Examples

### Complex Deconstruction Scene

Combine multiple effects in a philosophical narrative:

```html
<div data-deconstruct="dissolve" data-speed="slow">
    <strong>[the text questions itself]</strong>
    Philosophy attempts to speak the universal, but—
</div>

<div data-deconstruct="voices" data-mode="interrupt">
    <span data-voice="critical" data-interrupts="true">While children starve in Gaza!</span>
    <span data-voice="uncertain">—the particular always returns to haunt the concept.</span>
</div>

<div data-deconstruct="collision" data-languages="he,ar,en">
    <strong>[at the checkpoint of meaning]</strong>
    <span lang="en">Identity</span> 
    <span lang="he" dir="rtl">זהות</span> 
    <span lang="ar" dir="rtl">هوية</span>
    <span lang="en">breaks at the border</span>
</div>

<div data-deconstruct="recursion" data-depth="3">
    <strong>[the critique critiquing its own critique]</strong>
    Every attempt to think justice produces its own exclusions,
    which themselves demand justice, infinitely.
</div>

<div data-deconstruct="temporal" data-decay="true">
    <strong>[time dissolving]</strong>
    What was written? What will be written? The text forgets 
    itself even as it insists on its presence.
</div>
```

### Conclusion Perhaps

For the most radical effects, recreate sections from `conclusion_perhaps.md`:

```html
<div data-deconstruct="syntax" data-fragment="true" data-severity="severe">
    <strong>[THE TEXT STOPS. WHAT FOLLOWS ARE FRAGMENTS]</strong>
    While— The typography itself bears witness to a violence discovered too late.
</div>

<div data-deconstruct="voices" data-mode="argue">
    <span data-voice="uncertain">Posted to Instagram, 11:47 PM. By midnight—</span>
    <span data-voice="angry" data-interrupts="true">"Where is Fanon? Where is Said?"</span>
    <span data-voice="uncertain">—the exclusions were unbearable.</span>
    <span data-voice="critical" data-interrupts="true">Are Palestinians only objects of analysis?</span>
    <span data-voice="angry" data-interrupts="true">Never subjects of thought?</span>
</div>

<div data-deconstruct="collision" data-languages="he,ar,en">
    <strong>[collision at the border of comprehension]</strong>
    <span lang="en">The</span>
    <span lang="he" dir="rtl">גבול</span>
    <span lang="en">border</span>
    <span lang="ar" dir="rtl">الحدود</span>
    <span lang="en">that</span>
    <span lang="he" dir="rtl">מפריד</span>
    <span lang="en">separates</span>
</div>
```

## Testing and Debugging

### Enable Deconstruction
1. In Ghost Admin → Design & branding → Theme settings
2. Enable "Deconstruction Effects" toggle
3. Save settings

### Debug Mode
Add `data-debug="true"` to any deconstruction element:

```html
<div data-deconstruct="dissolve" data-debug="true">
    Debug information will appear for this element
</div>
```

### Browser Console Commands
When debug mode is enabled:
- `window.ContentEnhancementSystem.debug()` - System overview
- `window.DeconstructionProcessor.debug()` - Deconstruction details
- `debugThemeConfig()` - Configuration inspection

## Accessibility Notes

- All effects respect `prefers-reduced-motion`
- Static fallback indicators show effect types
- Print styles remove all animations
- High contrast mode enhances visibility

## Performance Considerations

- Effects use Intersection Observer for lazy loading
- Maximum 10 active effects at once
- 16ms throttling prevents frame drops
- GPU acceleration via `transform3d()`

The deconstruction processor embodies deconstructive philosophy by literally performing deconstruction on text, not just describing it. Each effect questions the stability of meaning, presence, and textual authority.