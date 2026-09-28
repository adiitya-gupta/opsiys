import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Search, Calendar, FileText, ChevronRight, CheckCircle2, Clock, ListTodo, CheckSquare, AlertTriangle, User } from 'lucide-react';

export interface MemberUser {
  uid: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
}

export interface MemberReport {
  id: string;
  userId: string;
  memberName: string;
  memberEmail?: string;
  reportDate: string;
  formattedDate?: string;
  tasks?: any[];
  keyAchievements?: string;
  achievements?: string;
  pendingWork?: string[];
  pending_work?: string[];
  blockers?: string[];
  tomorrowPriorities?: string[];
  tomorrow_priorities?: string[];
  additionalUpdate?: string;
  additional_update?: string;
  status: string;
  submittedAt?: any;
}

export interface MemberTask {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignedTo?: string;
}

interface AdminMemberWiseEODViewProps {
  onOpenReportModal: (report: MemberReport) => void;
  realtimeEodReports?: any[];
  realtimeUsers?: any[];
  realtimeTasks?: any[];
}

export const AdminMemberWiseEODView: React.FC<AdminMemberWiseEODViewProps> = ({
  onOpenReportModal,
  realtimeEodReports = [],
  realtimeUsers = [],
  realtimeTasks = []
}) => {
  const [members, setMembers] = useState<MemberUser[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberUser | null>(null);
  const [memberReports, setMemberReports] = useState<MemberReport[]>([]);
  const [memberTasks, setMemberTasks] = useState<MemberTask[]>([]);
  
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Combine users from Firestore /users collection and unique members from eod_reports
  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const memberMap = new Map<string, MemberUser>();

        // Load users from realtimeUsers prop if available, else fetch from Firestore
        if (realtimeUsers && realtimeUsers.length > 0) {
          realtimeUsers.forEach(u => {
            const uid = u.id || u.uid || u.email;
            if (uid) {
              memberMap.set(uid, {
                uid: uid,
                name: u.displayName || u.name || u.memberName || u.email?.split('@')[0] || 'Team Member',
                email: u.email || '',
                role: u.role || 'member',
                department: u.department || ''
              });
            }
          });
        } else {
          const snap = await getDocs(collection(db, 'users'));
          snap.forEach(docSnap => {
            const d = docSnap.data();
            memberMap.set(docSnap.id, {
              uid: docSnap.id,
              name: d.displayName || d.name || d.email?.split('@')[0] || 'Team Member',
              email: d.email || '',
              role: d.role || 'member',
              department: d.department || ''
            });
          });
        }

        // Also check realtimeEodReports to discover any team members missing from /users
        if (realtimeEodReports && realtimeEodReports.length > 0) {
          realtimeEodReports.forEach(r => {
            const uid = r.userId || r.uid || r.memberEmail;
            if (uid && !memberMap.has(uid)) {
              memberMap.set(uid, {
                uid: uid,
                name: r.memberName || r.name || r.memberEmail?.split('@')[0] || 'Team Member',
                email: r.memberEmail || r.userEmail || r.email || '',
                role: 'member',
                department: ''
              });
            }
          });
        }

        const list = Array.from(memberMap.values());
        setMembers(list);
        if (list.length > 0 && !selectedMember) {
          setSelectedMember(list[0]);
        }
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [realtimeUsers, realtimeEodReports]);

  // 2. Load reports and tasks when selectedMember changes or realtime state updates
  useEffect(() => {
    if (!selectedMember) return;
    setLoadingReports(true);

    try {
      // Filter reports for selected member UID or Email
      const matchedReports: MemberReport[] = (realtimeEodReports || [])
        .filter(r => 
          r.userId === selectedMember.uid || 
          (r.memberEmail && selectedMember.email && r.memberEmail.toLowerCase() === selectedMember.email.toLowerCase()) ||
          (r.userEmail && selectedMember.email && r.userEmail.toLowerCase() === selectedMember.email.toLowerCase())
        )
        .map(d => ({
          id: d.id,
          userId: d.userId || selectedMember.uid,
          memberName: d.memberName || d.name || selectedMember.name,
          memberEmail: d.memberEmail || d.userEmail || selectedMember.email,
          reportDate: d.reportDate || d.date || (d.createdAt?.toDate ? d.createdAt.toDate().toISOString().split('T')[0] : '2026-09-28'),
          formattedDate: d.formattedDate || d.reportDate || d.date,
          tasks: d.tasks || [],
          keyAchievements: d.keyAchievements || d.achievements || '',
          pendingWork: d.pendingWork || d.pending_work || [],
          blockers: d.blockers || [],
          tomorrowPriorities: d.tomorrowPriorities || d.tomorrow_priorities || [],
          additionalUpdate: d.additionalUpdate || d.additional_update || '',
          status: d.status || 'submitted',
          submittedAt: d.submittedAt || d.createdAt
        }));

      // Sort descending by reportDate
      matchedReports.sort((a, b) => (b.reportDate || '').localeCompare(a.reportDate || ''));
      setMemberReports(matchedReports);

      // Filter tasks assigned to selected member UID or Email
      const matchedTasks: MemberTask[] = (realtimeTasks || [])
        .filter(t => 
          t.assignedTo === selectedMember.uid || 
          (t.assignedTo && selectedMember.email && t.assignedTo.toLowerCase() === selectedMember.email.toLowerCase())
        )
        .map(t => ({
          id: t.id || '',
          title: t.title || 'Untitled Task',
          description: t.description || '',
          priority: t.priority || 'medium',
          status: t.status || 'pending',
          dueDate: t.dueDate,
          assignedTo: t.assignedTo
        }));
      
      setMemberTasks(matchedTasks);
    } catch (err) {
      console.error('Error fetching member EOD data:', err);
    } finally {
      setLoadingReports(false);
    }
  }, [selectedMember, realtimeEodReports, realtimeTasks]);

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Member-Wise EOD Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select an employee to view their complete profile, assigned tasks, and chronological EOD history.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search employee by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: MEMBERS SIDEBAR + MEMBER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR: MEMBER LIST */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Team Members ({filteredMembers.length})
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Sync
            </span>
          </div>

          {loadingMembers ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading team directory...</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredMembers.map(m => {
                const isSelected = selectedMember?.uid === m.uid;
                const reportCount = (realtimeEodReports || []).filter(r => 
                  r.userId === m.uid || (r.memberEmail && m.email && r.memberEmail.toLowerCase() === m.email.toLowerCase())
                ).length;

                return (
                  <button
                    key={m.uid}
                    onClick={() => setSelectedMember(m)}
                    className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-accent text-white shadow-lg'
                        : 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 border border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm uppercase ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs leading-tight">{m.name}</p>
                        <p className={`text-[10px] truncate max-w-[160px] ${isSelected ? 'text-white/80' : 'text-zinc-500 font-mono'}`}>
                          {m.email || 'No Email Registered'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {reportCount} EODs
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT WORKSPACE: SELECTED MEMBER DETAILS & EOD HISTORY */}
        <div className="lg:col-span-8 space-y-6">
          {selectedMember ? (
            <>
              {/* MEMBER HEADER CARD */}
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent font-black text-2xl flex items-center justify-center border border-accent/30 uppercase">
                    {selectedMember.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">{selectedMember.name}</h2>
                    <p className="text-xs text-zinc-400 font-mono">{selectedMember.email || 'No email specified'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                        Role: {selectedMember.role}
                      </span>
                      {selectedMember.department && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                          Dept: {selectedMember.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-center bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  <div className="px-3">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Total EODs</p>
                    <p className="text-xl font-black text-white">{memberReports.length}</p>
                  </div>
                  <div className="w-px h-8 bg-zinc-800"></div>
                  <div className="px-3">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 font-mono font-mono">Assigned Tasks</p>
                    <p className="text-xl font-black text-amber-400">{memberTasks.length}</p>
                  </div>
                </div>
              </div>

              {/* ASSIGNED TASKS SECTION */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-amber-400" />
                    Assigned Tasks ({memberTasks.length})
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">Employee EOD Task Sync</span>
                </div>

                {memberTasks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {memberTasks.map((task) => (
                      <div key={task.id} className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className={`text-[10px] font-mono font-bold uppercase ${
                            task.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white leading-snug">{task.title}</p>
                        {task.dueDate && (
                          <p className="text-[10px] text-zinc-500 font-mono">Due: {task.dueDate}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 text-center font-mono">
                    No tasks currently assigned to {selectedMember.name}.
                  </p>
                )}
              </div>

              {/* CHRONOLOGICAL EOD REPORT HISTORY */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    Chronological EOD Report History
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">{memberReports.length} Reports Logged</span>
                </div>

                {loadingReports ? (
                  <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading EOD reports history...</div>
                ) : memberReports.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs space-y-2">
                    <FileText className="w-10 h-10 text-zinc-700 mx-auto" />
                    <p className="font-bold text-zinc-400">No EOD reports submitted yet by {selectedMember.name}.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {memberReports.map(r => (
                      <div
                        key={r.id}
                        className="bg-zinc-900 p-4 rounded-xl border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-accent" />
                            <span className="font-bold text-sm text-white font-mono">{r.formattedDate || r.reportDate}</span>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                              {r.status}
                            </span>
                          </div>
                          {r.keyAchievements && (
                            <p className="text-xs text-zinc-300 truncate max-w-xl">
                              <strong className="text-zinc-400 font-mono">Key:</strong> {r.keyAchievements}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                            <span>Tasks: {r.tasks?.length || 0}</span>
                            <span>•</span>
                            <span>Pending: {r.pendingWork?.length || 0}</span>
                            <span>•</span>
                            <span>Blockers: {r.blockers?.length || 0}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenReportModal(r)}
                          className="px-4 py-2 bg-accent hover:bg-accent/80 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Full 6-Section Report
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-16 text-center text-zinc-500 text-xs font-mono">
              Select an employee from the left sidebar to view their full EOD history.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
