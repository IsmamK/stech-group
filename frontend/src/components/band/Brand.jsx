import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

function Brand({ data }) {
  const location = useLocation();
  
  // Determine if RTL (Arabic) layout is needed
  const isRTL = location.pathname.includes('/ar-AE/'); // Adjust based on your routing

  useEffect(() => {
    document.querySelectorAll(".tab-nav li").forEach((li) => {
      li.onmouseover = function () {
        document.querySelectorAll(".tab-nav li.active").forEach((box) => {
          box.classList.remove("active");
        });
        li.classList.add("active");
      };
    });
    document.querySelector(".tab-nav li:first-child")?.classList.add("active");
  }, []);

  return (
    <li>
      <Link to={`/our-concern/${data.slug}`}>
        <div className="card-concern">
          <div className="card-concern-thumbnail">
            <img
              src={data.logo}
              alt="brand-thumbnail"
              width={100}
              height={100}
            />
          </div>
          <div className="card-concern-details">
            <h5 className="concern-title">{data.name}</h5>
          </div>
        </div>
      </Link>
      <div
        className="content-holder"
        style={{
          left: isRTL ? "-100%" : "auto",
          right: isRTL ? "auto" : "-100%",
        }}
      >
        <div className="concern-info">
          <div className="concern-thumbnail">
            {data.sections?.images[0] && (
              <img
                src={data.sections?.images[0]?.image}
                alt="brand-thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            <div
              className="info"
              style={{
                left: isRTL ? "auto" : "-20%",
                right: isRTL ? "-20%" : "auto",
              }}
            >
              <h1 className="info-title big-title-1" id="featured-title">
                {data.sections?.images[0] &&
                  data.sections?.images[0].primary_text}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Brand;