import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List } from "antd";

import EditNavbarModal from "./editor_modals/layout_modals/EditNavbarModal";
import EditFooterModal from "./editor_modals/layout_modals/EditFooterModal";

const { TextArea } = Input;

const OurClientsEditor = ({ isOpen, onClose }) => {
   const [isnavbarModal, setnavbarModal] = useState(false);
   const [isfooterModal, setfooterModal] = useState(false);

  return (
    <div className='flex gap-40 items-start justify-between p-20 w-[1300px]'>
      {/* Buttons Section */}
      <div className='grid grid-cols-2 gap-28 font-bold text-center'>

        <button className="btn btn-primary w-20 m-2" onClick={() => setnavbarModal(true)}>Navbar</button>
        <button className="btn btn-primary w-20 m-2" onClick={() => setfooterModal(true)}>Footer</button>
      </div>

      <EditNavbarModal isOpen={isnavbarModal} onClose={() => setnavbarModal(false)} />
      <EditFooterModal isOpen={isfooterModal} onClose={() => setfooterModal(false)} />
    </div>
  );
};

export default OurClientsEditor;