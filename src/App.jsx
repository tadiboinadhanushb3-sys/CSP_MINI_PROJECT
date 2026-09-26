import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, BarChart3, BookOpen, BrainCircuit, CheckCircle2, ChevronRight,
  CircleHelp, Droplets, Fish, Gauge, Info, Menu, Plus, RefreshCw, Settings2, ShieldCheck,
  Sparkles, Waves, X, CalendarDays, Database, ArrowUpRight, Bell, Bot, Cpu, Eye, GaugeCircle,
  HeartPulse, Leaf, Lightbulb, LockKeyhole, MapPin, Thermometer, Wind, Zap, CircleDot,
  FlaskConical,
} from 'lucide-react';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip, XAxis, YAxis, BarChart, Bar, Cell, ReferenceLine,
} from 'recharts';

const STORAGE_KEY = 'smart-aquaculture-records';
const demoRecords = [
  { id: 1, pond: 'Pond 1', date: '2026-08-04', ph: 7.4, population: 2400, deaths: 18 },
  { id: 2, pond: 'Pond 2', date: '2026-08-07', ph: 6.2, population: 1800, deaths: 42 },
  { id: 3, pond: 'Pond 3', date: '2026-08-11', ph: 8.7, population: 3200, deaths: 35 },
  { id: 4, pond: 'Pond 4', date: '2026-08-15', ph: 7.8, population: 2100, deaths: 9 },
  { id: 5, pond: 'Pond 1', date: '2026-08-19', ph: 7.1, population: 2382, deaths: 12 },
  { id: 6, pond: 'Pond 2', date: '2026-08-22', ph: 5.8, population: 1758, deaths: 68 },
  { id: 7, pond: 'Pond 3', date: '2026-08-25', ph: 8.3, population: 3165, deaths: 14 },
  { id: 8, pond: 'Pond 4', date: '2026-08-28', ph: 7.6, population: 2091, deaths: 7 },
].map((record) => ({ ...record, rate: (record.deaths / record.population) * 100 }));

const demoPonds = [
  { id: 'P01', name: 'Pond 01', species: 'Tilapia', population: 12000, quality: 94, health: 92, status: 'safe', area: 'North basin' },
  { id: 'P02', name: 'Pond 02', species: 'Catfish', population: 8500, quality: 78, health: 81, status: 'warning', area: 'East basin' },
  { id: 'P03', name: 'Pond 03', species: 'Rohu', population: 10200, quality: 89, health: 87, status: 'safe', area: 'South basin' },
  { id: 'P04', name: 'Pond 04', species: 'Tilapia', population: 7600, quality: 64, health: 69, status: 'warning', area: 'West basin' },
];

const demoAlerts = [
  { id: 1, type: 'critical', pond: 'Pond 04', parameter: 'Dissolved oxygen', value: '3.6 mg/L', range: '5.0 - 8.0 mg/L', time: '12 min ago', action: 'Inspect aeration and recheck the sensor.', read: false },
  { id: 2, type: 'warning', pond: 'Pond 02', parameter: 'pH', value: '6.2', range: '6.5 - 8.5', time: '42 min ago', action: 'Recheck pH and observe fish behavior.', read: false },
  { id: 3, type: 'info', pond: 'Pond 01', parameter: 'Temperature', value: '27.4 C', range: '24 - 30 C', time: '1 hr ago', action: 'Continue routine monitoring.', read: true },
  { id: 4, type: 'sensor', pond: 'Pond 03', parameter: 'Turbidity sensor', value: 'No signal', range: 'Connected', time: '2 hrs ago', action: 'Check the sensor connection before the next reading.', read: false },
];

const demoSensors = [
  { id: 'AQ-SENSOR-001', type: 'Water quality hub', pond: 'Pond 01', status: 'Connected', battery: 87, update: '2 min ago' },
  { id: 'AQ-SENSOR-002', type: 'pH + temperature', pond: 'Pond 02', status: 'Connected', battery: 72, update: '4 min ago' },
  { id: 'AQ-SENSOR-003', type: 'Dissolved oxygen', pond: 'Pond 03', status: 'Connected', battery: 93, update: '5 min ago' },
  { id: 'AQ-SENSOR-004', type: 'Turbidity probe', pond: 'Pond 04', status: 'Disconnected', battery: 18, update: '2 hrs ago' },
];

const demoQuality = [
  { label: 'pH', value: '7.4', unit: '', status: 'Optimal', trend: '+1.8%', icon: Activity, tone: 'teal', range: '6.5 - 8.5' },
  { label: 'Temperature', value: '27.4', unit: 'C', status: 'Optimal', trend: '+0.6%', icon: Thermometer, tone: 'orange', range: '24 - 30 C' },
  { label: 'Dissolved oxygen', value: '5.8', unit: 'mg/L', status: 'Optimal', trend: '-1.2%', icon: Wind, tone: 'blue', range: '5.0 - 8.0 mg/L' },
  { label: 'Ammonia', value: '0.18', unit: 'mg/L', status: 'Optimal', trend: '-4.1%', icon: FlaskConical, tone: 'green', range: '0 - 0.5 mg/L' },
  { label: 'Nitrite', value: '0.24', unit: 'mg/L', status: 'Warning', trend: '+3.4%', icon: FlaskConical, tone: 'amber', range: '0 - 0.2 mg/L' },
  { label: 'Turbidity', value: '18', unit: 'NTU', status: 'Optimal', trend: '-2.6%', icon: Eye, tone: 'blue', range: '0 - 25 NTU' },
  { label: 'Salinity', value: '0.4', unit: 'ppt', status: 'Optimal', trend: '0.0%', icon: Waves, tone: 'teal', range: '0 - 2 ppt' },
  { label: 'Water level', value: '86', unit: '%', status: 'Optimal', trend: '+2.1%', icon: GaugeCircle, tone: 'green', range: '70 - 100%' },
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'ponds', label: 'Ponds', icon: Droplets },
  { id: 'water-quality', label: 'Water Quality', icon: Waves },
  { id: 'fish-health', label: 'Fish Health', icon: HeartPulse },
  { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'iot', label: 'IoT Devices', icon: Cpu },
  { id: 'add', label: 'Add Data', icon: Plus },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'recommendations', label: 'Recommendations', icon: ShieldCheck },
  { id: 'about', label: 'About Project', icon: BookOpen },
];

function getStatus(ph) {
  if (ph >= 6.5 && ph <= 8.5) return 'safe';
  if (ph >= 5.8 && ph <= 9.2) return 'warning';
  return 'critical';
}

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function pearson(records) {
  if (records.length < 2) return 0;
  const x = records.map((r) => r.ph);
  const y = records.map((r) => r.rate);
  const meanX = x.reduce((a, b) => a + b, 0) / x.length;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;
  const numerator = x.reduce((sum, value, i) => sum + ((value - meanX) * (y[i] - meanY)), 0);
  const denominator = Math.sqrt(x.reduce((sum, value) => sum + (value - meanX) ** 2, 0) * y.reduce((sum, value) => sum + (value - meanY) ** 2, 0));
  return denominator ? numerator / denominator : 0;
}

function SplashScreen() {
  return <div className="splash-screen">
    <div className="splash-mark"><Waves size={34} /><Fish size={25} /></div>
    <p className="eyebrow">AI & DATA SCIENCE · CSP PROTOTYPE</p>
    <h1>Smart <span>Aquaculture</span></h1>
    <p>Water Quality & Fish Mortality Monitoring</p>
    <div className="loader"><span /></div>
    <small>Community Service Project · Nayudugudem Village</small>
  </div>;
}

function StatusBadge({ status }) {
  const Icon = status === 'safe' ? CheckCircle2 : AlertTriangle;
  return <span className={`status-badge ${status}`}><Icon size={14} /> {statusLabel(status)}</span>;
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
  return <div className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
    <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
    <ArrowUpRight className="stat-arrow" size={17} />
  </div>;
}

function EmptyState({ icon: Icon, title, text }) {
  return <div className="empty-state"><Icon size={30} /><h3>{title}</h3><p>{text}</p></div>;
}

function PondTable({ records, compact = false }) {
  return <div className={`table-wrap ${compact ? 'compact' : ''}`}>
    <table><thead><tr><th>Pond</th><th>Date</th><th>pH level</th><th>Fish population</th><th>Deaths</th><th>Mortality rate</th><th>Status</th></tr></thead>
      <tbody>{records.map((r) => <tr key={r.id}><td><strong>{r.pond}</strong></td><td>{r.date}</td><td><span className="ph-value">{r.ph.toFixed(1)}</span></td><td>{r.population.toLocaleString()}</td><td>{r.deaths}</td><td>{r.rate.toFixed(2)}%</td><td><StatusBadge status={getStatus(r.ph)} /></td></tr>)}</tbody>
    </table>
  </div>;
}

function ChartCard({ title, eyebrow, children, className = '' }) {
  return <section className={`chart-card ${className}`}><div className="chart-heading"><div><p className="section-eyebrow">{eyebrow}</p><h3>{title}</h3></div><button className="icon-button" title="Chart information"><Info size={16} /></button></div>{children}</section>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [records, setRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || demoRecords; } catch { return demoRecords; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState({ pond: 'All ponds', date: '' });
  const [alerts, setAlerts] = useState(demoAlerts);

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 2200); return () => clearTimeout(timer); }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }, [records]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast]);

  const stats = useMemo(() => {
    const pondCount = new Set(records.map((r) => r.pond)).size;
    const avgPh = records.reduce((sum, r) => sum + r.ph, 0) / (records.length || 1);
    const totalDeaths = records.reduce((sum, r) => sum + r.deaths, 0);
    return { pondCount, avgPh, totalDeaths, status: getStatus(avgPh) };
  }, [records]);
  const correlation = pearson(records);
  const filteredRecords = records.filter((r) => (filters.pond === 'All ponds' || r.pond === filters.pond) && (!filters.date || r.date === filters.date));
  const latest = records[records.length - 1] || demoRecords[0];
  const risk = getStatus(latest.ph) === 'critical' || latest.rate > 3 ? 'High Risk' : getStatus(latest.ph) === 'warning' || latest.rate > 1.5 ? 'Medium Risk' : 'Low Risk';
  const riskClass = risk.toLowerCase().replace(' ', '-');
  const trendData = [...records].sort((a, b) => a.date.localeCompare(b.date)).map((r) => ({ date: r.date.slice(5), pH: r.ph, mortality: Number(r.rate.toFixed(2)) }));
  const scatterData = records.map((r) => ({ ph: r.ph, rate: Number(r.rate.toFixed(2)) }));

  function navigate(nextPage) { setPage(nextPage); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function addRecord(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const record = { id: Date.now(), pond: form.get('pond'), date: form.get('date'), ph: Number(form.get('ph')), population: Number(form.get('population')), deaths: Number(form.get('deaths')) };
    record.rate = record.population ? (record.deaths / record.population) * 100 : 0;
    setRecords((current) => [...current, record]);
    setToast(`${record.pond} data added successfully.`);
    event.currentTarget.reset();
    navigate('monitoring');
  }

  if (loading) return <SplashScreen />;
  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-icon"><Waves size={22} /><Fish size={15} /></div><div><strong>Smart<span>Aqua</span></strong><small>Monitoring prototype</small></div><button className="close-menu" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
      <div className="nav-label">Workspace</div>
      <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? 'active' : ''} onClick={() => navigate(id)}><Icon size={18} /><span>{label}</span>{page === id && <ChevronRight size={15} className="nav-chevron" />}</button>)}</nav>
      <div className="sidebar-foot"><div className="demo-pill"><Database size={16} /><div><strong>Demo data active</strong><small>Stored in this browser</small></div></div><div className="location"><span className="online-dot" /> Nayudugudem, AP</div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div className="breadcrumb"><span>Community Service Project</span><ChevronRight size={15} /><strong>{navItems.find((item) => item.id === page)?.label}</strong></div><div className="top-actions"><span className="data-state"><span className="online-dot" /> Sample data</span><button className="avatar-button" title="Project profile">AD</button></div></header>
      <div className="content">
        {page === 'dashboard' && <Dashboard stats={stats} latest={latest} records={records} risk={risk} riskClass={riskClass} navigate={navigate} />}
        {(page === 'monitoring' || page === 'ponds') && <Ponds records={filteredRecords} filters={filters} setFilters={setFilters} navigate={navigate} />}
        {page === 'water-quality' && <WaterQuality />}
        {page === 'fish-health' && <FishHealth ponds={demoPonds} />}
        {page === 'ai-insights' && <AIInsights stats={stats} latest={latest} risk={risk} />}
        {page === 'alerts' && <Alerts alerts={alerts} setAlerts={setAlerts} />}
        {page === 'iot' && <IoTDevices sensors={demoSensors} />}
        {page === 'add' && <AddData onSubmit={addRecord} />}
        {page === 'analytics' && <Analytics records={records} trendData={trendData} scatterData={scatterData} correlation={correlation} />}
        {page === 'recommendations' && <Recommendations status={stats.status} latest={latest} risk={risk} riskClass={riskClass} />}
        {page === 'about' && <About />}
      </div>
    </main>
    {toast && <div className="toast"><CheckCircle2 size={19} /><span>{toast}</span></div>}
  </div>;
}

function PageIntro({ eyebrow, title, text, action }) { return <div className="page-intro"><div><p className="section-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div>{action}</div>; }

function Dashboard({ stats, latest, records, risk, riskClass, navigate }) {
  const status = getStatus(stats.avgPh);
  return <>
    <PageIntro eyebrow="Overview · 28 August 2026" title="Good morning, project team." text="A clear view of pond health, pH signals, and fish mortality patterns." action={<button className="primary-button" onClick={() => navigate('add')}><Plus size={17} /> Add pond data</button>} />
    <div className="demo-banner"><Sparkles size={18} /><span><strong>Demo / Sample Data</strong> — This prototype uses realistic sample records for presentation. It is not live village measurement data.</span><button onClick={() => navigate('about')}>About project <ChevronRight size={15} /></button></div>
    <div className="stat-grid"><StatCard label="Total ponds" value={stats.pondCount} detail="Active in workspace" icon={Droplets} tone="teal" /><StatCard label="Average pH" value={stats.avgPh.toFixed(1)} detail="Recommended 6.5 - 8.5" icon={Activity} tone="blue" /><StatCard label="Fish mortality" value={stats.totalDeaths} detail="Total recorded deaths" icon={Fish} tone="coral" /><StatCard label="Water status" value={statusLabel(status)} detail="Based on average pH" icon={status === 'safe' ? ShieldCheck : AlertTriangle} tone={status} /></div>
    <DashboardMetrics />
    <div className="dashboard-grid"><section className={`status-panel ${status}`}><div className="panel-top"><div><p className="section-eyebrow">Current water status</p><h2><span className="status-orb"><span /></span>{statusLabel(status)}</h2></div><StatusBadge status={status} /></div><p className="status-copy">Average pH is {stats.avgPh.toFixed(1)}, {status === 'safe' ? 'within the recommended range for healthy pond conditions.' : 'outside the recommended range. Review recent measurements.'}</p><div className="ph-scale"><div className="scale-labels"><span>Acidic</span><span>Recommended pH 6.5 - 8.5</span><span>Alkaline</span></div><div className="scale-track"><span className="safe-zone" /><span className="scale-marker" style={{ left: `${Math.min(94, Math.max(4, (stats.avgPh / 14) * 100))}%` }} /></div><div className="scale-numbers"><span>0</span><span>6.5</span><span>8.5</span><span>14</span></div></div><button className="text-button" onClick={() => navigate('recommendations')}>View recommendations <ArrowUpRight size={16} /></button></section>
      <section className="panel recent-panel"><div className="panel-heading"><div><p className="section-eyebrow">Latest activity</p><h3>Recent observations</h3></div><button className="text-button" onClick={() => navigate('monitoring')}>View all <ChevronRight size={15} /></button></div><div className="recent-list">{records.slice(-4).reverse().map((record) => <div className="recent-row" key={record.id}><div className="pond-avatar"><Droplets size={15} /></div><div><strong>{record.pond}</strong><small>{record.date} · pH {record.ph.toFixed(1)}</small></div><div className="recent-rate"><strong>{record.rate.toFixed(2)}%</strong><small>mortality</small></div><StatusBadge status={getStatus(record.ph)} /></div>)}</div></section></div>
    <div className="bottom-grid"><section className="panel risk-panel"><div className="panel-heading"><div><p className="section-eyebrow">Prototype / Demonstration</p><h3>AI-based fish mortality risk</h3></div><BrainCircuit size={22} className="heading-icon" /></div><div className="risk-content"><div className={`risk-score ${riskClass}`}><span>{risk === 'Low Risk' ? '01' : risk === 'Medium Risk' ? '02' : '03'}</span><small>{risk}</small></div><div><p>Transparent rule-based estimate using current pH and historical mortality records.</p><button className="text-button" onClick={() => navigate('recommendations')}>See how it works <ArrowUpRight size={16} /></button></div></div></section><section className="panel quick-panel"><div className="panel-heading"><div><p className="section-eyebrow">Project workflow</p><h3>From data to insight</h3></div></div><div className="workflow"><span><Database size={17} /> Collect</span><ChevronRight size={14} /><span><Activity size={17} /> Monitor</span><ChevronRight size={14} /><span><BarChart3 size={17} /> Analyze</span><ChevronRight size={14} /><span><ShieldCheck size={17} /> Act</span></div></section></div>
  </>;
}

function DashboardMetrics() {
  return <>
    <div className="section-title-row"><div><p className="section-eyebrow">Live overview</p><h2>Water & fish health</h2></div><span className="simulation-label"><CircleDot size={13} /> SIMULATED SENSOR FEED</span></div>
    <div className="metric-grid">{[
      ['Water quality score', '92', '/100', 'Optimal', '+2.8%', ShieldCheck, 'teal'],
      ['Fish health score', '89', '/100', 'Healthy', '+1.6%', HeartPulse, 'green'],
      ['Temperature', '27.4', ' C', 'Optimal', '+0.6%', Thermometer, 'orange'],
      ['Dissolved oxygen', '5.8', ' mg/L', 'Optimal', '-1.2%', Wind, 'blue'],
      ['Ammonia', '0.18', ' mg/L', 'Optimal', '-4.1%', FlaskConical, 'green'],
      ['Active alerts', '2', '', 'Needs review', '+1', Bell, 'amber'],
      ['Fish population', '38,300', '', 'Across 4 ponds', '+3.2%', Fish, 'teal'],
      ['Expected yield', '4.8', ' tonnes', 'This cycle', '+6.4%', Leaf, 'green'],
    ].map(([label, value, unit, status, trend, Icon, tone]) => <div className="metric-card" key={label}><div className={`metric-icon ${tone}`}><Icon size={17} /></div><div className="metric-copy"><span>{label}</span><strong>{value}<em>{unit}</em></strong><div><small className={tone === 'amber' ? 'warning-text' : 'success-text'}>{status}</small><small className="metric-trend">{trend} <span>vs last period</span></small></div></div><div className={`sparkline ${tone}`}><i /><i /><i /><i /><i /></div></div>)}</div>
    <div className="ai-strip"><div className="ai-strip-icon"><BrainCircuit size={21} /></div><div><p className="section-eyebrow">AI Aquaculture Insights · Prototype</p><h3>Health score is strong across the network</h3><p>Water conditions are currently stable. Dissolved oxygen has decreased slightly during the last 6 hours. Continue monitoring and increase aeration if the trend continues.</p></div><div className="ai-strip-stats"><span><strong>92/100</strong><small>AI health score</small></span><span><strong>12%</strong><small>Fish stress risk</small></span><span><strong>8%</strong><small>Disease risk</small></span></div></div>
  </>;
}

function Ponds({ records, filters, setFilters, navigate }) { return <><PageIntro eyebrow="Pond operations" title="Pond management" text="See stock, health, water quality, and the latest observation for every pond." action={<button className="primary-button" onClick={() => navigate('add')}><Plus size={17} /> Add observation</button>} /><div className="pond-grid">{demoPonds.map((pond) => <article className="pond-card" key={pond.id}><div className="pond-card-top"><div className="pond-symbol"><Droplets size={19} /></div><StatusBadge status={pond.status} /></div><p className="section-eyebrow">{pond.id} · {pond.area}</p><h3>{pond.name}</h3><p className="pond-species">{pond.species} <span>·</span> {pond.population.toLocaleString()} fish</p><div className="pond-scores"><span><small>Water quality</small><strong>{pond.quality}<em>/100</em></strong></span><span><small>Fish health</small><strong>{pond.health}<em>/100</em></strong></span></div><button className="pond-detail" onClick={() => navigate('monitoring')}>View observations <ArrowUpRight size={15} /></button></article>)}</div><div className="filter-bar"><div className="filter-control"><label htmlFor="pond-filter">Pond</label><select id="pond-filter" value={filters.pond} onChange={(e) => setFilters({ ...filters, pond: e.target.value })}><option>All ponds</option><option>Pond 1</option><option>Pond 2</option><option>Pond 3</option><option>Pond 4</option></select></div><div className="filter-control"><label htmlFor="date-filter">Date</label><input id="date-filter" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} /></div><button className="reset-button" onClick={() => setFilters({ pond: 'All ponds', date: '' })}><RefreshCw size={15} /> Reset filters</button><span className="result-count">{records.length} observations</span></div><section className="panel table-panel"><div className="panel-heading"><div><p className="section-eyebrow">Observation log</p><h3>Water quality records</h3></div><span className="table-note"><Info size={14} /> Demo / Sample Data</span></div>{records.length ? <PondTable records={records} /> : <EmptyState icon={CalendarDays} title="No observations found" text="Try changing your filters or add a new pond observation." />}</section></>; }

function QualityCard({ metric }) { const Icon = metric.icon; return <div className="quality-card"><div className={`quality-icon ${metric.tone}`}><Icon size={18} /></div><div className="quality-content"><span>{metric.label}</span><strong>{metric.value}<em>{metric.unit}</em></strong><div><small className={metric.status === 'Warning' ? 'warning-text' : 'success-text'}>{metric.status}</small><small className="metric-trend">{metric.trend}</small></div></div><small className="safe-range">Safe {metric.range}</small><div className={`quality-spark ${metric.tone}`}><i /><i /><i /><i /><i /><i /></div></div>; }

function WaterQuality() { const [range, setRange] = useState('24 Hours'); return <><PageIntro eyebrow="Sensor intelligence" title="Water quality" text="Monitor the parameters that keep every pond productive and resilient." action={<span className="simulation-label"><CircleDot size={13} /> DEMO SENSOR DATA</span>} /><div className="quality-grid">{demoQuality.map((metric) => <QualityCard metric={metric} key={metric.label} />)}</div><section className="panel water-chart-panel"><div className="panel-heading"><div><p className="section-eyebrow">Multi-parameter trend</p><h3>Water quality movement</h3></div><div className="range-tabs">{['1 Hour', '6 Hours', '24 Hours', '7 Days', '30 Days'].map((item) => <button className={range === item ? 'active' : ''} onClick={() => setRange(item)} key={item}>{item}</button>)}</div></div><div className="water-chart"><div className="chart-legend"><span><i className="legend-teal" /> pH</span><span><i className="legend-blue" /> Oxygen</span><span><i className="legend-orange" /> Temperature</span></div><ResponsiveContainer width="100%" height={280}><LineChart data={[{ time: '06:00', pH: 7.1, oxygen: 6.1, temp: 26.8 }, { time: '09:00', pH: 7.3, oxygen: 6.0, temp: 27.1 }, { time: '12:00', pH: 7.4, oxygen: 5.8, temp: 27.4 }, { time: '15:00', pH: 7.6, oxygen: 5.6, temp: 27.8 }, { time: '18:00', pH: 7.4, oxygen: 5.8, temp: 27.2 }]}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="time" tick={{ fontSize: 12 }} /><YAxis yAxisId="left" domain={[5, 9]} tick={{ fontSize: 12 }} /><YAxis yAxisId="right" orientation="right" domain={[0, 35]} tick={{ fontSize: 12 }} /><Tooltip /><Line yAxisId="left" type="monotone" dataKey="pH" stroke="#0b7285" strokeWidth={3} dot={{ r: 4 }} /><Line yAxisId="left" type="monotone" dataKey="oxygen" stroke="#3c7ea3" strokeWidth={2} dot={false} /><Line yAxisId="right" type="monotone" dataKey="temp" stroke="#d9823b" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></section></>; }

function FishHealth({ ponds }) { return <><PageIntro eyebrow="Stock intelligence" title="Fish health" text="A demo health view combining condition, growth, stress, and mortality signals." action={<span className="simulation-label"><CircleDot size={13} /> DEMO MODEL OUTPUT</span>} /><div className="health-summary"><div className="health-score-ring"><strong>89</strong><span>/100</span><small>Network health</small></div><div className="health-facts"><div><span>Growth rate</span><strong>+8.4% <small>vs last cycle</small></strong></div><div><span>Mortality rate</span><strong>0.82% <small className="success-text">Within target</small></strong></div><div><span>Disease risk</span><strong>8% <small className="success-text">Low risk</small></strong></div><div><span>Stress level</span><strong>12% <small className="success-text">Low stress</small></strong></div></div></div><section className="panel health-panel"><div className="panel-heading"><div><p className="section-eyebrow">Pond-by-pond view</p><h3>Fish health status</h3></div><HeartPulse size={21} className="heading-icon" /></div><div className="health-list">{ponds.map((pond) => <div className="health-row" key={pond.id}><div className="pond-symbol"><Fish size={17} /></div><div className="health-name"><strong>{pond.name}</strong><small>{pond.species} · {pond.population.toLocaleString()} fish</small></div><div className="health-bar"><span style={{ width: `${pond.health}%` }} /></div><strong>{pond.health}<small>/100</small></strong><StatusBadge status={pond.status} /></div>)}</div></section></>; }

function AIInsights({ stats, latest, risk }) { return <><PageIntro eyebrow="Decision support" title="AI Aquaculture Insights" text="Transparent, explainable prototype signals built from the available demo data." action={<span className="simulation-label"><Bot size={14} /> RULE-BASED DEMO</span>} /><div className="ai-hero"><div className="ai-orb"><BrainCircuit size={34} /></div><div><p className="section-eyebrow">AI health score</p><h2>92<span>/100</span></h2><p>Overall conditions are stable across the monitored pond network.</p></div><div className="ai-risk-grid"><span><small>Water quality risk</small><strong className="success-text">LOW</strong></span><span><small>Fish stress risk</small><strong>12%</strong></span><span><small>Disease risk</small><strong>8%</strong></span></div></div><div className="insight-grid"><section className="panel"><div className="panel-heading"><div><p className="section-eyebrow">Recommendation</p><h3>What the model sees</h3></div><Lightbulb size={21} className="heading-icon" /></div><p className="insight-copy">Water conditions are currently stable. Dissolved oxygen has decreased slightly during the last 6 hours. Continue monitoring and increase aeration if the trend continues.</p><div className="insight-tags"><span><CheckCircle2 size={14} /> pH in range</span><span><CheckCircle2 size={14} /> Low mortality</span><span><AlertTriangle size={14} /> Oxygen trending down</span></div></section><section className="panel"><div className="panel-heading"><div><p className="section-eyebrow">Model inputs</p><h3>Explainable signals</h3></div><LockKeyhole size={19} className="heading-icon" /></div><div className="input-list"><span>Average pH <strong>{stats.avgPh.toFixed(1)}</strong></span><span>Latest pH <strong>{latest.ph.toFixed(1)}</strong></span><span>Current estimate <strong>{risk}</strong></span></div><p className="panel-footnote">This is a transparent demonstration, not a validated ML prediction or live sensor service.</p></section></div></>; }

function Alerts({ alerts, setAlerts }) { const updateAlert = (id, field) => setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, [field]: true } : alert)); return <><PageIntro eyebrow="Operations center" title="Alerts" text="Review abnormal readings and keep the response trail clear." action={<span className="alert-count"><Bell size={15} /> {alerts.filter((alert) => !alert.read).length} unread</span>} /><div className="alert-list">{alerts.map((alert) => <article className={`alert-card ${alert.type} ${alert.read ? 'read' : ''}`} key={alert.id}><div className="alert-icon">{alert.type === 'critical' ? <AlertTriangle size={19} /> : alert.type === 'sensor' ? <Cpu size={19} /> : alert.type === 'warning' ? <Bell size={19} /> : <Info size={19} />}</div><div className="alert-main"><div className="alert-title"><strong>{alert.parameter}</strong><span className={`alert-severity ${alert.type}`}>{alert.type === 'sensor' ? 'Sensor' : alert.type}</span></div><p>{alert.pond} · {alert.value} · Expected {alert.range}</p><small>{alert.time}</small></div><div className="alert-action"><p>{alert.action}</p><div><button onClick={() => updateAlert(alert.id, 'read')}>Mark as read</button><button onClick={() => updateAlert(alert.id, 'resolved')}>{alert.resolved ? 'Resolved' : 'Resolve'}</button></div></div></article>)}</div></>; }

function IoTDevices({ sensors }) { return <><PageIntro eyebrow="Connected infrastructure" title="IoT devices" text="A clear view of simulated sensor connectivity, battery, and freshness." action={<span className="simulation-label"><Cpu size={14} /> SIMULATION MODE</span>} /><div className="device-summary"><span><strong>{sensors.filter((sensor) => sensor.status === 'Connected').length}</strong><small>Connected devices</small></span><span><strong>{sensors.filter((sensor) => sensor.battery < 25).length}</strong><small>Needs attention</small></span><span><strong>2 min</strong><small>Last network update</small></span></div><section className="panel device-panel"><div className="panel-heading"><div><p className="section-eyebrow">Sensor registry</p><h3>Device health</h3></div><Zap size={21} className="heading-icon" /></div><div className="device-list">{sensors.map((sensor) => <div className="device-row" key={sensor.id}><div className={`device-status ${sensor.status === 'Connected' ? 'connected' : 'disconnected'}`}><Cpu size={18} /></div><div className="device-name"><strong>{sensor.id}</strong><small>{sensor.type} · {sensor.pond}</small></div><span className={`connection ${sensor.status === 'Connected' ? 'success-text' : 'warning-text'}`}><CircleDot size={12} /> {sensor.status}</span><span className="battery"><span style={{ width: `${sensor.battery}%` }} className={sensor.battery < 25 ? 'low' : ''} /> </span><small>{sensor.battery}%</small><span className="update-time">Updated {sensor.update}</span></div>)}</div><p className="panel-footnote"><Info size={14} /> Demo device statuses are placeholders for future IoT, backend, and real-time sensor integrations.</p></section></>; }

function Monitoring({ records, filters, setFilters, navigate }) { return <Ponds records={records} filters={filters} setFilters={setFilters} navigate={navigate} />; }

function AddData({ onSubmit }) { return <><PageIntro eyebrow="New observation" title="Add pond data" text="Record a field observation to update the monitoring log and analysis." /><div className="form-layout"><form className="panel data-form" onSubmit={onSubmit}><div className="panel-heading"><div><p className="section-eyebrow">Observation details</p><h3>Enter measurements</h3></div><Settings2 size={21} className="heading-icon" /></div><div className="form-grid"><label>Pond name<select name="pond" defaultValue="Pond 1" required><option>Pond 1</option><option>Pond 2</option><option>Pond 3</option><option>Pond 4</option></select></label><label>Date<input name="date" type="date" defaultValue="2026-08-28" required /></label><label>Water pH<input name="ph" type="number" min="0" max="14" step="0.1" placeholder="e.g. 7.4" required /></label><label>Fish population<input name="population" type="number" min="1" placeholder="e.g. 2400" required /></label><label>Number of fish deaths<input name="deaths" type="number" min="0" placeholder="e.g. 18" required /></label></div><div className="calculation-note"><Activity size={18} /><div><strong>Mortality rate is calculated automatically</strong><span>(Fish deaths / Fish population) x 100</span></div></div><button className="primary-button submit-button" type="submit"><Database size={17} /> Save observation</button></form><aside className="form-side"><div className="info-card"><div className="info-icon"><AlertTriangle size={20} /></div><h3>Smart water-quality alert</h3><p>New pH readings are checked against the recommended range of 6.5 - 8.5. Highly abnormal readings are marked critical for attention.</p></div><div className="info-card soft"><div className="info-icon"><CircleHelp size={20} /></div><h3>Good to know</h3><p>Use consistent dates and record the same type of measurements each time to make trends easier to interpret.</p></div></aside></div></>; }

function Analytics({ records, trendData, scatterData, correlation }) { const interpretation = Math.abs(correlation) < 0.3 ? 'weak' : Math.abs(correlation) < 0.7 ? 'moderate' : 'strong'; return <><PageIntro eyebrow="Data intelligence" title="Analytics & correlation" text="Explore how pH levels and fish mortality move together in the available sample." action={<span className="analysis-chip"><BarChart3 size={16} /> {records.length} data points</span>} /><div className="correlation-card"><div className="correlation-number">{correlation >= 0 ? '+' : ''}{correlation.toFixed(2)}</div><div><p className="section-eyebrow">Pearson correlation coefficient</p><h3>{interpretation.charAt(0).toUpperCase() + interpretation.slice(1)} {correlation < 0 ? 'inverse' : 'positive'} relationship</h3><p>The available sample shows a {interpretation} association between pH and mortality rate. This correlation does not prove that pH causes fish mortality.</p></div><div className="correlation-meter"><span style={{ left: `${((correlation + 1) / 2) * 100}%` }} /></div></div><div className="chart-grid"><ChartCard eyebrow="Relationship" title="pH level vs fish mortality"><ResponsiveContainer width="100%" height={245}><ScatterChart margin={{ top: 10, right: 18, bottom: 10, left: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis type="number" dataKey="ph" name="pH" domain={[5, 10]} tick={{ fontSize: 12 }} /><YAxis type="number" dataKey="rate" name="Mortality rate" unit="%" tick={{ fontSize: 12 }} /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><ReferenceLine x={6.5} stroke="#e6a532" strokeDasharray="4 4" /><ReferenceLine x={8.5} stroke="#e6a532" strokeDasharray="4 4" /><Scatter data={scatterData} fill="#0b7285" /></ScatterChart></ResponsiveContainer></ChartCard><ChartCard eyebrow="Time series" title="pH trend over time"><ResponsiveContainer width="100%" height={245}><LineChart data={trendData} margin={{ top: 10, right: 18, bottom: 10, left: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis domain={[5, 10]} tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="pH" stroke="#0b7285" strokeWidth={3} dot={{ r: 4, fill: '#0b7285' }} /></LineChart></ResponsiveContainer></ChartCard><ChartCard eyebrow="Time series" title="Fish mortality trend" className="wide-chart"><ResponsiveContainer width="100%" height={245}><BarChart data={trendData} margin={{ top: 10, right: 18, bottom: 10, left: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis unit="%" tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="mortality" radius={[5, 5, 0, 0]}>{trendData.map((entry, index) => <Cell key={index} fill={entry.mortality > 3 ? '#d95d39' : '#4aa3a2'} />)}</Bar></BarChart></ResponsiveContainer></ChartCard></div><p className="method-note"><Info size={15} /> Correlation indicates an association in the available sample data and does not by itself prove that pH causes fish mortality.</p></>; }

function Recommendations({ status, latest, risk, riskClass }) { const lists = { safe: ['Continue regular monitoring.', 'Maintain proper pond management.', 'Record pH regularly.'], warning: ['Recheck the pH measurement.', 'Observe fish behavior and feeding.', 'Check other water-quality conditions.', 'Consider consulting an aquaculture expert.'], critical: ['Recheck the measurement.', 'Assess overall pond water quality.', 'Monitor fish closely.', 'Seek technical or aquaculture guidance.'] }; return <><PageIntro eyebrow="Guidance" title="Recommendations" text="Practical next steps based on the current prototype status." action={<StatusBadge status={status} />} /><div className={`recommendation-hero ${status}`}><div className="rec-symbol">{status === 'safe' ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}</div><div><p className="section-eyebrow">Current guidance · Latest pH {latest.ph.toFixed(1)}</p><h2>{status === 'safe' ? 'Conditions look stable.' : status === 'warning' ? 'A closer look is recommended.' : 'Immediate assessment is recommended.'}</h2><p>{status === 'safe' ? 'Your latest sample sits inside the recommended pH range.' : status === 'warning' ? 'Water pH is outside the recommended range. Check pond water quality and consider appropriate corrective action.' : 'Critical pH condition detected. Immediate water-quality assessment is recommended.'}</p></div></div><div className="recommendation-grid"><section className="panel advice-panel"><div className="panel-heading"><div><p className="section-eyebrow">Suggested actions</p><h3>For this status</h3></div></div><ul className="advice-list">{lists[status].map((item) => <li key={item}><CheckCircle2 size={18} />{item}</li>)}</ul></section><section className="panel parameters-panel"><div className="panel-heading"><div><p className="section-eyebrow">Future expansion</p><h3>Recommended parameters</h3></div><Waves size={21} className="heading-icon" /></div><div className="parameter-list">{['pH', 'Temperature', 'Dissolved Oxygen', 'Ammonia', 'Turbidity'].map((item) => <span key={item}><Activity size={15} />{item}</span>)}</div><p>These are future monitoring possibilities, not real-time sensor readings in this prototype.</p></section></div><section className="panel risk-explain"><div className="risk-content"><div className={`risk-score ${riskClass}`}><span>{risk === 'Low Risk' ? '01' : risk === 'Medium Risk' ? '02' : '03'}</span><small>{risk}</small></div><div><p className="section-eyebrow">Prototype / Demonstration</p><h3>AI-based fish mortality risk</h3><p>This transparent rule-based estimate considers the latest pH status and historical mortality rate. It is not a validated scientific prediction model.</p></div></div></section></>; }

function About() { return <><PageIntro eyebrow="Project context" title="About the project" text="A community service prototype connecting field observations with accessible data insight." /><div className="about-layout"><section className="about-story"><div className="story-mark"><Waves size={34} /><Fish size={27} /></div><p className="section-eyebrow">Smart Aquaculture</p><h2>Water Quality & Fish Mortality Monitoring System</h2><p className="large-copy">A simple digital monitoring concept for understanding the relationship between water pH levels and fish mortality in aquaculture.</p><div className="project-facts"><div><span>CSP topic</span><strong>Correlation Between Water pH Levels and Fish Mortality Rate</strong></div><div><span>Location</span><strong>Nayudugudem Village, Eluru District, Andhra Pradesh</strong></div><div><span>Department</span><strong>Artificial Intelligence & Data Science</strong></div></div></section><section className="panel purpose-panel"><div className="panel-heading"><div><p className="section-eyebrow">Why it matters</p><h3>Project purpose</h3></div><Sparkles size={21} className="heading-icon" /></div><p>To demonstrate how digital monitoring and data analysis can help understand water-quality conditions and fish mortality in aquaculture.</p><div className="purpose-flow"><span>Observe</span><span>Measure</span><span>Understand</span></div></section></div><section className="panel future-panel"><div className="panel-heading"><div><p className="section-eyebrow">Beyond this prototype</p><h3>Future scope</h3></div><ArrowUpRight size={21} className="heading-icon" /></div><div className="future-grid">{['IoT-based pH sensors', 'Temperature sensors', 'Dissolved oxygen sensors', 'Cloud monitoring', 'Mobile alerts', 'AI/ML-based risk analysis', 'Automated water-quality monitoring'].map((item) => <div key={item}><CheckCircle2 size={17} />{item}</div>)}</div></section></>; }

export default App;
