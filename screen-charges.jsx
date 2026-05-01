// Review Charges — main listing screen (replaces Review PODs as homepage)
function ChargesScreen({ go, onSelectTrip, tripStatus = {}, setStatus }) {
  const [tab, setTab] = React.useState('open');
  const [groupBy, setGroupBy] = React.useState('ai');
  const [expanded, setExpanded] = React.useState({approve:true, review:true, reject:true});
  const [selected, setSelected] = React.useState({}); // {tripId: true}

  const statusOf = (id) => tripStatus[id] || 'open';
  const visibleTrips = window.TRIPS.filter(t => {
    const s = statusOf(t.id);
    if (tab === 'open') return s === 'open';
    if (tab === 'approved') return s === 'approved';
    if (tab === 'rejected') return s === 'rejected';
    return true;
  });

  const groups = ['approve', 'review', 'reject'].map(b => ({
    bucket: b,
    items: visibleTrips.filter(t => t.aiBucket === b),
  }));

  const applyStatus = (ids, newStatus) => {
    if (!ids.length || !setStatus) return;
    setStatus(ids, newStatus);
    setSelected(prev => {
      const next = {...prev};
      ids.forEach(id => { delete next[id]; });
      return next;
    });
  };

  const bulkApprove = () => applyStatus(Object.keys(selected), 'approved');
  const bulkReject = () => applyStatus(Object.keys(selected), 'rejected');
  const rowApprove = (id) => applyStatus([id], 'approved');
  const rowReject = (id) => applyStatus([id], 'rejected');

  const toggleBucket = (bucket) => {
    const items = visibleTrips.filter(t => t.aiBucket === bucket);
    const allSelected = items.length > 0 && items.every(it => selected[it.id]);
    const next = {...selected};
    items.forEach(it => { if (allSelected) delete next[it.id]; else next[it.id] = true; });
    setSelected(next);
  };
  const toggleRow = (id) => setSelected(s => { const n = {...s}; if (n[id]) delete n[id]; else n[id] = true; return n; });
  const isBucketAllSelected = (bucket) => {
    const items = visibleTrips.filter(t => t.aiBucket === bucket);
    return items.length > 0 && items.every(it => selected[it.id]);
  };
  const isBucketSomeSelected = (bucket) => {
    const items = visibleTrips.filter(t => t.aiBucket === bucket);
    return items.some(it => selected[it.id]) && !isBucketAllSelected(bucket);
  };
  const totalSelected = Object.keys(selected).length;

  // Baseline historical counts (past activity) + what gets actioned in this session
  const sessionApproved = window.TRIPS.filter(t => statusOf(t.id) === 'approved').length;
  const sessionRejected = window.TRIPS.filter(t => statusOf(t.id) === 'rejected').length;
  const tabCounts = {
    open: window.TRIPS.filter(t => statusOf(t.id) === 'open').length,
    approved: 500 + sessionApproved,
    rejected: 56 + sessionRejected,
  };

  return (
    <div className="app">
      <Topbar
        title="Review Charges"
        dateRange={{ label: 'Billing Cycle', value: '20 Jan 2026 - 19 Feb 2026' }}
      />
      <div className="main">
        <div className="surface">
          <div className="tab-bar charges-tabs">
            <div className={'tab ' + (tab==='open' ? 'active' : '')} onClick={()=>setTab('open')}>
              Open <span className="count" style={{background: tab==='open' ? '#4F65FF':'#F1F2F6', color: tab==='open'?'#fff':'#6B7388'}}>{tabCounts.open}</span>
            </div>
            <div className={'tab ' + (tab==='approved' ? 'active' : '')} onClick={()=>setTab('approved')}>
              Approved <span className="count" style={{background:'transparent', color:'#2EA458', fontWeight:600}}>{tabCounts.approved}</span>
            </div>
            <div className={'tab ' + (tab==='rejected' ? 'active' : '')} onClick={()=>setTab('rejected')}>
              Rejected <span className="count" style={{background:'transparent', color:'#E5484D', fontWeight:600}}>{tabCounts.rejected}</span>
            </div>
          </div>

          <div className="filter-row">
            <span className="group-by">Group By</span>
            <div className="seg">
              <button className={groupBy==='ai'?'active':''} onClick={()=>setGroupBy('ai')}>{Icon.sparkle(11)} AI-Suggest</button>
              <button className={groupBy==='vendor'?'active':''} onClick={()=>setGroupBy('vendor')}>Vendor</button>
            </div>
            <div style={{flex:1}} />
            <span style={{cursor:'pointer', color:'#6B7388'}}>{Icon.gear ? Icon.gear(14) : '⚙'}</span>
          </div>

          <div className="filter-row" style={{borderTop: '1px solid #EEF0F4'}}>
            <div className="select disabled"><span className="label">Carrier</span> Select {Icon.chevDown(11)}</div>
            <div className="select disabled"><span className="label">Hub</span> Select {Icon.chevDown(11)}</div>
            <div className="select disabled" style={{minWidth:200}}><span className="label">Entity Reference</span> Type {Icon.chevDown(11)}</div>
            <span style={{color:'#4F65FF', fontSize:12, fontWeight:500, cursor:'pointer'}}>More Filters</span>
            <div style={{flex:1}} />
            <div className="icon-button">{Icon.download()}</div>
            <button className="btn btn-approve" onClick={bulkApprove} disabled={!totalSelected} style={{opacity: totalSelected?1:0.5, cursor: totalSelected?'pointer':'not-allowed'}}>{Icon.check(13)} Approve{totalSelected > 0 ? ' (' + totalSelected + ')' : ''}</button>
            <button className="btn btn-reject" onClick={bulkReject} disabled={!totalSelected} style={{opacity: totalSelected?1:0.5, cursor: totalSelected?'pointer':'not-allowed'}}>{Icon.x(13)} Reject{totalSelected > 0 ? ' (' + totalSelected + ')' : ''}</button>
            <div className="pager" style={{marginLeft:8}}>
              <button>K</button>
              <button>{Icon.chevLeft(12)}</button>
              <span style={{padding:'0 4px'}}>1</span>
              <button>{Icon.chevRight(12)}</button>
              <select className="pp"><option>100 / Page</option></select>
            </div>
          </div>

          <table className="pod-table">
            <thead>
              <tr>
                <th style={{width:30}}></th>
                <th style={{width:30}}><input type="checkbox"/></th>
                <th>Entity</th>
                <th>Amount</th>
                <th>Hub Code</th>
                <th>Vehicle</th>
                <th className="ai-col">AI Suggest {Icon.sparkle(11)}</th>
                <th className="center" style={{width:170}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <React.Fragment key={g.bucket}>
                  <tr className="group-row">
                    <td colSpan={8}>
                      <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
                        <span style={{cursor:'pointer'}} onClick={()=>setExpanded({...expanded, [g.bucket]: !expanded[g.bucket]})}>{expanded[g.bucket] ? Icon.chevDown(12) : Icon.chevRight(12)}</span>
                        <input type="checkbox" checked={isBucketAllSelected(g.bucket)} ref={el => { if (el) el.indeterminate = isBucketSomeSelected(g.bucket); }} onChange={()=>toggleBucket(g.bucket)} title="Select all in this bucket"/>
                        <span className={'bucket-pill ' + g.bucket}>
                          {Icon.sparkle(10)} AI Suggest: {g.bucket.charAt(0).toUpperCase()+g.bucket.slice(1)}
                        </span>
                        <span style={{fontSize:11, color:'#6B7388', marginLeft:6}}>
                          {g.items.filter(it => selected[it.id]).length > 0 ? g.items.filter(it => selected[it.id]).length + ' of ' + g.items.length + ' selected' : g.items.length + ' trips'}
                        </span>
                      </span>
                    </td>
                  </tr>
                  {expanded[g.bucket] && g.items.map(it => (
                    <tr key={it.id} className="pod-row">
                      <td></td>
                      <td><input type="checkbox" checked={!!selected[it.id]} onChange={()=>toggleRow(it.id)}/></td>
                      <td>
                        <div className="cn-link" style={{cursor:'pointer', fontWeight:500}} onClick={() => onSelectTrip && onSelectTrip(it)}>
                          {it.id} / {it.vendor}
                        </div>
                        <div style={{fontSize:11, color:'#8A92A6', marginTop:2}}>Trip</div>
                      </td>
                      <td style={{fontVariantNumeric:'tabular-nums', fontWeight:500}}>{AUD(it.amount)}</td>
                      <td>{it.hub}</td>
                      <td>
                        <div>{it.vehicle}</div>
                        <div style={{fontSize:11, color:'#8A92A6', marginTop:2}}>{it.vehicleModel}</div>
                      </td>
                      <td>
                        <span className={'cell-suggest ' + g.bucket}>
                          <span className="marker">{g.bucket==='approve' ? Icon.check(10) : g.bucket==='review' ? '!' : Icon.x(10)}</span>
                          {it.aiRemark}
                        </span>
                      </td>
                      <td className="center">
                        <span className="row-actions">
                          <span className="iact approve" onClick={(e)=>{e.stopPropagation(); rowApprove(it.id);}} title="Approve">{Icon.check(13)}</span>
                          <span className="iact reject" onClick={(e)=>{e.stopPropagation(); rowReject(it.id);}} title="Reject">{Icon.x(13)}</span>
                          <span className="iact view" onClick={() => onSelectTrip && onSelectTrip(it)} title="View charge breakup">{Icon.plus ? Icon.plus(13) : '+'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {visibleTrips.length === 0 && (
            <div style={{padding:'48px 24px', textAlign:'center', color:'#8A92A6', fontSize:13}}>
              No {tab} trips. {tab !== 'open' ? 'Approve or reject trips from the Open tab to populate this view.' : 'All clear!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
window.ChargesScreen = ChargesScreen;
