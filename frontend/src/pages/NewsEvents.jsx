import { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import BannerV2 from "../components/about_components/Banner2";
import SmallRibbon from "../components/ribbon/smallribbon";

function NewsEvents() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/news-events`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setPageData(data);
        
        // Initialize newsData after pageData is set
        const newsContent = data.contents.filter((data) => data.category == 3);
        setNewsData(newsContent.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Function to truncate text to 5 lines
  const truncateText = (text, id) => {
    const maxLines = 5;
    const lines = text.split('\n');
    
    if (lines.length <= maxLines || expandedCards[id]) {
      return text;
    }
    
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pageData) return <div>No data found</div>;

  const mainContent = pageData.contents.filter((data) => data.category == 1);
  const eventsContent = pageData.contents.filter((data) => data.category == 2);

  const handleSeeAllNews = () => {
    const allNews = pageData.contents.filter((data) => data.category == 3);
    setNewsData(allNews);
  };

  return (
    <>
      <BannerV2 title={pageData.title} text={pageData.text} home />

      {/* NEWS-EVENT SECTION START */}
      {mainContent.length > 0 && (
        <section className="newsevent">
          <div className="container">
            <div className="row g-0">
              <div className="col-lg-6 col-12">
                <div className="newsevent-thumbnail">
                  <img
                    src={mainContent[0].cover}
                    alt="newsevent-thumbnail"
                    width={648}
                    height={502}
                  />
                </div>
              </div>

              <div className="col-lg-6 col-12">
                <div className="newsevent-details">
                  <div className="newsevent-header">
                    <h1 className="newsevent-title">{mainContent[0].title}</h1>
                    <p className="newsevent-date">
                      {mainContent[0].date_published}
                    </p>
                  </div>

                  <div className="newsevent-body">
                    <div className="descriptions">
                      <p 
                        className="newsevent-text"
                        style={{
                          whiteSpace: 'pre-line',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: expandedCards[mainContent[0].id] ? 'unset' : 5,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {mainContent[0].text}
                      </p>
                      {mainContent[0].text.split('\n').length > 5 && (
                        <button 
                          onClick={() => toggleExpand(mainContent[0].id)} 
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0066cc',
                            cursor: 'pointer',
                            padding: '5px 0',
                            fontSize: '14px',
                            marginTop: '8px'
                          }}
                        >
                          {expandedCards[mainContent[0].id] ? 'Show Less' : 'Show More'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {pageData.sections.map((section) => {
        if (section.slug === "events-disabled") {
          return (
            <section key={section.id} className="events">
              <div className="container">
                <div className="events-content">
                  <div className="row">
                    <div className="col-lg-5 col-12">
                      <div className="events-details">
                        <div className="events-header">
                          <h1 className="events-title">{section.title}</h1>
                          <div className="ribbon">
                            <img src="/images/ribbon-big.svg" alt="" />
                          </div>
                        </div>
                        <div className="events-body">
                          <p className="events-text">{section.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {eventsContent.length > 0 && (
                    <div className="row g-4">
                      {eventsContent.map((data) => (
                        <div
                          key={data.id}
                          className="col-lg-3 col-md-4 col-sm-6 col-12"
                        >
                          <div className="cardevent">
                            <div className="cardevent-header">
                              <img
                                src={data.cover}
                                alt="event-thumbnail"
                                width={306}
                                height={165}
                              />
                            </div>
                            <div className="cardevent-body">
                              <div className="title-date">
                                <h3 className="cardevent-title">
                                  {data.title}
                                </h3>
                                <p className="date">{data.date_published}</p>
                              </div>
                              <div className="description">
                                <p 
                                  className="cardevent-text"
                                  style={{
                                    whiteSpace: 'pre-line',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: expandedCards[data.id] ? 'unset' : 5,
                                    WebkitBoxOrient: 'vertical'
                                  }}
                                >
                                  {data.text}
                                </p>
                                {data.text.split('\n').length > 5 && (
                                  <button 
                                    onClick={() => toggleExpand(data.id)} 
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#0066cc',
                                      cursor: 'pointer',
                                      padding: '5px 0',
                                      fontSize: '14px',
                                      marginTop: '8px'
                                    }}
                                  >
                                    {expandedCards[data.id] ? 'Show Less' : 'Show More'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        } else if (section.slug === "news") {
          return (
            <section key={section.id} className="news">
              <div className="container">
                <div className="news-content">
                  <div className="row">
                    <div className="col-lg-5 col-12">
                      <div className="news-details">
                        <div className="news-header">
                          <h1 className="news-title">{section.title}</h1>
                          <div className="ribbon">
                            <img src="/images/ribbon-big.svg" alt="" />
                          </div>
                        </div>
                        <div className="news-body">
                          <p className="news-text">{section.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {newsData.length > 0 && (
                    <div className="row g-4">
                      {newsData.map((data) => (
                        <div key={data.id} className="col-lg-4 col-sm-6 col-12">
                          <div className="cardnews">
                            <div className="cardnews-header">
                              <img
                                src={data.cover}
                                alt="news-thumbnail"
                                width={416}
                                height={165}
                              />
                            </div>
                            <div className="cardnews-body">
                              <div className="title-date">
                                <h3 className="cardnews-title">{data.title}</h3>
                                <p className="date">{data.date_published}</p>
                              </div>
                              <div className="description">
                                <p 
                                  className="cardnews-text"
                                  style={{
                                    whiteSpace: 'pre-line',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: expandedCards[data.id] ? 'unset' : 5,
                                    WebkitBoxOrient: 'vertical'
                                  }}
                                >
                                  {data.text}
                                </p>
                                {data.text.split('\n').length > 5 && (
                                  <button 
                                    onClick={() => toggleExpand(data.id)} 
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#0066cc',
                                      cursor: 'pointer',
                                      padding: '5px 0',
                                      fontSize: '14px',
                                      marginTop: '8px'
                                    }}
                                  >
                                    {expandedCards[data.id] ? 'Show Less' : 'Show More'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="col-12">
                        <div className="seeall">
                          <button 
                            type="button" 
                            onClick={handleSeeAllNews} 
                            className="seelink"
                          >
                            <FormattedMessage
                              id="seeAll"
                              defaultMessage="See All"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }
        return null;
      })}

      <section className="stechsubscribe">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-12 mx-lg-auto">
              <div className="stechsubscribe-content">
                <h1 className="stechsubscribe-title">
                  <FormattedMessage
                    id="newsletter"
                    defaultMessage="Get our newsletter with the latest articles, data, and events.
                        Delivered to your inbox weekly."
                  />
                </h1>
                <div className="stechnewsletter">
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="inputfield"
                  />
                  <button type="button" className="btn-subscribe">
                    <FormattedMessage
                      id="subscribe"
                      defaultMessage="Subscribe"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NewsEvents;