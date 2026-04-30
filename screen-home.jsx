// Home / Settlements dashboard
function HomeScreen({ go }) {
  const kpis = [
    { label: 'Trips Closed', value: '5,557', delta: '+16%', trend: 'up', sub: 'since last day' },
    { label: 'PODs Pending', value: '4,932', delta: '+11%', trend: 'up', sub: 'since last day' },
    { label: 'Charges Pending', value: '89', delta: '7%', trend: 'down', sub: 'since last day' },
    { label: 'Disputes Pending', value: '397', danger: true, delta: '+1%', trend: 'up', sub: 'since last day' },
    { label: 'Invoices Pending', value: '89', delta: '8%', trend: 'up', sub: 'since last day' },
  ];

  const podDonut = [
    { label: 'Approve', value: 30, color: '#6FD5A6' },
    { label: 'Review', value: 10, color: '#F5C97B' },
    { label: 'Reject', value: 10, color: '#F0807A' },
  ];

  return (
    <div className="app">
      <Topbar title="Settlements" screen="Home" />
      <div className="main">
        <div className="welcome-bar">
          <h1>Welcome again, Joseph!</h1>
          <span className="sub">Here's how today is looking for you...</span>
          <div className="toggle">
            <button className="active" title="Light">{Icon.sun()}</button>
            <button title="Dark">{Icon.moon()}</button>
          </div>
        </div>

        <div className="kpi-row">
          {kpis.map((k, i) => (
            <div key={i} className="kpi">
              <div className="label">{k.label}</div>
              <div className="value-row">
                <div className={'value' + (k.danger ? ' danger' : '')}>{k.value}</div>
                <div className="delta">
                  <div className={k.trend === 'up' ? 'up' : 'down'}>
                    {k.trend === 'up' ? '\u2197' : '\u2198'} {k.delta}
                  </div>
                  <div>{k.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mid-row">
          <div className="donut-card">
            <div className="head">
              <h3>Review PODs</h3>
              <a onClick={() => go('charges')} style={{cursor:'pointer'}}>View All {Icon.arrowRight(12)}</a>
            </div>
            <div className="ai-badge"><span className="dot"></span> Live AI Analysis complete</div>
            <div className="body">
              <div style={{display:'grid', placeItems:'center'}}><Donut data={podDonut} total={50} /></div>
              <div className="action-stack">
                <div className="action-btn approve" onClick={() => go('charges')}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.sparkle(12)} Approve</span>
                  <span className="count">30</span>
                </div>
                <div className="action-btn review" onClick={() => go('charges')}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.sparkle(12)} Review</span>
                  <span className="count">10</span>
                </div>
                <div className="action-btn reject" onClick={() => go('charges')}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.sparkle(12)} Reject</span>
                  <span className="count">10</span>
                </div>
              </div>
            </div>
            <div className="legend">
              <span><i style={{background:'#6FD5A6'}}/>Approve</span>
              <span><i style={{background:'#F5C97B'}}/>Review</span>
              <span><i style={{background:'#F0807A'}}/>Reject</span>
            </div>
          </div>

          <div className="donut-card">
            <div className="head">
              <h3>Review Charges</h3>
              <a onClick={() => go('charges')} style={{cursor:'pointer'}}>View All {Icon.arrowRight(12)}</a>
            </div>
            <div className="ai-badge"><span className="dot"></span> Live AI Analysis complete</div>
            <div className="body">
              <div style={{display:'grid', placeItems:'center'}}><Donut data={podDonut} total={50} /></div>
              <div className="action-stack">
                <div className="action-btn approve" onClick={() => go('charges')}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.sparkle(12)} Approve</span>
                  <span className="count">30</span>
                </div>
                <div className="action-btn review" onClick={() => go('charges')}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.sparkle(12)} Review</span>
                  <span className="count">10</span>
                </div>
                <div className="action-btn reject" onClick={() => go('charges')}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:6}}>{Icon.sparkle(12)} Reject</span>
                  <span className="count">10</span>
                </div>
              </div>
            </div>
            <div className="legend">
              <span><i style={{background:'#6FD5A6'}}/>Approve</span>
              <span><i style={{background:'#F5C97B'}}/>Review</span>
              <span><i style={{background:'#F0807A'}}/>Reject</span>
            </div>
          </div>

          <div className="qa-card">
            <div className="head">
              <h3>Quick Actions</h3>
              <a>View All {Icon.arrowRight(12)}</a>
            </div>
            {QUICK_ACTIONS.map((q, i) => (
              <div key={i} className="qa-item">
                <div className="qa-icon">
                  {q.icon === 'truck' && Icon.truck(16)}
                  {q.icon === 'alert' && Icon.alert(16)}
                  {q.icon === 'check' && Icon.check(16)}
                </div>
                <div>
                  <div className="qa-title">{q.title}</div>
                  <div className="qa-sub">{q.sub}</div>
                  <div className="qa-meta">
                    {q.tag && <span className={'tag ' + q.tagColor}><i/>{q.tag}</span>}
                    <span style={{display:'inline-flex', alignItems:'center', gap:3}}>{Icon.calendar(11)} {q.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-card">
          <div className="head">
            <span className="spark">{Icon.sparkle(16)}</span> AI Assist
          </div>
          <div className="sub">Suggested Query</div>
          <div className="ai-chips">
            {AI_QUERIES.map((q, i) => <div key={i} className="ai-chip">{q}</div>)}
          </div>
          <div className="ai-input">
            <input placeholder="Type something" />
            <span className="ico">{Icon.mic()}</span>
            <span className="send-btn">{Icon.send()}</span>
          </div>
          <div className="attach-row">{Icon.attach()} Attach</div>
        </div>
      </div>
    </div>
  );
}
window.HomeScreen = HomeScreen;
