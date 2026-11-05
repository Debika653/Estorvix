import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, LoaderCircle, Save } from 'lucide-react';
import { createAdminProperty, getAdminProperties, updateAdminProperty, uploadAdminPropertyImage } from '../../api.js';

const initialForm = {
  title: '', description: '', property_type: 'Apartment', price: '', location: '', address: '',
  bedrooms: 2, bathrooms: 2, area_sqft: 1200, status: 'Pending', featured: false,
  image_url: '', amenities: '', year_built: new Date().getFullYear(), parking_spaces: 1,
  agent_name: 'Estorvix Advisory', agent_phone: '', agent_email: '', rejection_reason: ''
};

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10';

export default function AdminPropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!editing) return;
    let active = true;
    getAdminProperties()
      .then((properties) => {
        const property = properties.find((item) => String(item.id) === id);
        if (!active) return;
        if (!property) {
          setError('Property not found.');
          return;
        }
        setForm({
          ...initialForm,
          ...property,
          price: String(property.price),
          images: property.images || '[]',
          featured: Boolean(property.featured)
        });
      })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.error || 'Property details could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [editing, id]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const uploaded = await uploadAdminPropertyImage(imageFile);
        imageUrl = uploaded.image_url;
      }
      const payload = {
        ...form,
        image_url: imageUrl,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area_sqft: Number(form.area_sqft),
        year_built: Number(form.year_built),
        parking_spaces: Number(form.parking_spaces),
        featured: Boolean(form.featured)
      };
      if (editing) await updateAdminProperty(id, payload);
      else await createAdminProperty(payload);
      navigate('/admin/properties', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The listing could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const preview = previewUrl || form.image_url;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link to="/admin/properties" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-700"><ArrowLeft className="h-3.5 w-3.5" /> Back to properties</Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">{editing ? 'Edit listing' : 'New listing'}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">{editing ? 'Update property' : 'Add a property'}</h1>
        <p className="mt-1 text-sm text-slate-500">Add clear, accurate details to help customers discover this property.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-slate-200" /> : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
              <div className="sm:col-span-2"><h2 className="font-bold text-slate-900">Listing details</h2><p className="mt-1 text-xs text-slate-500">Basic property information and pricing.</p></div>
              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Property title<input name="title" required maxLength={255} value={form.title} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Property type<select name="property_type" value={form.property_type} onChange={updateField} className={fieldClass}>{['Apartment', 'Villa', 'Single Family Home', 'Studio', 'Penthouse', 'Townhouse'].map((type) => <option key={type}>{type}</option>)}</select></label>
              <label className="text-xs font-semibold text-slate-600">Listing status<select name="status" value={form.status} onChange={updateField} className={fieldClass}>{['Pending', 'Approved', 'Rejected', 'Sold', 'Rented'].map((status) => <option key={status}>{status}</option>)}</select></label>
              <label className="text-xs font-semibold text-slate-600">Price (₹)<input name="price" type="number" min="0.01" step="0.01" required value={form.price} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Location<input name="location" required maxLength={100} value={form.location} onChange={updateField} placeholder="Indian city and state" className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Street address<input name="address" required maxLength={255} value={form.address} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Description<textarea name="description" required maxLength={60000} rows={4} value={form.description} onChange={updateField} className={fieldClass} /></label>
            </section>

            <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 sm:p-6">
              <div className="sm:col-span-3"><h2 className="font-bold text-slate-900">Property specifications</h2></div>
              <label className="text-xs font-semibold text-slate-600">Bedrooms<input name="bedrooms" type="number" min="0" max="100" value={form.bedrooms} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Bathrooms<input name="bathrooms" type="number" min="0" max="100" value={form.bathrooms} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Area (sq ft)<input name="area_sqft" type="number" min="1" value={form.area_sqft} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Year built<input name="year_built" type="number" min="1700" max="2200" value={form.year_built} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Parking spaces<input name="parking_spaces" type="number" min="0" max="100" value={form.parking_spaces} onChange={updateField} className={fieldClass} /></label>
              <label className="flex items-center gap-2 self-end pb-3 text-xs font-semibold text-slate-700"><input name="featured" type="checkbox" checked={Boolean(form.featured)} onChange={updateField} className="h-4 w-4 rounded border-slate-300 accent-amber-600" /> Feature on homepage</label>
              <label className="text-xs font-semibold text-slate-600 sm:col-span-3">Amenities (comma separated)<input name="amenities" value={form.amenities || ''} onChange={updateField} className={fieldClass} /></label>
            </section>

            <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 sm:p-6">
              <div className="sm:col-span-3"><h2 className="font-bold text-slate-900">Listing agent</h2></div>
              <label className="text-xs font-semibold text-slate-600">Agent name<input name="agent_name" maxLength={100} value={form.agent_name || ''} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Agent phone<input name="agent_phone" maxLength={40} value={form.agent_phone || ''} onChange={updateField} className={fieldClass} /></label>
              <label className="text-xs font-semibold text-slate-600">Agent email<input name="agent_email" type="email" maxLength={100} value={form.agent_email || ''} onChange={updateField} className={fieldClass} /></label>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-slate-900">Property image</h2>
              <div className="mt-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                {preview ? <img src={preview} alt="Property preview" className="h-full w-full object-cover" /> : <ImagePlus className="h-10 w-10 text-slate-300" />}
              </div>
              <label className="mt-4 block text-xs font-semibold text-slate-600">Upload image (JPEG, PNG, WebP · max 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-amber-800 hover:file:bg-amber-100" /></label>
              <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-100" /> or use URL <span className="h-px flex-1 bg-slate-100" /></div>
              <label className="text-xs font-semibold text-slate-600">Image URL<input type="text" inputMode="url" maxLength={500} value={form.image_url || ''} onChange={(event) => { setImageFile(null); setForm((current) => ({ ...current, image_url: event.target.value })); }} placeholder="https://…" className={fieldClass} /></label>
            </section>
            <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/15 transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-60">
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving listing…' : editing ? 'Save changes' : 'Create listing'}
            </button>
            <Link to="/admin/properties" className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</Link>
          </aside>
        </form>
      )}
    </div>
  );
}
