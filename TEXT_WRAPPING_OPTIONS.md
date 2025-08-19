# Text Wrapping & Marginalia Box Options

## ✅ **SOLUTION IMPLEMENTED: Float + CSS Shapes**

**New Theme Package:** `trace-of-the-other-20250819-1910.zip` (19K)

## **Key Changes Made:**

### 1. **TRUE TEXT WRAPPING** 🌊
- **Switched from absolute positioning to CSS float**
- **Text now flows around marginalia naturally**
- **CSS Shapes (`shape-outside: margin-box`) for precise wrapping**
- **Shape margins create proper spacing around marginalia**

### 2. **ADAPTIVE BOX SIZING** 📏
- **Auto-width boxes**: `width: fit-content` adapts to content
- **Smart constraints**: `min-width: 120px`, `max-width: 250px`
- **Size variations**: `data-size="small"` / `data-size="large"` for manual control
- **Content-aware sizing**: JavaScript automatically detects content length and adjusts

### 3. **WIDER MARGINS FOR SPACE** 🏛️
- **Desktop**: 300px margins each side (much wider)
- **Laptop**: 200px margins
- **Tablet**: 120px margins  
- **Mobile**: Marginalia becomes inline blocks

### 4. **RESPONSIVE TEXT SIZING** 📱
- **Long content**: Font size automatically reduces to fit
- **CSS custom properties**: `--content-length` variable controls scaling
- **Breakpoint adaptations**: Different sizes for different screen widths

## **Available Control Options:**

### **Manual Box Size Control**
```html
<!-- Small marginalia -->
<div class="marginalia-voice" data-position="left" data-voice="1" data-size="small">
Short note
</div>

<!-- Large marginalia -->  
<div class="marginalia-voice" data-position="right" data-voice="2" data-size="large">
Longer commentary that needs more space to breathe and develop its argument properly
</div>
```

### **Automatic Sizing**
- **< 80 characters**: Auto-assigned `data-size="small"`
- **> 200 characters**: Auto-assigned `data-size="large"`  
- **Font size**: Scales down based on content length

### **Position-Based Flow**
- **`data-position="left"`**: Floats left, text wraps around right side
- **`data-position="right"`**: Floats right, text wraps around left side
- **Perfect Talmudic layout**: Text flows naturally around commentary

## **Visual Effects:**

### **Materialization Animation**
- **Glitch-in effect** when marginalia appears
- **Text reflow animation** - subtle shift as text adjusts around new marginalia
- **Performance optimized** with `requestAnimationFrame`

### **Hover Interactions**
- **Scale up** on hover
- **Increased border thickness**
- **Glow effect** maintains voice color identity

## **Mobile Adaptations:**
- **768px and below**: Marginalia becomes inline blocks between paragraphs
- **No text wrapping on mobile** - cleaner linear reading experience
- **Auto-centered** marginalia maintains visual hierarchy

## **Testing Commands:**
- **`Ctrl+Shift+M`**: Materialize all marginalia instantly
- **`Ctrl+Shift+R`**: Reset all marginalia to hidden state
- **`Ctrl+Shift+D`**: Toggle debug mode to see layout structure

This creates the **authentic Talmudic commentary experience** where marginal voices truly interrupt and reshape the main text's flow, rather than just sitting alongside it.