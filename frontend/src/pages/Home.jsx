import React, { useState } from "react";
// import Services from '../components/home_components/Content';
// import WhyUs from '../components/home_components/Concern';
import OurClients from "../components/home_components/OurClients";

import Hero from "../components/home_components/Hero";

import Content from "../components/home_components/Content";
import Concern from "../components/home_components/Concern";
import ServicesComponent from "../components/home_components/ServicesComponent";
import CompanyValues from "../components/home_components/CompanyValues";
import OurStrategies from "../components/home_components/OurStrategies";
import OurConcernHome from "../components/home_components/OurConcernHome";
import { AnimationWrapper } from "../components/hook/Animation";

const Home = () => {
  // const { getDivider, availableShapes } = useOutletContext(); // Fetch shapes dynamically
  // const [currentShape, setCurrentShape] = useState('None'); // Default shape

  // const handleShapeChange = (event) => {
  //   setCurrentShape(event.target.value); // Update shape based on selection
  // };

  return (
    
      <div
        style={{
          paddingTop: "80px", // This pushes content below navbar
          minHeight: `calc(100vh - ${"80px"})`, // Adjusts height accordingly
        }}
      >
        <Hero />

        <Content />

        <OurConcernHome />

        <ServicesComponent />

        <OurClients />
        <CompanyValues />
        <OurStrategies />

        {/* <Testimonials></Testimonials> */}

        {/* <ContactCTA></ContactCTA> */}

        {/* <Statistics /> */}

        {/* <GridCards /> */}

        {/* <Timeline /> */}

        {/* <IndustriesWeServe /> */}

        {/* <Associates /> */}

        {/* <Contact></Contact> */}

        {/* <Location /> */}

        {/* <FeaturedVideo /> */}
      </div>
    
  );
};

export default Home;
