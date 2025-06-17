import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const CoreValuesModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({
    image1: false,
    image2: false
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchCoreValuesData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchCoreValuesData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/core-values/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch core values data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          mission: data.mission || "",
          vision: data.vision || "",
          values: data.values || "",
          image1: data.image1 || "",
          image2: data.image2 || ""
        });
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching core values data:", error);
      message.error("Failed to load core values data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Our Mission, Vision, & Values",
      mission: "Stech Group aims to deliver innovative and customer-centric solutions across diverse industries, fostering growth, trust, and value for our clients, employees, and partners while contributing to the socio-economic development of Bangladesh and beyond.",
      vision: "To become a global leader in our industries by setting benchmarks for quality, integrity, and excellence, while driving sustainable growth and making a positive impact in the communities we serve.",
      values: "At the heart of our Stech Group operations are five core values that guide us: Integrity, where we uphold transparency, trust, and ethical practices; Innovation, embracing creativity and advanced technologies to deliver exceptional solutions; Excellence, striving for superior performance and continuous improvement in every endeavor; Customer Focus, prioritizing the needs and satisfaction of our clients and stakeholders; and Social Responsibility, empowering communities through sustainable and meaningful initiatives. These values collectively drive our mission and vision toward achieving impactful growth and lasting success.",
      image1: "",
      image2: ""
    });
  };

  const handleImageUpload = async (file, imageField) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "core_values_images");

    try {
      setImageLoading(prev => ({ ...prev, [imageField]: true }));
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/images/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const newImageUrl = data.image;

      form.setFieldsValue({
        [imageField]: newImageUrl
      });

      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(prev => ({ ...prev, [imageField]: false }));
    }
  };

  const uploadProps = (imageField) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, imageField);
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        mission: values.mission,
        vision: values.vision,
        values: values.values,
        image1: values.image1 || "",
        image2: values.image2 || ""
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/core-values/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save core values data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Core Values Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving core values data:", error);
      message.error(error.message || "Failed to update core values");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Mission, Vision & Values
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
                label="Section Title"
                rules={[{ required: true, message: "Please enter the title" }]}
              >
                <Input
                  size="large"
                  placeholder="e.g., Our Mission, Vision & Values"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="mission"
                label="Mission Statement"
                rules={[{ required: true, message: "Please enter the mission statement" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter the company mission statement"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="vision"
                label="Vision Statement"
                rules={[{ required: true, message: "Please enter the vision statement" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter the company vision statement"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="values"
                label="Core Values"
                rules={[{ required: true, message: "Please enter the core values" }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Describe the company core values"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Images"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="Mission/Vision Image">
                <div className="flex flex-col gap-4">
                  <Upload {...uploadProps("image1")}>
                    <Button
                      icon={<UploadOutlined />}
                      loading={imageLoading.image1}
                      className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload Image
                    </Button>
                  </Upload>
                  {form.getFieldValue("image1") && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={form.getFieldValue("image1")}
                        alt="Mission/Vision"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>

              <Form.Item label="Values Image">
                <div className="flex flex-col gap-4">
                  <Upload {...uploadProps("image2")}>
                    <Button
                      icon={<UploadOutlined />}
                      loading={imageLoading.image2}
                      className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload Image
                    </Button>
                  </Upload>
                  {form.getFieldValue("image2") && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={form.getFieldValue("image2")}
                        alt="Core Values"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </div>
          </Card>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CoreValuesModal;