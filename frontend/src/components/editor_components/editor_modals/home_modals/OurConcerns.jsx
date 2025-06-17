import React from 'react';
import { useLocation } from 'react-router-dom';
import Brand from "../../../band/Brand";
import MobileBrand from "../../../band/MobileBrand";
import SmallRibbon from "../../../ribbon/smallribbon";

function OurConcerns({ data, brands }) {
  const location = useLocation();
  // For locale detection, you might need to implement your own logic
  // since React Router doesn't have built-in i18n like Next.js
  const isRTL = location.pathname.includes('/ar-AE/'); // Example RTL detection
  
  return (
    <section className="ourconcern">
      <div className="container">
        <div className="ourconcern-content">
          <div className="row">
            <div className="col-lg-5 col-12">
              <div className="ourconcern-details px-3 px-lg-0">
                <div className="ourconcern-header">
                  <h1 className="ourconcern-title">{data.title}</h1>

                  <div
                    className="ribbon"
                    style={{ left: isRTL ? "auto" : "0" }}
                  >
                    <img src="../../../../../public/images/ribbon-sm.svg" alt="" />
                  </div>
                </div>

                <div className="ourconcern-body">
                  <p className="ourconcern-text">{data.text}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-panel">
            <ul className="tab-nav">
              {brands.map((brand) => (
                <Brand key={brand.id} data={brand} />
              ))}
            </ul>
          </div>
          
          {/* MOBILE CONCERN DETAILS START */}
          <div className="mobile-concern">
            <div className="accordion" id="accordionConcern">
              {brands.map((brand) => (
                <MobileBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
          {/* MOBILE CONCERN DETAILS END */}
        </div>
      </div>
    </section>
  );
}

export default OurConcerns;