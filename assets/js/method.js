/**
 * Method Factors Data Module (Updated for Manufacturing)
 * Contains procedure-related failure causes for fishbone analysis
 * @version 2.0.0
 * @license MIT
 */

export const methodFactors = [
  {
    id: 'meth-001',
    cause: 'SOP tidak tersedia untuk tugas berisiko',
    description: 'Tidak adanya prosedur tertulis untuk pekerjaan berbahaya. Ditemukan dalam 40% kecelakaan.',
    priority: 'Critical',
    category: 'Dokumentasi',
    solutions: [
      'Pengembangan JSA untuk semua tugas kritis',
      'Verifikasi SOP sebelum pekerjaan baru',
      'Digitalisasi SOP mudah diakses'
    ],
    riskAssessment: {
      required: true,
      reference: 'Permenaker No. 38/2021',
      frequency: 'Tahunan'
    }
  },
  {
    id: 'meth-002',
    cause: 'Tidak menerapkan LOTO (Lockout Tagout)',
    description: 'Peralatan tidak diamankan sebelum perawatan. Penyebab utama kecelakaan terjepit.',
    priority: 'Critical',
    category: 'Energi Berbahaya',
    solutions: [
      'SOP LOTO wajib untuk semua mesin',
      'Pelatihan LOTO tahunan',
      'Verifikasi LOTO sebelum pekerjaan'
    ],
    caseExample: 'Pekerja terjepit dalam mesin conveyor saat pembersihan tanpa isolasi energi'
  },
  {
    id: 'meth-003',
    cause: 'Metode penanganan material tidak aman',
    description: 'Prosedur angkat-angkut yang salah menyebabkan cedera punggung dan terjepit.',
    priority: 'High',
    category: 'Penanganan Material',
    solutions: [
      'SOP angkat manual dengan teknik benar',
      'Penggunaan alat bantu mekanis',
      'Pelatihan ergonomi'
    ],
    riskFactors: [
      'Beban berat',
      'Posisi tubuh salah',
      'Permukaan tidak rata'
    ]
  },
  {
    id: 'meth-004',
    cause: 'Prosedur darurat tidak memadai',
    description: 'Tidak ada atau prosedur darurat tidak efektif. Memperparah konsekuensi kecelakaan.',
    priority: 'Critical',
    category: 'Respons Darurat',
    solutions: [
      'Simulasi darurat setiap 3 bulan',
      'Pelatihan first aid khusus',
      'Peta evakuasi jelas di setiap area'
    ],
    criticalProcedures: [
      'Kebakaran',
      'Kecelakaan mesin',
      'Bahan kimia tumpah'
    ]
  },
  {
    id: 'meth-005',
    cause: 'Komunikasi prosedur tidak efektif',
    description: 'Instruksi kerja ambigu atau tidak dipahami. Penyebab 30% kesalahan operasional.',
    priority: 'High',
    category: 'Komunikasi',
    solutions: [
      'Penulisan prosedur dengan bahasa sederhana',
      'Penggunaan visual aid',
      'Verifikasi pemahaman dengan metode teach-back'
    ]
  },
  {
    id: 'meth-006',
    cause: 'Penjadwalan perawatan tidak optimal',
    description: 'Jadwal maintenance tidak sesuai kondisi mesin. Meningkatkan risiko kegagalan mendadak.',
    priority: 'Medium',
    category: 'Pemeliharaan',
    solutions: [
      'Implementasi predictive maintenance',
      'Penjadwalan berbasis kondisi mesin',
      'Analisis data historis kegagalan'
    ]
  }
];

export const methodMetadata = {
  categoryName: 'Faktor Metode',
  icon: 'fas fa-project-diagram',
  color: '#17a2b8',
  description: 'Faktor yang berkaitan dengan prosedur kerja dan sistem manajemen',
  riskProfile: {
    probability: 'High',
    severity: 'Critical'
  },
  applicableStandards: [
    'ISO 45001:2018',
    'Permenaker No. 38/2021',
    'OSHA 29 CFR 1910'
  ],
  documentationRequirements: {
    language: 'Bahasa Indonesia sederhana',
    format: 'Digital + fisik',
    reviewCycle: 'Tahunan'
  }
};

export default {
  metadata: methodMetadata,
  items: methodFactors,
  relationships: {
    linkedCategories: ['man', 'machine', 'measurement'],
    processLinks: [
      'Training effectiveness',
      'Document control'
    ]
  },
  qualityAssurance: {
    documentControl: {
      versioning: true,
      approvalWorkflow: [
        'PIC departemen',
        'HSE officer',
        'Plant manager'
      ]
    },
    changeManagement: {
      impactAssessment: true,
      notificationProtocol: [
        'Toolbox meeting',
        'Memo elektronik',
        'Update sistem digital'
      ]
    }
  }
};