import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Switch } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const OurStrengthModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [strengths, setStrengths] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchStrengthData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchStrengthData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/our-strength/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch strength data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          description: Array.isArray(data.text) ? data.text.join('\n') : data.text || "",
          videos: data.videos || ""
        });

        setIsActive(data.isActive !== false); // Default to true if not specified

        if (Array.isArray(data.text)) {
          setStrengths(data.text.map((item, index) => ({
            id: index,
            text: item.startsWith("💠 ") ? item : `💠 ${item}`
          })));
        } else {
          setStrengths([]);
        }
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching strength data:", error);
      message.error("Failed to load strength data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Our Strength",
      description: [
        "Highly Skilled Team",
        "Comprehensive Solutions",
        "Cost-Effective Services",
        "Proactive Approach",
        "Customer-Focused",
        "High-Quality Standards"
      ].join('\n'),
      videos: ""
    });
    setStrengths([
      { id: 1, text: "💠 Highly Skilled Team" },
      { id: 2, text: "💠 Comprehensive Solutions" },
      { id: 3, text: "💠 Cost-Effective Services" },
      { id: 4, text: "💠 Proactive Approach" },
      { id: 5, text: "💠 Customer-Focused" },
      { id: 6, text: "💠 High-Quality Standards" }
    ]);
    setIsActive(true);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "strength_media");

    try {
      setImageLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/images/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      const newUrl = data.url;
      
      form.setFieldsValue({
        videos: newUrl
      });

      message.success("Media uploaded successfully");
      return newUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error(`Media upload failed: ${error.message}`);
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = {
    name: "videos",
    showUploadList: false,
    multiple: false,
    accept: "image/*,video/*",
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const url = await handleUpload(file);
        if (url) {
          onSuccess(url, file);
        } else {
          onError(new Error("Upload failed"));
        }
      } catch (error) {
        onError(error);
      }
    },
    beforeUpload: (file) => {
      const isMedia = file.type.startsWith("image/") || file.type.startsWith("video/");
      if (!isMedia) {
        message.error("You can only upload image or video files!");
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("File must be smaller than 10MB!");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange(info) {
      if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleAddStrength = () => {
    const newStrength = {
      id: Date.now(),
      text: "💠 " // Automatically add bullet point
    };
    setStrengths([...strengths, newStrength]);
  };

  const handleRemoveStrength = (id) => {
    setStrengths(strengths.filter(strength => strength.id !== id));
  };

  const handleStrengthChange = (id, value) => {
    // Ensure bullet point remains at start
    const formattedValue = value.startsWith("💠 ") ? value : `💠 ${value}`;
    const updatedStrengths = strengths.map(strength => 
      strength.id === id ? { ...strength, text: formattedValue } : strength
    );
    setStrengths(updatedStrengths);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        text: strengths.map(strength => strength.text.replace(/^💠\s*/, "")), // Remove bullet points for storage
        videos: values.videos,
        isActive: isActive
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/our-strength/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save strength data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Strength Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving strength data:", error);
      message.error(error.message || "Failed to update strength section");
    }
  };

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">
            Edit Our Strength Section
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{isActive ? "Active" : "Disabled"}</span>
            <Switch 
              checked={isActive} 
              onChange={setIsActive}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </div>
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
                  placeholder="e.g., Our Strength"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="videos"
                label={
                  <span className="font-medium text-gray-700">
                    Video/Image URL
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
                      Upload Video/Image
                    </Button>
                  </Upload>
                  <Input
                    value={form.getFieldValue('videos')}
                    onChange={(e) => form.setFieldsValue({ videos: e.target.value })}
                    className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                  />
                </div>
                {form.getFieldValue('videos') && (
                  <div className="mt-2">
                    {form.getFieldValue('videos').match(/\.(mp4|webm|ogg)$/i) ? (
                      <video 
                        src={form.getFieldValue('videos')} 
                        controls 
                        className="max-w-full h-auto max-h-40"
                      />
                    ) : (
                      <img 
                        src={form.getFieldValue('videos')} 
                        alt="Media preview" 
                        className="max-w-full h-auto max-h-40"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    )}
                  </div>
                )}
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Strengths List"
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
                onClick={handleAddStrength}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Strength
              </Button>
            }
          >
            <List
              dataSource={strengths}
              renderItem={(strength) => (
                <List.Item key={strength.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Enter strength point"
                          value={strength.text}
                          onChange={(e) => handleStrengthChange(strength.id, e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveStrength(strength.id)}
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

export default OurStrengthModal;