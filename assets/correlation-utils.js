// assets/correlation-utils.js

export function calculatePriorityByCategory(analysisData, allData) {
    if (!analysisData || !allData) {
        console.error('Invalid input data for calculatePriorityByCategory');
        return {};
    }
    
    const priorityByCategory = {};
    
    for (const [category, causeIds] of Object.entries(analysisData)) {
        if (!allData[category]) {
            console.warn(`Category ${category} not found in allData`);
            continue;
        }
        
        priorityByCategory[category] = {
            Critical: 0,
            High: 0,
            Medium: 0,
            Low: 0
        };
        
        for (const causeId of causeIds) {
            const cause = allData[category].find(item => item.id === causeId);
            if (cause?.priority) {
                const priority = cause.priority.toLowerCase();
                if (priority.includes('critical')) priorityByCategory[category].Critical++;
                else if (priority.includes('high')) priorityByCategory[category].High++;
                else if (priority.includes('medium')) priorityByCategory[category].Medium++;
                else priorityByCategory[category].Low++;
            }
        }
    }
    
    return priorityByCategory;
}

export function getTopSolutions(analysisData, allData, limit = 5) {
    if (!analysisData || !allData) {
        console.error('Invalid input data for getTopSolutions');
        return [];
    }

    const solutionFrequency = {};
    const solutionMap = {};
    
    for (const [category, causeIds] of Object.entries(analysisData)) {
        if (!allData[category]) {
            console.warn(`Category ${category} not found in allData`);
            continue;
        }

        for (const causeId of causeIds) {
            const cause = allData[category].find(item => item.id === causeId);
            if (cause?.solutions) {
                cause.solutions.forEach(solution => {
                    const normalizedSolution = solution.trim().toLowerCase();
                    solutionFrequency[normalizedSolution] = (solutionFrequency[normalizedSolution] || 0) + 1;
                    solutionMap[normalizedSolution] = solution.trim(); // Store original formatting
                });
            }
        }
    }
    
    return Object.entries(solutionFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([solution]) => solutionMap[solution]); // Return with original formatting
}

export function getSolutionRelationships(analysisData, allData) {
    if (!analysisData || !allData) {
        console.error('Invalid input data for getSolutionRelationships');
        return {};
    }

    const relationships = {};
    
    // Build solution-to-cause index
    const solutionIndex = {};
    for (const [category, causeIds] of Object.entries(analysisData)) {
        if (!allData[category]) {
            console.warn(`Category ${category} not found in allData`);
            continue;
        }

        for (const causeId of causeIds) {
            const cause = allData[category].find(item => item.id === causeId);
            if (cause?.solutions) {
                cause.solutions.forEach(solution => {
                    const normalizedSolution = solution.trim().toLowerCase();
                    if (!solutionIndex[normalizedSolution]) {
                        solutionIndex[normalizedSolution] = [];
                    }
                    solutionIndex[normalizedSolution].push(cause.id);
                });
            }
        }
    }
    
    // Build cause-to-related-causes index
    for (const [category, causeIds] of Object.entries(analysisData)) {
        for (const causeId of causeIds) {
            const cause = allData[category].find(item => item.id === causeId);
            if (cause?.solutions) {
                const related = new Set();
                cause.solutions.forEach(solution => {
                    const normalizedSolution = solution.trim().toLowerCase();
                    solutionIndex[normalizedSolution]?.forEach(relatedId => {
                        if (relatedId !== cause.id) {
                            related.add(relatedId);
                        }
                    });
                });
                relationships[cause.id] = Array.from(related);
            }
        }
    }
    
    return relationships;
}

export function getCommonCasePatterns(analysisData, allData) {
    if (!analysisData || !allData) {
        console.error('Invalid input data for getCommonCasePatterns');
        return [];
    }

    const keywordFrequency = {};
    const keywordThreshold = 2;
    const stopWords = new Set(['yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'pada', 'saat', 'dengan']);
    
    for (const [category, causeIds] of Object.entries(analysisData)) {
        if (!allData[category]) {
            console.warn(`Category ${category} not found in allData`);
            continue;
        }

        for (const causeId of causeIds) {
            const cause = allData[category].find(item => item.id === causeId);
            if (cause?.caseExample) {
                // Simple keyword extraction with stop words filtering
                const keywords = cause.caseExample.toLowerCase()
                    .split(/[ ,.;:!?]+/)
                    .filter(word => word.length > 3 && !stopWords.has(word));
                
                keywords.forEach(keyword => {
                    keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
                });
            }
        }
    }
    
    return Object.entries(keywordFrequency)
        .filter(([_, count]) => count >= keywordThreshold)
        .sort((a, b) => b[1] - a[1])
        .map(([keyword, count]) => ({ keyword, count }));
}