import { useState, useEffect } from 'react';
import Banner from '../components/banner';
import BannerV2 from '../components/about_components/Banner2';

function BrandPage() {
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract slug from URL (you might need to adjust this based on your routing)
        const slug = window.location.pathname.split('/').pop();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/home/our-clients/${slug}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch brand data');
        }
        
        const data = await res.json();
        setBrandData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!brandData) return <div>No brand data found</div>;

  return (
    <>
      <BannerV2 title={brandData.title} text={brandData.text} home/>
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
                    {brandData.sections.title}
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
                          {brandData.sections.images[0] ? (
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
                        <a
                          className="gallery-link"
                          data-caption="Contrary to popular belief."
                        >
                          {brandData.sections.images[1] ? (
                            <>
                              <img
                                src={brandData.sections.images[1].image}
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
                        <a
                          className="gallery-link"
                          data-caption="Contrary to popular belief."
                        >
                          {brandData.sections.images[2] ? (
                            <>
                              <img
                                src={brandData.sections.images[2].image}
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
                      <div className="gallery-thumbs">
                        <a
                          className="gallery-link"
                          data-caption="Contrary to popular belief."
                        >
                          {brandData.sections.images[3] ? (
                            <>
                              <img
                                src={brandData.sections.images[3].image}
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

                        <a
                          className="gallery-link"
                          data-caption="Contrary to popular belief."
                        >
                          {brandData.sections.images[4] ? (
                            <>
                              <img
                                src={brandData.sections.images[4].image}
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

                        <a
                          className="gallery-link biglink"
                          data-caption="Contrary to popular belief."
                        >
                          {brandData.sections.images[5] ? (
                            <>
                              <img
                                src={brandData.sections.images[5].image}
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