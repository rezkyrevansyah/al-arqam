'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  HeartHandshake,
  CalendarDays,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_LINKS, type KegiatanSubItem } from '../data/constants';
import { useSiteData } from '../contexts/SiteDataContext';

const ICON_MAP = {
  Sparkles,
  HeartHandshake,
  CalendarDays,
  LayoutGrid,
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileKegiatanOpen, setIsMobileKegiatanOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === '/';

  const hasDonation = Boolean(
    data?.donation?.bankAccountNumber?.trim() || data?.donation?.qrisImageUrl?.trim()
  );

  const availableNavLinks = NAV_LINKS.filter((link) => {
    if (link.sectionId === 'tentang' && (!data?.board || data.board.length === 0)) {
      return false;
    }
    return true;
  });

  const isKegiatanActive =
    pathname.startsWith('/kegiatan') ||
    pathname.startsWith('/qurban') ||
    pathname.startsWith('/tahun-baru-islam') ||
    pathname.startsWith('/agenda') ||
    (isHomePage && activeSection === 'agenda');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (isHomePage) {
        const sections = ['agenda', 'artikel', 'galeri', 'tentang', 'donasi'];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navigateTo = (href: string, sectionId?: string) => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);

    if (sectionId && isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
    }

    router.push(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[hsl(var(--background))]/85 backdrop-blur-xl shadow-[0_1px_0_0_hsl(var(--border))]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => {
                if (isHomePage) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                router.push('/');
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm relative">
                <Image
                  src="/logo.png"
                  alt="Logo Masjid Al-Arqom"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="hidden sm:block font-display text-lg font-semibold text-[hsl(var(--foreground))] tracking-tight">
                Masjid Al Arqam
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {availableNavLinks.map((link) => {
                if (link.isDropdown && link.children) {
                  return (
                    <div
                      key={link.label}
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={() => setIsDropdownOpen(true)}
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                          isKegiatanActive
                            ? 'text-[hsl(var(--primary))]'
                            : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isDropdownOpen ? 'rotate-180 text-[hsl(var(--primary))]' : ''
                          }`}
                        />
                        {isKegiatanActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 bg-[hsl(var(--primary))]/5 rounded-lg"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>

                      {/* Floating Dropdown Card (SIMAS Style) */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute top-full left-0 mt-2 w-80 sm:w-[350px] bg-white rounded-2xl shadow-2xl shadow-black/15 border border-[hsl(var(--border))]/80 p-2.5 overflow-hidden z-50"
                          >
                            {/* Gold Top Accent Line */}
                            <div className="h-1 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--gold))] to-[hsl(var(--primary))] rounded-t-2xl absolute top-0 left-0 right-0" />

                            <div className="pt-1.5 space-y-1">
                              {link.children.map((child: KegiatanSubItem) => {
                                const IconComponent = ICON_MAP[child.iconName] || LayoutGrid;
                                const isChildActive = pathname === child.href;

                                return (
                                  <button
                                    key={child.href}
                                    onClick={() => navigateTo(child.href)}
                                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${
                                      isChildActive
                                        ? 'bg-[hsl(var(--primary))]/8 border border-[hsl(var(--primary))]/15'
                                        : 'hover:bg-[hsl(var(--muted))]/60'
                                    }`}
                                  >
                                    {/* Icon Badge */}
                                    <div
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${
                                        isChildActive
                                          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                                          : 'bg-[hsl(var(--primary))] text-white group-hover:bg-[hsl(var(--gold))] group-hover:scale-105'
                                      }`}
                                    >
                                      <IconComponent className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                                          {child.label}
                                        </p>
                                        {child.badge && (
                                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))]">
                                            {child.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug line-clamp-1">
                                        {child.description}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const isActive =
                  (!link.sectionId && pathname === link.href) ||
                  (isHomePage && activeSection === link.sectionId);

                return (
                  <button
                    key={link.href}
                    onClick={() => navigateTo(link.href, link.sectionId)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                      isActive
                        ? 'text-[hsl(var(--primary))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-[hsl(var(--primary))]/5 rounded-lg"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop CTA */}
            {hasDonation && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigateTo('/#donasi', 'donasi')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl text-sm font-semibold hover:bg-[hsl(var(--primary))]/90 transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--primary))]/20 active:scale-95"
                >
                  <Heart className="w-4 h-4" />
                  Donasi
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu utama'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 bg-[hsl(var(--background))]/95 backdrop-blur-xl border-b border-[hsl(var(--border))] shadow-2xl md:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="px-6 py-6 space-y-2">
              {availableNavLinks.map((link, index) => {
                if (link.isDropdown && link.children) {
                  return (
                    <div key={link.label} className="space-y-1">
                      <button
                        onClick={() => setIsMobileKegiatanOpen(!isMobileKegiatanOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] rounded-xl transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-[hsl(var(--gold))]" />
                          {link.label}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isMobileKegiatanOpen ? 'rotate-180 text-[hsl(var(--primary))]' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isMobileKegiatanOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="pl-3 pr-1 py-1 space-y-1.5 overflow-hidden"
                          >
                            {link.children.map((child: KegiatanSubItem) => {
                              const IconComponent = ICON_MAP[child.iconName] || LayoutGrid;
                              return (
                                <button
                                  key={child.href}
                                  onClick={() => navigateTo(child.href)}
                                  className="w-full flex items-start gap-3 p-2.5 rounded-xl bg-white border border-[hsl(var(--border))]/50 text-left hover:border-[hsl(var(--primary))]/30 transition-colors shadow-sm"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] text-white flex items-center justify-center flex-shrink-0">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-semibold text-xs text-[hsl(var(--foreground))]">
                                        {child.label}
                                      </p>
                                      {child.badge && (
                                        <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))]">
                                          {child.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-1">
                                      {child.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigateTo(link.href, link.sectionId)}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] rounded-xl transition-colors"
                  >
                    {link.label}
                  </motion.button>
                );
              })}

              {hasDonation && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => navigateTo('/#donasi', 'donasi')}
                  className="flex items-center gap-2 w-full px-4 py-3 mt-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl text-base font-semibold shadow-lg shadow-[hsl(var(--primary))]/20"
                >
                  <Heart className="w-4 h-4" />
                  Donasi
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


