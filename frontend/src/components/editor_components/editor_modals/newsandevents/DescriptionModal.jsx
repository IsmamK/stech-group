import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const DescriptionModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchDescriptionData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchDescriptionData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/news-events-description/`);

      if (!response.ok) {
        // If no data exists, initialize with default values
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch description data");
      }

      const data = await response.json();

      // Check if data exists and has the expected structure
      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          description: data.description || "",
        });

        if (data.logo) {
          form.setFieldsValue({
            logo: data.logo
          });
        }
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching description data:", error);
      message.error("Failed to load description data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "The Latest News and Events on Stech Group Business Concerns",
      description: "Our Latest News and Events on Stech Group are highlighted here to showcase the updates from its diverse business concerns. It highlights key milestones, recent achievements, community initiatives, and industry events involving Stech Group's ventures, such as JG Healthcare, JG Alfalah, Stech Holidays, and others. This section keeps stakeholders informed and engaged while reflecting the group's commitment to transparency, innovation, and progress. Stay connected to explore how Stech Group continues to shape industries and communities locally and internationally.",
      logo: ""
    });
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "news_events");

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

      form.setFieldsValue({
        logo: newImageUrl
      });

      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = {
    name: "logo",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file);
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
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        description: values.description,
        logo: values.logo || ""
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/news-events-description/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save description data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Description Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving description data:", error);
      message.error(error.message || "Failed to update description");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit News & Events Description
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
                  placeholder="e.g., The Latest News and Events"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="description"
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
                  rows={6}
                  placeholder="Description about the news and events section"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="logo"
                label={
                  <span className="font-medium text-gray-700">
                    Section Logo
                  </span>
                }
              >
                <div className="flex items-center gap-4">
                  <Upload {...uploadProps}>
                    <Button
                      icon={<UploadOutlined />}
                      loading={imageLoading}
                      className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload Logo
                    </Button>
                  </Upload>
                  {form.getFieldValue('logo') && (
                    <div className="relative w-16 h-16">
                      <img
                        src={form.getFieldValue('logo')}
                        alt="Section logo"
                        className="w-full h-full object-contain"
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

export default DescriptionModal;