# Enhanced Voice Effects Usage

The voice effects now support **individual voice-level** customization for text size, animation timing, and visual intensity.

## Basic Usage

```html
<div data-deconstruct="voices" data-mode="interrupt">
  <span data-voice="uncertain">What happens when philosophy—</span>
  <span data-voice="critical" data-interrupts="true">Making particular into universal.</span>
  <span data-voice="uncertain">tries to speak the unspeakable?</span>
</div>
```

## Voice Modes

Control how voices interact with each other using `data-mode`:

```html
<!-- Sequential interruptions (default) -->
<div data-deconstruct="voices" data-mode="interrupt">
  <span data-voice="uncertain">What happens when—</span>
  <span data-voice="critical" data-interrupts="true">Making particular into universal.</span>
  <span data-voice="uncertain">—philosophy tries to speak?</span>
</div>

<!-- Overlapping voices -->
<div data-deconstruct="voices" data-mode="overlap">
  <span data-voice="critical">The critique of presence</span>
  <span data-voice="nostalgic">always already deferred</span>
  <span data-voice="uncertain">in the play of différance</span>
</div>

<!-- Argumentative voices -->
<div data-deconstruct="voices" data-mode="argue">
  <span data-voice="critical">Deconstruction is not nihilism!</span>
  <span data-voice="uncertain">But what remains?</span>
  <span data-voice="angry">Nothing remains!</span>
</div>

<!-- Cascading waterfall -->
<div data-deconstruct="voices" data-mode="cascade">
  <span data-voice="nostalgic">Trace</span>
  <span data-voice="uncertain">of trace</span>
  <span data-voice="critical">of trace...</span>
</div>

<!-- Simultaneous appearance -->
<div data-deconstruct="voices" data-mode="simultaneous">
  <span data-voice="uncertain">All</span>
  <span data-voice="critical">voices</span>
  <span data-voice="nostalgic">at</span>
  <span data-voice="angry">once</span>
</div>
```

**Available Modes:**
- `interrupt` (default): Sequential interruptions with staggered timing
- `overlap`: Voices overlap heavily with shorter delays
- `argue`: Chaotic debate pattern with alternating fast/slow timing
- `cascade`: Rapid waterfall effect with diagonal positioning  
- `simultaneous`: All voices appear together

## Individual Voice Control

Each voice span can have its own parameters for nuanced philosophical expression:

### Per-Voice Text Size

```html
<div data-deconstruct="voices">
  <span data-voice="uncertain" data-size="small">whispered doubt</span>
  <span data-voice="critical" data-size="large">BOLD CRITIQUE</span>
  <span data-voice="nostalgic" data-size="tiny">fading memory...</span>
</div>
```

### Per-Voice Animation Timing

```html
<div data-deconstruct="voices">
  <span data-voice="uncertain" data-delay="fast">Quick interruption—</span>
  <span data-voice="critical" data-delay="slow">Deliberate. Measured. Intervention.</span>
  <span data-voice="nostalgic" data-delay="very-slow">Slow... remembering...</span>
</div>
```

### Per-Voice Intensity (Scale Effect)

```html
<div data-deconstruct="voices">
  <span data-voice="critical" data-intensity="1.1">Emphasized presence</span>
  <span data-voice="uncertain" data-intensity="0.8">Diminished, uncertain</span>
</div>
```

**Size Options:**
- `tiny`: 0.6em
- `small`: 0.8em
- `normal`: 1em (default)
- `large`: 1.2em
- `xl`: 1.4em
- Custom: Any valid CSS size unit (em, rem, px, %)

### Animation Timing Control

Use `data-delay` to control animation speed and voice staggering:

```html
<!-- Predefined delays -->
<div data-deconstruct="voices" data-delay="fast">...</div>
<div data-deconstruct="voices" data-delay="normal">...</div>  <!-- default -->
<div data-deconstruct="voices" data-delay="slow">...</div>
<div data-deconstruct="voices" data-delay="very-slow">...</div>

<!-- Custom CSS durations -->
<div data-deconstruct="voices" data-delay="2.5s">...</div>
<div data-deconstruct="voices" data-delay="750ms">...</div>
```

**Delay Options:**
- `fast`: 1.5s duration, 0.2s voice stagger
- `normal`: 3s duration, 0.5s voice stagger (default)
- `slow`: 5s duration, 0.8s voice stagger
- `very-slow`: 8s duration, 0.8s voice stagger
- Custom: Any valid CSS duration (s, ms)

### Combined Individual Parameters

```html
<div data-deconstruct="voices">
  <span data-voice="uncertain" data-size="small" data-delay="fast" data-intensity="0.8">
    The critique of presence—
  </span>
  <span data-voice="critical" data-size="large" data-delay="slow" data-intensity="1.2" data-interrupts="true">
    Always already deferred.
  </span>
  <span data-voice="nostalgic" data-size="tiny" data-delay="very-slow" data-intensity="0.7">
    What remains of the remainder?
  </span>
</div>
```

### Container Defaults with Individual Overrides

```html
<!-- Container sets defaults, individual voices can override -->
<div data-deconstruct="voices" data-size="normal" data-delay="normal">
  <span data-voice="uncertain">Uses container defaults</span>
  <span data-voice="critical" data-size="large" data-delay="slow">Overrides both parameters</span>
  <span data-voice="nostalgic" data-size="tiny">Overrides only size, inherits delay</span>
</div>
```

## Available Voice Types

- `uncertain` (gray #888)
- `critical` (red #ff4444) 
- `nostalgic` (purple #8844ff)
- `angry` (red #ff0000)

## Features Removed

- ✅ **No more "VOICES" label** - Effects speak for themselves without explicit labeling
- ✅ **Clean visual presentation** - Focus on the philosophical content, not the technical apparatus

### New: Intensity Parameter

Control the visual emphasis/scale of individual voices:

```html
<span data-voice="critical" data-intensity="1.3">Amplified critique</span>
<span data-voice="uncertain" data-intensity="0.6">Barely present doubt</span>
```

**Intensity Values:**
- `< 1.0`: Smaller, less prominent (e.g., `0.7`, `0.8`)
- `1.0`: Normal size (default)
- `> 1.0`: Larger, more prominent (e.g., `1.2`, `1.5`)

## Technical Implementation

The enhanced system:
- Sets CSS custom properties `--voice-size`, `--voice-duration`, and `--voice-intensity` on **individual voice spans**
- Applies staggered `--interrupt-delay` calculated per voice based on its timing preferences
- Supports both predefined keywords and custom CSS values
- Container-level defaults with per-voice overrides
- Maintains backward compatibility (existing usage continues to work)