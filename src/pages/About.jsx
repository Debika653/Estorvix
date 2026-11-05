import React from 'react';
import { ArrowRight, Building2, CheckCircle2, Eye, Handshake, Home, MapPin, MessageSquareText, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const offerings = [
  {
    icon: Building2,
    title: 'Properties for Sale',
    description: 'Explore quality homes, investment opportunities, and premium residences matched to your lifestyle.'
  },
  {
    icon: Home,
    title: 'Properties for Rent',
    description: 'Discover flexible rental options for individuals, families, and professionals seeking comfort and convenience.'
  },
  {
    icon: Search,
    title: 'Easy Property Search',
    description: 'Browse listings quickly with smart filtering tools built to help you narrow down the right fit.'
  },
  {
    icon: MessageSquareText,
    title: 'Property Inquiry Support',
    description: 'Connect directly with available listings and get the information you need without unnecessary friction.'
  }
];

const reasons = [
  'Thoughtfully selected homes',
  'Options for every stage of life',
  'Clear, helpful property details',
  'A simpler way to compare homes',
  'Friendly, personal assistance'
];

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div
          className="relative min-h-[420px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15,23,42,0.72), rgba(15,23,42,0.45)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80')"
          }}
        >
          <div className="flex min-h-[420px] items-center px-6 py-10 sm:px-10 lg:px-16">
            <div className="max-w-xl text-white">
              <p className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200 backdrop-blur-sm">
                About Estorvix
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About Estorvix</h1>
              <p className="mt-4 text-lg font-medium text-slate-100">Making Your Property Journey Simple, Smart, and Seamless.</p>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200 sm:text-base">
                Estorvix helps people discover homes, apartments, and investment opportunities with clarity and confidence. We bring together a modern browsing experience, useful property details, and a simple way to connect with the right listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">Who We Are</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Helping people find a place they can truly call home.</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Estorvix is a real estate company focused on helping people find homes that feel right for the way they live. We bring together a thoughtful selection of properties and attentive guidance at every step.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Whether you are buying, renting, or exploring your next investment, our team makes it easier to compare your options, discover the right neighborhood, and move forward with confidence.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Our Mission</p>
              <h3 className="text-xl font-bold text-slate-900">Making every move more confident</h3>
            </div>
          </div>

          <ul className="space-y-4 text-sm text-slate-600">
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span>Make property discovery simple and accessible for every buyer, renter, and investor.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span>Connect people with suitable properties that align with their goals and budget.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span>Deliver a transparent, convenient, and user-friendly property browsing experience.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Eye className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Our Vision</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            To make finding a home a more personal, transparent, and rewarding experience for every individual and family.
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Handshake className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Our Commitment to Customers</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            We listen to your priorities, provide clear information, and offer thoughtful support so you can make each property decision with confidence.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">What We Offer</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">A smoother way to discover great properties.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {offerings.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] sm:px-8 lg:px-10">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Why Choose Estorvix?</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">A simple approach to finding the right property.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {reasons.map((reason) => (
            <div key={reason} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-slate-100">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[2rem] border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-6 py-10 text-center shadow-[0_12px_30px_rgba(245,158,11,0.08)] sm:px-8 lg:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">Your Next Step</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Find Your Perfect Place Today</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
          Explore our property collection and discover a place that feels like home.
        </p>
        <Link
          to="/properties"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          Explore Properties
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
