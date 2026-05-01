// Australian transport settlement data
window.AUD = (n) => '$' + Number(n).toLocaleString('en-AU', {minimumFractionDigits: 0, maximumFractionDigits: 0});
window.AUD2 = (n) => '$' + Number(n).toLocaleString('en-AU', {minimumFractionDigits: 2, maximumFractionDigits: 2});

// Review Charges — list of trips with payouts. Each trip has charges (see TRIP_CHARGES below).
window.TRIPS = [
  // AI Suggest: Approve
  { id: 'DD25660103-LAMB', vendor: 'Dickies Transport', amount: 5300, hub: 'Hub-LAMB', vehicle: 'KW-K200-1142', vehicleModel: 'Kenworth K200', aiBucket: 'approve', aiRemark: 'All charges reviewed', from: 'Lambton, NSW', to: 'Kooragang, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25662590-LAMB', vendor: 'Dickies Transport', amount: 5550, hub: 'Hub-LAMB', vehicle: 'VLV-FH540-882', vehicleModel: 'Volvo FH 540', aiBucket: 'approve', aiRemark: '2 ad-hoc charge claims reviewed', from: 'Lambton, NSW', to: 'Kurri Kurri, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },

  // AI Suggest: Review
  { id: 'DD25668818-LAMB', vendor: 'Dickies Transport', amount: 900, hub: 'Hub-LAMB', vehicle: 'ISZ-FVR-220', vehicleModel: 'Isuzu FVR', aiBucket: 'review', aiRemark: '2 ad-hoc charges need review', from: 'Lambton, NSW', to: 'Carrington, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25665601-LAMB', vendor: 'Dickies Transport', amount: 1050, hub: 'Hub-LAMB', vehicle: 'IVC-EURO-560', vehicleModel: 'Iveco Eurocargo', aiBucket: 'review', aiRemark: 'Delay Penalty recommended', from: 'Lambton, NSW', to: 'Broadmeadow, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25657804-BERK', vendor: 'Coastwide Towing', amount: 5030, hub: 'Hub-BERK', vehicle: 'KW-K200-9088', vehicleModel: 'Kenworth K200', aiBucket: 'review', aiRemark: 'Freight charge doesn\u2019t match', from: 'Berkeley Vale, NSW', to: 'Lisarow, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25659965-BERK', vendor: 'Coastwide Towing', amount: 2500, hub: 'Hub-BERK', vehicle: 'IVC-EURO-560', vehicleModel: 'Iveco Eurocargo', aiBucket: 'review', aiRemark: 'Detention charge to review', from: 'Berkeley Vale, NSW', to: 'Hexham, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25673055-PENR', vendor: 'Red Hot Transit', amount: 1600, hub: 'Hub-PENR', vehicle: 'VLV-FH540-441', vehicleModel: 'Volvo FH 540', aiBucket: 'review', aiRemark: 'Detention claim mismatch + Delay Penalty', from: 'Penrith, NSW', to: 'St Marys, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },

  // AI Suggest: Reject
  { id: 'DD25662375-MAIT', vendor: 'Dickies Transport', amount: 2200, hub: 'Hub-MAIT', vehicle: 'MB-ACT-2643', vehicleModel: 'Mercedes-Benz Actros', aiBucket: 'reject', aiRemark: 'Ad-Hoc Charge claimed by vendor not matching', from: 'Maitland, NSW', to: 'Tomago, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25672774-INGS', vendor: 'Red Hot Transit', amount: 3400, hub: 'Hub-INGS', vehicle: 'IVC-EURO-291', vehicleModel: 'Iveco Eurocargo', aiBucket: 'reject', aiRemark: 'Vendor claims mismatch', from: 'Ingleburn, NSW', to: 'Campbelltown, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
];

// For each trip — its charge breakup (per Figma reference)
window.TRIP_CHARGES = {
  // ============ APPROVE bucket ============
  'DD25660103-LAMB': {
    groups: [
      { name: 'Freight Charges', subtotal: 5000, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25660103-LAMB', entityType: 'Trip', amount: 4700, remark: 'System generated', aiPill: '$10/km (from rates) \u00d7 470km (from distance master)', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-198004', entityType: 'Consignment', amount: 200, remark: 'At Kooragang Coal Terminal', aiPill: '$200 acknowledged on POD (Extracted)', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
        { id: 'C3', name: 'Detention Charge', entity: 'CN-198005', entityType: 'Consignment', amount: 100, remark: 'NA', aiPill: 'In time: 16 Feb 1:33pm; Out time: 16 Feb 2:45pm (from GPS)', aiBucket: 'approve', chargeType: 'detention', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 300, items: [
        { id: 'C4', name: 'Toll Charge', entity: 'DD25660103-LAMB', entityType: 'Trip', amount: 300, remark: 'M1 Pacific Mwy + Hunter Expressway', aiPill: 'Linkt e-tag log matched to GPS route', aiBucket: 'approve', chargeType: 'toll', reviewed: true },
      ]},
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 5300,
  },

  'DD25662590-LAMB': {
    groups: [
      { name: 'Freight Charges', subtotal: 5050, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25662590-LAMB', entityType: 'Trip', amount: 4800, remark: 'System generated', aiPill: '$10/km (from rates) \u00d7 480km (from distance master)', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-259004', entityType: 'Consignment', amount: 150, remark: 'At Kurri Kurri site', aiPill: '$150 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
        { id: 'C3', name: 'Detention Charge', entity: 'CN-259005', entityType: 'Consignment', amount: 100, remark: 'NA', aiPill: 'GPS verified: 50 min wait', aiBucket: 'approve', chargeType: 'detention', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 500, items: [
        { id: 'C4', name: 'Tarp & Strap', entity: 'DD25662590-LAMB', entityType: 'Trip', amount: 300, remark: 'Driver claim', aiPill: 'Acknowledged on driver upload', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C5', name: 'After-hours Surcharge', entity: 'DD25662590-LAMB', entityType: 'Trip', amount: 200, remark: 'Pre-dawn dispatch', aiPill: 'Approved per rate card AH-001', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
      ]},
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 5550,
  },

  // ============ REVIEW bucket ============
  'DD25668818-LAMB': {
    groups: [
      { name: 'Freight Charges', subtotal: 600, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25668818-LAMB', entityType: 'Trip', amount: 500, remark: 'System generated', aiPill: '$10/km \u00d7 50km', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-188104', entityType: 'Consignment', amount: 100, remark: 'At Carrington', aiPill: '$100 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 300, items: [
        { id: 'C4', name: 'Manual Loading Assist', entity: 'DD25668818-LAMB', entityType: 'Trip', amount: 150, remark: 'Driver claim — needs verification', aiPill: 'No POD evidence found', aiBucket: 'review', chargeType: 'distance', reviewed: false },
        { id: 'C5', name: 'Standby Time', entity: 'DD25668818-LAMB', entityType: 'Trip', amount: 150, remark: 'Driver claim — needs verification', aiPill: 'GPS shows only 18 min idle', aiBucket: 'review', chargeType: 'distance', reviewed: false },
      ]},
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 900,
  },

  'DD25665601-LAMB': {
    groups: [
      { name: 'Freight Charges', subtotal: 1100, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25665601-LAMB', entityType: 'Trip', amount: 1000, remark: 'System generated', aiPill: '$10/km \u00d7 100km', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-560104', entityType: 'Consignment', amount: 100, remark: 'At Broadmeadow', aiPill: '$100 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 0, items: [] },
      { name: 'Penalties', subtotal: -50, items: [
        { id: 'P1', name: 'Delay Penalty', entity: 'DD25665601-LAMB', entityType: 'Trip', amount: -50, remark: 'SLA breach — 2 hr late at Broadmeadow', aiPill: 'GPS arrival 2 hrs past committed ETA', aiBucket: 'penalty', chargeType: 'detention', reviewed: false },
      ]},
    ],
    total: 1050,
  },

  'DD25657804-BERK': {
    groups: [
      { name: 'Freight Charges', subtotal: 5030, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25657804-BERK', entityType: 'Trip', amount: 4830, remark: 'Rate mismatch flagged', aiPill: 'Vendor claimed $11/km \u2014 master rate is $10/km', aiBucket: 'review', chargeType: 'distance', reviewed: false },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-780404', entityType: 'Consignment', amount: 200, remark: 'At Lisarow', aiPill: '$200 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 0, items: [] },
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 5030,
  },

  'DD25659965-BERK': {
    groups: [
      { name: 'Freight Charges', subtotal: 2500, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25659965-BERK', entityType: 'Trip', amount: 2000, remark: 'System generated', aiPill: '$10/km \u00d7 200km', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-996504', entityType: 'Consignment', amount: 100, remark: 'At Hexham', aiPill: '$100 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
        { id: 'C3', name: 'Detention Charge', entity: 'CN-996505', entityType: 'Consignment', amount: 400, remark: '4 hr wait flagged for review', aiPill: 'GPS shows 4 hr 12 min, vendor claims 6 hr', aiBucket: 'review', chargeType: 'detention', reviewed: false },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 0, items: [] },
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 2500,
  },

  'DD25673055-PENR': {
    groups: [
      { name: 'Freight Charges', subtotal: 1575, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25673055-PENR', entityType: 'Trip', amount: 1475, remark: 'System generated', aiPill: '$10/km \u00d7 147.5km', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-305504', entityType: 'Consignment', amount: 100, remark: 'At St Marys', aiPill: '$100 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 100, items: [
        { id: 'C4', name: 'Detention Charge', entity: 'CN-305505', entityType: 'Consignment', amount: 100, remark: 'Vendor claim \u2014 stay too short', aiPill: 'GPS shows 47 min stay; detention applies only > 60 min \u2014 reject', aiBucket: 'reject', chargeType: 'detention', reviewed: false },
      ]},
      { name: 'Penalties', subtotal: -75, items: [
        { id: 'P1', name: 'Delay Penalty', entity: 'DD25673055-PENR', entityType: 'Trip', amount: -75, remark: 'SLA breach \u2014 ETA missed by 90 min', aiPill: 'GPS arrival 90 min past committed ETA', aiBucket: 'penalty', chargeType: 'detention', reviewed: false },
      ]},
    ],
    total: 1600,
  },

  // ============ REJECT bucket ============
  'DD25662375-MAIT': {
    groups: [
      { name: 'Freight Charges', subtotal: 1900, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25662375-MAIT', entityType: 'Trip', amount: 1800, remark: 'System generated', aiPill: '$10/km \u00d7 180km', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-237504', entityType: 'Consignment', amount: 100, remark: 'At Tomago', aiPill: '$100 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 300, items: [
        { id: 'C4', name: 'Multi-drop Surcharge', entity: 'DD25662375-MAIT', entityType: 'Trip', amount: 300, remark: 'Vendor claim \u2014 mismatch', aiPill: 'POD shows single drop only \u2014 reject claim', aiBucket: 'reject', chargeType: 'distance', reviewed: false },
      ]},
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 2200,
  },

  'DD25672774-INGS': {
    groups: [
      { name: 'Freight Charges', subtotal: 2900, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25672774-INGS', entityType: 'Trip', amount: 2800, remark: 'Vendor claims rate mismatch', aiPill: 'Vendor invoice $12/km \u2014 master rate $10/km', aiBucket: 'reject', chargeType: 'distance', reviewed: false },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-277404', entityType: 'Consignment', amount: 100, remark: 'At Campbelltown', aiPill: '$100 acknowledged on POD', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 500, items: [
        { id: 'C4', name: 'Toll Reimbursement', entity: 'DD25672774-INGS', entityType: 'Trip', amount: 500, remark: 'Vendor claim \u2014 no receipt', aiPill: 'No toll receipt attached \u2014 reject', aiBucket: 'reject', chargeType: 'distance', reviewed: false },
      ]},
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 3400,
  },
};

// Helper: build default charge breakup for any trip without explicit data
window.getTripCharges = function(trip) {
  if (window.TRIP_CHARGES[trip.id]) return window.TRIP_CHARGES[trip.id];
  const base = Math.round(trip.amount * 0.80);
  const unload = Math.round(trip.amount * 0.06);
  const det = Math.round(trip.amount * 0.05);
  const adhoc = Math.round(trip.amount * 0.04);
  const penalty = -(trip.amount - base - unload - det - adhoc);
  return {
    groups: [
      { name: 'Freight Charges', subtotal: base + unload + det, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: trip.id, entityType: 'Trip', amount: base, remark: 'System generated', aiPill: '$10/km (from rates) \u00d7 ' + Math.round(base/10) + 'km (from distance master)', aiBucket: trip.aiBucket==='reject' ? 'reject' : 'approve', chargeType: 'distance', reviewed: trip.aiBucket==='approve' },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-' + trip.id.slice(-7,-5).toUpperCase() + '04', entityType: 'Consignment', amount: unload, remark: 'At ' + trip.to.split(',')[0], aiPill: '$' + unload + ' acknowledged on POD (Extracted)', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
        { id: 'C3', name: 'Detention Charge', entity: 'CN-' + trip.id.slice(-7,-5).toUpperCase() + '05', entityType: 'Consignment', amount: det, remark: 'NA', aiPill: 'Verified by GPS in/out time', aiBucket: trip.aiBucket==='approve' ? 'approve' : 'review', chargeType: 'detention', reviewed: trip.aiBucket==='approve' },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: adhoc, items: [
        { id: 'C4', name: 'Loading Assist', entity: trip.id, entityType: 'Trip', amount: adhoc, remark: 'Manual handling', aiPill: 'Photo verified on POD', aiBucket: trip.aiBucket==='reject' ? 'reject' : 'approve', chargeType: 'distance', reviewed: trip.aiBucket!=='reject' },
      ]},
      { name: 'Penalties', subtotal: penalty, items: penalty < 0 ? [
        { id: 'P1', name: 'Delay', entity: trip.id, entityType: 'Trip', amount: penalty, remark: 'SLA breach', aiPill: 'SLA exceeded by 2 hrs (from GPS)', aiBucket: 'penalty', chargeType: 'detention', reviewed: false },
      ] : [] },
    ],
    total: trip.amount,
  };
};

// Toll charge detail (modal — Linkt e-tag verified)
window.TOLL = {
  trip: 'DD25660103-LAMB',
  remark: 'M1 Pacific Mwy + Hunter Expressway',
  amount: 300,
  tagNumber: '4118-0099-2814',
  vehicleClass: 'HV4 (Heavy Vehicle, 4+ axles)',
  account: 'Dickies Transport Fleet — Linkt Business',
  trips: 7,
  formula: 'Toll Charge = \u03a3 (toll point fare \u00d7 vehicle class multiplier)',
  calc: '7 toll point crossings on Linkt e-tag log, GPS-matched to trip route',
  source: 'Linkt Trip Statement (e-tag)',
};

// Detention charge detail (modal — GPS-verified)
window.DETENTION = {
  trip: 'DD25668818-LAMB',
  remark: 'NA',
  amount: 100,
  rate: 8.32,
  inTime: '16 Feb 2026 1:33pm',
  outTime: '16 Feb 2026 2:45pm',
  hours: 12,
  formula: 'Detention Charge = No. of hours detained \u00d7 Rate per hour',
  calc: 'Detention Charge = $8.32/hour \u00d7 12 hours',
};

// Unloading charge (POD-verified)
window.UNLOADING = {
  trip: 'DD25660103-LAMB',
  remark: 'At stop Kooragang Coal Terminal',
  amount: 200,
  rate: 32.00,
  pallets: 6,
  arrivedAt: 'Kooragang Coal Terminal, NSW 2304',
  signedBy: 'M. Patterson (Site Supervisor)',
  signedTime: '16 Feb 2026 11:42am',
  formula: 'Unloading Charge = No. of pallets \u00d7 Rate per pallet',
  calc: 'Unloading Charge = 6 pallets \u00d7 $32.00 + manual handling fee',
  source: 'Proof of Delivery (POD)',
};

// Distance Based Cost (POD-verified)
window.DISTANCE = {
  trip: 'DD25660103-LAMB',
  remark: 'System Generated',
  amount: 4700,
  baseRate: 10,
  distance: 470,
  inTime: '15 Feb 2026 6:00pm',
  formula: 'Distance Based Cost = Distance \u00d7 Rate per km',
  calc: 'Distance Based Cost = 470 km \u00d7 $10/km',
};

// Quick action cards (used by HomeScreen if it exists)
window.QUICK_ACTIONS = [
  { icon: 'truck', title: 'Review 10 Trips', sub: 'Charge Summary: $5,240', tag: 'REVIEW', tagColor: 'amber', time: '2 hrs ago' },
  { icon: 'alert', title: 'Resolve 5 Disputes', sub: 'Charge Summary: $1,830', tag: 'CRITICAL', tagColor: 'red', time: '2 hrs ago' },
  { icon: 'check', title: 'Bulk Approve 18 Trips', sub: 'Rider Attendance: 12 < 15', tag: null, time: '3 hrs ago' },
];

window.AI_QUERIES = [
  'Export all pending trips in Excel sheet',
  'Give me overview of all approved trips in last billing cycle',
  'Show disputes with amounts over $1,000',
  'Generate settlement report for this week',
];
