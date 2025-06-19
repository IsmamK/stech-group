import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import ParallaxJS from '../../components/home_components/parallaxjs';

function BrandPage() {
  const { slug } = useParams();
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(brandData)

  // For testing purposes, we'll use the provided JSON directly
   useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/our-concern/`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch brand data: ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data)
        const matchedBrand = data.brands.find((brand) => brand.slug === slug);
        console.log(matchedBrand)
        

        if (matchedBrand) {
          setBrandData(matchedBrand);
        } else {
          console.error("No brand found with that slug");
        }

      } catch (err) {
        setError(err.message);
        console.error("Error fetching brand data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [slug, apiUrl]);

  const Banner = ({ home, title }) => {
    return (
      <section className="stechbanner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="stechbanner-content">
                {home && (
                  <ParallaxJS className="banner-3d banner-header">
                    <div
                      data-depth="0.1"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <img
                        src="/images/hero-logo-2.png"
                        alt="banner-logo"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </ParallaxJS>
                )}
                <div className="banner-details" id="trigger1">
                  {title ? (
                    <h1
                      dangerouslySetInnerHTML={{ __html: title }}
                      className="banner-title big-title-1 laxlax_preset_slideY:234.25:500"
                      id="pin1"
                    ></h1>
                  ) : (
                    <h1
                      className="banner-title big-title-1 laxlax_preset_slideY:234.25:500"
                      id="pin1"
                    >
                      Stech Digital Design <br /> Boutique with Focus on
                      Aesthetics
                    </h1>
                  )}
                </div>
                <div className="main-container">
                  <div id="slide01" className="slide">
                    <div className="pin-wrapper">
                      <div className="wrapper">
                        {title ? (
                          <h1
                            dangerouslySetInnerHTML={{ __html: title }}
                            className="banner-title big-title-1"
                          ></h1>
                        ) : (
                          <h1 className="banner-title big-title-1">
                            Stech Digital Design <br /> Boutique with Focus on
                            Aesthetics
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>

                  <div id="slide02" className="slide">
                    <div className="pin-wrapper">
                      <div className="wrapper">
                        {title ? (
                          <h1
                            dangerouslySetInnerHTML={{ __html: title }}
                            className="banner-title big-title-1"
                          ></h1>
                        ) : (
                          <h1 className="banner-title big-title-1">
                            Stech Digital Design <br /> Boutique with Focus on
                            Aesthetics
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
        />
      </div>
    );
  }

  if (!brandData) {
    return <div className="no-data">No brand data available</div>;
  }

  return (
    <>
      <Banner title={brandData.banner_title} home />
      <section className="concernaesthetics">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-lg-auto col-12">
              <div className="concernaesthetics-content">
                {/* <!-- STECH DIGITAL HEADER START --> */}
                <div className="concernaesthetics-header">
                  <div className="brandlogo">
                    <img
                      src={brandData.logo}
                      alt="concern-thumbnail"
                      width={170}
                      height={200}
                    />
                  </div>

                  <h1 className="concernaesthetics-title big-title-1">
                    {brandData?.banner_title}
                  </h1>
                </div>
                {/* <!-- STECH DIGITAL HEADER END --> */}

                {/* <!-- STECH DIGITAL BODY START --> */}
                <div className="concernaesthetics-body">
                  <p className="concernaesthetics-text">
                    {brandData.sections.text}
                  </p>

                  <a
                    target={"_blank"}
                    rel="noreferrer"
                    href={brandData.site_url}
                    className="link"
                  >
                    <span className="text">Visit Site</span>
                    <span className="icon">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.56564 1.44455C4.7365 1.27369 5.0135 1.27369 5.18436 1.44455L10.4344 6.69455C10.6052 6.8654 10.6052 7.14241 10.4344 7.31327L5.18436 12.5633C5.0135 12.7341 4.7365 12.7341 4.56564 12.5633C4.39479 12.3924 4.39479 12.1154 4.56564 11.9445L9.50628 7.00391L4.56564 2.06327C4.39479 1.89241 4.39479 1.6154 4.56564 1.44455Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </a>
                </div>
                {/* <!-- STECH DIGITAL BODY END --> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="concerndetails">
        <div className="container">
          <div className="row g-0">
            <div className="col-lg-10 mx-lg-auto col-12 p-0">
              <div className="concerndetails-content">
                <div className="gallery">
                  <div className="row g-4">
                    <div className="col-md-6 col-12">
                      <div className="gallery-thumbs">
                        <a
                          className="gallery-link biglink"
                          data-caption="Contrary to popular belief."
                        >
                          {brandData.sections.images && brandData.sections.images[0] ? (
                            <>
                              <img
                                src={brandData.sections.images[0].image}
                                alt="Brand-Thumnail"
                                width={528}
                                height={711}
                              />
                              <div className="caption">
                                <h2 className="caption-title">
                                  Contrary to popular belief.
                                </h2>
                              </div>
                            </>
                          ) : (
                            <div
                              style={{ width: "528px", height: "711px" }}
                            ></div>
                          )}
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      {/* Additional gallery items can be added here if needed */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BrandPage;