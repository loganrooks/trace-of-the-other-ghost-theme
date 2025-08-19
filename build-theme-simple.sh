#!/bin/bash

# Simple Ghost Theme Build Script
# Quick and minimal theme package creation

THEME_NAME="trace-of-the-other"
ZIP_NAME="${THEME_NAME}-$(date +%Y%m%d-%H%M).zip"

echo "Building $ZIP_NAME..."

# Create zip with only essential files
zip -r "$ZIP_NAME" \
    package.json \
    default.hbs \
    index.hbs \
    post.hbs \
    page.hbs \
    assets/css/main.css \
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