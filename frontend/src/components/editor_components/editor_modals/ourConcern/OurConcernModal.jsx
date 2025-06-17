import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Tooltip, Alert, Collapse } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Panel } = Collapse;

const OurConcernModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [sections, setSections] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [activePanels, setActivePanels] = useState(['1', '2', '3']);

  useEffect(() => {
    if (isOpen) {
      fetchConcernData();
    } else {
      setInitialized(false);
    }
  }, [isOpen]);

  const fetchConcernData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/our-concern/`);

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
          text: data.text || "",
        });

        // Ensure all brands have unique IDs
        const brandsWithIds = (data.brands || []).map(brand => ({
          ...brand,
          id: brand.id || Date.now() + Math.random(),
          sections: {
            ...brand.sections,
            id: brand.sections?.id || Date.now() + Math.random()
          }
        }));

        // Ensure all sections have unique IDs
        const sectionsWithIds = (data.sections || []).map(section => ({
          ...section,
          id: section.id || Date.now() + Math.random()
        }));

        setBrands(brandsWithIds);
        setSections(sectionsWithIds);
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
      title: "Stech Group – Driving Innovation and Excellence to Strengthen Our Communities.",
      text: "Stech Group is a well known group of companies in Bangladesh, driving innovation and excellence across diverse industries. With a portfolio spanning healthcare, overseas manpower recruitment, facility management, travel solutions, real estate, education consultancy, and IT services, Stech Group is committed to delivering world-class services. Through our focus on quality, advanced technology, and customer satisfaction, we aim to shape a better future for our communities. Plans are also underway to expand into the RMG sector and establish Stech Foundation, a social welfare initiative to give back to society.",
    });
    setBrands([]);
    setSections([]);
  };

  const handleImageUpload = async (file, field, id = null) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "brand_logos");

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
            brand.id === id ? { ...brand, logo: newImageUrl } : brand
          )
        );
      } else if (field === 'brandBanner') {
        setBrands(prevBrands => 
          prevBrands.map(brand => 
            brand.id === id ? { 
              ...brand, 
              sections: {
                ...brand.sections,
                images: [{ image: newImageUrl }]
              }
            } : brand
          )
        );
      } else if (field === 'sectionImage') {
        setSections(prevSections => 
          prevSections.map(section => 
            section.id === id ? { 
              ...section, 
              images: [{ image: newImageUrl }] 
            } : section
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

  const uploadProps = (field, id = null) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, field, id);
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
        slug: "",
        text: "",
        images: []
      }
    };
    setBrands(prev => [...prev, newBrand]);
    message.info("New brand added. Please fill in the details.");
  };

  const handleAddSection = () => {
    const newSection = {
      id: Date.now() + Math.random(),
      title: "",
      slug: "",
      text: "",
      images: []
    };
    setSections(prev => [...prev, newSection]);
    message.info("New section added. Please fill in the details.");
  };

  const handleRemoveBrand = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the brand and its associated content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setBrands(prev => prev.filter(brand => brand.id !== id));
        message.success("Brand removed successfully");
      }
    });
  };

  const handleRemoveSection = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove this section and its content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setSections(prev => prev.filter(section => section.id !== id));
        message.success("Section removed successfully");
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

  const handleSectionChange = (id, field, value) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate brands
      const hasEmptyBrands = brands.some(
        brand => !brand.name.trim() || !brand.logo.trim()
      );
      
      if (hasEmptyBrands) {
        throw new Error("Please fill in all required brand fields");
      }
      
      // Validate sections
      const hasEmptySections = sections.some(
        section => !section.title.trim()
      );
      
      if (hasEmptySections) {
        throw new Error("Please fill in all required section fields");
      }

      const updatedData = {
        title: values.title,
        text: values.text,
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
            slug: brand.sections?.slug || "",
            text: brand.sections?.text || "",
            images: brand.sections?.images || []
          }
        })).filter(brand => brand.name),
        sections: sections.map(section => ({
          id: section.id,
          title: section.title,
          slug: section.slug,
          text: section.text,
          images: section.images || []
        })).filter(section => section.title)
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      setLoading(true);
      const response = await fetch(`${apiUrl}/our-concern/`, {
        method: "PUT",
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

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-800">
            Edit Our Concern Section
          </span>
          <Tooltip title="Configure the 'Our Concern' page content including brands and additional sections">
            <QuestionCircleOutlined className="ml-2 text-gray-500" />
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
      <Spin spinning={loading} tip="Loading concern data...">
        <Form form={form} layout="vertical" className="space-y-6">
          <Alert
            message="Tip: Fill in all required fields and upload images for a complete setup"
            type="info"
            showIcon
            className="mb-4"
          />
          
          <Collapse 
            activeKey={activePanels}
            onChange={setActivePanels}
            ghost
            className="bg-white"
          >
            {/* Main Content Section */}
            <Panel
              header={
                <span className="font-semibold text-base">Main Content</span>
              }
              key="1"
              extra={
                <Tooltip title="Configure the main title and description">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              }
            >
              <Card
                bordered={false}
                className="rounded-lg shadow-sm border-0"
                bodyStyle={{ padding: "16px" }}
              >
                <Form.Item
                  name="title"
                  label={
                    <span className="font-medium text-gray-700">
                      Section Title*
                    </span>
                  }
                  rules={[{ required: true, message: "Please enter the title" }]}
                >
                  <Input
                    size="large"
                    placeholder="e.g., Our Concerns"
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item
                  name="text"
                  label={
                    <span className="font-medium text-gray-700">
                      Description*
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter the description" },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Detailed description about the concern section..."
                    className="w-full"
                  />
                </Form.Item>
              </Card>
            </Panel>

            {/* Brands Section */}
            <Panel
              header={
                <span className="font-semibold text-base">Brands</span>
              }
              key="2"
              extra={
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {brands.length} brand{brands.length !== 1 ? 's' : ''} added
                  </span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddBrand}
                    size="small"
                  >
                    Add Brand
                  </Button>
                </div>
              }
            >
              <Card
                bordered={false}
                className="rounded-lg shadow-sm border-0"
                bodyStyle={{ padding: "16px" }}
              >
                {brands.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No brands added yet</p>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddBrand}
                      className="mt-4"
                    >
                      Add Your First Brand
                    </Button>
                  </div>
                ) : (
                  <List
                    dataSource={brands}
                    renderItem={(brand) => (
                      <List.Item 
                        key={brand.id} 
                        className="p-4 mb-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="w-full">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand Name*
                                  </label>
                                  <Input
                                    placeholder="e.g., Stech HR"
                                    value={brand.name}
                                    onChange={(e) => handleBrandChange(brand.id, 'name', e.target.value)}
                                    className="w-full"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand Slug
                                  </label>
                                  <Input
                                    placeholder="e.g., stech-hr"
                                    value={brand.slug}
                                    onChange={(e) => handleBrandChange(brand.id, 'slug', e.target.value)}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Banner Title
                                </label>
                                <Input
                                  placeholder="e.g., Leading HR Solutions"
                                  value={brand.banner_title}
                                  onChange={(e) => handleBrandChange(brand.id, 'banner_title', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Website URL
                                </label>
                                <Input
                                  placeholder="e.g., https://stechhr.com"
                                  value={brand.site_url}
                                  onChange={(e) => handleBrandChange(brand.id, 'site_url', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Brand Logo*
                                  <Tooltip title="Recommended size: 200x200px, PNG format with transparent background">
                                    <QuestionCircleOutlined className="ml-1 text-gray-400" />
                                  </Tooltip>
                                </label>
                                <div className="flex items-center gap-4">
                                  <Upload {...uploadProps('brandLogo', brand.id)}>
                                    <Button
                                      icon={<UploadOutlined />}
                                      loading={imageLoading}
                                      className="h-10"
                                    >
                                      {brand.logo ? "Change Logo" : "Upload Logo"}
                                    </Button>
                                  </Upload>
                                  {brand.logo ? (
                                    <div className="relative w-20 h-20 border rounded-md overflow-hidden bg-gray-50 p-1">
                                      <img
                                        src={brand.logo}
                                        alt="Brand logo preview"
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      No logo uploaded
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <Collapse
                                ghost
                                className="bg-gray-50 rounded-lg"
                              >
                                <Panel
                                  header="Brand Section Content"
                                  key="1"
                                  className="font-medium"
                                >
                                  <div className="space-y-4 p-2">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section Title
                                      </label>
                                      <Input
                                        placeholder="e.g., About Our HR Services"
                                        value={brand.sections?.title || ""}
                                        onChange={(e) => handleBrandChange(brand.id, 'sections.title', e.target.value)}
                                        className="w-full"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section Slug
                                      </label>
                                      <Input
                                        placeholder="e.g., hr-services"
                                        value={brand.sections?.slug || ""}
                                        onChange={(e) => handleBrandChange(brand.id, 'sections.slug', e.target.value)}
                                        className="w-full"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                      </label>
                                      <TextArea
                                        rows={3}
                                        placeholder="Detailed description about this brand..."
                                        value={brand.sections?.text || ""}
                                        onChange={(e) => handleBrandChange(brand.id, 'sections.text', e.target.value)}
                                        className="w-full"
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Banner Image
                                        <Tooltip title="Recommended size: 1200x400px, JPG or PNG format">
                                          <QuestionCircleOutlined className="ml-1 text-gray-400" />
                                        </Tooltip>
                                      </label>
                                      <div className="flex items-center gap-4">
                                        <Upload {...uploadProps('brandBanner', brand.id)}>
                                          <Button
                                            icon={<UploadOutlined />}
                                            loading={imageLoading}
                                            className="h-10"
                                          >
                                            {brand.sections?.images?.[0]?.image ? "Change Image" : "Upload Image"}
                                          </Button>
                                        </Upload>
                                        {brand.sections?.images?.[0]?.image ? (
                                          <div className="relative w-32 h-20 border rounded-md overflow-hidden">
                                            <img
                                              src={brand.sections.images[0].image}
                                              alt="Brand banner preview"
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        ) : (
                                          <div className="text-sm text-gray-500">
                                            No banner uploaded
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Panel>
                              </Collapse>
                            </div>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveBrand(brand.id)}
                              className="md:ml-4"
                              type="text"
                            />
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Panel>

            {/* Additional Sections */}
            <Panel
              header={
                <span className="font-semibold text-base">Additional Sections</span>
              }
              key="3"
              extra={
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {sections.length} section{sections.length !== 1 ? 's' : ''} added
                  </span>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddSection}
                    size="small"
                  >
                    Add Section
                  </Button>
                </div>
              }
            >
              <Card
                bordered={false}
                className="rounded-lg shadow-sm border-0"
                bodyStyle={{ padding: "16px" }}
              >
                {sections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No additional sections added yet</p>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddSection}
                      className="mt-4"
                    >
                      Add Your First Section
                    </Button>
                  </div>
                ) : (
                  <List
                    dataSource={sections}
                    renderItem={(section) => (
                      <List.Item
                        key={section.id}
                        className="p-4 mb-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="w-full">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1 space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Section Title*
                                </label>
                                <Input
                                  placeholder="e.g., Our Mission"
                                  value={section.title}
                                  onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Section Slug
                                </label>
                                <Input
                                  placeholder="e.g., our-mission"
                                  value={section.slug}
                                  onChange={(e) => handleSectionChange(section.id, 'slug', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <TextArea
                                  rows={4}
                                  placeholder="Detailed content for this section..."
                                  value={section.text}
                                  onChange={(e) => handleSectionChange(section.id, 'text', e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Section Image
                                  <Tooltip title="Recommended size: 800x400px, JPG or PNG format">
                                    <QuestionCircleOutlined className="ml-1 text-gray-400" />
                                  </Tooltip>
                                </label>
                                <div className="flex items-center gap-4">
                                  <Upload {...uploadProps('sectionImage', section.id)}>
                                    <Button
                                      icon={<UploadOutlined />}
                                      loading={imageLoading}
                                      className="h-10"
                                    >
                                      {section.images?.[0]?.image ? "Change Image" : "Upload Image"}
                                    </Button>
                                  </Upload>
                                  {section.images?.[0]?.image ? (
                                    <div className="relative w-32 h-20 border rounded-md overflow-hidden">
                                      <img
                                        src={section.images[0].image}
                                        alt="Section image preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      No image uploaded
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveSection(section.id)}
                              className="md:ml-4"
                              type="text"
                            />
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Panel>
          </Collapse>
        </Form>
      </Spin>
    </Modal>
  );
};

export default OurConcernModal;