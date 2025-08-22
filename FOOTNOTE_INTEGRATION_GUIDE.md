# Digital Talmud Footnote System - Integration Guide

## Architecture Overview

The footnote system uses a **separated concerns architecture** for maximum maintainability and futurity:

```
┌─ Configuration Layer (footnote-config.js)
│  ├─ Behavior settings
│  ├─ Theme definitions  
│  └─ Processing rules
│
├─ Visual Layer (footnote-themes.css)
│  ├─ Pure CSS styling
│  ├─ CSS custom properties
│  └─ Theme variants
│
└─ Logic Layer (footnote-system.js)
   ├─ Pure functionality
   ├─ Event handling
   └─ DOM manipulation
```

## Benefits of This Architecture

### ✅ **Future-Proof**
- Change visual styling without touching JavaScript
- Add new themes by modifying CSS custom properties
- Modify behavior through configuration, not code

### ✅ **Maintainable**  
- Clear separation of concerns
- Each layer has single responsibility
- Easy to debug and extend

### ✅ **Configurable**
- Theme switching via configuration
- Behavior modification without code changes
- Easy customization for different use cases

### ✅ **Writer-Friendly**
- Simple `[^1]` + HTML card workflow
- No complexity added to writing process
- Progressive enhancement ensures accessibility

## File Integration

### 1. Add to `default.hbs` (before closing `</body>`)

```html
<!-- Footnote System Configuration -->
<script src="{{asset "js/footnote-config.js"}}"></script>

<!-- Footnote System Logic -->
<script src="{{asset "js/footnote-system.js"}}"></script>

<!-- Load footnote themes CSS -->
<link rel="stylesheet" href="{{asset "css/footnote-themes.css"}}">
```

### 2. Optional: Theme Integration in `default.hbs`

```html
<script>
// Configure footnote theme based on site settings
document.addEventListener('DOMContentLoaded', () => {
  // Auto-detect theme or set manually
  const theme = document.body.dataset.theme || 'hacker';
  window.DigitalTalmudFootnoteConfig.applyTheme(theme);
});
</script>
```

### 3. Writer Workflow (No Change Required)

Writers continue to use the simple workflow:

**In Paragraph Blocks:**
```
Philosophy cannot solve this problem[^1]. These words offer no blueprint for peace[^2].
```

**In HTML Cards:**
```html
<div data-ref="1">This aporia isn't just theoretical...</div>
<div data-ref="2">The theoretical frameworks are insufficient...</div>
```

## Customization Examples

### Change Theme Instantly

```javascript
// Switch to academic theme
window.DigitalTalmudFootnoteConfig.applyTheme('academic');

// Switch to minimal theme  
window.DigitalTalmudFootnoteConfig.applyTheme('minimal');

// Switch back to hacker theme
window.DigitalTalmudFootnoteConfig.applyTheme('hacker');
```

### Custom Theme Creation

```javascript
// Add new theme to config
window.DigitalTalmudFootnoteConfig.themes.custom = {
  '--footnote-accent': '#purple',
  '--footnote-accent-dark': '#darkpurple', 
  '--footnote-font': 'Comic Sans MS',
  // ... other properties
};

// Apply custom theme
window.DigitalTalmudFootnoteConfig.applyTheme('custom');
```

### Behavior Modification

```javascript
// Disable tooltips site-wide
window.DigitalTalmudFootnoteConfig.behavior.enableTooltips = false;

// Change scroll behavior  
window.DigitalTalmudFootnoteConfig.behavior.scrollOffset = 'start';

// Disable smooth scrolling
window.DigitalTalmudFootnoteConfig.behavior.enableSmoothScrolling = false;
```

### Visual Customization via CSS

```css
/* Override theme colors globally */
:root {
  --footnote-accent: #your-brand-color;
  --footnote-font: 'Your-Font', sans-serif;
}

/* Page-specific theme */
.special-page {
  --footnote-accent: #special-color;
}

/* Custom footnote sizes */
.large-footnotes {
  --footnote-ref-size: 1em;
  --footnote-tooltip-max-width: 400px;
}
```

## Migration from Old System

### If You Have the Old `digital-talmud-ghost-compatible.js`:

1. **Remove** the old file
2. **Add** the three new files (config, themes, system)  
3. **Update** `default.hbs` with new script tags
4. **Content remains unchanged** - existing `[^1]` + `data-ref` will work

### CSS Migration:

1. **Old footnote CSS** can be removed from `digital-talmud.css`
2. **New CSS** is in separate `footnote-themes.css` file
3. **Theming** now controlled via CSS custom properties

## Advanced Configuration

### Create Site-Specific Config

```javascript
// Override default config
window.DigitalTalmudFootnoteConfig = {
  ...window.DigitalTalmudFootnoteConfig,
  behavior: {
    ...window.DigitalTalmudFootnoteConfig.behavior,
    enableTooltips: false, // Disable for this site
    tooltipDelay: 0 // Instant tooltips
  },
  themes: {
    ...window.DigitalTalmudFootnoteConfig.themes,
    'site-custom': {
      '--footnote-accent': '#your-color',
      // ... custom theme properties
    }
  }
};
```

### Per-Post Configuration

```javascript
// In specific post template
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('post-template-special')) {
    window.DigitalTalmudFootnoteConfig.applyTheme('academic');
  }
});
```

## Performance Considerations

### The new architecture is more performant:

- **CSS-first styling**: Faster rendering, fewer JavaScript style calculations
- **Configuration caching**: Themes loaded once, applied via CSS variables
- **Modular loading**: Only load what you need
- **Progressive enhancement**: Basic functionality without JavaScript

### Loading Strategy:

```html
<!-- Load config first (required) -->
<script src="{{asset "js/footnote-config.js"}}"></script>

<!-- CSS can be loaded asynchonously -->  
<link rel="stylesheet" href="{{asset "css/footnote-themes.css"}}" media="print" onload="this.media='all'">

<!-- System loads last (uses config) -->
<script src="{{asset "js/footnote-system.js"}}" defer></script>
```

## Debugging

### Debug Commands:

```javascript
// Debug current system
window.debugFootnotes();

// Check configuration
window.DigitalTalmudFootnoteConfig.validate();

// Apply theme with logging
window.DigitalTalmudFootnoteConfig.applyTheme('hacker');
```

### Console Commands:

- `Ctrl+Shift+G`: Full system debug (if old system present)
- `F12 → Console → debugFootnotes()`: New system debug

## Future Extensions

### Easy to Add:

1. **New Themes**: Just add to `themes` object in config
2. **New Behaviors**: Extend `behavior` config section  
3. **Custom CSS**: Override CSS custom properties
4. **Plugins**: Extend FootnoteSystem class

### Example Plugin:

```javascript
class FootnoteSystemWithAnalytics extends FootnoteSystem {
  navigateToFootnote(elementId) {
    // Track footnote clicks
    if (window.gtag) {
      gtag('event', 'footnote_click', {
        footnote_id: elementId
      });
    }
    
    // Call original method
    super.navigateToFootnote(elementId);
  }
}
```

## Summary

This architecture provides:

- **Zero complexity** added to writing workflow
- **Complete visual control** via CSS custom properties  
- **Behavioral configuration** without code changes
- **Future-proof extensibility** through modular design
- **Progressive enhancement** for accessibility
- **Performance optimization** through CSS-first approach

The system respects Ghost's constraints while providing a professional, accessible, and highly customizable footnote experience that can evolve with your needs.