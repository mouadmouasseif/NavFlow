import React, { useState } from 'react';
import { Database, Share2, Lock, Globe, Plus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SailingSession } from '../types';

interface DatabaseExplorerProps {
  sessions: SailingSession[];
  onSelectSession: (id: string) => void;
  selectedSessionId: string;
  onAddSessionSimulate: (data: { athlete: string; boatType: string; wind: string; location: string }) => void;
  comparisonSessionId: string | null;
  onSelectComparisonSession: (id: string | null) => void;
}

export default function DatabaseExplorer({
  sessions,
  onSelectSession,
  selectedSessionId,
  onAddSessionSimulate,
  comparisonSessionId,
  onSelectComparisonSession,
}: DatabaseExplorerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formAthlete, setFormAthlete] = useState("Mouad M.");
  const [formBoatType, setFormBoatType] = useState("Foiling Moth");
  const [formWind, setFormWind] = useState("16.0 kts");
  const [formLocation, setFormLocation] = useState("Dakhla Lagoon, Morocco");

  // Private vs Public settings mock storage
  const [isPublicMap, setIsPublicMap] = useState<Record<string, boolean>>({
    "session-001": true,
    "session-002": false,
  });

  const handleTogglePrivacy = (id: string) => {
    setIsPublicMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyLink = (id: string) => {
    const mockUrl = `${window.location.origin}/share/session-${id}`;
    navigator.clipboard.writeText(mockUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSessionSimulate({
      athlete: formAthlete,
      boatType: formBoatType,
      wind: formWind,
      location: formLocation
    });
    setFormAthlete("");
    setShowAddModal(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10" id="database-panel-explorer">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-medium text-lg text-white">Sailing Telemetry Database</h3>
            <p className="text-xs text-slate-400">PostgreSQL + Redis Cache Indexes</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-neon-green text-navy-950 hover:bg-neon-green/90 transition-all font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-neon-green/10"
        >
          <Plus className="w-4 h-4" />
          Simulate Video Process
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-neon-green/35 neon-glow-green text-white">
            <h4 className="font-display font-bold text-lg mb-4 text-neon-green">Ingest Sailing Video Pipeline</h4>
            <form onSubmit={handleSubmitSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Athlete / Sailor Name</label>
                <input
                  type="text"
                  required
                  value={formAthlete}
                  onChange={e => setFormAthlete(e.target.value)}
                  className="w-full bg-navy-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-neon-green/60"
                  placeholder="e.g. Mouad Mouasseif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Boat Class</label>
                  <select
                    value={formBoatType}
                    onChange={e => setFormBoatType(e.target.value)}
                    className="w-full bg-navy-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-neon-green/60"
                  >
                    <option value="ILCA / Laser">ILCA / Laser</option>
                    <option value="Optimist">Optimist</option>
                    <option value="Catamaran">Catamaran</option>
                    <option value="Foiling Moth">Foiling Moth</option>
                    <option value="SSL Boat">SSL Boat</option>
                    <option value="Habitables Sailboat">Habitables sailboat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Wind Speed Estimate</label>
                  <input
                    type="text"
                    required
                    value={formWind}
                    onChange={e => setFormWind(e.target.value)}
                    className="w-full bg-navy-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-neon-green/60"
                    placeholder="e.g. 15.5 kts"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Sailing Location</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  className="w-full bg-navy-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-neon-green/60"
                  placeholder="e.g. Tangier Bay, Morocco"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-neon-green text-navy-950 font-bold hover:bg-neon-green/90 rounded-xl shadow-lg shadow-neon-green/20"
                >
                  Inject Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" id="database-table">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 text-xs uppercase font-mono">
              <th className="py-3 px-4">Athlete / Class</th>
              <th className="py-3 px-4">Location & Date</th>
              <th className="py-3 px-4">Wind / Telemetry</th>
              <th className="py-3 px-4">Privacy Level</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sessions.map(sess => {
              const isActive = sess.id === selectedSessionId;
              const isPublic = isPublicMap[sess.id] || false;
              
              return (
                <tr 
                  key={sess.id}
                  className={`group transition-all hover:bg-white/[0.02] cursor-pointer ${
                    isActive ? "bg-neon-green/[0.04] border-l-2 border-l-neon-green" : ""
                  }`}
                >
                  <td className="py-3.5 px-4" onClick={() => onSelectSession(sess.id)}>
                    <div className="font-semibold text-white group-hover:text-neon-green transition-colors flex items-center gap-1.5">
                      {sess.athleteName}
                      {sess.isCustom && (
                        <span className="text-[9px] bg-neon-cyan/20 text-neon-cyan px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                          Uploader test
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <span>{sess.boatType}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4" onClick={() => onSelectSession(sess.id)}>
                    <div className="text-xs font-medium text-slate-300">{sess.location}</div>
                    <div className="text-[10px] text-slate-500">{sess.date}</div>
                  </td>

                  <td className="py-3.5 px-4" onClick={() => onSelectSession(sess.id)}>
                    <div className="text-xs text-neon-green font-bold">
                      Average Speed: <span className="font-mono">{sess.telemetry.averageSpeed}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      TWS: <span className="font-mono text-slate-300">{sess.windSpeed}</span> | stability: <span className="font-mono text-slate-300">{sess.telemetry.stabilityScore}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePrivacy(sess.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                        isPublic 
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      }`}
                      title={isPublic ? "Allows shared link viewing" : "Restricted private access"}
                    >
                      {isPublic ? (
                        <>
                          <Globe className="w-3.5 h-3.5" />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Private</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopyLink(sess.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-[#00F0FF] transition-all"
                        title="Generate shareable team URL link"
                      >
                        {copiedId === sess.id ? (
                          <CheckCircle2 className="w-4 h-4 text-neon-green" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (comparisonSessionId === sess.id) {
                            onSelectComparisonSession(null);
                          } else {
                            onSelectComparisonSession(sess.id);
                          }
                        }}
                        disabled={isActive}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                          comparisonSessionId === sess.id
                            ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40 font-bold"
                            : isActive
                              ? "opacity-30 cursor-not-allowed bg-white/5 border-transparent text-slate-500"
                              : "bg-white/5 hover:bg-white/10 border-white/5 text-slate-300"
                        }`}
                        title={isActive ? "Cannot compare a session with itself" : "Load secondary comparison session"}
                      >
                        {comparisonSessionId === sess.id ? "Comparing" : "Compare"}
                      </button>
                      <button
                        onClick={() => onSelectSession(sess.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                          isActive 
                            ? "bg-neon-green/20 border-neon-green text-neon-green font-bold" 
                            : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300"
                        }`}
                      >
                        Analyze
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-4">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-neon-green" />
          <span>PostgreSQL DB clusters securely encrypted on Tangier Cloud Ingress.</span>
        </div>
        <span>Total Processed: {sessions.length} sessions</span>
      </div>
    </div>
  );
}
