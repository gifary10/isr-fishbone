// assets/results-app.js
import humanFactors from '../sources/man.js';
import methodFactors from '../sources/method.js';
import machineFactors from '../sources/machine.js';
import materialFactors from '../sources/material.js';
import measurementFactors from '../sources/measurement.js';
import environmentFactors from '../sources/mothernature.js';

import * as utils from './fishbone-utils.js';
import { renderFishboneDiagram } from './fishbone-diagram.js';
import { calculatePriorityByCategory, getTopSolutions, getCommonCasePatterns } from './correlation-utils.js';

class ResultsApp {
    constructor() {
        try {
            const storedData = JSON.parse(sessionStorage.getItem('fishboneAnalysis'));
            this.analysisData = storedData?.selected || null;
            this.categories = storedData?.categories || null;
            
            this.allData = {
                man: humanFactors.items,
                method: methodFactors.items,
                machine: machineFactors.items,
                measurement: measurementFactors.items,
                material: materialFactors.items,
                mothernature: environmentFactors.items
            };
            
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
            
            for (const [category, causes] of Object.entries(this.analysisData)) {
                if (!Array.isArray(causes)) continue;
                
                categoryCounts[category] = causes.length;
                totalCauses += causes.length;
                
                for (const causeId of causes) {
                    const cause = this.allData[category]?.find(item => item.id === causeId);
                    if (cause?.priority === 'Critical') criticalCount++;
                }
            }

            const dominantCategory = Object.keys(categoryCounts).reduce(
                (a, b) => categoryCounts[a] > categoryCounts[b] ? a : b
            );

            document.getElementById('totalCauses').textContent = totalCauses;
            document.getElementById('criticalCauses').textContent = criticalCount;
            document.getElementById('dominantCategory').textContent = utils.formatCategoryName(dominantCategory);
            document.getElementById('causesCount').textContent = `${totalCauses} penyebab`;
            
            const riskLevel = this.calculateRiskLevel();
            const riskBadge = document.getElementById('riskLevel');
            if (riskBadge) {
                riskBadge.textContent = riskLevel;
                riskBadge.className = `badge bg-${this.getRiskColor(riskLevel)}`;
            }
        } catch (error) {
            console.error('Error rendering summary:', error);
        }
    }

    calculateRiskLevel() {
        let criticalCount = 0;
        let highCount = 0;
        
        for (const [category, causeIds] of Object.entries(this.analysisData)) {
            if (!Array.isArray(causeIds)) continue;
            
            for (const causeId of causeIds) {
                const cause = this.allData[category]?.find(item => item.id === causeId);
                if (cause?.priority === 'Critical') criticalCount++;
                if (cause?.priority === 'High') highCount++;
            }
        }

        if (criticalCount >= 3) return 'Critical';
        if (criticalCount >= 1 || highCount >= 2) return 'High';
        if (highCount >= 1) return 'Medium';
        return 'Low';
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
                    labels: Object.keys(priorityByCategory).map(utils.formatCategoryName),
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
                                padding: 20
                            }
                        },
                        tooltip: {
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
                container.innerHTML = '<li class="list-group-item text-muted small">Tidak ada solusi yang ditemukan</li>';
                return;
            }

            topSolutions.forEach((solution, index) => {
                const li = document.createElement('li');
                li.className = 'list-group-item effective-solution-item d-flex align-items-center';
                li.innerHTML = `
                    <span class="badge bg-primary me-2">${index + 1}</span>
                    <span>${solution}</span>
                `;
                container.appendChild(li);
            });
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
                        <div class="card-header bg-secondary text-white">
                            <i class="fas fa-clipboard-list me-2"></i> Pola Kasus Umum
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                ${casePatterns.map(pattern => `
                                    <li class="list-group-item">
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
                    const cause = this.allData[category]?.find(item => item.id === causeId);
                    if (!cause) {
                        console.warn(`Cause with ID ${causeId} not found in category ${category}`);
                        continue;
                    }

                    const card = document.createElement('div');
                    card.className = `col-md-6 col-lg-4 mb-4`;
                    card.innerHTML = `
                        <div class="card cause-card h-100" data-category="${category}">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="card-title mb-0">${cause.cause}</h5>
                                    <span class="category-tag badge bg-${utils.getCategoryColor(category)}">
                                        ${utils.formatCategoryName(category)}
                                    </span>
                                </div>
                                <p class="card-text text-muted small">${cause.description || 'Tidak ada deskripsi'}</p>
                                
                                ${cause.solutions?.length ? `
                                    <div class="mt-3">
                                        <h6 class="text-primary">Solusi:</h6>
                                        <div class="d-flex flex-wrap gap-1">
                                            ${cause.solutions.map(sol => `
                                                <span class="solution-badge badge bg-light text-dark border">${sol}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${cause.caseExample ? `
                                    <div class="mt-2">
                                        <h6 class="text-info">Contoh Kasus:</h6>
                                        <p class="small mb-0">${cause.caseExample}</p>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="card-footer bg-transparent">
                                <small class="text-muted">
                                    Prioritas: 
                                    <span class="badge bg-${utils.getPriorityColor(cause.priority)}">
                                        ${cause.priority || 'Medium'}
                                    </span>
                                </small>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                }
            }
        } catch (error) {
            console.error('Error rendering cause cards:', error);
        }
    }

    renderFishboneDiagram() {
        try {
            renderFishboneDiagram(
                'fishboneDiagram', 
                this.analysisData, 
                this.allData
            );
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
                    this.downloadResults();
                });
            }
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    async downloadResults() {
        try {
            const container = document.querySelector('.container');
            if (!container) return;
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `fishbone-analysis-${timestamp}.png`;
            
            const canvas = await html2canvas(container);
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading results:', error);
            alert('Gagal mengunduh hasil. Silakan coba lagi.');
        }
    }

    getRiskColor(level) {
        switch(level) {
            case 'Critical': return 'danger';
            case 'High': return 'warning';
            case 'Medium': return 'info';
            default: return 'success';
        }
    }

    showError() {
        try {
            const container = document.querySelector('.container');
            if (!container) return;
            
            container.innerHTML = `
                <div class="alert alert-danger text-center">
                    <h4 class="alert-heading">Data Tidak Ditemukan</h4>
                    <p>Silakan kembali ke halaman analisis dan pilih penyebab terlebih dahulu.</p>
                    <hr>
                    <a href="index.html" class="btn btn-danger">
                        <i class="fas fa-arrow-left me-2"></i> Kembali ke Analisis
                    </a>
                </div>
            `;
        } catch (error) {
            console.error('Error showing error message:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ResultsApp();
});