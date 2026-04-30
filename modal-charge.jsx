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

// Australian Coates Hire delivery docket — actual photographed POD image
function PodAttachment({ chargeType, trip }) {
  const isUnload = chargeType === 'unloading';
  const src = isUnload ? 'pod-unloading-final.png' : 'pod-distance-final.png';
  return (
    <div style={{width:'100%', height:'100%', overflow:'auto', background:'#2a2620', display:'flex', justifyContent:'center', alignItems:'flex-start', padding:24, boxSizing:'border-box'}}>
      <div style={{
        position:'relative',
        width:'100%', maxWidth:380,
        boxShadow:'0 18px 40px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35)',
        transform:'rotate(-0.8deg)',
        marginTop:8,
      }}>
        <img src={src} alt="Delivery Docket" style={{width:'100%', display:'block'}} />
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
