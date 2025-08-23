#!/bin/bash

# Simple Ghost Theme Build Script
# Quick and minimal theme package creation

THEME_NAME="trace-of-the-other"
ZIP_NAME="${THEME_NAME}-$(date +%Y%m%d-%H%M).zip"

echo "Building $ZIP_NAME..."

# Create zip with hacker theme files including complete footnote system
zip -r "$ZIP_NAME" \
    package.json \
    default.hbs \
    index.hbs \
    post.hbs \
    page.hbs \
    partials/ \
    assets/css/main.css \
    assets/css/hacker-effects.css \
    assets/css/digital-talmud.css \
    assets/css/footnote-themes.css \
    assets/js/hacker-effects.js \
    assets/js/footnote-config.js \
    assets/js/footnote-system.js \
    assets/js/footnote-test.js \
    assets/js/footnote-debug-connection.js \
    assets/js/footnote-direct-test.js \
    assets/js/footnote-raw-content-dump.js \
    -x "*.DS_Store" \
    -x "__MACOSX/*" \
    -x "*.git*" \
    -x "test/*" \
    -x "backup/*" \
    -x "*.md" \
    -x "*.sh"

echo "Created: $ZIP_NAME"
echo "Size: $(ls -lh "$ZIP_NAME" | awk '{print $5}')"
echo ""
echo "Ready to upload to Ghost Admin > Settings > Design"