import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const OurResponsibilityModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchOurResponsibilityData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchOurResponsibilityData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/our-responsibility/`);

      if (!response.ok) {
        // If no data exists, initialize with default values
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch our responsibility data");
      }

      const data = await response.json();

      // Check if data exists and has the expected structure
      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          text: data.text || "",
        });

        setFeatures(data.features || []);
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching our responsibility data:", error);
      message.error("Failed to load our responsibility data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Our Services",
      text: "At Stech Group, we offer a wide range of innovative services across the industries we serve. From overseas manpower recruitment to healthcare services, we leverage the latest advancements in AI technology and are supported by a highly skilled team. We strive to deliver exceptional solutions and services to our customers. Our unwavering commitment is to meet our customers' needs and consistently surpass their expectations, ensuring excellence in every endeavor.",
    });
    setFeatures([]);
  };

  const handleImageUpload = async (file, featureId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "responsibility_images");

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

      // Update the specific feature's image
      const updatedFeatures = features.map(feature => 
        feature.id === featureId ? { ...feature, image: newImageUrl } : feature
      );
      setFeatures(updatedFeatures);

      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = (featureId) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, featureId);
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

  const handleAddFeature = () => {
    const newFeature = {
      id: Date.now(), // temporary ID
      image: "",
      primary_text: "",
      description: ""
    };
    setFeatures([...features, newFeature]);
  };

  const handleRemoveFeature = (id) => {
    setFeatures(features.filter(feature => feature.id !== id));
  };

  const handleFeatureChange = (id, field, value) => {
    const updatedFeatures = features.map(feature => 
      feature.id === id ? { ...feature, [field]: value } : feature
    );
    setFeatures(updatedFeatures);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        text: values.text,
        features: features.map(feature => ({
          image: feature.image,
          primary_text: feature.primary_text,
          description: feature.description
        })).filter(feature => feature.primary_text) // filter out features without primary text
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/our-responsibility/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save our responsibility data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Our Responsibility Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving our responsibility data:", error);
      message.error(error.message || "Failed to update our responsibility section");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Our Responsibility Section
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
                  placeholder="e.g., Our Responsibility"
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
                  placeholder="Description about the responsibility section"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Features"
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
                onClick={handleAddFeature}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Feature
              </Button>
            }
          >
            <List
              dataSource={features}
              renderItem={(feature) => (
                <List.Item key={feature.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <Input
                          placeholder="Feature Title"
                          value={feature.primary_text}
                          onChange={(e) => handleFeatureChange(feature.id, 'primary_text', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <TextArea
                          placeholder="Feature Description"
                          value={feature.description}
                          onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          rows={2}
                        />
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveFeature(feature.id)}
                        className="ml-4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium text-gray-700">Feature Image</div>
                      <div className="flex items-center gap-4">
                        <Upload {...uploadProps(feature.id)}>
                          <Button
                            icon={<UploadOutlined />}
                            loading={imageLoading}
                            className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Upload Image
                          </Button>
                        </Upload>
                        {feature.image && (
                          <div className="relative w-16 h-16">
                            <img
                              src={feature.image}
                              alt="Feature image"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
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

export default OurResponsibilityModal;