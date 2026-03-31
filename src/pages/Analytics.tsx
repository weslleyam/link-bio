
import React from 'react';
import { User } from '@/types';
import { db } from '@/services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  user: User;
}

const Analytics: React.FC<Props> = ({ user }) => {
  const page = db.getPageByUsername(user.username);
  const links = page ? db.getLinks(page.id) : [];
  
  const data = links.map(l => ({
    name: l.title.length > 12 ? l.title.substring(0, 10) + '...' : l.title,
    clicks: l.clicks,
    color: l.isActive ? '#3b82f6' : '#94a3b8'
  }));

  const totalClicks = links.reduce((a, b) => a + b.clicks, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500">Track how your links are performing over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Clicks by Link</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                  />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
               <p className="text-blue-100 font-medium uppercase tracking-widest text-xs mb-2">Total Lifetime Clicks</p>
               <h2 className="text-5xl font-black mb-4">{totalClicks}</h2>
               <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="bg-white/20 px-2 py-0.5 rounded-full">+12.5%</span>
                  <span>vs last month</span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 mb-4">Detailed Breakdown</h3>
               <div className="space-y-4">
                  {links.sort((a,b) => b.clicks - a.clicks).map(link => (
                    <div key={link.id} className="flex items-center justify-between">
                       <span className="text-sm text-gray-600 font-medium">{link.title}</span>
                       <div className="flex items-center gap-4">
                          <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                             <div 
                                className="bg-blue-500 h-full" 
                                style={{ width: `${totalClicks > 0 ? (link.clicks / totalClicks) * 100 : 0}%` }}
                             ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{link.clicks}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
