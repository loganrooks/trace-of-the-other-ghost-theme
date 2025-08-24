# Development Guide: Trace of the Other Ghost Theme

## Overview
This guide covers development workflows for extending and maintaining the "Trace of the Other" Ghost theme within the Ghost platform ecosystem.

## Content Creation Workflows

### Ghost Editor Workflow
For editors and content creators using the Ghost admin interface:

1. **Main Text**: Use standard Ghost paragraph blocks
2. **Marginalia**: Insert HTML cards using the pattern system:
   ```
   [m][voice font-scale width position][content]
   ```
   Example: `[m][2 1.4 80 r]["Every time I write 'Israel'..."]`
3. **Footnotes**: Use standard `[^1]` notation with HTML footnote cards

See `REALISTIC_GHOST_WORKFLOW.md` for detailed step-by-step instructions.

## Development Workflows

### Theme Development Environment
1. **Local Development**:
   ```bash
   # Clone theme into Ghost themes directory
   cd /content/themes/
   git clone [repo] trace-of-the-other
   
   # Restart Ghost
   ghost restart
   ```

2. **Development Tools**:
   - `./build-package.sh` - Automated versioning and packaging
   - `assets/js/system-diagnostic.js` - Debug tools for marginalia and footnotes
   - `test/` directory - Integration and unit tests

### Building and Packaging
```bash
# Increment patch version
./build-package.sh patch "Description of changes"

# Increment minor version  
./build-package.sh minor "New feature description"

# Specific version
./build-package.sh 2.1.0 "Breaking changes"
```

This automatically:
- Updates `package.json` and `VERSION` files
- Creates timestamped ZIP package
- Commits to git with semantic versioning
- Creates git tag

### Ghost Platform Integration

#### Theme Validation
Before uploading to Ghost admin:
```bash
# Validate theme structure
ghost-cli theme validate

# Check for Ghost API compatibility
grep -r "{{@version}}" . # Should return nothing
grep -r "meta_description" . # Check usage
```

#### Ghost API Usage
The theme integrates with Ghost's:
- **Helper System**: Custom `{{marginalia}}` helpers
- **Content API**: For dynamic content loading  
- **Admin API**: For theme settings management
- **Webhooks**: For content synchronization

#### Custom Settings Integration
Theme settings are configured in `package.json`:
```json
"config": {
  "custom": {
    "footnote_theme": {
      "type": "select",
      "options": ["hacker", "academic", "minimal"]
    }
  }
}
```

Access in templates:
```handlebars
{{@custom.footnote_theme}}
```

### Modular Architecture

#### Content Processors
The theme uses a modular content enhancement system:
- `ContentProcessor` (base class)
- `MarginaliaProcessor` - Handles `[m][params][content]` patterns
- `ParagraphExtensionProcessor` - Handles `[+][content]` patterns  
- `FootnoteProcessor` - Enhanced footnote processing

#### Adding New Processors
1. Extend `ContentProcessor` base class
2. Register in `content-enhancement-manager.js`
3. Add configuration to `content-enhancement-config.js`

### Testing and Quality Assurance

#### Local Testing
```bash
# Run unit tests
npm test

# Integration testing
npm run test:integration

# Manual testing with debug mode
# In browser console:
debugContentConfig();
contentEnhancementHealth();
```

#### Pre-Deployment Validation
Use `TEST_VALIDATION.md` checklist:
- Theme validation passes
- No Ghost API deprecations
- CSS/JS minification works
- Mobile responsiveness tested
- Cross-browser compatibility verified

### Ghost Platform Ecosystem Integration

#### Ghost Marketplace Preparation
1. **Theme Description**: Update `package.json` with marketplace-ready description
2. **Documentation**: Ensure `README.md` is user-facing
3. **Screenshots**: Include theme preview images
4. **Pricing**: Consider Ghost's marketplace pricing tiers

#### Multi-Site Deployment
For Ghost(Pro) multi-site installations:
- Use environment-specific configuration
- Consider CDN integration for assets
- Test across different Ghost versions

#### Ghost Cloud Integration
- Optimize for Ghost's infrastructure
- Consider server-side rendering implications
- Test with Ghost's caching layers

### Extending the Theme

#### Adding New Marginalia Voices
1. Update voice definitions in `digital-talmud.css`
2. Add voice configurations to `marginalia-processor.js`
3. Document new voice types in user guides

#### Custom CSS Themes  
1. Create new theme file in `assets/css/`
2. Register theme in `content-enhancement-config.js`
3. Add theme option to `package.json` config

#### JavaScript Extensions
Follow the processor pattern for new interactive features:
1. Extend appropriate base class
2. Register with content enhancement manager
3. Add configuration options
4. Include debug support

### Performance Optimization

#### Ghost-Specific Optimizations
- Lazy-load content processors
- Use Ghost's built-in jQuery (avoid conflicts)
- Optimize for Ghost's image processing
- Consider Ghost's CDN integration

#### Mobile Performance
- Progressive enhancement approach
- Touch-optimized interactions
- Responsive image handling
- Reduced JavaScript payload on mobile

### Contributing and Collaboration

#### Development Standards
- Follow Ghost theme conventions
- Use semantic versioning
- Include comprehensive documentation
- Test across Ghost versions

#### Code Review Process
1. Feature branches from `main`
2. Pull request with description
3. Automated testing validation
4. Manual testing checklist
5. Documentation updates

This development workflow ensures the theme remains maintainable, extensible, and properly integrated with the Ghost platform ecosystem while supporting the philosophical and technical goals of the project.