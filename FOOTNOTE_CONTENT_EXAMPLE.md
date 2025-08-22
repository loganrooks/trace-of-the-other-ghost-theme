# Correct Footnote Content Format

## Your paragraph (correct):
```
The Palestinian poet Mahmoud Darwish once wrote of being "present at the absence of a place."[^1] This paradox—presence at absence—captures something philosophy usually flees from.
```

## Your footnote content should be:
```html
<div data-ref="1">
Mahmoud Darwish, "present at the absence of a place." This phrase appears in various translations of Darwish's work, most prominently in In the Presence of Absence (Fi Hadrat al-Ghiyab), trans. Sinan Antoon (Archipelago Books, 2011). The formulation echoes throughout his oeuvre, particularly in poems dealing with exile and return. The exact phrasing shifts in translation—sometimes "present at the absence of a place," sometimes "presence in absence," sometimes "I am present at my absence." The Arabic original carries resonances that no English translation fully captures: hadrat means both presence and a sacred or revered state, while ghiyab suggests not mere absence but a kind of active disappearance, an occultation.
</div>
```

## Key changes:
- Remove `<strong>¹</strong>` - the system adds footnote numbers automatically
- Just use `data-ref="1"` to match the `[^1]` in your text
- The system will create [1] in the text and add the number in the footnote collection

## The system will generate:
1. **In text**: `[1]` (clickable, with hover tooltip)
2. **At end**: Organized footnote section with your content and back-links