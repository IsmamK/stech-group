import Gradient from "../ribbon/Gradient";


function ChairmanMessage({ data,id }) {
  console.log(data);
  return (
    <section className="chairmanmessage" id={id}>
      <div className="container">
        {/* CHAIRMAN-MESSAGE CONTENT START */}
        <div className="chairmanmessage-content">
          {/* CHAIRMAN-MESSAGE INFO START */}
          <div className="row">
            <div className="col-lg-5 col-12">
              {/* OUR-CONCERN DETAILS START */}
              <div className="chairmanmessage-details">
                {/* OUR-CONCERN HEADER START */}
                <div className="chairmanmessage-header">
                  <h1 className="chairmanmessage-title">{data.title}</h1>

                  <div className="ribbon">
                    <img src="../../../public/images/hero-logo.png" alt="" />
                  </div>
                </div>
                {/* OUR-CONCERN HEADER END */}

                {/* OUR-CONCERN BODY START */}
                <div className="chairmanmessage-body">
                  <p className="chairmanmessage-text">{data.text}</p>
                </div>
                {/* OUR-CONCERN BODY END */}
              </div>
              {/* OUR-CONCERN DETAILS END */}
            </div>
          </div>
          {/* CHAIRMAN-MESSAGE INFO END */}

          {/* CHAIRMAN-MESSAGE DESCRIPTIONS START */}
          <div className="row g-4">
            <div className="col-lg-5 col-12">
              <div className="chairman-profile">
                <div className="chaiman-thumbnail">
                  <img
                    src={data.images[0].image}
                    alt="chaiman-thumbnail"
                    width={526}
                    height={740}
                  />

                  <div className="chairmaninfo">
                    <h1 className="name">{data.images[0].primary_text}</h1>
                    <p className="post">{data.images[0].secondary_text}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-12">
              <div className="chairman-descript">
                <p className="breaf-text">{data.images[0].description}</p>
              </div>
            </div>
          </div>
          {/* CHAIRMAN-MESSAGE DESCRIPTIONS END */}
        </div>
        {/* CHAIRMAN-MESSAGE CONTENT END */}
      </div>
    </section>
  );
}

export default ChairmanMessage;
