import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const TeamModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchDirectorsData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchDirectorsData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/directors/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch directors data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          description: data.description || "",
        });
        setDirectors(data.members || []);
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching directors data:", error);
      message.error("Failed to load directors data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Board of Directors",
      description: "We are trying to build a global community within our Stech Group who believes in progress. Keeping a sustainable progressive plan, we are training up people to be leaders to lead the future. Check our Board of Corporate leaders below.",
    });
    setDirectors([]);
  };

  const handleImageUpload = async (file, directorId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "director_photos");

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

      const updatedDirectors = directors.map(director => 
        director.id === directorId ? { ...director, image: newImageUrl } : director
      );
      setDirectors(updatedDirectors);

      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = (directorId) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, directorId);
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

  const handleAddDirector = () => {
    const newDirector = {
      id: Date.now(), // temporary ID
      name: "",
      designation: "",
      image: ""
    };
    setDirectors([...directors, newDirector]);
  };

  const handleRemoveDirector = (id) => {
    setDirectors(directors.filter(director => director.id !== id));
  };

  const handleDirectorChange = (id, field, value) => {
    const updatedDirectors = directors.map(director => 
      director.id === id ? { ...director, [field]: value } : director
    );
    setDirectors(updatedDirectors);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        description: values.description,
        members: directors.map(director => ({
          name: director.name,
          designation: director.designation,
          image: director.image
        })).filter(director => director.name) // filter out directors without a name
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/directors/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save directors data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Directors Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving directors data:", error);
      message.error(error.message || "Failed to update directors section");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Board of Directors
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
                  placeholder="e.g., Board of Directors"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter the description" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Description about the board of directors"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Directors List"
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
                onClick={handleAddDirector}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Director
              </Button>
            }
          >
            <List
              dataSource={directors}
              renderItem={(director) => (
                <List.Item key={director.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Input
                            placeholder="Director Name"
                            value={director.name}
                            onChange={(e) => handleDirectorChange(director.id, 'name', e.target.value)}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                          <Input
                            placeholder="Designation"
                            value={director.designation}
                            onChange={(e) => handleDirectorChange(director.id, 'designation', e.target.value)}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Upload {...uploadProps(director.id)}>
                            <Button
                              icon={<UploadOutlined />}
                              loading={imageLoading}
                              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Upload Photo
                            </Button>
                          </Upload>
                          {director.image && (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                              <img
                                src={director.image}
                                alt="Director photo"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveDirector(director.id)}
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

export default TeamModal;