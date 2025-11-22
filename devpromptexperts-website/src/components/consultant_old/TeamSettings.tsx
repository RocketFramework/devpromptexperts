// components/settings/TeamSettings.tsx
'use client';

import { useState } from 'react';

export default function TeamSettings() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      tier: 'Founder 100',
      joinDate: '2024-01-15',
      status: 'active',
      totalEarnings: 45000,
      yourCommission: 2250
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike@example.com',
      tier: 'Professional',
      joinDate: '2024-01-20',
      status: 'active',
      totalEarnings: 32000,
      yourCommission: 1600
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if (inviteEmail) {
      // Send invite logic
      setInviteEmail('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Team & Commission</h2>
      
      <div className="space-y-8">
        {/* Invite Team Member */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Team Member</h3>
          <div className="flex space-x-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleInvite}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Invite
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Team members you invite will be connected to your network, and you&#39;ll earn 5% commission on their projects.
          </p>
        </div>

        {/* Team Members */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Team ({teamMembers.length})</h3>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {member.tier}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-lg font-bold text-gray-900">${member.totalEarnings.toLocaleString()}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      Your Commission: ${member.yourCommission.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Joined {new Date(member.joinDate).toLocaleDateString()}
                  </span>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Remove from Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Commission Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100">Total Team Members</p>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
            </div>
            <div>
              <p className="text-blue-100">Total Team Earnings</p>
              <p className="text-2xl font-bold">${teamMembers.reduce((sum, m) => sum + m.totalEarnings, 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100">Your Total Commission</p>
              <p className="text-2xl font-bold">${teamMembers.reduce((sum, m) => sum + m.yourCommission, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}