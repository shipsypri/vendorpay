// Charge detail modal — three variants based on chargeType: distance / unloading / detention
function ChargeModal({ open, onClose, charge, trip }) {
  const [tab, setTab] = React.useState('docs');
  const [subTab, setSubTab] = React.useState('attach');
  if (!open || !charge) return null;

  const ct = charge.chargeType || 'detention';
  const isTelemetry = ct === 'detention' || ct === 'penalty';
  const tripId = (trip && trip.id) || charge.entity;

  React.useEffect(() => {
    setSubTab(isTelemetry ? 'map' : 'attach');
  }, [ct, isTelemetry]);

  // Build a per-charge cfg from the actual clicked charge so amount/distance/etc. reflect THIS trip
  const baseCfg = ct === 'distance' ? DISTANCE : ct === 'unloading' ? UNLOADING : ct === 'toll' ? TOLL : ct === 'penalty' ? DETENTION : DETENTION;
  const chargeAmount = Math.abs(charge.amount || baseCfg.amount);
  const cfg = (() => {
    if (ct === 'distance') {
      const rate = baseCfg.baseRate || 10;
      const distance = +(chargeAmount / rate).toFixed(1);
      return {
        ...baseCfg,
        amount: chargeAmount,
        distance,
        remark: charge.remark || baseCfg.remark,
        calc: 'Distance Based Cost = ' + distance + ' km \u00d7 $' + rate.toFixed(2) + '/km',
      };
    }
    if (ct === 'unloading') {
      const rate = baseCfg.rate || 32;
      const pallets = Math.max(1, Math.round(chargeAmount / rate));
      return {
        ...baseCfg,
        amount: chargeAmount,
        pallets,
        remark: charge.remark || baseCfg.remark,
        calc: 'Unloading Charge = ' + pallets + ' pallets \u00d7 $' + rate.toFixed(2) + '/pallet',
      };
    }
    if (ct === 'detention') {
      // Derive in/out times + hours from the charge's own remark/aiPill if present
      // If AI is rejecting because stay was short, show the actual stay time instead of the static 12 hr
      const pill = (charge.aiPill || '').toLowerCase();
      let stayMins = null;
      const m = pill.match(/(\d+)\s*min/);
      if (m) stayMins = parseInt(m[1], 10);
      const hrMatch = pill.match(/(\d+)\s*hr/);
      if (hrMatch && !stayMins) stayMins = parseInt(hrMatch[1], 10) * 60;

      if (stayMins !== null) {
        const inT = '16 Feb 2026 1:33pm';
        const outDate = new Date('2026-02-16T13:33:00');
        outDate.setMinutes(outDate.getMinutes() + stayMins);
        const hh = outDate.getHours();
        const mm = String(outDate.getMinutes()).padStart(2,'0');
        const ampm = hh >= 12 ? 'pm' : 'am';
        const h12 = ((hh + 11) % 12) + 1;
        const outT = '16 Feb 2026 ' + h12 + ':' + mm + ampm;
        const hrs = (stayMins / 60).toFixed(2);
        const rate = baseCfg.rate || 8.32;
        const isShort = stayMins < 60;
        return {
          ...baseCfg,
          amount: chargeAmount,
          remark: charge.remark || baseCfg.remark,
          inTime: inT,
          outTime: outT,
          hours: hrs,
          rate,
          formula: 'Detention Charge applies only when stay > 60 minutes',
          calc: isShort
            ? 'Stay = ' + stayMins + ' min (< 60 min threshold) \u2014 detention does not apply'
            : 'Detention Charge = $' + rate.toFixed(2) + '/hour \u00d7 ' + hrs + ' hours',
        };
      }
      return {
        ...baseCfg,
        amount: chargeAmount,
        remark: charge.remark || baseCfg.remark,
      };
    }
    if (ct === 'toll') {
      return { ...baseCfg, amount: chargeAmount, remark: charge.remark || baseCfg.remark };
    }
    if (ct === 'penalty') {
      // Pull "X min" or "X hr/hrs" out of the AI pill to compute the delay
      const pill = (charge.aiPill || '').toLowerCase();
      let lateMins = 90;
      const minMatch = pill.match(/(\d+)\s*min/);
      const hrMatch = pill.match(/(\d+(?:\.\d+)?)\s*hr/);
      if (minMatch) lateMins = parseInt(minMatch[1], 10);
      else if (hrMatch) lateMins = Math.round(parseFloat(hrMatch[1]) * 60);
      const lateHrs = (lateMins / 60).toFixed(2);
      const ratePerHr = 50;
      return {
        ...baseCfg,
        amount: chargeAmount,
        remark: charge.remark || 'SLA breach',
        committedEta: '16 Feb 2026 12:00pm',
        actualArrival: '16 Feb 2026 ' + (lateMins >= 90 ? '1:30pm' : '12:' + String(lateMins).padStart(2,'0') + 'pm'),
        lateMins,
        lateHrs,
        ratePerHr,
        formula: 'Delay Penalty = SLA penalty rate \u00d7 hours late (capped per agreement)',
        calc: 'Delay Penalty = $' + ratePerHr.toFixed(2) + '/hr \u00d7 ' + lateHrs + ' hrs late',
      };
    }
    return { ...baseCfg, amount: chargeAmount };
  })();
  const titleMap = { distance: 'Distance Based Cost', unloading: 'Unloading Charge', detention: 'Detention Charge', toll: 'Toll Charge', penalty: 'Delay Penalty' };
  const verifiedMap = {
    distance: 'Verified by Proof of Delivery (POD)',
    unloading: 'Verified by signed POD attachment',
    detention: 'Verified by intime/outtime from GPS',
    toll: 'Verified by Linkt e-tag trip statement',
    penalty: 'Applied for SLA breach (verified by GPS arrival time)',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span className="x-btn" onClick={onClose}>{Icon.x(16)}</span>
          <h2>{titleMap[ct]}</h2>
          {charge.aiBucket === 'reject'
            ? <div className="verified" style={{background:'#FFE5E5', color:'#C53030', borderColor:'#F5B5B7'}}>{Icon.x(13)} AI suggests reject — {charge.aiPill || verifiedMap[ct]}</div>
            : charge.aiBucket === 'review'
            ? <div className="verified" style={{background:'#FFF3D9', color:'#8A5A00', borderColor:'#F5C97B'}}>! Needs review — {charge.aiPill || verifiedMap[ct]}</div>
            : <div className="verified">{Icon.check(13)} {verifiedMap[ct]}</div>}
        </div>
        <div className="modal-tabs">
          <div className={'modal-tab ' + (tab==='docs'?'active':'')} onClick={()=>setTab('docs')}>Documents</div>
          <div className={'modal-tab ' + (tab==='events'?'active':'')} onClick={()=>setTab('events')}>Events</div>
        </div>
        <div className="modal-body">
          <div className="modal-cols">
            <div className="modal-left">
              <div className="sub-tabs">
                {isTelemetry && <div className={'sub-tab ' + (subTab==='map'?'active':'')} onClick={()=>setSubTab('map')}>Map</div>}
                <div className={'sub-tab ' + (subTab==='attach'?'active':'')} onClick={()=>setSubTab('attach')}>Charge Attachment</div>
              </div>
              <div className="map-frame">
                {subTab === 'map' ? <MapMock /> : <PodAttachment chargeType={ct} trip={tripId} carrier={trip && trip.vendor} />}
              </div>
            </div>
            <div className="modal-right">
              <div className="mr-head-grid">
                <div className="mr-cell">
                  <div className="lbl">Trip</div>
                  <div className="val" style={{color:'#4F65FF'}}>{tripId}</div>
                </div>
                <div className="mr-cell">
                  <div className="lbl">Remark</div>
                  <div className="val">{cfg.remark}</div>
                </div>
                <div className="mr-cell right">
                  <div className="lbl">Amount</div>
                  <div className="val amount">{AUD(cfg.amount)}</div>
                </div>
              </div>
              <div className="section-title">
                <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.chevDown(12)} Relevant Data</span>
              </div>
              <table className="field-table">
                <thead>
                  <tr><th>Field</th><th>Value</th><th className="right">Source</th></tr>
                </thead>
                <tbody>
                  {ct === 'distance' && (
                    <>
                      <tr><td>Rate per km</td><td style={{fontWeight:600}}>${cfg.baseRate.toFixed(2)}</td><td className="right"><span className="src-pill">from Rate Masters</span></td></tr>
                      <tr><td>Distance</td><td style={{fontWeight:600}}>{cfg.distance} km</td><td className="right"><span className="src-pill">from Distance Master</span></td></tr>
                      <tr><td>Pickup Odometer</td><td style={{fontWeight:600}}>124,820 km</td><td className="right"><span className="src-pill">from POD {Icon.pin(10)}</span></td></tr>
                      <tr><td>Delivery Odometer</td><td style={{fontWeight:600}}>125,290 km</td><td className="right"><span className="src-pill">from POD {Icon.pin(10)}</span></td></tr>
                    </>
                  )}
                  {ct === 'unloading' && (
                    <>
                      <tr><td>Unloading Rate</td><td style={{fontWeight:600}}>${cfg.rate.toFixed(2)}/pallet</td><td className="right"><span className="src-pill">from Rate Masters</span></td></tr>
                      <tr><td>Pallets Unloaded</td><td style={{fontWeight:600}}>{cfg.pallets}</td><td className="right"><span className="src-pill">from POD {Icon.pin(10)}</span></td></tr>
                      <tr><td>Site</td><td style={{fontWeight:600, fontSize:11.5}}>{cfg.arrivedAt}</td><td className="right"><span className="src-pill">from POD {Icon.pin(10)}</span></td></tr>
                      <tr><td>Signed By</td><td style={{fontWeight:600, fontSize:11.5}}>{cfg.signedBy}</td><td className="right"><span className="src-pill">from POD {Icon.pin(10)}</span></td></tr>
                    </>
                  )}
                  {ct === 'detention' && (
                    <>
                      <tr><td>Detention Rate</td><td style={{fontWeight:600}}>${cfg.rate.toFixed(2)}/hour</td><td className="right"><span className="src-pill">from Rate Masters</span></td></tr>
                      <tr><td>In Time</td><td style={{fontWeight:600}}>{cfg.inTime}</td><td className="right"><span className="src-pill">from GPS {Icon.pin(10)}</span></td></tr>
                      <tr><td>Out Time</td><td style={{fontWeight:600}}>{cfg.outTime}</td><td className="right"><span className="src-pill">from GPS {Icon.pin(10)}</span></td></tr>
                    </>
                  )}
                  {ct === 'toll' && (
                    <>
                      <tr><td>e-Tag Number</td><td style={{fontWeight:600}}>{cfg.tagNumber}</td><td className="right"><span className="src-pill">from Linkt {Icon.pin(10)}</span></td></tr>
                      <tr><td>Vehicle Class</td><td style={{fontWeight:600}}>{cfg.vehicleClass}</td><td className="right"><span className="src-pill">from Rate Masters</span></td></tr>
                      <tr><td>Account</td><td style={{fontWeight:600, fontSize:11.5}}>{cfg.account}</td><td className="right"><span className="src-pill">from Linkt {Icon.pin(10)}</span></td></tr>
                      <tr><td>Toll Crossings</td><td style={{fontWeight:600}}>{cfg.trips}</td><td className="right"><span className="src-pill">GPS-matched</span></td></tr>
                    </>
                  )}
                  {ct === 'penalty' && (
                    <>
                      <tr><td>Committed ETA</td><td style={{fontWeight:600}}>{cfg.committedEta}</td><td className="right"><span className="src-pill">from SLA agreement</span></td></tr>
                      <tr><td>Actual Arrival</td><td style={{fontWeight:600}}>{cfg.actualArrival}</td><td className="right"><span className="src-pill">from GPS {Icon.pin(10)}</span></td></tr>
                      <tr><td>Delay</td><td style={{fontWeight:600}}>{cfg.lateHrs} hrs ({cfg.lateMins} min)</td><td className="right"><span className="src-pill">computed</span></td></tr>
                      <tr><td>Penalty Rate</td><td style={{fontWeight:600}}>${cfg.ratePerHr.toFixed(2)}/hr</td><td className="right"><span className="src-pill">from Rate Masters</span></td></tr>
                    </>
                  )}
                </tbody>
              </table>
              <div className="section-title" style={{marginTop:18}}>
                <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.chevDown(12)} Calculations {Icon.sparkle(11)}</span>
              </div>
              <div className="calc-card"><div className="lbl">Formula</div><div className="val">{cfg.formula}</div></div>
              <div className="calc-card"><div className="lbl">Calculation</div><div className="val">{cfg.calc}</div></div>
              <div className="calc-card"><div className="lbl">Amount</div><div className="val amount">{AUD(cfg.amount)}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delivery docket — header carrier name comes from the line item's vendor.
function PodAttachment({ chargeType, trip, carrier }) {
  if (chargeType === 'toll') return <LinktTollStatement trip={trip} />;
  if (chargeType === 'penalty') return <DelayPenaltyLog trip={trip} carrier={carrier} />;
  const variant = chargeType === 'unloading' ? 'unloading' : chargeType === 'detention' ? 'detention' : 'distance';
  return <PodDocket variant={variant} trip={trip} carrier={carrier} />;
}

// Linkt Trip Statement (Australian e-tag toll receipt) — for toll charge POD
function LinktTollStatement({ trip }) {
  const tolls = [
    { date: '15 Feb 2026', time: '06:42am', point: 'Hexham Bridge (M1 Pacific Mwy)', direction: 'Northbound', amount: 14.83 },
    { date: '15 Feb 2026', time: '06:51am', point: 'Beresfield (M1 Pacific Mwy)', direction: 'Northbound', amount: 12.40 },
    { date: '15 Feb 2026', time: '07:08am', point: 'Buchanan (Hunter Expressway)', direction: 'Westbound', amount: 18.65 },
    { date: '15 Feb 2026', time: '07:22am', point: 'Kurri Kurri (Hunter Expressway)', direction: 'Westbound', amount: 9.20 },
    { date: '16 Feb 2026', time: '03:11pm', point: 'Kurri Kurri (Hunter Expressway)', direction: 'Eastbound', amount: 9.20 },
    { date: '16 Feb 2026', time: '03:28pm', point: 'Beresfield (M1 Pacific Mwy)', direction: 'Southbound', amount: 12.40 },
    { date: '16 Feb 2026', time: '03:36pm', point: 'Hexham Bridge (M1 Pacific Mwy)', direction: 'Southbound', amount: 14.83 },
  ];
  const subtotal = tolls.reduce((s, t) => s + t.amount, 0);
  const hvSurcharge = 208.49; // Heavy vehicle multiplier brings it to $300 total
  const total = subtotal + hvSurcharge;
  return (
    <div style={{width:'100%', height:'100%', overflow:'auto', background:'#E8EBF0', display:'flex', justifyContent:'center', alignItems:'flex-start', padding:18, boxSizing:'border-box'}}>
      <div style={{width:'100%', maxWidth:400, background:'#fff', boxShadow:'0 2px 14px rgba(0,0,0,0.18)', padding:'18px 20px', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif', color:'#1F2533'}}>
        {/* Linkt header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid #003E7E', paddingBottom:10, marginBottom:12}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:6}}>
              <div style={{width:22, height:22, background:'#003E7E', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, borderRadius:3}}>L</div>
              <div style={{fontSize:15, fontWeight:800, color:'#003E7E', letterSpacing:0.3}}>Linkt</div>
            </div>
            <div style={{fontSize:7, color:'#6B7388', marginTop:3}}>Transurban Limited · ABN 96 098 143 410</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10, fontWeight:700}}>TRIP STATEMENT</div>
            <div style={{fontSize:7, color:'#6B7388', marginTop:2}}>Statement #LK-204881-26</div>
            <div style={{fontSize:7, color:'#6B7388'}}>Issued 17 Feb 2026</div>
          </div>
        </div>

        {/* Account info */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:7.5, marginBottom:12}}>
          <div>
            <div style={{fontWeight:700, fontSize:8, marginBottom:2, color:'#1F2533', textTransform:'uppercase', letterSpacing:0.5}}>Account Holder</div>
            <div style={{fontWeight:500}}>Dickies Transport Pty Ltd</div>
            <div style={{color:'#6B7388'}}>Fleet · Linkt Business</div>
            <div style={{color:'#6B7388', marginTop:1}}>A/C 88-0411-2967</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, marginBottom:2, color:'#1F2533', textTransform:'uppercase', letterSpacing:0.5}}>Vehicle</div>
            <div style={{fontWeight:500}}>Kenworth K200</div>
            <div style={{color:'#6B7388'}}>Rego: NSW DT-1142K</div>
            <div style={{color:'#6B7388', marginTop:1}}>Class HV4 · 4+ axles</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, fontSize:7.5, marginBottom:12, paddingTop:8, borderTop:'1px dashed #DDE1EA'}}>
          <div>
            <div style={{fontWeight:700, fontSize:8}}>Trip Reference</div>
            <div style={{marginTop:2, color:'#003E7E'}}>{trip}</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8}}>e-Tag Number</div>
            <div style={{marginTop:2, fontVariantNumeric:'tabular-nums'}}>4118-0099-2814</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8}}>Period</div>
            <div style={{marginTop:2}}>15–16 Feb 2026</div>
          </div>
        </div>

        {/* Toll detail table */}
        <div style={{fontSize:8, fontWeight:700, marginBottom:4, color:'#1F2533'}}>Toll Point Crossings</div>
        <table style={{width:'100%', fontSize:7, borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#003E7E', color:'#fff'}}>
              <th style={{textAlign:'left', padding:'4px 5px'}}>Date / Time</th>
              <th style={{textAlign:'left', padding:'4px 5px'}}>Toll Point</th>
              <th style={{textAlign:'left', padding:'4px 5px', width:55}}>Dir.</th>
              <th style={{textAlign:'right', padding:'4px 5px', width:48}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tolls.map((t, i) => (
              <tr key={i} style={{borderBottom:'1px solid #EEF0F4'}}>
                <td style={{padding:'4px 5px', whiteSpace:'nowrap'}}>{t.date.slice(0,6)}<br/><span style={{color:'#6B7388'}}>{t.time}</span></td>
                <td style={{padding:'4px 5px'}}>{t.point}</td>
                <td style={{padding:'4px 5px', color:'#6B7388'}}>{t.direction}</td>
                <td style={{textAlign:'right', padding:'4px 5px', fontVariantNumeric:'tabular-nums', fontWeight:500}}>${t.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{textAlign:'right', padding:'5px', fontSize:7, color:'#6B7388'}}>Subtotal (7 crossings)</td>
              <td style={{textAlign:'right', padding:'5px', fontVariantNumeric:'tabular-nums'}}>${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} style={{textAlign:'right', padding:'5px', fontSize:7, color:'#6B7388'}}>Heavy Vehicle multiplier (HV4)</td>
              <td style={{textAlign:'right', padding:'5px', fontVariantNumeric:'tabular-nums'}}>${hvSurcharge.toFixed(2)}</td>
            </tr>
            <tr style={{background:'#F2F5FA', borderTop:'2px solid #003E7E'}}>
              <td colSpan={3} style={{textAlign:'right', padding:'6px 5px', fontWeight:700, fontSize:8}}>TOTAL (incl. GST)</td>
              <td style={{textAlign:'right', padding:'6px 5px', fontVariantNumeric:'tabular-nums', fontWeight:800, fontSize:9}}>${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Bottom note */}
        <div style={{marginTop:12, padding:'8px 10px', background:'#EEF1FF', border:'1px solid #C9D2FF', borderRadius:4, fontSize:7}}>
          <div style={{fontWeight:700, color:'#003E7E', marginBottom:2}}>e-Tag Verified</div>
          <div style={{color:'#3A4790'}}>All 7 crossings detected by tag <b>4118-0099-2814</b> on vehicle <b>NSW DT-1142K</b>. Route matched to trip GPS log within ±60 sec.</div>
        </div>

        <div style={{marginTop:10, paddingTop:8, borderTop:'1px dashed #C7CDDB', fontSize:6.5, color:'#8A92A6', display:'flex', justifyContent:'space-between'}}>
          <div>linkt.com.au · 13 33 31</div>
          <div>Page 1 of 1</div>
        </div>

        {/* Linkt verified stamp */}
        <div style={{marginTop:10, display:'flex', justifyContent:'flex-end'}}>
          <div style={{
            transform:'rotate(-6deg)',
            border:'2.5px solid #003E7E', color:'#003E7E',
            padding:'4px 11px', fontSize:9, fontWeight:800, letterSpacing:1.5, borderRadius:3,
            fontFamily:'Georgia, serif'
          }}>
            e-TAG VERIFIED ✓
          </div>
        </div>
      </div>
    </div>
  );
}

// SLA Breach / Delay Penalty evidence — a system-generated late-arrival report
function DelayPenaltyLog({ trip, carrier }) {
  const carrierName = (carrier || 'Carrier').toUpperCase();
  const events = [
    { t: '06:42am', label: 'Trip dispatched · Carrington Wharf', status: 'on-time' },
    { t: '08:15am', label: 'Loading complete · departed origin', status: 'on-time' },
    { t: '11:48am', label: 'Geofence enter · 5km from delivery', status: 'on-time' },
    { t: '12:00pm', label: 'COMMITTED ETA (per SLA)', status: 'sla' },
    { t: '12:38pm', label: 'GPS ping · stationary at Beresfield (off-route)', status: 'late' },
    { t: '01:12pm', label: 'Re-routed · resumed travel', status: 'late' },
    { t: '01:30pm', label: 'Geofence enter · destination · ARRIVED', status: 'arrived' },
  ];
  return (
    <div style={{width:'100%', height:'100%', overflow:'auto', background:'#E8EBF0', display:'flex', justifyContent:'center', alignItems:'flex-start', padding:18, boxSizing:'border-box'}}>
      <div style={{width:'100%', maxWidth:400, background:'#fff', boxShadow:'0 2px 14px rgba(0,0,0,0.18)', padding:'18px 20px', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif', color:'#1F2533'}}>
        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid #B7281D', paddingBottom:10, marginBottom:12}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:6}}>
              <div style={{width:22, height:22, background:'#B7281D', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, borderRadius:3}}>!</div>
              <div style={{fontSize:13, fontWeight:800, color:'#B7281D', letterSpacing:0.3}}>SLA BREACH REPORT</div>
            </div>
            <div style={{fontSize:7, color:'#6B7388', marginTop:3}}>Auto-generated · Shipsy TMS · GPS-verified</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9, fontWeight:700}}>Late Delivery</div>
            <div style={{fontSize:7, color:'#6B7388', marginTop:2}}>Report #SB-{(trip||'').replace(/[^0-9]/g,'').slice(-5) || '20488'}</div>
            <div style={{fontSize:7, color:'#6B7388'}}>Generated 16 Feb 2026 1:31pm</div>
          </div>
        </div>

        {/* Trip + Carrier info */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:7.5, marginBottom:12}}>
          <div>
            <div style={{fontWeight:700, fontSize:8, marginBottom:2, textTransform:'uppercase', letterSpacing:0.5}}>Trip</div>
            <div style={{fontWeight:600, color:'#003E7E'}}>{trip}</div>
            <div style={{color:'#6B7388'}}>Carrington → Maitland DC</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, marginBottom:2, textTransform:'uppercase', letterSpacing:0.5}}>Carrier</div>
            <div style={{fontWeight:600}}>{carrierName}</div>
            <div style={{color:'#6B7388'}}>SLA: 4-hr window · ETA-strict</div>
          </div>
        </div>

        {/* Breach summary */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:14, padding:'8px 10px', background:'#FFF3F2', border:'1px solid #F5C5BF', borderRadius:4}}>
          <div>
            <div style={{fontSize:6.5, color:'#8A2818', textTransform:'uppercase', letterSpacing:0.5, fontWeight:700}}>Committed ETA</div>
            <div style={{fontSize:10, fontWeight:700, marginTop:2}}>12:00 pm</div>
          </div>
          <div>
            <div style={{fontSize:6.5, color:'#8A2818', textTransform:'uppercase', letterSpacing:0.5, fontWeight:700}}>Actual Arrival</div>
            <div style={{fontSize:10, fontWeight:700, marginTop:2, color:'#B7281D'}}>1:30 pm</div>
          </div>
          <div>
            <div style={{fontSize:6.5, color:'#8A2818', textTransform:'uppercase', letterSpacing:0.5, fontWeight:700}}>Delay</div>
            <div style={{fontSize:10, fontWeight:800, marginTop:2, color:'#B7281D'}}>+1h 30m</div>
          </div>
        </div>

        {/* Event timeline */}
        <div style={{fontSize:8, fontWeight:700, marginBottom:6, color:'#1F2533'}}>GPS Event Log</div>
        <div style={{position:'relative', paddingLeft:16, marginBottom:14}}>
          <div style={{position:'absolute', left:5, top:6, bottom:6, width:1.5, background:'#DDE1EA'}}></div>
          {events.map((e, i) => {
            const dot = e.status === 'sla' ? '#003E7E' : e.status === 'late' ? '#B7281D' : e.status === 'arrived' ? '#B7281D' : '#34A853';
            const fontW = e.status === 'sla' || e.status === 'arrived' ? 700 : 500;
            return (
              <div key={i} style={{display:'flex', gap:8, marginBottom:6, fontSize:7.5, position:'relative'}}>
                <div style={{position:'absolute', left:-16, top:3, width:9, height:9, borderRadius:'50%', background:dot, border:'2px solid #fff', boxShadow:'0 0 0 1px '+dot}}></div>
                <div style={{width:46, color:'#6B7388', fontVariantNumeric:'tabular-nums', flexShrink:0}}>{e.t}</div>
                <div style={{fontWeight:fontW, color: e.status==='sla' ? '#003E7E' : e.status==='late'||e.status==='arrived' ? '#B7281D' : '#1F2533'}}>{e.label}</div>
              </div>
            );
          })}
        </div>

        {/* SLA clause */}
        <div style={{padding:'8px 10px', background:'#F4F6FA', border:'1px solid #DDE1EA', borderRadius:4, marginBottom:10}}>
          <div style={{fontSize:7, fontWeight:700, color:'#1F2533', marginBottom:2, textTransform:'uppercase', letterSpacing:0.5}}>Master Service Agreement · Clause 7.3(b)</div>
          <div style={{fontSize:7, color:'#3A4255', lineHeight:1.45}}>"Where Carrier exceeds the Committed ETA by more than thirty (30) minutes without prior notice, a Delay Penalty of <b>$50.00 per hour</b> (or part thereof) shall apply, calculated to the nearest 0.25 hour."</div>
        </div>

        {/* Penalty calc */}
        <table style={{width:'100%', fontSize:7.5, borderCollapse:'collapse'}}>
          <tbody>
            <tr style={{borderBottom:'1px solid #EEF0F4'}}>
              <td style={{padding:'5px 4px'}}>Hours late (rounded ↑ to 0.25)</td>
              <td style={{textAlign:'right', padding:'5px 4px', fontVariantNumeric:'tabular-nums'}}>1.50 hrs</td>
            </tr>
            <tr style={{borderBottom:'1px solid #EEF0F4'}}>
              <td style={{padding:'5px 4px'}}>Penalty rate</td>
              <td style={{textAlign:'right', padding:'5px 4px', fontVariantNumeric:'tabular-nums'}}>$50.00 / hr</td>
            </tr>
            <tr style={{background:'#FFF3F2', borderTop:'2px solid #B7281D'}}>
              <td style={{padding:'6px 4px', fontWeight:700, fontSize:8}}>DELAY PENALTY</td>
              <td style={{textAlign:'right', padding:'6px 4px', fontVariantNumeric:'tabular-nums', fontWeight:800, fontSize:9, color:'#B7281D'}}>$75.00</td>
            </tr>
          </tbody>
        </table>

        <div style={{marginTop:10, paddingTop:8, borderTop:'1px dashed #C7CDDB', fontSize:6.5, color:'#8A92A6', display:'flex', justifyContent:'space-between'}}>
          <div>GPS source: Teltonika FMB920 · ping rate 30s</div>
          <div>Page 1 of 1</div>
        </div>

        {/* Verified stamp */}
        <div style={{marginTop:10, display:'flex', justifyContent:'flex-end'}}>
          <div style={{
            transform:'rotate(-6deg)',
            border:'2.5px solid #B7281D', color:'#B7281D',
            padding:'4px 11px', fontSize:9, fontWeight:800, letterSpacing:1.5, borderRadius:3,
            fontFamily:'Georgia, serif'
          }}>
            SLA BREACH ✓
          </div>
        </div>
      </div>
    </div>
  );
}

// Newcastle/Carrington area Australian map mock
function MapMock() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 480 420" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D8D2C0" strokeWidth="0.5"/></pattern></defs>
      <rect width="100%" height="100%" fill="#EFE9DD"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      {/* water */}
      <path d="M 0 80 Q 100 70 200 90 L 200 140 Q 100 130 0 150 Z" fill="#B8D8E8" opacity="0.6"/>
      <text x="40" y="120" fontSize="8" fill="#5A8AA8" fontFamily="sans-serif">Hunter River</text>
      {/* roads */}
      <path d="M 60 0 L 80 100 L 120 200 L 200 280 L 240 360 L 260 420" stroke="#fff" strokeWidth="14" fill="none"/>
      <path d="M 0 240 L 100 220 L 200 250 L 320 230 L 480 260" stroke="#fff" strokeWidth="10" fill="none"/>
      <path d="M 360 0 L 340 80 L 360 200 L 340 320 L 360 420" stroke="#fff" strokeWidth="10" fill="none"/>
      <text x="40" y="40" fontSize="9" fill="#8A8270" fontWeight="600" fontFamily="sans-serif">NEWCASTLE</text>
      <text x="60" y="270" fontSize="9" fill="#8A8270" fontFamily="sans-serif">Carrington Wharf</text>
      <text x="320" y="190" fontSize="9" fill="#8A8270" fontFamily="sans-serif">Bullock Island</text>
      <text x="380" y="380" fontSize="8" fill="#8A8270" fontFamily="sans-serif">NSW 2294</text>
      <circle cx="240" cy="210" r="130" fill="#4F65FF" fillOpacity="0.12" stroke="#4F65FF" strokeOpacity="0.3" strokeWidth="1"/>
      <path d="M 100 380 Q 140 320 200 280 Q 260 240 240 200 Q 220 160 200 100" stroke="#E5484D" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="240" cy="200" r="8" fill="#fff" stroke="#E5484D" strokeWidth="2.5"/>
      <text x="252" y="205" fontSize="11" fontWeight="600" fill="#1F2533" fontFamily="sans-serif">Coal Terminal</text>
      <text x="80" y="395" fontSize="10" fontWeight="700" fill="#C53030" fontFamily="sans-serif">Entry: 16 Feb 2026, 1:33pm</text>
      <text x="120" y="95" fontSize="10" fontWeight="700" fill="#C53030" fontFamily="sans-serif">Exit: 16 Feb 2026, 2:45pm</text>
    </svg>
  );
}
window.ChargeModal = ChargeModal;
