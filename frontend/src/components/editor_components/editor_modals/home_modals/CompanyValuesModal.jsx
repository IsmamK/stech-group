import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Progress, Image } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const CompanyValuesModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [values, setValues] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchValuesData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchValuesData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/company-values/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch company values data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          text: data.text || "",
          image: data.image || ""
        });

        setCurrentImage(data.image || "");
        setValues(data.values || []);
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching company values data:", error);
      message.error("Failed to load company values data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "The Core Company Values",
      text: "Everyone at Stech Group is honest and fair in our dealings with others. We keep our promises and stand by our commitments.",
      image: ""
    });
    setCurrentImage("");
    setValues([
      { id: 1, name: "INTEGRITY", valuenow: 100 },
      { id: 2, name: "INNOVATION", valuenow: 90 },
    ]);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "company_values");

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
      setCurrentImage(newImageUrl);

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

  const handleAddValue = () => {
    const newValue = {
      id: Date.now(), // temporary ID
      name: "",
      valuenow: 50
    };
    setValues([...values, newValue]);
  };

  const handleRemoveValue = (id) => {
    setValues(values.filter(value => value.id !== id));
  };

  const handleValueChange = (id, field, value) => {
    const updatedValues = values.map(val => 
      val.id === id ? { ...val, [field]: field === "valuenow" ? parseInt(value) || 0 : value } : val
    );
    setValues(updatedValues);
  };

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      const updatedData = {
        title: formValues.title,
        text: formValues.text,
        image: formValues.image,
        values: values.map(value => ({
          name: value.name,
          valuenow: value.valuenow
        })).filter(value => value.name) // filter out values without a name
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/company-values/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save company values data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Company Values Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving company values data:", error);
      message.error(error.message || "Failed to update company values");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Company Values Section
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
                  placeholder="e.g., The Core Company Values"
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
                  placeholder="Description about company values"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="image"
                label={
                  <span className="font-medium text-gray-700">
                    Background Image
                  </span>
                }
              >
                <div className="flex flex-col gap-4">
                  <Upload {...uploadProps}>
                    <Button
                      icon={<UploadOutlined />}
                      loading={imageLoading}
                      className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload Image
                    </Button>
                  </Upload>
                  {currentImage && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-600">Current Image:</span>
                      <div className="mt-2 border rounded-lg overflow-hidden max-w-xs">
                        <Image
                          src={currentImage}
                          alt="Current background"
                          className="w-full h-auto"
                          preview={false}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Company Values"
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
                onClick={handleAddValue}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Value
              </Button>
            }
          >
            <List
              dataSource={values}
              renderItem={(value) => (
                <List.Item key={value.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <Input
                          placeholder="Value Name"
                          value={value.name}
                          onChange={(e) => handleValueChange(value.id, 'name', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        
                        <div className="flex items-center gap-4">
                          <Input
                            placeholder="Percentage (0-100)"
                            type="number"
                            min={0}
                            max={100}
                            value={value.valuenow}
                            onChange={(e) => handleValueChange(value.id, 'valuenow', e.target.value)}
                            className="w-24 rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                          <Progress
                            percent={value.valuenow}
                            strokeColor="#1890ff"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveValue(value.id)}
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

export default CompanyValuesModal;