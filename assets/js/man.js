/**
 * Human Factors Data Module (Updated for Manufacturing)
 * Contains all human-related causes for fishbone analysis
 * @version 2.0.0
 * @license MIT
 */

export const humanFactors = [
  {
    id: 'man-001',
    cause: 'Kurangnya kesadaran bahaya',
    description: 'Gagal mengenali situasi berbahaya di area mesin. Penyebab 38% kecelakaan terjepit/terbentur.',
    priority: 'Critical',
    category: 'Faktor Kognitif',
    solutions: [
      'Safety induction dengan simulasi bahaya nyata',
      'Job Safety Analysis (JSA) untuk semua tugas',
      'Safety signage dengan visual bahaya'
    ],
    impact: 'Meningkatkan risiko kecelakaan fatal',
    caseExamples: [
      'Operator tidak menyadari mesin masih berjalan saat pembersihan',
      'Mendekati area jepit tanpa prosedur aman'
    ],
    preventionCost: 'low',
    detectionDifficulty: 'medium'
  },
  {
    id: 'man-002',
    cause: 'Gerakan ceroboh di area mesin',
    description: 'Perilaku tidak hati-hati saat bekerja di dekat mesin berbahaya. Kontributor utama kecelakaan terjepit/tersayat.',
    priority: 'High',
    category: 'Faktor Perilaku',
    solutions: [
      'Kampanye "Stop-Think-Act" di area produksi',
      'Video training tentang kecelakaan aktual',
      'Safety reminder di titik rawan'
    ],
    statistics: {
      frequency: '32% dari total insiden',
      severity: 'Rata-rata 7 hari kerja hilang'
    },
    relatedItems: ['machine-003', 'method-005']
  },
  {
    id: 'man-003',
    cause: 'Pelanggaran prosedur LOTO (Lockout Tagout)',
    description: 'Tidak mengisolasi energi mesin sebelum perawatan. Ditemukan pada 65% kecelakaan terjepit.',
    priority: 'Critical',
    category: 'Faktor Kepatuhan',
    solutions: [
      'Safety leadership dan pengawasan ketat',
      'Program "Zero Energy Verification"',
      'Audit LOTO bulanan'
    ],
    rootCauses: [
      'Tekanan produksi',
      'Waktu perawatan terbatas'
    ]
  },
  {
    id: 'man-004',
    cause: 'Kelelahan (fatigue)',
    description: 'Penurunan kewaspadaan akibat jam kerja panjang. Meningkatkan risiko kecelakaan 40%.',
    priority: 'High',
    category: 'Faktor Fisik',
    solutions: [
      'Rotasi shift ergonomis',
      'Pembatasan overtime untuk tugas berisiko',
      'Program deteksi gejala kelelahan'
    ],
    workingHoursImpact: {
      '>8 jam': '40% peningkatan risiko',
      '>12 jam': '75% peningkatan risiko'
    }
  },
  {
    id: 'man-005',
    cause: 'Kurangnya keterampilan operasional',
    description: 'Ketidakmampuan mengoperasikan alat/mesin dengan benar. Kontributor 25% kecelakaan kerja.',
    priority: 'High',
    category: 'Kompetensi',
    solutions: [
      'Sertifikasi kompetensi berbasis praktik',
      'Pelatihan simulator untuk tugas berisiko tinggi',
      'Evaluasi kompetensi setiap 3 bulan'
    ],
    trainingHours: {
      basic: '40 jam',
      advanced: '100 jam'
    },
    certification: 'Sertifikasi BNSP'
  },
  {
    id: 'man-006',
    cause: 'Tidak mematuhi penggunaan APD',
    description: 'Pekerja tidak menggunakan sepatu safety, helm, atau sarung tangan di area wajib.',
    priority: 'Critical',
    category: 'Faktor Kepatuhan',
    solutions: [
      'Sistem penalti dan reward kepatuhan APD',
      'Safety officer harian',
      'APD ergonomis dan nyaman'
    ],
    statistics: {
      nonComplianceRate: '15% harian di area produksi',
      relatedIncidents: 'Terjepit, tersayat, terbentur'
    }
  },
  {
    id: 'man-007',
    cause: 'Distraksi saat operasi mesin',
    description: 'Teralihkannya fokus saat mengoperasikan peralatan berbahaya. Kontributor 30% kecelakaan.',
    priority: 'High',
    category: 'Faktor Kognitif',
    solutions: [
      'Kebijakan "no phone" di area produksi',
      'Zona fokus dengan marking lantai',
      'Budaya saling mengingatkan'
    ],
    impact: 'Kontributor utama insiden minor hingga fatal',
    caseExamples: [
      'Operator melihat ponsel saat mesin press beroperasi',
      'Berkonsentrasi pada percakapan saat mengoperasikan forklift'
    ]
  },
  {
    id: 'man-008',
    cause: 'Posisi kerja tidak aman',
    description: 'Berdiri atau bergerak di area berbahaya tanpa prosedur aman.',
    priority: 'High',
    category: 'Faktor Perilaku',
    solutions: [
      'Penandaan area aman dengan marking lantai',
      'Safety barrier di sekitar mesin berbahaya',
      'Pelatihan posisi kerja aman'
    ],
    caseExamples: [
      'Berdiri di jalur pergerakan forklift',
      'Membersihkan mesin dari sisi berbahaya'
    ]
  }
];

export const humanMetadata = {
  categoryName: 'Faktor Manusia',
  icon: 'fas fa-user-injured',
  color: '#3498db',
  description: 'Faktor yang berkaitan dengan manusia sebagai penyebab kecelakaan kerja',
  riskProfile: {
    probability: 'High',
    severity: 'Critical'
  },
  keyMetrics: {
    incidentRate: '2.8 per 200,000 jam kerja',
    nearMissFrequency: '18 per bulan'
  },
  improvementStrategies: [
    'Behavior Based Safety Program',
    'Situational Awareness Training'
  ]
};

export default {
  metadata: humanMetadata,
  items: humanFactors,
  relationships: {
    linkedCategories: ['method', 'machine', 'environment'],
    commonRootCauses: [
      'Pelatihan tidak memadai',
      'Supervisi lemah'
    ]
  },
  trainingFramework: {
    levels: [
      {
        level: 'Dasar',
        duration: '24 jam',
        competencies: [
          'Pengenalan bahaya mesin',
          'Prosedur darurat'
        ]
      },
      {
        level: 'Menengah',
        duration: '40 jam',
        competencies: [
          'Operasi alat berat',
          'Lockout Tagout'
        ]
      },
      {
        level: 'Lanjutan',
        duration: '80 jam',
        competencies: [
          'Troubleshooting mesin',
          'Penanganan darurat'
        ]
      }
    ],
    evaluationMethods: [
      'Tes tertulis',
      'Demonstrasi praktik',
      'Penilaian kinerja'
    ]
  },
  compliance: {
    standards: [
      'Permenaker No. 2 Tahun 2022',
      'ISO 45001:2018',
      'OSHA 29 CFR 1910'
    ],
    requirements: [
      'Pelatihan keselamatan tahunan',
      'Sertifikasi operator',
      'Pencatatan insiden'
    ]
  }
};