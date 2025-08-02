// assets/fishbone-utils.js (no changes needed)
export function formatCategoryName(category) {
    const names = {
        'man': 'Manusia',
        'method': 'Metode',
        'machine': 'Mesin',
        'measurement': 'Pengukuran',
        'material': 'Material',
        'mothernature': 'Lingkungan'
    };
    return names[category] || category;
}

export function getCategoryColor(category) {
    const colors = {
        'man': 'primary',
        'method': 'info',
        'machine': 'warning',
        'measurement': 'success',
        'material': 'danger',
        'mothernature': 'secondary'
    };
    return colors[category] || 'dark';
}

export function getCategoryHexColor(category) {
    const colors = {
        'man': '#3498db',
        'method': '#17a2b8',
        'machine': '#ffc107',
        'measurement': '#28a745',
        'material': '#dc3545',
        'mothernature': '#6c757d'
    };
    return colors[category] || '#000';
}

export function getPriorityColor(priority) {
    if (!priority) return 'secondary';
    priority = priority.toLowerCase();
    if (priority.includes('critical')) return 'danger';
    if (priority.includes('high')) return 'warning';
    if (priority.includes('medium')) return 'info';
    return 'success';
}

export function getPriorityHexColor(priority) {
    if (!priority) return '#6c757d';
    priority = priority.toLowerCase();
    if (priority.includes('critical')) return '#dc3545';
    if (priority.includes('high')) return '#fd7e14';
    if (priority.includes('medium')) return '#ffc107';
    return '#28a745';
}

export function truncateText(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

export function isValidCauseId(id) {
    return typeof id === 'string' && id.length > 0 && id.includes('-');
}