# Delay Penalty changes

These two files contain all the work for converting the Detention-styled Delay Penalty into a proper SLA-breach Delay Penalty (with its own evidence panel instead of a POD docket).

## Files

- **modal-charge.jsx** — drop into `vendorpay/modal-charge.jsx`
  - Added `'penalty'` to `titleMap` and `verifiedMap`
  - Treated penalty as telemetry-backed (Map sub-tab visible)
  - Derives delay (mins/hrs) from the AI pill text and computes `$50/hr × hours late`
  - Right panel shows: Committed ETA · Actual Arrival · Delay · Penalty Rate
  - `PodAttachment` now routes `chargeType === 'penalty'` to `<DelayPenaltyLog />`
  - New `DelayPenaltyLog` component (SLA Breach Report — red header, GPS event timeline, MSA clause 7.3(b), penalty calc table, rotated "SLA BREACH ✓" stamp)

- **data.js** — drop into `vendorpay/data.js`
  - Fixed a syntax error (duplicate `reviewed: false` on the dynamic penalty entry)
  - Penalty line items already carried `chargeType: 'penalty'`; this is the cleaned version
