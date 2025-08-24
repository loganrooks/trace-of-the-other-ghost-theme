#!/bin/bash

# Ghost Theme Package Builder with Semantic Versioning
# Usage: ./build-package.sh [version-bump] [description]
# version-bump: patch (default), minor, major, or specific version like 2.0.1
# description: Optional build description

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Ghost Theme Package Builder${NC}"
echo "=============================================="

# Get current version
if [ -f "VERSION" ]; then
    CURRENT_VERSION=$(cat VERSION)
else
    CURRENT_VERSION="2.0.0"
    echo "$CURRENT_VERSION" > VERSION
fi

echo -e "Current version: ${YELLOW}$CURRENT_VERSION${NC}"

# Determine new version
VERSION_BUMP=${1:-patch}
BUILD_DESC=${2:-"Development build"}

if [[ $VERSION_BUMP =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # Specific version provided
    NEW_VERSION=$VERSION_BUMP
else
    # Calculate new version based on bump type
    IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
    MAJOR=${VERSION_PARTS[0]}
    MINOR=${VERSION_PARTS[1]}
    PATCH=${VERSION_PARTS[2]}
    
    case $VERSION_BUMP in
        major)
            MAJOR=$((MAJOR + 1))
            MINOR=0
            PATCH=0
            ;;
        minor)
            MINOR=$((MINOR + 1))
            PATCH=0
            ;;
        patch)
            PATCH=$((PATCH + 1))
            ;;
        *)
            echo -e "${RED}❌ Invalid version bump: $VERSION_BUMP${NC}"
            echo "Use: major, minor, patch, or specific version (e.g., 2.0.1)"
            exit 1
            ;;
    esac
    
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"
fi

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# Update version file
echo "$NEW_VERSION" > VERSION

# Generate package name
PACKAGE_NAME="trace-of-the-other-ghost-theme-v${NEW_VERSION}-${TIMESTAMP}.zip"

echo -e "New version: ${GREEN}$NEW_VERSION${NC}"
echo -e "Build timestamp: ${YELLOW}$TIMESTAMP${NC}"
echo -e "Package name: ${BLUE}$PACKAGE_NAME${NC}"
echo -e "Description: $BUILD_DESC"

# Update package.json version
if [ -f "package.json" ]; then
    # Use sed to update version in package.json (cross-platform compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" package.json
    else
        # Linux
        sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" package.json
    fi
    echo -e "${GREEN}✅ Updated package.json version${NC}"
fi

# Create package
echo -e "${BLUE}📦 Creating package...${NC}"

# Remove any existing packages with same version
rm -f trace-of-the-other-ghost-theme-v${NEW_VERSION}-*.zip

# Create the zip package
zip -r "$PACKAGE_NAME" \
    package.json \
    *.hbs \
    partials/ \
    assets/css/ \
    assets/js/content-enhancement-config.js \
    assets/js/debug-logger.js \
    assets/js/system-diagnostic.js \
    assets/js/content-processor-base.js \
    assets/js/configuration-manager.js \
    assets/js/marginalia-processor.js \
    assets/js/paragraph-extension-processor.js \
    assets/js/footnote-processor.js \
    assets/js/content-enhancement-manager.js \
    assets/js/footnote-config.js \
    assets/js/footnote-system.js \
    assets/js/footnote-legacy-adapter.js \
    assets/js/hacker-effects.js \
    assets/js/debug-theme-settings.js \
    -x "*.git*" "*.DS_Store" "*.log" "*.tmp" > /dev/null

PACKAGE_SIZE=$(ls -lh "$PACKAGE_NAME" | awk '{print $5}')

echo -e "${GREEN}✅ Package created successfully!${NC}"
echo -e "📁 File: $PACKAGE_NAME"
echo -e "📏 Size: $PACKAGE_SIZE"

# Git integration (if in git repo)
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${BLUE}📝 Git integration...${NC}"
    
    # Add changed files
    git add VERSION package.json
    
    # Create commit message
    COMMIT_MSG="v$NEW_VERSION: $BUILD_DESC"
    
    # Check if there are changes to commit
    if ! git diff --cached --quiet; then
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✅ Git commit created: $COMMIT_MSG${NC}"
        
        # Create git tag
        git tag -a "v$NEW_VERSION" -m "$BUILD_DESC"
        echo -e "${GREEN}✅ Git tag created: v$NEW_VERSION${NC}"
    else
        echo -e "${YELLOW}⚠️ No changes to commit${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Build complete!${NC}"
echo -e "${BLUE}📤 Upload $PACKAGE_NAME to Ghost Admin${NC}"
echo ""
echo "Next build commands:"
echo "  ./build-package.sh patch \"Bug fixes\""
echo "  ./build-package.sh minor \"New features\""
echo "  ./build-package.sh major \"Breaking changes\""
echo "  ./build-package.sh 2.1.0 \"Specific version\""