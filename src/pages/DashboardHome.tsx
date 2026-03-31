
import React from 'react';
import { User } from '@/types';
import { db } from '@/services/db';
import { ArrowUpRight, MousePointer2, Users, Link as LinkIcon } from 'lucide-react';

interface Props {
  user: User;
}

const DashboardHome: React.FC<Props> = ({ user }) => {
  const page = db.getPageByUsername(user.username);
  const links = page ? db.getLinks(page.id) : [];
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);

  const stats = [
    { label: 'Total Clicks', value: totalClicks, icon: <MousePointer2 className="text-blue-600" />, trend: '+12%' },
    { label: 'Active Links', value: links.filter(l => l.isActive).length, icon: <LinkIcon className="text-green-600" />, trend: 'Stable' },
    { label: 'Page Views', value: totalClicks * 1.5, icon: <Users className="text-purple-600" />, trend: '+5%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your BioLink page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Top Performing Links</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-50">
          {links.length > 0 ? (
            links.sort((a,b) => b.clicks - a.clicks).slice(0, 5).map(link => (
              <div key={link.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <LinkIcon size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{link.title}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{link.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{link.clicks}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Clicks</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400">
              No links created yet. Start by adding one in the Links tab!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
