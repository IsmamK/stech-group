import React, { useState } from 'react';
import Home from '../../pages/Home';
import ServiceDescriptionModal from './editor_modals/servicesModal/ServiceDescriptionModal';
// import ServiceModel from './editor_modals/servicesModal/ServiceModal';
import ServiceModal from './editor_modals/servicesModal/ServiceModal';

const ServicesEditor = ({ getDivider, availableShapes }) => {
  const [isCarouselOpen, setCarouselOpen] = useState(false);
  const [isAboutPreview, setAboutPreview] = useState(false);
  const [isHeroOpen, setHeroOpen] = useState(false);
  const [isCardsOpen, setCardsOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isStatisticsOpen, setStatisticsOpen] = useState(false);
  const [isGridCardsOpen, setGridCardsOpen] = useState(false);
  const [isWhyUsOpen, setWhyUsOpen] = useState(false);
  const [isOurClientsOpen, setOurClientsOpen] = useState(false);
  const [isAssociatesOpen, setAssociatesOpen] = useState(false);
  const [isNewsOpen, setNewsOpen] = useState(false);
  const [isLocationOpen, setLocationOpen] = useState(false);

  return (
    <div className='flex gap-40 items-start justify-between p-20 w-[1300px]'>
      {/* Buttons Section */}
      <div className='grid grid-cols-2 gap-28 font-bold text-center'>
        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setHeroOpen(true)}>Description</button> */}
        <button className="btn btn-primary w-20 m-2" onClick={() => setLocationOpen(true)}>Services</button>
      </div>

      {/* Mockup Browser Section */}
      <div className="mockup-browser bg-white border-8 border-black p-2 h-[1000px] overflow-y-scroll">
        <div>
          <div className="mockup-browser-toolbar m-10">
            <div className="input">https://sample-website.com</div>
          </div>
          <div className='overflow-scroll'>
            {/* <Home context={{ getDivider, availableShapes }} /> */}
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <ServiceDescriptionModal isOpen={isHeroOpen} onClose={() => setHeroOpen(false)} />
      <ServiceModal isOpen={isLocationOpen} onClose={() => setLocationOpen(false)} />
      
    </div>
  );
};

export default ServicesEditor;
