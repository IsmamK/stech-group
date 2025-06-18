import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SmallRibbon() {
  const smallribbonicon = useRef(null);
  const smallpath1 = useRef(null);
  const smallpath2 = useRef(null);
  const smallpath3 = useRef(null);
  
  useEffect(() => {
    gsap.from(smallribbonicon.current, {
      scrollTrigger: smallribbonicon.current,
      stagger: 0.5,
    });

    gsap.from(smallpath1.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: 100,
      opacity: 0,
    });

    gsap.to(smallpath1.current, {
      scrollTrigger: smallpath2.current,
      y: 0,
    });

    gsap.from(smallpath2.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: 100,
      opacity: 0,
    });

    gsap.to(smallpath2.current, {
      scrollTrigger: smallpath2.current,
      y: 0,
    });

    gsap.from(smallpath3.current, {
      duration: 1,
      delay: 1,
      ease: "power2.in",
      y: -100,
      opacity: 0,
    });

    gsap.to(smallpath3.current, {
      scrollTrigger: smallpath2.current,
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
        id="smallpath-1"
        ref={smallpath1}
        d="M47.8311 31.1646V59.6352C47.8311 59.6352 41.6636 60.9864 35.4381 66.0182L31.0695 70.2583V47.9303L47.8311 31.1646Z"
        fill="#00FFAD"
      />
      <path
        id="smallpath-2"
        ref={smallpath2}
        d="M79 0V70.2586C79 70.2586 73.8646 62.2508 62.0353 59.3453C62.1182 59.2003 62.0353 51.9717 62.0353 51.9717V16.9647L79 0Z"
        fill="#00FFAD"
      />
      <path
        id="smallpath-3"
        ref={smallpath3}
        d="M78.9129 86.9417V96.7566L61.9109 113.759V100.077L61.8944 86.9417C61.9109 83.1036 58.7858 79.9825 54.9477 79.9825C51.1096 79.9825 47.9844 83.1077 47.9844 86.9417V117.874C47.9844 123.81 45.8208 129.248 42.2314 133.442C41.419 134.391 40.5362 135.278 39.5829 136.091C35.3966 139.676 29.9587 141.844 24.015 141.844C22.784 141.844 21.5944 141.744 20.4173 141.587C15.2487 140.799 10.6066 138.35 7.06689 134.822C3.74275 131.486 1.39265 127.188 0.460067 122.388C0.40204 122.085 0.36059 121.775 0.302563 121.472C0.132626 120.299 0.0455868 119.093 0.0455868 117.874V98.7212L0 98.7627L0.0165701 98.7212V78.9795L17.0351 61.9609V71.4898L17.0517 71.4733V117.874C17.0517 121.712 20.1728 124.821 23.9984 124.821C27.8489 124.821 30.9741 121.712 30.9741 117.874V86.9417C30.9741 83.0331 31.9067 79.3525 33.5646 76.0989C35.9147 71.4857 39.6948 67.7471 44.337 65.455C46.6581 64.2945 49.1947 63.5069 51.8722 63.1629C52.8753 63.0344 53.8908 62.964 54.9394 62.964C55.9549 62.964 56.9703 63.0386 57.9775 63.1629C58.1641 63.1795 58.3506 63.2044 58.5329 63.2334C63.7056 64.0209 68.3312 66.4581 71.8709 69.9977C75.4106 73.5374 77.8602 78.1796 78.6352 83.3523C78.83 84.5211 78.9129 85.7231 78.9129 86.9417Z"
        fill="#00FFAD"
      />
    </svg>
  );
}

function OurClients() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({
    title: "Our Top Clients",
    text: "We have served many national and international clients at Stech Group. Our clients are happy and satisfied because we never compromise our service quality at any cost. Some of our national and international clients are:"
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const response = await fetch(`${apiUrl}/home/clients`);
        if (!response.ok) {
          throw new Error('Failed to fetch clients data');
        }
        const responseData = await response.json();
        
        setData({
          title: responseData.title || data.title,
          text: responseData.description || data.text
        });
        
        setClients(responseData.clients || []);
      } catch (error) {
        console.error("Error fetching clients data:", error);
        // Fallback to default data if API fails
        setData({
          title: "Our Top Clients",
          text: "We have served many national and international clients at Stech Group. Our clients are happy and satisfied because we never compromise our service quality at any cost. Some of our national and international clients are:"
        });
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsData();
  }, [apiUrl]);

  if (loading) {
    return (
      <section className="ourclients">
        <div className="container">
          <div className="ourclients-content">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ourclients">
      <div className="container">
        {/* OUR-CONCERN CONTENT START */}
        <div className="ourclients-content">
          {/* CLIENTS INFO START */}
          <div className="row">
            <div className="col-lg-5 col-12">
              {/* OUR-CONCERN DETAILS START */}
              <div className="ourclients-details px-3 px-lg-0">
                {/* OUR-CONCERN HEADER START */}
                <div className="ourclients-header">
                  <h1 className="ourclients-title">{data.title}</h1>
                  <div className="ribbon">
                    <img src="/images/ribbon-big.svg" alt="" />
                  </div>
                </div>
                {/* OUR-CONCERN HEADER END */}

                {/* OUR-CONCERN BODY START */}
                <div className="ourclients-body">
                  <p className="ourclients-text">{data.text}</p>
                </div>
                {/* OUR-CONCERN BODY END */}
              </div>
              {/* OUR-CONCERN DETAILS END */}
            </div>
          </div>
          {/* CLIENTS INFO END */}

          {/* OUR CLIENTS START */}
          <div className="row g-4">
            {clients.map((client) => (
              <div key={client.name} className="col-lg-3 col-md-6 col-12">
                {/* CARD CLIENT START */}
                <div className="card-client">
                  <img
                    src={client.logo}
                    alt={client.name}
                    width={83}
                    height={24}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-client.png";
                    }}
                  />
                </div>
                {/* CARD CLIENT END */}
              </div>
            ))}
          </div>
          {/* OUR CLIENTS END */}
        </div>
        {/* OUR-CONCERN CONTENT END */}
      </div>
    </section>
  );
}

export default OurClients;