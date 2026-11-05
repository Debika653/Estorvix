import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Search, 
  Filter, 
  Calendar, 
  Phone, 
  User, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Eye,
  MessageSquare,
  X
} from 'lucide-react';
import { getInquiries, updateInquiryStatus } from '../api.js';

const INQUIRY_STATUSES = ['Pending', 'Accepted', 'Rejected', 'Contacted', 'Resolved'];
const normalizeStatus = (status) => {
  const value = String(status || '').trim().toLowerCase();
  if (value === 'pending review') return 'Pending';
  if (value === 'closed') return 'Resolved';
  if (value === 'tour scheduled') return 'Accepted';
  return INQUIRY_STATUSES.find((item) => item.toLowerCase() === value) || 'Pending';
};

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [error, setError] = useState('');

  const fetchInquiriesData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch (err) {
      setInquiries([]);
      setError(err.response?.data?.error || 'We could not load your inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiriesData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setError('');
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update inquiry status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      inq.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.customer_phone?.toLowerCase().includes(search.toLowerCase()) ||
      inq.property_title?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || normalizeStatus(inq.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === 'Pending') return 'bg-amber-50 text-amber-800 border-amber-200';
    if (normalized === 'Accepted' || normalized === 'Resolved') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (normalized === 'Contacted') return 'bg-blue-50 text-blue-800 border-blue-200';
    if (normalized === 'Rejected') return 'bg-rose-50 text-rose-800 border-rose-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const pendingCount = inquiries.filter(i => normalizeStatus(i.status) === 'Pending').length;
  const acceptedCount = inquiries.filter(i => normalizeStatus(i.status) === 'Accepted').length;
  const contactedCount = inquiries.filter(i => normalizeStatus(i.status) === 'Contacted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Here to Help
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Property Inquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your property questions and stay connected with the Estorvix team.
          </p>
        </div>

        <button
          onClick={fetchInquiriesData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition shadow-2xs self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Inquiries
        </button>
      </div>
      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 uppercase font-medium">Total Inquiries</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{inquiries.length}</div>
        </div>
        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 shadow-2xs">
          <span className="text-xs text-amber-700 uppercase font-medium">Pending</span>
          <div className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</div>
        </div>
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 shadow-2xs">
          <span className="text-xs text-blue-700 uppercase font-medium">Contacted</span>
          <div className="text-2xl font-bold text-blue-900 mt-1">{contactedCount}</div>
        </div>
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <span className="text-xs text-emerald-700 uppercase font-medium">Accepted</span>
          <div className="text-2xl font-bold text-emerald-900 mt-1">{acceptedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, email, or property..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', ...INQUIRY_STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                statusFilter === status
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-600" />
            Loading your inquiries...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base">No Inquiries Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'All'
                ? 'No inquiries match your current search or status filter.'
                : 'No customer inquiries recorded yet. Browse properties and submit an inquiry to test!'}
            </p>
            <div className="mt-4">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 hover:underline"
              >
                Browse Properties to Inquire →
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Associated Property</th>
                  <th className="py-3 px-4">Preferences</th>
                  <th className="py-3 px-4">Status & Action</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/70 transition">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      #{inq.id}
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inq.customer_name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{inq.customer_email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{inq.customer_phone}</span>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {inq.property_id ? (
                        <div>
                          <Link
                            to={`/properties/${inq.property_id}`}
                            className="font-bold text-slate-900 hover:text-amber-600 transition truncate block"
                          >
                            {inq.property_title || `Property #${inq.property_id}`}
                          </Link>
                          <div className="text-[11px] text-slate-500 truncate">
                            {inq.property_location}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">General Inquiry</span>
                      )}
                    </td>

                    {/* Preferences & Tour */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] font-medium text-slate-700">
                        Method: <strong className="text-slate-900">{inq.preferred_contact}</strong>
                      </div>
                      {inq.schedule_tour && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>Tour: {inq.schedule_tour}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        disabled={updatingId === inq.id}
                        value={normalizeStatus(inq.status)}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition cursor-pointer ${getStatusBadge(
                          inq.status
                        )}`}
                      >
                        {INQUIRY_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>

                    {/* Action View */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(inq)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition"
                        title="View Full Message"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Inquiry #{selectedInquiry.id} Details</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-900">{selectedInquiry.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <a href={`mailto:${selectedInquiry.customer_email}`} className="text-amber-700 underline font-medium">
                    {selectedInquiry.customer_email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <a href={`tel:${selectedInquiry.customer_phone}`} className="text-amber-700 underline font-medium">
                    {selectedInquiry.customer_phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Preferred Method:</span>
                  <span className="font-semibold text-slate-800">{selectedInquiry.preferred_contact}</span>
                </div>
                {selectedInquiry.schedule_tour && (
                  <div className="flex justify-between text-emerald-800">
                    <span className="font-semibold">Requested Tour:</span>
                    <span className="font-bold">{selectedInquiry.schedule_tour}</span>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{selectedInquiry.property_title}</div>
                  <div className="text-slate-600 text-[11px]">{selectedInquiry.property_location}</div>
                </div>
                <Link
                  to={`/properties/${selectedInquiry.property_id}`}
                  className="px-2.5 py-1 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition flex items-center gap-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Message */}
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Customer Message:
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Selector */}
              <div className="pt-2 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Update Status:</span>
                <select
                  value={normalizeStatus(selectedInquiry.status)}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(
                    selectedInquiry.status
                  )}`}
                >
                  {INQUIRY_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
