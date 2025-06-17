import { useState, useEffect } from 'react';
import BannerV2 from '../components/about_components/Banner2';
import ContactUs from './ContactUs';

function Contact() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("1");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Fetch page data
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/contact/contact1/`);
        if (!res.ok) {
          throw new Error('Failed to fetch page data');
        }
        const data = await res.json();
        setPageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch countries
    const fetchCountries = async () => {
      try {
        const res = await fetch("api/country");
        if (!res.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await res.json();
        setCountries(data);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchPageData();
    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("api/contact-us", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          country: country,
          description: description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const data = await response.json();
      setFullName("");
      setEmail("");
      setPhone("");
      setCountry("1");
      setDescription("");
      
      alert("Thank you for contacting us. We will get back to you soon.");
    } catch (err) {
      alert("There was an error submitting your form. Please try again.");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pageData) return <div>No data found</div>;

  return (
    <>
      <BannerV2 title={pageData.title} text={pageData.text} home />
      
      <section className="contacts">
        <div className="container">
          <div className="row g-0">
            <div className="col-lg-8 col-12 mx-lg-auto p-0">
              <form onSubmit={handleSubmit} className="contactform px-2 px-lg-0">
                <div className="row g-4">
                  <div className="col-lg-6 col-12">
                    <div className="inputbox">
                      <label htmlFor="name" className="form-label">
                        Enter Full Name
                      </label>
                      <input
                        value={fullName}
                        type="text"
                        className="form-control"
                        id="name"
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-12">
                    <div className="inputbox">
                      <label htmlFor="email" className="form-label">
                        Enter Email Address
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="form-control"
                        id="email"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-lg-6 col-12">
                    <div className="inputbox">
                      <label htmlFor="phone" className="form-label">
                        Enter Phone Number
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        className="form-control"
                        id="phone"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-12">
                    <div className="inputbox">
                      <label htmlFor="country" className="form-label">
                        Select Your Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="form-select"
                        id="country"
                        required
                      >
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <div className="inputbox">
                      <label htmlFor="projectdetails" className="form-label">
                        Project Details
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea"
                        id="projectdetails"
                        rows={7}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <div className="d-flex justify-content-end w-100">
                      <button className="btn-submit" type="submit">
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {pageData.sections && pageData.sections.map((section) => {
        if (section.slug === "contact-us") {
          return <ContactUs key={section.id} data={section} />;
        }
        return null;
      })}
    </>
  );
}

export default Contact;