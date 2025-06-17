import React, { useRef,useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../components/layout_components/HeaderComponent';
import Footer from '../components/layout_components/Footer';
import Preloader from '../components/PreLoader';

import { useLocation } from 'react-router-dom';


const Layout = () => {
  const location = useLocation();


  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const target = document.getElementById(location.state.scrollTo);
      if (target) {
        // Wait a bit to ensure DOM is fully loaded
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 100); // small delay in case page transition is fast
      }
    }
  }, [location]);
  
    useEffect(() => {
          const container = document.querySelector('.stechbanner'); // Get the container
  
      const canvas = document.querySelector('canvas');
  
      // Load external scripts dynamically
      const datGuiScript = document.createElement('script');
      datGuiScript.src = 'https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/blob/master/dat.gui.min.js';
      datGuiScript.async = false;
  
      const mainScript = document.createElement('script');
      mainScript.src = '/script.js';
      mainScript.async = false;
  
      const gaScript = document.createElement('script');
      gaScript.innerHTML = `
        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};
        ga.l=+new Date;
        ga('create', 'UA-105392568-1', 'auto');
        ga('send', 'pageview');
      `;
  
      const analyticsScript = document.createElement('script');
      analyticsScript.src = 'https://www.google-analytics.com/analytics.js';
      analyticsScript.async = true;
  
      document.body.appendChild(datGuiScript);
      document.body.appendChild(mainScript);
      document.body.appendChild(gaScript);
      document.body.appendChild(analyticsScript);

  
      return () => {
        document.body.removeChild(datGuiScript);
        document.body.removeChild(mainScript);
        document.body.removeChild(gaScript);
        document.body.removeChild(analyticsScript);
      };
    }, []);

  

  return (
    <>


      {/* <Preloader /> */}
      <HeaderComponent />



      <Outlet  />

        <canvas></canvas>
       


      <Footer  />
      

    </>
  );
};

export default Layout;


