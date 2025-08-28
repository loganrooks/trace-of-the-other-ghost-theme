# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with code in this repository. Last updated: 2025-08-28

## Project Overview

This is a conceptual Ghost theme called "trace-of-the-other" that explores deconstructive philosophy through web design and user experience. The theme is designed to question traditional assumptions about authorship, linearity, and the "cleanliness" of digital text.

## Project Status

**Version: 2.5.4** - The Ghost theme has undergone a major architectural overhaul following service-oriented design principles. The theme features a robust footnote/tooltip system, interactive markers with typing animations, and comprehensive debugging capabilities.

### Recent Architectural Changes
- **Service-Based Architecture**: Migrated from coupled ContentEnhancementManager to modular ThemeSystemCoordinator
- **FootnoteService**: Clean implementation with proper event delegation and multiple href pattern matching
- **LayerManager**: Z-index management preventing CSS conflicts
- **EventBus**: Decoupled communication between services
- **HealthMonitor**: System health checks and debugging support

## Key Concepts

The theme is built around several philosophical concepts that inform the technical implementation:

- **Palimpsest layers**: Showing revision history and traces of previous text versions
- **Marginal commentary**: Text that speaks from the margins and questions the center
- **Platform limitations**: Making visible what Ghost CMS prevents or constrains
- **Temporal disruption**: Questioning chronological ordering of content
- **Authorship troubles**: Destabilizing single-author attribution

## Ghost CMS Platform Requirements

### Version Compatibility
- **Ghost Version**: >=5.0.0 (specified in package.json engines field)
- **Node.js**: v18.x for development (GScan compatibility), v20 LTS recommended for production
- **Theme API Version**: v5 (Handlebars-based templating)

### Custom Settings Limitations
- **Maximum Settings**: 20 custom settings total
- **Setting Types**: select, boolean, color, text, image
- **Key Format**: lowercase, snake_case, no special characters
- **Groups**: site-wide (default), homepage, post
- **Access in Templates**: via `@custom` object in Handlebars
- **Breaking Changes**: Changing setting keys requires migration strategy

### Ghost-Specific Content Patterns
- **Footnote References**: Ghost generates `#footnote-N` format, NOT `#fn-N`
- **HTML Cards**: Custom HTML must account for Ghost's wrapper elements
- **URL Handling**: Relative URLs need protocol prefixing (www.example.com → https://www.example.com)
- **Content API**: Limited access to revision history and meta information

## Current Architecture

### Service-Based System (New Architecture)

#### Core Services
- **ThemeSystemCoordinator** (`assets/js/core/theme-system-coordinator.js`)
  - Central orchestrator for all theme services
  - Manages service initialization order and dependencies
  - Provides health monitoring and debugging capabilities

- **FootnoteService** (`assets/js/services/footnote-service.js`)
  - Handles footnote tooltips with multiple href pattern matching
  - Event delegation for dynamic content
  - HTML content preservation (innerHTML vs textContent)
  - Configurable styling via Ghost custom settings

- **LayerManager** (`assets/js/core/layer-manager.js`)
  - Z-index allocation and conflict prevention
  - Layer reservation system for different UI components

- **EventBus** (`assets/js/core/event-bus.js`)
  - Pub/sub system for service communication
  - Decouples service dependencies

### Legacy System (Deprecated but Present)
- **ContentEnhancementManager** (`assets/js/core/content-enhancement-manager.js`)
  - Detects new architecture and defers if present
  - Prevents dual initialization conflicts

### File Structure
```
├── package.json              # Ghost theme metadata and custom settings
├── default.hbs              # Base template with script loading order
├── index.hbs               # Home page template
├── post.hbs               # Post template with footnote/margin support
├── page.hbs               # Page template
├── partials/              # Reusable template components
├── assets/
│   ├── css/              # Philosophical styling system
│   ├── js/
│   │   ├── core/         # New architecture core services
│   │   ├── services/     # Feature-specific services
│   │   ├── utils/        # Utilities (link-fixer, etc.)
│   │   ├── processors/   # Content processors
│   │   └── debug/        # Debugging tools
```

## Development Best Practices

### Architecture Principles
1. **Service Isolation**: Each service should have a single responsibility
2. **Event-Driven Communication**: Services communicate via EventBus, not direct coupling
3. **Initialization Order**: ThemeSystemCoordinator manages proper initialization sequence
4. **Dual System Prevention**: Check for existing systems before initialization
5. **Progressive Enhancement**: Features should degrade gracefully

### Critical Implementation Rules

#### FOOTNOTE SYSTEM
- **Content Structure**: Expects `<div data-ref="N">content</div>` HTML cards
- **No Complex Wrappers**: Do NOT create elaborate "footnote-card" classes
- **Selector**: System uses `'[data-ref]'` to find footnote content
- **Extensions**: Marked with `data-extension="true"` attribute
- **Href Patterns**: Must handle both `#footnote-N` (Ghost default) and `#fn-N` formats

#### SCRIPT LOADING ORDER (Critical!)
```handlebars
<!-- In default.hbs -->
1. Configuration scripts first
2. Utilities and link-fixer
3. Core architecture (ThemeSystemCoordinator)
4. Services (FootnoteService, etc.)
5. Legacy systems (with detection)
6. Initialization scripts last
```

#### COMMON PITFALLS TO AVOID
1. **Creating Non-Existent Classes**: Always verify selectors in actual code
2. **TextContent vs InnerHTML**: Use innerHTML for formatted content preservation
3. **URL Protocol Issues**: Always handle URLs without protocols
4. **Race Conditions**: Ensure proper script loading order
5. **Dual System Conflicts**: Implement detection to prevent both systems running

### Debugging Methodology

#### Built-in Debug Tools
- **architecture-detection-debug.js**: Checks which architecture is active
- **href-format-diagnostic.js**: Diagnoses footnote href pattern issues
- **script-failure-debug.js**: Tracks script loading failures

#### Debug Functions
```javascript
// Quick architecture check
window.quickArchCheck();

// Detailed architecture debugging
window.debugArchitectureDetection();

// Footnote system health check
window.footnoteService?.getHealth();
```

## Testing and Validation

### GScan Validation (Required)
```bash
# Install GScan globally
npm install -g gscan

# Validate theme directory
gscan /path/to/trace-of-the-other-ghost-theme

# Validate theme zip
gscan -z theme.zip
```

#### Error Levels
- **Fatal Errors**: Must fix - will prevent theme activation
- **Errors**: Must fix - causes functional issues
- **Warnings**: Should fix - deprecated features
- **Recommendations**: Best practice suggestions

### Local Development Testing
1. **Ghost Local Setup**: Install Ghost locally for real-time testing
2. **Theme Compilation**: Run `npm run zip` to build theme package
3. **Browser DevTools**: Essential for debugging CSS and JavaScript
4. **Handlebars Debugging**: Use `{{log}}` helper to inspect data structures

### Test Coverage Areas
- **Footnote System**: Test all href patterns, tooltip display, HTML preservation
- **Interactive Markers**: Verify typing animations, event handling
- **Custom Settings**: Validate all 20 settings apply correctly
- **Responsive Design**: Test across device sizes
- **Performance**: Use Lighthouse for performance audits

## Version Control Best Practices

### Branch Strategy
- **main**: Stable, production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature development
- **hotfix/***: Critical bug fixes

### Commit Conventions
```
feat: Add new feature
fix: Bug fix
refactor: Code restructuring
docs: Documentation updates
test: Test additions/changes
style: Formatting changes
chore: Maintenance tasks
```

### Release Process
1. Update VERSION file
2. Update package.json version
3. Run GScan validation
4. Build theme package: `npm run zip`
5. Test in staging environment
6. Tag release: `git tag v2.5.4`
7. Create GitHub release with changelog

## Key Implemented Features

### Core Interactive Systems

#### FootnoteService (v2.5.4)
- **Tooltip System**: Hover tooltips with configurable styling
- **Pattern Matching**: Handles multiple href formats (`#footnote-N`, `#fn-N`, custom)
- **HTML Preservation**: Maintains formatting (bold, italic, links) in tooltips
- **Event Delegation**: Efficient handling of dynamic content
- **Custom Styling**: Via Ghost theme settings (colors, opacity, borders)

#### Interactive Markers
- **Pattern**: `[?][config][content]` format
- **Typing Animation**: Character-by-character reveal with sound effects
- **Token Processing**: Handles nested HTML structures
- **Event Handling**: Click-to-reveal mechanics

#### Content Processors
- **BracketParser**: Handles nested bracket patterns
- **ParagraphExtensionProcessor**: Processes extension markers
- **DeconstructionProcessor**: Implements textual deconstruction

### Philosophical Implementations

#### Marginalia System (`marginalia.js`)
- Multi-modal commentary: traditional, invasive, talmudic, choral, ghosted
- Voice interactions with personality-based responses
- Margin-to-center invasion mechanics
- Inter-voice conversations

#### Différance Effects (`differance.js`)
- Deferred loading with philosophical states
- Temporal text revisions
- Glitch effects and presence flickering
- Reading time tracking with commentary

#### Supplement Mechanics (`supplement.js`)
- Marginal content becoming primary
- Footnotes overtaking main text
- Comments replacing original content
- Search creating what it seeks

#### Pharmakon Interactions (`pharmakon.js`)
- Features as remedy and poison simultaneously
- Reading tools that help and hinder
- Navigation that leads astray
- Protection that exposes

## Custom Settings Configuration

### Current Settings (20 max limit)
```json
{
  "footnote_style": "minimal",           // Style preset
  "typing_speed": 50,                     // Animation speed
  "enable_sounds": false,                 // Sound effects
  "margin_voice_volume": 0.5,            // Voice volume
  "show_margin_timestamps": true,        // Timestamps
  "palimpsest_opacity": 0.3,            // Layer opacity
  "enable_reader_excavation": true,      // User interaction
  "margin_invasion_threshold": 10,       // Invasion trigger
  "temporal_scramble_intensity": "medium", // Time disruption
  "show_platform_limitations": true,     // Ghost constraints
  "enable_trace_effects": true,         // Visual traces
  "reading_resistance_level": "low",    // Reading difficulty
  "footnote_migration_enabled": false,   // Moving footnotes
  "author_instability_mode": "subtle",  // Author questioning
  "supplement_aggression": "moderate",   // Content replacement
  "interactive_marker_color": "#39ff14", // Marker color
  "tooltip_bg_opacity": 0.9,            // Tooltip transparency
  "tooltip_max_width": 400,              // Tooltip width
  "hyperlink_color": "#00a8ff",         // Link color
  "show_hidden_apis": false              // Platform secrets
}
```

## Troubleshooting Guide

### Common Issues and Solutions

#### Footnote Tooltips Not Working
1. Check href format matches Ghost output
2. Verify FootnoteService initialization
3. Check for JavaScript errors in console
4. Ensure proper script loading order

#### Interactive Markers Not Animating
1. Verify TypingAnimation.js is loaded
2. Check for event listener conflicts
3. Ensure marker HTML structure is correct

#### Dual System Conflicts
1. Check `window.themeSystemCoordinator` existence
2. Review initialization logs
3. Verify script loading order in default.hbs

#### URL/Link Issues
1. Check link-fixer.js is loaded
2. Verify protocol handling
3. Test in production environment

## Philosophy Integration

This is not just a theme but a philosophical experiment. Every CSS rule is a statement about hierarchy, every JavaScript function a decision about agency and control. The implementation should maintain this conceptual rigor while working within Ghost's technical constraints.

The theme documents its own limitations and makes visible the violence of the platform it operates within. Platform constraints become content, errors become features, and limitations become creative opportunities.

## Development Checklist

### Before Making Changes
- [ ] Read existing code patterns
- [ ] Check for service dependencies
- [ ] Verify Ghost CMS constraints
- [ ] Consider philosophical implications

### During Development
- [ ] Follow service isolation principles
- [ ] Use EventBus for communication
- [ ] Add debug capabilities
- [ ] Document unusual decisions

### Before Committing
- [ ] Run GScan validation
- [ ] Test in local Ghost instance
- [ ] Verify no console errors
- [ ] Check responsive behavior
- [ ] Update VERSION if needed

### Deployment
- [ ] Build theme package
- [ ] Test in staging
- [ ] Verify custom settings work
- [ ] Document any breaking changes
- [ ] Tag release appropriately