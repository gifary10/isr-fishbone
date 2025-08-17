// FishboneApp.js
import { getCategories } from './dataService.js';
import { saveAnalysis } from './storageService.js';

export class FishboneApp {
  constructor() {
    this.selectedCauses = {};
    this.categories = getCategories();
    this.initDropdowns();
    this.setupEventListeners();
    this.updateCounters();
  }

  initDropdowns() {
    for (const [categoryId, category] of Object.entries(this.categories)) {
      const select = document.getElementById(`${categoryId}-cause`);
      
      if (!select) {
        console.error(`Dropdown for category ${categoryId} not found`);
        continue;
      }
      
      select.innerHTML = '<option value="">Pilih penyebab...</option>';
      
      // Pastikan category.data ada dan merupakan array
      const items = Array.isArray(category?.data) ? category.data : [];
      
      items.forEach(item => {
        const option = new Option(item.cause, item.id);
        option.dataset.description = item.description || '';
        option.dataset.solutions = JSON.stringify(item.solutions || []);
        option.dataset.priority = item.priority || 'Medium';
        select.add(option);
      });
    }
  }

  setupEventListeners() {
    for (const categoryId in this.categories) {
      const addButton = document.getElementById(`add-${categoryId}-cause`);
      const selectElement = document.getElementById(`${categoryId}-cause`);
      
      if (!addButton || !selectElement) {
        console.warn(`Elements for category ${categoryId} not found`);
        continue;
      }

      addButton.addEventListener('click', () => {
        this.addCause(categoryId);
      });

      selectElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addCause(categoryId);
        }
      });
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        this.analyze();
      });
    }
    
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('fishboneModal'));
        modal.show();
      });
    }
  }

  addCause(categoryId) {
    const select = document.getElementById(`${categoryId}-cause`);
    if (!select) {
      console.error(`Select element for category ${categoryId} not found`);
      return;
    }
    
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
      this.showAlert('Silakan pilih penyebab terlebih dahulu!');
      return;
    }

    const list = document.getElementById(`${categoryId}-causes-list`);
    if (!list) {
      console.error(`Cause list for category ${categoryId} not found`);
      return;
    }
    
    const emptyState = list.querySelector('.empty-state');
    
    if (emptyState) {
      list.removeChild(emptyState);
    }

    if (document.querySelector(`#${categoryId}-causes-list [data-id="${selectedOption.value}"]`)) {
      this.showAlert('Penyebab ini sudah ditambahkan!');
      return;
    }

    const causeItem = document.createElement('div');
    causeItem.className = `cause-item priority-${(selectedOption.dataset.priority || 'medium').toLowerCase()}`;
    causeItem.dataset.id = selectedOption.value;
    causeItem.dataset.category = categoryId;
    
    const priorityBadge = selectedOption.dataset.priority 
      ? `<span class="badge priority-badge bg-${this.getPriorityColor(selectedOption.dataset.priority)}">
          ${selectedOption.dataset.priority}
         </span>` 
      : '';
    
    causeItem.innerHTML = `
      <div class="cause-header d-flex justify-content-between align-items-center">
        <span class="cause-text">${selectedOption.text} ${priorityBadge}</span>
        <button class="btn btn-sm btn-link text-danger remove-btn p-0" aria-label="Hapus penyebab">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    causeItem.querySelector('.remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      causeItem.remove();
      if (list.children.length === 0) {
        list.innerHTML = '<div class="empty-state">Belum ada penyebab ditambahkan</div>';
      }
      this.updateCounters();
    });

    $(causeItem).hide().fadeIn(300);
    list.appendChild(causeItem);
    select.value = '';
    
    this.updateCounters();
  }
  
  updateCounters() {
    for (const categoryId in this.categories) {
      const counter = document.getElementById(`${categoryId}-counter`);
      const list = document.getElementById(`${categoryId}-causes-list`);
      
      if (!counter || !list) {
        continue;
      }
      
      const items = list.querySelectorAll('.cause-item');
      counter.textContent = items.length;
    }
  }
  
  getPriorityColor(priority) {
    if (!priority) return 'secondary';
    priority = priority.toLowerCase();
    if (priority.includes('critical')) return 'danger';
    if (priority.includes('high')) return 'warning';
    if (priority.includes('medium')) return 'info';
    return 'success';
  }

  analyze() {
    this.collectSelectedCauses();
    
    if (Object.keys(this.selectedCauses).length === 0) {
      this.showAlert('Silakan tambahkan minimal satu penyebab!');
      return;
    }

    // Get all causes data for each category
    const allData = {};
    for (const [categoryId, causeIds] of Object.entries(this.selectedCauses)) {
      allData[categoryId] = this.categories[categoryId].data.filter(item => 
        causeIds.includes(item.id)
      );
    }

    saveAnalysis({
      selected: this.selectedCauses,
      categories: Object.keys(this.categories).reduce((acc, cat) => {
        acc[cat] = this.categories[cat].name;
        return acc;
      }, {}),
      allData: allData  // Include the actual cause data
    });

    window.location.href = 'hasil.html';
  }

  collectSelectedCauses() {
    this.selectedCauses = {};
    
    for (const categoryId in this.categories) {
      const list = document.getElementById(`${categoryId}-causes-list`);
      if (!list) continue;
      
      const items = [];
      list.querySelectorAll('.cause-item').forEach(item => {
        items.push(item.dataset.id);
      });
      
      if (items.length > 0) {
        this.selectedCauses[categoryId] = items;
      }
    }
  }

  showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '1100';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 150);
    }, 3000);
  }
}