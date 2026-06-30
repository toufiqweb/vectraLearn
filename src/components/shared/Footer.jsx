import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import standaloneIcon from "@/assets/standaloneIcon.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-background border-t border-card-border pt-20 pb-10 transition-colors duration-300">
      {/* Structural Atmospheric Glow Accents utilizing Theme variables */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-brand-cyan/5 blur-[120px]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-ocean/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 pb-16">
          {/* Brand Presentation Column (Takes up 4 cols on large layouts) */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group active:scale-95 transition-transform"
            >
              <div className="flex">
                <Image
                  src={standaloneIcon}
                  alt="VectraLern"
                  width={48}
                  height={48}
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold text-[#22E6D8] leading-none tracking-wide">
                  VectraLearn
                </span>
                <span className="text-[0.55rem] md:text-[0.65rem] font-bold text-foreground/70 tracking-[0.2em] mt-1 uppercase">
                  Global Online Education
                </span>
              </div>
            </Link>

            <p className="max-w-xs text-xs font-semibold leading-relaxed text-muted">
              Empowering learners worldwide through high-quality online
              education, practical skills, and interactive, industry-focused
              courses.
            </p>

            {/* Circular Social Platform Links Grid */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: <FaFacebookF size={12} />, href: "#" },
                { icon: <FaTwitter size={12} />, href: "#" },
                { icon: <FaInstagram size={12} />, href: "#" },
                { icon: <FaLinkedinIn size={12} />, href: "#" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-card-bg/40 text-muted transition-all duration-300 hover:border-brand-mint hover:bg-main-gradient hover:text-white hover:-translate-y-0.5 shadow-sm"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Column: Quick Links (Takes 2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Courses", path: "/courses" },
                { name: "Instructors", path: "/instructors" },
                { name: "Pricing", path: "/pricing" },
                { name: "About Us", path: "/about" },
                { name: "Blog", path: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-xs font-semibold text-muted transition-colors duration-200 hover:text-brand-mint"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column: Support Details (Takes 2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", path: "/help" },
                { name: "Contact Us", path: "/contact" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "FAQ", path: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-xs font-semibold text-muted transition-colors duration-200 hover:text-brand-mint"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column: Contact & CTA Panel (Takes 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
              Contact Info
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-muted font-semibold group cursor-pointer">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-card-border bg-card-bg/30 text-brand-ocean group-hover:text-brand-mint transition-colors">
                  <Mail size={13} />
                </div>
                <span className="group-hover:text-foreground transition-colors">
                  hello@vectralearn.com
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted font-semibold group cursor-pointer">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-card-border bg-card-bg/30 text-brand-ocean group-hover:text-brand-mint transition-colors">
                  <Phone size={13} />
                </div>
                <span className="group-hover:text-foreground transition-colors">
                  +1 (555) 123-4567
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted font-semibold group cursor-pointer">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-card-border bg-card-bg/30 text-brand-ocean group-hover:text-brand-mint transition-colors">
                  <MapPin size={13} />
                </div>
                <span className="group-hover:text-foreground transition-colors">
                  New York, USA
                </span>
              </div>
            </div>

            {/* Premium Interactive Floating Action Card */}
            <div className="pt-2">
              <Link
                href="/become-instructor"
                className="group flex items-center justify-between p-3.5 px-5 rounded-2xl border border-card-border bg-card-bg/50 backdrop-blur-md hover:border-brand-mint/40 transition-all duration-300"
              >
                <div className="text-left">
                  <p className="text-xs font-black text-foreground">
                    Share Your Knowledge
                  </p>
                  <p className="text-[10px] font-semibold text-muted">
                    Become an Instructor
                  </p>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan group-hover:bg-main-gradient group-hover:text-white transition-all duration-300">
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Copyright and Legal Links Row */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-card-border/60 pt-8 text-[11px] font-bold text-muted sm:flex-row">
          <p>© 2026 VectraLearn. All rights reserved.</p>

          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((legal) => (
              <Link
                key={legal}
                href={`/${legal.toLowerCase()}`}
                className="hover:text-brand-mint transition-colors duration-200"
              >
                {legal}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
