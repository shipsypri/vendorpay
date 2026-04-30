// Charge detail modal — three variants based on chargeType: distance / unloading / detention
function ChargeModal({ open, onClose, charge, trip }) {
  const [tab, setTab] = React.useState('docs');
  const [subTab, setSubTab] = React.useState('attach');
  if (!open || !charge) return null;

  const ct = charge.chargeType || 'detention';
  const isTelemetry = ct === 'detention';
  const tripId = (trip && trip.id) || charge.entity;

  React.useEffect(() => {
    setSubTab(isTelemetry ? 'map' : 'attach');
  }, [ct, isTelemetry]);

  const cfg = ct === 'distance' ? DISTANCE : ct === 'unloading' ? UNLOADING : DETENTION;
  const titleMap = { distance: 'Distance Based Cost', unloading: 'Unloading Charge', detention: 'Detention Charge' };
  const verifiedMap = {
    distance: 'Verified by Proof of Delivery (POD)',
    unloading: 'Verified by signed POD attachment',
    detention: 'Verified by intime/outtime from GPS',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span className="x-btn" onClick={onClose}>{Icon.x(16)}</span>
          <h2>{titleMap[ct]}</h2>
          <div className="verified">{Icon.check(13)} {verifiedMap[ct]}</div>
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
                {subTab === 'map' ? <MapMock /> : <PodAttachment chargeType={ct} trip={tripId} />}
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
                      <tr><td>Base Rate</td><td style={{fontWeight:600}}>${cfg.baseRate.toFixed(2)}</td><td className="right"><span className="src-pill">from Rate Masters</span></td></tr>
                      <tr><td>Distance</td><td style={{fontWeight:600}}>{cfg.distance} km</td><td className="right"><span className="src-pill">from Distance Master</span></td></tr>
                      <tr><td>In Time</td><td style={{fontWeight:600}}>{cfg.inTime}</td><td className="right"><span className="src-pill">from POD {Icon.pin(10)}</span></td></tr>
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

// Australian Coates Hire delivery docket — clean printed style
function PodAttachment({ chargeType, trip }) {
  const isUnload = chargeType === 'unloading';
  const isDist = chargeType === 'distance';
  return (
    <div style={{width:'100%', height:'100%', overflow:'auto', background:'#E8EBF0', display:'flex', justifyContent:'center', padding:16, boxSizing:'border-box'}}>
      <div style={{width:'100%', maxWidth:360, background:'#fff', boxShadow:'0 2px 12px rgba(0,0,0,0.12)', padding:'18px 22px', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif', color:'#1F2533'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid #1F2533', paddingBottom:8, marginBottom:12}}>
          <div>
            <div style={{fontSize:13, fontWeight:800, letterSpacing:0.5, color:'#E5484D'}}>COATES HIRE</div>
            <div style={{fontSize:7, color:'#6B7388', marginTop:1}}>Operations Pty Ltd · ABN 99 064 263 567</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9, fontWeight:700}}>DELIVERY DOCKET</div>
            <div style={{fontSize:7, color:'#6B7388'}}>POD #AU-{String(trip).replace('DD25','').slice(0,8)}</div>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, fontSize:7, marginBottom:10}}>
          <div><div style={{fontWeight:700, fontSize:7.5}}>From</div><div>Coates Hire — Lambton Depot</div><div style={{color:'#6B7388'}}>14 Anderson Dr, Lambton NSW 2299</div></div>
          <div><div style={{fontWeight:700, fontSize:7.5}}>To</div><div>{isUnload ? 'Kooragang Coal Terminal' : isDist ? 'Kooragang Industrial Estate' : 'Carrington Coal Terminal'}</div><div style={{color:'#6B7388'}}>{isUnload ? 'Cormorant Rd, Kooragang NSW 2304' : isDist ? 'Greenleaf Rd, Kooragang NSW 2304' : 'Bourke St, Carrington NSW 2294'}</div></div>
          <div><div style={{fontWeight:700, fontSize:7.5}}>Trip Number</div><div>{trip}</div></div>
          <div><div style={{fontWeight:700, fontSize:7.5}}>Carrier</div><div>Dickies Transport Pty Ltd</div></div>
          <div><div style={{fontWeight:700, fontSize:7.5}}>Distance</div><div>{isDist ? '500 km' : '— km'}</div></div>
          <div><div style={{fontWeight:700, fontSize:7.5}}>Driver</div><div>S. Mitchell</div></div>
        </div>
        <div style={{fontSize:7.5, fontWeight:700, marginTop:6, marginBottom:4}}>Goods Delivered</div>
        <table style={{width:'100%', fontSize:7, borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#F5F6F8', borderBottom:'1px solid #C7CDDB'}}><th style={{textAlign:'left', padding:'3px 4px'}}>Item</th><th style={{textAlign:'right', padding:'3px 4px', width:30}}>Qty</th><th style={{padding:'3px 4px', width:60}}>Asset #</th></tr></thead>
          <tbody>
            <tr style={{borderBottom:'1px solid #EEF0F4'}}><td style={{padding:'3px 4px'}}>Scissor Lift 33ft Diesel</td><td style={{textAlign:'right', padding:'3px 4px'}}>1</td><td style={{padding:'3px 4px', color:'#6B7388'}}>AU-SL-3421</td></tr>
            {isUnload && <tr style={{borderBottom:'1px solid #EEF0F4'}}><td style={{padding:'3px 4px'}}>Telehandler 3t (9m) Stage 5</td><td style={{textAlign:'right', padding:'3px 4px'}}>1</td><td style={{padding:'3px 4px', color:'#6B7388'}}>AU-TH-7790</td></tr>}
          </tbody>
        </table>
        {isUnload && <div style={{marginTop:10, padding:'7px 8px', background:'#FFF8EB', border:'1px solid #F5C97B', borderRadius:4, fontSize:7}}><div style={{fontWeight:700, color:'#8A5A00', marginBottom:2}}>⚠ Manual Unloading Required</div><div style={{color:'#5A3A0A'}}>Site forklift unavailable. Driver manually unloaded <b>6 pallets</b>.</div></div>}
        {isDist && <div style={{marginTop:10, padding:'7px 8px', background:'#F0F8F0', border:'1px solid #6FD5A6', borderRadius:4, fontSize:7}}><div style={{fontWeight:700, color:'#1B7F4A', marginBottom:2}}>✓ Distance Confirmed via Odometer</div><div style={{color:'#0B3D2A'}}>Start: 124,820 km · End: 125,320 km · Total: <b>500 km</b></div></div>}
        <div style={{marginTop:12, paddingTop:8, borderTop:'1px dashed #C7CDDB'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:7}}>
            <div><div style={{fontWeight:700, fontSize:7.5}}>Received by</div><div>M. Patterson</div><div style={{color:'#6B7388'}}>Site Supervisor</div></div>
            <div><div style={{fontWeight:700, fontSize:7.5}}>Time</div><div>16 Feb 2026, 11:42am</div></div>
          </div>
          <div style={{marginTop:8, height:32, borderBottom:'1px solid #1F2533', display:'flex', alignItems:'flex-end', paddingBottom:2}}>
            <svg width="80" height="20" viewBox="0 0 80 20"><path d="M 4 14 Q 12 4, 18 12 T 34 10 Q 42 18, 50 8 T 68 12" stroke="#1F2533" strokeWidth="1.4" fill="none"/></svg>
          </div>
          <div style={{fontSize:6, color:'#6B7388', marginTop:1}}>Signature</div>
        </div>
        <div style={{marginTop:10, display:'flex', justifyContent:'flex-end'}}>
          <div style={{transform:'rotate(-6deg)', border:'2px solid #2EA458', color:'#2EA458', padding:'3px 8px', fontSize:8, fontWeight:800, letterSpacing:1, borderRadius:2}}>DELIVERED</div>
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
