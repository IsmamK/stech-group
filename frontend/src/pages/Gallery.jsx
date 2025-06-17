import { useState, useEffect } from "react";

function PlayButton() {
  return (
    <svg
      width="144"
      height="144"
      viewBox="0 0 144 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="72" cy="72" r="72" fill="white" fillOpacity="0.5" />
      <circle
        cx="72.7202"
        cy="71.2787"
        r="52.56"
        fill="white"
        fillOpacity="0.5"
      />
      <g clipPath="url(#playpauseicon-1)">
        <path
          d="M72.0004 105.606C53.4431 105.606 38.4004 90.5635 38.4004 72.0062C38.4004 53.449 53.4431 38.4062 72.0004 38.4062C90.5577 38.4062 105.6 53.449 105.6 72.0062C105.6 90.5635 90.5577 105.606 72.0004 105.606ZM67.3703 59.9606C67.1681 59.8257 66.9331 59.7482 66.6903 59.7363C66.4475 59.7244 66.206 59.7785 65.9915 59.893C65.7771 60.0075 65.5977 60.1779 65.4724 60.3863C65.3472 60.5947 65.2808 60.8331 65.2804 61.0762V82.9363C65.2808 83.1794 65.3472 83.4178 65.4724 83.6262C65.5977 83.8346 65.7771 84.005 65.9915 84.1195C66.206 84.234 66.4475 84.2881 66.6903 84.2762C66.9331 84.2643 67.1681 84.1868 67.3703 84.0518L83.7638 73.1251C83.9481 73.0024 84.0993 72.8361 84.2038 72.6409C84.3084 72.4457 84.3631 72.2277 84.3631 72.0062C84.3631 71.7848 84.3084 71.5668 84.2038 71.3716C84.0993 71.1764 83.9481 71.0101 83.7638 70.8874L67.367 59.9606H67.3703Z"
          fill="url(#playpauseicon-2)"
        />
      </g>
      <defs>
        <linearGradient
          id="playpauseicon-2"
          x1="72.0004"
          y1="38.4062"
          x2="72.0004"
          y2="105.606"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0019FF" />
          <stop offset="1" stopColor="#00FFAD" />
        </linearGradient>
        <clipPath id="playpauseicon-1">
          <rect
            width="80.64"
            height="80.64"
            fill="white"
            transform="translate(31.6797 31.6875)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function SmallPlayButton() {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="45" cy="45" r="45" fill="white" fillOpacity="0.5" />
      <circle
        cx="45.4496"
        cy="44.5492"
        r="32.85"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M45.001 66.0039C33.4027 66.0039 24.001 56.6022 24.001 45.0039C24.001 33.4056 33.4027 24.0039 45.001 24.0039C56.5993 24.0039 66.001 33.4056 66.001 45.0039C66.001 56.6022 56.5993 66.0039 45.001 66.0039ZM42.1072 37.4754C41.9808 37.3911 41.8339 37.3426 41.6821 37.3352C41.5304 37.3277 41.3795 37.3616 41.2454 37.4331C41.1114 37.5047 40.9993 37.6112 40.921 37.7414C40.8427 37.8717 40.8013 38.0207 40.801 38.1726V51.8352C40.8013 51.9871 40.8427 52.1362 40.921 52.2664C40.9993 52.3966 41.1114 52.5032 41.2454 52.5747C41.3795 52.6462 41.5304 52.6801 41.6821 52.6726C41.8339 52.6652 41.9808 52.6167 42.1072 52.5324L52.3531 45.7032C52.4683 45.6265 52.5628 45.5226 52.6281 45.4006C52.6935 45.2786 52.7277 45.1423 52.7277 45.0039C52.7277 44.8655 52.6935 44.7292 52.6281 44.6072C52.5628 44.4852 52.4683 44.3813 52.3531 44.3046L42.1051 37.4754H42.1072Z"
        fill="url(#playpauseicon)"
      />
      <defs>
        <linearGradient
          id="playpauseicon"
          x1="45.001"
          y1="24.0039"
          x2="45.001"
          y2="66.0039"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0019FF" />
          <stop offset="1" stopColor="#00FFAD" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Gallery() {
  const [video, setVideo] = useState("");
  const [pageData, setPageData] = useState(null);
  const [modal, setModal] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Convert YouTube URL to embed format
  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    
    // If already embed URL, just return it with autoplay params
    if (url.includes('embed')) {
      return `${url}?autoplay=1&mute=1&rel=0`;
    }
    
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    
    // Standard watch URL
    if (url.includes('watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } 
    // Short URL
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    // Embedded URL (just in case)
    else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
    }
    
    // If we can't parse it, return the original URL
    return url;
  };

  // Initialize Bootstrap modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const modalElement = document.getElementById('videoModal');
      if (modalElement) {
        const bsModal = new window.bootstrap.Modal(modalElement);
        setModal(bsModal);
        
        // Handle modal hidden event to clear video
        modalElement.addEventListener('hidden.bs.modal', () => {
          setVideo("");
        });
        
        // Cleanup on unmount
        return () => {
          bsModal.dispose();
          modalElement.removeEventListener('hidden.bs.modal', () => {});
        };
      }
    }
  }, []);

  // Show modal when video is set
  useEffect(() => {
    if (video && modal) {
      modal.show();
    }
  }, [video, modal]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/gallery`);
        const data = await res.json();
        setPageData(data);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  if (!pageData) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <>
      {/* STECH BANNER SECTION START */}
      {pageData.sections.map((section) => {
        if (section.slug === "gallery-banner") {
          return (
            <section
              key={section.id}
              className="gallerybanner"
              style={{ 
                // background: `url(${section.videos[0]?.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="gallerybanner-content">
                      <div
                        className="banner-details"
                        id="scene-2"
                        data-relative-input="true"
                      >
                        <h1
                          className="banner-title big-title-1"
                          data-depth="0.05"
                          dangerouslySetInnerHTML={{ __html: section.title }}
                        ></h1>

                        {/* PLAY BUTTON START */}
                        <button
                          className="btn-playpause"
                          type="button"
                          onClick={() => {
                            const videoUrl = section.videos[0]?.video;
                            if (videoUrl) {
                              setVideo(convertToEmbedUrl(videoUrl));
                            }
                          }}
                        >
                          <PlayButton />
                        </button>
                        {/* PLAY BUTTON END */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}

      {/* STECH BANNER SECTION END */}

      {/* STECH-GALLERY SECTION START */}
      <section className="stechgallery">
        <div className="container">
          <div className="stechgallery-content gallerystech-1">
            {pageData.sections.map((section) => {
              if (section.slug === "gallery-content-top") {
                return (
                  <div key={section.id} className="row g-4">
                    <div className="col-lg-6 col-12 left-thumbs">
                      {/* GALLERY-VIDEO START */}
                      <div className="video-thumbs position-relative">
                        {section.videos[0] && (
                          <>
                            <img
                              src={section.videos[0].thumbnail}
                              alt={section.videos[0].primary_text}
                              className="w-100"
                            />
                            <div className="caption">
                              <h2 className="caption-title">
                                {section.videos[0].primary_text}
                              </h2>
                            </div>
                          </>
                        )}

                        {/* PLAY BUTTON START */}
                        <button
                          className="btn-playpause position-absolute top-50 start-50 translate-middle"
                          type="button"
                          onClick={() => {
                            const videoUrl = section.videos[0]?.video;
                            if (videoUrl) {
                              setVideo(convertToEmbedUrl(videoUrl));
                            }
                          }}
                        >
                          <SmallPlayButton />
                        </button>
                        {/* PLAY BUTTON END */}
                      </div>
                      {/* GALLERY-VIDEO END */}
                    </div>

                    <div className="col-lg-6 col-12 right-thumbs">
                      <div className="row g-4 videorow">
                        {/* GALLERY-ITEM START */}
                        {section.images.map((image) => (
                          <div key={image.id} className="col-md-6 col-12">
                            <div className="gallery-thumbs">
                              <a
                                className="gallery-link"
                                href={image.image}
                                data-caption={image.primary_text}
                                style={{ height: "100%" }}
                              >
                                <img
                                  src={image.image}
                                  alt={image.primary_text}
                                  className="w-100"
                                />
                                {image.primary_text && (
                                  <div className="caption">
                                    <h2 className="caption-title">
                                      {image.primary_text}
                                    </h2>
                                  </div>
                                )}
                              </a>
                            </div>
                          </div>
                        ))}
                        {/* GALLERY ITEM END */}
                      </div>
                    </div>
                  </div>
                );
              } else if (section.slug === "gallery-content-center") {
                return (
                  <div key={section.id} className="row g-4">
                    <div className="col-12">
                      {/* GALLERY-VIDEO START */}
                      <div className="fullscreenvideo-thumbs position-relative">
                        {section.videos[0] && (
                          <>
                            <img
                              src={section.videos[0].thumbnail}
                              alt={section.videos[0].primary_text}
                              className="w-100"
                            />

                            <div className="caption">
                              <h2 className="caption-title">
                                {section.videos[0].primary_text}
                              </h2>
                            </div>
                          </>
                        )}

                        {/* PLAY BUTTON START */}
                        <button
                          className="btn-playpause position-absolute top-50 start-50 translate-middle"
                          type="button"
                          onClick={() => {
                            const videoUrl = section.videos[0]?.video;
                            if (videoUrl) {
                              setVideo(convertToEmbedUrl(videoUrl));
                            }
                          }}
                        >
                          <SmallPlayButton />
                        </button>
                        {/* PLAY BUTTON END */}
                      </div>
                      {/* GALLERY-VIDEO END */}
                    </div>
                  </div>
                );
              } else if (section.slug === "gallery-content-bottom") {
                return (
                  <div key={section.id} className="row g-4">
                    <div className="col-lg-6 col-12">
                      <div className="row g-4">
                        {/* GALLERY-ITEM START */}
                        {section.images.map((image) => (
                          <div key={image.id} className="col-md-6 col-12">
                            <div className="gallery-thumbs">
                              <a
                                className="gallery-link"
                                href={image.image}
                                data-caption={image.primary_text}
                              >
                                <img
                                  src={image.image}
                                  alt={image.primary_text}
                                  className="w-100"
                                />

                                {image.primary_text && (
                                  <div className="caption">
                                    <h2 className="caption-title">
                                      {image.primary_text}
                                    </h2>
                                  </div>
                                )}
                              </a>
                            </div>
                          </div>
                        ))}
                        {/* GALLERY IGEM END */}
                      </div>
                    </div>

                    <div className="col-lg-6 col-12">
                      {/* GALLERY-VIDEO START */}
                      <div className="video-thumbs position-relative">
                        {section.videos[0] && (
                          <>
                            <img
                              src={section.videos[0].thumbnail}
                              alt={section.videos[0].primary_text}
                              className="w-100"
                            />
                            <div className="caption">
                              <h2 className="caption-title">
                                {section.videos[0].primary_text}
                              </h2>
                            </div>
                          </>
                        )}

                        {/* PLAY BUTTON START */}
                        <button
                          className="btn-playpause position-absolute top-50 start-50 translate-middle"
                          type="button"
                          onClick={() => {
                            const videoUrl = section.videos[0]?.video;
                            if (videoUrl) {
                              setVideo(convertToEmbedUrl(videoUrl));
                            }
                          }}
                        >
                          <SmallPlayButton />
                        </button>
                        {/* PLAY BUTTON END */}
                      </div>
                      {/* GALLERY-VIDEO END */}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>
      {/* STECH-GALLERY SECTION END */}

      {/* STECH-GALLERYBOX START */}
      {pageData.sections.map((section) => {
        if (section.slug === "gallery-box") {
          return (
            <section
              key={section.id}
              className="stechgallerybox gallerystech-2"
            >
              <div className="container">
                <div className="row g-4">
                  {section.images?.map((image) => (
                    <div key={image.id} className="col-lg-4 col-sm-6 col-12">
                      {/* GALLERY-THUMB START */}
                      <div className="gallery-thumbs">
                        <a
                          className="gallery-link"
                          href={image.image}
                          data-caption={image.primary_text}
                        >
                          <img
                            src={image.image}
                            alt={image.primary_text}
                            className="w-100"
                          />

                          <div className="caption">
                            <h2 className="caption-title">
                              {image.primary_text}
                            </h2>
                          </div>
                        </a>
                      </div>
                      {/* GALLERY-THUMB END */}
                    </div>
                  ))}
                  {section.videos?.map((videoItem) => (
                    <div key={videoItem.id} className="col-lg-4 col-sm-6 col-12">
                      {/* GALLERY-VIDEO START */}
                      <div className="video-thumbs position-relative">
                        <img
                          src={videoItem.thumbnail}
                          alt={videoItem.primary_text}
                          className="w-100"
                        />

                        <div className="caption">
                          <h2 className="caption-title">
                            {videoItem.primary_text}
                          </h2>
                        </div>

                        {/* PLAY BUTTON START */}
                        <button
                          className="btn-playpause position-absolute top-50 start-50 translate-middle"
                          type="button"
                          onClick={() => {
                            if (videoItem.video) {
                              setVideo(convertToEmbedUrl(videoItem.video));
                            }
                          }}
                        >
                          <SmallPlayButton />
                        </button>
                        {/* PLAY BUTTON END */}
                      </div>
                      {/* GALLERY-VIDEO END */}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}
      {/* STECH-GALLERYBOX END */}

      {/* VIDEO MODAL START */}
      <div
        className="modal fade p-0"
        id="videoModal"
        tabIndex={-1}
        aria-labelledby="videoModal"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-body p-0 position-relative">
              {/* MODAL CLOSE BUTTON START */}
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3 z-1"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setVideo("");
                  if (modal) modal.hide();
                }}
              >
                <svg
                  width="40"
                  height="40"
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

              {video && (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={video}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* VIDEO MODAL END */}
    </>
  );
}

export default Gallery;