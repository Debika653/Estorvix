import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Building2, Home, KeyRound, Mail, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminDashboard } from '../../api.js';
import { formatINR } from '../../currency.js';

const date = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getAdminDashboard());
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Dashboard data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const stats = data?.stats;
  const cards = [
    { label: 'Total properties', value: stats?.totalProperties, icon: Building2, tone: 'amber', hint: `${stats?.pendingProperties ?? 0} pending · ${stats?.approvedProperties ?? 0} approved` },
    { label: 'Pending properties', value: stats?.pendingProperties, icon: Home, tone: 'blue', hint: 'Awaiting review' },
    { label: 'Approved properties', value: stats?.approvedProperties, icon: KeyRound, tone: 'emerald', hint: 'Visible in the public portfolio' },
    { label: 'Total inquiries', value: stats?.totalInquiries, icon: Mail, tone: 'violet', hint: `${stats?.pendingInquiries ?? 0} pending follow-up` }
  ];
  const maxTypeCount = Math.max(1, ...(data?.propertiesByType || []).map((item) => item.count));

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Overview</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">A live overview of your property listings and customer activity.</p>
        </div>
        <button type="button" onClick={loadDashboard} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh data
        </button>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tone, hint }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                tone === 'amber' ? 'bg-amber-50 text-amber-700' : tone === 'blue' ? 'bg-blue-50 text-blue-700' : tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'
              }`}><Icon className="h-5 w-5" /></span>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600"><ArrowUpRight className="h-3.5 w-3.5" /> Live</span>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">{loading && !stats ? '—' : Number(value || 0).toLocaleString()}</p>
            <p className="mt-1 text-[11px] text-slate-400">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div><h2 className="font-bold text-slate-900">Portfolio mix</h2><p className="mt-1 text-xs text-slate-500">Listings grouped by property type</p></div>
          </div>
          {(data?.propertiesByType || []).length === 0 && !loading ? (
            <p className="py-10 text-center text-sm text-slate-400">No property data yet.</p>
          ) : (
            <div className="space-y-5">
              {(data?.propertiesByType || []).map((item) => (
                <div key={item.type}>
                  <div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">{item.type}</span><span className="tabular-nums text-slate-500">{item.count}</span></div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${item.type}: ${item.count} properties`}>
                    <div className="admin-chart-bar h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${Math.max(3, item.count / maxTypeCount * 100)}%` }} />
                  </div>
                </div>
              ))}
              {loading && !data && <div className="h-36 animate-pulse rounded-xl bg-slate-100" />}
            </div>
          )}
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-500">Properties for sale</p><p className="mt-1 text-lg font-bold text-slate-900">{stats?.forSale ?? '—'}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-500">Properties for rent</p><p className="mt-1 text-lg font-bold text-slate-900">{stats?.forRent ?? '—'}</p></div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div><h2 className="font-bold text-slate-900">Recent inquiries</h2><p className="mt-1 text-xs text-slate-500">Latest customer activity</p></div>
            <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="divide-y divide-slate-100">
            {(data?.recentInquiries || []).map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{inquiry.customer_name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{inquiry.property_title || 'Property inquiry'}</p></div>
                <div className="shrink-0 text-right"><span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${inquiry.status === 'Closed' ? 'bg-emerald-50 text-emerald-700' : inquiry.status === 'Contacted' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800'}`}>{inquiry.status === 'Closed' ? 'Resolved' : inquiry.status === 'Pending Review' ? 'Pending' : inquiry.status}</span><p className="mt-1 text-[10px] text-slate-400">{date(inquiry.created_at)}</p></div>
              </div>
            ))}
            {!loading && !data?.recentInquiries?.length && <p className="py-10 text-center text-sm text-slate-400">No inquiries recorded yet.</p>}
            {loading && !data && <div className="h-36 animate-pulse rounded-xl bg-slate-100" />}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div><h2 className="font-bold text-slate-900">Recent property listings</h2><p className="mt-1 text-xs text-slate-500">The latest inventory added to the portfolio</p></div>
          <Link to="/admin/properties" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800">Manage properties <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 font-semibold">Property</th><th className="px-4 py-3 font-semibold">Type</th><th className="px-4 py-3 font-semibold">Price</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-5 py-3 text-right font-semibold">Listed</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.recentProperties || []).map((property) => (
                <tr key={property.id} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={property.image_url} alt="" className="h-10 w-12 rounded-lg bg-slate-100 object-cover" /><div><p className="max-w-56 truncate font-semibold text-slate-800">{property.title}</p><p className="mt-0.5 text-[10px] text-slate-400">{property.location}</p></div></div></td>
                  <td className="px-4 py-3 text-slate-600">{property.property_type}</td><td className="px-4 py-3 font-semibold text-slate-800">{formatINR(property.price)}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{property.status}</span></td><td className="px-5 py-3 text-right text-slate-500">{date(property.created_at)}</td>
                </tr>
              ))}
              {!loading && !data?.recentProperties?.length && <tr><td colSpan="5" className="py-10 text-center text-sm text-slate-400">No properties listed yet.</td></tr>}
              {loading && !data && <tr><td colSpan="5" className="p-5"><div className="h-10 animate-pulse rounded bg-slate-100" /></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
