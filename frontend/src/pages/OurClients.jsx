import { useState, useEffect } from 'react';
import BannerV2 from '../components/about_components/Banner2';

function OurClients() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/home/our-clients`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch data');
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!pageData) return <div className="no-data">No data found</div>;

  return (
    <>
      <BannerV2 title={pageData.title} text={pageData.text} home />
      {/* OUR-CLIENTS SECTION START */}
      <section className="ourclients">
        <div className="container">
          {/* OUR-CONCERN CONTENT START */}
          <div className="ourclients-content">
            {/* OUR CLIENTS START */}
            <div className="row g-4">
              {pageData.clients.map((client) => (
                <div key={client.id} className="col-lg-3 col-md-6 col-12">
                  {/* CARD CLIENT START */}
                  <div className="card-client">
                    <img
                      src={client.logo}
                      alt={client.name}
                      style={{width: 83, height: 24}}
                      
                    />
                  </div>
                  {/* CARD CLIENT END */}
                </div>
              ))}
            </div>
            {/* OUR CLIENTS END */}
          </div>
          {/* OUR-CONCERN CONTENT END */}
        </div>
      </section>
      {/* OUR-CLIENTS SECTION END */}
    </>
  );
}

export default OurClients;