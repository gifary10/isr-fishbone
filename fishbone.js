// fishbone.js - Modal for Fishbone Diagram Information (Improved Version)
document.addEventListener('DOMContentLoaded', function() {
    // Create modal elements
    const modal = document.createElement('div');
    modal.id = 'fishboneModal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-dialog-centered modal-dialog-scrollable';
    modalDialog.style.maxWidth = '800px'; // Set max width for better readability
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header bg-primary text-white';
    modalHeader.innerHTML = `
        <h6 class="modal-title"><i class="fas fa-fish me-2"></i>Penjelasan Fishbone Diagram</h6>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
    `;
    
    // Modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body p-3';
    
    // Content from fishbone.html (improved layout)
    modalBody.innerHTML = `
        <div class="container-fluid p-0">
            <div class="row g-2">
                <div class="col-12 col-md-6">
                    <div class="card h-100">
                        <div class="card-header text-white bg-primary d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#collapseDefinisi" role="button" aria-expanded="false">
                            <span class="fw-semibold"><i class="fas fa-book-open me-2"></i>Definisi</span>
                            
                        </div>
                        <div class="card-body collapse show" id="collapseDefinisi">
                            <p class="mb-2 small">Diagram Fishbone (Ishikawa) adalah alat visual untuk mengidentifikasi dan mengorganisir penyebab suatu masalah secara sistematis.</p>
                            
                            <div class="fishbone-example bg-light p-2 border-start border-primary border-3 mb-2">
                                <h6 class="text-primary mb-1">Struktur Dasar:</h6>
                                <ul class="small mb-0">
                                    <li>Kepala ikan: Masalah utama</li>
                                    <li>Tulang utama: Garis horizontal</li>
                                    <li>Tulang sekunder: Kategori penyebab</li>
                                    <li>Tulang tersier: Penyebab spesifik</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="card h-100">
                        <div class="card-header text-white bg-info d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#collapseSejarah" role="button" aria-expanded="false">
                            <span class="fw-semibold"><i class="fas fa-history me-2"></i>Sejarah</span>
                            
                        </div>
                        <div class="card-body collapse" id="collapseSejarah">
                            <p class="small mb-2">Dikembangkan tahun 1960 oleh Dr. Kaoru Ishikawa, profesor teknik Universitas Tokyo.</p>
                            
                            <h6 class="text-primary mb-1">Latar Belakang:</h6>
                            <ul class="small mb-0">
                                <li>Bagian dari pengendalian kualitas industri Jepang</li>
                                <li>Pertama digunakan di Kawasaki Shipyards</li>
                                <li>Menjadi alat manajemen kualitas global</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="card h-100">
                        <div class="card-header text-white bg-success d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#collapseManfaat" role="button" aria-expanded="false">
                            <span class="fw-semibold"><i class="fas fa-lightbulb me-2"></i>Manfaat</span>
                  
                        </div>
                        <div class="card-body collapse" id="collapseManfaat">
                            <ul class="small mb-2">
                                <li><strong>Visualisasi</strong>: Semua penyebab dalam satu pandangan</li>
                                <li><strong>Kolaborasi</strong>: Mendorong brainstorming tim</li>
                                <li><strong>Analisis Akar Masalah</strong>: Bedakan gejala dan penyebab</li>
                                <li><strong>Sistematis</strong>: Kerangka kerja terstruktur</li>
                            </ul>
                            
                            <div class="fishbone-example bg-light p-2 border-start border-primary border-3">
                                <p class="small mb-0">"Mengurangi cacat produksi 40% dalam 6 bulan dengan identifikasi penyebab utama."</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="card h-100">
                        <div class="card-header text-white bg-warning d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#collapseKategori" role="button" aria-expanded="false">
                            <span class="fw-semibold"><i class="fas fa-cogs me-2"></i>Kategori 6M</span>
                            
                        </div>
                        <div class="card-body collapse" id="collapseKategori">
                            <ul class="small mb-2">
                                <li><strong>Manusia</strong>: Keterampilan, pengetahuan</li>
                                <li><strong>Metode</strong>: Prosedur, sistem kerja</li>
                                <li><strong>Peralatan</strong>: Mesin, teknologi</li>
                                <li><strong>Bahan</strong>: Input, komponen</li>
                                <li><strong>Pengukuran</strong>: Sistem pengukuran</li>
                                <li><strong>Lingkungan</strong>: Kondisi kerja</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <div class="card">
                        <div class="card-header text-white bg-primary d-flex justify-content-between align-items-center" data-bs-toggle="collapse" href="#collapseCara" role="button" aria-expanded="false">
                            <span class="fw-semibold"><i class="fas fa-sitemap me-2"></i>Langkah Pembuatan</span>

                        </div>
                        <div class="card-body collapse" id="collapseCara">
                            <ol class="small mb-2">
                                <li>Definisikan masalah spesifik</li>
                                <li>Tentukan kategori (6M)</li>
                                <li>Brainstorming penyebab</li>
                                <li>Kelompokkan penyebab</li>
                                <li>Analisis dengan "5 Why"</li>
                                <li>Identifikasi penyebab utama</li>
                                <li>Rencanakan tindakan</li>
                            </ol>
                            
                            <div class="fishbone-example bg-light p-2 border-start border-primary border-3 mb-0">
                                <h7 class="small mb-0">Gunakan teknik 5 Why untuk mencapai akar masalah.</h7>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Modal footer
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer bg-light py-2';
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-sm btn-primary" data-bs-dismiss="modal">
            <i class="fas fa-check me-1"></i> Mengerti
        </button>
    `;
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Add event listeners for card header toggles
    modal.addEventListener('shown.bs.modal', function() {
        const cardHeaders = modal.querySelectorAll('.card-header[data-bs-toggle="collapse"]');
        
        cardHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const icon = this.querySelector('.toggle-icon');
                const target = this.getAttribute('href');
                const isCollapsed = document.querySelector(target).classList.contains('show');
                
                if (isCollapsed) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            });
        });
        
        // Open first card by default
        const firstCard = modal.querySelector('#collapseDefinisi');
        if (firstCard) firstCard.classList.add('show');
    });
    
    // Add optimized styles for the modal
    const style = document.createElement('style');
    style.textContent = `
        #fishboneModal .modal-content {
            border: none;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        
        #fishboneModal .modal-header {
            padding: 0.5rem 0.5rem;
            border-bottom: 0.5px solid rgba(255,255,255,0.2);
        }
        
        #fishboneModal .modal-body {
            padding: 0.75rem;
            max-height: 65vh;
            overflow-y: auto;
        }
        
        #fishboneModal .modal-footer {
            border-top: 1px solid #dee2e6;
            padding: 0.5rem 0.5rem;
        }
        
        #fishboneModal .card {
            border: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            margin-bottom: 0;
        }
        
        #fishboneModal .card-header {
            font-size: 0.9rem;
            padding: 0.4rem 0.4rem;
            border-bottom: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        #fishboneModal .card-header:hover {
            opacity: 0.95;
        }
        
        #fishboneModal .card-body {
            padding: 0.75rem;
            font-size: 0.9rem;
        }
        
        #fishboneModal .card-body p,
        #fishboneModal .card-body li {
            margin-bottom: 0.4rem;
            line-height: 1.4;
        }
        
        #fishboneModal .toggle-icon {
            transition: transform 0.2s ease;
            font-size: 0.9rem;
        }
        
        #fishboneModal ul, #fishboneModal ol {
            padding-left: 1.25rem;
            margin-bottom: 0.5rem;
        }
        
        #fishboneModal .fishbone-example {
            border-radius: 0 5px 5px 0;
            margin: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
            #fishboneModal .modal-dialog {
                margin: 0.5rem;
            }
            
            #fishboneModal .modal-body {
                max-height: 70vh;
                padding: 0.5rem;
            }
            
            #fishboneModal .card-header {
                font-size: 0.9rem;
            }
            
            #fishboneModal .card-body {
                font-size: 0.9rem;
                padding: 0.5rem;
            }
        }
    `;
    document.head.appendChild(style);
});