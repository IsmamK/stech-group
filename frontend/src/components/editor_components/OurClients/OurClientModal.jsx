import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const OurClientModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClientsData();
    }
  }, [isOpen]);

  const fetchClientsData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/home/our-clients/`);

      if (!response.ok) {
        // If no data exists, initialize with default values
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch clients data");
      }

      const data = await response.json();

      // Check if data exists and has the expected structure
      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          text: data.text || "",
        });

        // Ensure clients have unique IDs
        setClients(
          (data.clients || []).map((client) => ({
            ...client,
            id: client.id || Date.now() + Math.random(), // Use server ID or generate a temporary one
          }))
        );
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching clients data:", error);
      message.error("Failed to load clients data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Stech Group - A Name of Trust & Quality Service Provider",
      text: "Stech Group has already served quality services to hundreds of reputed clients, including multinationals, small businesses, and start-ups. We have a team of experienced professionals who can handle your project with utmost care and dedication. Our offers are simple but a wide range of services, including human resource management, manpower supply, blockchain-based information technology, food, medical, etc. Here are some of our satisfied client lists. At Stech Group, we do not compromise on quality for anything and serve the best for clients. We understand that currently, service quality standard has dropped due to dishonesty and overwhelming pricing policy. We bring everything to the right standard and ensure them inches to inches. Not only that, we have maintained international standard pricing for services based on our economy."
    });
    setClients([]);
  };

  const handleImageUpload = async (file, clientId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "client_logos");

    try {
      setImageLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL;
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
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId ? { ...client, logo: newImageUrl } : client
        )
      );

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
      id: Date.now() + Math.random(), // unique temporary ID
      name: "",
      logo: ""
    };
    setClients(prevClients => [...prevClients, newClient]);
  };

  const handleRemoveClient = (id) => {
    setClients(prevClients => prevClients.filter(client => client.id !== id));
  };

  const handleClientChange = (id, field, value) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === id ? { ...client, [field]: value } : client
      )
    );
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
        })).filter(client => client.name) // filter out clients without a name
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/home/our-clients/`, {
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

      // Fetch the updated data to ensure our state is in sync with the server
      await fetchClientsData();

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
                    Description Text
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter the description text" },
                ]}
              >
                <TextArea
                  rows={6}
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

export default OurClientModal;