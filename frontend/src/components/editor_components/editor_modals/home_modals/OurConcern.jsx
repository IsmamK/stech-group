import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Spin, Card, List, Upload, Tooltip, Collapse } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Panel } = Collapse;

const OurConcernHomeModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [brands, setBrands] = useState([]);
  const [activeBrandPanels, setActiveBrandPanels] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchConcernData();
    } else {
      setInitialized(false);
      setActiveBrandPanels([]);
    }
  }, [isOpen]);

  const fetchConcernData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/our-concern/home/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch concern data");
      }

      const data = await response.json();

      if (data) {
        form.setFieldsValue({
          title: data.title || "",
          description: data.description || "",
        });

        const brandsWithIds = (data.brands || []).map(brand => ({
          ...brand,
          id: brand.id || Date.now() + Math.random(),
          sections: {
            ...brand.sections,
            id: brand.sections?.id || Date.now() + Math.random(),
            images: brand.sections?.images || []
          }
        }));

        setBrands(brandsWithIds);
        // Open all brand panels by default
        setActiveBrandPanels(brandsWithIds.map(brand => brand.id));
      } else {
        initializeWithDefaults();
      }
    } catch (error) {
      console.error("Error fetching concern data:", error);
      message.error("Failed to load concern data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "Our Concern",
      description: "With the Head Office in Dhaka, Bangladesh, Stech Group operates a wide range of businesses across diverse industries both locally and internationally...",
    });
    setBrands([]);
  };

  const handleImageUpload = async (file, field, brandId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", field === 'brandLogo' ? "brand_logos" : "brand_backgrounds");

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

      if (field === 'brandLogo') {
        setBrands(prevBrands => 
          prevBrands.map(brand => 
            brand.id === brandId ? { ...brand, logo: newImageUrl } : brand
          )
        );
      } else if (field === 'brandBackground') {
        setBrands(prevBrands => 
          prevBrands.map(brand => 
            brand.id === brandId ? { 
              ...brand, 
              sections: {
                ...brand.sections,
                images: [{ image: newImageUrl }]
              }
            } : brand
          )
        );
      }

      message.success("Image uploaded successfully!");
      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const uploadProps = (field, brandId) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, field, brandId);
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

  const handleAddBrand = () => {
    const newBrand = {
      id: Date.now() + Math.random(),
      name: "",
      slug: "",
      logo: "",
      banner_title: "",
      site_url: "",
      sections: {
        id: Date.now() + Math.random(),
        title: "",
        text: "",
        images: []
      }
    };
    setBrands(prev => [...prev, newBrand]);
    setActiveBrandPanels(prev => [...prev, newBrand.id]);
  };

  const handleRemoveBrand = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setBrands(prev => prev.filter(brand => brand.id !== id));
        setActiveBrandPanels(prev => prev.filter(panelId => panelId !== id));
        message.success('Brand removed successfully');
      }
    });
  };

  const handleBrandChange = (id, field, value) => {
    setBrands(prevBrands => 
      prevBrands.map(brand => {
        if (brand.id === id) {
          if (field.startsWith('sections.')) {
            const sectionField = field.split('.')[1];
            return {
              ...brand,
              sections: {
                ...brand.sections,
                [sectionField]: value
              }
            };
          }
          return { ...brand, [field]: value };
        }
        return brand;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate brands
      const hasEmptyBrandNames = brands.some(brand => !brand.name.trim());
      if (hasEmptyBrandNames) {
        throw new Error("Please provide names for all brands or remove empty ones");
      }

      const updatedData = {
        title: values.title,
        description: values.description,
        brands: brands.map(brand => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo,
          banner_title: brand.banner_title,
          site_url: brand.site_url,
          sections: {
            id: brand.sections?.id,
            title: brand.sections?.title || "",
            text: brand.sections?.text || "",
            images: brand.sections?.images || []
          }
        })).filter(brand => brand.name)
      };

      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/our-concern/home/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save concern data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Concern Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving concern data:", error);
      message.error(error.message || "Failed to update concern section");
    } finally {
      setLoading(false);
    }
  };

  const handlePanelChange = (keys) => {
    setActiveBrandPanels(keys);
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-800">
            Edit Our Concern Section
          </span>
          <Tooltip title="This section displays your company's brands and their information">
            <InfoCircleOutlined className="ml-2 text-blue-500" />
          </Tooltip>
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
      width={1000}
      className="rounded-lg overflow-hidden"
      styles={{ body: { padding: "24px" } }}
      destroyOnClose
    >
      <Spin spinning={loading} tip="Loading...">
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
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      Section Title
                    </span>
                    <Tooltip title="This will be the main heading for the Our Concern section">
                      <QuestionCircleOutlined className="ml-2 text-gray-400" />
                    </Tooltip>
                  </div>
                }
                rules={[{ required: true, message: "Please enter the title" }]}
              >
                <Input
                  size="large"
                  placeholder="e.g., Our Concerns"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      Description
                    </span>
                    <Tooltip title="This will appear below the section title as an introduction">
                      <QuestionCircleOutlined className="ml-2 text-gray-400" />
                    </Tooltip>
                  </div>
                }
                rules={[
                  { required: true, message: "Please enter the description" },
                  { max: 500, message: "Description should be less than 500 characters" }
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Description about the concern section"
                  className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>
          </Card>

          <Card
            title={
              <div className="flex items-center">
                <span>Brands</span>
                <Tooltip title="Add and manage all the brands under your company">
                  <QuestionCircleOutlined className="ml-2 text-gray-400" />
                </Tooltip>
              </div>
            }
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
                onClick={handleAddBrand}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Add Brand
              </Button>
            }
          >
            {brands.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No brands added yet. Click "Add Brand" to get started.
              </div>
            ) : (
              <Collapse 
                activeKey={activeBrandPanels}
                onChange={handlePanelChange}
                className="bg-white"
                expandIconPosition="end"
              >
                {brands.map((brand) => (
                  <Panel 
                    header={
                      <div className="flex items-center">
                        {brand.logo && (
                          <img 
                            src={brand.logo} 
                            alt="Brand logo" 
                            className="w-6 h-6 object-contain mr-2" 
                          />
                        )}
                        <span className="font-medium">
                          {brand.name || "New Brand"}
                        </span>
                        {!brand.name && (
                          <span className="text-red-500 ml-2">(Please add a name)</span>
                        )}
                      </div>
                    }
                    key={brand.id}
                    extra={
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBrand(brand.id);
                        }}
                        size="small"
                      />
                    }
                    className="mb-2 border border-gray-200 rounded-lg"
                  >
                    <div className="space-y-4 p-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand Name*
                          </label>
                          <Input
                            value={brand.name}
                            onChange={(e) => handleBrandChange(brand.id, 'name', e.target.value)}
                            placeholder="e.g., Stech Solutions"
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug
                            <Tooltip title="URL-friendly version of the name (lowercase, hyphens)">
                              <QuestionCircleOutlined className="ml-1 text-gray-400" />
                            </Tooltip>
                          </label>
                          <Input
                            value={brand.slug}
                            onChange={(e) => handleBrandChange(brand.id, 'slug', e.target.value)}
                            placeholder="e.g., stech-solutions"
                            className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Banner Title
                          <Tooltip title="This will appear as the heading on the brand's page">
                            <QuestionCircleOutlined className="ml-1 text-gray-400" />
                          </Tooltip>
                        </label>
                        <Input
                          value={brand.banner_title}
                          onChange={(e) => handleBrandChange(brand.id, 'banner_title', e.target.value)}
                          placeholder="e.g., Innovative Technology Solutions"
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website URL
                        </label>
                        <Input
                          value={brand.site_url}
                          onChange={(e) => handleBrandChange(brand.id, 'site_url', e.target.value)}
                          placeholder="e.g., https://stechsolutions.com"
                          className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand Logo*
                          <Tooltip title="Recommended size: 200x200px, transparent background">
                            <QuestionCircleOutlined className="ml-1 text-gray-400" />
                          </Tooltip>
                        </label>
                        <div className="flex items-center gap-4">
                          <Upload {...uploadProps('brandLogo', brand.id)}>
                            <Button
                              icon={<UploadOutlined />}
                              loading={imageLoading}
                              className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {brand.logo ? "Change Logo" : "Upload Logo"}
                            </Button>
                          </Upload>
                          {brand.logo && (
                            <div className="relative group">
                              <img
                                src={brand.logo}
                                alt="Brand logo"
                                className="w-16 h-16 object-contain border border-gray-200 rounded"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                <span className="text-white text-xs text-center p-1">Click 'Change Logo' to update</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Card
                        title={
                          <div className="flex items-center">
                            <span>Brand Details Section</span>
                            <Tooltip title="This content will appear on the brand's dedicated page">
                              <QuestionCircleOutlined className="ml-2 text-gray-400" />
                            </Tooltip>
                          </div>
                        }
                        size="small"
                        className="mt-4"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Section Title
                            </label>
                            <Input
                              value={brand.sections?.title || ""}
                              onChange={(e) => handleBrandChange(brand.id, 'sections.title', e.target.value)}
                              placeholder="e.g., About Our Brand"
                              className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                              <Tooltip title="Provide detailed information about this brand">
                                <QuestionCircleOutlined className="ml-1 text-gray-400" />
                              </Tooltip>
                            </label>
                            <TextArea
                              rows={3}
                              value={brand.sections?.text || ""}
                              onChange={(e) => handleBrandChange(brand.id, 'sections.text', e.target.value)}
                              placeholder="Detailed description about the brand..."
                              className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                              showCount
                              maxLength={1000}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Background Image
                              <Tooltip title="Recommended size: 1200x600px, will be used as a background for the brand page">
                                <QuestionCircleOutlined className="ml-1 text-gray-400" />
                              </Tooltip>
                            </label>
                            <div className="flex items-center gap-4">
                              <Upload {...uploadProps('brandBackground', brand.id)}>
                                <Button
                                  icon={<UploadOutlined />}
                                  loading={imageLoading}
                                  className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {brand.sections?.images?.[0]?.image ? "Change Image" : "Upload Image"}
                                </Button>
                              </Upload>
                              {brand.sections?.images?.[0]?.image && (
                                <div className="relative group w-32 h-20">
                                  <img
                                    src={brand.sections.images[0].image}
                                    alt="Brand background"
                                    className="w-full h-full object-cover border border-gray-200 rounded"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                    <span className="text-white text-xs text-center p-1">Click 'Change Image' to update</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Form>
      </Spin>
    </Modal>
  );
};

export default OurConcernHomeModal;