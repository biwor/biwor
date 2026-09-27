type FooterProps = {
  companyName?: string;
  footerText?: string;
  email?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  logo?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  footerCopyright?: string;
  footerCol2Title?: string;
  footerCol3Title?: string;
};

export default function Footer({
  companyName = "BIWORSOURCING",
  footerText,
  email = "info@biworsourcing.com",
  address = "Dhaka, Bangladesh",
  phone,
  whatsapp,
  logo,
  facebookUrl,
  linkedinUrl,
  instagramUrl,
  twitterUrl,
  footerCopyright,
  footerCol2Title = "Quick Links",
  footerCol3Title = "Contact",
}: FooterProps) {
  const socials = [
    { href: facebookUrl, label: "Facebook" },
    { href: linkedinUrl, label: "LinkedIn" },
    { href: instagramUrl, label: "Instagram" },
    { href: twitterUrl, label: "X" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={companyName} className="h-10 w-auto mb-3 object-contain" />
            ) : (
              <div className="font-bold text-xl text-white mb-3 tracking-tight">
                BIWOR<span className="text-amber-400">SOURCING</span>
              </div>
            )}
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              {footerText || "A registered apparel buying house in Bangladesh. We source quality garments for global brands with full transparency and compliance."}
            </p>
            {socials.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white transition">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">{footerCol2Title}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-white transition">About</a></li>
              <li><a href="#services" className="hover:text-white transition">Services</a></li>
              <li><a href="#products" className="hover:text-white transition">Products</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">{footerCol3Title}</h4>
            <ul className="space-y-2.5 text-sm">
              {address && <li>{address}</li>}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-white transition">{email}</a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone}`} className="hover:text-white transition">{phone}</a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-white transition">
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-600">
          {footerCopyright || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
