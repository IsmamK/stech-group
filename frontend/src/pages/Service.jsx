import { useEffect, useState } from "react";
import BannerV2 from "../components/about_components/Banner2";
import SmallRibbon from "../components/ribbon/smallribbon";

function Service() {
  const [pageData, setPageData] = useState(null);
  console.log(pageData)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/service/service-list/`);
        const data = await res.json();
        setPageData(data);
      } catch (error) {
        console.error("Failed to fetch service data:", error);
      }
    };

    fetchPageData();
  }, []);

  if (!pageData) return <div>Loading...</div>;

  return (
    <>
      <BannerV2 title={pageData.title} text={pageData.text} home />

      {pageData.sections && pageData.sections[0] && (
        <section className="ourservices">
          <div className="container">
            <div className="ourservices-content">
              <div className="row">
                <div className="col-lg-5 col-12">
                  <div className="ourservices-details px-2 px-lg-0">
                    <div className="ourservices-header">
                      <h1 className="ourservices-title" style={{ color: "white" }}>
                        {pageData.sections[0].title}
                      </h1>
                      <div className="ribbon">
                        <img src="../../public/images/ribbon-big.svg" alt="" />
                      </div>
                    </div>

                    <div className="ourservices-body">
                      <p className="ourservices-text" style={{ color: "white" }}>
                        {pageData.sections[0].text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {pageData.services?.map((service) => (
                  <div key={service.id} className="col-lg-4 col-md-6 col-12">
                    <div className="cardservice">
                      <div className="servicecounter">
                        <h2 className="counter">{service.id}</h2>
                      </div>

                      <div className="cardservice-header">
                        <img
                          src={service.logo}
                          alt="serviceicon"
                          width={52}
                          height={52}
                        />
                        <h3 className="servicetitle">{service.title}</h3>
                      </div>

                      <div className="cardservice-body">
                        <p className="servicetext">{service.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Service;
