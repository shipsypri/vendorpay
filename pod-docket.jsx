// AU POD docket — clean typed delivery docket. Carrier comes from line item.
function PodDocket({ variant, trip, carrier }) {
  const isDistance = variant === 'distance';
  const isUnloading = variant === 'unloading';
  const isDetention = variant === 'detention';

  const fromPlace = 'Lambton, NSW 2299';
  const toPlace = isDistance ? 'Kooragang, NSW 2304' : isUnloading ? 'Kooragang Coal Terminal, NSW 2304' : 'Carrington Coal Terminal, NSW 2294';

  // Carrier name drives the docket header — falls back if not provided
  const carrierName = (carrier || 'Carrier').toString();
  const carrierUpper = carrierName.toUpperCase();
  // Clean ABN/legal subtitle so it doesn't read as a real branded company
  const carrierSubtitle = 'Transport Operations';

  return (
    <div style={{
      width:'100%', height:'100%', overflow:'auto',
      background:'#E8EBF0', display:'flex', justifyContent:'center', alignItems:'flex-start',
      padding:18, boxSizing:'border-box'
    }}>
      <div style={{
        width:'100%', maxWidth: 380, background:'#fff',
        boxShadow:'0 2px 14px rgba(0,0,0,0.18)',
        padding:'20px 22px', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif', color:'#1F2533',
        position:'relative'
      }}>
        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid #1F2533', paddingBottom:10, marginBottom:14}}>
          <div>
            <div style={{fontSize:14, fontWeight:800, letterSpacing:0.5, color:'#E5484D'}}>{carrierUpper}</div>
            <div style={{fontSize:7, color:'#6B7388', marginTop:2}}>{carrierSubtitle}</div>
            <div style={{fontSize:7, color:'#6B7388'}}>Pty Ltd</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10, fontWeight:700, color:'#1F2533'}}>DELIVERY DOCKET</div>
            <div style={{fontSize:7, color:'#6B7388', marginTop:2}}>POD #AU-{(trip||'').replace(/[^A-Z0-9]/gi,'').slice(0,10)}</div>
            <div style={{fontSize:7, color:'#6B7388'}}>Page 1 of 1</div>
          </div>
        </div>

        {/* From / To / Trip details */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:7.5, marginBottom:12}}>
          <div>
            <div style={{fontWeight:700, fontSize:8, marginBottom:2, color:'#1F2533', textTransform:'uppercase', letterSpacing:0.5}}>From</div>
            <div style={{fontWeight:500}}>Lambton Depot</div>
            <div style={{color:'#6B7388'}}>15 Howe St, Lambton NSW 2299</div>
            <div style={{color:'#6B7388', marginTop:1}}>{fromPlace}</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, marginBottom:2, color:'#1F2533', textTransform:'uppercase', letterSpacing:0.5}}>To</div>
            <div style={{fontWeight:500}}>{isDistance ? 'John Holland Pty Ltd' : isUnloading ? 'Kooragang Coal Terminal' : 'Carrington Coal Terminal'}</div>
            <div style={{color:'#6B7388'}}>{isDistance ? 'Cormorant Rd, Kooragang' : isUnloading ? 'Cormorant Rd, Kooragang' : 'Bourke St, Carrington'}</div>
            <div style={{color:'#6B7388', marginTop:1}}>{toPlace}</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, fontSize:7.5, marginBottom:12, paddingTop:8, borderTop:'1px dashed #DDE1EA'}}>
          <div>
            <div style={{fontWeight:700, fontSize:8, color:'#1F2533'}}>Trip Number</div>
            <div style={{marginTop:2}}>{trip}</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, color:'#1F2533'}}>Carrier</div>
            <div style={{marginTop:2}}>{carrierName}</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, color:'#1F2533'}}>Date</div>
            <div style={{marginTop:2}}>{isDetention ? '16 Feb 2026' : '15 Feb 2026'}</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, color:'#1F2533'}}>Driver</div>
            <div style={{marginTop:2}}>S. Mitchell</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, color:'#1F2533'}}>Rego</div>
            <div style={{marginTop:2}}>NSW · DT-1142K</div>
          </div>
          <div>
            <div style={{fontWeight:700, fontSize:8, color:'#1F2533'}}>Distance</div>
            <div style={{marginTop:2}}>{isDistance ? '500 km' : isUnloading ? '38 km' : '42 km'}</div>
          </div>
        </div>

        {/* Goods table */}
        <div style={{fontSize:8, fontWeight:700, marginBottom:4, color:'#1F2533'}}>Goods Delivered</div>
        <table style={{width:'100%', fontSize:7.5, borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#F5F6F8', borderBottom:'1px solid #C7CDDB'}}>
              <th style={{textAlign:'left', padding:'4px 6px'}}>Item</th>
              <th style={{textAlign:'right', padding:'4px 6px', width:30}}>Qty</th>
              <th style={{padding:'4px 6px', width:60}}>Asset #</th>
            </tr>
          </thead>
          <tbody>
            {isDistance && (
              <>
                <tr style={{borderBottom:'1px solid #EEF0F4'}}>
                  <td style={{padding:'4px 6px'}}>Telehandler 3t (9m) Stage 5</td>
                  <td style={{textAlign:'right', padding:'4px 6px'}}>1</td>
                  <td style={{padding:'4px 6px', color:'#6B7388'}}>AU-TH-7790</td>
                </tr>
                <tr style={{borderBottom:'1px solid #EEF0F4'}}>
                  <td style={{padding:'4px 6px'}}>Site Lighting Tower 9m (Diesel)</td>
                  <td style={{textAlign:'right', padding:'4px 6px'}}>2</td>
                  <td style={{padding:'4px 6px', color:'#6B7388'}}>AU-LT-1098</td>
                </tr>
              </>
            )}
            {isUnloading && (
              <>
                <tr style={{borderBottom:'1px solid #EEF0F4'}}>
                  <td style={{padding:'4px 6px'}}>Scissor Lift 19ft Electric</td>
                  <td style={{textAlign:'right', padding:'4px 6px'}}>2</td>
                  <td style={{padding:'4px 6px', color:'#6B7388'}}>AU-SL-3421</td>
                </tr>
                <tr style={{borderBottom:'1px solid #EEF0F4'}}>
                  <td style={{padding:'4px 6px'}}>Generator 20kVA (Diesel)</td>
                  <td style={{textAlign:'right', padding:'4px 6px'}}>2</td>
                  <td style={{padding:'4px 6px', color:'#6B7388'}}>AU-GN-2240</td>
                </tr>
                <tr style={{borderBottom:'1px solid #EEF0F4'}}>
                  <td style={{padding:'4px 6px'}}>Site Compressor 110cfm</td>
                  <td style={{textAlign:'right', padding:'4px 6px'}}>2</td>
                  <td style={{padding:'4px 6px', color:'#6B7388'}}>AU-CP-7702</td>
                </tr>
              </>
            )}
            {isDetention && (
              <>
                <tr style={{borderBottom:'1px solid #EEF0F4'}}>
                  <td style={{padding:'4px 6px'}}>Telehandler 3t (9m) Stage 5</td>
                  <td style={{textAlign:'right', padding:'4px 6px'}}>1</td>
                  <td style={{padding:'4px 6px', color:'#6B7388'}}>AU-TH-7790</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        {/* Charge call-outs */}
        {isUnloading && (
          <div style={{marginTop:10, padding:'8px 10px', background:'#FFF8EB', border:'1px solid #F5C97B', borderRadius:4, fontSize:7.5}}>
            <div style={{fontWeight:700, color:'#8A5A00', marginBottom:2}}>⚠ Manual Unloading Required</div>
            <div style={{color:'#5A3A0A'}}>Site forklift unavailable. Driver manually unloaded <b>6 pallets</b>. Site supervisor confirmed and signed.</div>
          </div>
        )}
        {isDistance && (
          <div style={{marginTop:10, padding:'8px 10px', background:'#EEF1FF', border:'1px solid #C9D2FF', borderRadius:4, fontSize:7.5}}>
            <div style={{fontWeight:700, color:'#2538C8', marginBottom:2}}>Route Distance Confirmed</div>
            <div style={{color:'#3A4790'}}>GPS-tracked distance: <b>500 km</b>. Departed Lambton 06:00am, arrived Kooragang 03:42pm.</div>
          </div>
        )}

        {/* Receiver block */}
        <div style={{marginTop:14, paddingTop:10, borderTop:'1px dashed #C7CDDB'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, fontSize:7.5}}>
            <div>
              <div style={{fontWeight:700, fontSize:8}}>Received by</div>
              <div style={{marginTop:2}}>{isUnloading ? 'M. Patterson' : isDistance ? 'D. Walsh' : 'D. Walsh'}</div>
              <div style={{color:'#6B7388'}}>Site Supervisor</div>
            </div>
            <div>
              <div style={{fontWeight:700, fontSize:8}}>Time</div>
              <div style={{marginTop:2}}>{isUnloading ? '16 Feb 2026, 11:42am' : isDistance ? '15 Feb 2026, 3:42pm' : '16 Feb 2026, 1:33pm'}</div>
            </div>
          </div>
          <div style={{marginTop:10, height:36, borderBottom:'1px solid #1F2533', display:'flex', alignItems:'flex-end', paddingBottom:2}}>
            <svg width="92" height="22" viewBox="0 0 92 22">
              <path d="M 4 16 Q 10 4, 18 12 Q 24 18, 32 8 T 50 12 Q 60 6, 68 14 T 88 10" stroke="#1F2533" strokeWidth="1.4" fill="none"/>
            </svg>
          </div>
          <div style={{fontSize:6.5, color:'#6B7388', marginTop:1}}>Signature</div>
        </div>

        {/* DELIVERED stamp */}
        <div style={{marginTop:12, display:'flex', justifyContent:'flex-end'}}>
          <div style={{
            transform:'rotate(-8deg)',
            border:'2.5px solid #2EA458', color:'#2EA458',
            padding:'4px 11px', fontSize:9, fontWeight:800, letterSpacing:1.5, borderRadius:3,
            fontFamily:'Georgia, serif'
          }}>
            DELIVERED ✓
          </div>
        </div>
      </div>
    </div>
  );
}

// Realistic Newcastle / Carrington map for detention charge
function MapMock() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 480 420" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
      <defs>
        <pattern id="map-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#E2DDC8" strokeWidth="0.5"/>
        </pattern>
        <filter id="mapBlur" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="0.4"/>
        </filter>
      </defs>
      {/* Land */}
      <rect width="100%" height="100%" fill="#F2EBD8"/>
      <rect width="100%" height="100%" fill="url(#map-grid)"/>

      {/* Hunter River (Carrington is on a river bend) */}
      <path d="M 0 80 Q 80 90 140 130 Q 200 170 250 220 Q 300 270 380 290 L 480 305 L 480 360 L 0 360 z"
            fill="#BFD5E8" opacity="0"/>
      <path d="M -10 50 C 60 70 130 80 180 110 C 230 140 270 200 320 230 C 360 250 420 245 500 240"
            stroke="#A3CADD" strokeWidth="44" fill="none" opacity="0.95" strokeLinecap="round"/>
      <path d="M -10 50 C 60 70 130 80 180 110 C 230 140 270 200 320 230 C 360 250 420 245 500 240"
            stroke="#92BFD5" strokeWidth="1" fill="none" opacity="0.6"/>
      <text x="60" y="50" fontSize="8" fontStyle="italic" fill="#6A8FA8" fontFamily="Georgia, serif">Hunter River</text>

      {/* Park / green area (Bullock Island) */}
      <ellipse cx="380" cy="150" rx="60" ry="38" fill="#D6E5C7" opacity="0.8"/>
      <text x="345" y="155" fontSize="8" fill="#5A7A48" fontFamily="sans-serif">Bullock Island</text>

      {/* Major roads — wider with white casing */}
      {/* Cormorant Rd (main artery) */}
      <path d="M 30 380 Q 80 360 130 320 Q 180 280 240 240 Q 290 210 340 180 Q 380 160 420 140"
            stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M 30 380 Q 80 360 130 320 Q 180 280 240 240 Q 290 210 340 180 Q 380 160 420 140"
            stroke="#F5C97B" strokeWidth="9" fill="none" strokeLinecap="round"/>

      {/* Industrial Drive (vertical) */}
      <path d="M 110 0 L 130 80 L 150 200 L 170 320 L 180 420"
            stroke="#fff" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <path d="M 110 0 L 130 80 L 150 200 L 170 320 L 180 420"
            stroke="#FAE3A0" strokeWidth="6" fill="none" strokeLinecap="round"/>

      {/* Bourke St */}
      <path d="M 230 0 L 240 80 L 260 180 L 280 280 L 300 420"
            stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round"/>

      {/* Smaller streets — neighborhood grid */}
      <g stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.95">
        <path d="M 0 200 L 480 220"/>
        <path d="M 0 270 L 480 285"/>
        <path d="M 0 340 L 280 345"/>
        <path d="M 60 0 L 80 420"/>
        <path d="M 320 280 L 340 420"/>
        <path d="M 380 220 L 410 420"/>
      </g>
      {/* Tiny side streets */}
      <g stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.85">
        <path d="M 0 100 L 250 120"/>
        <path d="M 0 240 L 240 260"/>
        <path d="M 0 310 L 280 315"/>
        <path d="M 280 50 L 280 380"/>
        <path d="M 200 30 L 220 380"/>
      </g>

      {/* Building blocks (industrial near terminal) */}
      <g fill="#E0D8BE" opacity="0.85">
        <rect x="200" y="220" width="22" height="14"/>
        <rect x="226" y="222" width="18" height="14"/>
        <rect x="246" y="218" width="14" height="14"/>
        <rect x="200" y="244" width="40" height="12"/>
        <rect x="195" y="290" width="32" height="20"/>
        <rect x="232" y="295" width="24" height="18"/>
        <rect x="100" y="240" width="20" height="16"/>
        <rect x="140" y="265" width="22" height="14"/>
        <rect x="60" y="160" width="18" height="14"/>
        <rect x="60" y="180" width="22" height="14"/>
      </g>

      {/* Detention zone (geofence around Carrington Coal Terminal) */}
      <circle cx="260" cy="220" r="125" fill="#4F65FF" fillOpacity="0.13" stroke="#4F65FF" strokeOpacity="0.45" strokeWidth="1.5"/>

      {/* Labels — area names */}
      <text x="40" y="380" fontSize="9" fontWeight="600" fill="#5A6479" fontFamily="sans-serif">CARRINGTON</text>
      <text x="350" y="370" fontSize="9" fontWeight="600" fill="#5A6479" fontFamily="sans-serif">MAYFIELD</text>
      <text x="80" y="100" fontSize="9" fontWeight="600" fill="#5A6479" fontFamily="sans-serif">NEWCASTLE</text>
      <text x="180" y="285" fontSize="7" fill="#7A8294" fontFamily="sans-serif">Cormorant Rd</text>
      <text x="100" y="160" fontSize="7" fill="#7A8294" fontFamily="sans-serif">Industrial Dr</text>

      {/* Trip path (red) */}
      <path d="M 80 400 L 130 380 Q 170 360 210 330 Q 240 300 250 260 Q 258 240 260 220"
            stroke="#E5484D" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 260 220 Q 270 200 290 180 Q 310 160 330 130 Q 350 100 340 60"
            stroke="#E5484D" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="4 3"/>

      {/* Warehouse pin */}
      <g transform="translate(260,220)">
        <circle r="12" fill="#fff" stroke="#E5484D" strokeWidth="3"/>
        <circle r="4" fill="#E5484D"/>
      </g>
      <rect x="278" y="208" width="98" height="22" rx="4" fill="#fff" stroke="#E5484D" strokeWidth="1"/>
      <text x="284" y="223" fontSize="11" fontWeight="700" fill="#1F2533" fontFamily="sans-serif">Coal Terminal</text>

      {/* Entry / Exit labels with red callouts */}
      <g>
        <rect x="40" y="385" width="170" height="22" rx="3" fill="#fff" stroke="#E5484D" strokeWidth="1.5"/>
        <text x="50" y="400" fontSize="10" fontWeight="700" fill="#C53030" fontFamily="sans-serif" textDecoration="underline">Entry: 16 Feb 2026, 1:33pm</text>
      </g>
      <g>
        <rect x="280" y="40" width="170" height="22" rx="3" fill="#fff" stroke="#E5484D" strokeWidth="1.5"/>
        <text x="290" y="55" fontSize="10" fontWeight="700" fill="#C53030" fontFamily="sans-serif" textDecoration="underline">Exit: 16 Feb 2026, 2:45pm</text>
      </g>

      {/* Compass */}
      <g transform="translate(440,30)">
        <circle r="14" fill="#fff" stroke="#C7CDDB" strokeWidth="1"/>
        <text x="-3" y="-3" fontSize="9" fontWeight="700" fill="#E5484D" fontFamily="sans-serif">N</text>
        <path d="M 0 -10 L 3 0 L 0 -3 L -3 0 z" fill="#E5484D"/>
      </g>
    </svg>
  );
}

window.PodDocket = PodDocket;
window.MapMock = MapMock;
