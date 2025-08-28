/**
 * Link Fixer Utility
 * 
 * Automatically fixes URLs that are missing protocols (http/https)
 * This prevents relative URL issues when links like "www.example.com" 
 * are interpreted as relative paths
 */

(function() {
  
  /**
   * Fix links that look like external URLs but are missing protocols
   */
  function fixMissingProtocols() {
    // Find all links in content
    const links = document.querySelectorAll('.post-content a, .page-content a, .typing-overlay a, .interactive-overlay a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Check if it looks like a domain but lacks protocol
      // Matches patterns like: www.example.com, example.com (with TLD)
      const domainPattern = /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+/;
      
      if (domainPattern.test(href) && !href.startsWith('http') && !href.startsWith('//')) {
        // Add https:// to external-looking links
        const fixedHref = 'https://' + href;
        link.setAttribute('href', fixedHref);
        
        // Add external link attributes for security
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        console.log(`🔗 Fixed URL: ${href} → ${fixedHref}`);
      }
    });
  }
  
  /**
   * Run fixer when DOM is ready and after dynamic content loads
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixMissingProtocols);
  } else {
    fixMissingProtocols();
  }
  
  // Also fix links after dynamic content is loaded (typing animations, etc)
  document.addEventListener('content-enhanced', fixMissingProtocols);
  
  // Fix links that appear after typing animations
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        // Check if any new links were added
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'A' || (node.querySelectorAll && node.querySelectorAll('a').length > 0)) {
            setTimeout(fixMissingProtocols, 100);
          }
        });
      }
    });
  });
  
  // Observe changes in interactive overlays
  const overlays = document.querySelectorAll('.typing-overlay, .interactive-overlay');
  overlays.forEach(overlay => {
    observer.observe(overlay, { childList: true, subtree: true });
  });
  
})();

console.log('🔗 Link fixer loaded - automatically adds protocols to external URLs');