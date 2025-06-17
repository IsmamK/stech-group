import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, DatePicker } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import moment from "moment";

const { TextArea } = Input;

const RecruitmentModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchRecruitmentData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchRecruitmentData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/recruitment/`);

      if (!response.ok) {
        // If no data exists, initialize with default values
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch recruitment data");
      }

      const data = await response.json();

      // Check if data exists and has the expected structure
      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          description: data.description || "",
          date: data.date ? moment(data.date) : null,
          image: data.image || ""
        });
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching recruitment data:", error);
      message.error("Failed to load recruitment data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "JG Alfalah: Your Trusted Partner in Overseas Recruitment for Malaysia",
      description: "In the competitive landscape of international manpower recruitment, JG Alfalah Management stands as a pillar of trust and efficiency. As a flagship initiative under the Stech Group, JG Alfalah specializes mobilizing skilled professionals from Bangladesh to lucrative job opportunities in Malaysia and beyond.\n\nWhy Bangladeshi Workers Should Choose JG Alfalah for Malaysia Recruitment?\nMalaysia's thriving industries—ranging from manufacturing to agriculture and construction—offer immense opportunities for Bangladeshi workers. JG Alfalah's meticulous recruitment process ensures the right match between employers' demands and workers' skills.\n\nOur key services include:\n- Comprehensive Candidate Screening\n- Legal Compliance\n- End-to-End Support\n\nRecent Malaysia Success Stories\nIn recent months, JG Alfalah has successfully facilitated large-scale manpower deployments to Malaysia.\n\nThe JG Alfalah Difference\nOur commitment goes beyond placements. We emphasize transparency, sustainability, and employee welfare.",
      date: moment(),
      image: ""
    });
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "recruitment_images");

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
        title: values.title,
        description: values.description,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
        image: values.image || ""
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/recruitment/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save recruitment data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Recruitment Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving recruitment data:", error);
      message.error(error.message || "Failed to update recruitment section");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Recruitment Section
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
            title="Recruitment Content"
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
                    Title
                  </span>
                }
                rules={[{ required: true, message: "Please enter the title" }]}
              >
                <Input
                  size="large"
                  placeholder="e.g., JG Alfalah: Your Trusted Partner"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="date"
                label={
                  <span className="font-medium text-gray-700">
                    Date
                  </span>
                }
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  size="large"
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
                  rows={10}
                  placeholder="Detailed description about recruitment services"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="image"
                label={
                  <span className="font-medium text-gray-700">
                    Featured Image
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
                      Upload Image
                    </Button>
                  </Upload>
                  {form.getFieldValue('image') && (
                    <div className="relative w-32 h-32 border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={form.getFieldValue('image')}
                        alt="Recruitment featured"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => form.setFieldsValue({ image: "" })}
                        className="absolute top-1 right-1"
                        size="small"
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

export default RecruitmentModal;