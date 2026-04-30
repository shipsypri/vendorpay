// Topbar shared across screens
function Topbar({ title, onNav, screen, dateRange }) {
  return (
    <div className="topbar">
      <div className="menu-btn" style={{cursor: onNav ? 'pointer' : 'default'}} onClick={onNav}>{Icon.menu()}</div>
      <div className="crumbs">
        <span className="pri">{title}</span>
        {screen && <><span className="sep">|</span><span className="sec">{screen}</span></>}
      </div>
      <div className="right">
        {dateRange && (
          <div className="date-pill">
            <span className="label">{dateRange.label}</span>
            <span>{dateRange.value}</span>
            {Icon.chevDown(12)}
          </div>
        )}
        <div className="icon-btn" title="Beta">{Icon.beta()}</div>
        <div className="icon-btn" title="Help">{Icon.help()}</div>
        <div className="icon-btn" title="Notifications">{Icon.bell()}</div>
        <div className="avatar">JS</div>
      </div>
    </div>
  );
}
window.Topbar = Topbar;

// Donut chart - SVG
function Donut({ data, total }) {
  const r = 70, cx = 90, cy = 90, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F2F6" strokeWidth="22"/>
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const dash = `${len} ${c - len}`;
        const off = c * 0.25 - acc;
        acc += len;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="22" strokeDasharray={dash} strokeDashoffset={off} />;
      })}
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="34" fontWeight="600" fill="#1F2533">{total}</text>
    </svg>
  );
}
window.Donut = Donut;
