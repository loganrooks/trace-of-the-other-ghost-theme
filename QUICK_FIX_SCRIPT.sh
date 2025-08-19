#!/bin/bash

# Quick Fix Script for Ghost Theme Validation Errors
# This script can be run to immediately fix all critical errors

echo "Starting Ghost Theme Quick Fix..."
echo "================================"

# Backup current files
echo "Creating backup..."
mkdir -p backup
cp default.hbs backup/default.hbs.bak
cp package.json backup/package.json.bak
cp page.hbs backup/page.hbs.bak

# Fix 1: Create main.css with required Koenig classes
echo "Creating main.css with required classes..."
cat > assets/css/main.css << 'EOF'
/* Ghost Required Classes */
.kg-width-wide {
    max-width: 85vw;
    width: 85vw;
    margin-left: calc((850px - 100vw) / 2);
    margin-right: calc((850px - 100vw) / 2);
}

.kg-width-full {
    max-width: 100vw;
    width: 100vw;
    margin-left: calc((850px - 100vw) / 2);
    margin-right: calc((850px - 100vw) / 2);
}

/* Clean Literary Typography */
body {
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 18px;
    line-height: 1.7;
    color: #1a1a1a;
    background: #fdfdf8;
    max-width: 750px;
    margin: 0 auto;
    padding: 2rem;
}

/* Prevent darkening */
* {
    background-color: transparent !important;
}

/* Headers */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 400;
    line-height: 1.3;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

/* Post content */
.post-content {
    font-size: 1.1rem;
    line-height: 1.8;
}

.post-content p {
    margin-bottom: 1.5rem;
}

/* Links */
a {
    color: #0066cc;
    text-decoration: none;
    transition: color 0.2s ease;
}

a:hover {
    color: #0052a3;
    text-decoration: underline;
}

/* Site header */
.site-header {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
}

.site-title {
    font-size: 2rem;
    margin: 0;
}

.site-description {
    color: #666;
    font-size: 1rem;
    margin-top: 0.5rem;
}

/* Navigation */
.site-nav {
    margin-top: 1rem;
}

.nav {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 2rem;
}

.nav-item {
    display: inline-block;
}

.nav-link {
    color: #333;
    font-weight: 500;
}

/* Post cards */
.post-card {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
}

.post-card-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.post-card-excerpt {
    color: #666;
    line-height: 1.6;
}

/* Footer */
.site-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
    text-align: center;
    color: #666;
    font-size: 0.9rem;
}
EOF

# Fix 2: Create simplified package.json
echo "Fixing package.json..."
cat > package.json << 'EOF'
{
    "name": "trace-of-the-other",
    "description": "A literary Ghost theme with marginal voices",
    "version": "0.2.0",
    "engines": {
        "ghost": ">=5.0.0"
    },
    "license": "MIT",
    "author": {
        "name": "Theme Author",
        "email": "author@example.com"
    },
    "config": {
        "posts_per_page": 10,
        "custom": {
            "show_marginalia": {
                "type": "boolean",
                "default": true,
                "description": "Show marginal commentary"
            }
        }
    },
    "keywords": [
        "ghost",
        "theme",
        "literary",
        "marginalia"
    ]
}
EOF

# Fix 3: Create clean default.hbs
echo "Creating clean default.hbs..."
cat > default.hbs << 'EOF'
<!DOCTYPE html>
<html lang="{{@site.locale}}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{meta_title}}</title>
    
    <link rel="canonical" href="{{url absolute="true"}}">
    <meta name="referrer" content="no-referrer-when-downgrade">
    
    {{!-- Google Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital@0;1&family=Playfair+Display&display=swap" rel="stylesheet">
    
    {{!-- Main theme styles --}}
    <link rel="stylesheet" type="text/css" href="{{asset "css/main.css"}}">
    
    {{!-- Ghost head outputs meta tags and structured data --}}
    {{ghost_head}}
</head>
<body class="{{body_class}}">
    <div class="site-wrapper">
        <header class="site-header">
            <div class="site-header-content">
                <h1 class="site-title">
                    <a href="{{@site.url}}">{{@site.title}}</a>
                </h1>
                {{#if @site.description}}
                <p class="site-description">{{@site.description}}</p>
                {{/if}}
                <nav class="site-nav">
                    {{navigation}}
                </nav>
            </div>
        </header>

        <main class="site-main">
            {{{body}}}
        </main>

        <footer class="site-footer">
            <div class="site-footer-content">
                <p>&copy; {{date format="YYYY"}} {{@site.title}}</p>
                <p>Powered by <a href="https://ghost.org" target="_blank" rel="noopener">Ghost</a></p>
            </div>
        </footer>
    </div>

    {{ghost_foot}}
</body>
</html>
EOF

# Fix 4: Create simple page.hbs
echo "Creating clean page.hbs..."
cat > page.hbs << 'EOF'
{{!< default}}

<article class="page {{post_class}}">
    {{#if @page.show_title_and_feature_image}}
    <header class="page-header">
        {{#if feature_image}}
        <div class="page-feature-image">
            <img src="{{feature_image}}" alt="{{title}}">
        </div>
        {{/if}}
        <h1 class="page-title">{{title}}</h1>
    </header>
    {{/if}}

    <div class="page-content">
        {{content}}
    </div>
</article>
EOF

# Fix 5: Create simple index.hbs
echo "Creating clean index.hbs..."
cat > index.hbs << 'EOF'
{{!< default}}

<div class="post-feed">
    {{#foreach posts}}
    <article class="post-card">
        <h2 class="post-card-title">
            <a href="{{url}}">{{title}}</a>
        </h2>
        {{#if excerpt}}
        <p class="post-card-excerpt">{{excerpt}}</p>
        {{/if}}
        <div class="post-card-meta">
            <time datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time>
            {{#if primary_author}}
            <span class="post-card-author">by {{primary_author.name}}</span>
            {{/if}}
        </div>
    </article>
    {{/foreach}}
</div>

{{pagination}}
EOF

# Fix 6: Create simple post.hbs with marginalia support
echo "Creating post.hbs with marginalia..."
cat > post.hbs << 'EOF'
{{!< default}}

<article class="post {{post_class}}">
    <header class="post-header">
        <h1 class="post-title">{{title}}</h1>
        <div class="post-meta">
            <time datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time>
            {{#if primary_author}}
            <span class="post-author">by {{primary_author.name}}</span>
            {{/if}}
        </div>
    </header>

    {{#if feature_image}}
    <div class="post-feature-image">
        <img src="{{feature_image}}" alt="{{title}}">
    </div>
    {{/if}}

    <div class="post-content">
        {{content}}
    </div>
</article>
EOF

# Fix 7: Create marginalia.css
echo "Creating marginalia styles..."
cat > assets/css/marginalia.css << 'EOF'
/* Marginalia Styles */
.post-content {
    position: relative;
}

.margin-voice {
    position: absolute;
    width: 180px;
    font-size: 0.85rem;
    line-height: 1.4;
    color: #666;
}

.margin-left {
    left: -200px;
    text-align: right;
}

.margin-right {
    right: -200px;
    text-align: left;
}

/* Different voice styles */
.voice-critic {
    font-family: 'Courier New', monospace;
    color: #8b0000;
}

.voice-translator {
    font-family: Georgia, serif;
    font-style: italic;
    color: #4a4a4a;
}

.voice-reader {
    font-family: Arial, sans-serif;
    font-size: 0.8rem;
    color: #666;
}

/* Mobile responsive */
@media (max-width: 1200px) {
    .margin-voice {
        position: static;
        width: 100%;
        margin: 1rem 0;
        padding: 1rem;
        border-left: 3px solid #ddd;
        background: #f9f9f9;
    }
    
    .margin-left,
    .margin-right {
        left: auto;
        right: auto;
        text-align: left;
    }
}
EOF

# Create theme zip
echo "Creating theme zip file..."
zip -r trace-of-the-other-fixed.zip . \
    -x "*.git*" \
    -x "test/*" \
    -x "*.md" \
    -x "backup/*" \
    -x "*.sh" \
    -x "assets/js/*"

echo "================================"
echo "Quick fix complete!"
echo "Theme file created: trace-of-the-other-fixed.zip"
echo "Upload this file to Ghost Admin > Settings > Design"
echo ""
echo "Files modified:"
echo "- default.hbs (simplified)"
echo "- package.json (fixed custom types)"
echo "- page.hbs (added @page support)"
echo "- post.hbs (clean version)"
echo "- index.hbs (simple loop)"
echo "- assets/css/main.css (with required classes)"
echo "- assets/css/marginalia.css (voice styles)"
echo ""
echo "Backups saved in ./backup/"