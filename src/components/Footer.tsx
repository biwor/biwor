import { getSettings } from "@/lib/data";
import HomeExtraSections from "@/components/HomeExtraSections";

type FooterProps = {
  companyName?: string;
  footerText?: string;
  email?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  logo?: string;
};

export default async function Footer(props: FooterProps) {
  const s = (await getSettings()) as any;
  const companyName = props.companyName || s.companyName || "BIWORSOURCING";
  const footerText = props.footerText || s.footerText;
  const email = props.email || s.email || "info@biworsourcing.com";
  const address = props.address || s.address || "Dhaka, Bangladesh";
  const phone = props.phone || s.phone;
  const whatsapp = props.whatsapp || s.whatsapp;
  const logo = props.logo || s.footerLogo || s.logo;
  const footerCopyright = s.footerCopyright;
  const footerCol2Title = s.footerCol2Title || "Quick Links";
  const footerCol3Title = s.footerCol3Title || "Contact";
  const socials = [
    { href: s.facebookUrl, label: "Facebook" },
    { href: s.linkedinUrl, label: "LinkedIn" },
    { href: s.instagramUrl, label: "Instagram" },
    { href: s.twitterUrl, label: "X" },
  ].filter((x) => x.href);

  return (
    <>
      <HomeExtraSections />
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
                  {socials.map((x) => (
                    <a key={x.label} href={x.href} target="_blank" rel="noreferrer" className="hover:text-white transition">
                      {x.label}
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
                {email && <li><a href={`mailto:${email}`} className="hover:text-white transition">{email}</a></li>}
                {phone && <li><a href={`tel:${phone}`} className="hover:text-white transition">{phone}</a></li>}
                {whatsapp && (
                  <li>
                    <a href={`https://wa.me/${String(whatsapp).replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-white transition">WhatsApp</a>
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
    </>
  );
}
