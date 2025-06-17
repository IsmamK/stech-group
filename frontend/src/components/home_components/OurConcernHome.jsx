import { useState, useEffect } from "react";
import BannerV2 from "../about_components/Banner2";
import OurConcern from "../editor_components/editor_modals/home_modals/OurConcerns";

function OurConcernHome() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(pageData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/our-concern/home`);
        
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pageData) return <div>No data found</div>;

  return (
    <>
      {/* <BannerV2
        title={pageData.title}
        text={pageData.text}
        home
      /> */}

      {pageData.sections.length > 0 && (
        <OurConcern data={pageData.sections[0]} brands={pageData.brands} />
      )}
    </>
  );
}

export default OurConcernHome;