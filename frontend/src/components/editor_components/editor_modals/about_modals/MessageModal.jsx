import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const MessageModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchChairmanMessageData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchChairmanMessageData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/chairman-message/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch chairman message data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          heading: data.heading || "",
          subheading: data.subheading || "",
          description: data.description || "",
          name: data.name || "",
          designation: data.designation || "",
          image: data.image || ""
        });
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching chairman message data:", error);
      message.error("Failed to load chairman message data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      heading: "Chairman's Message",
      subheading: "Stech Group is one of the most growing groups of companies in Bangladesh and we want to keep it that way. Our goal is to do something great for the nation globally. Keeping that in our mind, we are moving forward with the latest technology and implementing them on our sister's concerns.",
      description: "Stech Group was created with the hope of many dreams coming together. We are passionate about the opportunity we have to be independent in all aspects of a sustainable environment. Our divisions were built in order to use our resources more effectively and avoid the need for subcontracting. This saves time when it comes to servicing. We're moving quickly and taking a keen interest in what our consumers want and need. We designed Stech Group to be consumer-focused from the get-go. We're expanding our operations and growing our workforce because we're committed to providing a one-stop solution for the heavy industrial market. The changes we see in our company underscore our commitment to this goal and demonstrate our progress. We are a practical organization that provides a wide range of services. We have planned and executed our projects well, and we continue to improve our services. Thanks to our new partners and our dedication to quality work, we are expanding and will continue to do so.",
      name: "Md Sohel Rana",
      designation: "Chairman",
      image: ""
    });
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "chairman_photo");

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
      const newImageUrl = data.image;

      form.setFieldsValue({
        image: newImageUrl
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
    name: "image",
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
        heading: values.heading,
        subheading: values.subheading,
        description: values.description,
        name: values.name,
        designation: values.designation,
        image: values.image || ""
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/chairman-message/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save chairman message data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Chairman's Message Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving chairman message data:", error);
      message.error(error.message || "Failed to update chairman's message");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Chairman's Message
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
            title="Chairman's Message Content"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <div className="grid grid-cols-1 gap-6">
              <Form.Item
                name="heading"
                label="Heading"
                rules={[{ required: true, message: "Please enter the heading" }]}
              >
                <Input
                  size="large"
                  placeholder="e.g., Chairman's Message"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="subheading"
                label="Subheading"
                rules={[{ required: true, message: "Please enter the subheading" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Short introduction text"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter the description" }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Detailed message content"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                  name="name"
                  label="Chairman's Name"
                  rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input
                    size="large"
                    placeholder="e.g., Md Sohel Rana"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                  />
                </Form.Item>

                <Form.Item
                  name="designation"
                  label="Designation"
                  rules={[{ required: true, message: "Please enter the designation" }]}
                >
                  <Input
                    size="large"
                    placeholder="e.g., Chairman"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                  />
                </Form.Item>
              </div>

              <Form.Item label="Chairman's Photo">
                <div className="flex items-center gap-6">
                  <Upload {...uploadProps}>
                    <Button
                      icon={<UploadOutlined />}
                      loading={imageLoading}
                      className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload Photo
                    </Button>
                  </Upload>
                  {form.getFieldValue("image") && (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={form.getFieldValue("image")}
                        alt="Chairman's photo"
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

export default MessageModal;