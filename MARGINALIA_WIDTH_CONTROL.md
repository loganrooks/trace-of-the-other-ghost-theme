# Marginalia Width Control System

## **Problem Solved:**
- **Too-wide marginalia** preventing text wrapping
- **Early intrusion** before reaching viewport center
- **Lack of precise size control**

## **New Width Control Options:**

### **1. Percentage-Based Width Control**
Use `data-width` attribute to set max width as viewport percentage:

```html
<!-- 15% of viewport width - very narrow -->
<div class="marginalia-voice" data-width="15">
Short critical note
</div>

<!-- 20% of viewport width - standard -->
<div class="marginalia-voice" data-width="20">
Medium-length commentary that needs moderate space
</div>

<!-- 25% of viewport width - wider -->
<div class="marginalia-voice" data-width="25">
Longer analytical commentary requiring more breathing room
</div>

<!-- 30% of viewport width - maximum allowed -->
<div class="marginalia-voice" data-width="30">
Extended theoretical discussion that needs substantial space but never blocks text flow
</div>
```

### **2. Size Categories**
Use `data-size` for predefined responsive categories:

```html
<!-- Small: max 100px or 20vw -->
<div class="marginalia-voice" data-size="small">
Brief note
</div>

<!-- Medium: max 120px or 22vw -->
<div class="marginalia-voice" data-size="medium">
Standard commentary length
</div>

<!-- Large: max 140px or 25vw -->
<div class="marginalia-voice" data-size="large">
Extended analysis requiring more space for proper development
</div>
```

### **3. Auto-Sizing (Default)**
System automatically assigns sizes based on content length:
- **< 50 characters**: `data-size="small"` + `data-width="15"`
- **50-100 characters**: `data-size="medium"` + `data-width="20"`
- **100-150 characters**: `data-width="20"`
- **> 150 characters**: `data-size="large"` + `data-width="25"`

## **Width Guarantee System:**

### **Hard Limits**
```css
/* NEVER exceeds 30% of viewport - guarantees text wrapping space */
max-width: min(var(--marginalia-max-width), 30vw) !important;
```

### **Responsive Scaling**
- **Desktop**: Up to specified pixel/percentage limits
- **Tablet**: Max 25vw regardless of data-width
- **Mobile**: Max 22vw, converts to inline blocks

## **Scroll Trigger Precision:**

### **Viewport Center Detection**
```javascript
// Only triggers when element center hits viewport center
rootMargin: '-50% 0px -50% 0px'

// Double-verification with getBoundingClientRect
const viewportCenter = window.innerHeight / 2;
const elementCenter = rect.top + (rect.height / 2);
if (Math.abs(elementCenter - viewportCenter) < 100) {
  // Trigger intrusion
}
```

### **Result**
- **No premature intrusion** - waits for proper scroll position
- **Precise timing** - marginalia appears exactly when text reaches center
- **Smooth experience** - no jarring early appearances

## **Usage Examples:**

### **Philosophy Paper with Varied Commentary**
```html
<!-- Critical interruption - narrow -->
<div class="marginalia-voice" data-position="left" data-voice="3" data-width="15">
But who is this "we"?
</div>

<!-- Citation - medium -->
<div class="marginalia-voice" data-position="right" data-voice="2" data-width="20">
"Every text bears within itself its own possibility of reading otherwise" —Derrida
</div>

<!-- Extended analysis - wider but never blocks text -->
<div class="marginalia-voice" data-position="left" data-voice="1" data-width="25">
The colonial implications of this framework become clear when we consider how "universal" categories consistently exclude non-Western epistemologies
</div>
```

### **Technical Benefits**
- **Text always wraps** around marginalia (70%+ width always available)
- **Responsive design** adapts to all screen sizes
- **Performance optimized** with debounced resize handling
- **Debug mode** available (`Ctrl+Shift+D`) to visualize layout

## **CSS Implementation:**
The system uses CSS `min()` functions to ensure marginalia never becomes too wide:

```css
.marginalia-voice[data-width="20"] { 
  max-width: min(var(--marginalia-max-width, 120px), 20vw); 
}
```

This guarantees text wrapping space while providing precise control over marginalia dimensions.