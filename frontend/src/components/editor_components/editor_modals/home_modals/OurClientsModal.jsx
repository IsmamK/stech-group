import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const OurClientsModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchClientsData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchClientsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/home/clients`);

      if (!response.ok) {
        // If no data exists (404), initialize with default values
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch clients data");
      }

      const data = await response.json();

      // Set form values and clients
      form.setFieldsValue({
        title: data.title || "",
        text: data.text || "",
      });
      setClients(data.clients || []);
    } catch (error) {
      console.error("Error fetching clients data:", error);
      message.error("Failed to load clients data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Our Top Clients",
      text: "We have served many national and international clients at Stech Group. Our clients are happy and satisfied because we never compromise our service quality at any cost. Some of our national and international clients are:",
    });
    setClients([]);
  };

  const handleImageUpload = async (file, clientId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "client_logos");

    try {
      setImageLoading(true);
      const response = await fetch(`${apiUrl}/images/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const newImageUrl = `${data.image}`;

      // Update the specific client's logo
      const updatedClients = clients.map(client => 
        client.id === clientId ? { ...client, logo: newImageUrl } : client
      );
      setClients(updatedClients);

      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = (clientId) => ({
    name: "logo",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, clientId);
      if (imageUrl) {
        onSuccess(imageUrl, file);
      } else {
        onError(new Error("Upload failed"));
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      return isImage && isLt5M;
    },
  });

  const handleAddClient = () => {
    const newClient = {
      id: Date.now(), // temporary ID
      name: "",
      logo: ""
    };
    setClients([...clients, newClient]);
  };

  const handleRemoveClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const handleClientChange = (id, field, value) => {
    const updatedClients = clients.map(client => 
      client.id === id ? { ...client, [field]: value } : client
    );
    setClients(updatedClients);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        text: values.text,
        clients: clients.map(client => ({
          name: client.name,
          logo: client.logo
        })).filter(client => client.name && client.logo) // filter out incomplete clients
      };

      const response = await fetch(`${apiUrl}/home/clients/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save clients data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Clients Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving clients data:", error);
      message.error(error.message || "Failed to update clients section");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Our Clients Section
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
                  placeholder="e.g., Our Top Clients"
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
                  placeholder="Description about the clients section"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Client Logos"
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
                onClick={handleAddClient}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Client
              </Button>
            }
          >
            <List
              dataSource={clients}
              renderItem={(client) => (
                <List.Item key={client.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Client Name"
                          value={client.name}
                          onChange={(e) => handleClientChange(client.id, 'name', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400 mb-4"
                        />
                        
                        <div className="flex items-center gap-4">
                          <Upload {...uploadProps(client.id)}>
                            <Button
                              icon={<UploadOutlined />}
                              loading={imageLoading}
                              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Upload Logo
                            </Button>
                          </Upload>
                          {client.logo && (
                            <div className="relative w-16 h-16">
                              <img
                                src={client.logo}
                                alt="Client logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveClient(client.id)}
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

export default OurClientsModal;