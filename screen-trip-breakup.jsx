// Trip Charge Breakup screen — opened when a trip row is clicked
function TripBreakupScreen({ trip, onBack, onSelectCharge, onApprove, onReject }) {
  const [tab, setTab] = React.useState('breakup');
  if (!trip) return null;
  const data = getTripCharges(trip);

  return (
    <div className="app">
      {/* Custom topbar with X close + Reject/Approve buttons */}
      <div className="topbar">
        <span className="menu-btn" onClick={onBack}>{Icon.x(18)}</span>
        <div className="crumbs">
          <span className="pri">Trip# {trip.id}</span>
          <span className={'bucket-pill ' + trip.aiBucket} style={{marginLeft:8}}>
            {Icon.sparkle(10)} AI Suggest: {trip.aiBucket.charAt(0).toUpperCase() + trip.aiBucket.slice(1)}
          </span>
        </div>
        <div className="right">
          <button className="btn btn-reject" onClick={onReject}>{Icon.x(13)} Reject</button>
          <button className="btn btn-approve" style={{background:'#2EA458', color:'#fff', borderColor:'#2EA458'}} onClick={onApprove}>{Icon.check(13)} Approve</button>
        </div>
      </div>

      <div className="main">
        {/* Trip header card */}
        <div className="trip-header-card">
          <div className="trip-cell">
            <div className="lbl">Carrier Type</div>
            <div className="val">Transporter</div>
          </div>
          <div className="trip-cell">
            <div className="lbl">Carrier Name</div>
            <div className="val">{trip.vendor}</div>
          </div>
          <div className="trip-cell">
            <div className="lbl">Billing Cycle</div>
            <div className="val">{trip.billingCycle}</div>
          </div>
          <div className="trip-cell">
            <div className="lbl">Entity Type</div>
            <div className="val">Trip</div>
          </div>
          <div className="trip-cell">
            <div className="lbl">Amount</div>
            <div className="val">{AUD(trip.amount)}</div>
          </div>
          <div className="trip-cell">
            <div className="lbl">Reference No.</div>
            <div className="val" style={{color:'#4F65FF'}}>{trip.id}</div>
          </div>
        </div>

        <div className="surface" style={{marginTop:14}}>
          {/* Tabs */}
          <div className="tab-bar">
            <div className={'tab ' + (tab==='breakup'?'active':'')} onClick={()=>setTab('breakup')}>Charge Breakup</div>
            <div className={'tab ' + (tab==='docs'?'active':'')} onClick={()=>setTab('docs')}>{Icon.file(13)} Documents</div>
            <div className={'tab ' + (tab==='comments'?'active':'')} onClick={()=>setTab('comments')}>💬 Comments</div>
          </div>

          {/* Filter row */}
          <div className="filter-row">
            <span style={{color:'#6B7388', cursor:'pointer'}}>{Icon.filter(14)}</span>
            <div style={{flex:1}} />
            <button className="btn btn-primary" style={{background:'#fff', color:'#4F65FF', borderColor:'#C9D2FF'}}>{Icon.plus(13)} Add Charge</button>
            <div className="icon-button">{Icon.download()}</div>
            <span style={{fontSize:12, color:'#6B7388', marginLeft:8}}>View By</span>
            <div className="select"><span>Charge Type</span> {Icon.chevDown(11)}</div>
          </div>

          {/* Breakup table */}
          <table className="breakup-table">
            <thead>
              <tr>
                <th style={{width:'22%'}}>Charge Name</th>
                <th style={{width:'14%'}}>Entity#</th>
                <th style={{width:'10%'}}>Amount</th>
                <th style={{width:'18%'}}>Remarks</th>
                <th className="ai-col">AI Suggest {Icon.sparkle(11)}</th>
                <th style={{width:90}} className="center">Review<br/>Status</th>
                <th style={{width:120}} className="center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.groups.map((g, gi) => (
                <ChargeGroup key={g.name} group={g} onSelectCharge={onSelectCharge} trip={trip} />
              ))}
              <tr className="total-row">
                <td><b>Total Amount</b></td>
                <td colSpan={2} style={{fontWeight:700, fontSize:14}}>{AUD(data.total)}</td>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChargeGroup({ group, onSelectCharge, trip }) {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <tr className="charge-group-row">
        <td colSpan={7}>
          <span style={{display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer'}} onClick={()=>setOpen(!open)}>
            {open ? Icon.chevDown(12) : Icon.chevRight(12)}
            <b>{group.name}</b>
          </span>
          {!open && <span style={{marginLeft:14, color:'#6B7388'}}>{AUD(group.subtotal)}</span>}
        </td>
      </tr>
      {open && group.items.map(c => (
        <tr key={c.id} className={'charge-row ' + (c.aiBucket==='penalty' ? 'row-penalty' : '')}>
          <td>
            {c.isAi && <span style={{color:'#6E4FE6', marginRight:4}}>{Icon.sparkle(10)} AI</span>}
            {c.name}
          </td>
          <td>
            <div style={{fontSize:12}}>{c.entity}</div>
            <div style={{fontSize:11, color:'#8A92A6'}}>{c.entityType}</div>
          </td>
          <td style={{fontVariantNumeric:'tabular-nums', fontWeight:500, color: c.amount<0?'#C53030':'#1F2533'}}>
            {AUD(c.amount)}
          </td>
          <td style={{fontSize:12, color:'#4A5470'}}>
            {c.remark.includes('AI') || c.remark.includes('Shipsy') ? <span style={{color:'#6E4FE6', marginRight:4}}>{Icon.sparkle(10)}</span> : null}
            {c.remark}
          </td>
          <td>
            <span className={'cell-suggest ' + (c.aiBucket==='penalty' ? 'review' : c.aiBucket)} style={c.aiBucket==='penalty'?{background:'#EEF1FF', borderColor:'#C9D2FF', color:'#2538C8'}:{}}>
              {c.aiBucket==='penalty'
                ? <span style={{color:'#6E4FE6', display:'inline-flex'}}>{Icon.sparkle(11)}</span>
                : <span className="marker">{c.aiBucket==='approve' ? Icon.check(10) : c.aiBucket==='review' ? '!' : Icon.x(10)}</span>}
              {c.aiPill}
            </span>
          </td>
          <td className="center">
            {c.action === 'apply' ? (
              <button className="apply-btn">Apply</button>
            ) : (
              <span className={'review-circ ' + (c.reviewed ? 'done' : '')}>
                {c.reviewed && Icon.check(10)}
              </span>
            )}
          </td>
          <td className="center">
            <span className="row-actions">
              <span className="iact view" onClick={() => onSelectCharge && onSelectCharge(c, trip)} title="View charge details">{Icon.eye(13)}</span>
              <span className="iact reject" title="Reject">{Icon.trash(13)}</span>
              <span className="iact approve" style={{background:'#FAFBFD', color:'#6B7388', borderColor:'#DDE1EA'}} title="Edit">{Icon.pencil(13)}</span>
            </span>
          </td>
        </tr>
      ))}
    </>
  );
}

window.TripBreakupScreen = TripBreakupScreen;
