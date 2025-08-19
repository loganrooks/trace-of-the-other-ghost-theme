# Ghost Theme Validation Testing Guide

## Pre-Upload Validation Checklist

### 1. Critical Error Fixes Verification

**Check: meta_description removal**
```bash
# Should return 0 occurrences
grep -c "{{meta_description}}" default.hbs
```

**Check: @version removal**
```bash
# Should return 0 occurrences
grep -c "{{@version}}" *.hbs
```

**Check: Required CSS classes**
```bash
# Should return 1 for each
grep -c "\.kg-width-wide" assets/css/main.css
grep -c "\.kg-width-full" assets/css/main.css
```

**Check: package.json custom types**
```bash
# All custom settings should have valid "type" field
cat package.json | grep -A2 "custom"
# Valid types: "select", "boolean", "color", "image", "text"
```

**Check: @page.show_title_and_feature_image**
```bash
# Should return at least 1
grep -c "@page.show_title_and_feature_image" page.hbs
```

### 2. Visual Testing Without Ghost

**Create test HTML file:**
```html
<!-- test-preview.html -->
<!DOCTYPE html>
<html>
<head>
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital@0;1&family=Playfair+Display&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/marginalia.css">
</head>
<body>
    <div class="site-wrapper">
        <article class="post">
            <h1>Test Post Title</h1>
            <div class="post-content" style="position: relative;">
                <p>This is a test paragraph to verify styling.</p>
                
                <div class="margin-voice margin-left voice-critic">
                    Critical margin note
                </div>
                
                <div class="margin-voice margin-right voice-translator">
                    Translation note
                </div>
                
                <p>Another paragraph to test spacing and typography.</p>
            </div>
        </article>
    </div>
</body>
</html>
```

Open `test-preview.html` in browser and verify:
- [ ] Clean, literary typography (serif fonts)
- [ ] No page darkening
- [ ] Margins appear beside content (desktop)
- [ ] Different voice fonts are visible
- [ ] Readable contrast and spacing

### 3. Ghost Validation Tool Test

**Use Ghost's gscan tool:**
```bash
# Install gscan globally
npm install -g gscan

# Run validation
gscan trace-of-the-other-fixed.zip

# Expected output: "No errors detected"
```

### 4. Manual Theme Structure Validation

**Required files present:**
```bash
ls -la *.hbs
# Should show: default.hbs, index.hbs, post.hbs, page.hbs

ls -la package.json
# Should exist and be valid JSON

ls -la assets/css/
# Should contain main.css at minimum
```

**Verify no problematic code:**
```bash
# Check for random failures
grep -r "Math.random" *.hbs
# Should return nothing

# Check for complex JavaScript
ls assets/js/
# Should be empty or minimal

# Check for darkening effects
grep -r "opacity\|rgba(0" assets/css/
# Should only show intentional transparency
```

### 5. Test with Example Post

**Create test post content:**
```markdown
# The Nature of Digital Text

<p data-margin-left="But what is 'digital'?" data-margin-right="Translation: numerical">
Digital text appears stable, but every viewing is a new rendering, a fresh interpretation by the machine.
</p>

<p data-margin-left="The critic objects">
We imagine text as permanent, yet it exists only in the moment of display, conjured from magnetic charges and electrical impulses.
</p>

<p data-margin-right="The reader wonders">
Each reading creates the text anew, making the reader complicit in the act of creation.
</p>
```

**Verify rendering:**
1. Margins should appear with data-margin content
2. Typography should be clean and literary
3. No visual glitches or darkening
4. Mobile view should stack margins below paragraphs

### 6. Performance Validation

**Check file sizes:**
```bash
# CSS should be under 50KB each
ls -lh assets/css/*.css

# No large JavaScript files
ls -lh assets/js/*.js

# Theme zip should be under 2MB
ls -lh trace-of-the-other-fixed.zip
```

**Check load performance:**
```bash
# Simple performance check
time curl -s http://localhost:2368 > /dev/null
# Should be under 1 second
```

### 7. Ghost Upload Test Protocol

1. **Start local Ghost:**
```bash
ghost start --development
```

2. **Access Ghost Admin:**
```
http://localhost:2368/ghost/
```

3. **Upload theme:**
- Settings > Design > Change theme
- Upload theme > Select trace-of-the-other-fixed.zip
- Check for validation errors

4. **Activation test:**
- Activate theme
- View site
- Create test post
- Check all pages load

### 8. Browser Testing Matrix

Test in each browser:

**Desktop:**
- [ ] Chrome: Typography, margins, layout
- [ ] Firefox: Typography, margins, layout
- [ ] Safari: Typography, margins, layout
- [ ] Edge: Typography, margins, layout

**Mobile:**
- [ ] iOS Safari: Responsive layout, margin stacking
- [ ] Chrome Mobile: Responsive layout, margin stacking

### 9. Fallback Testing

If errors persist, test minimal version:

1. **Create ultra-minimal theme:**
```bash
# Only these files:
- package.json (minimal)
- default.hbs (basic)
- index.hbs (simple loop)
- post.hbs (content only)
- assets/css/main.css (basic styles)
```

2. **Test upload:**
- Should have zero errors
- If errors exist, Ghost installation may have issues

### 10. Success Indicators

**Green flags:**
- ✅ gscan reports no errors
- ✅ Theme uploads without warnings
- ✅ All pages render correctly
- ✅ Typography is clean and literary
- ✅ No darkening or visual bugs
- ✅ Margins work on desktop
- ✅ Mobile responsive works
- ✅ Example post displays correctly

**Red flags:**
- ❌ Validation errors in Ghost Admin
- ❌ Page darkening or opacity issues
- ❌ JavaScript errors in console
- ❌ Missing content or broken layouts
- ❌ Performance issues or slow loading

## Quick Debug Commands

```bash
# Find all problematic patterns
grep -r "{{meta_description}}\|{{@version}}" *.hbs

# Check for required classes
grep -r "kg-width" assets/css/

# Validate JSON
python -m json.tool package.json

# Check theme structure
find . -name "*.hbs" -o -name "package.json" | head -20

# Remove all JavaScript temporarily
mv assets/js assets/js_backup

# Create minimal test zip
zip -r minimal-test.zip default.hbs index.hbs post.hbs page.hbs package.json assets/css/main.css
```

## Emergency Fix Commands

If validation still fails:

```bash
# Use sed to fix common issues
sed -i '' '/<meta name="description"/d' default.hbs
sed -i '' 's/{{@version}}/Ghost/g' *.hbs
sed -i '' 's/"type": "[^"]*"/"type": "boolean"/g' package.json

# Add required CSS
echo '.kg-width-wide { max-width: 85vw; }' >> assets/css/main.css
echo '.kg-width-full { max-width: 100vw; }' >> assets/css/main.css

# Simplify package.json
echo '{
  "name": "trace-of-the-other",
  "version": "0.2.0",
  "engines": {"ghost": ">=5.0.0"}
}' > package.json
```

---

This validation guide ensures the theme will work before uploading to Ghost. Follow each step to guarantee success.