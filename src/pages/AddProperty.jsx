import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  IndianRupee,
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Car, 
  User, 
  Mail, 
  Phone,
  Sparkles,
  Loader2,
  Wand2
} from 'lucide-react';
import { createProperty } from '../api.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { INDIAN_LOCATIONS } from '../locations.js';

const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Single Family Home',
  'Studio',
  'Penthouse',
  'Townhouse'
];

export default function AddProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'Apartment',
    price: '',
    location: '',
    address: '',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1200,
    status: 'For Sale',
    featured: false,
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    amenities: 'Balcony, Air Conditioning, High-speed Internet, Covered Parking',
    year_built: 2023,
    parking_spaces: 1,
    agent_name: 'Estorvix Advisory',
    agent_phone: '',
    agent_email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Sample listings that can be used to quickly fill in the form
  const loadPreset = (presetName) => {
    if (presetName === 'villa') {
      setFormData({
        title: 'Candolim Beachside Luxury Villa',
        description: 'An elegant Goan villa near Candolim Beach, with a private courtyard, a sunlit swimming pool, spacious living areas, and room to unwind with family and friends.',
        property_type: 'Villa',
        price: '52000000',
        location: 'Goa',
        address: 'Candolim, North Goa',
        bedrooms: 5,
        bathrooms: 5,
        area_sqft: 5400,
        status: 'For Sale',
        featured: true,
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        amenities: 'Infinity Pool, Private Courtyard, Smart Home, Wine Cellar, 3-Car Garage, Security System',
        year_built: 2024,
        parking_spaces: 3,
        agent_name: 'Estorvix Advisory',
        agent_phone: '',
        agent_email: ''
      });
    } else if (presetName === 'apartment') {
      setFormData({
        title: 'Whitefield Modern Premium Apartment',
        description: 'A bright Bengaluru residence with a generous balcony, a contemporary kitchen, thoughtful storage, and easy access to Whitefield workplaces, schools, and everyday conveniences.',
        property_type: 'Apartment',
        price: '12500000',
        location: 'Bengaluru, Karnataka',
        address: 'Whitefield Main Road, Bengaluru',
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1650,
        status: 'For Sale',
        featured: false,
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        amenities: 'Elevator, Doorman, Hardwood Floors, In-Unit Laundry, Fitness Room, Bike Storage',
        year_built: 2021,
        parking_spaces: 1,
        agent_name: 'Estorvix Advisory',
        agent_phone: '',
        agent_email: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a property title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a property description');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please provide a valid property price');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter a city / location');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please provide a street address');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        area_sqft: parseInt(formData.area_sqft, 10),
        parking_spaces: parseInt(formData.parking_spaces, 10),
        year_built: parseInt(formData.year_built, 10),
      };

      const result = await createProperty(payload);
      setSuccess(result.property);
    } catch (err) {
      console.error('Failed to submit property listing:', err);
      setError(err.response?.data?.error || 'We could not submit this property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5" />
            Share a Listing
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            List New Property
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Add the details below to share a property with people looking for their next home.
          </p>
        </div>

        {/* Sample listing shortcuts */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Quick fill:</span>
          <button
            type="button"
            onClick={() => loadPreset('villa')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-600" />
            Load Villa
          </button>
          <button
            type="button"
            onClick={() => loadPreset('apartment')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
          >
            <Wand2 className="w-3.5 h-3.5 text-slate-600" />
            Load Apartment
          </button>
        </div>
      </div>

      {success ? (
        <div className="p-8 bg-white rounded-3xl border border-emerald-200 shadow-md text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Your Property Has Been Listed!
          </h3>
          <p className="text-sm text-slate-600">
            Your listing is ready to view. Share its details with prospective buyers and renters.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => navigate(`/properties/${success.id}`)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
            >
              View Property Details
            </button>
            <button
              onClick={() => {
                setSuccess(null);
                setFormData({
                  title: '',
                  description: '',
                  property_type: 'Apartment',
                  price: '',
                  location: '',
                  address: '',
                  bedrooms: 2,
                  bathrooms: 2,
                  area_sqft: 1200,
                  status: 'For Sale',
                  featured: false,
                  image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                  amenities: 'Balcony, Air Conditioning, High-speed Internet',
                  year_built: 2024,
                  parking_spaces: 1,
                  agent_name: 'Estorvix Advisory',
                  agent_phone: '',
                  agent_email: ''
                });
              }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition"
            >
              Add Another Listing
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Column (2 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Basic Property Information
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. The Grand Mirage Villa"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Property Type *
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => handleInputChange('property_type', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Listing Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g. 12500000"
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detail key architectural highlights, lighting, floor plan, views..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Location & Specs */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Location & Property Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    City / Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g. Kolkata, West Bengal"
                      list="indian-property-locations"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <datalist id="indian-property-locations">
                      {INDIAN_LOCATIONS.map((location) => <option key={location} value={location} />)}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="e.g. 742 Crestline Ridge Blvd"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={formData.area_sqft}
                    onChange={(e) => handleInputChange('area_sqft', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2030"
                    value={formData.year_built}
                    onChange={(e) => handleInputChange('year_built', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Media & Amenities */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Media, Amenities & Highlights
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  placeholder="Swimming Pool, Smart Home, Wine Cellar, Gym, Private Garden"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="featuredCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Mark as Featured Property (Showcased on Home page banner)
                </label>
              </div>
            </div>

            {/* Agent Info */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Assigned Listing Agent
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={formData.agent_name}
                    onChange={(e) => handleInputChange('agent_name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Agent Phone
                  </label>
                  <input
                    type="text"
                    value={formData.agent_phone}
                    onChange={(e) => handleInputChange('agent_phone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Agent Email
                  </label>
                  <input
                    type="email"
                    value={formData.agent_email}
                    onChange={(e) => handleInputChange('agent_email', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-amber-600/20 hover:shadow-lg transition disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting your listing...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Property</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column: Live Card Preview */}
          <div className="space-y-4">
            <div className="sticky top-28">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Live Card Preview
              </h3>
              <PropertyCard
                property={{
                  id: 99,
                  title: formData.title || 'Untitled Property Name',
                  description: formData.description || 'Property description preview will appear here in real-time as you type...',
                  property_type: formData.property_type,
                  price: formData.price || 0,
                  location: formData.location || 'City, State',
                  address: formData.address || 'Street Address',
                  bedrooms: formData.bedrooms,
                  bathrooms: formData.bathrooms,
                  area_sqft: formData.area_sqft,
                  status: formData.status,
                  featured: formData.featured,
                  image_url: formData.image_url
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
