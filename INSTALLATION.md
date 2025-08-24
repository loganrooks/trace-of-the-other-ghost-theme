# Installation Guide - Content Enhancement System

**Estimated Time:** 10 minutes  
**Difficulty:** Beginner  
**Requirements:** Ghost CMS 4.0+, basic file editing

## 📋 **Pre-Installation Checklist**

Before installing, ensure you have:
- [ ] Ghost CMS 4.0 or higher
- [ ] Access to your Ghost theme files
- [ ] Existing footnotes using `[^N]` format with `<div data-ref="N">content</div>` cards
- [ ] Backup of your current theme (recommended)

## 🚀 **Installation Steps**

### **Step 1: Extract Package Files**
```bash
# Extract the package to a temporary location
unzip content-enhancement-system.zip
cd content-enhancement-system/
```

### **Step 2: Copy JavaScript Files**
Copy all JavaScript files from the package to your Ghost theme:

```bash
# Navigate to your Ghost theme directory
cd /path/to/your/ghost/theme/

# Copy all enhancement system files
cp content-enhancement-system/assets/js/* assets/js/
```

**Files being copied:**
- `content-enhancement-config.js` - Main configuration
- `content-processor-base.js` - Base processor class
- `configuration-manager.js` - Configuration management  
- `footnote-processor.js` - Modern footnote processing
- `paragraph-extension-processor.js` - Extension system
- `content-enhancement-manager.js` - System orchestration
- `footnote-legacy-adapter.js` - Backward compatibility

### **Step 3: Update Template Files**

#### **Option A: Manual Update (Recommended)**
Edit your `default.hbs` file and replace the footnote system script section with:

```html
{{!-- Content Enhancement System - Modular Architecture --}}
{{!-- Load in dependency order for proper initialization --}}

{{!-- 1. Unified Configuration (supports both legacy and modern systems) --}}
<script src="{{asset "js/content-enhancement-config.js"}}"></script>

{{!-- 2. Modern Modular System Components --}}
<script src="{{asset "js/content-processor-base.js"}}"></script>
<script src="{{asset "js/configuration-manager.js"}}"></script>
<script src="{{asset "js/footnote-processor.js"}}"></script>
<script src="{{asset "js/paragraph-extension-processor.js"}}"></script>
<script src="{{asset "js/content-enhancement-manager.js"}}"></script>

{{!-- 3. Legacy System (for backward compatibility during migration) --}}
<script src="{{asset "js/footnote-config.js"}}"></script>
<script src="{{asset "js/footnote-system.js"}}"></script>
<script src="{{asset "js/footnote-legacy-adapter.js"}}"></script>
```

#### **Option B: Copy from Template**
If you prefer, copy the exact script section from `template-updates/default.hbs.partial` in the package.

### **Step 4: Verify Installation**
1. **Restart Ghost** (if using local development)
2. **Visit any post/page** with footnotes
3. **Open browser console** (F12)
4. **Run verification command:**
   ```javascript
   debugContentConfig();
   ```
   
   You should see:
   ```
   [CONFIG DEBUG]
   Configuration: Object { global: {...}, processors: {...}, themes: {...} }
   Feature Flags: Object { USE_LEGACY_FOOTNOTES: true, ... }
   Applied Theme: hacker
   Active System: Legacy Footnote System
   ```

### **Step 5: Test Basic Functionality**
1. **Check existing footnotes** still work
2. **Verify tooltips** appear on hover
3. **Test navigation** to footnote collection
4. **Confirm mobile responsiveness**

## ✅ **Post-Installation Verification**

### **Required Tests:**
- [ ] Existing footnotes `[^1]` work unchanged
- [ ] Tooltips appear and position correctly
- [ ] Mobile responsive design works
- [ ] No JavaScript console errors
- [ ] Debug functions available in console

### **Console Commands to Test:**
```javascript
// Configuration loaded correctly
debugContentConfig();

// System health check  
contentEnhancementHealth(); // Should return {status: "healthy"}

// View current feature flags
console.log(window.CONTENT_ENHANCEMENT_FLAGS);
```

## 🔧 **Configuration Options**

### **Feature Flags** (in `content-enhancement-config.js`)
```javascript
window.CONTENT_ENHANCEMENT_FLAGS = {
  USE_LEGACY_FOOTNOTES: true,     // Start with legacy (safe)
  ENABLE_EXTENSIONS: false,       // Extensions disabled initially
  ENABLE_DEBUG_PANELS: false,     // Debug UI (development only)
  ENABLE_THEME_SWITCHING: true    // Allow runtime theme changes
};
```

### **Theme Selection**
Choose from included themes:
```javascript
// Available themes: 'hacker', 'academic', 'minimal'
window.ContentEnhancementConfig.applyTheme('academic');

// Or use console command
switchTheme('minimal');
```

## 📝 **Content Format Requirements**

### **Footnotes (Unchanged)**
Continue using existing format:
```markdown
Text with footnote[^1] and another[^2].
```

With HTML cards:
```html
<div data-ref="1">First footnote content</div>
<div data-ref="2">Second footnote content</div>
```

### **Extensions (New - Disabled by Default)**
When ready to use extensions:
```markdown
Analysis text.[+][Extended commentary providing deeper insight.]
```

## 🚨 **Troubleshooting Installation**

### **Issue: Scripts Not Loading**
**Symptoms:** Console shows "file not found" errors
**Solution:** 
- Verify files copied to correct `assets/js/` directory
- Check file permissions (should be readable by web server)
- Restart Ghost CMS

### **Issue: Configuration Not Found**
**Symptoms:** `debugContentConfig()` shows "not defined"
**Solution:**
- Ensure `content-enhancement-config.js` loads first
- Check browser network tab for 404 errors
- Verify script tag syntax in `default.hbs`

### **Issue: Existing Footnotes Broken**
**Symptoms:** Footnotes don't work after installation
**Solution:**
- Check HTML footnote format: must be `<div data-ref="N">content</div>`
- Verify legacy system active: `USE_LEGACY_FOOTNOTES: true`
- Run emergency rollback (see below)

### **Emergency Rollback**
If critical issues occur:
```javascript
// In browser console:
window.CONTENT_ENHANCEMENT_FLAGS.USE_LEGACY_FOOTNOTES = true;
location.reload();

// Or remove new script tags from default.hbs and restart Ghost
```

## 🎯 **Next Steps After Installation**

### **Immediate (Day 1):**
1. ✅ Verify installation working
2. ✅ Test existing footnotes
3. ✅ Monitor for any issues

### **Short-term (Week 1):**
1. 📖 Read **DEPLOYMENT_GUIDE.md** for gradual feature rollout
2. 🧪 Test modern footnote system in staging
3. 📚 Review **CONTENT_CREATOR_GUIDE.md** for new features

### **Long-term (Month 1):**
1. 🚀 Deploy modern footnote processor
2. 🎨 Enable paragraph extensions
3. 🎭 Experiment with different themes
4. 📊 Monitor performance and user engagement

## 📞 **Getting Help**

### **Debug Commands:**
```javascript
debugContentConfig();           // System configuration
contentEnhancementHealth();      // System health
debugContentEnhancement();       // Detailed stats (when modern system active)
```

### **Log Files:**
- Browser console shows all system messages
- Look for `[CONFIG]`, `[ENHANCEMENT_MANAGER]`, `[FOOTNOTE_PROCESSOR]` prefixes
- Error messages include specific troubleshooting guidance

### **Common Solutions:**
1. **Clear browser cache** if seeing old behavior
2. **Hard refresh** (Ctrl+F5) to reload all assets  
3. **Check network tab** for failed resource loads
4. **Verify file paths** match your theme structure

---

## 🎉 **Installation Complete!**

Your Ghost theme now has the modular content enhancement system installed with:
- ✅ **Enhanced footnotes** with better positioning and accessibility
- ✅ **Extensibility** ready for paragraph extensions
- ✅ **Zero-downtime migration** capability  
- ✅ **Comprehensive debugging** and health monitoring

**Next:** See **DEPLOYMENT_GUIDE.md** to gradually enable modern features, or jump to **CONTENT_CREATOR_GUIDE.md** to learn about the new paragraph extension syntax.