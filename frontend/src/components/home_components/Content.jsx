import React, { useState, useEffect } from "react";
import Ribbon from "../ribbon/ribbon";

const Content = () => {
  const [contentData, setContentData] = useState({
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/home/carousel`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setContentData({
          title: data.title || "Stech Group: Driving Progress Towards Better Living",
          description: data.description || "Loading content..."
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching content data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, []);

  if (loading) {
    return (
      <section className="stechdigital">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-lg-auto col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="stechdigital">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-lg-auto col-12">
              <div className="alert alert-danger" role="alert">
                Error loading content: {error}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="stechdigital">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-lg-auto col-12">
            <div className="stechdigital-content">
              {/* STECH DIGITAL HEADER START */}
              <div className="stechdigital-header">
                <h1
                  className="stechdigital-title"
                  data-wow-duration="1s"
                  data-wow-delay="2s"
                  dangerouslySetInnerHTML={{ __html: contentData.title }}
                ></h1>
                <div className="ribbon" style={{ left: 0 }}>
                  <img src="/images/ribbon-big.svg" alt="" />
                </div>
              </div>
              {/* STECH DIGITAL HEADER END */}

              {/* STECH DIGITAL BODY START */}
              <div className="stechdigital-body">
                <p className="setchdigital-text">{contentData.description}</p>
              </div>
              {/* STECH DIGITAL BODY END */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;