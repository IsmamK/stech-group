import SmallRibbon from "../ribbon/smallribbon";

function MissionVission({ data,id }) {
  return (
    <section className="missionvision" id={id}>
      <div className="container">
        {/* MISSION-VISION CONTENT START */}
        <div className="missionvision-content">
          {/* MISSION-VISION INFO START */}
          <div className="row">
            <div className="col-lg-8 col-12">
              {/* MISSION-VISION DETAILS START */}
              <div className="missionvision-details">
                {/* MISSION-VISION HEADER START */}
                <div className="missionvision-header">
                  <h1 className="missionvision-title">{data.title}</h1>

                  <div className="ribbon">
                    <img src="/images/ribbon-big.svg" alt="" />
                  </div>
                </div>
                {/* MISSION-VISION HEADER END */}

                {/* MISSION-VISION BODY START */}
                <div className="missionvision-body">
                  <p className="missionvision-text">{data.text}</p>
                </div>
                {/* MISSION-VISION BODY END */}
              </div>
              {/* MISSION-VISION DETAILS END */}
            </div>
          </div>
          {/* MISSION-VISION INFO END */}

          {/* MISSION START */}
          <div className="row g-lg-5 g-4">
            <div className="col-lg-6 col-12 d-flex align-items-center">
              <div className="missioninfo">
                <p className="missiontext">{data.images[0]?.description}</p>
              </div>
            </div>

            <div className="col-lg-6 col-12">
              <div className="mission-thumbnail">
                {data.images.length > 0 && (
                  <img
                    src={data.images[0].image}
                    alt="mission-thumbnail"
                    width={649}
                    height={427}
                  />
                )}
              </div>
            </div>
          </div>
          {/* MISSION END */}

          {/* VISION START */}
          <div className="row g-lg-5 g-4">
            <div className="col-lg-6 col-12">
              <div className="vision-thumbnail">
                {data.images.length > 1 && (
                  <img
                    src={data.images[1].image}
                    alt="vision-thumbnail"
                    width={649}
                    height={427}
                  />
                )}
              </div>
            </div>

            <div className="col-lg-6 col-12 d-flex align-items-center">
              <div className="visioninfo">
                <p className="visiontext">{data.images[1]?.description}</p>
              </div>
            </div>
          </div>
          {/* VISION END */}
        </div>
        {/* MISSION-VISION CONTENT END */}
      </div>
    </section>
  );
}

export default MissionVission;
