import { useMemo, useState, type CSSProperties } from "react";
import {
  Activity, ArrowRight, Bell, CalendarDays, ChevronDown, CloudUpload, FileText,
  Gauge, LayoutDashboard, LockKeyhole, LogOut, Mail, Menu, Moon, Play, Search,
  Settings, Share2, Sparkles, Trophy, Upload, Users, Video, Wind, X, Zap
} from "lucide-react";
import NavFlowBrand from "./components/NavFlowBrand";
import NavFlowAIAnalyzer from "./components/video/NavFlowAIAnalyzer";

const nav = [
  [LayoutDashboard, "Tableau de bord"], [Video, "Analyses"], [Play, "Vidéos"],
  [Users, "Athlètes"], [Activity, "Progression"], [Trophy, "Compétitions"],
  [Gauge, "Comparaisons"], [Zap, "Exercices"], [CalendarDays, "Calendrier"],
  [FileText, "Rapports"], [Sparkles, "IA Coach"],
] as const;

type Analysis = { name: string; boat: string; score: number; date: string };
const initialAnalyses: Analysis[] = [
  { name: "Virement de bord", boat: "ILCA 7", score: 89, date: "Aujourd’hui" },
  { name: "Départ", boat: "Optimist", score: 82, date: "Hier" },
  { name: "Empannage", boat: "ILCA 6", score: 91, date: "18/07/2026" },
  { name: "Près", boat: "ILCA 7", score: 84, date: "15/07/2026" },
  { name: "Vent arrière", boat: "ILCA 7", score: 78, date: "14/07/2026" },
];

const stats = [
  [Video, "Analyses réalisées", "148", "+18% cette semaine", "blue"],
  [Gauge, "Score technique moyen", "87/100", "Excellent", "green"],
  [Activity, "Temps analysé", "32 h", "+5.6 h cette semaine", "violet"],
  [Users, "Athlètes suivis", "26", "+3 nouveaux", "orange"],
  [Upload, "Vidéos importées", "214", "+24 cette semaine", "cyan"],
  [Sparkles, "Progression IA", "+12%", "Ce mois-ci", "teal"],
] as const;

function ScoreRing({ score = 88 }: { score?: number }) {
  return <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as CSSProperties}><div><b>{score}</b><span>/100</span></div></div>;
}

function LineChart() {
  const points = "0,118 40,88 80,76 120,50 160,67 200,44 240,74 280,49 320,38 360,48 400,34 440,21";
  return <svg viewBox="0 0 440 140" className="chart">{[20,60,100,140].map(y=><line key={y} x1="0" x2="440" y1={y} y2={y}/>)}<polyline className="chart-fill" points={`0,140 ${points} 440,140`}/><polyline className="chart-line" points={points}/>{points.split(" ").map((p,i)=>{const[x,y]=p.split(",");return <circle key={i} cx={x} cy={y} r="4"/>})}</svg>;
}

function Landing({ onLogin }: { onLogin: () => void }) {
  return <div className="landing">
    <header className="landing-nav"><NavFlowBrand/><div><button className="text-button" onClick={onLogin}>Se connecter</button><button className="landing-cta" onClick={onLogin}>Commencer <ArrowRight/></button></div></header>
    <section className="hero"><div className="hero-copy"><span className="eyebrow"><Sparkles/> L’IA au service de la performance nautique</span><h1>Analysez chaque mouvement.<br/><em>Naviguez plus vite.</em></h1><p>Nav Flow AI transforme vos vidéos de voile en données techniques claires : posture, stabilité, vitesse et recommandations personnalisées.</p><div className="hero-actions"><button className="landing-cta" onClick={onLogin}>Analyser une vidéo <ArrowRight/></button><button className="outline-button" onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}><Play/> Découvrir la plateforme</button></div><div className="hero-proof"><b>148+</b><span>analyses réalisées</span><b>87/100</b><span>score moyen</span><b>26</b><span>athlètes suivis</span></div></div><div className="hero-visual"><img src="/sailing/laser.jpg" alt="Voilier ILCA analysé par Nav Flow AI"/><div className="floating-score"><ScoreRing score={92}/><span>Performance globale</span></div><div className="floating-data"><Wind/><span><b>18 nds</b> Vent moyen</span></div></div></section>
    <section id="features" className="feature-section"><span className="eyebrow">PLATEFORME COMPLÈTE</span><h2>Tout ce qu’il faut pour progresser</h2><div>{[[Video,"Analyse vidéo IA","Détection de posture et lecture image par image."],[Activity,"Mesures techniques","Stabilité, angles du corps, vitesse et VMG."],[Sparkles,"Coach intelligent","Conseils personnalisés après chaque session."],[Gauge,"Suivi de progression","Comparez vos performances dans le temps."]].map(([Icon,title,text])=><article key={String(title)}><span><Icon/></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <footer className="landing-footer"><NavFlowBrand compact/><span>© 2026 Nav Flow AI · Créé au Maroc pour les navigateurs.</span></footer>
  </div>;
}

function Login({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  const [showError,setShowError]=useState(false);
  return <div className="login-page"><div className="login-photo"><img src="/sailing/catamaran.jpg" alt="Équipe de voile"/><button onClick={onBack}>← Retour à l’accueil</button><div><NavFlowBrand/><h2>Votre prochaine progression commence ici.</h2><p>Analyse technique et coaching vidéo dans une seule plateforme.</p></div></div><form className="login-card" onSubmit={e=>{e.preventDefault();setShowError(false);onSubmit()}}><NavFlowBrand compact/><span className="eyebrow">ESPACE COACH</span><h1>Content de vous revoir</h1><p>Connectez-vous à votre espace Nav Flow AI.</p><label>Adresse e-mail<div><Mail/><input type="email" required placeholder="coach@navflow.ai"/></div></label><label>Mot de passe<div><LockKeyhole/><input type="password" required minLength={4} placeholder="••••••••"/></div></label>{showError&&<small>Veuillez vérifier vos informations.</small>}<button className="login-submit" type="submit">Se connecter <ArrowRight/></button><button className="demo-login" type="button" onClick={onSubmit}>Accéder au compte de démonstration</button></form></div>;
}

function Dashboard({ analyses, query, onOpenAnalysis }: { analyses: Analysis[]; query: string; onOpenAnalysis: () => void }) {
  const filtered=useMemo(()=>analyses.filter(a=>`${a.name} ${a.boat}`.toLowerCase().includes(query.toLowerCase())),[analyses,query]);
  return <><section className="stats-grid">{stats.map(([Icon,label,value,note,color])=><article className="stat-card" key={label}><span className={`stat-icon ${color}`}><Icon/></span><div><small>{label}</small><strong>{value}</strong><em>{note}</em></div></article>)}</section><section className="dashboard-grid">
    <article className="panel performance"><div className="panel-title"><h2>Évolution des scores</h2><button>6 derniers mois <ChevronDown/></button></div><LineChart/><div className="months"><span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span></div></article>
    <article className="panel distribution"><h2>Répartition des analyses</h2><div className="donut-row"><div className="donut"/><ul><li>Virement <b>28%</b></li><li>Empannage <b>20%</b></li><li>Départ <b>18%</b></li><li>Vent arrière <b>12%</b></li><li>Près <b>10%</b></li></ul></div></article>
    <article className="panel heatmap"><h2>Heatmap Performance</h2><div className="heat-table"><div/><span>Technique</span><span>Vitesse</span><span>Équilibre</span><span>Transitions</span><span>VMG</span>{["Virement","Empannage","Départ","Vent arrière","Près","Portant"].flatMap((r,ri)=>[<b key={r}>{r}</b>,...[0,1,2,3,4].map((_,i)=><i key={`${r}${i}`} className={`h${(ri+i)%5}`}/>)])}</div></article>
    <article className="panel global-score"><h2>Score technique global</h2><ScoreRing/><strong>Excellent</strong><div className="stars">★★★★★</div><ul><li>Technique <b>90/100</b></li><li>Équilibre <b>85/100</b></li><li>Vitesse <b>82/100</b></li><li>VMG <b>87/100</b></li></ul></article>
    <article className="panel recent"><div className="panel-title"><h2>Dernières analyses</h2><button onClick={onOpenAnalysis}>Voir tout ›</button></div>{filtered.map((a,i)=><div className="analysis-row" key={`${a.name}-${i}`}><img src={i%2?"/sailing/catamaran.jpg":"/sailing/laser.jpg"}/><div><strong>{a.name}</strong><small>{a.boat}</small></div><b>{a.score}</b><span>{a.date}</span><button onClick={onOpenAnalysis}>Voir</button></div>)}</article>
    <article className="panel video-card"><h2>Dernière vidéo analysée</h2><div className="video-stage"><img src="/sailing/laser.jpg" alt="Navigation en ILCA 7"/><button onClick={onOpenAnalysis}><Play fill="currentColor"/></button><div className="video-progress"><span/></div></div><div className="video-meta"><div><h3>Virement · ILCA 7</h3><p>23/07/2026 · Rabat, Maroc</p></div><ScoreRing score={88}/></div><button className="report" onClick={onOpenAnalysis}>Voir le rapport</button></article>
    <article className="panel weather"><h2>Conditions météo</h2><div className="weather-grid"><div><Wind/><b>18<small> nds</small></b><span>Vent NNO</span></div><div><Activity/><b>0.8<small> m</small></b><span>Houle</span></div><div><Gauge/><b>24<small>°C</small></b><span>Température</span></div><div><Share2/><b>0.5<small> nds</small></b><span>Courant</span></div></div></article>
    <article className="panel goals"><h2>Objectifs hebdomadaires</h2>{[["Réaliser 5 analyses",100],["Analyser 10 virements",60],["Analyser 20 départs",100],["VMG moyenne > 5.8 nds",82],["Score moyen > 90",87]].map(([l,n])=><div className="goal" key={String(l)}><div><span>{l}</span><b>{n}%</b></div><i><em style={{width:`${n}%`}}/></i></div>)}</article>
  </section></>;
}

function AnalysesPage({ analyses, onCreated }: { analyses: Analysis[]; onCreated: (a: Analysis) => void }) {
  const [showAnalyzer,setShowAnalyzer]=useState(false);
  return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">VISION ARTIFICIELLE</span><h1>Analyses vidéo</h1><p>Importez une vidéo, lancez l’analyse et consultez les résultats techniques.</p></div><button className="primary-page-button" onClick={()=>setShowAnalyzer(true)}><CloudUpload/>Nouvelle analyse</button></div>{showAnalyzer&&<div className="analyzer-wrap"><NavFlowAIAnalyzer sessionId={`analysis-${Date.now()}`}/><button className="save-analysis" onClick={()=>{onCreated({name:"Nouvelle analyse IA",boat:"ILCA / Laser",score:88,date:"À l’instant"});setShowAnalyzer(false)}}>Enregistrer dans mes analyses</button></div>}<div className="analysis-library">{analyses.map((a,i)=><article key={`${a.name}-${i}`}><img src={i%2?"/sailing/catamaran.jpg":"/sailing/laser.jpg"}/><div><span>{a.boat}</span><h3>{a.name}</h3><p>{a.date}</p></div><ScoreRing score={a.score}/><button onClick={()=>setShowAnalyzer(true)}><Play/>Ouvrir</button></article>)}</div></div>;
}

function SectionPage({ title }: { title: string }) {
  const content: Record<string,[string,string,string][]>={"Vidéos":[["Bibliothèque vidéo","214 vidéos disponibles","Gérez vos imports et vos enregistrements."],["Derniers imports","24 cette semaine","Les vidéos sont prêtes pour l’analyse."],["Stockage","38% utilisé","Vos médias restent organisés par session."]],"Athlètes":[["Athlètes actifs","26 profils","Suivez chaque navigateur individuellement."],["Progression moyenne","+12%","Évolution sur les 30 derniers jours."],["Clubs","3 équipes","CNPR Rabat, YCR et CNR."]],"Progression":[["Score actuel","87/100","Votre meilleur résultat cette saison."],["Gain mensuel","+12%","Progression régulière et mesurable."],["Objectif","90/100","Plus que trois points à gagner."]],"IA Coach":[["Conseil du jour","Travaillez la transition","Gardez le regard loin pendant le virement."],["Point fort","Stabilité","Votre contrôle de coque progresse."],["Priorité","Ouverture des épaules","Réduisez la tension durant la rotation."]]};
  const cards=content[title]??[["Module disponible",title,"Cette section est prête pour vos prochaines données."],["Synchronisation","Active","Les données Nav Flow sont à jour."],["Prochaine étape","Nouvelle analyse","Importez une vidéo pour enrichir cette page."]];
  return <div className="content-page"><div className="page-heading"><div><span className="eyebrow">NAV FLOW AI</span><h1>{title}</h1><p>Consultez et gérez toutes les informations de ce module.</p></div></div><div className="module-grid">{cards.map(([k,v,d],i)=><article key={k}><span className={`stat-icon ${["blue","green","violet"][i]}`}><Activity/></span><small>{k}</small><h2>{v}</h2><p>{d}</p><button>Consulter <ArrowRight/></button></article>)}</div></div>;
}

export default function App(){
  const [screen,setScreen]=useState<"landing"|"login"|"app">("landing"); const[active,setActive]=useState("Tableau de bord"); const[menuOpen,setMenuOpen]=useState(false); const[query,setQuery]=useState(""); const[analyses,setAnalyses]=useState(initialAnalyses);
  if(screen==="landing")return <Landing onLogin={()=>setScreen("login")}/>; if(screen==="login")return <Login onBack={()=>setScreen("landing")} onSubmit={()=>setScreen("app")}/>;
  const openAnalyses=()=>setActive("Analyses");
  return <div className="app-shell"><aside className={`sidebar ${menuOpen?"open":""}`}><button className="close-mobile" onClick={()=>setMenuOpen(false)}><X/></button><NavFlowBrand className="brand"/><nav>{nav.map(([Icon,label])=><button key={label} className={active===label?"active":""} onClick={()=>{setActive(label);setMenuOpen(false)}}><Icon/><span>{label}</span>{label==="IA Coach"&&<em>NOUVEAU</em>}</button>)}</nav><button className="logout" onClick={()=>setScreen("landing")}><LogOut/>Déconnexion</button><div className="sidebar-footer"><img src="/sailing/laser.jpg" alt=""/><div><strong>NAV FLOW <i>AI</i></strong><small>Version 2.1.0</small><small>© 2026 Tous droits réservés</small></div></div></aside><main><header><button className="menu-mobile" onClick={()=>setMenuOpen(true)}><Menu/></button><label className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher une analyse, un athlète, une vidéo..."/></label><div className="header-actions"><button><Bell/><b>3</b></button><button><Moon/></button><button onClick={()=>setActive("Paramètres")}><Settings/></button><span className="avatar">M</span><div className="profile"><strong>Mouad</strong><small>Coach</small></div><ChevronDown/></div></header><section className="topbar"><div><h1>{active}</h1><p>Bonjour Mouad, votre espace de performance est prêt.</p></div><div className="filters"><button><span>Club<small>CNPR Rabat</small></span><ChevronDown/></button><button><span>Rôle<small>Coach</small></span><ChevronDown/></button></div><div className="primary-actions"><button onClick={openAnalyses}><CloudUpload/>Importer vidéo</button><button className="primary" onClick={openAnalyses}>＋ Nouvelle analyse</button><button className="live" onClick={openAnalyses}><Video/>Analyse en direct</button></div></section>{active==="Tableau de bord"?<Dashboard analyses={analyses} query={query} onOpenAnalysis={openAnalyses}/>:active==="Analyses"?<AnalysesPage analyses={analyses} onCreated={a=>setAnalyses(x=>[a,...x])}/>:<SectionPage title={active}/>}</main></div>;
}
