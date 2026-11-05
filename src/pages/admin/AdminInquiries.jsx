import React, { useEffect, useState } from 'react';
import { Check, CheckCheck, Mail, MessageSquareText, Phone, Search, Trash2, X } from 'lucide-react';
import { deleteAdminInquiry, getAdminInquiries, updateAdminInquiryStatus } from '../../api.js';

const STATUSES = ['All', 'Pending', 'Accepted', 'Rejected', 'Contacted', 'Resolved'];
const labelStatus = (status) => {
  const value = String(status || '').trim().toLowerCase();
  if (value === 'pending review') return 'Pending';
  if (value === 'closed') return 'Resolved';
  if (value === 'tour scheduled') return 'Accepted';
  return STATUSES.find((item) => item.toLowerCase() === value) || 'Pending';
};
const statusClass = (status) => {
  const value = labelStatus(status);
  return value === 'Resolved' || value === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : value === 'Contacted' ? 'bg-blue-50 text-blue-700' : value === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800';
};
const submissionDate = (value) => value && !Number.isNaN(new Date(value).getTime())
  ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  : '—';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      getAdminInquiries({ search, status: statusFilter })
        .then((rows) => { if (active) setInquiries(rows); })
        .catch((requestError) => {
          if (active) {
            setInquiries([]);
            setError(requestError.response?.data?.error || 'Inquiries could not be loaded.');
          }
        })
        .finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => { active = false; clearTimeout(timer); };
  }, [search, statusFilter, refreshKey]);

  const changeStatus = async (inquiry, status) => {
    setUpdatingId(inquiry.id);
    setError('');
    try {
      const result = await updateAdminInquiryStatus(inquiry.id, status);
      const savedStatus = labelStatus(result.status);
      setInquiries((items) => items
        .map((item) => item.id === inquiry.id ? { ...item, status: savedStatus } : item)
        .filter((item) => statusFilter === 'All' || labelStatus(item.status) === statusFilter));
      setSelected((item) => item?.id === inquiry.id ? { ...item, status: savedStatus } : item);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Inquiry status could not be updated.');
    } finally {
      setUpdatingId(null);
    }
  };

  const removeInquiry = async (inquiry) => {
    if (!window.confirm(`Delete the inquiry from ${inquiry.customer_name}? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteAdminInquiry(inquiry.id);
      setSelected((item) => item?.id === inquiry.id ? null : item);
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Inquiry could not be deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Customer care</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">Customer inquiries</h1>
        <p className="mt-1 text-sm text-slate-500">Review customer requests and keep each conversation moving.</p>
      </div>
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone, property…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10" /></div>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((status) => <button key={status} type="button" onClick={() => setStatusFilter(status)} className={`rounded-lg px-3 py-2 text-[11px] font-semibold transition ${statusFilter === status ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{status === 'All' ? 'All statuses' : status}</button>)}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3 font-semibold">ID</th><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Property</th><th className="px-4 py-3 font-semibold">Message</th><th className="px-4 py-3 font-semibold">Submitted</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-600">#{inquiry.id}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-slate-800">{inquiry.customer_name}</p><a href={`mailto:${inquiry.customer_email}`} className="mt-1 block max-w-48 truncate text-[10px] text-slate-500 hover:text-amber-700">{inquiry.customer_email}</a><a href={`tel:${inquiry.customer_phone}`} className="mt-0.5 block text-[10px] text-slate-500 hover:text-amber-700">{inquiry.customer_phone}</a></td>
                  <td className="px-4 py-3"><p className="max-w-44 truncate font-medium text-slate-700">{inquiry.property_title || `Property #${inquiry.property_id}`}</p><p className="mt-1 text-[10px] text-slate-400">{inquiry.property_location}</p></td>
                  <td className="px-4 py-3"><p className="max-w-56 truncate text-slate-600">{inquiry.message}</p><button type="button" onClick={() => setSelected(inquiry)} className="mt-1 text-[10px] font-semibold text-amber-700 hover:text-amber-900">Read message</button></td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{submissionDate(inquiry.created_at)}</td>
                  <td className="px-4 py-3"><select aria-label={`Status for ${inquiry.customer_name}`} disabled={updatingId === inquiry.id} value={labelStatus(inquiry.status)} onChange={(event) => changeStatus(inquiry, event.target.value)} className={`rounded-lg border-0 px-2.5 py-2 text-[11px] font-semibold outline-none ring-1 ring-inset ring-slate-200 disabled:opacity-50 ${statusClass(inquiry.status)}`}>{STATUSES.filter((item) => item !== 'All').map((status) => <option key={status}>{status}</option>)}</select></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap justify-end gap-1">
                    <button type="button" onClick={() => setSelected(inquiry)} aria-label={`View inquiry from ${inquiry.customer_name}`} title="View details" className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"><MessageSquareText className="h-4 w-4" /></button>
                    {labelStatus(inquiry.status) !== 'Accepted' && <button type="button" disabled={updatingId === inquiry.id} onClick={() => changeStatus(inquiry, 'Accepted')} className="rounded-lg bg-emerald-50 px-2 py-1.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"><Check className="mr-1 inline h-3 w-3" />Accept</button>}
                    {labelStatus(inquiry.status) !== 'Rejected' && <button type="button" disabled={updatingId === inquiry.id} onClick={() => changeStatus(inquiry, 'Rejected')} className="rounded-lg bg-rose-50 px-2 py-1.5 text-[10px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50">Reject</button>}
                    {labelStatus(inquiry.status) !== 'Contacted' && <button type="button" disabled={updatingId === inquiry.id} onClick={() => changeStatus(inquiry, 'Contacted')} className="rounded-lg bg-blue-50 px-2 py-1.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"><Phone className="mr-1 inline h-3 w-3" />Contacted</button>}
                    {labelStatus(inquiry.status) !== 'Resolved' && <button type="button" disabled={updatingId === inquiry.id} onClick={() => changeStatus(inquiry, 'Resolved')} className="rounded-lg bg-slate-100 px-2 py-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"><CheckCheck className="mr-1 inline h-3 w-3" />Resolve</button>}
                    <button type="button" onClick={() => removeInquiry(inquiry)} aria-label={`Delete inquiry from ${inquiry.customer_name}`} title="Delete inquiry" className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              ))}
              {loading && <tr><td colSpan="7" className="p-5"><div className="h-12 animate-pulse rounded-xl bg-slate-100" /></td></tr>}
              {!loading && inquiries.length === 0 && <tr><td colSpan="7" className="px-5 py-14 text-center text-sm text-slate-400">No inquiries match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400">{loading ? 'Loading inquiries…' : `${inquiries.length} ${inquiries.length === 1 ? 'inquiry' : 'inquiries'} shown`}</div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="inquiry-dialog-title" className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white"><div className="flex items-center gap-2"><MessageSquareText className="h-4 w-4 text-amber-400" /><h2 id="inquiry-dialog-title" className="font-bold">Inquiry #{selected.id}</h2></div><button type="button" onClick={() => setSelected(null)} aria-label="Close inquiry details" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button></header>
            <div className="space-y-5 p-5 sm:p-6">
              <div><p className="text-lg font-bold text-slate-900">{selected.customer_name}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500"><a href={`mailto:${selected.customer_email}`} className="inline-flex items-center gap-1.5 hover:text-amber-700"><Mail className="h-3.5 w-3.5" />{selected.customer_email}</a><a href={`tel:${selected.customer_phone}`} className="inline-flex items-center gap-1.5 hover:text-amber-700"><Phone className="h-3.5 w-3.5" />{selected.customer_phone}</a></div></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Property</p><p className="mt-1 text-sm font-semibold text-slate-800">{selected.property_title || `Property #${selected.property_id}`}</p><p className="mt-0.5 text-xs text-slate-500">{selected.property_location}</p></div>
              <div><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer message</p><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.message}</p></div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass(selected.status)}`}>{labelStatus(selected.status)}</span><div className="flex items-center gap-3 text-[11px] text-slate-500"><span>Submitted: {submissionDate(selected.created_at)}</span><span>Contact: {selected.preferred_contact}</span>{selected.schedule_tour && <span>Tour: {selected.schedule_tour}</span>}</div></div>
              <div className="flex justify-end"><button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Close</button></div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
