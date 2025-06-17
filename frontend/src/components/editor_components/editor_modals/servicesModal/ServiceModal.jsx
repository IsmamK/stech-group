import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Collapse, Tooltip, Alert } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
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
  const [activePanels, setActivePanels] = useState(['1', '2']);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      fetchServicesData();
    }
  }, [isOpen]);

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
      const servicesData = data.services_section || {};

      form.setFieldsValue({
        title: servicesData.title || "",
        text: servicesData.text || "",
      });

      setPrinciples((servicesData.principles || []).map(item => ({
        ...item,
        id: item.id || Date.now() + Math.random()
      })));

      setServiceCategories((servicesData.service_categories || []).map(item => ({
        ...item,
        id: item.id || Date.now() + Math.random()
      })));
      
      setInitialized(true);
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
    setInitialized(true);
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
        setPrinciples(prev => prev.map(item => 
          item.id === itemId ? { ...item, image: newImageUrl } : item
        ));
      } else {
        setServiceCategories(prev => prev.map(item => 
          item.id === itemId ? { ...item, logo: newImageUrl } : item
        ));
      }

      message.success("Image uploaded successfully!");
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
      id: Date.now() + Math.random(),
      primary_text: "",
      description: "",
      image: ""
    };
    setPrinciples(prev => [...prev, newPrinciple]);
    setActivePanels(['1', ...activePanels]);
  };

  const handleRemovePrinciple = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setPrinciples(prev => prev.filter(principle => principle.id !== id));
        message.success('Principle removed successfully');
      }
    });
  };

  const handlePrincipleChange = (id, field, value) => {
    setPrinciples(prev => prev.map(principle => 
      principle.id === id ? { ...principle, [field]: value } : principle
    ));
  };

  const handleAddServiceCategory = () => {
    const newCategory = {
      id: Date.now() + Math.random(),
      title: "",
      text: "",
      logo: ""
    };
    setServiceCategories(prev => [...prev, newCategory]);
    setActivePanels(['2', ...activePanels]);
  };

  const handleRemoveServiceCategory = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setServiceCategories(prev => prev.filter(category => category.id !== id));
        message.success('Service category removed successfully');
      }
    });
  };

  const handleServiceCategoryChange = (id, field, value) => {
    setServiceCategories(prev => prev.map(category => 
      category.id === id ? { ...category, [field]: value } : category
    ));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const incompletePrinciples = principles.filter(p => !p.primary_text || !p.description || !p.image);
      if (incompletePrinciples.length > 0) {
        throw new Error("Please complete all principle fields or remove incomplete principles");
      }
      
      const incompleteCategories = serviceCategories.filter(c => !c.title || !c.text || !c.logo);
      if (incompleteCategories.length > 0) {
        throw new Error("Please complete all service category fields or remove incomplete categories");
      }

      const updatedData = {
        services_section: {
          title: values.title,
          text: values.text,
          principles: principles.map(({ id, ...rest }) => rest),
          service_categories: serviceCategories.map(({ id, ...rest }) => rest)
        }
      };

      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePanelChange = (keys) => {
    setActivePanels(keys);
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-800">
            Edit Services Section
          </span>
          <Tooltip title="This section displays your company's services and guiding principles">
            <InfoCircleOutlined className="ml-2 text-blue-500" />
          </Tooltip>
        </div>
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
      <Spin spinning={loading} tip="Loading service data...">
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
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      Section Title
                    </span>
                    <Tooltip title="This will be the main heading for the Services section">
                      <QuestionCircleOutlined className="ml-2 text-gray-400" />
                    </Tooltip>
                  </div>
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
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      Description
                    </span>
                    <Tooltip title="This introductory text appears below the section title">
                      <QuestionCircleOutlined className="ml-2 text-gray-400" />
                    </Tooltip>
                  </div>
                }
                rules={[
                  { required: true, message: "Please enter the description" }
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

          <Collapse 
            activeKey={activePanels}
            onChange={handlePanelChange}
            className="bg-white rounded-lg shadow-sm"
            expandIconPosition="end"
          >
            <Panel 
              header={
                <div className="flex items-center">
                  <span className="font-medium">Our Principles</span>
                  <Tooltip title="Add your company's guiding principles with images">
                    <QuestionCircleOutlined className="ml-2 text-gray-400" />
                  </Tooltip>
                </div>
              } 
              key="1" 
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddPrinciple}
                  size="small"
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  Add Principle
                </Button>
              }
            >
              {principles.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No principles added yet. Click "Add Principle" to get started.
                </div>
              ) : (
                <List
                  dataSource={principles}
                  renderItem={(principle) => (
                    <List.Item key={principle.id} className="p-4 mb-4 border border-gray-200 rounded-lg">
                      <div className="w-full">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Principle Title*
                              </label>
                              <Input
                                value={principle.primary_text}
                                onChange={(e) => handlePrincipleChange(principle.id, 'primary_text', e.target.value)}
                                placeholder="e.g., Innovation"
                                className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description*
                              </label>
                              <TextArea
                                value={principle.description}
                                onChange={(e) => handlePrincipleChange(principle.id, 'description', e.target.value)}
                                placeholder="Detailed description of the principle..."
                                rows={3}
                                className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image*
                                <Tooltip title="Recommended size: 600x400px">
                                  <QuestionCircleOutlined className="ml-1 text-gray-400" />
                                </Tooltip>
                              </label>
                              <div className="flex items-center gap-4">
                                <Upload {...uploadProps(principle.id, true)}>
                                  <Button
                                    icon={<UploadOutlined />}
                                    loading={imageLoading}
                                    className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    {principle.image ? "Change Image" : "Upload Image"}
                                  </Button>
                                </Upload>
                                {principle.image && (
                                  <div className="relative group w-32 h-24">
                                    <img
                                      src={principle.image}
                                      alt="Principle"
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                      <span className="text-white text-xs text-center p-1">Click 'Change Image' to update</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemovePrinciple(principle.id)}
                            className="ml-2"
                          />
                        </div>
                        {(!principle.primary_text || !principle.description || !principle.image) && (
                          <Alert
                            message="Complete all fields for this principle"
                            type="warning"
                            showIcon
                            className="mt-3"
                          />
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Panel>

            <Panel 
              header={
                <div className="flex items-center">
                  <span className="font-medium">Service Categories</span>
                  <Tooltip title="Add different service categories your company offers">
                    <QuestionCircleOutlined className="ml-2 text-gray-400" />
                  </Tooltip>
                </div>
              } 
              key="2" 
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddServiceCategory}
                  size="small"
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  Add Category
                </Button>
              }
            >
              {serviceCategories.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No service categories added yet. Click "Add Category" to get started.
                </div>
              ) : (
                <List
                  dataSource={serviceCategories}
                  renderItem={(category) => (
                    <List.Item key={category.id} className="p-4 mb-4 border border-gray-200 rounded-lg">
                      <div className="w-full">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Title*
                              </label>
                              <Input
                                value={category.title}
                                onChange={(e) => handleServiceCategoryChange(category.id, 'title', e.target.value)}
                                placeholder="e.g., IT Services"
                                className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description*
                              </label>
                              <Input
                                value={category.text}
                                onChange={(e) => handleServiceCategoryChange(category.id, 'text', e.target.value)}
                                placeholder="Brief description of the service category..."
                                className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo*
                                <Tooltip title="Recommended size: 200x200px with transparent background">
                                  <QuestionCircleOutlined className="ml-1 text-gray-400" />
                                </Tooltip>
                              </label>
                              <div className="flex items-center gap-4">
                                <Upload {...uploadProps(category.id, false)}>
                                  <Button
                                    icon={<UploadOutlined />}
                                    loading={imageLoading}
                                    className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    {category.logo ? "Change Logo" : "Upload Logo"}
                                  </Button>
                                </Upload>
                                {category.logo && (
                                  <div className="relative group w-16 h-16">
                                    <img
                                      src={category.logo}
                                      alt="Service category"
                                      className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                      <span className="text-white text-xs text-center p-1">Click 'Change Logo' to update</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveServiceCategory(category.id)}
                            className="ml-2"
                          />
                        </div>
                        {(!category.title || !category.text || !category.logo) && (
                          <Alert
                            message="Complete all fields for this category"
                            type="warning"
                            showIcon
                            className="mt-3"
                          />
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Panel>
          </Collapse>
        </Form>
      </Spin>
    </Modal>
  );
};

export default OurServiceModal;