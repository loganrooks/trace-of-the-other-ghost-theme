# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a conceptual Ghost theme called "trace-of-the-other" that explores deconstructive philosophy through web design and user experience. The theme is designed to question traditional assumptions about authorship, linearity, and the "cleanliness" of digital text.

## Project Status

**This project currently contains only architectural documentation.** The actual Ghost theme implementation has not yet been created. The repository contains one comprehensive architectural document that outlines the philosophical and technical approach.

## Key Concepts

The theme is built around several philosophical concepts that inform the technical implementation:

- **Palimpsest layers**: Showing revision history and traces of previous text versions
- **Marginal commentary**: Text that speaks from the margins and questions the center
- **Platform limitations**: Making visible what Ghost CMS prevents or constrains
- **Temporal disruption**: Questioning chronological ordering of content
- **Authorship troubles**: Destabilizing single-author attribution

## Architecture Overview

Based on the architectural documentation, the planned theme structure includes:

### Core Files (Not Yet Implemented)
- `package.json` - Ghost theme configuration
- `index.hbs` - Home page template
- `post.hbs` - Individual post template  
- `page.hbs` - Static page template
- `default.hbs` - Base template

### Planned Partials
- `marginalia.hbs` - Marginal commentary system
- `palimpsest.hbs` - Layered text with revision history
- `footnotes.hbs` - Footnotes that can "rise" from the bottom
- `ghosts.hbs` - Haunting elements between text

### Planned Assets
- `css/derridean.css` - Main styles
- `css/traces.css` - Strikethrough and fading effects
- `css/aporias.css` - Responsive design states
- `js/differance.js` - Deferred loading and temporal effects
- `js/supplement.js` - Additions that replace original content
- `js/pharmakon.js` - Dual remedy/poison interactions

## Development Guidelines

### Implementation Philosophy
- Every technical decision should reflect the philosophical approach
- Limitations and constraints should be made visible rather than hidden
- The theme should perform its own critique and deconstruction
- Platform constraints (Ghost's database structure, etc.) become part of the content

### Technical Approach
- Use CSS Grid for complex marginal layouts
- Implement multiple modes for displaying content (linear, fragmentary, talmudic, etc.)
- JavaScript should sometimes refuse to execute (performing failure)
- Include print styles that reveal what screen hides

### Key Features to Implement

1. **Marginal Commentary System**: Multi-mode marginalia that can be traditional, invasive, or choral
2. **Palimpsest Implementation**: Layered text showing revision history
3. **Temporal Disruption**: Break chronological ordering, allow scrambled time
4. **Platform Limitation Markers**: Code that reveals what Ghost prevents
5. **Reader Interaction**: Allow readers to excavate through text layers

## Current State

The repository contains only the architectural specification (`architecture.md`). To begin implementation:

1. Create `package.json` with Ghost theme configuration
2. Implement base Handlebars templates
3. Build CSS systems for marginal layouts and palimpsest effects  
4. Create JavaScript modules for interactive features
5. Test within Ghost CMS environment

## Philosophy Integration

This is not just a theme but a philosophical experiment. Every CSS rule is a statement about hierarchy, every JavaScript function a decision about agency and control. The implementation should maintain this conceptual rigor while working within Ghost's technical constraints.

The theme should document its own limitations and make visible the violence of the platform it operates within.