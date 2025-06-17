import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Collapse } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Panel } = Collapse;

const OurServiceModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [principles, setPrinciples] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchServicesData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchServicesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/service-model/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch services data");
      }

      const data = await response.json();
      const servicesData = data.services_section;

      form.setFieldsValue({
        title: servicesData.title || "",
        text: servicesData.text || "",
      });
      setPrinciples(servicesData.principles || []);
      setServiceCategories(servicesData.service_categories || []);
    } catch (error) {
      console.error("Error fetching services data:", error);
      message.error("Failed to load services data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Our Services",
      text: "At Stech Group, we offer a wide range of innovative services across the industries we serve...",
    });
    setPrinciples([]);
    setServiceCategories([]);
  };

  const handleImageUpload = async (file, itemId, isPrinciple = true) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", isPrinciple ? "principles" : "service_categories");

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

      if (isPrinciple) {
        const updatedPrinciples = principles.map(item => 
          item.id === itemId ? { ...item, image: newImageUrl } : item
        );
        setPrinciples(updatedPrinciples);
      } else {
        const updatedCategories = serviceCategories.map(item => 
          item.id === itemId ? { ...item, logo: newImageUrl } : item
        );
        setServiceCategories(updatedCategories);
      }

      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = (itemId, isPrinciple = true) => ({
    name: isPrinciple ? "principle_image" : "service_logo",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, itemId, isPrinciple);
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

  const handleAddPrinciple = () => {
    const newPrinciple = {
      id: Date.now(),
      primary_text: "",
      description: "",
      image: ""
    };
    setPrinciples([...principles, newPrinciple]);
  };

  const handleRemovePrinciple = (id) => {
    setPrinciples(principles.filter(principle => principle.id !== id));
  };

  const handlePrincipleChange = (id, field, value) => {
    const updatedPrinciples = principles.map(principle => 
      principle.id === id ? { ...principle, [field]: value } : principle
    );
    setPrinciples(updatedPrinciples);
  };

  const handleAddServiceCategory = () => {
    const newCategory = {
      id: Date.now(),
      title: "",
      text: "",
      logo: ""
    };
    setServiceCategories([...serviceCategories, newCategory]);
  };

  const handleRemoveServiceCategory = (id) => {
    setServiceCategories(serviceCategories.filter(category => category.id !== id));
  };

  const handleServiceCategoryChange = (id, field, value) => {
    const updatedCategories = serviceCategories.map(category => 
      category.id === id ? { ...category, [field]: value } : category
    );
    setServiceCategories(updatedCategories);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        services_section: {
          title: values.title,
          text: values.text,
          principles: principles.map(principle => ({
            primary_text: principle.primary_text,
            description: principle.description,
            image: principle.image
          })).filter(principle => principle.primary_text && principle.description && principle.image),
          service_categories: serviceCategories.map(category => ({
            title: category.title,
            text: category.text,
            logo: category.logo
          })).filter(category => category.title && category.text && category.logo)
        }
      };

      const response = await fetch(`${apiUrl}/service-model/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save services data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Services Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving services data:", error);
      message.error(error.message || "Failed to update services section");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Services Section
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
      width={1000}
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
                  placeholder="e.g., Our Services"
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
                  placeholder="Description about the services section"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Collapse defaultActiveKey={['1', '2']} className="bg-white rounded-lg shadow-sm">
            <Panel header="Our Principles" key="1" extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddPrinciple}
                size="small"
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Principle
              </Button>
            }>
              <List
                dataSource={principles}
                renderItem={(principle) => (
                  <List.Item key={principle.id} className="p-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-full">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <Input
                            placeholder="Principle Title"
                            value={principle.primary_text}
                            onChange={(e) => handlePrincipleChange(principle.id, 'primary_text', e.target.value)}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                          
                          <TextArea
                            placeholder="Principle Description"
                            value={principle.description}
                            onChange={(e) => handlePrincipleChange(principle.id, 'description', e.target.value)}
                            rows={3}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                          
                          <div className="flex items-center gap-4">
                            <Upload {...uploadProps(principle.id, true)}>
                              <Button
                                icon={<UploadOutlined />}
                                loading={imageLoading}
                                className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Upload Image
                              </Button>
                            </Upload>
                            {principle.image && (
                              <div className="relative w-24 h-24">
                                <img
                                  src={principle.image}
                                  alt="Principle"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemovePrinciple(principle.id)}
                        />
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Panel>

            <Panel header="Service Categories" key="2" extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddServiceCategory}
                size="small"
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Category
              </Button>
            }>
              <List
                dataSource={serviceCategories}
                renderItem={(category) => (
                  <List.Item key={category.id} className="p-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-full">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <Input
                            placeholder="Category Title"
                            value={category.title}
                            onChange={(e) => handleServiceCategoryChange(category.id, 'title', e.target.value)}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                          
                          <Input
                            placeholder="Category Description"
                            value={category.text}
                            onChange={(e) => handleServiceCategoryChange(category.id, 'text', e.target.value)}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                          
                          <div className="flex items-center gap-4">
                            <Upload {...uploadProps(category.id, false)}>
                              <Button
                                icon={<UploadOutlined />}
                                loading={imageLoading}
                                className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Upload Logo
                              </Button>
                            </Upload>
                            {category.logo && (
                              <div className="relative w-16 h-16">
                                <img
                                  src={category.logo}
                                  alt="Service category"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveServiceCategory(category.id)}
                        />
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        </Form>
      </Spin>
    </Modal>
  );
};

export default OurServiceModal;