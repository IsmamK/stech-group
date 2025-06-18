import React, { useState, useEffect } from "react";

function SmallRibbon() {
  return (
    <svg
      width="79"
      height="142"
      viewBox="0 0 79 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47.8311 31.1646V59.6352C47.8311 59.6352 41.6636 60.9864 35.4381 66.0182L31.0695 70.2583V47.9303L47.8311 31.1646Z"
        fill="#00FFAD"
      />
      <path
        d="M79 0V70.2586C79 70.2586 73.8646 62.2508 62.0353 59.3453C62.1182 59.2003 62.0353 51.9717 62.0353 51.9717V16.9647L79 0Z"
        fill="#00FFAD"
      />
      <path
        d="M78.9129 86.9417V96.7566L61.9109 113.759V100.077L61.8944 86.9417C61.9109 83.1036 58.7858 79.9825 54.9477 79.9825C51.1096 79.9825 47.9844 83.1077 47.9844 86.9417V117.874C47.9844 123.81 45.8208 129.248 42.2314 133.442C41.419 134.391 40.5362 135.278 39.5829 136.091C35.3966 139.676 29.9587 141.844 24.015 141.844C22.784 141.844 21.5944 141.744 20.4173 141.587C15.2487 140.799 10.6066 138.35 7.06689 134.822C3.74275 131.486 1.39265 127.188 0.460067 122.388C0.40204 122.085 0.36059 121.775 0.302563 121.472C0.132626 120.299 0.0455868 119.093 0.0455868 117.874V98.7212L0 98.7627L0.0165701 98.7212V78.9795L17.0351 61.9609V71.4898L17.0517 71.4733V117.874C17.0517 121.712 20.1728 124.821 23.9984 124.821C27.8489 124.821 30.9741 121.712 30.9741 117.874V86.9417C30.9741 83.0331 31.9067 79.3525 33.5646 76.0989C35.9147 71.4857 39.6948 67.7471 44.337 65.455C46.6581 64.2945 49.1947 63.5069 51.8722 63.1629C52.8753 63.0344 53.8908 62.964 54.9394 62.964C55.9549 62.964 56.9703 63.0386 57.9775 63.1629C58.1641 63.1795 58.3506 63.2044 58.5329 63.2334C63.7056 64.0209 68.3312 66.4581 71.8709 69.9977C75.4106 73.5374 77.8602 78.1796 78.6352 83.3523C78.83 84.5211 78.9129 85.7231 78.9129 86.9417Z"
        fill="#00FFAD"
      />
    </svg>
  );
}

function OurStrategies() {
  const [video, setVideo] = useState("");
  const [data, setData] = useState({
    title: "Our Strength",
    text: "💠 Highly Skilled Team#💠 Comprehensive Solutions#💠 Cost-Effective Services#💠 Proactive Approach#💠 Customer-Focused#💠 High-Quality Standards",
    videos: [{
      thumbnail: "",
      video: ""
    }],
    isActive: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/our-strength/`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        
        // Transform the API data to match the expected structure
        const transformedData = {
          title: result.title || "Our Strength",
          text: Array.isArray(result.text) ? 
               result.text.join("#") : 
               "💠 Highly Skilled Team#💠 Comprehensive Solutions#💠 Cost-Effective Services#💠 Proactive Approach#💠 Customer-Focused#💠 High-Quality Standards",
          videos: [{
            thumbnail: result.videos || "",
            video: "https://www.youtube.com/embed/dummy-video-id" // Default video URL
          }],
          isActive: result.isActive !== false // Default to true if not specified
        };

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use default data if API fails
        setData({
          title: "Our Strength",
          text: "💠 Highly Skilled Team#💠 Comprehensive Solutions#💠 Cost-Effective Services#💠 Proactive Approach#💠 Customer-Focused#💠 High-Quality Standards",
          videos: [{
            thumbnail: "",
            video: ""
          }],
          isActive: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="ourstrategies">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render the component if isActive is false
  if (!data.isActive) {
    return null;
  }

  return (
    <>
      <section className="ourstrategies">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5 col-12">
              {/* OUR-STRATEGIES DETAILS START */}
              <div className="ourstrategies-details px-3 px-lg-0">
                {/* OUR-STRATEGIES HEADER START */}
                <div className="strategies-header">
                  <h1 className="strategies-title">{data.title}</h1>

                  <div className="ribbon">
                    <img src="/images/ribbon-big.svg" alt="" />
                  </div>
                </div>
                {/* OUR-STRATEGIES HEADER END */}

                {/* OUR-STRATEGIES BODY START */}
                <div className="strategies-body">
                  <ul style={{ listStyle: "none" }}>
                    {data.text.split("#").map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                {/* OUR-STRATEGIES BODY END */}
              </div>
              {/* OUR-STRATEGIES DETAILS END */}
            </div>

            <div className="col-lg-7 col-12">
              {/* OUR-STRATEGIES THUMBNAIL START */}
              <div className="ourstrategies-thumbnail" style={{ position: "relative" }}>
                {data.videos[0]?.thumbnail && (
                  <img
                    src={data.videos[0].thumbnail}
                    alt="strategies-thumbnail"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}

                <button
                  className="btn-playpause"
                  data-bs-toggle="modal"
                  data-bs-target="#videoModal"
                  onClick={() =>
                    setVideo(
                      data.videos[0] ? 
                      `${data.videos[0].video}?autoplay=1` : 
                      ""
                    )
                  }
                >
                  <svg
                    width="144"
                    height="144"
                    viewBox="0 0 144 144"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="72"
                      cy="72"
                      r="72"
                      fill="white"
                      fillOpacity="0.5"
                    />
                    <circle
                      cx="72.7202"
                      cy="71.2787"
                      r="52.56"
                      fill="white"
                      fillOpacity="0.5"
                    />
                    <g clipPath="url(#videoplayicon)">
                      <path
                        d="M72.0004 105.606C53.4431 105.606 38.4004 90.5635 38.4004 72.0062C38.4004 53.449 53.4431 38.4062 72.0004 38.4062C90.5577 38.4062 105.6 53.449 105.6 72.0062C105.6 90.5635 90.5577 105.606 72.0004 105.606ZM67.3703 59.9606C67.1681 59.8257 66.9331 59.7482 66.6903 59.7363C66.4475 59.7244 66.206 59.7785 65.9915 59.893C65.7771 60.0075 65.5977 60.1779 65.4724 60.3863C65.3472 60.5947 65.2808 60.8331 65.2804 61.0762V82.9363C65.2808 83.1794 65.3472 83.4178 65.4724 83.6262C65.5977 83.8346 65.7771 84.005 65.9915 84.1195C66.206 84.234 66.4475 84.2881 66.6903 84.2762C66.9331 84.2643 67.1681 84.1868 67.3703 84.0518L83.7638 73.1251C83.9481 73.0024 84.0993 72.8361 84.2038 72.6409C84.3084 72.4457 84.3631 72.2277 84.3631 72.0062C84.3631 71.7848 84.3084 71.5668 84.2038 71.3716C84.0993 71.1764 83.9481 71.0101 83.7638 70.8874L67.367 59.9606H67.3703Z"
                        fill="#00FFAD"
                      />
                    </g>
                    <defs>
                      <clipPath id="videoplayicon">
                        <rect
                          width="80.64"
                          height="80.64"
                          fill="white"
                          transform="translate(31.6797 31.6875)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
              {/* OUR-STRATEGIES THUMBNAIL END */}
            </div>
          </div>
        </div>
      </section>
      
      {/* VIDEO MODAL START */}
      <div
        className="modal fade p-0"
        id="videoModal"
        tabIndex="-1"
        aria-labelledby="videoModal"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-body p-0">
              {/* MODAL CLOSE BUTTON START */}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setVideo("")}
              >
                <svg
                  width="112"
                  height="112"
                  viewBox="0 0 112 112"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#videoxicon)">
                    <circle cx="56" cy="46" r="40" fill="white" />
                  </g>
                  <path
                    d="M56 43.0547L66.3125 32.7422L69.2584 35.688L58.9459 46.0005L69.2584 56.313L66.3125 59.2589L56 48.9464L45.6875 59.2589L42.7417 56.313L53.0542 46.0005L42.7417 35.688L45.6875 32.7422L56 43.0547Z"
                    fill="#718096"
                  />
                  <defs>
                    <filter
                      id="videoxicon"
                      x="0"
                      y="0"
                      width="112"
                      height="112"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="10" />
                      <feGaussianBlur stdDeviation="8" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.0784314 0 0 0 0 0.145098 0 0 0 0 0.247059 0 0 0 0.06 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_159_47452"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="0.5" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.0470588 0 0 0 0 0.101961 0 0 0 0 0.294118 0 0 0 0.1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_159_47452"
                        result="effect2_dropShadow_159_47452"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow_159_47452"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </button>
              {/* MODAL CLOSE BUTTON END */}

              <iframe
                className="w-100 h-100"
                src={video}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      {/* VIDEO MODAL END */}
    </>
  );
}

export default OurStrategies;