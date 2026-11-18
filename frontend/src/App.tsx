import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Box, Check, ChevronDown, CircleHelp,
  Cloud, Cpu, Database, Ellipsis, ExternalLink, Gauge, HardDrive, Layers3,
  LifeBuoy, Menu, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, SquareTerminal,
  Terminal, Wifi, X,
} from 'lucide-react'

type Container = { id: string; name: string; image: string; status: 'Running' | 'Stopped'; cpu: string; memory: string; port: string; tone: string }
const initialContainers: Container[] = [
  { id: 'a7f3c2', name: 'api-gateway', image: 'dockerpilot/api:2.4.1', status: 'Running', cpu: '2.4%', memory: '312 MB', port: '8080:8080', tone: 'mint' },
  { id: 'b91e04', name: 'postgres-main', image: 'postgres:16-alpine', status: 'Running', cpu: '0.8%', memory: '1.2 GB', port: '5432:5432', tone: 'blue' },
  { id: 'c42d8a', name: 'redis-cache', image: 'redis:7.2-alpine', status: 'Running', cpu: '0.3%', memory: '86 MB', port: '6379:6379', tone: 'coral' },
  { id: 'e05b71', name: 'worker-queue', image: 'dockerpilot/worker:1.8.0', status: 'Stopped', cpu: '—', memory: '—', port: '—', tone: 'violet' },
]
const navItems = [
  { label: 'Overview', icon: Gauge }, { label: 'Containers', icon: Box, badge: '8' },
  { label: 'Images', icon: Layers3 }, { label: 'Volumes', icon: HardDrive }, { label: 'Networks', icon: Wifi },
]
const initialLogs = [
  ['10:42:18', 'INFO', 'GET /api/health 200 · 4ms'],
  ['10:42:16', 'INFO', 'Connection pool ready · 12 clients'],
  ['10:41:52', 'WARN', 'Rate limit approaching for 10.0.2.14'],
  ['10:41:30', 'INFO', 'Worker heartbeat received · queue: default'],
]

function App() {
  const [containers, setContainers] = useState(initialContainers)
  const [activeNav, setActiveNav] = useState('Overview')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [showAllLogs, setShowAllLogs] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const filteredContainers = useMemo(() => containers.filter((container) => `${container.name} ${container.image}`.toLowerCase().includes(query.toLowerCase())), [containers, query])

  function toggleContainer(id: string) {
    setContainers((current) => current.map((container) => container.id === id ? { ...container, status: container.status === 'Running' ? 'Stopped' : 'Running' } : container))
  }
  function toast(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span /><span /><span /></div><span>docker<span className="brand-light">pilot</span></span><button className="mobile-close icon-button" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18} /></button></div>
      <button className="workspace-switch"><div className="workspace-avatar">A</div><div className="workspace-copy"><strong>Acme Studio</strong><span>Pro workspace</span></div><ChevronDown size={15} /></button>
      <div className="nav-label">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">{navItems.map(({ label, icon: Icon, badge }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => { setActiveNav(label); setMobileMenu(false) }}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</button>)}</nav>
      <div className="nav-label project-label">PROJECTS <button aria-label="Add project" onClick={() => toast('Project creation is coming soon')}><Plus size={15} /></button></div>
      <button className="project-link selected"><span className="project-dot" /> production-api</button>
      <button className="project-link"><span className="project-dot violet-dot" /> staging</button>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Cloud size={16} /></div><strong>Need more power?</strong><p>Scale up your workspace to unlock more resources.</p><button onClick={() => toast('Plan options are coming soon')}>Explore plans <ArrowUpRight size={13} /></button></div>
        <button className="nav-item muted-item" onClick={() => toast('Documentation is coming soon')}><CircleHelp size={17} /><span>Help & support</span><ExternalLink size={13} className="external" /></button>
        <button className="profile-row"><div className="profile-avatar">JD</div><div className="profile-copy"><strong>Jordan Davis</strong><span>jordan@acme.io</span></div><MoreHorizontal size={18} /></button>
      </div>
    </aside>
    {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}
    <main className="main-area">
      <header className="topbar"><button className="icon-button menu-toggle" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu size={19} /></button><div className="breadcrumbs"><span>Projects</span><span className="crumb-slash">/</span><strong>production-api</strong><span className="env-pill"><span /> Production</span></div><div className="top-actions"><button className="search-trigger" onClick={() => document.getElementById('container-search')?.focus()}><Search size={15} /><span>Search anything...</span><kbd>⌘ K</kbd></button><button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast('You’re all caught up')}><Bell size={17} /><i /></button><div className="top-divider" /><div className="region"><span className="region-flag">🇺🇸</span><span>us-east-1</span><ChevronDown size={13} /></div></div></header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> SYSTEMS OPERATIONAL</div><h1>{activeNav === 'Overview' ? 'Good morning, Jordan' : activeNav}</h1><p className="page-subtitle">Here’s what’s happening with your infrastructure today.</p></div><div className="welcome-actions"><span className="last-sync"><span className="sync-dot" /> Synced just now</span><button className="primary-button" onClick={() => toast('New container setup is coming soon')}><Plus size={16} /> New container</button></div></section>

        <section className="metrics-grid" aria-label="Infrastructure metrics">
          <article className="metric-card"><div className="metric-top"><span>CPU USAGE</span><div className="metric-icon mint-icon"><Cpu size={16} /></div></div><div className="metric-value">24.8<span>%</span></div><div className="metric-foot"><span className="trend positive"><ArrowDownRight size={13} /> 3.2%</span><span>vs last hour</span><div className="sparkline mint-spark"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div></article>
          <article className="metric-card"><div className="metric-top"><span>MEMORY</span><div className="metric-icon blue-icon"><Database size={16} /></div></div><div className="metric-value">3.42<span className="unit">GB</span></div><div className="metric-foot"><span className="trend neutral"><ArrowUpRight size={13} /> 0.8%</span><span>of 8 GB allocated</span><div className="sparkline blue-spark"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div></article>
          <article className="metric-card"><div className="metric-top"><span>CONTAINERS</span><div className="metric-icon violet-icon"><Box size={16} /></div></div><div className="metric-value">{containers.filter((item) => item.status === 'Running').length}<span className="unit">/ {containers.length}</span></div><div className="metric-foot"><span className="status-indicator"><i /> {containers.filter((item) => item.status === 'Running').length} running</span><span>across 2 projects</span><div className="mini-bars"><i /><i /><i /><i /><i /><i /></div></div></article>
          <article className="metric-card"><div className="metric-top"><span>NETWORK I/O</span><div className="metric-icon amber-icon"><Activity size={16} /></div></div><div className="metric-value">18.6<span className="unit">MB/s</span></div><div className="metric-foot"><span className="trend positive"><ArrowDownRight size={13} /> 12.4%</span><span>steady traffic</span><div className="network-visual"><svg viewBox="0 0 92 24" preserveAspectRatio="none" aria-label="Network usage trend"><path d="M1 18 C8 17 8 12 16 14 S24 19 31 15 39 7 46 11 55 16 61 12 69 8 75 10 84 4 91 6" /></svg></div></div></article>
        </section>

        <section className="content-grid"><article className="panel containers-panel"><div className="panel-heading"><div><div className="heading-title"><h2>Containers</h2><span className="count-pill">{containers.length}</span></div><p>Your running services and workloads</p></div><button className="subtle-button" onClick={() => setActiveNav('Containers')}>View all <ArrowUpRight size={14} /></button></div><div className="table-toolbar"><label className="table-search"><Search size={14} /><input id="container-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter containers..." /></label><button className="filter-button" aria-label="Container filters" onClick={() => toast('All containers are shown')}><Settings2 size={15} /></button></div><div className="table-scroll"><table><thead><tr><th>NAME</th><th>STATUS</th><th>CPU</th><th>MEMORY</th><th>PORTS</th><th /></tr></thead><tbody>{filteredContainers.map((container) => <tr key={container.id}><td><div className="container-name"><div className={`container-symbol ${container.tone}`}><Box size={15} /></div><div><strong>{container.name}</strong><span>{container.image}</span></div></div></td><td><span className={`container-status ${container.status === 'Running' ? 'is-running' : 'is-stopped'}`}><i />{container.status}</span></td><td className="mono-cell">{container.cpu}</td><td className="mono-cell">{container.memory}</td><td><span className="port-chip">{container.port}</span></td><td><button className="row-menu" aria-label={`${container.status === 'Running' ? 'Stop' : 'Start'} ${container.name}`} onClick={() => { toggleContainer(container.id); toast(`${container.name} ${container.status === 'Running' ? 'stopped' : 'started'}`) }}>{container.status === 'Running' ? <SquareTerminal size={16} /> : <Activity size={16} />}</button></td></tr>)}{filteredContainers.length === 0 && <tr><td colSpan={6} className="empty-state">No containers match “{query}”.</td></tr>}</tbody></table></div><div className="panel-footer"><span>Showing {filteredContainers.length} of {containers.length} containers</span><button onClick={() => setActiveNav('Containers')}>Manage containers <ArrowUpRight size={13} /></button></div></article>

          <article className="panel health-panel"><div className="panel-heading"><div><div className="heading-title"><h2>System health</h2><span className="health-check"><Check size={11} /></span></div><p>All systems are looking good</p></div><button className="icon-button panel-more" aria-label="More health options" onClick={() => toast('System checks are up to date')}><Ellipsis size={18} /></button></div><div className="health-score"><div className="health-ring"><div><strong>98</strong><span>/ 100</span></div></div><div className="health-copy"><strong>Excellent</strong><span>Everything is running smoothly</span></div></div><div className="health-list"><div><span className="health-item-icon"><Cpu size={15} /></span><span>Compute</span><span className="health-ok">Normal <i /></span></div><div><span className="health-item-icon"><Database size={15} /></span><span>Database</span><span className="health-ok">Healthy <i /></span></div><div><span className="health-item-icon"><ShieldCheck size={15} /></span><span>Security</span><span className="health-ok">Protected <i /></span></div><div><span className="health-item-icon"><LifeBuoy size={15} /></span><span>Backups</span><span className="health-ok">Up to date <i /></span></div></div><button className="health-details" onClick={() => toast('All systems were checked a moment ago')}>View health report <ArrowUpRight size={14} /></button></article></section>

        <section className="bottom-grid"><article className="panel activity-panel"><div className="panel-heading"><div><div className="heading-title"><h2>Recent activity</h2></div><p>Updates from your infrastructure</p></div><button className="subtle-button" onClick={() => toast('Activity history is up to date')}>See activity <ArrowUpRight size={14} /></button></div><div className="activity-list"><div className="activity-item"><div className="activity-icon deploy"><ArrowUpRight size={14} /></div><div className="activity-copy"><strong>Deployment successful</strong><span>api-gateway <b>·</b> v2.4.1 deployed to production</span></div><time>12 min ago</time></div><div className="activity-item"><div className="activity-icon restart"><Activity size={14} /></div><div className="activity-copy"><strong>Container restarted</strong><span>worker-queue <b>·</b> Automatically restarted after health check</span></div><time>1 hr ago</time></div><div className="activity-item"><div className="activity-icon backup"><Database size={14} /></div><div className="activity-copy"><strong>Backup completed</strong><span>postgres-main <b>·</b> Snapshot saved successfully</span></div><time>3 hr ago</time></div></div></article><article className="panel logs-panel"><div className="panel-heading"><div><div className="heading-title"><h2>Live logs</h2><span className="live-label"><i /> LIVE</span></div><p>api-gateway · last 5 minutes</p></div><button className="icon-button panel-more" aria-label="Open logs" onClick={() => setShowAllLogs(!showAllLogs)}><ExternalLink size={15} /></button></div><div className="log-window">{(showAllLogs ? [...initialLogs, ['10:41:14', 'INFO', 'Cache warmup completed · 128 keys'], ['10:40:57', 'INFO', 'Listening on 0.0.0.0:8080']] : initialLogs).map(([time, level, text]) => <div className="log-line" key={time}><time>{time}</time><b className={level === 'WARN' ? 'warn' : ''}>{level}</b><span>{text}</span></div>)}</div><button className="logs-footer" onClick={() => setShowAllLogs(!showAllLogs)}><Terminal size={14} /> {showAllLogs ? 'Show recent logs' : 'Open log terminal'} <ArrowUpRight size={13} /></button></article></section>
        <footer className="page-footer"><span>DockerPilot <b>·</b> v1.12.0</span><span><span className="footer-status"><i /> All systems operational</span><span className="footer-sep">·</span> Status page <ExternalLink size={11} /></span></footer>
      </div>
    </main>
    {notice && <div className="toast" role="status"><span><Check size={14} /></span>{notice}</div>}
  </div>
}

export default App
