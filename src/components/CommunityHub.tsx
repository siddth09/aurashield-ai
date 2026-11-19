import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { CommunityReport } from '../types';
import { generateCommunityNoticeText } from '../services/geminiService';
import { 
  Users, 
  Copy, 
  Check, 
  MapPin, 
  ThumbsUp, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: 'rep-1',
    title: 'Open Garden Leaf Burning near Sector 4 Park',
    type: 'waste_burning',
    location: 'Sector 4, Central Green Belt',
    timeReported: '35 mins ago',
    status: 'active',
    severity: 'high',
    upvotes: 14,
  },
  {
    id: 'rep-2',
    title: 'Commercial Diesel Generator Exhaust Blown into Balconies',
    type: 'generator_smoke',
    location: 'Market Complex Block B',
    timeReported: '2 hours ago',
    status: 'investigating',
    severity: 'medium',
    upvotes: 9,
  },
  {
    id: 'rep-3',
    title: 'Uncovered Construction Sand Dust during 15 km/h Wind Gusts',
    type: 'construction_dust',
    location: 'Avenue 9 Cross Road',
    timeReported: '4 hours ago',
    status: 'active',
    severity: 'medium',
    upvotes: 6,
  },
  {
    id: 'rep-4',
    title: 'Clean Air Sanctuary Open with Dual Corsi-Rosenthal Purifiers',
    type: 'clean_air_space_available',
    location: 'Community Club Hall (Ground Floor)',
    timeReported: '1 day ago',
    status: 'resolved',
    severity: 'low',
    upvotes: 28,
  }
];

export const CommunityHub: React.FC = () => {
  const { aqiData, profile } = useHousehold();
  const [reports, setReports] = useState<CommunityReport[]>(INITIAL_REPORTS);
  const [activeTab, setActiveTab] = useState<'reports' | 'notices' | 'lending'>('reports');
  const [noticeTopic, setNoticeTopic] = useState<'anti_burning' | 'carpool_initiative' | 'clean_air_space'>('anti_burning');
  const [copied, setCopied] = useState<boolean>(false);
  const [showNewReportModal, setShowNewReportModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newType, setNewType] = useState<CommunityReport['type']>('waste_burning');

  const currentNotice = generateCommunityNoticeText(
    'Greenwood Heights RWA',
    profile.cityName,
    aqiData.aqi,
    noticeTopic
  );

  const copyNotice = () => {
    navigator.clipboard.writeText(currentNotice);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleUpvote = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const report: CommunityReport = {
      id: `rep-${Date.now()}`,
      title: newTitle,
      type: newType,
      location: newLocation,
      timeReported: 'Just now',
      status: 'active',
      severity: newType === 'waste_burning' ? 'high' : 'medium',
      upvotes: 1,
    };

    setReports([report, ...reports]);
    setNewTitle('');
    setNewLocation('');
    setShowNewReportModal(false);
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
              Collective Neighborhood Action
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Community Smog Watch & Action Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate with neighbors in <strong className="text-slate-200">{profile.cityName}</strong> to report illegal burning, generate official notices, and establish shared clean air spaces.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'reports' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hotspot Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'notices' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Notice Generator
          </button>
          <button
            onClick={() => setActiveTab('lending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'lending' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Clean Air Lending
          </button>
        </div>
      </div>

      {/* Tab 1: Community Hotspot Reports */}
      {activeTab === 'reports' && (
        <div className="my-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Active Community Smog Hotspots
            </h3>
            <button
              onClick={() => setShowNewReportModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Burning / Smoke
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(rep => {
              const isBurning = rep.type === 'waste_burning';
              const isSanctuary = rep.type === 'clean_air_space_available';

              return (
                <div
                  key={rep.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        isSanctuary ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        isBurning ? 'bg-rose-950 text-rose-300 border-rose-800' :
                        'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {rep.type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">{rep.timeReported}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">
                      {rep.title}
                    </h4>

                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{rep.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className={`font-mono text-[11px] ${
                      rep.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      Status: {rep.status.toUpperCase()}
                    </span>

                    <button
                      onClick={() => handleUpvote(rep.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-mono text-xs transition-colors"
                      title="Confirm this incident"
                    >
                      <ThumbsUp className="w-3 h-3 text-emerald-400" />
                      <span>{rep.upvotes} Confirmations</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Notice Generator */}
      {activeTab === 'notices' && (
        <div className="my-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setNoticeTopic('anti_burning')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                noticeTopic === 'anti_burning' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              Zero-Waste Burning Advisory
            </button>
            <button
              onClick={() => setNoticeTopic('carpool_initiative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                noticeTopic === 'carpool_initiative' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              Carpool & Commute Circular
            </button>
            <button
              onClick={() => setNoticeTopic('clean_air_space')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                noticeTopic === 'clean_air_space' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              Clean Air Sanctuary Announcement
            </button>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
            <button
              onClick={copyNotice}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Circular!' : 'Copy Circular'}
            </button>
            {currentNotice}
          </div>
        </div>
      )}

      {/* Tab 3: Clean Air Lending Library */}
      {activeTab === 'lending' && (
        <div className="my-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Community Clean Air Lending Library
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When severe smog strikes, vulnerable households (families with newborns, asthmatic elderly) in low-income or unsealed housing often lack access to purifiers. The Lending Library enables community members to donate or lend spare purifiers and DIY Corsi-Rosenthal boxes during high-alert winter months.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-xl font-bold font-mono text-emerald-400">4 Kits</div>
                <div className="text-xs text-slate-400 mt-0.5">Available for Loan</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-xl font-bold font-mono text-teal-400">7 Families</div>
                <div className="text-xs text-slate-400 mt-0.5">Currently Protected</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-xl font-bold font-mono text-indigo-400">$35/unit</div>
                <div className="text-xs text-slate-400 mt-0.5">Sponsor a DIY Kit</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-3">Report Local Pollution Hotspot</h3>
            <form onSubmit={handleAddReport} className="space-y-4 text-xs">
              <div>
                <label htmlFor="report-title" className="block text-slate-300 mb-1 font-medium">Incident Description</label>
                <input
                  id="report-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Guard fire with painted wood at gate 3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="report-location" className="block text-slate-300 mb-1 font-medium">Location</label>
                <input
                  id="report-location"
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g., Near Block D Entrance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="report-type" className="block text-slate-300 mb-1 font-medium">Incident Category</label>
                <select
                  id="report-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as CommunityReport['type'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="waste_burning">Open Leaf / Plastic Waste Burning</option>
                  <option value="generator_smoke">Diesel Generator Smoke Ingress</option>
                  <option value="construction_dust">Uncovered Construction Dust Plume</option>
                  <option value="clean_air_space_available">Clean Air Space Available</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
