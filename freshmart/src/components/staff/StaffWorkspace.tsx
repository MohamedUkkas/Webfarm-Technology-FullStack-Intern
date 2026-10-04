import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Boxes, 
  ClipboardCheck, 
  UserCheck, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  LogOut,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Copy,
  CheckCheck,
  KeyRound
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StaffWorkItem, WorkStatus, StaffRole } from '../../types';

export const StaffWorkspace: React.FC = () => {
  const { 
    currentUser, 
    staffWorks, 
    staffMembers,
    updateWorkStatus, 
    setCurrentView, 
    logout,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'approved' | 'completed'>('approved');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentUser) return null;

  const copyIdToClipboard = (idText: string) => {
    navigator.clipboard?.writeText(idText);
    setCopiedId(idText);
    showToast(`Copied Staff ID: ${idText}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const memberProfile = staffMembers.find(
    (s) => s.id.toLowerCase() === currentUser.id.toLowerCase() || s.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  // STRICT ACCESS CONTROL:
  // "staffs can only see thier approved and by thier roles they can see what wrorks they done"
  const staffEmail = currentUser.email.toLowerCase();
  const staffId = currentUser.id;

  const myAllWorks = staffWorks.filter(
    (w) => w.staffEmail.toLowerCase() === staffEmail || w.staffId === staffId
  );

  const myApprovedWorks = myAllWorks.filter((w) => w.status === 'approved' || w.status === 'in_progress');
  const myCompletedWorks = myAllWorks.filter((w) => w.status === 'completed');

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'STAFF_PACKER':
        return 'Order Picker & Packer';
      case 'STAFF_STOCKER':
        return 'Inventory & Shelf Stocker';
      case 'STAFF_DISPATCH':
        return 'Express Dispatch Courier';
      default:
        return 'Fulfillment Specialist';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'STAFF_PACKER':
        return <Package className="w-5 h-5 text-emerald-600" />;
      case 'STAFF_STOCKER':
        return <Boxes className="w-5 h-5 text-blue-600" />;
      case 'STAFF_DISPATCH':
        return <Truck className="w-5 h-5 text-amber-600" />;
      default:
        return <ClipboardCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleStartWork = (workId: string) => {
    updateWorkStatus(workId, 'in_progress');
  };

  const handleFinishWork = (workId: string) => {
    updateWorkStatus(workId, 'completed', completionNotes.trim() || undefined);
    setCompletingId(null);
    setCompletionNotes('');
    setActiveTab('completed');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
              {getRoleIcon(currentUser.role)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-stone-900 text-sm sm:text-base">
                  FreshMart Staff Workspace
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-900 border border-blue-200">
                  ID: {currentUser.id}
                  <button
                    type="button"
                    onClick={() => copyIdToClipboard(currentUser.id)}
                    className="hover:text-blue-700 cursor-pointer ml-0.5"
                    title="Copy Staff ID"
                  >
                    {copiedId === currentUser.id ? <CheckCheck className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Duty Active
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Logged in as <strong className="text-stone-800">{currentUser.firstName} {currentUser.lastName}</strong> · {getRoleDisplayName(currentUser.role)} · {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('storefront')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-700 text-xs font-semibold text-stone-700 border border-stone-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* Staff Role Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Operations Profile</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-mono font-bold border border-blue-400/30">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Staff ID: {currentUser.id}</span>
                  <button
                    type="button"
                    onClick={() => copyIdToClipboard(currentUser.id)}
                    className="hover:text-white cursor-pointer ml-1"
                    title="Copy ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {getRoleDisplayName(currentUser.role)}
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Assigned by: <strong className="text-white">{memberProfile?.assignedByName || 'Store Manager'}</strong> · Department: <strong className="text-white">{memberProfile?.department || 'Store Fulfillment'}</strong>.
                You are viewing your personal approved duty queue.
              </p>
            </div>

            {/* Live Metrics */}
            <div className="md:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {myApprovedWorks.length}
                </div>
                <div className="text-[11px] font-medium text-stone-300 mt-1 uppercase tracking-wider">
                  Pending Approved
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {myCompletedWorks.length}
                </div>
                <div className="text-[11px] font-medium text-stone-300 mt-1 uppercase tracking-wider">
                  Works Done
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('approved')}
            className={`pb-3 px-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'approved'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Approved Work Queue</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {myApprovedWorks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-4 font-semibold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'completed'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>What Works I Have Done</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
              {myCompletedWorks.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Approved Active Queue */}
        {activeTab === 'approved' && (
          <div className="space-y-4">
            {myApprovedWorks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                  🎉
                </div>
                <h3 className="font-display font-extrabold text-stone-800 text-base">
                  All Approved Tasks Complete!
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  You have cleared all active works assigned by your Store Manager. Check back soon or switch to the completed works tab to review your shift log.
                </p>
              </div>
            ) : (
              myApprovedWorks.map((work) => {
                const isInProgress = work.status === 'in_progress';
                const isCompletingThis = completingId === work.id;

                return (
                  <div
                    key={work.id}
                    className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 shadow-xs ${
                      isInProgress 
                        ? 'border-emerald-500/60 ring-2 ring-emerald-500/10' 
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isInProgress 
                              ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}>
                            {isInProgress ? 'In Progress' : 'Manager Approved'}
                          </span>

                          {work.orderId && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-mono font-semibold">
                              Order #{work.orderId}
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-medium capitalize">
                            {work.category}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg">
                          {work.title}
                        </h3>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {work.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-500">
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                            <span>Assigned by Manager: <strong>{work.assignedByManagerName}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>Assigned: {work.assignedAt}</span>
                          </div>
                          {work.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              <span>{work.location}</span>
                            </div>
                          )}
                          {work.itemsSummary && (
                            <div className="flex items-center gap-1.5 font-medium text-stone-700">
                              <Layers className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{work.itemsSummary}</span>
                            </div>
                          )}
                        </div>

                        {work.notes && (
                          <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                            <strong>Manager Note:</strong> {work.notes}
                          </div>
                        )}
                      </div>

                      {/* Work Actions */}
                      <div className="sm:text-right shrink-0 space-y-2">
                        {!isInProgress ? (
                          <button
                            onClick={() => handleStartWork(work.id)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                          >
                            <span>Start Work</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="space-y-2">
                            {!isCompletingThis ? (
                              <button
                                onClick={() => setCompletingId(work.id)}
                                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                <span>Mark As Completed</span>
                              </button>
                            ) : (
                              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 w-full sm:w-72 space-y-2 text-left">
                                <label className="text-[11px] font-bold text-stone-700 block">
                                  Work Completion Notes:
                                </label>
                                <textarea
                                  value={completionNotes}
                                  onChange={(e) => setCompletionNotes(e.target.value)}
                                  placeholder="e.g. Inspected 4 items, packed with cold bag, handed to courier bay."
                                  className="w-full p-2 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-700 bg-white"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleFinishWork(work.id)}
                                    className="flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg"
                                  >
                                    Confirm Done
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCompletingId(null);
                                      setCompletionNotes('');
                                    }}
                                    className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: What Works I Have Done */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="font-semibold text-stone-800">
                Staff Completed Works Audit Ledger
              </span>
              <span>
                Total Verified Works: <strong className="text-emerald-800">{myCompletedWorks.length} tasks</strong>
              </span>
            </div>

            {myCompletedWorks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-xl">
                  📋
                </div>
                <h3 className="font-display font-extrabold text-stone-800 text-sm">
                  No Completed Works Yet
                </h3>
                <p className="text-xs text-stone-500">
                  Tasks you finish in your approved queue will automatically appear here with completed timestamps and supervisor signatures.
                </p>
              </div>
            ) : (
              myCompletedWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-stone-900 text-sm sm:text-base">
                        {work.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                        Work Done & Verified
                      </span>
                      {work.completedAt && (
                        <span className="text-[11px] font-medium text-stone-500">
                          {work.completedAt}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600">
                    {work.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-stone-50 p-3 rounded-xl text-[11px] text-stone-600">
                    <div>
                      <span className="text-stone-400 block font-medium">Assigned By:</span>
                      <span className="font-semibold text-stone-800">{work.assignedByManagerName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Location:</span>
                      <span className="font-semibold text-stone-800">{work.location || 'Store Floor'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Fulfillment Scope:</span>
                      <span className="font-semibold text-stone-800">{work.itemsSummary || 'Standard'}</span>
                    </div>
                  </div>

                  {work.notes && (
                    <div className="text-xs bg-emerald-50/60 border border-emerald-200/60 p-2.5 rounded-xl text-emerald-950">
                      <span className="font-bold text-emerald-900">Staff Execution Note:</span> {work.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
};
