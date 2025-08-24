# Marginalia Migration Guide

## New Pattern-Based Marginalia System

### ✅ **What Changed:**
- **New Syntax**: `[m][voice font-scale width position][content]`
- **Seamless Workflow**: Write marginalia inline with your text
- **AI-Friendly**: Ask AI to rewrite entire posts with marginalia included
- **Copy-Paste Safe**: No HTML blocks to break

### ✅ **Pattern Syntax:**

```
[m][voice font-scale width position][content]

Examples:
[m][2 1.4 40][Edward Said argues this point...]
[m][1 0.8 25 left][Counter-argument from the margin]  
[m][3][Quick note] // Uses defaults
```

**Parameters (all optional):**
- `voice` (1-6): Visual voice/styling (default: 1)
- `font-scale` (0.4-2.5): Font size multiplier (default: 1.0)  
- `width` (15-45): Width percentage of content area (default: 30)
- `position` (left/right/l/r): Side placement (default: right)

### ✅ **Migration Path:**

**Before (HTML blocks):**
```html
<div class="marginalia-voice" data-font-scale="1.4" data-width="40" data-position="right" data-voice="2">
  <em>"Edward Said argues this point"</em>
</div>
```

**After (inline patterns):**
```markdown
The main text continues [m][2 1.4 40 right][Edward Said argues this point] and flows naturally.
```

### ✅ **Backward Compatibility:**
- **Existing HTML blocks still work** - no need to migrate immediately
- **Both systems work together** - mix and match as needed
- **CSS styling unchanged** - same visual appearance

### ✅ **Benefits:**
- **Natural writing flow** - no more breaking text for HTML blocks
- **AI rewriting friendly** - ask AI to process entire posts  
- **Version control friendly** - proper text diffs
- **Copy-paste safe** - no HTML corruption
- **Future-proof** - easy to extend parameters

### ✅ **CSS Width Fix:**
The width calculations now use proper content-area percentages:
- `data-width="40"` = 40% of content area (not fixed 200px)
- Responsive across all screen sizes
- Proper visual balance with main text

### ✅ **System Integration:**
- Processes **before** extensions and footnotes  
- Compatible with `[+][content]` extensions
- Compatible with `[^N]` footnotes
- Maintains tooltip functionality

### ✅ **Advanced Usage:**

**Complex marginalia with markdown:**
```
[m][3 1.2 35 left][**Critical point**: This *undermines* the main [argument](link)]
```

**Multiline marginalia (line breaks automatically handled):**
```
[m][2 1.4 40 r]["Every time I write 'Israel' or 'Palestine,' I perform a cut in the world. 
These names are not descriptions but acts of political force."
—Edward Said[^2]]
```

**Multiple marginalia in same paragraph:**
```
Main text [m][1][First note] continues with more content [m][2 0.8 20][Second smaller note] and concludes.
```

**Different voices for different perspectives:**
```
[m][1 1.0 30][Author's perspective]
[m][2 1.0 30][Critic's response] 
[m][3 1.0 30][Reader's question]
```

**Short position forms:**
```
[m][2 1.0 30 l][Left margin note]
[m][1 1.2 40 r][Right margin note]
```