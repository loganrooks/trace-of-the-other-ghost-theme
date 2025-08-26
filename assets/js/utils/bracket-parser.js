/**
 * Bracket Parser Utility - Proper bracket counting for nested patterns
 * Handles patterns like [trigger][config][content with [nested] brackets]
 * 
 * Solves the classic bracket matching problem that simple regex cannot handle.
 * Used by all content processors for consistent pattern parsing.
 * 
 * Created: August 25, 2025
 */

class BracketParser {
  constructor(logger = console) {
    this.logger = logger;
  }

  /**
   * Find all instances of a multi-section bracket pattern
   * @param {string} text - Text to search
   * @param {string} trigger - Trigger pattern (e.g., '[?]', '[m]', '[+]')
   * @param {number} sections - Number of sections to extract (e.g., 2 for [trigger][config][content])
   * @returns {Array} Array of match objects
   */
  findPattern(text, trigger, sections = 2) {
    const matches = [];
    const triggerPattern = trigger + '[';
    let searchStart = 0;
    
    this.logger.debug(`🔍 BracketParser.findPattern called`, {
      trigger: trigger,
      triggerPattern: triggerPattern,
      sections: sections,
      textLength: text.length
    });
    
    while (true) {
      const patternStart = text.indexOf(triggerPattern, searchStart);
      if (patternStart === -1) {
        this.logger.debug(`No more ${trigger} patterns found, stopping search`);
        break;
      }
      
      this.logger.debug(`Found ${trigger} pattern at position ${patternStart}`);
      
      try {
        const sectionResults = [];
        let currentIndex = patternStart + triggerPattern.length;
        
        // Extract each section using bracket counting
        for (let i = 0; i < sections; i++) {
          const sectionResult = this.extractBracketSection(text, currentIndex);
          if (!sectionResult) {
            // Failed to parse this section, skip this pattern
            break;
          }
          
          sectionResults.push(sectionResult.content);
          currentIndex = sectionResult.endIndex;
          
          // If not the last section, expect another opening bracket
          if (i < sections - 1) {
            if (text.charAt(currentIndex) !== '[') {
              // No opening bracket for next section, skip this pattern
              break;
            }
            currentIndex++; // Skip the opening bracket
          }
        }
        
        // Only add if we successfully parsed all sections
        if (sectionResults.length === sections) {
          const fullMatch = text.substring(patternStart, currentIndex);
          
          matches.push({
            fullMatch: fullMatch,
            sections: sectionResults,
            startIndex: patternStart,
            endIndex: currentIndex
          });
          
          this.logger.debug(`Found ${trigger} pattern at ${patternStart}`, {
            sectionsCount: sectionResults.length,
            totalLength: fullMatch.length
          });
        }
        
        searchStart = currentIndex || patternStart + 1;
        
      } catch (error) {
        this.logger.error(`Error parsing ${trigger} pattern at ${patternStart}:`, error);
        searchStart = patternStart + 1;
      }
    }
    
    return matches;
  }

  /**
   * Find interactive marker patterns: [?][config][content]
   * @param {string} text - Text to search
   * @returns {Array} Array of matches with {fullMatch, actionConfig, content, startIndex, endIndex}
   */
  findInteractiveMarkers(text) {
    const matches = this.findPattern(text, '[?]', 2);
    return matches.map(match => ({
      fullMatch: match.fullMatch,
      actionConfig: match.sections[0],
      content: match.sections[1],
      startIndex: match.startIndex,
      endIndex: match.endIndex
    }));
  }

  /**
   * Find marginalia patterns: [m][config][content]
   * @param {string} text - Text to search  
   * @returns {Array} Array of matches with {fullMatch, config, content, startIndex, endIndex}
   */
  findMarginaliaPatterns(text) {
    const matches = this.findPattern(text, '[m]', 2);
    return matches.map(match => ({
      fullMatch: match.fullMatch,
      config: match.sections[0],
      content: match.sections[1],
      startIndex: match.startIndex,
      endIndex: match.endIndex
    }));
  }

  /**
   * Find paragraph extension patterns: [+][content]
   * @param {string} text - Text to search
   * @returns {Array} Array of matches with {fullMatch, content, startIndex, endIndex}
   */
  findParagraphExtensions(text) {
    const matches = this.findPattern(text, '[+]', 1);
    return matches.map(match => ({
      fullMatch: match.fullMatch,
      content: match.sections[0],
      startIndex: match.startIndex,
      endIndex: match.endIndex
    }));
  }

  /**
   * Extract content between brackets using proper bracket counting
   * @param {string} text - Full text
   * @param {number} startIndex - Index right after opening bracket
   * @returns {Object|null} Object with {content, endIndex} or null if invalid
   * @private
   */
  extractBracketSection(text, startIndex) {
    let bracketCount = 1; // We're already inside one bracket
    let currentIndex = startIndex;
    
    this.logger.debug(`🔧 extractBracketSection called`, {
      startIndex: startIndex,
      initialChar: text.charAt(startIndex),
      nextFewChars: text.substring(startIndex, startIndex + 10)
    });
    
    while (currentIndex < text.length && bracketCount > 0) {
      const char = text.charAt(currentIndex);
      
      if (char === '[') {
        bracketCount++;
        this.logger.debug(`Opening bracket at ${currentIndex}, count now: ${bracketCount}`);
      } else if (char === ']') {
        bracketCount--;
        this.logger.debug(`Closing bracket at ${currentIndex}, count now: ${bracketCount}`);
      }
      
      currentIndex++;
      
      // Safety check to prevent infinite loops
      if (currentIndex - startIndex > 10000) {
        this.logger.error('Bracket extraction taking too long, aborting');
        return null;
      }
    }
    
    // Check if we found a complete section
    if (bracketCount === 0) {
      const content = text.substring(startIndex, currentIndex - 1);
      this.logger.debug(`✅ Successfully extracted section`, {
        contentLength: content.length,
        contentPreview: content.substring(0, 50) + '...',
        endIndex: currentIndex
      });
      
      return {
        content: content,
        endIndex: currentIndex
      };
    }
    
    this.logger.debug(`❌ Unclosed brackets, final count: ${bracketCount}`);
    return null; // Unclosed brackets
  }

  /**
   * Replace patterns in text while preserving indices
   * @param {string} text - Original text
   * @param {Array} matches - Array of match objects with startIndex, endIndex
   * @param {Function} replacer - Function that takes a match and returns replacement text
   * @returns {string} Text with replacements
   */
  replaceMatches(text, matches, replacer) {
    // Sort matches by startIndex in reverse order to preserve indices
    const sortedMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);
    
    let result = text;
    
    sortedMatches.forEach(match => {
      const replacement = replacer(match);
      const before = result.substring(0, match.startIndex);
      const after = result.substring(match.endIndex);
      result = before + replacement + after;
    });
    
    return result;
  }

  /**
   * Validate bracket pattern syntax
   * @param {string} text - Text to validate
   * @param {string} trigger - Trigger pattern to check
   * @returns {Object} Validation result with {valid, errors, warnings}
   */
  validatePattern(text, trigger) {
    const result = {
      valid: true,
      errors: [],
      warnings: []
    };

    const triggerPattern = trigger + '[';
    let searchStart = 0;
    
    while (true) {
      const patternStart = text.indexOf(triggerPattern, searchStart);
      if (patternStart === -1) break;
      
      let currentIndex = patternStart + triggerPattern.length;
      let sectionCount = 0;
      
      // Count how many complete sections we can find
      while (true) {
        const sectionResult = this.extractBracketSection(text, currentIndex);
        if (!sectionResult) {
          result.errors.push({
            position: currentIndex,
            message: `Unclosed bracket in ${trigger} pattern at position ${patternStart}`
          });
          result.valid = false;
          break;
        }
        
        sectionCount++;
        currentIndex = sectionResult.endIndex;
        
        // Check if there's another section
        if (text.charAt(currentIndex) === '[') {
          currentIndex++;
        } else {
          break;
        }
      }
      
      if (trigger === '[?]' && sectionCount < 2) {
        result.warnings.push({
          position: patternStart,
          message: `Interactive marker at ${patternStart} has ${sectionCount} sections, expected 2`
        });
      }
      
      searchStart = currentIndex || patternStart + 1;
    }
    
    return result;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BracketParser;
} else if (typeof window !== 'undefined') {
  window.BracketParser = BracketParser;
}