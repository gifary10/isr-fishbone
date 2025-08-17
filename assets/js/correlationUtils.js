/**
 * Correlation Utilities Module
 * Contains functions for analyzing relationships between causes
 * @version 2.1.0
 * @license MIT
 */

export function calculatePriorityByCategory(analysisData, allData) {
  if (!analysisData || !allData || typeof analysisData !== 'object' || typeof allData !== 'object') {
    console.error('Invalid input data for calculatePriorityByCategory');
    return {};
  }

  const priorityByCategory = {};
  
  try {
    for (const [category, causeIds] of Object.entries(analysisData)) {
      if (!allData[category] || !Array.isArray(allData[category])) {
        console.warn(`Category ${category} not found or invalid in allData`);
        continue;
      }
      
      priorityByCategory[category] = {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0
      };
      
      if (!Array.isArray(causeIds)) {
        console.warn(`Invalid causeIds for category ${category}`);
        continue;
      }

      for (const causeId of causeIds) {
        const cause = allData[category].find(item => item?.id === causeId);
        if (!cause) {
          console.warn(`Cause with ID ${causeId} not found in category ${category}`);
          continue;
        }

        const priority = cause.priority?.toLowerCase() || 'medium';
        if (priority.includes('critical')) priorityByCategory[category].Critical++;
        else if (priority.includes('high')) priorityByCategory[category].High++;
        else if (priority.includes('medium')) priorityByCategory[category].Medium++;
        else priorityByCategory[category].Low++;
      }
    }
  } catch (error) {
    console.error('Error in calculatePriorityByCategory:', error);
    return {};
  }
  
  return priorityByCategory;
}

export function getTopSolutions(analysisData, allData, limit = 5) {
  if (!analysisData || !allData || typeof analysisData !== 'object' || typeof allData !== 'object') {
    console.error('Invalid input data for getTopSolutions');
    return [];
  }

  const solutionFrequency = {};
  const solutionMap = {};
  
  try {
    for (const [category, causeIds] of Object.entries(analysisData)) {
      if (!allData[category] || !Array.isArray(allData[category])) {
        console.warn(`Category ${category} not found or invalid in allData`);
        continue;
      }

      if (!Array.isArray(causeIds)) {
        console.warn(`Invalid causeIds for category ${category}`);
        continue;
      }

      for (const causeId of causeIds) {
        const cause = allData[category].find(item => item?.id === causeId);
        if (!cause || !Array.isArray(cause.solutions)) continue;

        cause.solutions.forEach(solution => {
          if (typeof solution !== 'string') return;
          const normalizedSolution = solution.trim().toLowerCase();
          if (!normalizedSolution) return;
          
          solutionFrequency[normalizedSolution] = (solutionFrequency[normalizedSolution] || 0) + 1;
          solutionMap[normalizedSolution] = solution.trim();
        });
      }
    }
  } catch (error) {
    console.error('Error in getTopSolutions:', error);
    return [];
  }
  
  return Object.entries(solutionFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.max(1, parseInt(limit) || 5))
    .map(([solution]) => solutionMap[solution])
    .filter(Boolean);
}

export function getSolutionRelationships(analysisData, allData) {
  if (!analysisData || !allData || typeof analysisData !== 'object' || typeof allData !== 'object') {
    console.error('Invalid input data for getSolutionRelationships');
    return {};
  }

  const relationships = {};
  const solutionIndex = {};
  
  try {
    // Build solution index
    for (const [category, causeIds] of Object.entries(analysisData)) {
      if (!allData[category] || !Array.isArray(allData[category])) {
        console.warn(`Category ${category} not found or invalid in allData`);
        continue;
      }

      if (!Array.isArray(causeIds)) {
        console.warn(`Invalid causeIds for category ${category}`);
        continue;
      }

      for (const causeId of causeIds) {
        const cause = allData[category].find(item => item?.id === causeId);
        if (!cause || !Array.isArray(cause.solutions)) continue;

        cause.solutions.forEach(solution => {
          if (typeof solution !== 'string') return;
          const normalizedSolution = solution.trim().toLowerCase();
          if (!normalizedSolution) return;
          
          if (!solutionIndex[normalizedSolution]) {
            solutionIndex[normalizedSolution] = [];
          }
          if (!solutionIndex[normalizedSolution].includes(cause.id)) {
            solutionIndex[normalizedSolution].push(cause.id);
          }
        });
      }
    }

    // Build relationships
    for (const [category, causeIds] of Object.entries(analysisData)) {
      if (!Array.isArray(causeIds)) continue;

      for (const causeId of causeIds) {
        const cause = allData[category]?.find(item => item?.id === causeId);
        if (!cause || !Array.isArray(cause.solutions)) continue;

        const related = new Set();
        cause.solutions.forEach(solution => {
          if (typeof solution !== 'string') return;
          const normalizedSolution = solution.trim().toLowerCase();
          if (!normalizedSolution || !solutionIndex[normalizedSolution]) return;
          
          solutionIndex[normalizedSolution].forEach(relatedId => {
            if (relatedId !== cause.id) {
              related.add(relatedId);
            }
          });
        });
        
        if (related.size > 0) {
          relationships[cause.id] = Array.from(related);
        }
      }
    }
  } catch (error) {
    console.error('Error in getSolutionRelationships:', error);
    return {};
  }
  
  return relationships;
}

export function getCommonCasePatterns(analysisData, allData, threshold = 2) {
  if (!analysisData || !allData || typeof analysisData !== 'object' || typeof allData !== 'object') {
    console.error('Invalid input data for getCommonCasePatterns');
    return [];
  }

  const keywordFrequency = {};
  const stopWords = new Set(['yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'saat', 'dengan']);
  
  try {
    for (const [category, causeIds] of Object.entries(analysisData)) {
      if (!allData[category] || !Array.isArray(allData[category])) {
        console.warn(`Category ${category} not found or invalid in allData`);
        continue;
      }

      if (!Array.isArray(causeIds)) {
        console.warn(`Invalid causeIds for category ${category}`);
        continue;
      }

      for (const causeId of causeIds) {
        const cause = allData[category].find(item => item?.id === causeId);
        if (!cause?.caseExample || typeof cause.caseExample !== 'string') continue;

        const keywords = cause.caseExample.toLowerCase()
          .split(/[ ,.;:!?]+/)
          .filter(word => word.length > 3 && !stopWords.has(word));
        
        keywords.forEach(keyword => {
          keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
        });
      }
    }
  } catch (error) {
    console.error('Error in getCommonCasePatterns:', error);
    return [];
  }
  
  return Object.entries(keywordFrequency)
    .filter(([_, count]) => count >= Math.max(2, parseInt(threshold) || 2))
    .sort((a, b) => b[1] - a[1])
    .map(([keyword, count]) => ({ 
      keyword, 
      count,
      normalizedKeyword: keyword.toLowerCase().trim()
    }))
    .filter(item => item.normalizedKeyword.length > 0);
}