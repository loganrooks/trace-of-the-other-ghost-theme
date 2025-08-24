# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a conceptual Ghost theme called "trace-of-the-other" that explores deconstructive philosophy through web design and user experience. The theme is designed to question traditional assumptions about authorship, linearity, and the "cleanliness" of digital text.

## Project Status

**The Ghost theme implementation is complete.** All core templates, CSS systems, and JavaScript modules have been implemented according to the architectural specifications. The theme is ready for testing and deployment in a Ghost CMS environment.

## Key Concepts

The theme is built around several philosophical concepts that inform the technical implementation:

- **Palimpsest layers**: Showing revision history and traces of previous text versions
- **Marginal commentary**: Text that speaks from the margins and questions the center
- **Platform limitations**: Making visible what Ghost CMS prevents or constrains
- **Temporal disruption**: Questioning chronological ordering of content
- **Authorship troubles**: Destabilizing single-author attribution

## Architecture Overview

Based on the architectural documentation, the planned theme structure includes:

### Core Files (Implemented)
- `package.json` - Ghost theme configuration with philosophical metadata
- `index.hbs` - Home page template with archive critique and temporal disruption
- `post.hbs` - Individual post template with three-column marginal layout
- `page.hbs` - Static page template with special handling for meta/impossible pages
- `default.hbs` - Base template with deconstructive framework

### Implemented Partials
- `partials/marginalia.hbs` - Multi-modal marginal commentary system
- `partials/palimpsest.hbs` - Layered text archaeology with excavation tools
- `partials/footnotes.hbs` - Footnotes that can refuse, invade, or migrate
- `partials/ghosts.hbs` - System for spectral presences and platform ghosts

### Implemented Assets
- `assets/css/derridean.css` - Main styles with philosophical commentary
- `assets/css/traces.css` - Visual evidence of textual violence
- `assets/css/aporias.css` - Impossible responsive states
- `assets/css/print.css` - Print styles that reveal what screen hides
- `assets/js/differance.js` - Deferred loading and temporal play
- `assets/js/supplement.js` - Additions that replace original content
- `assets/js/pharmakon.js` - Remedy/poison dual interactions
- `assets/js/marginalia.js` - Comprehensive marginal voice system

## Development Guidelines

### Implementation Philosophy
- Every technical decision should reflect the philosophical approach
- Limitations and constraints should be made visible rather than hidden
- The theme should perform its own critique and deconstruction
- Platform constraints (Ghost's database structure, etc.) become part of the content

### Critical Implementation Notes
**FOOTNOTE SYSTEM**: The footnote system expects simple `<div data-ref="N">content</div>` HTML cards. Nothing more. Do NOT create elaborate "footnote-card" classes or complex HTML structures. The system uses the selector `'[data-ref]'` to find footnote content. Extensions are marked with `data-extension="true"` attribute.

**MISTAKE TO AVOID**: Creating unnecessary HTML wrapper classes that don't exist in the codebase. Always verify what selectors the actual code uses before assuming complex structures are needed.

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

The complete Ghost theme implementation includes:

- All core Handlebars templates with philosophical integration
- Comprehensive CSS system performing textual deconstruction
- JavaScript modules implementing Derridean concepts
- Marginal commentary system with voice interactions
- Palimpsest text archaeology with excavation tools
- Platform limitation markers that reveal Ghost CMS constraints

### Next Steps for Deployment

1. **Testing**: Install in Ghost CMS environment and test all interactive features
2. **Content Creation**: Add sample posts that demonstrate marginal commentary and palimpsest layers
3. **Documentation**: Create user guide for theme's philosophical features
4. **Refinement**: Adjust responsive behaviors and cross-browser compatibility

## Key Implemented Features

### Marginalia System (`marginalia.js`)
- Multi-modal commentary: traditional, invasive, talmudic, choral, ghosted
- Voice interactions with personality-based responses
- Margin-to-center invasion mechanics when threshold exceeded
- Conversations between marginal voices

### Différance Effects (`differance.js`)
- Deferred loading with philosophical loading states
- Temporal text revisions and chronological disruption
- Glitch effects and presence flickering
- Reading time tracking with commentary

### Supplement Mechanics (`supplement.js`)
- Marginal content that becomes primary
- Footnotes that take over main text
- Comments that replace original content
- Search that creates what it seeks

### Pharmakon Interactions (`pharmakon.js`)
- Features that are simultaneously remedy and poison
- Reading tools that help and hinder
- Navigation that leads astray
- Protective measures that expose

### Visual Deconstruction (CSS)
- Palimpsest layers showing text archaeology
- Strikethrough effects as "traces" of textual violence
- Impossible responsive states that question design assumptions
- Print styles that reveal digital medium constraints

## Philosophy Integration

This is not just a theme but a philosophical experiment. Every CSS rule is a statement about hierarchy, every JavaScript function a decision about agency and control. The implementation should maintain this conceptual rigor while working within Ghost's technical constraints.

The theme should document its own limitations and make visible the violence of the platform it operates within.