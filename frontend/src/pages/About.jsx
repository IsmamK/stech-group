import { useEffect, useState } from "react";
import ChairmanMessage from "../components/about_components/About1";
import CorporateDirectors from "../components/about_components/About2";
import MissionVission from "../components/about_components/CoreValues";
import BannerV2 from "../components/about_components/Banner2";

function AboutUs() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/about/about2`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setPageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  if (!loading && !error) {
    const hash = window.location.hash;
    if (hash) {
      const target = document.getElementById(hash.replace("#", ""));
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200); // Small delay to ensure the section has mounted
      }
    }
  }
}, [loading, error, pageData]);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  if (!pageData) return <div className="text-gray-500 text-center py-10">No data found</div>;

  return (
    <>
      <BannerV2 title={pageData.title} text={pageData.text} home />
      
      {pageData?.sections?.map((section) => {
        if (section.slug === "chairmans-message") {
          return <ChairmanMessage key={section.id} data={section} id="chairman-message" />;
        } else if (section.slug === "corporate-directors") {
          return <CorporateDirectors key={section.id} data={section} />;
        } else if (
          section.slug === "mission-and-vision-of-stechgroup-of-industries"
        ) {
          return <MissionVission key={section.id} data={section} />;
        } else if (section.slug === "download-our-company-portfolio") {
    return (
      <section 
        key={section.id} 
        className="downloadportfolio py-16 bg-gray-50" 
        id="downloadourcompanyportfolio"
      >
        <div className="container px-4 mx-auto">
          <h2 className="downloadportfolio-title text-center text-3xl font-bold text-gray-800 mb-10">
            {section.title}
          </h2>
          <div className="flex flex-wrap -mx-4">
            {section.portfolios?.map((portfolio) => (
              <div 
                key={portfolio.id} 
                className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
              >
                <a
                  href={portfolio.portfolio}
                  className="btn-download flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 hover:border-blue-700 h-full"
                >
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-blue-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">
                    {portfolio.title}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
        return null;
      })}
    </>
  );
}

export default AboutUs;