import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Building, Bed, Check } from 'lucide-react';
import { INDIAN_LOCATIONS } from '../locations.js';

const PROPERTY_TYPES = [
  'All',
  'Apartment',
  'Villa',
  'Single Family Home',
  'Studio',
  'Penthouse',
  'Townhouse'
];

const BEDROOM_OPTIONS = ['All', '1', '2', '3', '4+'];

const SORT_OPTIONS = [
  { label: 'Featured First', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Bedrooms (Most)', value: 'bedrooms' },
];

export default function PropertyFilter({ filters, onChange, onReset, totalCount }) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const isFiltered = Boolean(
    filters.search ||
    filters.location ||
    (filters.type && filters.type !== 'All') ||
    (filters.status && filters.status !== 'All') ||
    (filters.bedrooms && filters.bedrooms !== 'All') ||
    filters.minPrice ||
    filters.maxPrice ||
    (filters.sort && filters.sort !== 'featured')
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 mb-8">
      {/* Top Search Bar & Quick Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Search by property name, city, location, or address..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>

        {/* Status Pill Toggle (All / For Sale / For Rent) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0 self-start lg:self-auto">
          {['All', 'For Sale', 'For Rent'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => handleInputChange('status', st)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                (filters.status || 'All') === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sort || 'featured'}
            onChange={(e) => handleInputChange('sort', e.target.value)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Toggle More Filters (Mobile & Tablet) */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${
              showMobileFilters || isFiltered
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Expanded Filter Row (Always visible on lg screens, collapsible on mobile) */}
      <div className={`mt-5 pt-5 border-t border-slate-100 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Property Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Property Type
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={filters.type || 'All'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Property Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Indian City Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              City
            </label>
            <div className="relative">
              <select
                value={filters.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="">All Indian Cities</option>
                {INDIAN_LOCATIONS.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bedrooms Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Bedrooms
            </label>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {BEDROOM_OPTIONS.map((bed) => (
                <button
                  key={bed}
                  type="button"
                  onClick={() => handleInputChange('bedrooms', bed)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                    (filters.bedrooms || 'All') === bed
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {bed === 'All' ? 'Any' : bed}
                </button>
              ))}
            </div>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Min Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">₹</span>
              <input
                type="number"
                min="0"
                step="100000"
                value={filters.minPrice || ''}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                placeholder="e.g. 4500000"
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Max Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">₹</span>
              <input
                type="number"
                min="0"
                step="100000"
                value={filters.maxPrice || ''}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                placeholder="e.g. 30000000"
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Summary Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 font-semibold">{totalCount ?? 0}</strong> matching properties
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
