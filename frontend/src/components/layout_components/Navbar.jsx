import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocaleDropdown, setShowLocaleDropdown] = useState(false);

  const data = [/*...your concern data here*/];

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const query = new URLSearchParams(location.search);

  const locales = ["en", "ar"];
  const currentLocale = pathname.split("/")[1];
  const [selectedLanguage, setSelectedLanguage] = useState(currentLocale.toUpperCase());

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY >= 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLanguageChange = (locale) => {
    setSelectedLanguage(locale.toUpperCase());
    setShowLocaleDropdown(false);
    const newPath = `/${locale}${pathname.replace(/^\/[a-z]{2}/, "")}`;
    navigate(`${newPath}?${query.toString()}`);
  };

  return (
    <header className={`w-full top-0 z-50 bg-black transition-shadow  fixe shadow-md `}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/">
          <img src="/images/logo.svg" alt="Logo" className="h-10" />
        </a>

        <nav className="hidden md:flex space-x-6 text-sm font-medium text-black">
          <a href="/" className="hover:text-teal-500">Home</a>
          <div className="relative group">
            <a href="/about" className="hover:text-teal-500">About Us</a>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded shadow-lg p-2 z-10">
              <a href="/about#chaimanmessages" className="block px-4 py-1 hover:bg-gray-100">Chairman Message</a>
              <a href="/about#bordofdirectors" className="block px-4 py-1 hover:bg-gray-100">Board of Directors</a>
              <a href="/about#missionvision" className="block px-4 py-1 hover:bg-gray-100">Mission Vision</a>
              <a href="/about#downloadourcompanyportfolio" className="block px-4 py-1 hover:bg-gray-100">Our Portfolio</a>
            </div>
          </div>
          <div className="relative group">
            <a href="/our-concern" className="hover:text-teal-500">Our Concern</a>
            <div className="absolute left-0 mt-2 hidden group-hover:grid grid-cols-2 gap-2 bg-white border rounded shadow-lg p-4 z-10 w-[600px] max-h-96 overflow-y-auto">
              {data.map((brand) => (
                <a key={brand.id} href={`/our-concern/${brand.slug}`} className="flex space-x-2 items-center">
                  <img src={brand.logo} alt={brand.name} className="w-12 h-12 object-cover" />
                  <span className="text-sm font-medium">{brand.name}</span>
                </a>
              ))}
            </div>
          </div>
          <a href="/service" className="hover:text-teal-500">Service</a>
          <a href="/gallery" className="hover:text-teal-500">Galler</a>
          <a href="/newsevents" className="hover:text-teal-500">News & Events</a>
          <a href="/clients" className="hover:text-teal-500">Our Clients</a>
          <a href="/contact" className="hover:text-teal-500">Contact Us</a>
          <div className="relative">
            <button onClick={() => setShowLocaleDropdown(!showLocaleDropdown)} className="uppercase hover:text-teal-500">
              {selectedLanguage}
            </button>
            {showLocaleDropdown && (
              <ul className="absolute right-0 mt-2 bg-white border rounded shadow-lg text-sm">
                {locales.map((locale) => (
                  <li
                    key={locale}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLanguageChange(locale)}
                  >
                    {locale.toUpperCase()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-black">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-2">
          <a href="/" className="block hover:text-teal-500">Home</a>
          <a href="/about" className="block hover:text-teal-500">About Us</a>
          <a href="/our-concern" className="block hover:text-teal-500">Our Concern</a>
          <a href="/service" className="block hover:text-teal-500">Service</a>
          <a href="/gallery" className="block hover:text-teal-500">Galler</a>
          <a href="/newsevents" className="block hover:text-teal-500">News & Events</a>
          <a href="/clients" className="block hover:text-teal-500">Our Clients</a>
          <a href="/contact" className="block hover:text-teal-500">Contact Us</a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
