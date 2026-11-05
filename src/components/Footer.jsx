import { Link } from 'react-router-dom';
import { Building2, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const businessEmail = import.meta.env.VITE_BUSINESS_EMAIL?.trim();
const businessPhone = import.meta.env.VITE_BUSINESS_PHONE?.trim();
const socialLinks = [
  { name: 'Facebook', Icon: Facebook, href: import.meta.env.VITE_FACEBOOK_URL?.trim() },
  { name: 'Instagram', Icon: Instagram, href: import.meta.env.VITE_INSTAGRAM_URL?.trim() },
  { name: 'LinkedIn', Icon: Linkedin, href: import.meta.env.VITE_LINKEDIN_URL?.trim() },
];

const linkClass = 'text-sm text-slate-400 transition-colors hover:text-amber-400';
const socialIconClass = 'flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition-colors hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-400';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 border-b border-slate-800 pb-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:pb-12">
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white shadow-md shadow-amber-950/30 transition-transform group-hover:scale-105">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-amber-400">
                Estorvix
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Find your perfect place with Estorvix. Explore quality homes, discover great locations, and make confident property decisions.
            </p>
            <div className="flex items-center gap-3" aria-label="Social media">
              {socialLinks.map(({ name, Icon, href }) => href ? (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className={socialIconClass}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : (
                <span
                  key={name}
                  role="img"
                  aria-label={`${name} profile coming soon`}
                  title={`${name} profile coming soon`}
                  className={`${socialIconClass} cursor-default opacity-60`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h2>
            <ul className="space-y-3">
              <li><Link to="/" className={linkClass}>Home</Link></li>
              <li><Link to="/properties" className={linkClass}>Explore Properties</Link></li>
              <li><Link to="/properties?sort=featured" className={linkClass}>Featured Properties</Link></li>
              <li><Link to="/add-property" className={linkClass}>Add Property</Link></li>
              <li><Link to="/about" className={linkClass}>About Us</Link></li>
              <li><Link to="/inquiries" className={linkClass}>Customer Support</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">Property Categories</h2>
            <ul className="space-y-3">
              <li><Link to="/properties?type=Villa" className={linkClass}>Luxury Villas</Link></li>
              <li><Link to="/properties?type=Apartment" className={linkClass}>Apartments</Link></li>
              <li><Link to="/properties?type=Single+Family+Home" className={linkClass}>Independent Houses</Link></li>
              <li><Link to="/properties?type=Penthouse" className={linkClass}>Penthouses</Link></li>
              <li><Link to="/properties" className={linkClass}>Commercial Properties</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">Contact Us</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {businessEmail ? (
                  <a href={`mailto:${businessEmail}`} className={linkClass}>{businessEmail}</a>
                ) : (
                  <span className="text-slate-400">Email details coming soon</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {businessPhone ? (
                  <a href={`tel:${businessPhone}`} className={linkClass}>{businessPhone}</a>
                ) : (
                  <span className="text-slate-400">Phone details coming soon</span>
                )}
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>India</span>
              </li>
              <li className="pt-1">
                <Link to="/inquiries" className="inline-flex items-center rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Estorvix. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="transition-colors hover:text-amber-400">Privacy Policy</a>
            <a href="/terms-and-conditions" className="transition-colors hover:text-amber-400">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
