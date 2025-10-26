// components/consultants/ReferralDashboard.tsx
'use client';

import { useState, useEffect } from 'react';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  activeCommissions: number;
  totalCommissionEarned: number;
  pendingPayouts: number;
}

export default function Referral({ consultantId }: { consultantId: string }) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, [consultantId]);

  const loadReferralData = async () => {
    try {
      const response = await fetch(`/api/consultants/referral-dashboard?consultantId=${consultantId}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.dashboard.stats);
        setReferralLink(data.dashboard.referralLink);
      }
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    // Show success message
  };

  if (loading) return <div>Loading referral dashboard...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Referral Program</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats?.totalReferrals || 0}</div>
          <div className="text-sm text-blue-700">Total Referrals</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats?.successfulReferrals || 0}</div>
          <div className="text-sm text-green-700">Active Referrals</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">10%</div>
          <div className="text-sm text-purple-700">Commission Rate</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">${stats?.totalCommissionEarned || 0}</div>
          <div className="text-sm text-yellow-700">Total Earned</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Your Referral Link</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={referralLink} 
            readOnly 
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-white"
          />
          <button 
            onClick={copyReferralLink}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Share this link with other AI experts. You'll earn 10% of their platform earnings forever!
        </p>
      </div>

      {/* How It Works */}
      <div className="border-t pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <p>Share your referral link</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <p>They join as consultant</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <p>Earn 10% of their earnings forever</p>
          </div>
        </div>
      </div>
    </div>
  );
}