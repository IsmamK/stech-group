import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

export default function Footer() {
  const [data, setData] = useState({});
  const [year, setYear] = useState("2021");
  const [email, setEmail] = useState("");

  const subscribe = async (e) => {
    e.preventDefault();
    if (email) {
      const response = await fetch("/api/subscription", {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setEmail("");
      alert("thank you for subscribing to our email list");
    } else {
      alert("please input email first");
    }
  };

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="footer bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* FOOTER CONTENT START */}
        <div className="footer-content">
          {/* FOOTER INFO START */}
          <div className="flex flex-wrap -mx-4">
            {/* STECH NEWSLETTER START */}
            <div className="w-full lg:w-5/12 px-4 mb-8 lg:mb-0">
              <div className="stecnewsletter">
                <div className="footerlogo mb-6">
                  <img
                    src="/images/logo-white.svg"
                    alt="logo-white"
                    width={200}
                    height={56}
                  />
                </div>

                <form onSubmit={subscribe} className="footnewsletter flex flex-wrap">
                  <input
                    type="email"
                    value={email}
                    placeholder="E-mail"
                    className="inputfield flex-grow px-4 py-2 rounded-l focus:outline-none text-gray-900"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn-subscribe px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-r focus:outline-none transition-colors"
                  >
                    <FormattedMessage
                      id="subscribe"
                      defaultMessage="Subscribe"
                    />
                  </button>
                </form>
              </div>
            </div>
            {/* STECH NEWSLETTER END */}

            {/* FOOTER ABOUT INFO START */}
            <div className="w-full lg:w-3/12 px-4 mb-8 lg:mb-0">
              <div className="aboutinfo">
                {/* ABOUT LIST START */}
                <ul className="aboutlist space-y-2">
                  <li className="aboutlist-item">
                    <a href="/" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage id="home" defaultMessage="Home" />
                    </a>
                  </li>
                  <li className="aboutlist-item">
                    <a href="/about" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage
                        id="aboutUS"
                        defaultMessage="About Us"
                      />
                    </a>
                  </li>
                  <li className="aboutlist-item">
                    <a href="/our-concern" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage
                        id="ourConcern"
                        defaultMessage="Our Concern"
                      />
                    </a>
                  </li>
                  <li className="aboutlist-item">
                    <a href="/services" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage
                        id="services"
                        defaultMessage="Services"
                      />
                    </a>
                  </li>
                  <li className="aboutlist-item">
                    <a href="/gallery" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage
                        id="gallery"
                        defaultMessage="Gallery"
                      />
                    </a>
                  </li>
                  <li className="aboutlist-item">
                    <a href="/newsevents" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage
                        id="newsAndEvents"
                        defaultMessage="News &amp; Event"
                      />
                    </a>
                  </li>
                  <li className="aboutlist-item">
                    <a href="/our-clients" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage
                        id="ourClients"
                        defaultMessage="Our Clients"
                      />
                    </a>
                  </li>
                  <li className="aboutlist-item">
                    <a href="/contact" className="aboutlist-link hover:text-blue-400 transition-colors">
                      <FormattedMessage
                        id="contactUs"
                        defaultMessage="Contact Us"
                      />
                    </a>
                  </li>
                </ul>
                {/* ABOUT LIST END */}
              </div>
            </div>
            {/* FOOTER ABOUT INFO END */}

            {/* FOOTER CONTACT-SOCIAL INFO START */}
            <div className="w-full lg:w-4/12 px-4">
              <div className="contactinfo">
                <h6 className="contact-title text-lg font-semibold mb-4">
                  <FormattedMessage id="contact" defaultMessage="Contact" />
                </h6>

                {/* CONTACT LIST-SOCIAL LIST START */}
                <div className="contactlist-sociallist">
                  {/* CONTACT LIST START */}
                  <ul className="contactlist space-y-3 mb-6">
                    <li className="contactlist-item flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <a href="tel:+88012312322539" className="contactlist-link hover:text-blue-400 transition-colors">
                        +8809643434343
                      </a>
                    </li>

                    <li className="contactlist-item flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a
                        href="mailto:support@stech.xyz"
                        className="contactlist-link hover:text-blue-400 transition-colors"
                      >
                        info@stechgroupbd.com
                      </a>
                    </li>

                    <li className="contactlist-item flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <a href="#" className="contactlist-link hover:text-blue-400 transition-colors">
                        House- 31, Road- 17, Block- E <br />
                        Banani, Dhaka- 1213, Bangladesh
                      </a>
                    </li>
                  </ul>
                  {/* CONTACT LIST END */}

                  {/* SOCIAL LIST START */}
                  <ul className="sociallist flex space-x-4">
                    <li className="sociallist-item">
                      <a
                        href={data?.facebook_url}
                        target="_blank"
                        className="sociallist-link hover:opacity-80 transition-opacity"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Follow us on Facebook"
                        rel="noreferrer"
                      >
                        <svg
                          className="whiteicon"
                          width="13"
                          height="25"
                          viewBox="0 0 13 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.20221 24.9979V14.0504H11.8769L12.427 9.78393H8.20221V7.05993C8.20221 5.82473 8.54526 4.98286 10.3167 4.98286L12.576 4.98182V1.16598C12.185 1.11417 10.844 0.998047 9.28385 0.998047C6.02652 0.998047 3.79648 2.98623 3.79648 6.63761V9.78405H0.112305V14.0505H3.79636V24.998L8.20221 24.9979Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>

                    <li className="sociallist-item">
                      <a
                        href={data?.youtube_url}
                        target="_blank"
                        className="sociallist-link hover:opacity-80 transition-opacity"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Follow us on Youtube"
                        rel="noreferrer"
                      >
                        <svg
                          className="whiteicon"
                          width="24"
                          height="16"
                          viewBox="0 0 24 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M20.8035 0.60297C21.7672 0.862442 22.5271 1.62232 22.7866 2.58608C23.2684 4.34678 23.2499 8.01645 23.2499 8.01645C23.2499 8.01645 23.2499 11.6676 22.7866 13.4283C22.5271 14.392 21.7672 15.1519 20.8035 15.4114C19.0428 15.8747 12 15.8747 12 15.8747C12 15.8747 4.97568 15.8747 3.19645 15.3929C2.2327 15.1334 1.47281 14.3735 1.21334 13.4098C0.75 11.6676 0.75 7.99791 0.75 7.99791C0.75 7.99791 0.75 4.34678 1.21334 2.58608C1.47281 1.62232 2.25123 0.843908 3.19645 0.584436C4.95715 0.121094 12 0.121094 12 0.121094C12 0.121094 19.0428 0.121094 20.8035 0.60297ZM15.614 7.99792L9.75739 11.3711V4.62479L15.614 7.99792Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>

                    <li className="sociallist-item">
                      <a
                        href={data?.instagram_url}
                        target="_blank"
                        className="sociallist-link hover:opacity-80 transition-opacity"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Follow us on Instagram"
                        rel="noreferrer"
                      >
                        <svg
                          className="whiteicon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.2506 11.998C8.2506 9.92706 9.92901 8.24775 12 8.24775C14.071 8.24775 15.7503 9.92706 15.7503 11.998C15.7503 14.069 14.071 15.7483 12 15.7483C9.92901 15.7483 8.2506 14.069 8.2506 11.998ZM6.22326 11.998C6.22326 15.1885 8.8095 17.7748 12 17.7748C15.1905 17.7748 17.7767 15.1885 17.7767 11.998C17.7767 8.80755 15.1905 6.22131 12 6.22131C8.8095 6.22131 6.22326 8.80755 6.22326 11.998ZM16.6554 5.99226C16.6553 6.25926 16.7344 6.5203 16.8826 6.74237C17.0309 6.96443 17.2417 7.13755 17.4883 7.23983C17.7349 7.3421 18.0064 7.36895 18.2683 7.31696C18.5302 7.26498 18.7708 7.1365 18.9596 6.94777C19.1485 6.75905 19.2772 6.51855 19.3294 6.2567C19.3816 5.99484 19.355 5.72339 19.2529 5.47667C19.1508 5.22995 18.9778 5.01904 18.7559 4.87061C18.534 4.72218 18.273 4.6429 18.006 4.6428H18.0054C17.6475 4.64296 17.3043 4.78517 17.0512 5.0382C16.7981 5.29122 16.6557 5.63436 16.6554 5.99226ZM7.455 21.1553C6.35817 21.1053 5.76201 20.9226 5.36583 20.7683C4.84059 20.5638 4.46583 20.3203 4.07181 19.9268C3.67779 19.5333 3.43389 19.1589 3.23031 18.6337C3.07587 18.2377 2.89317 17.6413 2.84331 16.5445C2.78877 15.3586 2.77788 15.0024 2.77788 11.9981C2.77788 8.99385 2.78967 8.63862 2.84331 7.45179C2.89326 6.35496 3.07731 5.75979 3.23031 5.36262C3.43479 4.83738 3.67833 4.46262 4.07181 4.0686C4.46529 3.67458 4.83969 3.43068 5.36583 3.2271C5.76183 3.07266 6.35817 2.88996 7.455 2.8401C8.64084 2.78556 8.99706 2.77467 12 2.77467C15.0029 2.77467 15.3595 2.78646 16.5464 2.8401C17.6432 2.89005 18.2384 3.0741 18.6355 3.2271C19.1608 3.43068 19.5355 3.67512 19.9295 4.0686C20.3236 4.46208 20.5666 4.83738 20.771 5.36262C20.9255 5.75862 21.1082 6.35496 21.158 7.45179C21.2126 8.63862 21.2235 8.99385 21.2235 11.9981C21.2235 15.0024 21.2126 15.3577 21.158 16.5445C21.1081 17.6413 20.9245 18.2375 20.771 18.6337C20.5666 19.1589 20.323 19.5337 19.9295 19.9268C19.5361 20.3199 19.1608 20.5638 18.6355 20.7683C18.2395 20.9227 17.6432 21.1054 16.5464 21.1553C15.3605 21.2098 15.0043 21.2207 12 21.2207C8.99571 21.2207 8.64048 21.2098 7.455 21.1553ZM7.36185 0.816177C6.16422 0.870717 5.34585 1.06062 4.63116 1.33872C3.891 1.62591 3.26442 2.0112 2.63829 2.63634C2.01216 3.26148 1.62786 3.88905 1.34067 4.62921C1.06257 5.34435 0.87267 6.16227 0.81813 7.3599C0.76269 8.55942 0.75 8.94291 0.75 11.998C0.75 15.0532 0.76269 15.4386 0.81813 16.6362C0.87267 17.8339 1.06257 18.6517 1.34067 19.3669C1.62786 20.1066 2.01225 20.7349 2.63829 21.3598C3.26433 21.9846 3.891 22.3694 4.63116 22.6574C5.3472 22.9355 6.16422 23.1254 7.36185 23.1799C8.562 23.2345 8.94486 23.248 12 23.248C15.0551 23.248 15.4386 23.2354 16.6382 23.1799C17.8359 23.1254 18.6537 22.9355 19.3688 22.6574C20.1086 22.3694 20.7356 21.9849 21.3617 21.3598C21.9878 20.7346 22.3713 20.1066 22.6593 19.3669C22.9374 18.6517 23.1282 17.8338 23.1819 16.6362C23.2364 15.4358 23.2491 15.0532 23.2491 11.998C23.2491 8.94291 23.2364 8.55942 23.1819 7.3599C23.1273 6.16218 22.9374 5.3439 22.6593 4.62921C22.3713 3.8895 21.9869 3.26247 21.3617 2.63634C20.7366 2.01021 20.1086 1.62591 19.3697 1.33872C18.6537 1.06062 17.8358 0.869817 16.6391 0.816177C15.4395 0.76359 15.056 0.748047 12.0009 0.748047C8.94576 0.748047 8.562 0.760737 7.36185 0.816177Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>

                    <li className="sociallist-item">
                      <a
                        href={data?.linked_in_url}
                        target="_blank"
                        className="sociallist-link hover:opacity-80 transition-opacity"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Follow us on Linkedin"
                        rel="noreferrer"
                      >
                        <svg
                          className="whiteicon"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.429 6.969H11.143V8.819C11.678 7.755 13.05 6.799 15.111 6.799C19.062 6.799 20 8.917 20 12.803V20H16V13.688C16 11.475 15.465 10.227 14.103 10.227C12.214 10.227 11.429 11.572 11.429 13.687V20H7.429V6.969V6.969ZM0.57 19.83H4.57V6.799H0.57V19.83V19.83ZM5.143 2.55C5.14315 2.88528 5.07666 3.21724 4.94739 3.52659C4.81812 3.83594 4.62865 4.11651 4.39 4.352C3.9064 4.83262 3.25181 5.10165 2.57 5.1C1.88939 5.09954 1.23631 4.8312 0.752 4.353C0.514211 4.11671 0.325386 3.83582 0.196344 3.52643C0.0673015 3.21704 0.000579132 2.88522 0 2.55C0 1.873 0.27 1.225 0.753 0.747C1.23689 0.268158 1.89024 -0.000299211 2.571 2.50265e-07C3.253 2.50265e-07 3.907 0.269 4.39 0.747C4.872 1.225 5.143 1.873 5.143 2.55Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                  {/* SOCIAL LIST END */}
                </div>
                {/* CONTACTLIST-SOCIALLIST END */}
              </div>
            </div>
            {/* FOOTER CONTACT-SOCIAL INFO END */}
          </div>
          {/* FOOTER INFO END */}

          {/* FOOTER COPYRIGHT INFO START */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-700">
            <p className="copyright-text mb-4 md:mb-0">
              <span style={{ fontFamily: "sans-serif" }}>&copy;</span>{" "}
              {year} Stech &ndash; All rights reserved.
            </p>

            <p className="developtext">
              <span>Developed by</span>{" "}
              <a
                href="http://www.blockchaintech.com.bd/"
                target="_blank"
                className="link hover:text-blue-400 transition-colors"
                rel="noreferrer"
              >
                BlockChain Technology
              </a>
            </p>
          </div>
          {/* FOOTER COPYRIGHT INFO END */}
        </div>
        {/* FOOTER CONTENT END */}
      </div>
    </footer>
  );
}