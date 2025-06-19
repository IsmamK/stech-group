import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Parallax from "../../components/home_components/Parallax";
import Ribbon from "../../components/ribbon/ribbon";
import { AnimationWrapper } from "../hook/Animation";

gsap.registerPlugin(ScrollTrigger);

function BannerV2({ title, text, home, head_class }) {
  const container = useRef(null);
  const stechbanner = useRef(null);
  const stechbanner_content = useRef(null);
  const bd = useRef(null);
  const head = useRef(null);
  const sign = useRef(null);

  useEffect(() => {
    if (
      container.current &&
      stechbanner.current &&
      stechbanner_content.current &&
      bd.current &&
      head.current &&
      sign.current
    ) {
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
        .to(stechbanner_content.current, { zIndex: 3, duration: 0.1 }, "-=0.1")
        .to(head.current, { scale: 0.8 })
        .to(head.current, { color: "black", duration: 0.0 }, "-=0.36")
        .to(sign.current, { autoAlpha: 1, opacity: 1, duration: 0.2 }, "-=0.4");
    }
  }, []);

  return (
    <AnimationWrapper animationFiles={[
      'ScrollMagic.min.js',
      'simulation2.js',
      'moving.js'
      
    ]}>
      <>
        <section ref={stechbanner} className="stechbanner">
          <div ref={container} className="container">
            <div className="row">
              <div className="col-12">
                <div ref={stechbanner_content} className="stechbanner-content">
                  {home && (
                    <Parallax className="banner-3d banner-header">
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
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </Parallax>
                  )}

                  <div ref={bd} className="banner-details bd" id="trigger1">
                    <h1
                      dangerouslySetInnerHTML={{ __html: title }}
                      ref={head}
                      className={`head ${
                        head_class ? head_class : ""
                      } banner-title big-title-1 laxlax_preset_slideY:234.25:500`}
                    ></h1>
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
                  {/* STECH DIGITAL HEADER START */}
                  <div className="stechaesthetics-header">
                    <div ref={sign} className="ribbon sign">
                      <img src="/images/ribbon-big.svg" alt="" />
                    </div>
                  </div>
                  {/* STECH DIGITAL HEADER END */}

                  {/* STECH DIGITAL BODY START */}
                  <div className="stechaesthetics-body">
                    <p className="stechaesthetics-text">{text}</p>
                  </div>
                  {/* STECH DIGITAL BODY END */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </AnimationWrapper>
  );
}

export default BannerV2;
