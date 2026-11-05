import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, Menu, Plus, Search, X, Mail } from 'lucide-react';

const navigation = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Manage Properties', to: '/admin/properties', icon: Search, end: true },
  { label: 'Add Property', to: '/admin/properties/new', icon: Plus, end: true },
  { label: 'Customer Inquiries', to: '/admin/inquiries', icon: Mail }
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  return (
      <div className="admin-shell min-h-screen bg-slate-50 text-slate-800 lg:flex">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
            aria-label="Close admin navigation"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-bold tracking-tight">Estorvix</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400">Admin workspace</span>
              </span>
            </div>
            <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-5 pt-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
            <nav className="space-y-1">
              {navigation.map(({ label, to, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-950/20' : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

        </aside>

        <div className="min-h-screen min-w-0 flex-1 lg:ml-72">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7">
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open admin navigation">
                <Menu className="h-5 w-5" />
              </button>
              <span className="text-xs font-medium text-slate-400">Admin</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-slate-700">{location.pathname.split('/').filter(Boolean).slice(1).join(' / ') || 'Dashboard'}</span>
            </div>
            <NavLink to="/" className="text-xs font-semibold text-slate-500 transition hover:text-amber-700">View public site</NavLink>
          </header>
          <main className="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-9">
            <Outlet />
          </main>
        </div>
      </div>
  );
}
