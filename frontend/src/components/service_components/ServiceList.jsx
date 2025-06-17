import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

function Services() {
  // BannerV2 refs
  const container = useRef(null);
  const stechbanner = useRef(null);
  const stechbanner_content = useRef(null);
  const bd = useRef(null);
  const head = useRef(null);
  const sign = useRef(null);
  
  // SmallRibbon refs
  const smallribbonicon = useRef(null);
  const smallpath1 = useRef(null);
  const smallpath2 = useRef(null);
  const smallpath3 = useRef(null);

  // Dummy data
  const pageData = {
    title: "Our Services",
    text: "We offer a comprehensive range of digital services to help your business thrive in the modern landscape.",
    sections: [
      {
        title: "Digital Solutions",
        text: "Our team delivers cutting-edge digital solutions tailored to your business needs."
      }
    ],
    services: [
      {
        id: "01",
        title: "Web Development",
        text: "Custom website development with modern technologies and responsive design.",
        logo: "/images/web-dev-icon.png"
      },
      {
        id: "02",
        title: "UI/UX Design",
        text: "Beautiful and intuitive user interfaces designed for optimal user experience.",
        logo: "/images/uiux-icon.png"
      },
      {
        id: "03",
        title: "Digital Marketing",
        text: "Comprehensive digital marketing strategies to grow your online presence.",
        logo: "/images/marketing-icon.png"
      },
      {
        id: "04",
        title: "Branding",
        text: "Complete branding solutions to establish your unique identity in the market.",
        logo: "/images/branding-icon.png"
      },
      {
        id: "05",
        title: "Mobile Apps",
        text: "Cross-platform mobile applications built for performance and engagement.",
        logo: "/images/mobile-icon.png"
      },
      {
        id: "06",
        title: "SEO Services",
        text: "Search engine optimization to improve your visibility and organic traffic.",
        logo: "/images/seo-icon.png"
      }
    ]
  };

  // BannerV2 animations
  useEffect(() => {
    gsap.set(container.current, { autoAlpha: 1 });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: stechbanner.current,
          pin: bd.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: { duration: 1, ease: "none" },
      })
      .to(stechbanner_content.current, { "z-index": 3, duration: 0.1 }, "-=0.1")
      .to(head.current, { scale: 0.8 })
      .to(head.current, { color: "black", duration: 0.0 }, "-=0.36")
      .to(sign.current, { autoAlpha: 1, opacity: 1, duration: 0.2 }, "-=0.4");
  }, []);

  // SmallRibbon animations
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

  // SmallRibbon component
  const SmallRibbon = () => (
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

  // Ribbon component (simplified version)
  const Ribbon = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <path d="M50 0L100 50L50 100L0 50L50 0Z" fill="#00FFAD" />
    </svg>
  );

  // BannerV2 component
  const BannerV2 = () => (
    <>
    
      <section ref={stechbanner} className="stechbanner">
        
        <div ref={container} className="container">
         
          <div className="row">


            <div className="col-12">
              <div ref={stechbanner_content} className="stechbanner-content">
                <div className="banner-3d banner-header">
                  <div data-depth="0.1" style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img src="/images/hero-logo-2.png" alt="banner-logo" style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
                
                <div ref={bd} className="banner-details bd" id="trigger1">
                  <h1
                    dangerouslySetInnerHTML={{ __html: pageData.title }}
                    ref={head}
                    className={`head banner-title big-title-1 laxlax_preset_slideY:234.25:500`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="stechaesthetics">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-lg-auto col-12">
              <div className="stechaesthetics-content">
                <div className="stechaesthetics-header">
                  <div ref={sign} className="ribbon sign">
                    <Ribbon />
                  </div>
                </div>
                <div className="stechaesthetics-body">
                  <p className="stechaesthetics-text">{pageData.text}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <>
      <BannerV2 />
      
      {pageData.sections[0] && (
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
                        <SmallRibbon />
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
                {pageData.services.map((service) => (
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

export default Services;