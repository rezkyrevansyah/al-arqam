import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Instagram, 
  Youtube, 
  Facebook 
} from 'lucide-react';
import { useSiteData } from '../contexts/SiteDataContext';
import type { SocialPlatform } from '../data/types';

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.7a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.13z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
};

const NAV_MENU = ['Agenda', 'Artikel', 'Galeri', 'Tentang', 'Donasi'];

export function Footer() {
  const { data } = useSiteData();
  const year = new Date().getFullYear();

  const footerData = data?.footer;
  const address = footerData?.address || '';
  const phone = footerData?.phone || '';
  const email = footerData?.email || '';
  const mapsUrl = footerData?.mapsUrl || '';
  const socials = footerData?.socials || [];

  return (
    <footer className="relative bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-[0.05]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Logo Masjid Al-Arqom" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="font-display text-lg font-semibold">Masjid Al-Arqom</span>
            </div>
            <p className="text-sm text-[hsl(var(--primary-foreground))]/60 leading-relaxed">
              Memakmurkan Masjid, Membangun Umat. Pusat kegiatan ibadah dan dakwah di RW 024, Kel. Harapan Jaya, Bekasi Utara
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-display font-semibold text-base mb-4">Kontak</h4>
            <div className="space-y-3">
              {address && (
                <div className="flex items-start gap-3 text-sm text-[hsl(var(--primary-foreground))]/70">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--gold-light))]" />
                  <span>{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--primary-foreground))]/70">
                  <Phone className="w-4 h-4 flex-shrink-0 text-[hsl(var(--gold-light))]" />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--primary-foreground))]/70">
                  <Mail className="w-4 h-4 flex-shrink-0 text-[hsl(var(--gold-light))]" />
                  <span>{email}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-display font-semibold text-base mb-4">Menu</h4>
            <div className="space-y-2.5">
              {NAV_MENU.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm text-[hsl(var(--primary-foreground))]/70 hover:text-[hsl(var(--primary-foreground))] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-display font-semibold text-base mb-4">Ikuti Kami</h4>
            {socials.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                {socials.map((link) => {
                  const Icon = link.platform === 'tiktok' ? null : SOCIAL_ICONS[link.platform as SocialPlatform];
                  
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-[hsl(var(--primary-foreground))]/10 flex items-center justify-center hover:bg-[hsl(var(--primary-foreground))]/20 transition-colors"
                    >
                      {link.platform === 'tiktok' ? (
                        <TikTokIcon className="w-4 h-4" />
                      ) : Icon ? (
                        <Icon className="w-4 h-4" />
                      ) : null}
                    </a>
                  );
                })}
              </div>
            )}

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--primary-foreground))]/10 rounded-xl text-sm font-medium hover:bg-[hsl(var(--primary-foreground))]/20 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[hsl(var(--gold-light))]" />
                Buka di Google Maps
                <ExternalLink className="w-3.5 h-3.5 text-[hsl(var(--primary-foreground))]/50" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[hsl(var(--primary-foreground))]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(var(--primary-foreground))]/40">
            © {year} DKM Masjid Jami' Al-Arqom. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-[hsl(var(--primary-foreground))]/40">
            Bekasi Utara, Kota Bekasi
          </p>
        </div>
      </div>
    </footer>
  );
}
