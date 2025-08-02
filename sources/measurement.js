/**
 * Measurement Factors Data Module (Updated for Manufacturing)
 * Contains measurement-related failure causes for fishbone analysis
 * @version 2.0.0
 * @license MIT
 */

const measurementFactors = [
  {
    id: 'meas-001',
    cause: 'Alat ukur tidak terkalibrasi',
    description: 'Penggunaan alat ukur dengan akurasi tidak terjamin. Menyebabkan 25% kecelakaan proses.',
    priority: 'Critical',
    category: 'Kalibrasi',
    solutions: [
      'Program kalibrasi berkala traceable',
      'Sistem reminder otomatis',
      'Label status kalibrasi'
    ],
    criticalInstruments: [
      'Pressure gauge',
      'Temperature sensor',
      'Gas detector'
    ],
    calibrationRequirements: {
      frequency: '3 bulan',
      standard: 'ISO/IEC 17025',
      tolerance: '±1% FS'
    },
    caseExample: 'Overheating mesin karena kesalahan pembacaan suhu'
  },
  {
    id: 'meas-002',
    cause: 'Salah interpretasi data pengukuran',
    description: 'Kesalahan dalam membaca hasil pengukuran. Kontributor 20% kesalahan operasional.',
    priority: 'High',
    category: 'Interpretasi',
    solutions: [
      'Pelatihan unit conversion',
      'Display digital dengan satuan jelas',
      'Prosedur double-check'
    ],
    commonErrors: [
      'Membaca mm sebagai cm',
      'Konversi imperial-metric',
      'Pembulatan tidak tepat'
    ]
  },
  {
    id: 'meas-003',
    cause: 'Sensor tidak mendeteksi kehadiran manusia',
    description: 'Gagal mendeteksi pekerja di area berbahaya. Penyebab kecelakaan terjepit/terbentur.',
    priority: 'Critical',
    category: 'Sistem Keamanan',
    solutions: [
      'Safety light curtain',
      'Laser scanner area',
      'Uji fungsi harian'
    ],
    affectedSystems: [
      'Robot assembly',
      'Automated conveyor',
      'Press machines'
    ]
  },
  {
    id: 'meas-004',
    cause: 'Indikator visual tidak terbaca',
    description: 'Pressure gauge atau indikator tertutup kotoran atau posisi buruk.',
    priority: 'Medium',
    category: 'Keterbacaan',
    solutions: [
      'Pembersihan berkala alat ukur',
      'Digital display di panel kontrol',
      'Audit visualisasi alat ukur'
    ],
    caseExample: 'Operator tidak melihat indikator overload pada mesin press'
  },
  {
    id: 'meas-005',
    cause: 'Tidak ada pengukuran kebisingan',
    description: 'Paparan kebisingan berlebihan tanpa pemantauan menyebabkan gangguan pendengaran.',
    priority: 'High',
    category: 'Lingkungan',
    solutions: [
      'Sound level meter berkala',
      'Noise mapping area produksi',
      'Pengendalian sumber kebisingan'
    ],
    noiseLevels: {
      acceptable: '<85 dB',
      dangerous: '>85 dB (8 jam)'
    }
  }
];

// Measurement-specific metadata
const measurementMetadata = {
  categoryName: 'Faktor Pengukuran',
  icon: 'fas fa-ruler-combined',
  color: '#28a745',
  description: 'Faktor yang berkaitan dengan kesalahan pengukuran dan monitoring',
  riskProfile: {
    probability: 'High',
    severity: 'Critical'
  },
  applicableStandards: [
    'ISO 9001:2015',
    'ISO/IEC 17025:2017',
    'OSHA 1910.145'
  ],
  calibrationRequirements: {
    minimumAccuracy: '±1% of reading',
    documentation: 'Sertifikat kalibrasi traceable'
  }
};

// Export data in structured format
export default {
  metadata: measurementMetadata,
  items: measurementFactors,
  relationships: {
    linkedCategories: ['machine', 'method', 'environment'],
    criticalDependencies: [
      'Sensor accuracy',
      'Data recording systems'
    ]
  },
  qualityControl: {
    verificationMethods: [
      'Cross-check dengan alat master',
      'Statistical process control',
      'Gauge R&R studies'
    ],
    documentationRequirements: [
      'Timestamp',
      'Operator ID',
      'Environmental conditions'
    ]
  }
};