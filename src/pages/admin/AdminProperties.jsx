import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Eye, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import { deleteAdminProperty, getAdminProperties, updateAdminProperty } from '../../api.js';
import { formatINR } from '../../currency.js';

const STATUSES = ['All', 'Pending', 'Approved', 'Rejected', 'Sold', 'Rented'];
const TYPES = ['All', 'Apartment', 'Villa', 'Single Family Home', 'Studio', 'Penthouse', 'Townhouse'];

const statusBadges = {
  Pending: 'bg-amber-50 text-amber-800',
  Approved: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-rose-50 text-rose-700',
  Sold: 'bg-slate-800 text-white',
  Rented: 'bg-sky-50 text-sky-700',
  'For Sale': 'bg-blue-50 text-blue-700',
  'For Rent': 'bg-cyan-50 text-cyan-700'
};

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [type, setType] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      getAdminProperties({ search, status, type })
        .then((rows) => { if (active) setProperties(rows); })
        .catch((requestError) => { if (active) setError(requestError.response?.data?.error || 'Properties could not be loaded.'); })
        .finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => { active = false; clearTimeout(timer); };
  }, [search, status, type, refreshKey]);

  const price = formatINR;
  const date = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const updateStatus = async (property, nextStatus) => {
    setError('');
    setNotice('');
    try {
      const payload = { ...property, status: nextStatus, rejection_reason: nextStatus === 'Rejected' ? (property.rejection_reason || 'Rejected by administrator.') : null };
      await updateAdminProperty(property.id, payload);
      setNotice(`Property status updated to ${nextStatus}.`);
      setSelected((item) => item?.id === property.id ? { ...item, status: nextStatus } : item);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The property status could not be updated.');
    }
  };

  const rejectProperty = async (property) => {
    const reason = window.prompt(`Reject "${property.title}"?`, 'Rejected by administrator.');
    if (reason === null) return;
    setError('');
    setNotice('');
    try {
      const payload = { ...property, status: 'Rejected', rejection_reason: reason.trim() || 'Rejected by administrator.' };
      await updateAdminProperty(property.id, payload);
      setNotice('Property rejected and hidden from the public catalog.');
      setSelected((item) => item?.id === property.id ? { ...item, status: 'Rejected' } : item);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The property could not be rejected.');
    }
  };

  const removeProperty = async (property) => {
    if (!window.confirm(`Delete "${property.title}"? Related inquiries will also be deleted.`)) return;
    setError('');
    setNotice('');
    try {
      await deleteAdminProperty(property.id);
      setNotice('Property deleted.');
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The property could not be deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Inventory</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">Manage properties</h1>
          <p className="mt-1 text-sm text-slate-500">Search, update, and review every listing in the Estorvix portfolio.</p>
        </div>
        <Link to="/admin/properties/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-amber-700"><Plus className="h-4 w-4" /> Add property</Link>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, location, address…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10" />
          </div>
          <div className="flex gap-2">
            <select aria-label="Filter by listing status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-amber-500">
              {STATUSES.map((item) => <option key={item} value={item}>{item === 'All' ? 'All statuses' : item}</option>)}
            </select>
            <select aria-label="Filter by property type" value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-amber-500">
              {TYPES.map((item) => <option key={item} value={item}>{item === 'All' ? 'All types' : item}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Property</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-semibold text-slate-700">#{property.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={property.image_url} alt={property.title} className="h-11 w-14 rounded-lg bg-slate-100 object-cover" />
                      <div>
                        <p className="max-w-52 truncate font-semibold text-slate-800">{property.title}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{property.property_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{property.agent_name || 'Estorvix Advisory'}</td>
                  <td className="px-4 py-3 text-slate-600">{property.location}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{price(property.price)}</td>
                  <td className="px-4 py-3 text-slate-600">{property.property_type}</td>
                  <td className="px-4 py-3 text-slate-500">{date(property.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${statusBadges[property.status] || 'bg-slate-100 text-slate-600'}`}>{property.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={() => setSelected(property)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`View ${property.title}`}><Eye className="h-4 w-4" /></button>
                      <Link to={`/admin/properties/${property.id}/edit`} className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700" aria-label={`Edit ${property.title}`}><Edit3 className="h-4 w-4" /></Link>
                      <button type="button" onClick={() => updateStatus(property, 'Approved')} className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700" aria-label={`Approve ${property.title}`}><Check className="h-4 w-4" /></button>
                      <button type="button" onClick={() => rejectProperty(property)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700" aria-label={`Reject ${property.title}`}><X className="h-4 w-4" /></button>
                      <button type="button" onClick={() => removeProperty(property)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${property.title}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && <tr><td colSpan="9" className="p-5"><div className="h-12 animate-pulse rounded-xl bg-slate-100" /></td></tr>}
              {!loading && properties.length === 0 && <tr><td colSpan="9" className="px-5 py-14 text-center text-sm text-slate-400">No properties match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400">{loading ? 'Loading listings…' : `${properties.length} listing${properties.length === 1 ? '' : 's'} shown`}</div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Property details</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{selected.title}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">✕</button>
            </div>
            <div className="grid gap-5 p-5 md:grid-cols-[220px_1fr]">
              <img src={selected.image_url} alt={selected.title} className="h-48 w-full rounded-xl object-cover" />
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-700">Status</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusBadges[selected.status] || 'bg-slate-100 text-slate-600'}`}>{selected.status}</span></div>
                <div className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-700">Price</span><span>{price(selected.price)}</span></div>
                <div className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-700">Type</span><span>{selected.property_type}</span></div>
                <div className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-700">Location</span><span>{selected.location}</span></div>
                <div className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-700">Owner</span><span>{selected.agent_name || 'Estorvix Advisory'}</span></div>
                <div className="pt-2 text-xs text-slate-500">{selected.description}</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
