import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Eye, Mail, Sparkles } from 'lucide-react';
import { formatINR } from '../currency.js';

export default function PropertyCard({ property, onInquire, layout = 'grid' }) {
  if (!property) return null;

  const formattedPrice = formatINR(property.price);

  const isRent = property.status === 'For Rent';

  if (layout === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col md:flex-row group">
        {/* Image thumbnail */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs ${
              isRent ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {property.status}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 backdrop-blur-xs text-white">
              {property.property_type}
            </span>
          </div>
          {property.featured ? (
            <div className="absolute top-3 right-3 bg-amber-500 text-slate-900 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="text-2xl font-bold text-slate-900">
                {formattedPrice}
                {isRent && <span className="text-sm font-normal text-slate-500"> / month</span>}
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md border border-amber-200/60">
                ID #{property.id}
              </span>
            </div>

            <Link to={`/properties/${property.id}`}>
              <h3 className="text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors line-clamp-1 mb-1">
                {property.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{property.address}, {property.location}</span>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {property.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {/* Specs */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-slate-400" />
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span>{property.area_sqft} sq ft</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onInquire?.(property)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                Inquire
              </button>
              <Link
                to={`/properties/${property.id}`}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Property Image Header */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs ${
            isRent ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {property.status}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 backdrop-blur-xs text-white">
            {property.property_type}
          </span>
        </div>

        {property.featured ? (
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Featured
          </div>
        ) : null}

        {/* Price Tag Overlay at Bottom */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-bold text-base shadow-sm">
          {formattedPrice}
          {isRent && <span className="text-xs font-normal text-slate-300"> / mo</span>}
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/properties/${property.id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 mb-1.5">
              {property.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>
        </div>

        <div>
          {/* Key specs */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4 bg-slate-50/60 rounded-xl px-2">
            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Beds</span>
              <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                <Bed className="w-3.5 h-3.5 text-amber-600" />
                <span>{property.bedrooms}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200/60">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Baths</span>
              <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                <Bath className="w-3.5 h-3.5 text-amber-600" />
                <span>{property.bathrooms}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Area</span>
              <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{property.area_sqft}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onInquire?.(property)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              Inquire
            </button>
            <Link
              to={`/properties/${property.id}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
