import { useState } from "react";
import SmallRibbon from "../ribbon/smallribbon";

function CorporateDirectors({ data,id }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("/images/director-1.png");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");

  const handleModalContent = (name, image, position, description) => {
    setShowModal(true);
    setName(name);
    setImage(image);
    setPosition(position);
    setDescription(description);
  };

  return (
    <>
      <section className="corporatedirectors" id={id}>
        <div className="container">
          <div className="corporatedirectors-content">
            <div className="row">
              <div className="col-lg-5 col-12">
                <div className="corporatedirectors-details">
                  <div className="corporatedirectors-header">
                    <h1 className="corporatedirectors-title">{data.title}</h1>
                    <div className="ribbon">
                      <img src="../../../public/images/ribbon-big.svg" alt="" />
                    </div>
                  </div>
                  <div className="corporatedirectors-body">
                    <p className="corporatedirectors-text">{data.text}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="corporatedirector">
              <div className="row gx-4 gy-lg-5 gy-4">
                {data.images.map((imageItem) => (
                  <div
                    key={imageItem.id}
                    className="col-lg-3 col-md-4 col-sm-6 col-12 d-flex flex-center"
                  >
                    <button
                      className="btn-director"
                      type="button"
                      onClick={() =>
                        handleModalContent(
                          imageItem.primary_text,
                          imageItem.image,
                          imageItem.secondary_text,
                          imageItem.description
                        )
                      }
                    >
                      <div className="card-director">
                        <div className="card-director-header">
                          <img
                            src={imageItem.image}
                            alt="director-thumbnail"
                            width={306}
                            height={371}
                          />
                        </div>
                        <div className="card-director-body">
                          <h3 className="name">{imageItem.primary_text}</h3>
                          <p className="position">{imageItem.secondary_text}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className={`modal fade p-0 ${showModal ? "show" : ""}`}
        id="directorModal"
        tabIndex="-1"
        aria-labelledby="directorModal"
        aria-hidden="false"
        style={showModal ? { display: "block" } : { display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-md-scrollable modal-xl">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <svg
                width="112"
                height="112"
                viewBox="0 0 112 112"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#modxicon)">
                  <circle cx="56" cy="46" r="40" fill="white" />
                </g>
                <path
                  d="M56 43.0547L66.3125 32.7422L69.2584 35.688L58.9459 46.0005L69.2584 56.313L66.3125 59.2589L56 48.9464L45.6875 59.2589L42.7417 56.313L53.0542 46.0005L42.7417 35.688L45.6875 32.7422L56 43.0547Z"
                  fill="#718096"
                />
                <defs>
                  <filter
                    id="modxicon"
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

            <div className="modal-body p-0">
              <div className="directormodalinfo">
                <div className="row g-lg-5 g-4">
                  <div className="col-lg-4 col-12">
                    <div className="modalthumbnail">
                      <div className="modalthumb">
                        <div className="modalthumb-header">
                          <h1 className="name">{name}</h1>
                          <p className="position">{position}</p>
                        </div>
                        <div className="modalthumb-body">
                          <img
                            src={image}
                            alt="modal-thumbnail"
                            width={306}
                            height={371}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-12">
                    <div className="modaldetails">
                      <p className="detailtext">{description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal-backdrop fade ${showModal ? "show" : ""}`}
        style={showModal ? { display: "block" } : { display: "none" }}
        onClick={() => setShowModal(false)}
      ></div>
    </>
  );
}

export default CorporateDirectors;
