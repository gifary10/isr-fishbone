/**
 * Environmental Factors Data Module (Updated for Manufacturing)
 * Contains nature and environment-related causes for fishbone analysis
 * @version 2.0.0
 * @license MIT
 */

const environmentFactors = [
  {
    id: 'env-001',
    cause: 'Lantai licin karena tumpahan atau kondensasi',
    description: 'Permukaan lantai licin menyebabkan risiko tergelincir. Penyebab 35% kecelakaan jatuh.',
    priority: 'High',
    category: 'Lingkungan Kerja',
    solutions: [
      'Housekeeping harian dengan 5S',
      'Pembersihan tumpahan segera',
      'Lantai anti slip'
    ],
    riskAreas: [
      'Area mesin CNC',
      'Dekat cooling system',
      'Tempat pencucian'
    ]
  },
  {
    id: 'env-002',
    cause: 'Pencahayaan tidak memadai',
    description: 'Area kerja gelap meningkatkan risiko tersandung dan kecelakaan.',
    priority: 'Medium',
    category: 'Lingkungan Kerja',
    solutions: [
      'Pencahayaan tambahan (min. 300 lux)',
      'Pemeriksaan pencahayaan bulanan',
      'Peralatan dengan lampu kerja built-in'
    ],
    lightingStandards: {
      general: '300 lux',
      detailedWork: '500 lux'
    }
  },
  {
    id: 'env-003',
    cause: 'Suhu ekstrem di area kerja',
    description: 'Panas berlebih menyebabkan kelelahan dan penurunan konsentrasi.',
    priority: 'High',
    category: 'Termal',
    solutions: [
      'Ventilasi dan exhaust system',
      'Istirahat di area berpendingin',
      'Monitoring suhu real-time'
    ],
    temperatureThresholds: {
      heatAlert: '>32°C',
      criticalLimit: '>38°C'
    }
  },
  {
    id: 'env-004',
    cause: 'Kebisingan berlebihan',
    description: 'Suara mesin terlalu keras menyebabkan gangguan komunikasi.',
    priority: 'Medium',
    category: 'Lingkungan Kerja',
    solutions: [
      'Alat pelindung telinga (earplug/earmuff)',
      'Isolasi sumber kebisingan',
      'Rotasi pekerja di area bising'
    ],
    noiseLevels: {
      acceptable: '<85 dB',
      dangerous: '>85 dB (8 jam)'
    }
  },
  {
    id: 'env-005',
    cause: 'Kualitas udara buruk',
    description: 'Debu logam atau uap bahan kimia menyebabkan gangguan pernapasan.',
    priority: 'High',
    category: 'Kontaminasi Udara',
    solutions: [
      'Exhaust system dan filtrasi',
      'Penggunaan respirator',
      'Pengukuran kualitas udara rutin'
    ],
    pollutantExamples: [
      'Partikulat welding fumes',
      'Uap pelarut',
      'Debu kayu/logam'
    ]
  },
  {
    id: 'env-006',
    cause: 'Tata letak area kerja semrawut',
    description: 'Jalur sempit dan penumpukan material meningkatkan risiko terbentur dan terjepit.',
    priority: 'Medium',
    category: 'Tata Letak',
    solutions: [
      'Implementasi 5S',
      'Penandaan jalur aman',
      'Audit tata letak berkala'
    ],
    riskFactors: [
      'Jalur forklift sempit',
      'Material menumpuk di jalur evakuasi',
      'Area kerja terlalu padat'
    ]
  }
];

// Environmental metadata
const environmentMetadata = {
  categoryName: 'Faktor Lingkungan',
  icon: 'fas fa-leaf',
  color: '#6c757d',
  description: 'Faktor alam dan lingkungan kerja yang mempengaruhi keselamatan',
  riskProfile: {
    probability: 'Medium',
    severity: 'High'
  },
  monitoringSystems: [
    'Temperature sensors',
    'Air quality monitors',
    'Noise level meters'
  ],
  regulatoryReferences: [
    'Permenaker No. 5 Tahun 2018',
    'OSHA 1910.95',
    'ISO 14001:2015'
  ]
};

// Export data in structured format
export default {
  metadata: environmentMetadata,
  items: environmentFactors,
  relationships: {
    linkedCategories: ['method', 'machine', 'material'],
    crossDependencies: [
      'Work schedule adjustments',
      'Emergency preparedness'
    ]
  },
  emergencyProtocols: {
    environmentalHazards: [
      'Tumpahan bahan kimia',
      'Kebakaran',
      'Kecelakaan mesin'
    ],
    responseProcedures: [
      'Evakuasi terarah',
      'Penggunaan APAR',
      'Pertolongan pertama'
    ]
  }
};