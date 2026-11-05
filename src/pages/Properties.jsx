import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, AlertCircle, Building2 } from 'lucide-react';
import { getProperties } from '../api.js';
import PropertyCard from '../components/PropertyCard.jsx';
import PropertyFilter from '../components/PropertyFilter.jsx';
import InquiryModal from '../components/InquiryModal.jsx';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filter state from URL parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'All',
    status: searchParams.get('status') || 'All',
    bedrooms: searchParams.get('bedrooms') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'featured'
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'

  // Inquiry Modal State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Sync state with URL params if URL changes externally
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || 'All',
      status: searchParams.get('status') || 'All',
      bedrooms: searchParams.get('bedrooms') || 'All',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || 'featured'
    });
  }, [searchParams]);

  // Refresh listings whenever the selected filters change
  useEffect(() => {
    let isMounted = true;
    async function loadProperties() {
      setLoading(true);
      try {
        const data = await getProperties(filters);
        if (isMounted) {
          setProperties(data);
        }
      } catch (err) {
        console.error('Failed to retrieve properties:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProperties();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Update URL query parameters
    const params = new URLSearchParams();
    if (newFilters.search) params.append('search', newFilters.search);
    if (newFilters.location) params.append('location', newFilters.location);
    if (newFilters.type && newFilters.type !== 'All') params.append('type', newFilters.type);
    if (newFilters.status && newFilters.status !== 'All') params.append('status', newFilters.status);
    if (newFilters.bedrooms && newFilters.bedrooms !== 'All') params.append('bedrooms', newFilters.bedrooms);
    if (newFilters.minPrice) params.append('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.append('maxPrice', newFilters.maxPrice);
    if (newFilters.sort && newFilters.sort !== 'featured') params.append('sort', newFilters.sort);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      location: '',
      type: 'All',
      status: 'All',
      bedrooms: 'All',
      minPrice: '',
      maxPrice: '',
      sort: 'featured'
    };
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const handleOpenInquiry = (prop) => {
    setSelectedProperty(prop);
    setInquiryModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            Real Estate Portfolio
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Available Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore homes that fit your lifestyle, from welcoming apartments to spacious villas. Refine your search by location, price, and features.
          </p>
        </div>

        {/* View Layout Toggle (Grid vs List) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setLayout('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              layout === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setLayout('list')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              layout === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <PropertyFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalCount={properties.length}
      />

      {/* Properties Output */}
      {loading ? (
        <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`bg-slate-100 rounded-2xl animate-pulse ${
                layout === 'grid' ? 'h-96' : 'h-52'
              }`}
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Properties Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            We couldn't find any properties matching your current filter criteria. Try adjusting your search query or reset the filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onInquire={handleOpenInquiry}
              layout={layout}
            />
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        property={selectedProperty}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />
    </div>
  );
}
