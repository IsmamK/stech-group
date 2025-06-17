import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function GradientRibbon() {
  const smallribbonicon = useRef(null);
  const smallpathG1 = useRef(null);
  const smallpathG2 = useRef(null);
  const smallpathG3 = useRef(null);
  
  useEffect(() => {
    gsap.from(smallribbonicon.current, {
      scrollTrigger: smallribbonicon.current,
      stagger: 0.5,
    });

    gsap.from(smallpathG1.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: 100,
      opacity: 0,
    });

    gsap.to(smallpathG1.current, {
      scrollTrigger: smallpathG2.current,
      y: 0,
    });

    gsap.from(smallpathG2.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: 100,
      opacity: 0,
    });

    gsap.to(smallpathG2.current, {
      scrollTrigger: smallpathG2.current,
      y: 0,
    });

    gsap.from(smallpathG3.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: -100,
      opacity: 0,
    });

    gsap.to(smallpathG3.current, {
      scrollTrigger: smallpathG2.current,
      y: 0,
    });
  }, []);
  
  return (
    <svg
      id="smallribbonicon"
      ref={smallribbonicon}
      width="79"
      height="142"
      viewBox="0 0 79 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="smallpath-g-1"
        ref={smallpathG1}
        d="M47.8335 31.1665V59.6387C47.8335 59.6387 41.6657 60.9899 35.4399 66.022L31.071 70.2623V47.9331L47.8335 31.1665Z"
        fill="url(#paint-1)"
      />
      <path
        id="smallpath-g-2"
        ref={smallpathG2}
        d="M79 0V70.2623C79 70.2623 73.8643 62.2541 62.0344 59.3484C62.1173 59.2034 62.0344 51.9744 62.0344 51.9744V16.9656L79 0Z"
        fill="url(#paint-2)"
      />
      <path
        id="smallpath-g-3"
        ref={smallpathG3}
        d="M78.9171 86.9461V96.7615L61.9142 113.764V100.082L61.8976 86.9461C61.9142 83.1078 58.7889 79.9866 54.9506 79.9866C51.1123 79.9866 47.9869 83.1119 47.9869 86.9461V117.88C47.9869 123.816 45.8232 129.254 42.2336 133.449C41.4212 134.398 40.5383 135.285 39.585 136.098C35.3985 139.683 29.9602 141.851 24.0163 141.851C22.7852 141.851 21.5956 141.752 20.4184 141.594C15.2495 140.807 10.6071 138.357 7.06726 134.829C3.74295 131.493 1.39272 127.194 0.460091 122.394C0.402061 122.092 0.360622 121.781 0.302591 121.478C0.132645 120.305 0.0455892 119.099 0.0455892 117.88V98.7263L0 98.7677L0.0165836 98.7263V78.9835L17.036 61.964V71.4934L17.0526 71.4769V117.88C17.0526 121.719 20.1738 124.827 23.9997 124.827C27.8504 124.827 30.9758 121.719 30.9758 117.88V86.9461C30.9758 83.0373 31.9084 79.3566 33.5664 76.1027C35.9166 71.4893 39.6969 67.7505 44.3393 65.4583C46.6605 64.2977 49.1973 63.5101 51.875 63.1661C52.8781 63.0376 53.8936 62.9671 54.9423 62.9671C55.9578 62.9671 56.9733 63.0417 57.9806 63.1661C58.1671 63.1827 58.3536 63.2076 58.536 63.2366C63.709 64.0241 68.3348 66.4614 71.8747 70.0012C75.4145 73.5411 77.8643 78.1835 78.6394 83.3565C78.83 84.5254 78.9171 85.7274 78.9171 86.9461Z"
        fill="url(#paint-3)"
      />
      <defs>
        <linearGradient
          id="paint-1"
          x1="39.6349"
          y1="30.1768"
          x2="38.7941"
          y2="138.227"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFAD" />
          <stop offset="0.1466" stopColor="#00E3B7" />
          <stop offset="0.4631" stopColor="#009DD0" />
          <stop offset="0.9223" stopColor="#002DF8" />
          <stop offset="0.9995" stopColor="#0019FF" />
        </linearGradient>
        <linearGradient
          id="paint-2"
          x1="70.621"
          y1="30.4178"
          x2="69.7802"
          y2="138.468"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFAD" />
          <stop offset="0.1466" stopColor="#00E3B7" />
          <stop offset="0.4631" stopColor="#009DD0" />
          <stop offset="0.9223" stopColor="#002DF8" />
          <stop offset="0.9995" stopColor="#0019FF" />
        </linearGradient>
        <linearGradient
          id="paint-3"
          x1="39.9178"
          y1="30.179"
          x2="39.0769"
          y2="138.229"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFAD" />
          <stop offset="0.1466" stopColor="#00E3B7" />
          <stop offset="0.4631" stopColor="#009DD0" />
          <stop offset="0.9223" stopColor="#002DF8" />
          <stop offset="0.9995" stopColor="#0019FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CompanyValues() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/company-values/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <section className="companyvalues">
      <div className="container">
        <div className="row g-4 g-lg-0 align-items-center">
          <div className="col-lg-5 col-12">
            {/* COMPANYVALUE THUMBNAIL START */}
            <div className="companyvalue-thumbnail" style={{ position: "relative" }}>
              <img
                src={data.image}
                alt="companyvalue-thumbnail"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {/* COMPANYVALUE THUMBNAIL END */}
          </div>

          <div className="offset-0 offset-lg-1 col-lg-6 col-12">
            {/* COMPANY VALUES DETAILS START */}
            <div className="companyvalus-details">
              {/* COMPANY VALUES HEADER START */}
              <div className="companyvalues-header">
                <div className="companyvalues-head">
                  <h1 className="companyvalues-title">{data.title}</h1>

                  <div className="ribbon">
                    <img src="../../../public/images/hero-logo.png" alt="" />
                  </div>
                </div>
                <p className="companyvalue-text text">{data.text}</p>
              </div>
              {/* COMPANY VALUES HEADER END */}

              {/* COMPANY VALUES BODY START */}
              <div className="companyvalues-body">
                <div className="row g-4">
                  {/* SINGLE VALUE START */}
                  {data.values.map((value) => (
                    <div key={value.id} className="col-md-6 col-12">
                      <div className="companyvalue">
                        <div className="companyvalue-header">
                          <h5 className="valuetitle">{value.name}</h5>
                          <p className="actualvalue">{value.valuenow}%</p>
                        </div>

                        <div className="companyvalue-body">
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${value.valuenow}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* SINGLE VALUE END */}
                </div>
              </div>
              {/* COMPANY VALUES BODY END */}
            </div>
            {/* COMPANY VALUES DETAILS END */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyValues;