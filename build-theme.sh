#!/bin/bash

# Ghost Theme Build Script
# Creates a clean, uploadable theme package

set -e  # Exit on any error

echo "🎭 Building Ghost Theme: trace-of-the-other"
echo "============================================"

# Define theme name and version
THEME_NAME="trace-of-the-other"
VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
BUILD_DIR="build"
ZIP_NAME="${THEME_NAME}-v${VERSION}.zip"

echo "📦 Theme: $THEME_NAME"
echo "🔢 Version: $VERSION"
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf "$BUILD_DIR"
rm -f *.zip

# Create build directory
mkdir -p "$BUILD_DIR"

echo "📋 Copying theme files..."

# Copy essential theme files
cp package.json "$BUILD_DIR/"
cp *.hbs "$BUILD_DIR/"

# Copy assets directory structure
echo "🎨 Copying assets..."
mkdir -p "$BUILD_DIR/assets/css"
mkdir -p "$BUILD_DIR/assets/fonts"
mkdir -p "$BUILD_DIR/assets/images"

# Copy CSS files
cp assets/css/main.css "$BUILD_DIR/assets/css/"
if [ -f "assets/css/marginalia.css" ]; then
    cp assets/css/marginalia.css "$BUILD_DIR/assets/css/"
fi

# Copy partials if they exist
if [ -d "partials" ]; then
    echo "📁 Copying partials..."
    cp -r partials "$BUILD_DIR/"
fi

# Copy any images or fonts
if [ -d "assets/fonts" ] && [ "$(ls -A assets/fonts)" ]; then
    cp -r assets/fonts/* "$BUILD_DIR/assets/fonts/"
fi

if [ -d "assets/images" ] && [ "$(ls -A assets/images)" ]; then
    cp -r assets/images/* "$BUILD_DIR/assets/images/"
fi

echo "🔍 Validating theme structure..."

# Check required files exist
REQUIRED_FILES=("package.json" "default.hbs" "index.hbs" "post.hbs")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        echo "❌ ERROR: Required file missing: $file"
        exit 1
    else
        echo "✅ $file"
    fi
done

# Check CSS files
if [ ! -f "$BUILD_DIR/assets/css/main.css" ]; then
    echo "❌ ERROR: main.css is required"
    exit 1
else
    echo "✅ assets/css/main.css"
fi

echo ""
echo "🔧 Running validations..."

# Validate package.json
echo "📋 Validating package.json..."
if ! python3 -m json.tool "$BUILD_DIR/package.json" > /dev/null 2>&1; then
    echo "❌ ERROR: Invalid JSON in package.json"
    exit 1
else
    echo "✅ package.json is valid JSON"
fi

# Check for common Ghost theme issues
echo "🔍 Checking for common issues..."

# Check for meta_description usage (should be removed)
if grep -r "{{meta_description}}" "$BUILD_DIR"/*.hbs > /dev/null 2>&1; then
    echo "❌ ERROR: Found {{meta_description}} - this should be removed"
    exit 1
else
    echo "✅ No {{meta_description}} found"
fi

# Check for @version usage (should be removed)
if grep -r "{{@version}}" "$BUILD_DIR"/*.hbs > /dev/null 2>&1; then
    echo "❌ ERROR: Found {{@version}} - this should be removed"
    exit 1
else
    echo "✅ No {{@version}} found"
fi

# Check for required Koenig classes
if ! grep -q "kg-width-wide" "$BUILD_DIR/assets/css/main.css"; then
    echo "⚠️  WARNING: .kg-width-wide class not found in main.css"
fi

if ! grep -q "kg-width-full" "$BUILD_DIR/assets/css/main.css"; then
    echo "⚠️  WARNING: .kg-width-full class not found in main.css"
fi

# Check custom settings usage
CUSTOM_SETTINGS=$(grep -o '@custom\.[a-zA-Z_]*' "$BUILD_DIR/package.json" | sed 's/@custom\.//' | sort -u)
for setting in $CUSTOM_SETTINGS; do
    if ! grep -r "@custom\.$setting" "$BUILD_DIR"/*.hbs > /dev/null 2>&1; then
        echo "⚠️  WARNING: Custom setting '$setting' defined but not used in templates"
    else
        echo "✅ Custom setting '$setting' is used"
    fi
done

echo ""
echo "📦 Creating theme package..."

# Create zip file
cd "$BUILD_DIR"
zip -r "../$ZIP_NAME" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Verify zip was created
if [ ! -f "$ZIP_NAME" ]; then
    echo "❌ ERROR: Failed to create zip file"
    exit 1
fi

# Get file size
ZIP_SIZE=$(ls -lh "$ZIP_NAME" | awk '{print $5}')

echo ""
echo "🎉 Theme package created successfully!"
echo "============================================"
echo "📁 File: $ZIP_NAME"
echo "📏 Size: $ZIP_SIZE"
echo ""
echo "📋 Package contents:"
echo "$(unzip -l "$ZIP_NAME" | tail -n +4 | head -n -2)"
echo ""
echo "🚀 Next steps:"
echo "1. Upload $ZIP_NAME to Ghost Admin > Settings > Design"
echo "2. Activate the theme"
echo "3. Check for any validation errors"
echo ""
echo "💡 Tips:"
echo "- If you get validation errors, check the specific files mentioned"
echo "- Test the theme on a staging site first"
echo "- Keep this zip file for backup"

# Clean up build directory
rm -rf "$BUILD_DIR"

echo ""
echo "✨ Build complete!"