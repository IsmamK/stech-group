import React, { useState } from 'react';
import Home from '../../pages/Home';
import CarouselModal from './editor_modals/home_modals/CarouselModal';
import HeroModal from './editor_modals/home_modals/HeroModal';
import CardsModal from './editor_modals/home_modals/CardsModal';
// import ServicesModal from './editor_modals/home_modals/OurServiceModal';
import StatisticsModal from './editor_modals/home_modals/StatisticsModal';
import WhyUsModal from './editor_modals/home_modals/WhyUsModal';
import OurClientsModal from './editor_modals/home_modals/OurClientsModal';
import LocationModal from './editor_modals/home_modals/LocationModal';
import AssociatesModal from './editor_modals/home_modals/AssociatesModal';
import IndustriesModal from './editor_modals/home_modals/IndustriesModal';
import TimelineModal from './editor_modals/home_modals/TimelineModal';
import AboutPreviewModal from './editor_modals/home_modals/AboutPreviewModal';
import ContactModal from './editor_modals/home_modals/LocationModal';
import OurConcern from './editor_modals/home_modals/OurConcern';
import CompanyValuesModal from './editor_modals/home_modals/CompanyValuesModal';
import OurStrengthModal from './editor_modals/home_modals/OurStrengthModal';
// import OurServiceModal from './editor_modals/home_modals/OurServicesModal';
import OurResponsibilityModal from './editor_modals/home_modals/OurResponsibilityModal';
import OurServiceModal from './editor_modals/home_modals/OurServiceModal';

const HomeEditor = ({ getDivider, availableShapes }) => {
  const [isCarouselOpen, setCarouselOpen] = useState(false);
  const [isAboutPreview, setAboutPreview] = useState(false);
  const [isHeroOpen, setHeroOpen] = useState(false);
  const [isCardsOpen, setCardsOpen] = useState(false);
  // const [isServicesOpen, setServicesOpen] = useState(false);
  const [isStatisticsOpen, setStatisticsOpen] = useState(false);
  const [isGridCardsOpen, setGridCardsOpen] = useState(false);
  const [isWhyUsOpen, setWhyUsOpen] = useState(false);
  const [isOurClientsOpen, setOurClientsOpen] = useState(false);
  const [isAssociatesOpen, setAssociatesOpen] = useState(false);
  const [isNewsOpen, setNewsOpen] = useState(false);
  const [isLocationOpen, setLocationOpen] = useState(false);
  const [isOurConcern, setOurConcern] = useState(false);
  const [isCompanyValues, setCompanyValues] = useState(false);
  const [isOurStrength, setOurStrength] = useState(false);
  const [isOurService, setOurService] = useState(false);
  const [isOurResponsibility, setOurResponsibility] = useState(false);

  return (
    <div className='flex gap-40 items-start justify-between p-20 w-[1300px]'>
      {/* Buttons Section */}
      <div className='grid grid-cols-2 gap-28 font-bold text-center'>
        <button className="btn btn-primary w-20 m-2" onClick={() => setHeroOpen(true)}>Hero</button>
        <button className="btn btn-primary w-20 m-2" onClick={() => setCarouselOpen(true)}>Description</button>
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setCardsOpen(true)}>Country Cards</button> */}
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setServicesOpen(true)}>Services</button> */}
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setStatisticsOpen(true)}>Statistics</button> */}
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setWhyUsOpen(true)}>Why Us</button> */}
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setGridCardsOpen(true)}>Timeline</button> */}

        <button className="btn btn-primary w-20 m-2" onClick={() => setOurClientsOpen(true)}>Our Clients</button>
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setAssociatesOpen(true)}>Associates</button> */}
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setNewsOpen(true)}>Industries</button> */}
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setLocationOpen(true)}>Contact</button> */}
        <button className="btn btn-primary w-20 m-2" onClick={() => setOurConcern(true)}>Our Concern</button>
        <button className="btn btn-primary w-20 m-2" onClick={() => setCompanyValues(true)}>Company Values</button>
        <button className="btn btn-primary w-20 m-2" onClick={() => setOurStrength(true)}>Our Strength</button>
        <button className="btn btn-primary w-20 m-2" onClick={() => setOurService(true)}>Our Services</button>
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setOurResponsibility(true)}>Our Responsibilities</button> */}
      </div>

      {/* Mockup Browser Section */}
      <div className="mockup-browser bg-white border-8 border-black p-2 h-[1000px] overflow-y-scroll">
        <div>
          <div className="mockup-browser-toolbar m-10">
            <div className="input">https://sample-website.com</div>
          </div>
          <div className='overflow-scroll'>
            <Home context={{ getDivider, availableShapes }} />
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <CarouselModal isOpen={isCarouselOpen} onClose={() => setCarouselOpen(false)} />
      <HeroModal isOpen={isHeroOpen} onClose={() => setHeroOpen(false)} />
      {/* <AboutPreviewModal isOpen={isAboutPreview} onClose={() => setAboutPreview(false)} /> */}
      {/* <CardsModal isOpen={isCardsOpen} onClose={() => setCardsOpen(false)} /> */}
      {/* <ServicesModal isOpen={isServicesOpen} onClose={() => setServicesOpen(false)} /> */}
      {/* <StatisticsModal isOpen={isStatisticsOpen} onClose={() => setStatisticsOpen(false)} /> */}
      {/* <TimelineModal isOpen={isGridCardsOpen} onClose={() => setGridCardsOpen(false)} /> */}
      {/* <WhyUsModal isOpen={isWhyUsOpen} onClose={() => setWhyUsOpen(false)} /> */}
      <OurClientsModal isOpen={isOurClientsOpen} onClose={() => setOurClientsOpen(false)} />
      {/* <AssociatesModal isOpen={isAssociatesOpen} onClose={() => setAssociatesOpen(false)} /> */}
      {/* <IndustriesModal isOpen={isNewsOpen} onClose={() => setNewsOpen(false)} /> */}
      {/* <LocationModal isOpen={isLocationOpen} onClose={() => setLocationOpen(false)} /> */}
      {/* <ContactModal isOpen={isLocationOpen} onClose={() => setLocationOpen(false)} /> */}
      <OurConcern isOpen={isOurConcern} onClose={() => setOurConcern(false)} />
      <CompanyValuesModal isOpen={isCompanyValues} onClose={() => setCompanyValues(false)} />
      <OurStrengthModal isOpen={isOurStrength} onClose={() => setOurStrength(false)} />
      <OurServiceModal isOpen={isOurService} onClose={() => setOurService(false)} />
      <OurResponsibilityModal isOpen={isOurResponsibility} onClose={() => setOurResponsibility(false)} />
    </div>
  );
};

export default HomeEditor;
