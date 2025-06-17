import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import OurClientsModal from "./editor_modals/home_modals/OurClientsModal";
import OurClientModal from "./OurClients/OurClientModal";
import OurConcernModal from "./editor_modals/ourConcern/OurConcernModal";

const { TextArea } = Input;

const OurConcernEditor = ({ isOpen, onClose }) => {
   const [isOurClient, setOurClient] = useState(false);

  return (
    <div className='flex gap-40 items-start justify-between p-20 w-[1300px]'>
      {/* Buttons Section */}
      <div className='grid grid-cols-2 gap-28 font-bold text-center'>

        <button className="btn btn-primary w-20 m-2" onClick={() => setOurClient(true)}>Our Concern</button>
      </div>

      <OurConcernModal isOpen={isOurClient} onClose={() => setOurClient(false)} />
    </div>
  );
};

export default OurConcernEditor;