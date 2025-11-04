// frontend/src/app/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { 
  ShieldCheck, 
  Users, 
  LockKeyhole, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  BarChart3, 
  Clock, 
  Shield, 
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [faceSharingMode, setFaceSharingMode] = useState('REQUIRE_CONSENT');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSetting, setLoadingSetting] = useState(false);
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch initial data
  useEffect(() => {
    if (user) {
      setFaceSharingMode(user.face_sharing_mode || 'REQUIRE_CONSENT');
      
      // Fetch consent stats
      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const res = await api.get('/api/consent-requests/');
          const requests = res.data;
          const total = requests.length;
          const pending = requests.filter(r => r.status === 'PENDING').length;
          const approved = requests.filter(r => r.status === 'APPROVED').length;
          setStats({ total, pending, approved });
        } catch (error) {
          console.error('Failed to fetch consent stats:', error);
        } finally {
          setLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  const handleModeChange = (newMode) => {
    if (newMode === 'PUBLIC' && faceSharingMode !== 'PUBLIC') {
      setShowPublicModal(true);
    } else if (newMode === 'REQUIRE_CONSENT') {
      saveSettings('REQUIRE_CONSENT');
    }
  };

  const confirmPublicMode = () => {
    setShowPublicModal(false);
    saveSettings('PUBLIC');
  };

  const saveSettings = async (newMode) => {
    setLoadingSetting(true);
    try {
      const response = await api.patch(`/api/users/${user.id}/`, { face_sharing_mode: newMode });
      setUser(response.data); // Update user in auth context
      setFaceSharingMode(newMode);
      setToastMessage(`🛡️ Face sharing mode updated`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setToastMessage('❌ Failed to update settings');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoadingSetting(false);
    }
  };

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / (stats.total - stats.pending)) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      {/* Face Privacy Section */}
      <Section title="Face Privacy Settings" icon={ShieldCheck}>
        <p className="text-sm text-gray-600 mb-4">
          When someone detects your face in their photo, how should your face be shared?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RadioCard
            title="Public (Auto-unmask)"
            icon={Users}
            description="Your face is automatically unmasked in all photos. Anyone can share photos with your visible face."
            isSelected={faceSharingMode === 'PUBLIC'}
            onSelect={() => handleModeChange('PUBLIC')}
            isLoading={loadingSetting && faceSharingMode === 'REQUIRE_CONSENT'}
          />
          <RadioCard
            title="Require Consent (Recommended)"
            icon={LockKeyhole}
            isRecommended={true}
            description="You review and approve each photo before your face is unmasked. Your face stays masked until you give permission."
            isSelected={faceSharingMode === 'REQUIRE_CONSENT'}
            onSelect={() => handleModeChange('REQUIRE_CONSENT')}
            isLoading={loadingSetting && faceSharingMode === 'PUBLIC'}
          />
        </div>
      </Section>

      {/* How It Works Section */}
      <Section title="How It Works" icon={AlertCircle}>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <li>Someone uploads a photo with you in it.</li>
          <li>Your face is detected and automatically **masked**.</li>
          <li>You receive a **consent request** in your "Consent" tab.</li>
          <li>You **approve** or **deny** the request.</li>
          <li>Your face is **unmasked** only if you approve it.</li>
        </ol>
      </Section>

      {/* Consent Activity Section */}
      <Section title="Your Consent Activity" icon={BarChart3}>
        {loadingStats ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard value={stats.total} label="Total Requests" />
              <StatCard value={stats.pending} label="Pending Requests" isPending={stats.pending > 0} />
              <StatCard value={`${approvalRate}%`} label="Approval Rate" />
            </div>
            {stats.pending > 0 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start space-x-3 mb-6">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  You currently have **{stats.pending}** photos awaiting your approval. Review them to unmask your face.
                </p>
              </div>
            )}
            <Link href="/consent" className="inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-dark-accent transition-colors">
              <span>View All Consent Requests</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </>
        )}
      </Section>
      
      {/* Danger Zone Section */}
      <Section title="Danger Zone" icon={Trash2} isDanger={true}>
         <p className="text-sm text-gray-600 mb-4">
            Be careful! These actions are permanent and cannot be undone.
          </p>
          <button className="bg-red-50 text-red-700 hover:bg-red-100 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
            Delete My Account
          </button>
      </Section>

      {/* Confirmation Modal */}
      {showPublicModal && (
        <ConfirmationModal
          onClose={() => setShowPublicModal(false)}
          onConfirm={confirmPublicMode}
        />
      )}

      {/* Save Toast */}
      {showToast && (
        <Toast message={toastMessage} onHide={() => setShowToast(false)} />
      )}
    </div>
  );
}

// --- Sub-components ---

function Section({ title, icon: Icon, isDanger = false, children }) {
  return (
    <section className="bg-surface p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center space-x-3 mb-5 pb-4 border-b">
        <Icon className={`w-6 h-6 ${isDanger ? 'text-red-500' : 'text-primary'}`} />
        <h2 className={`text-lg font-bold ${isDanger ? 'text-red-600' : 'text-gray-800'}`}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function RadioCard({ title, icon: Icon, description, isSelected, onSelect, isRecommended = false, isLoading = false }) {
  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left ${
        isSelected
          ? 'bg-primary/5 border-primary shadow-lg'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-4 px-3 py-0.5 bg-gradient-to-r from-primary to-dark-accent text-white text-xs font-bold rounded-full shadow-md">
          ⭐ Recommended
        </span>
      )}
      <div className="flex items-center space-x-3 mb-2">
        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
        <h3 className="text-md font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">
        {description}
      </p>
      <div className="absolute top-4 right-4 flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? 'border-primary bg-primary' : 'border-gray-400'
          }`}>
            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
        )}
      </div>
    </button>
  );
}

function StatCard({ value, label, isPending = false }) {
  return (
    <div className={`p-4 rounded-lg ${isPending ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'} border`}>
      <p className={`text-2xl font-bold ${isPending ? 'text-amber-700' : 'text-primary'}`}>
        {value}
      </p>
      <p className="text-xs font-medium text-gray-600">{label}</p>
    </div>
  );
}

function ConfirmationModal({ onClose, onConfirm }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Enable Auto-unmask?</h3>
            <p className="text-sm text-gray-600 mt-2">
              Your face will be automatically unmasked in ALL future photos without your approval. This reduces your privacy.
            </p>
            <p className="text-sm font-semibold text-gray-700 mt-3">Are you sure?</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            No, Keep Consent
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Yes, Enable
          </button>
        </div>
      </div>
    </>
  );
}

function Toast({ message, onHide }) {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn">
      <span>{message}</span>
    </div>
  );
}