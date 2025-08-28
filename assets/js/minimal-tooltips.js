/**
 * MINIMAL FOOTNOTE TOOLTIPS
 * 
 * Forget the architecture. Forget the systems. Just make tooltips work.
 * 30 lines of code instead of 3000.
 */

(function() {
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMinimalTooltips);
  } else {
    initMinimalTooltips();
  }
  
  function initMinimalTooltips() {
    console.log('🎯 Minimal tooltips initializing...');
    
    // Find all footnote links
    const links = document.querySelectorAll('.footnote-ref a, a[href*="footnote"]');
    
    links.forEach(link => {
      // Extract number from href (works with ANY format)
      const num = link.href.match(/\d+/)?.[0];
      if (!num) return;
      
      // Find matching content
      const content = document.querySelector(`[data-ref="${num}"]`);
      if (!content) return;
      
      // Create tooltip on hover
      let tooltip = null;
      
      link.addEventListener('mouseenter', () => {
        // Create tooltip
        tooltip = document.createElement('div');
        tooltip.className = 'minimal-tooltip';
        tooltip.textContent = content.textContent;
        tooltip.style.cssText = `
          position: fixed;
          background: rgba(0,0,0,0.95);
          color: #00ff00;
          border: 1px solid #008800;
          padding: 10px;
          max-width: 300px;
          font-size: 14px;
          z-index: 99999;
          pointer-events: none;
          border-radius: 4px;
        `;
        
        // Position near link
        const rect = link.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 5) + 'px';
        
        document.body.appendChild(tooltip);
      });
      
      link.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      });
    });
    
    console.log(`✅ Minimal tooltips: ${links.length} footnotes ready`);
  }
})();