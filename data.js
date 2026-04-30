// Australian transport settlement data
window.AUD = (n) => '$' + Number(n).toLocaleString('en-AU', {minimumFractionDigits: 0, maximumFractionDigits: 0});
window.AUD2 = (n) => '$' + Number(n).toLocaleString('en-AU', {minimumFractionDigits: 2, maximumFractionDigits: 2});

// Review Charges — list of trips with payouts. Each trip has charges (see TRIP_CHARGES below).
window.TRIPS = [
  // AI Suggest: Approve
  { id: 'DD25660103-LAMB', vendor: 'Dickies Transport', amount: 5000, hub: 'Hub-LAMB', vehicle: 'KW-K200-1142', vehicleModel: 'Kenworth K200', aiBucket: 'approve', aiRemark: 'All charges reviewed', from: 'Lambton, NSW', to: 'Kooragang, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25662590-LAMB', vendor: 'Dickies Transport', amount: 5550, hub: 'Hub-LAMB', vehicle: 'VLV-FH540-882', vehicleModel: 'Volvo FH 540', aiBucket: 'approve', aiRemark: '2 ad-hoc charge claims reviewed', from: 'Lambton, NSW', to: 'Kurri Kurri, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },

  // AI Suggest: Review
  { id: 'DD25668818-LAMB', vendor: 'Dickies Transport', amount: 900, hub: 'Hub-LAMB', vehicle: 'ISZ-FVR-220', vehicleModel: 'Isuzu FVR', aiBucket: 'review', aiRemark: '2 ad-hoc charges need review', from: 'Lambton, NSW', to: 'Carrington, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25665601-LAMB', vendor: 'Dickies Transport', amount: 1050, hub: 'Hub-LAMB', vehicle: 'IVC-EURO-560', vehicleModel: 'Iveco Eurocargo', aiBucket: 'review', aiRemark: 'Delay Penalty recommended', from: 'Lambton, NSW', to: 'Broadmeadow, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25657804-BERK', vendor: 'Coastwide Towing', amount: 5030, hub: 'Hub-BERK', vehicle: 'KW-K200-9088', vehicleModel: 'Kenworth K200', aiBucket: 'review', aiRemark: 'Freight charge doesn\u2019t match', from: 'Berkeley Vale, NSW', to: 'Lisarow, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25659965-BERK', vendor: 'Coastwide Towing', amount: 2500, hub: 'Hub-BERK', vehicle: 'IVC-EURO-560', vehicleModel: 'Iveco Eurocargo', aiBucket: 'review', aiRemark: 'Detention charge to review', from: 'Berkeley Vale, NSW', to: 'Hexham, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25673055-PENR', vendor: 'Red Hot Transit', amount: 1500, hub: 'Hub-PENR', vehicle: 'VLV-FH540-441', vehicleModel: 'Volvo FH 540', aiBucket: 'review', aiRemark: 'Delay Penalty recommended', from: 'Penrith, NSW', to: 'St Marys, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },

  // AI Suggest: Reject
  { id: 'DD25662375-MAIT', vendor: 'Dickies Transport', amount: 2200, hub: 'Hub-MAIT', vehicle: 'MB-ACT-2643', vehicleModel: 'Mercedes-Benz Actros', aiBucket: 'reject', aiRemark: 'Ad-Hoc Charge claimed by vendor not matching', from: 'Maitland, NSW', to: 'Tomago, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
  { id: 'DD25672774-INGS', vendor: 'Red Hot Transit', amount: 3400, hub: 'Hub-INGS', vehicle: 'IVC-EURO-291', vehicleModel: 'Iveco Eurocargo', aiBucket: 'reject', aiRemark: 'Vendor claims mismatch', from: 'Ingleburn, NSW', to: 'Campbelltown, NSW', billingCycle: '20 Jan 2026 - 19 Feb 2026' },
];

// For each trip — its charge breakup (per Figma reference)
window.TRIP_CHARGES = {
  'DD25660103-LAMB': {
    groups: [
      { name: 'Freight Charges', subtotal: 5000, items: [
        { id: 'C1', name: 'Distance Based Cost', entity: 'DD25660103-LAMB', entityType: 'Trip', amount: 4700, remark: 'System generated', aiPill: '$10/km (from rates) \u00d7 470km (from distance master)', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
        { id: 'C2', name: 'Unloading Charge', entity: 'CN-198004', entityType: 'Consignment', amount: 200, remark: 'At Kooragang Coal Terminal', aiPill: '$200 acknowledged on POD (Extracted)', aiBucket: 'approve', chargeType: 'unloading', reviewed: true },
        { id: 'C3', name: 'Detention Charge', entity: 'CN-198005', entityType: 'Consignment', amount: 100, remark: 'NA', aiPill: 'In time: 16 Feb 1:33pm; Out time: 16 Feb 2:45pm (from GPS)', aiBucket: 'approve', chargeType: 'detention', reviewed: true },
      ]},
      { name: 'Ad-Hoc Charges', subtotal: 200, items: [
        { id: 'C4', name: 'Tarp & Strap', entity: 'DD25660103-LAMB', entityType: 'Trip', amount: 200, remark: 'Driver claim', aiPill: 'Acknowledged on driver upload', aiBucket: 'approve', chargeType: 'distance', reviewed: true },
      ]},
      { name: 'Penalties', subtotal: 0, items: [] },
    ],
    total: 5000,
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
