import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HeaderComponent() {
  const [inverted, setInverted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/layout/navbar`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch header data");
        }
        const data = await response.json();
        setHeaderData(data.header);
      } catch (error) {
        console.error("Error fetching header data:", error);
        setHeaderData({
          logo: {
            desktop: "/images/logo.svg",
            mobile: "/images/logo-mobile.svg",
            altText: "brand-logo",
          },
          navigation: [
            {
              label: "About Us",
              path: "/about",
              submenu: null,
              // submenu: [
              //   { label: "Chairman Message", path: "/about#chairman-message" },
              //   {
              //     label: "Board of Directors",
              //     path: "/about#corporate-directors",
              //   },
              //   { label: "Mission Vision", path: "/about#mission-vision" },
              //   { label: "Our Portfolio", path: "/about#company-portfolio" },
              // ],
            },
            { label: "Our Concern", path: "/our-concern", submenu: "dynamic" },
            { label: "Services", path: "/service", submenu: null },
            { label: "Gallery", path: "/gallery", submenu: null },
            { label: "News & Event", path: "/newsevents", submenu: null },
            { label: "Our Clients", path: "/clients", submenu: null },
            { label: "Contact Us", path: "/contact", submenu: null },
          ],
          brands: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setInverted(true);
      } else {
        setInverted(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAccordion = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    if (path.includes("#")) {
      const [basePath, hash] = path.split("#");

      navigate(basePath); // Navigate first

      // Scroll after small delay to allow page to render
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // slight delay ensures DOM is rendered
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <header className="header" dir="ltr">
        <div className="container">
          <div className="header-content">
            <div className="brandlogo">
              <a className="link" href="/" style={{ position: "relative" }}>
                <img src="/images/logo.svg" alt="brand-logo" />
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (!headerData) return null;

  return (
    <header className={inverted ? "header inverted" : "header"} dir="ltr">
      <div className="container">
        <div className="header-content">
          <div className="brandlogo">
            <a className="link" href="/" style={{ position: "relative" }}>
              <img
                src={headerData.logo.desktop}
                alt={headerData.logo.altText}
              />
            </a>
          </div>

          <nav className="mainmenu">
            <ul className="mainlist">
              {headerData.navigation.map((item, index) => (
                <li
                  key={index}
                  className="mainlist-item"
                  // className={`mainlist-item ${
                  //   item.submenu
                  //     ? item.label === "About Us"
                  //       ? "about-item"
                  //       : ""
                  //     : ""
                  // }`}
                >
                  <a
                    className="mainlist-link"
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.path);
                    }}
                  >
                    {item.label}
                  </a>
                  {item.submenu &&
                    item.label !== "About Us" &&
                    (item.submenu === "dynamic" ? (
                      <div className="subdropdownmenu">
                        <div className="container">
                          <div className="subdropdownlist">
                            {headerData.brands.map((brand) => (
                              <a
                                key={brand.slug}
                                href={`/our-concern/${brand.slug}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNavigation(
                                    `/our-concern/${brand.slug}`
                                  );
                                }}
                              >
                                <div className="card-concern">
                                  <div className="card-concern-thumbnail">
                                    <img
                                      src={brand.logo}
                                      alt={brand.name}
                                      width={157}
                                      height={150}
                                    />
                                  </div>
                                  <div className="card-concern-details">
                                    <h5 className="concern-title">
                                      {brand.name}
                                    </h5>
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="subdropdown">
                        <div className="sublist">
                          {item.submenu.map((subItem, subIndex) => (
                            <a
                              key={subIndex}
                              className="sublist-link"
                              href={subItem.path}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(subItem.path);
                              }}
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hamburger">
            <button
              className="btn-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6H21M3 12H21M3 18H21"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            className={`offcanvas offcanvas-top ${
              mobileMenuOpen ? "show" : ""
            }`}
            style={{ visibility: mobileMenuOpen ? "visible" : "hidden" }}
          >
            <div className="offcanvas-header">
              <div className="brandlogo">
                <a href="/" style={{ position: "relative" }}>
                  <img
                    src={headerData.logo.mobile}
                    alt={headerData.logo.altText}
                  />
                </a>
              </div>

              <button
                className="btn-close text-reset"
                onClick={handleAccordion}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path
                    d="M18 15.9L25.4 8.45L27.55 10.57L20.12 18L27.55 25.42L25.4 27.55L18 20.12L10.58 27.55L8.45 25.42L15.88 18L8.45 10.57L10.58 8.45L18 15.9Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>

            <div className="offcanvas-body">
              <div className="mobilemenu">
                {headerData.navigation.map((item, index) => (
                  <div key={index}>
                    <a
                      href={item.path}
                      className="mobilelink"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.path);
                      }}
                    >
                      {item.label}
                    </a>
                    {item.submenu && item.submenu !== "dynamic" && (
                      <div className="mobile-submenu">
                        {item.submenu.map((subItem, subIndex) => (
                          <a
                            key={subIndex}
                            href={subItem.path}
                            className="mobile-sublink"
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(subItem.path);
                            }}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
