import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Select, DatePicker } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const NewsAndEventsModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sections, setSections] = useState([]);
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchNewsEventsData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchNewsEventsData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/news-events/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch news & events data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          banner_title: data.banner_title || "",
          text: data.text || "",
        });

        setSections(data.sections || []);
        setContents(data.contents || []);
        
        // Extract unique categories from contents
        const uniqueCategories = [...new Set(data.contents.map(item => item.category))];
        setCategories(uniqueCategories);
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching news & events data:", error);
      message.error("Failed to load news & events data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "The Latest News and Events on Stech Group Business Concerns",
      banner_title: "Stech Group - Driving Progress, Creating Possibilities.",
      text: "Our Latest News and Events on Stech Group are highlighted here to showcase the updates from its diverse business concerns...",
    });
    setSections([]);
    setContents([]);
    setCategories([]);
  };

  const handleImageUpload = async (file, contentId) => {
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

      // Update the specific content's cover image
      const updatedContents = contents.map(content => 
        content.id === contentId ? { ...content, cover: newImageUrl } : content
      );
      setContents(updatedContents);

      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = (contentId) => ({
    name: "cover",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, contentId);
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

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(), // temporary ID
      title: "",
      slug: "",
      text: ""
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleSectionChange = (id, field, value) => {
    const updatedSections = sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    );
    setSections(updatedSections);
  };

  const handleAddContent = () => {
    const newContent = {
      id: Date.now(), // temporary ID
      category: categories.length > 0 ? categories[0] : 1,
      title: "",
      text: "",
      date_published: new Date().toISOString().split('T')[0],
      url: "",
      cover: ""
    };
    setContents([...contents, newContent]);
  };

  const handleRemoveContent = (id) => {
    setContents(contents.filter(content => content.id !== id));
  };

  const handleContentChange = (id, field, value) => {
    const updatedContents = contents.map(content => 
      content.id === id ? { ...content, [field]: value } : content
    );
    setContents(updatedContents);
  };

  const handleDateChange = (id, date) => {
    const dateString = date ? date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0];
    handleContentChange(id, 'date_published', dateString);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        banner_title: values.banner_title,
        text: values.text,
        sections: sections.map(section => ({
          title: section.title,
          slug: section.slug,
          text: section.text
        })).filter(section => section.title), // filter out empty sections
        contents: contents.map(content => ({
          category: content.category,
          title: content.title,
          text: content.text,
          date_published: content.date_published,
          url: content.url,
          cover: content.cover
        })).filter(content => content.title) // filter out empty contents
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/news-events/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save news & events data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "News & Events Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving news & events data:", error);
      message.error(error.message || "Failed to update news & events section");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit News & Events Section
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
                  placeholder="e.g., The Latest News and Events"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="banner_title"
                label={
                  <span className="font-medium text-gray-700">
                    Banner Title
                  </span>
                }
                rules={[{ required: true, message: "Please enter the banner title" }]}
              >
                <Input
                  size="large"
                  placeholder="e.g., Stech Group - Driving Progress, Creating Possibilities."
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
                  placeholder="Description about the news & events section"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title="Sections"
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
                onClick={handleAddSection}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Section
              </Button>
            }
          >
            <List
              dataSource={sections}
              renderItem={(section) => (
                <List.Item key={section.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <Input
                          placeholder="Section Title"
                          value={section.title}
                          onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        
                        <Input
                          placeholder="Section Slug"
                          value={section.slug}
                          onChange={(e) => handleSectionChange(section.id, 'slug', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        
                        <TextArea
                          rows={3}
                          placeholder="Section Text"
                          value={section.text}
                          onChange={(e) => handleSectionChange(section.id, 'text', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveSection(section.id)}
                        className="ml-4"
                      />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Card
            title="News & Events Contents"
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
                onClick={handleAddContent}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Content
              </Button>
            }
          >
            <List
              dataSource={contents}
              renderItem={(content) => (
                <List.Item key={content.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <Select
                          value={content.category}
                          onChange={(value) => handleContentChange(content.id, 'category', value)}
                          className="w-full"
                        >
                          {categories.map(cat => (
                            <Option key={cat} value={cat}>Category {cat}</Option>
                          ))}
                        </Select>
                        
                        <Input
                          placeholder="Content Title"
                          value={content.title}
                          onChange={(e) => handleContentChange(content.id, 'title', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        
                        <TextArea
                          rows={3}
                          placeholder="Content Text"
                          value={content.text}
                          onChange={(e) => handleContentChange(content.id, 'text', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        
                        <DatePicker
                          placeholder="Publication Date"
                          value={content.date_published ? moment(content.date_published) : null}
                          onChange={(date) => handleDateChange(content.id, date)}
                          className="w-full rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        
                        <Input
                          placeholder="URL"
                          value={content.url}
                          onChange={(e) => handleContentChange(content.id, 'url', e.target.value)}
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        
                        <div className="flex items-center gap-4">
                          <Upload {...uploadProps(content.id)}>
                            <Button
                              icon={<UploadOutlined />}
                              loading={imageLoading}
                              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Upload Cover Image
                            </Button>
                          </Upload>
                          {content.cover && (
                            <div className="relative w-16 h-16">
                              <img
                                src={content.cover}
                                alt="Content cover"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveContent(content.id)}
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

export default NewsAndEventsModal;