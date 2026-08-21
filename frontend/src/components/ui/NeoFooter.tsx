import { Mail, MapPin, Globe } from "lucide-react";

export function NeoFooter() {
  const footerLinks = [
    {
      title: "Discover",
      links: [
        { label: "All Events", href: "/" },
        { label: "Featured", href: "/" },
        { label: "Categories", href: "/" },
        { label: "Host an Event", href: "/admin/login" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQs", href: "#" },
        { label: "Contact Us", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#FFD23F] border-t-[3px] border-black mt-20 relative">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-4xl font-black font-display tracking-tight uppercase">Eventure.</h2>
            <p className="text-black font-medium border-2 border-black p-3 bg-white shadow-[4px_4px_0px_0px_#000]">
              The boldest platform for discovering and hosting incredible events.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-black text-xl font-black font-display uppercase mb-6 border-b-2 border-black pb-2 inline-block">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-black font-bold uppercase hover:bg-black hover:text-white transition-colors px-2 py-1 -ml-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-black text-xl font-black font-display uppercase mb-6 border-b-2 border-black pb-2 inline-block">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-black font-bold uppercase">
                <div className="p-2 bg-white border-2 border-black"><Mail size={18} strokeWidth={2.5} /></div>
                <a href="mailto:hello@eventure.com" className="hover:underline">hello@eventure.com</a>
              </li>
              <li className="flex items-center gap-3 text-black font-bold uppercase">
                <div className="p-2 bg-[#00E5FF] border-2 border-black"><MapPin size={18} strokeWidth={2.5} /></div>
                <span>Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Huge Bottom Text */}
        <div className="mt-20 pt-10 border-t-[3px] border-black flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-7xl md:text-9xl font-black font-display tracking-tighter text-black/10 select-none">
            EVENTURE
          </h1>
          <div className="flex flex-col items-end gap-2">
            <a href="#" className="flex items-center gap-2 font-bold uppercase bg-white border-2 border-black px-4 py-2 hover:bg-[#FF3366] hover:text-white transition-colors">
              <Globe size={18} strokeWidth={2.5} /> Website
            </a>
            <p className="font-bold uppercase text-sm">
              &copy; {new Date().getFullYear()} Eventure
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
