import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import OurClientsModal from "./editor_modals/home_modals/OurClientsModal";
import OurClientModal from "./OurClients/OurClientModal";
import DescriptionModal from "./editor_modals/newsandevents/DescriptionModal";
import RecruitmentModal from "./editor_modals/newsandevents/RecruitmentModal";
import NewsAndEventsModal from "./editor_modals/newsandevents/NewsAndEventsModal";

const { TextArea } = Input;

const NewsAndEventsEditor = ({ isOpen, onClose }) => {
   const [isDescription, setDescription] = useState(false);
   const [isRecuitment, setRecuitment] = useState(false);
   const [isNewsEvents, setNewsEvents] = useState(false);

  return (
    <div className='flex gap-40 items-start justify-between p-20 w-[1300px]'>
      {/* Buttons Section */}
      <div className='grid grid-cols-2 gap-28 font-bold text-center'>

        {/* <button className="btn btn-primary w-20 m-2" onClick={() => setDescription(true)}>Description</button>
        <button className="btn btn-primary w-20 m-2" onClick={() => setRecuitment(true)}>Recruitment</button> */}
        <button className="btn btn-primary w-20 m-2" onClick={() => setNewsEvents(true)}>News And Events</button>
      </div>

      <DescriptionModal isOpen={isDescription} onClose={() => setDescription(false)} />
      <RecruitmentModal isOpen={isRecuitment} onClose={() => setRecuitment(false)} />
      <NewsAndEventsModal isOpen={isNewsEvents} onClose={() => setNewsEvents(false)} />
    </div>
  );
};

export default NewsAndEventsEditor;