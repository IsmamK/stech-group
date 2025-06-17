import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Spin, Card, List } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const Contact1Modal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchContactData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/contact/contact1`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch contact data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          text: data.text || "",
        });

        setSections(data.sections || []);
        setContacts(data.sections?.[0]?.contacts || []);
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
      message.error("Failed to load contact data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "For Any Query Please Feel Free to Contact Us",
      text: "If you are interested in learning more about the Stech Group or would like to discuss a potential project, please do not hesitate to contact us...",
    });
    setSections([{
      id: Date.now(),
      title: "Contact Us",
      slug: "contact-us",
      text: "Contact Us",
      contacts: []
    }]);
    setContacts([]);
  };

  const handleAddContact = () => {
    const newContact = {
      id: Date.now(), // temporary ID
      phone_number: "",
      email: "",
      address: "",
      facebook_url: "",
      youtube_url: "",
      instagram_url: "",
      linked_in_url: "",
      map_iframe: ""
    };
    setContacts([...contacts, newContact]);
  };

  const handleRemoveContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleContactChange = (id, field, value) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    );
    setContacts(updatedContacts);
  };

  const handleSectionChange = (field, value) => {
    const updatedSections = sections.map(section => ({
      ...section,
      [field]: value
    }));
    setSections(updatedSections);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        text: values.text,
        sections: sections.map(section => ({
          ...section,
          contacts: contacts.filter(contact => 
            contact.phone_number || contact.email || contact.address
          )
        }))
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/contact/contact1/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save contact data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Contact Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving contact data:", error);
      message.error(error.message || "Failed to update contact section");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Contact Section
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button
          key="back"
          onClick={onClose}
          className="px-6 h-10 rounded-lg border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="px-6 h-10 rounded-lg bg-blue-600 hover:bg-blue-700"
        >
          Save Changes
        </Button>,
      ]}
      width={800}
      className="rounded-lg overflow-hidden"
      styles={{ body: { padding: "24px" } }}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" className="space-y-6">
          <Card
            title="Main Content"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                name="title"
                label={
                  <span className="font-medium text-gray-700">
                    Section Title
                  </span>
                }
                rules={[{ required: true, message: "Please enter the title" }]}
              >
                <Input
                  size="large"
                  placeholder="e.g., Contact Us"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="text"
                label={
                  <span className="font-medium text-gray-700">
                    Description
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter the description" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Description about the contact section"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Section Information"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Section Title
                  </span>
                }
              >
                <Input
                  value={sections[0]?.title || ""}
                  onChange={(e) => handleSectionChange('title', e.target.value)}
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    Section Slug
                  </span>
                }
              >
                <Input
                  value={sections[0]?.slug || ""}
                  onChange={(e) => handleSectionChange('slug', e.target.value)}
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Contact Information"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddContact}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Contact
              </Button>
            }
          >
            <List
              dataSource={contacts}
              renderItem={(contact) => (
                <List.Item key={contact.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <Input
                          placeholder="Phone Number"
                          value={contact.phone_number}
                          onChange={(e) => handleContactChange(contact.id, 'phone_number', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Input
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Input
                          placeholder="Address"
                          value={contact.address}
                          onChange={(e) => handleContactChange(contact.id, 'address', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Input
                          placeholder="Facebook URL"
                          value={contact.facebook_url}
                          onChange={(e) => handleContactChange(contact.id, 'facebook_url', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Input
                          placeholder="YouTube URL"
                          value={contact.youtube_url}
                          onChange={(e) => handleContactChange(contact.id, 'youtube_url', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Input
                          placeholder="Instagram URL"
                          value={contact.instagram_url}
                          onChange={(e) => handleContactChange(contact.id, 'instagram_url', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Input
                          placeholder="LinkedIn URL"
                          value={contact.linked_in_url}
                          onChange={(e) => handleContactChange(contact.id, 'linked_in_url', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Input
                          placeholder="Google Maps Iframe"
                          value={contact.map_iframe}
                          onChange={(e) => handleContactChange(contact.id, 'map_iframe', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveContact(contact.id)}
                        className="ml-4"
                      />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Contact1Modal;