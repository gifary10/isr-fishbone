// storageService.js
export function saveAnalysis(data) {
  try {
    sessionStorage.setItem('fishboneAnalysis', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving analysis:', error);
    return false;
  }
}

export function getAnalysis() {
  try {
    const data = sessionStorage.getItem('fishboneAnalysis');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting analysis:', error);
    return null;
  }
}