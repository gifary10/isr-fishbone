/** 
 * Machine Factors Data Module (Updated for Manufacturing)
 * Contains equipment-related failure causes for fishbone analysis
 * @version 2.0.0
 * @license MIT
 */

const machineFactors = [
  {
    id: 'machine-001',
    cause: 'Kerusakan komponen kritis',
    description: 'Kegagalan komponen utama seperti rem, pengaman, atau sistem kontrol. Penyebab 35% kecelakaan alat berat di manufaktur.',
    priority: 'Critical',
    category: 'Kegagalan Mekanis',
    solutions: [
      'Program preventive maintenance dengan vibration analysis',
      'Sistem monitoring kondisi mesin real-time',
      'Penggantian komponen berbasis predictive maintenance'
    ],
    technicalDetails: {
      components: ['Bearing overload', 'Hidrolik leakage', 'Conveyor belt failure'],
      mtbf: '3500 jam',
      mttr: '6 jam'
    },
    caseExample: 'Roller press terjepit akibat bearing rusak saat operasi',
    safetyRating: 1
  },
  {
    id: 'machine-002',
    cause: 'Keausan komponen tidak terdeteksi',
    description: 'Degradasi komponen yang tidak terpantau hingga menyebabkan kegagalan fungsional. Kontributor 22% kecelakaan terjepit.',
    priority: 'High',
    category: 'Pemeliharaan',
    solutions: [
      'Jadwal inspeksi berkala dengan thermal imaging',
      'Pelatihan operator untuk deteksi gejala awal keausan',
      'Implementasi AI-based predictive maintenance'
    ],
    wearPatterns: {
      normal: '0.08mm/bulan',
      abnormal: '0.4mm/bulan',
      critical: '0.8mm/bulan'
    }
  },
  {
    id: 'machine-003',
    cause: 'Tidak adanya pengaman (guard)',
    description: 'Area berbahaya mesin yang tidak diproteksi. Menyebabkan 45% kecelakaan mesin produksi.',
    priority: 'Critical',
    category: 'Desain Pengamanan',
    solutions: [
      'Risk assessment untuk semua point of operation',
      'Pemasangan light curtain dan safety interlocks',
      'Audit keselamatan mesin bulanan'
    ],
    hazardPoints: [
      'Area jepit conveyor',
      'Nip points mesin press',
      'Rotating parts mesin bubut'
    ],
    compliance: {
      osha: true,
      iso12100: true
    }
  },
  {
    id: 'machine-004',
    cause: 'Overloading mesin',
    description: 'Melebihi kapasitas desain untuk mengejar target produksi. Penyebab 28% kegagalan struktural.',
    priority: 'High',
    category: 'Operasional',
    solutions: [
      'Load cell system dengan alarm otomatis',
      'Interlock system yang mencegah operasi overload',
      'Pelatihan operator tentang konsekuensi overloading'
    ],
    loadLimits: {
      design: '1200kg',
      actual: '1600kg'
    }
  },
  {
    id: 'machine-005',
    cause: 'Desain mesin tidak ergonomis',
    description: 'Posisi kontrol yang tidak ergonomis meningkatkan risiko operator terjepit atau terbentur.',
    priority: 'Medium',
    category: 'Desain Fisik',
    solutions: [
      'Redesign workstation berdasarkan antropometri pekerja',
      'Audit ergonomi setiap 6 bulan',
      'Penempatan kontrol dalam jangkauan aman'
    ],
    riskExample: 'Operator harus menjangkau melewati area jepit untuk mengakses tombol darurat'
  },
  {
    id: 'machine-006',
    cause: 'Pergerakan mesin otomatis tanpa deteksi area',
    description: 'Sensor gagal mendeteksi keberadaan pekerja di area berbahaya.',
    priority: 'Critical',
    category: 'Sistem Otomatisasi',
    solutions: [
      'Safety laser scanner di sekitar robot',
      'Emergency stop dengan kabel tarik di conveyor',
      'Simulasi uji darurat setiap bulan'
    ],
    caseExample: 'Operator tertabrak lengan robot saat mengambil barang jatuh di area kerja'
  },
  {
    id: 'machine-007',
    cause: 'Pinch point pada conveyor system',
    description: 'Area jepit antara belt conveyor dan roller menyebabkan 32% kecelakaan terjepit di manufaktur.',
    priority: 'Critical',
    category: 'Desain Mekanis',
    solutions: [
      'Pemasangan guard fisik di semua pinch point',
      'Sistem sensor proximity di area berbahaya',
      'Pelatihan kesadaran bahaya area jepit'
    ],
    caseExample: 'Tangan operator terjepit antara roller dan belt conveyor'
  }
];

// Machine-specific metadata
const machineMetadata = {
  categoryName: 'Faktor Mesin',
  icon: 'fas fa-cogs',
  color: '#ffc107',
  description: 'Faktor yang berkaitan dengan peralatan/mesin sebagai penyebab kecelakaan kerja',
  riskProfile: {
    probability: 'High',
    severity: 'Critical'
  },
  standards: [
    'ISO 12100',
    'ASME B20.1',
    'PUIL 2020'
  ]
};

// Export data in structured format
export default {
  metadata: machineMetadata,
  items: machineFactors,
  relationships: {
    linkedCategories: ['man', 'method', 'material'],
    commonFailures: [
      'Lack of maintenance',
      'Safety guard bypass'
    ]
  },
  maintenanceGuidelines: {
    daily: ['Lubrication check', 'Safety device test'],
    weekly: ['Alignment check', 'Vibration analysis'],
    monthly: ['Component replacement', 'Full safety inspection']
  }
};