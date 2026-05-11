import Link from "next/link";
import { Activity } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Audit Engine", href: "#audit" },
    { label: "Pricing Intelligence", href: "#features" },
    { label: "Team Analytics", href: "#features" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      className="relative bg-[#030303] pt-20 pb-10 border-t border-white/[0.05] overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2.5 mb-5 group" aria-label="SpendSight AI Home">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/25 transition-all duration-300">
                <Activity className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">SpendSight AI</span>
            </Link>
            <p className="text-white/35 max-w-xs text-sm leading-relaxed font-light">
              The premier AI infrastructure audit platform for fast-growing startups and enterprises.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 text-white/80 text-sm tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <p>© {new Date().getFullYear()} SpendSight AI. A Credex Project.</p>
          <nav aria-label="Social links" className="flex items-center gap-5">
            {["Twitter", "GitHub", "LinkedIn"].map((name) => (
              <Link key={name} href="#" className="hover:text-white/70 transition-colors duration-200">
                {name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Large watermark */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none flex justify-center select-none opacity-[0.025]"
        aria-hidden="true"
      >
        <span className="text-[18vw] font-black tracking-tighter leading-none whitespace-nowrap text-white">
          SPENDSIGHT
        </span>
      </div>
    </footer>
  );
}
