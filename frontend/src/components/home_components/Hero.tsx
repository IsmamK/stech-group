import React, { useState, useEffect } from "react";
import ParallaxJS from "./ParallaxJS";

function Hero() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/home/hero`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHeroData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!heroData) return <div>No hero data found</div>;

  return (
    <section className="stechbanner ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="stechbanner-content">
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
                    src={heroData.logo_url || "/images/hero-logo-2.png"}
                    alt="banner-logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </ParallaxJS>

              <div className="banner-details" id="trigger1">
                <h1
                  className="banner-title big-title-1 laxlax_preset_slideY:234.25:500"
                  id="pin1"
                  dangerouslySetInnerHTML={{ __html: heroData.title }}
                />
              </div>

              <div className="main-container">
                {heroData?.slides?.map((slide, index) => (
                  <div
                    key={`slide0${index + 1}`}
                    id={`slide0${index + 1}`}
                    className="slide"
                  >
                    <div className="pin-wrapper">
                      <div className="wrapper">
                        <h1
                          className="banner-title big-title-1"
                          dangerouslySetInnerHTML={{ __html: slide.content }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
