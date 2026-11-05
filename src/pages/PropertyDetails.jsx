import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Car, 
  CheckCircle2, 
  Share2, 
  Heart, 
  Mail, 
  Phone, 
  User, 
  Building2, 
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { getPropertyById, getProperties, createInquiry } from '../api.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { formatINR } from '../currency.js';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Inquiry Form state
  const [inquiryForm, setInquiryForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    preferred_contact: 'Email',
    schedule_tour: '',
    message: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    async function loadPropertyData() {
      setLoading(true);
      setInquirySuccess(null);
      setInquiryError('');
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        setActiveImage(data.image_url);

        // Populate initial inquiry message
        setInquiryForm(prev => ({
          ...prev,
          message: `Hello, I would like to inquire about "${data.title}" (${data.property_type}) located in ${data.location}. Please provide availability and financing details.`
        }));

        // Load similar properties by type
        const allProps = await getProperties({ type: data.property_type });
        setSimilarProperties(allProps.filter(p => p.id !== data.id).slice(0, 3));
      } catch (err) {
        console.error('Error loading property details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPropertyData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError('');

    if (!inquiryForm.customer_name.trim()) {
      setInquiryError('Please enter your full name');
      return;
    }
    if (!inquiryForm.customer_email.trim() || !inquiryForm.customer_email.includes('@')) {
      setInquiryError('Please enter a valid email address');
      return;
    }
    if (!inquiryForm.customer_phone.trim()) {
      setInquiryError('Please enter your contact phone number');
      return;
    }
    if (!inquiryForm.message.trim()) {
      setInquiryError('Please provide an inquiry message');
      return;
    }

    setInquiryLoading(true);
    try {
      const payload = {
        property_id: property.id,
        customer_name: inquiryForm.customer_name.trim(),
        customer_email: inquiryForm.customer_email.trim(),
        customer_phone: inquiryForm.customer_phone.trim(),
        preferred_contact: inquiryForm.preferred_contact,
        schedule_tour: inquiryForm.schedule_tour || null,
        message: inquiryForm.message.trim()
      };

      const res = await createInquiry(payload);
      setInquirySuccess(res.inquiry);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setInquiryError(err.response?.data?.error || 'Failed to submit inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mb-6" />
        <div className="h-[460px] bg-slate-200 rounded-3xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          </div>
          <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          This property may no longer be available. Explore our current listings to find your next place.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
      </div>
    );
  }

  // Parse additional gallery images
  let galleryImages = [property.image_url];
  try {
    if (property.images) {
      const parsed = typeof property.images === 'string' ? JSON.parse(property.images) : property.images;
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = [property.image_url, ...parsed.filter(url => url !== property.image_url)];
      }
    }
  } catch (e) {
    console.warn('Could not parse gallery images JSON', e);
  }

  // Parse amenities
  const amenitiesList = property.amenities
    ? property.amenities.split(',').map(a => a.trim()).filter(Boolean)
    : ['High Speed Internet', 'Air Conditioning', 'Private Parking', 'Balcony'];

  const formattedPrice = formatINR(property.price);

  const isRent = property.status === 'For Rent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>

        <div className="text-xs text-slate-400">
          Listing ID: <span className="font-mono font-semibold text-slate-700">#{property.id}</span>
        </div>
      </div>

      {/* Main Image Showcase & Gallery */}
      <div className="space-y-4">
        <div className="relative h-[360px] sm:h-[480px] lg:h-[540px] w-full rounded-3xl overflow-hidden shadow-md bg-slate-900">
          <img
            src={activeImage || property.image_url}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

          {/* Badges on Hero Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md ${
              isRent ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {property.status}
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white shadow-md">
              {property.property_type}
            </span>
            {property.featured ? (
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Exclusive
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-200 mt-1 drop-shadow">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{property.address}, {property.location}</span>
              </div>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 self-start sm:self-auto shadow-xl">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                {isRent ? 'Monthly Rental' : 'Offered Price'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {formattedPrice}
                {isRent && <span className="text-sm font-normal text-slate-300"> / mo</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery Row */}
        {galleryImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                className={`relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImage === imgUrl
                    ? 'border-amber-500 ring-2 ring-amber-500/20 scale-102'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content & Sidebar Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2 Cols): Details, Specs, Amenities */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Specs Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Property Overview & Dimensions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Bed className="w-4 h-4 text-amber-600" />
                  <span>Bedrooms</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {property.bedrooms} {property.bedrooms === 1 ? 'Room' : 'Rooms'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Bath className="w-4 h-4 text-amber-600" />
                  <span>Bathrooms</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {property.bathrooms} Full Baths
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Maximize2 className="w-4 h-4 text-amber-600" />
                  <span>Living Area</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {property.area_sqft} sq ft
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Year Built</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {property.year_built || 2023}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Parking / Garage:</span>
                <span className="font-semibold text-slate-700">{property.parking_spaces || 1} Allocated Space(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Property Type:</span>
                <span className="font-semibold text-slate-700">{property.property_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Listing Status:</span>
                <span className="font-semibold text-emerald-700">{property.status}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              About This Property
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>{property.description}</p>
              <p>
                Situated strategically within {property.location}, this residential offering is surrounded by premium lifestyle conveniences, premier culinary destinations, and effortless arterial transport connections.
              </p>
            </div>
          </div>

          {/* Amenities & Features */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Amenities & Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Agent Contact Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Listing Advisor
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {property.agent_name ? property.agent_name.charAt(0) : 'E'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {property.agent_name || 'Estorvix Advisor'}
                  </h4>
                  <div className="text-xs text-amber-700 font-medium">Licensed Real Estate Specialist</div>
                  <div className="text-xs text-slate-500 mt-1">Estorvix Advisory Group</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {property.agent_phone && (
                  <a
                    href={`tel:${property.agent_phone}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{property.agent_phone}</span>
                  </a>
                )}
                {property.agent_email && (
                  <a
                    href={`mailto:${property.agent_email}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Direct Inquiry Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 sticky top-28">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Inquire About Property
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Tell us what you’re looking for and our property team will be happy to help.
            </p>

            {inquirySuccess ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-emerald-900 text-sm">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-emerald-800">
                  Your reference number is <strong className="font-mono">#{inquirySuccess.id}</strong>. Our team will be in touch shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setInquirySuccess(null)}
                  className="mt-2 text-xs font-semibold text-emerald-700 underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {inquiryError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {inquiryError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={inquiryForm.customer_name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, customer_name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={inquiryForm.customer_email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, customer_email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={inquiryForm.customer_phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, customer_phone: e.target.value })}
                      placeholder="10-digit Indian mobile number"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Preferred Contact & Tour Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Contact Via
                    </label>
                    <select
                      value={inquiryForm.preferred_contact}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, preferred_contact: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Tour Date
                    </label>
                    <input
                      type="date"
                      value={inquiryForm.schedule_tour}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, schedule_tour: e.target.value })}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Message / Tour Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-amber-600/20 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {inquiryLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending your inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Advisor</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Your inquiry will be shared with our property team.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Showcase */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Similar {property.property_type}s
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                More residential options in our current portfolio.
              </p>
            </div>
            <Link
              to={`/properties?type=${encodeURIComponent(property.property_type)}`}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              Browse all {property.property_type}s →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
