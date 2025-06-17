import React from 'react';

function MobileBrand({ brand }) {
  return (
    <div key={brand.id} className="accordion-item">
      <h2 className="accordion-header" id={"heading-" + brand.id}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#collapse-" + brand.id}
          aria-expanded="false"
          aria-controls={"collapse-" + brand.id}
        >
          {/* CARD-CONCERN START */}
          <div className="card-concern">
            {/* CARD-CONCERN THUMBNAIL */}
            <div className="card-concern-thumbnail">
              <img
                src={brand.logo}
                alt="card-thumbnail"
                width={60}
                height={71}
              />
            </div>
            {/* CARD-CONCERN THUMBNAIL */}

            {/* CARD-CONCERN DETAILS */}
            <div className="card-concern-details">
              <h5 className="concern-title">{brand.name}</h5>
            </div>
            {/* CARD-CONCERN DETAILS */}
          </div>
          {/* CONCERN-CONCERN END */}
        </button>
      </h2>

      <div
        id={"collapse-" + brand.id}
        className="accordion-collapse collapse"
        aria-labelledby={"heading-" + brand.id}
        data-bs-parent="#accordionConcern"
      >
        <div className="accordion-body">
          {/* CONCERN-INFO START */}
          <div className="concern-info-mobile">
            {/* INFO START */}
            <div className="info">
              <h2 className="info-title" id="featured-title">
                {brand.sections.images[0] &&
                  brand.sections.images[0].primary_text}
              </h2>
            </div>
            {/* INFO END */}
            {/* CONCERN THUMBNAIL START */}
            <div className="concern-thumbnail">
              {brand.sections.images[0] && (
                <img
                  src={brand.sections.images[0].image}
                  alt="concern-thumbnail"
                  width={126}
                  height={190}
                />
              )}
            </div>
            {/* CONCERN THUMBNAIL END */}
          </div>
          {/* CONCERN-INFO END */}
        </div>
      </div>
    </div>
  );
}

export default MobileBrand;