import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Collapse } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Panel } = Collapse;
const { TextArea } = Input;

const EditFooterModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [footerData, setFooterData] = useState({
    logo: {
      src: "",
      alt: "",
      width: 200,
      height: 56
    },
    links: [],
    contact: {
      title: "",
      items: []
    },
    social: [],
    copyright: {
      text: ""
    }
  });

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchFooterData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/layout/footer/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch footer data");
      }

      const data = await response.json();
      setFooterData(data);
      
      // Set form values
      form.setFieldsValue({
        logo: data.logo?.src || "",
        copyrightText: data.copyright?.text || ""
      });
    } catch (error) {
      console.error("Error fetching footer data:", error);
      message.error("Failed to load footer data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    const defaultData = {
      logo: {
        src: "/images/logo-white.svg",
        alt: "logo-white",
        width: 200,
        height: 56
      },
      links: [
        { text: "Home", url: "/" },
        { text: "About Us", url: "/about-us" },
        { text: "Our Concern", url: "/our-concern" },
        { text: "Services", url: "/services" },
        { text: "Gallery", url: "/gallery" },
        { text: "News & Event", url: "/newsevents" },
        { text: "Our Clients", url: "/our-clients" },
        { text: "Contact Us", url: "/contact" }
      ],
      contact: {
        title: "Contact",
        items: [
          { icon: "phone", text: "+8809643434343", url: "tel:+88012312322539" },
          { icon: "email", text: "info@stechgroupbd.com", url: "mailto:support@stech.xyz" },
          { icon: "location", text: "House- 31, Road- 17, Block-E\nBanani, Dhaka- 1213, Bangladesh", url: "#" }
        ]
      },
      social: [
        { name: "Facebook", url: "https://facebook.com", icon: "facebook", tooltip: "Follow us on Facebook" },
        { name: "YouTube", url: "https://youtube.com", icon: "youtube", tooltip: "Follow us on Youtube" },
        { name: "Instagram", url: "https://instagram.com", icon: "instagram", tooltip: "Follow us on Instagram" },
        { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin", tooltip: "Follow us on Linkedin" }
      ],
      copyright: {
        text: "Stech – All rights reserved."
      }
    };

    setFooterData(defaultData);
    form.setFieldsValue({
      logo: defaultData.logo.src,
      copyrightText: defaultData.copyright.text
    });
  };

  const handleImageUpload = async (file, field) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "logos");

    try {
      setImageLoading(true);
      const response = await fetch(`${apiUrl}/images/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const newImageUrl = `${data.image}`;

      setFooterData(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          [field]: newImageUrl
        }
      }));

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
      const imageUrl = await handleImageUpload(file, "src");
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

  const handleAddLink = () => {
    const newLink = {
      id: Date.now(),
      text: "",
      url: ""
    };
    setFooterData(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
  };

  const handleRemoveLink = (index) => {
    setFooterData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (index, field, value) => {
    setFooterData(prev => {
      const updatedLinks = [...prev.links];
      updatedLinks[index] = {
        ...updatedLinks[index],
        [field]: value
      };
      return {
        ...prev,
        links: updatedLinks
      };
    });
  };

  const handleAddContactItem = () => {
    const newItem = {
      id: Date.now(),
      icon: "",
      text: "",
      url: ""
    };
    setFooterData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        items: [...prev.contact.items, newItem]
      }
    }));
  };

  const handleRemoveContactItem = (index) => {
    setFooterData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        items: prev.contact.items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleContactItemChange = (index, field, value) => {
    setFooterData(prev => {
      const updatedItems = [...prev.contact.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
      return {
        ...prev,
        contact: {
          ...prev.contact,
          items: updatedItems
        }
      };
    });
  };

  const handleAddSocialItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      url: "",
      icon: "",
      tooltip: ""
    };
    setFooterData(prev => ({
      ...prev,
      social: [...prev.social, newItem]
    }));
  };

  const handleRemoveSocialItem = (index) => {
    setFooterData(prev => ({
      ...prev,
      social: prev.social.filter((_, i) => i !== index)
    }));
  };

  const handleSocialItemChange = (index, field, value) => {
    setFooterData(prev => {
      const updatedSocial = [...prev.social];
      updatedSocial[index] = {
        ...updatedSocial[index],
        [field]: value
      };
      return {
        ...prev,
        social: updatedSocial
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        logo: {
          ...footerData.logo,
          src: values.logo
        },
        links: footerData.links
          .filter(link => link.text && link.url),
        contact: {
          title: footerData.contact.title,
          items: footerData.contact.items
            .filter(item => item.text && item.url)
        },
        social: footerData.social
          .filter(social => social.name && social.url && social.icon),
        copyright: {
          text: values.copyrightText
        }
      };

      const response = await fetch(`${apiUrl}/layout/footer/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save footer data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Footer Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving footer data:", error);
      message.error(error.message || "Failed to update footer");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Footer Content
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
      width={900}
      className="rounded-lg overflow-hidden"
      styles={{ body: { padding: "24px" } }}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" className="space-y-6">
          <Card
            title="Logo"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <Form.Item
              name="logo"
              label={
                <span className="font-medium text-gray-700">
                  Footer Logo URL
                </span>
              }
              rules={[{ required: true, message: "Please provide footer logo" }]}
            >
              <div className="flex gap-2">
                <Input
                  value={footerData.logo.src}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    logo: { ...prev.logo, src: e.target.value }
                  }))}
                  placeholder="e.g., /images/logo-white.svg"
                  className="flex-1 rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
                <Upload {...uploadProps}>
                  <Button
                    icon={<UploadOutlined />}
                    loading={imageLoading}
                    className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Upload
                  </Button>
                </Upload>
              </div>
              {footerData.logo.src && (
                <div className="mt-2">
                  <img
                    src={footerData.logo.src}
                    alt="Footer logo preview"
                    className="h-12 object-contain"
                  />
                </div>
              )}
            </Form.Item>
          </Card>

          <Card
            title="Quick Links"
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
                onClick={handleAddLink}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Link
              </Button>
            }
          >
            <List
              dataSource={footerData.links}
              renderItem={(link, index) => (
                <List.Item key={index} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Link Text"
                      value={link.text}
                      onChange={(e) => handleLinkChange(index, "text", e.target.value)}
                      className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                        className="flex-1 rounded-lg hover:border-blue-400 focus:border-blue-400"
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveLink(index)}
                      />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Card
            title="Contact Information"
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
                onClick={handleAddContactItem}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Contact
              </Button>
            }
          >
            <List
              dataSource={footerData.contact.items}
              renderItem={(item, index) => (
                <List.Item key={index} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Icon (e.g., phone, email, location)"
                        value={item.icon}
                        onChange={(e) => handleContactItemChange(index, "icon", e.target.value)}
                        className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                      />
                      <Input
                        placeholder="Text"
                        value={item.text}
                        onChange={(e) => handleContactItemChange(index, "text", e.target.value)}
                        className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="URL"
                          value={item.url}
                          onChange={(e) => handleContactItemChange(index, "url", e.target.value)}
                          className="flex-1 rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveContactItem(index)}
                        />
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Card
            title="Social Links"
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
                onClick={handleAddSocialItem}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Social Link
              </Button>
            }
          >
            <List
              dataSource={footerData.social}
              renderItem={(social, index) => (
                <List.Item key={index} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="Platform Name"
                        value={social.name}
                        onChange={(e) => handleSocialItemChange(index, "name", e.target.value)}
                        className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                      />
                      <Input
                        placeholder="URL"
                        value={social.url}
                        onChange={(e) => handleSocialItemChange(index, "url", e.target.value)}
                        className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                      />
                      <Input
                        placeholder="Icon (e.g., facebook, twitter)"
                        value={social.icon}
                        onChange={(e) => handleSocialItemChange(index, "icon", e.target.value)}
                        className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Tooltip"
                          value={social.tooltip}
                          onChange={(e) => handleSocialItemChange(index, "tooltip", e.target.value)}
                          className="flex-1 rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveSocialItem(index)}
                        />
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          <Card
            title="Copyright Information"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <Form.Item
              name="copyrightText"
              label={
                <span className="font-medium text-gray-700">
                  Copyright Text
                </span>
              }
            >
              <Input
                placeholder="Stech – All rights reserved."
                className="rounded-lg hover:border-blue-400 focus:border-blue-400"
              />
            </Form.Item>
          </Card>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditFooterModal;