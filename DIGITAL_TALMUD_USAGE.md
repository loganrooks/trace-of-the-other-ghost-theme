# Digital Talmud System Usage Guide

## Overview
The Digital Talmud system allows manual control over marginalia placement using Ghost's HTML card system. Marginalia "glitches" into existence as the user scrolls, and the main text column adapts dynamically.

## Creating Marginalia

### Method 1: HTML Cards in Ghost Editor
1. Add an HTML card in the Ghost editor
2. Use this template:

```html
<div class="marginalia-voice" 
     data-position="left" 
     data-voice="1" 
     data-scroll-trigger="30">
    Your marginal text here
</div>
```

### Method 2: Direct HTML in Content
Insert directly into your post/page content:

```html
<div class="marginalia-voice" 
     data-position="right" 
     data-voice="2" 
     data-scroll-trigger="60">
    # This voice speaks from the right margin
</div>
```

## Data Attributes

### `data-position` (required)
- `left` - Left margin
- `right` - Right margin  
- `top-left` - Top-left corner
- `top-right` - Top-right corner
- `top` - Top margin
- `bottom-left` - Bottom-left corner
- `bottom-right` - Bottom-right corner
- `bottom` - Bottom margin

### `data-voice` (required)
Choose voice styling (1-6):
- `1` - Hacker green, JetBrains Mono
- `2` - Cyan, Share Tech Mono (italic)
- `3` - Purple, JetBrains Mono (light weight)
- `4` - Red, JetBrains Mono (uppercase, small)
- `5` - Orange, Share Tech Mono (faded)
- `6` - Pink, JetBrains Mono (underlined)

### `data-scroll-trigger` (optional)
Percentage of scroll when marginalia appears (0-100)
- Default: Auto-assigned based on order
- Example: `30` = appears when 30% scrolled

## Layout Behavior

The system automatically adjusts layout based on active marginalia:
- **None**: Full width main text
- **Left/Right**: 200px margin, main text adapts
- **Both**: Both margins active, main text squeezed
- **Full**: All positions active, tighter layout
- **Intense**: 6+ marginalia, maximum compression

## Testing Controls

Press these keyboard shortcuts:
- `Ctrl+Shift+D` - Toggle debug mode (shows grid)
- `Ctrl+Shift+M` - Materialize all marginalia
- `Ctrl+Shift+R` - Reset layout

## Example Usage

```html
<!-- Place these throughout your content -->

<div class="marginalia-voice" data-position="left" data-voice="1" data-scroll-trigger="20">
    /* ERROR: This assumption needs questioning */
</div>

<p>Your main text content here...</p>

<div class="marginalia-voice" data-position="right" data-voice="2" data-scroll-trigger="45">
    # Translation note: the original says something different
</div>

<p>More main content...</p>

<div class="marginalia-voice" data-position="left" data-voice="3" data-scroll-trigger="70">
    > Reader response: I disagree with this premise
</div>
```

## Responsive Behavior

- **Desktop**: Full talmudic grid layout
- **Tablet**: Narrower margins, maintains grid
- **Mobile**: Stacks marginalia vertically above/below content

The system maintains the philosophical concept of marginal invasion while adapting to device constraints.