// ResultsApp.js
import { formatCategoryName, getCategoryColor, getPriorityColor } from './fishboneUtils.js';
import { 
  calculatePriorityByCategory, 
  getTopSolutions, 
  getCommonCasePatterns 
} from './correlationUtils.js';
import { FishboneDiagram } from './FishboneDiagram.js';
import { getAnalysis } from './storageService.js';
import { getCategories, findCauseById } from './dataService.js';
import { downloadResultsAsPDF, downloadDiagramAsPNG, generateStructuredReport} from './downloadUtils.js';

export class ResultsApp {
  constructor() {
    try {
      const storedData = getAnalysis();
      if (!storedData) {
        throw new Error('No analysis data found');
      }

      this.analysisData = storedData.selected || {};
      this.categories = storedData.categories || {};
      this.allData = storedData.allData || getCategories();
      
      this.init();
    } catch (error) {
      console.error('Failed to initialize ResultsApp:', error);
      this.showError();
    }
  }

  init() {
    if (!this.analysisData || Object.keys(this.analysisData).length === 0) {
      this.showError();
      return;
    }

    try {
      this.renderSummary();
      this.renderPriorityByCategoryChart();
      this.renderCauseCards();
      this.renderFishboneDiagram();
      this.renderEffectiveSolutions();
      this.renderCasePatterns();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error during initialization:', error);
      this.showError();
    }
  }

  renderSummary() {
    try {
      let totalCauses = 0;
      let criticalCount = 0;
      const categoryCounts = {};
      
      for (const [category, causeIds] of Object.entries(this.analysisData)) {
        if (!Array.isArray(causeIds)) continue;
        
        categoryCounts[category] = causeIds.length;
        totalCauses += causeIds.length;
        
        for (const causeId of causeIds) {
          const cause = this.getCauseData(category, causeId);
          if (cause?.priority?.toLowerCase() === 'critical') criticalCount++;
        }
      }

      document.getElementById('totalCauses').textContent = totalCauses;
      document.getElementById('criticalCauses').textContent = criticalCount;
      document.getElementById('causesCount').textContent = `${totalCauses} penyebab`;
    } catch (error) {
      console.error('Error rendering summary:', error);
    }
  }

  getCauseData(category, causeId) {
    try {
      // First try to find in the stored allData
      if (this.allData[category]?.items) {
        const cause = this.allData[category].items.find(item => item.id === causeId);
        if (cause) return cause;
      }
      
      // Fallback to dataService if not found
      return findCauseById(causeId);
    } catch (error) {
      console.error('Error getting cause data:', error);
      return null;
    }
  }

  renderPriorityByCategoryChart() {
    try {
      const priorityByCategory = calculatePriorityByCategory(this.analysisData, this.allData);
      const ctx = document.getElementById('priorityChart')?.getContext('2d');
      
      if (!ctx) {
        console.error('Priority chart canvas not found');
        return;
      }

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(priorityByCategory).map(formatCategoryName),
          datasets: [
            {
              label: 'Critical',
              data: Object.values(priorityByCategory).map(cat => cat.Critical || 0),
              backgroundColor: '#dc3545',
              borderColor: '#a52828',
              borderWidth: 1
            },
            {
              label: 'High',
              data: Object.values(priorityByCategory).map(cat => cat.High || 0),
              backgroundColor: '#fd7e14',
              borderColor: '#d46a10',
              borderWidth: 1
            },
            {
              label: 'Medium',
              data: Object.values(priorityByCategory).map(cat => cat.Medium || 0),
              backgroundColor: '#ffc107',
              borderColor: '#d9a406',
              borderWidth: 1
            },
            {
              label: 'Low',
              data: Object.values(priorityByCategory).map(cat => cat.Low || 0),
              backgroundColor: '#28a745',
              borderColor: '#1e7e34',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false
              }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              bodyFont: {
                size: 12
              },
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw}`;
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error rendering priority chart:', error);
    }
  }

  renderEffectiveSolutions() {
    try {
      const container = document.getElementById('effectiveSolutions');
      if (!container) return;
      
      container.innerHTML = '';
      
      const topSolutions = getTopSolutions(this.analysisData, this.allData, 5);
      
      if (topSolutions.length === 0) {
        container.innerHTML = '<li class="list-group-item text-muted small" style="font-size: 0.85rem;">Tidak ada solusi yang ditemukan</li>';
        return;
      }

      // Group solutions by category
      const solutionsByCategory = {};
      for (const [category, causeIds] of Object.entries(this.analysisData)) {
        if (!Array.isArray(causeIds)) continue;
        
        for (const causeId of causeIds) {
          const cause = this.getCauseData(category, causeId);
          if (!cause || !Array.isArray(cause.solutions)) continue;
          
          if (!solutionsByCategory[category]) {
            solutionsByCategory[category] = {
              name: formatCategoryName(category),
              solutions: new Set()
            };
          }
          
          cause.solutions.forEach(solution => {
            if (typeof solution === 'string' && solution.trim()) {
              solutionsByCategory[category].solutions.add(solution.trim());
            }
          });
        }
      }

      // Render the grouped solutions
      for (const [category, data] of Object.entries(solutionsByCategory)) {
        if (data.solutions.size === 0) continue;
        
        const categoryHeader = document.createElement('li');
        categoryHeader.className = 'list-group-item bg-light fw-bold';
        categoryHeader.style.fontSize = '0.95rem';
        categoryHeader.textContent = data.name;
        container.appendChild(categoryHeader);
        
        Array.from(data.solutions).forEach(solution => {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.style.fontSize = '0.85rem';
          li.textContent = solution;
          container.appendChild(li);
        });
      }

      if (container.children.length === 0) {
        container.innerHTML = '<li class="list-group-item text-muted small" style="font-size: 0.85rem;">Tidak ada solusi yang ditemukan</li>';
      }
    } catch (error) {
      console.error('Error rendering effective solutions:', error);
    }
  }

  renderCasePatterns() {
    try {
      const container = document.getElementById('casePatternsContainer');
      if (!container) return;
      
      const casePatterns = getCommonCasePatterns(this.analysisData, this.allData);
      
      if (casePatterns.length > 0) {
        container.innerHTML = `
          <div class="card mt-4">
            <div class="card-header bg-secondary text-white" style="font-size: 0.95rem;">
              <i class="fas fa-clipboard-list me-2"></i> Pola Kasus Umum
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                ${casePatterns.map(pattern => `
                  <li class="list-group-item" style="font-size: 0.85rem;">
                    <strong>${pattern.keyword}:</strong> 
                    ${pattern.count} kasus terkait
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error rendering case patterns:', error);
    }
  }

  renderCauseCards() {
    try {
      const container = document.getElementById('resultsContainer');
      if (!container) return;

      container.innerHTML = '';

      if (!this.analysisData) return;

      for (const [category, causeIds] of Object.entries(this.analysisData)) {
        if (!Array.isArray(causeIds)) continue;
        
        for (const causeId of causeIds) {
          const cause = this.getCauseData(category, causeId);
          if (!cause) {
            console.warn(`Cause with ID ${causeId} not found in category ${category}`);
            continue;
          }

          const card = document.createElement('div');
          card.className = 'list-group-item';
          card.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1" style="font-size: 1rem;">${cause.cause}</h5>
              <span class="badge bg-${getPriorityColor(cause.priority)}" style="font-size: 0.75rem;">
                ${cause.priority || 'Medium'}
              </span>
            </div>
            <p class="mb-1" style="font-size: 0.85rem;">${cause.description || 'Tidak ada deskripsi'}</p>
          `;
          container.appendChild(card);
        }
      }

      if (container.children.length === 0) {
        container.innerHTML = '<div class="list-group-item text-center py-4 text-muted" style="font-size: 0.9rem;">Tidak ada penyebab yang ditemukan</div>';
      }
    } catch (error) {
      console.error('Error rendering cause cards:', error);
      const container = document.getElementById('resultsContainer');
      if (container) {
        container.innerHTML = '<div class="list-group-item text-center py-4 text-danger" style="font-size: 0.9rem;">Gagal memuat daftar penyebab</div>';
      }
    }
  }

  renderFishboneDiagram() {
    try {
      const fishboneDiagram = new FishboneDiagram(
        'fishboneDiagram', 
        this.analysisData, 
        this.allData
      );
      fishboneDiagram.render();
    } catch (error) {
      console.error('Error rendering fishbone diagram:', error);
    }
  }

  setupEventListeners() {
    try {
      const backButton = document.getElementById('backButton');
      if (backButton) {
        backButton.addEventListener('click', () => {
          window.location.href = 'index.html';
        });
      }

      const downloadBtn = document.getElementById('downloadBtn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          this.showDownloadOptions();
        });
      }
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  showDownloadOptions() {
    const modalHTML = `
      <div class="modal fade" id="downloadModal" tabindex="-1" aria-labelledby="downloadModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="downloadModalLabel" style="font-size: 1.1rem;">Unduh Hasil Analisis</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
            </div>
            <div class="modal-body">
              <form id="downloadForm">
                <div class="mb-3">
                  <label for="creatorName" class="form-label" style="font-size: 0.9rem;">Nama Pembuat</label>
                  <input type="text" class="form-control form-control-sm" id="creatorName" placeholder="Masukkan nama pembuat">
                </div>
                <div class="mb-3">
                  <label for="supervisorName" class="form-label" style="font-size: 0.9rem;">Nama Atasan</label>
                  <input type="text" class="form-control form-control-sm" id="supervisorName" placeholder="Masukkan nama atasan">
                </div>
                <div class="d-grid gap-2">
                  <button type="button" class="btn btn-primary btn-download-option" data-type="pdf">
                    <i class="fas fa-file-pdf me-2"></i> Unduh Laporan PDF
                  </button>
                  <button type="button" class="btn btn-success btn-download-option" data-type="png">
                    <i class="fas fa-image me-2"></i> Unduh Diagram PNG
                  </button>
                </div>
                <div id="downloadProgress" class="progress mt-3 d-none">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
                </div>
                <div id="downloadError" class="alert alert-danger mt-3 d-none" style="font-size: 0.85rem;"></div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="font-size: 0.9rem;">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    const modal = new bootstrap.Modal(document.getElementById('downloadModal'));
    modal.show();
    
    document.querySelectorAll('.btn-download-option').forEach(btn => {
      btn.addEventListener('click', async () => {
        const errorElement = document.getElementById('downloadError');
        const progressElement = document.getElementById('downloadProgress');
        errorElement.classList.add('d-none');
        progressElement.classList.remove('d-none');
        
        try {
          const type = btn.dataset.type;
          const creatorName = document.getElementById('creatorName').value || '';
          const supervisorName = document.getElementById('supervisorName').value || '';
          
          btn.disabled = true;
          btn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> Memproses...`;
          
          if (type === 'pdf') {
            await generateStructuredReport(this.analysisData, this.allData, creatorName, supervisorName);
          } else {
            await downloadDiagramAsPNG();
          }
          
          modal.hide();
          setTimeout(() => modalDiv.remove(), 500);
        } catch (error) {
          console.error('Download error:', error);
          progressElement.classList.add('d-none');
          errorElement.textContent = 'Gagal mengunduh. Silakan coba lagi atau periksa koneksi internet.';
          errorElement.classList.remove('d-none');
          btn.disabled = false;
          btn.innerHTML = type === 'pdf' 
            ? '<i class="fas fa-file-pdf me-2"></i> Unduh Laporan PDF'
            : '<i class="fas fa-image me-2"></i> Unduh Diagram PNG';
        }
      });
    });
    
    document.getElementById('downloadModal').addEventListener('hidden.bs.modal', () => {
      setTimeout(() => modalDiv.remove(), 500);
    });
  }

  showError() {
    try {
      const container = document.querySelector('.container');
      if (!container) return;
      
      container.innerHTML = `
        <div class="alert alert-danger text-center">
          <h4 class="alert-heading" style="font-size: 1.1rem;">Data Tidak Ditemukan</h4>
          <p style="font-size: 0.9rem;">Silakan kembali ke halaman analisis dan pilih penyebab terlebih dahulu.</p>
          <hr>
          <a href="index.html" class="btn btn-danger" style="font-size: 0.9rem;">
            <i class="fas fa-arrow-left me-2"></i> Kembali ke Analisis
          </a>
        </div>
      `;
    } catch (error) {
      console.error('Error showing error message:', error);
    }
  }
}