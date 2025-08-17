/**
 * Material Factors Data Module (Updated for Manufacturing)
 * Contains material-related failure causes for fishbone analysis
 * @version 2.0.0
 * @license MIT
 */

export const materialFactors = [
  {
    id: 'mat-001',
    cause: 'Material tidak sesuai spesifikasi',
    description: 'Penggunaan material di bawah standar teknis. Penyebab 30% kegagalan struktural.',
    priority: 'Critical',
    category: 'Kualitas Material',
    solutions: [
      'Quality gate dengan sertifikat material (MTC)',
      'Pengujian material masuk secara acak',
      'Daftar hitam pemasok tidak terpercaya'
    ],
    technicalSpecs: {
      standard: 'ASTM A36',
      actual: 'ASTM A283 Grade D',
      propertyGaps: {
        yieldStrength: '250MPa vs 200MPa',
        elongation: '23% vs 18%'
      }
    },
    caseExample: 'Runtuhnya rak penyimpanan karena material tidak memenuhi standar',
    costImpact: {
      replacementCost: 'Rp 150 juta',
      downtimeCost: 'Rp 50 juta/hari'
    }
  },
  {
    id: 'mat-002',
    cause: 'Material tajam tanpa proteksi',
    description: 'Benda kerja dengan sudut tajam meningkatkan risiko luka tersayat. Kontributor 28% kecelakaan luka potong.',
    priority: 'High',
    category: 'Pengemasan',
    solutions: [
      'Edge protection pada material tajam',
      'Sarung tangan cut-resistant',
      'Prosedur handling khusus'
    ],
    riskZones: ['Area cutting', 'Stamping', 'Material handling']
  },
  {
    id: 'mat-003',
    cause: 'Permukaan licin atau berdebu',
    description: 'Debu logam atau oli pada permukaan menyebabkan risiko tergelincir. Penyebab 35% kecelakaan jatuh.',
    priority: 'High',
    category: 'Kebersihan',
    solutions: [
      'Housekeeping harian dengan 5S',
      'Pembersih tumpahan segera',
      'Lantai anti slip'
    ],
    incidentExamples: [
      'Pekerja terpeleset karena serpihan logam',
      'Minyak tumpah dari material'
    ]
  },
  {
    id: 'mat-004',
    cause: 'Material berat tanpa alat bantu',
    description: 'Beban berat meningkatkan risiko cedera punggung dan terjepit.',
    priority: 'High',
    category: 'Penanganan',
    solutions: [
      'SOP pengangkatan manual dengan alat bantu',
      'Pelatihan teknik angkat benar',
      'Penggunaan forklift/hoist'
    ],
    weightThresholds: {
      manual: 'Max 25kg',
      teamLift: '25-50kg',
      mechanical: '>50kg'
    }
  },
  {
    id: 'mat-005',
    cause: 'Kontaminasi silang material',
    description: 'Pencampuran material yang tidak kompatibel menyebabkan reaksi berbahaya.',
    priority: 'Medium',
    category: 'Penyimpanan',
    solutions: [
      'Zonasi penyimpanan berdasarkan kompatibilitas',
      'Labeling dan kode warna jelas',
      'Pelatihan penanganan material'
    ],
    incompatiblePairs: [
      'Asam + Basa',
      'Oksidator + Bahan mudah terbakar'
    ]
  },
  {
    id: 'mat-006',
    cause: 'Kemasan tidak aman',
    description: 'Kemasan rusak atau tidak stabil menyebabkan material jatuh dan membahayakan pekerja.',
    priority: 'Medium',
    category: 'Pengemasan',
    solutions: [
      'Inspeksi kemasan saat penerimaan',
      'Pallet wrapping standar',
      'Penumpukan sesuai kapasitas'
    ],
    caseExample: 'Material jatuh dari pallet yang tidak stabil menimpa pekerja'
  }
];

export const materialMetadata = {
  categoryName: 'Faktor Material',
  icon: 'fas fa-boxes',
  color: '#dc3545',
  description: 'Faktor yang berkaitan dengan material sebagai penyebab kecelakaan kerja',
  riskProfile: {
    probability: 'Medium',
    severity: 'High'
  },
  applicableStandards: [
    'ISO 9001:2015',
    'ASTM E1476',
    'ASME BPVC'
  ],
  testingProtocols: [
    'Material Testing',
    'Chemical Analysis',
    'Non-Destructive Testing'
  ]
};

export default {
  metadata: materialMetadata,
  items: materialFactors,
  relationships: {
    linkedCategories: ['machine', 'method', 'man'],
    commonRootCauses: [
      'Supplier quality issues',
      'Improper material handling'
    ]
  },
  materialManagement: {
    inspectionChecklist: [
      'Sertifikat material',
      'Kondisi kemasan',
      'Label identifikasi'
    ],
    quarantineProcedure: [
      'Area terpisah',
      'Label merah',
      'Max 5 hari'
    ]
  }
};