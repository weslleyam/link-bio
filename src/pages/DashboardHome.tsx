import React, { useState } from 'react';
import { User } from '@/types';
import { db } from '@/services/db';
import { ArrowUpRight, MousePointer2, Users, Link as LinkIcon, CreditCard, Check, X } from 'lucide-react';

interface Props {
  user: User;
}

const DashboardHome: React.FC<Props> = ({ user }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'semestral'>('semestral');

  const page = db.getPageByUsername(user.username);
  const links = page ? db.getLinks(page.id) : [];
  const totalClicks = links.reduce((acc, curr) => acc + curr.clicks, 0);

  const calculateRemainingDays = () => {
    if (!user?.trialExpiresAt) return 0;
    const expires = new Date(user.trialExpiresAt);
    const now = new Date();
    const diff = expires.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleRequestSubscription = async () => {
    if (!user) return;
    setIsRequesting(true);
    try {
      await db.requestSubscription({ ...user, selectedPlan } as any);
      setRequestSent(true);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRequesting(false);
    }
  };

  const remainingDays = calculateRemainingDays();
  const statusLabels = {
    trial: 'Período de Teste',
    ativo: 'Plano Ativo',
    expirado: 'Plano Expirado'
  };

  const stats = [
    { label: 'Total Clicks', value: totalClicks, icon: <MousePointer2 className="text-blue-600" />, trend: '+12%' },
    { label: 'Active Links', value: links.filter(l => l.isActive).length, icon: <LinkIcon className="text-green-600" />, trend: 'Stable' },
    { label: 'Page Views', value: totalClicks * 1.5, icon: <Users className="text-purple-600" />, trend: '+5%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your BioLink page.</p>
        </div>

        {/* Subscription Status Badge */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            user?.subscriptionStatus === 'expirado' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <CreditCard size={20} />
          </div>
          <div className="pr-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assinatura</p>
            <p className="font-bold text-gray-900 text-sm">{statusLabels[user?.subscriptionStatus || 'trial']}</p>
          </div>
          {user?.subscriptionStatus === 'trial' && (
            <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg border border-amber-100">
              <p className="text-[10px] font-black uppercase tracking-tighter">{remainingDays} dias</p>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Call to Action */}
      {user?.subscriptionStatus !== 'ativo' && (
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <CreditCard size={120} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black mb-2">
                {user?.subscriptionStatus === 'expirado' 
                  ? 'Sua assinatura expirou!' 
                  : 'Gostando do BioLink?'}
              </h2>
              <p className="text-indigo-100 font-medium max-w-md">
                {user?.subscriptionStatus === 'expirado'
                  ? 'Sua página pública foi desativada. Renove agora para reativar todos os seus links e recursos.'
                  : 'Assine o plano Pro para garantir que sua página continue ativa após o período de teste.'}
              </p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              disabled={requestSent}
              className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl ${
                requestSent 
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50 active:scale-95'
              }`}
            >
              {requestSent ? 'Solicitado!' : 'Assinar Plano'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Assinatura */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Escolha seu Plano Pro</h2>
                  <p className="text-gray-500 font-medium">Selecione a melhor opção para o seu negócio.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Plano Mensal */}
                <div 
                  onClick={() => setSelectedPlan('mensal')}
                  className={`cursor-pointer p-8 rounded-[2rem] border-2 transition-all ${
                    selectedPlan === 'mensal' 
                      ? 'border-indigo-600 bg-indigo-50/30' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-black text-gray-900 text-lg">Plano Mensal</h3>
                    {selectedPlan === 'mensal' && <Check size={20} className="text-indigo-600" />}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900">R$ 5,99</span>
                    <span className="text-gray-500 font-bold">/ mês</span>
                  </div>
                </div>

                {/* Plano Semestral */}
                <div 
                  onClick={() => setSelectedPlan('semestral')}
                  className={`cursor-pointer p-8 rounded-[2rem] border-2 transition-all relative ${
                    selectedPlan === 'semestral' 
                      ? 'border-indigo-600 bg-indigo-50/30 shadow-xl shadow-indigo-100' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="absolute -top-3 left-8">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      MAIS VANTAJOSO
                    </span>
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-black text-gray-900 text-lg">Plano Semestral</h3>
                    {selectedPlan === 'semestral' && <Check size={20} className="text-indigo-600" />}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black text-gray-900">R$ 33,70</span>
                    <span className="text-gray-500 font-bold">(6 meses)</span>
                  </div>
                  <p className="text-indigo-600 text-xs font-black">
                    Economize R$ 2,24 comparado ao plano mensal
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-center">
                <p className="text-gray-500 text-sm font-bold">
                  Escolha o plano ideal e receba o link de pagamento no seu email.
                </p>
                <button 
                  onClick={handleRequestSubscription}
                  disabled={isRequesting}
                  className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isRequesting ? 'Processando...' : 'Confirmar e Receber Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {requestSent && (
        <div className="bg-green-50 border-2 border-green-100 p-6 rounded-[2rem] flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <Check size={20} />
          </div>
          <div>
            <h4 className="font-black text-green-900 mb-1">Recebemos sua solicitação!</h4>
            <p className="text-green-700 text-sm font-medium">
              Um administrador entrará em contato com você em breve para finalizar sua assinatura.
            </p>
          </div>
        </div>
      )}

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
