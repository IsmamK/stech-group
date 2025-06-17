import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, Divider, Row, Col } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;

const AboutDescriptionModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [aboutData, setAboutData] = useState(null);
  const [initialized, setInitialized] = useState(false);
  console.log(aboutData)

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchAboutData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/about/about2`);

      if (!response.ok) {
        throw new Error("Failed to fetch about data");
      }

      const data = await response.json();
      setAboutData(data);
      form.setFieldsValue({
        title: data.title,
        text: data.text,
      });
    } catch (error) {
      console.error("Error fetching about data:", error);
      message.error("Failed to load about data.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, sectionId, imageId = null) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "about_images");

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

      // Update the specific section's image
      const updatedSections = aboutData.sections.map(section => {
        if (section.id === sectionId) {
          const updatedImages = section.images.map(img => 
            img.id === imageId ? { ...img, image: newImageUrl } : img
          );
          return { ...section, images: updatedImages };
        }
        return section;
      });

      setAboutData({ ...aboutData, sections: updatedSections });
      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = (sectionId, imageId = null) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, sectionId, imageId);
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

  const handleMainContentChange = (field, value) => {
    setAboutData({ ...aboutData, [field]: value });
  };

  const handleSectionChange = (sectionId, field, value) => {
    const updatedSections = aboutData.sections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    setAboutData({ ...aboutData, sections: updatedSections });
  };

  const handleImageChange = (sectionId, imageId, field, value) => {
    const updatedSections = aboutData.sections.map(section => {
      if (section.id === sectionId) {
        const updatedImages = section.images.map(img => 
          img.id === imageId ? { ...img, [field]: value } : img
        );
        return { ...section, images: updatedImages };
      }
      return section;
    });
    setAboutData({ ...aboutData, sections: updatedSections });
  };

  const handlePortfolioChange = (portfolioId, field, value) => {
    const portfolioSection = aboutData.sections.find(section => section.portfolios);
    const updatedPortfolios = portfolioSection.portfolios.map(portfolio => 
      portfolio.id === portfolioId ? { ...portfolio, [field]: value } : portfolio
    );
    
    const updatedSections = aboutData.sections.map(section => 
      section.portfolios ? { ...section, portfolios: updatedPortfolios } : section
    );
    
    setAboutData({ ...aboutData, sections: updatedSections });
  };

  const handleAddImage = (sectionId) => {
    const updatedSections = aboutData.sections.map(section => {
      if (section.id === sectionId) {
        const newImage = {
          id: Date.now(),
          image: "",
          primary_text: "",
          secondary_text: "",
          description: ""
        };
        return {
          ...section,
          images: [...(section.images || []), newImage]
        };
      }
      return section;
    });
    setAboutData({ ...aboutData, sections: updatedSections });
  };

  const handleRemoveImage = (sectionId, imageId) => {
    const updatedSections = aboutData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          images: section.images.filter(img => img.id !== imageId)
        };
      }
      return section;
    });
    setAboutData({ ...aboutData, sections: updatedSections });
  };

  const handleAddPortfolio = () => {
    const portfolioSection = aboutData.sections.find(section => section.portfolios);
    const newPortfolio = {
      id: Date.now(),
      title: "",
      portfolio: ""
    };
    
    const updatedPortfolios = [...portfolioSection.portfolios, newPortfolio];
    
    const updatedSections = aboutData.sections.map(section => 
      section.portfolios ? { ...section, portfolios: updatedPortfolios } : section
    );
    
    setAboutData({ ...aboutData, sections: updatedSections });
  };

  const handleRemovePortfolio = (portfolioId) => {
    const portfolioSection = aboutData.sections.find(section => section.portfolios);
    const updatedPortfolios = portfolioSection.portfolios.filter(
      portfolio => portfolio.id !== portfolioId
    );
    
    const updatedSections = aboutData.sections.map(section => 
      section.portfolios ? { ...section, portfolios: updatedPortfolios } : section
    );
    
    setAboutData({ ...aboutData, sections: updatedSections });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        ...aboutData,
        title: values.title,
        text: values.text,
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/about/about2/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save about data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "About Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving about data:", error);
      message.error(error.message || "Failed to update about section");
    }
  };

  if (!aboutData) return null;

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit About Section
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
                    Page Title
                  </span>
                }
                rules={[{ required: true, message: "Please enter the title" }]}
              >
                <Input
                  size="large"
                  onChange={(e) => handleMainContentChange('title', e.target.value)}
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="text"
                label={
                  <span className="font-medium text-gray-700">
                    Main Text
                  </span>
                }
                rules={[{ required: true, message: "Please enter the main text" }]}
              >
                <TextArea
                  rows={8}
                  onChange={(e) => handleMainContentChange('text', e.target.value)}
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>
            </div>
          </Card>

          {aboutData.sections.map((section) => (
            <Card
              key={section.id}
              title={section.title}
              bordered={false}
              className="rounded-lg shadow-sm border-0 mt-6"
              headStyle={{
                background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
                borderBottom: "1px solid #e8e8e8",
              }}
              extra={
                section.images && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddImage(section.id)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700"
                  >
                    Add Image
                  </Button>
                )
              }
            >
              <div className="grid grid-cols-1 gap-6">
                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      Section Title
                    </span>
                  }
                >
                  <Input
                    value={section.title}
                    onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                    className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                  />
                </Form.Item>

                {section.text && (
                  <Form.Item
                    label={
                      <span className="font-medium text-gray-700">
                        Section Text
                      </span>
                    }
                  >
                    <TextArea
                      rows={4}
                      value={section.text}
                      onChange={(e) => handleSectionChange(section.id, 'text', e.target.value)}
                      className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                    />
                  </Form.Item>
                )}

                {section.images && section.images.map((image) => (
                  <div key={image.id} className="border border-gray-200 p-4 rounded-lg">
                    <Row gutter={16}>
                      <Col span={12}>
                        <div className="flex items-center gap-4 mb-4">
                          <Upload {...uploadProps(section.id, image.id)}>
                            <Button
                              icon={<UploadOutlined />}
                              loading={imageLoading}
                              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Upload Image
                            </Button>
                          </Upload>
                          {image.image && (
                            <div className="relative w-24 h-24">
                              <img
                                src={image.image}
                                alt="Section content"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>

                        {image.primary_text !== undefined && (
                          <Form.Item
                            label={
                              <span className="font-medium text-gray-700">
                                Primary Text
                              </span>
                            }
                          >
                            <Input
                              value={image.primary_text}
                              onChange={(e) => handleImageChange(section.id, image.id, 'primary_text', e.target.value)}
                              className="rounded-lg hover:border-blue-400 focus:border-blue-400 mb-4"
                            />
                          </Form.Item>
                        )}

                        {image.secondary_text !== undefined && (
                          <Form.Item
                            label={
                              <span className="font-medium text-gray-700">
                                Secondary Text
                              </span>
                            }
                          >
                            <Input
                              value={image.secondary_text}
                              onChange={(e) => handleImageChange(section.id, image.id, 'secondary_text', e.target.value)}
                              className="rounded-lg hover:border-blue-400 focus:border-blue-400 mb-4"
                            />
                          </Form.Item>
                        )}
                      </Col>
                      <Col span={12}>
                        {image.description !== undefined && (
                          <Form.Item
                            label={
                              <span className="font-medium text-gray-700">
                                Description
                              </span>
                            }
                          >
                            <TextArea
                              rows={6}
                              value={image.description}
                              onChange={(e) => handleImageChange(section.id, image.id, 'description', e.target.value)}
                              className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                            />
                          </Form.Item>
                        )}
                      </Col>
                    </Row>
                    <div className="flex justify-end mt-4">
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveImage(section.id, image.id)}
                      />
                    </div>
                  </div>
                ))}

                {section.portfolios && (
                  <>
                    <Divider orientation="left">Portfolios</Divider>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddPortfolio}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 mb-4"
                    >
                      Add Portfolio
                    </Button>
                    
                    {section.portfolios.map((portfolio) => (
                      <div key={portfolio.id} className="border border-gray-200 p-4 rounded-lg mb-4">
                        <Form.Item
                          label={
                            <span className="font-medium text-gray-700">
                              Portfolio Title
                            </span>
                          }
                        >
                          <Input
                            value={portfolio.title}
                            onChange={(e) => handlePortfolioChange(portfolio.id, 'title', e.target.value)}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400 mb-4"
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="font-medium text-gray-700">
                              Portfolio File URL
                            </span>
                          }
                        >
                          <Input
                            value={portfolio.portfolio}
                            onChange={(e) => handlePortfolioChange(portfolio.id, 'portfolio', e.target.value)}
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                        </Form.Item>

                        <div className="flex justify-end">
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemovePortfolio(portfolio.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Card>
          ))}
        </Form>
      </Spin>
    </Modal>
  );
};

export default AboutDescriptionModal;