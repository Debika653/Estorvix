import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  MapPin, 
  Building, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  BadgeCheck,
  Users, 
  CheckCircle2, 
  Bed, 
  Bath, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { getProperties, getStats } from '../api.js';
import PropertyCard from '../components/PropertyCard.jsx';
import InquiryModal from '../components/InquiryModal.jsx';
import { formatINR } from '../currency.js';
import { INDIAN_LOCATIONS } from '../locations.js';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick search form state
  const [quickLocation, setQuickLocation] = useState('');
  const [quickType, setQuickType] = useState('All');
  const [quickStatus, setQuickStatus] = useState('All');

  // Selected property for inquiry modal
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [props, statsData] = await Promise.all([
          getProperties({ sort: 'featured' }),
          getStats().catch(() => null)
        ]);
        setFeaturedProperties(props.slice(0, 6));
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickLocation.trim()) params.append('search', quickLocation.trim());
    if (quickType !== 'All') params.append('type', quickType);
    if (quickStatus !== 'All') params.append('status', quickStatus);
    navigate(`/properties?${params.toString()}`);
  };

  const handleOpenInquiry = (property) => {
    setSelectedProperty(property);
    setInquiryModalOpen(true);
  };

  const propertyCategories = [
    { name: 'Villa', count: 'Explore homes', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80', desc: 'Private luxury estates & infinity pools' },
    { name: 'Flat', type: 'Apartment', count: 'Explore homes', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', desc: 'Comfortable homes for modern living' },
    { name: 'Apartment', count: 'Explore homes', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', desc: 'Modern urban homes & apartments' },
    { name: 'Single Family Home', count: 'Explore homes', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80', desc: 'Spacious family residences' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden rounded-b-3xl sm:rounded-b-4xl">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Hero background luxury architecture"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-28">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your next chapter starts here</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Find a Place You'll Love to Call Home
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Discover exceptional homes in desirable neighborhoods. Find the perfect property that matches your lifestyle, preferences, and budget.
            </p>
          </div>

          {/* Quick Search Floating Box */}
          <div className="mt-10 max-w-4xl bg-white text-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100">
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={quickLocation}
                    onChange={(e) => setQuickLocation(e.target.value)}
                    placeholder="e.g. Kolkata, Bengaluru, Goa..."
                    list="indian-property-locations"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <datalist id="indian-property-locations">
                    {INDIAN_LOCATIONS.map((location) => <option key={location} value={location} />)}
                  </datalist>
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Property Type
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={quickType}
                    onChange={(e) => setQuickType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Single Family Home">Single Family Home</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Studio">Studio</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Listing Status
                </label>
                <select
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                >
                  <option value="All">All Listings</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
              </div>

              {/* Search Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>

          {/* Key Metrics Counter Strip */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stats?.totalProperties ?? '—'}
              </div>
              <div className="text-xs text-slate-400 font-medium">Verified Property Listings</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                {stats?.totalInquiries ?? '—'}
              </div>
              <div className="text-xs text-slate-400 font-medium">Customer Inquiries Handled</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stats?.avgPrice ? formatINR(stats.avgPrice) : '—'}
              </div>
              <div className="text-xs text-slate-400 font-medium">Average Market Value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Curated Showcase
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Explore Properties That Match Your Lifestyle
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked residential homes, townhouses, and penthouses with exceptional architectural design.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onInquire={handleOpenInquiry}
              />
            ))}
          </div>
        )}
      </section>

      {/* Property Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            Discover Homes in Your Favorite Locations
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Explore Property Types
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            From luxury seaside villas to central metropolitan apartments, find the living space suited to your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyCategories.map((cat) => (
            <Link
              key={cat.name}
              to={`/properties?type=${encodeURIComponent(cat.type || cat.name)}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  {cat.count}
                </span>
                <h3 className="text-xl font-bold mt-0.5 group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Estorvix */}
      <section className="bg-slate-100/80 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              A Better Way to Find Home
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Why Choose Estorvix?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Making your property journey simpler, smarter, and more convenient—from discovering the right home to getting the answers you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verified Property Listings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore thoughtfully presented homes with helpful details to make your search clearer and more confident.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Find Your Perfect Home</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Narrow your search by location, property type, price, and features to find a place that fits your life.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Personalized Property Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have questions or want to arrange a viewing? Our team is ready to help you take the next step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        property={selectedProperty}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
}
