import { useMemo, useState, type CSSProperties } from "react";
import {
  Activity, Bell, CalendarDays, ChevronDown, CloudUpload, FileText,
  Gauge, LayoutDashboard, Menu, Moon, Play, Search, Settings, Share2,
  Sparkles, Trophy, Upload, Users, Video, Wind, X, Zap
} from "lucide-react";
import NavFlowBrand from "./components/NavFlowBrand";

const nav = [
  [LayoutDashboard, "Tableau de bord"],
  [Video, "Analyses"],
  [Play, "Vidéos"],
  [Users, "Athlètes"],
  [Activity, "Progression"],
  [Trophy, "Compétitions"],
  [Gauge, "Comparaisons"],
  [Zap, "Exercices"],
  [CalendarDays, "Calendrier"],
  [FileText, "Rapports"],
  [Sparkles, "IA Coach"],
] as const;

const analyses = [
  { name: "Virement de bord", boat: "ILCA 7", score: 89, date: "Aujourd’hui" },
  { name: "Départ", boat: "Optimist", score: 82, date: "Hier" },
  { name: "Empannage", boat: "ILCA 6", score: 91, date: "18/07/2026" },
  { name: "Près", boat: "ILCA 7", score: 84, date: "15/07/2026" },
  { name: "Vent arrière", boat: "ILCA 7", score: 78, date: "14/07/2026" },
];

const stats = [
  { icon: Video, label: "Analyses réalisées", value: "148", note: "+18% cette semaine", color: "blue" },
  { icon: Gauge, label: "Score technique moyen", value: "87/100", note: "Excellent", color: "green" },
  { icon: Activity, label: "Temps analysé", value: "32 h", note: "+5.6 h cette semaine", color: "violet" },
  { icon: Users, label: "Athlètes suivis", value: "26", note: "+3 nouveaux", color: "orange" },
  { icon: Upload, label: "Vidéos importées", value: "214", note: "+24 cette semaine", color: "cyan" },
  { icon: Sparkles, label: "Progression IA", value: "+12%", note: "Ce mois-ci", color: "teal" },
];

function LineChart() {
  const points = "0,118 40,88 80,76 120,50 160,67 200,44 240,74 280,49 320,38 360,48 400,34 440,21";
  return (
    <svg viewBox="0 0 440 140" className="chart">
      {[20, 60, 100, 140].map(y => <line key={y} x1="0" x2="440" y1={y} y2={y} />)}
      <polyline className="chart-fill" points={`0,140 ${points} 440,140`} />
      <polyline className="chart-line" points={points} />
      {points.split(" ").map((p, i) => { const [x,y] = p.split(","); return <circle key={i} cx={x} cy={y} r="4" /> })}
    </svg>
  );
}

function ScoreRing({ score = 88 }: { score?: number }) {
  return (
    <div className="score-ring" style={{"--score": `${score * 3.6}deg`} as CSSProperties}>
      <div><b>{score}</b><span>/100</span></div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("Tableau de bord");
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => analyses.filter(a => `${a.name} ${a.boat}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-mobile" onClick={() => setMenuOpen(false)}><X /></button>
        <NavFlowBrand className="brand" />
        <nav>
          {nav.map(([Icon, label]) => (
            <button key={label} className={active === label ? "active" : ""} onClick={() => {setActive(label); setMenuOpen(false)}}>
              <Icon /><span>{label}</span>{label === "IA Coach" && <em>NOUVEAU</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <img src="/sailing/laser.jpg" alt="" />
          <div><strong>NAV FLOW <i>AI</i></strong><small>Version 2.0.0</small><small>© 2026 Tous droits réservés</small></div>
        </div>
      </aside>

      <main>
        <header>
          <button className="menu-mobile" onClick={() => setMenuOpen(true)}><Menu /></button>
          <label className="search"><Search /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher une analyse, un athlète, une vidéo..." /></label>
          <div className="header-actions"><button><Bell /><b>3</b></button><button><Moon /></button><button><Settings /></button><span className="avatar">M</span><div className="profile"><strong>Mouad</strong><small>Coach</small></div><ChevronDown /></div>
        </header>

        <section className="topbar">
          <div><h1>Bonjour Mouad <span>👋</span></h1><p>Bienvenue sur votre tableau de bord.</p></div>
          <div className="filters">
            <button><span>Club<small>CNPR Rabat</small></span><ChevronDown /></button>
            <button><span>Rôle<small>Coach</small></span><ChevronDown /></button>
            <button><span>Date<small>23 Juillet 2026</small></span><CalendarDays /></button>
          </div>
          <div className="primary-actions">
            <button onClick={() => setUploadOpen(true)}><CloudUpload />Importer vidéo</button>
            <button className="primary"><span>＋</span>Nouvelle analyse</button>
            <button className="live"><Video />Analyse en direct</button>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map(({icon: Icon, ...s}) => <article className="stat-card" key={s.label}><span className={`stat-icon ${s.color}`}><Icon /></span><div><small>{s.label}</small><strong>{s.value}</strong><em>{s.note}</em></div></article>)}
        </section>

        <section className="dashboard-grid">
          <article className="panel performance"><div className="panel-title"><h2>Évolution des scores</h2><button>6 derniers mois <ChevronDown /></button></div><LineChart /><div className="months"><span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span></div></article>
          <article className="panel distribution"><h2>Répartition des analyses</h2><div className="donut-row"><div className="donut" /><ul><li>Virement <b>28%</b></li><li>Empannage <b>20%</b></li><li>Départ <b>18%</b></li><li>Vent arrière <b>12%</b></li><li>Près <b>10%</b></li></ul></div></article>
          <article className="panel heatmap"><h2>Heatmap Performance</h2><div className="heat-table"><div /><span>Technique</span><span>Vitesse</span><span>Équilibre</span><span>Transitions</span><span>VMG</span>{["Virement","Empannage","Départ","Vent arrière","Près","Portant"].flatMap((r, ri) => [<b key={r}>{r}</b>, ...[0,1,2,3,4].map((_,i)=><i key={`${r}${i}`} className={`h${(ri+i)%5}`} />)])}</div></article>
          <article className="panel global-score"><h2>Score technique global</h2><ScoreRing /><strong>Excellent</strong><div className="stars">★★★★★</div><ul><li>Technique <b>90/100</b></li><li>Équilibre <b>85/100</b></li><li>Vitesse <b>82/100</b></li><li>VMG <b>87/100</b></li></ul></article>

          <article className="panel recent"><div className="panel-title"><h2>Dernières analyses</h2><button>Voir tout ›</button></div>{filtered.map((a,i)=><div className="analysis-row" key={a.name}><img src={i % 2 ? "/sailing/catamaran.jpg" : "/sailing/laser.jpg"} /><div><strong>{a.name}</strong><small>{a.boat}</small></div><b>{a.score}</b><span>{a.date}</span><button>Voir</button></div>)}</article>
          <article className="panel video-card"><h2>Dernière vidéo analysée</h2><div className="video-stage"><img src="/sailing/laser.jpg" alt="Navigation en ILCA 7" /><button><Play fill="currentColor" /></button><div className="video-progress"><span /></div></div><div className="video-meta"><div><h3>Virement · ILCA 7</h3><p>23/07/2026 · Rabat, Maroc</p></div><ScoreRing score={88} /></div><button className="report">Voir le rapport</button></article>
          <article className="panel weather"><h2>Conditions météo</h2><div className="weather-grid"><div><Wind /><b>18<small> nds</small></b><span>Vent NNO</span></div><div><Activity /><b>0.8<small> m</small></b><span>Houle</span></div><div><Gauge /><b>24<small>°C</small></b><span>Température</span></div><div><Share2 /><b>0.5<small> nds</small></b><span>Courant</span></div></div></article>
          <article className="panel goals"><h2>Objectifs hebdomadaires</h2>{[["Réaliser 5 analyses",100],["Analyser 10 virements",60],["Analyser 20 départs",100],["VMG moyenne > 5.8 nds",82],["Score moyen > 90",87]].map(([l,n])=><div className="goal" key={String(l)}><div><span>{l}</span><b>{n}%</b></div><i><em style={{width:`${n}%`}} /></i></div>)}</article>
        </section>
      </main>

      {uploadOpen && <div className="modal-backdrop" onClick={() => setUploadOpen(false)}><div className="upload-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setUploadOpen(false)}><X /></button><span><CloudUpload /></span><h2>Importer une vidéo</h2><p>Glissez-déposez votre vidéo de navigation ou choisissez un fichier.</p><label><input type="file" accept="video/*" />Choisir un fichier</label><small>MP4, MOV ou AVI · 5 Go maximum</small></div></div>}
    </div>
  );
}
