import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  message,
  Upload,
  Spin,
  Card,
  List,
  Collapse,
  Tooltip,
  Alert,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

const { Panel } = Collapse;
const { TextArea } = Input;

const EditNavbarModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      fetchNavbarData();
    } else {
      setInitialized(false);
    }
  }, [isOpen]);

  const fetchNavbarData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/layout/navbar/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch navbar data");
      }

      const data = await response.json();
      form.setFieldsValue({
        logo: {
          desktop: data.header?.logo?.desktop || "",
          mobile: data.header?.logo?.mobile || "",
          altText: data.header?.logo?.altText || "",
        },
      });

      // Ensure navigation items have IDs
      const navItemsWithIds =
        data.header?.navigation?.map((item) => ({
          ...item,
          id: item.id || Date.now() + Math.random(),
          submenu: Array.isArray(item.submenu)
            ? item.submenu.map((sub) => ({
                ...sub,
                id: sub.id || Date.now() + Math.random(),
              }))
            : item.submenu,
        })) || [];

      // Ensure brands have IDs
      const brandsWithIds =
        data.header?.brands?.map((brand) => ({
          ...brand,
          id: brand.id || Date.now() + Math.random(),
        })) || [];

      setNavigationItems(navItemsWithIds);
      setBrands(brandsWithIds);
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching navbar data:", error);
      message.error("Failed to load navbar data. Using default values.");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      logo: {
        desktop: "/images/logo.svg",
        mobile: "/images/logo-mobile.svg",
        altText: "brand-logo",
      },
    });
    setNavigationItems([
      { id: Date.now() + 1, label: "Home", path: "/", submenu: null },
      { id: Date.now() + 2, label: "About Us", path: "/about", submenu: [] },
      {
        id: Date.now() + 3,
        label: "Our Concern",
        path: "/our-concern",
        submenu: "dynamic",
      },
      {
        id: Date.now() + 4,
        label: "Services",
        path: "/service",
        submenu: null,
      },
      { id: Date.now() + 5, label: "Gallery", path: "/gallery", submenu: null },
      {
        id: Date.now() + 6,
        label: "News & Event",
        path: "/newsevents",
        submenu: null,
      },
      {
        id: Date.now() + 7,
        label: "Our Clients",
        path: "/clients",
        submenu: null,
      },
      {
        id: Date.now() + 8,
        label: "Contact Us",
        path: "/contact",
        submenu: null,
      },
    ]);
    setBrands([]);
    setInitialized(true);
  };

  const handleImageUpload = async (file, field) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "navbar_images");

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

      // Update the specific field in the form
      const currentValues = form.getFieldsValue();
      form.setFieldsValue({
        logo: {
          ...currentValues.logo,
          [field]: newImageUrl,
        },
      });

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

  const uploadProps = (field) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, field);
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

  const handleAddNavigationItem = () => {
    const newItem = {
      id: Date.now(),
      label: "",
      path: "",
      submenu: null,
    };
    setNavigationItems([...navigationItems, newItem]);
    message.info("New navigation item added. Please fill in the details.");
  };

  const handleRemoveNavigationItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove the navigation item and all its submenus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setNavigationItems(navigationItems.filter((item) => item.id !== id));
        message.success("Navigation item removed successfully");
      }
    });
  };

  const handleNavigationItemChange = (id, field, value) => {
    const updatedItems = navigationItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setNavigationItems(updatedItems);
  };

  const handleAddSubmenuItem = (parentId) => {
    const updatedItems = navigationItems.map((item) => {
      if (item.id === parentId) {
        const submenu = Array.isArray(item.submenu) ? item.submenu : [];
        return {
          ...item,
          submenu: [...submenu, { id: Date.now(), label: "", path: "" }],
        };
      }
      return item;
    });
    setNavigationItems(updatedItems);
    message.info("New submenu item added. Please fill in the details.");
  };

  const handleRemoveSubmenuItem = (parentId, submenuId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove the submenu item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedItems = navigationItems.map((item) => {
          if (item.id === parentId && Array.isArray(item.submenu)) {
            return {
              ...item,
              submenu: item.submenu.filter((sub) => sub.id !== submenuId),
            };
          }
          return item;
        });
        setNavigationItems(updatedItems);
        message.success("Submenu item removed successfully");
      }
    });
  };

  const handleSubmenuItemChange = (parentId, submenuId, field, value) => {
    const updatedItems = navigationItems.map((item) => {
      if (item.id === parentId && Array.isArray(item.submenu)) {
        return {
          ...item,
          submenu: item.submenu.map((sub) =>
            sub.id === submenuId ? { ...sub, [field]: value } : sub
          ),
        };
      }
      return item;
    });
    setNavigationItems(updatedItems);
  };

  const handleAddBrand = () => {
    const newBrand = {
      id: Date.now() + Math.random(), // More unique ID
      name: "",
      logo: "",
      url: "",
      slug: "",
    };
    setBrands([...brands, newBrand]);
    message.info("New brand added. Please fill in the details.");
  };

  const handleRemoveBrand = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the brand.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setBrands(brands.filter((brand) => brand.id !== id));
        message.success("Brand removed successfully");
      }
    });
  };

  const handleBrandChange = (id, field, value) => {
    setBrands((prevBrands) =>
      prevBrands.map((brand) =>
        brand.id === id ? { ...brand, [field]: value } : brand
      )
    );
  };

  const handleBrandLogoUpload = async (file, brandId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "brand_logos");

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

      // Update the specific brand's logo
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand.id === brandId ? { ...brand, logo: newImageUrl } : brand
        )
      );

      message.success("Brand logo uploaded successfully!");
      return newImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const brandLogoUploadProps = (brandId) => ({
    name: "logo",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleBrandLogoUpload(file, brandId);
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate navigation items
      const hasEmptyNavItems = navigationItems.some(
        (item) => !item.label.trim() || !item.path.trim()
      );
      
      if (hasEmptyNavItems) {
        throw new Error("Please fill in all navigation item fields");
      }
      
      // Validate submenu items
      const hasEmptySubmenu = navigationItems.some(
        (item) =>
          Array.isArray(item.submenu) &&
          item.submenu.some((sub) => !sub.label.trim() || !sub.path.trim())
      );
      
      if (hasEmptySubmenu) {
        throw new Error("Please fill in all submenu item fields");
      }
      
      // Validate brands
      const hasEmptyBrands = brands.some(
        (brand) => !brand.name.trim() || !brand.logo.trim() || !brand.url.trim()
      );
      
      if (hasEmptyBrands) {
        throw new Error("Please fill in all brand fields");
      }

      const updatedData = {
        header: {
          logo: values.logo,
          navigation: navigationItems
            .map((item) => ({
              id: item.id, // Preserve ID
              label: item.label,
              path: item.path,
              submenu:
                item.submenu === "dynamic"
                  ? "dynamic"
                  : Array.isArray(item.submenu)
                  ? item.submenu.map((sub) => ({
                      id: sub.id, // Preserve submenu ID
                      label: sub.label,
                      path: sub.path,
                    }))
                  : null,
            }))
            .filter((item) => item.label && item.path),
          brands: brands
            .map((brand) => ({
              id: brand.id, // Preserve brand ID
              name: brand.name,
              logo: brand.logo,
              url: brand.url,
              slug: brand.slug,
            }))
            .filter((brand) => brand.name && brand.logo && brand.url),
        },
      };

      setLoading(true);
      const response = await fetch(`${apiUrl}/layout/navbar/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save navbar data");
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Navigation Bar Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving navbar data:", error);
      message.error(error.message || "Failed to update navigation bar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-800">
            Edit Navigation Bar
          </span>
          <Tooltip title="Configure your website's navigation menu, logo, and brand links">
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
      width={900}
      className="rounded-lg overflow-hidden"
      styles={{ body: { padding: "24px" } }}
      destroyOnClose
    >
      <Spin spinning={loading} tip="Loading navigation data...">
        <Form form={form} layout="vertical" className="space-y-6">
          <Alert
            message="Tip: Drag and drop items to reorder them (coming soon)"
            type="info"
            showIcon
            className="mb-4"
          />
          
          <Collapse defaultActiveKey={["1", "2", "3"]} ghost>
            {/* Logo Section */}
            <Panel
              header={
                <span className="font-semibold text-base">Logo Settings</span>
              }
              key="1"
            >
              <Card
                bordered={false}
                className="rounded-lg shadow-sm border-0"
                bodyStyle={{ padding: "16px" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Form.Item
                      name={["logo", "desktop"]}
                      label={
                        <span>
                          Desktop Logo URL{" "}
                          <Tooltip title="Recommended size: 180x60px">
                            <InfoCircleOutlined className="text-gray-400 ml-1" />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input
                        placeholder="e.g., /images/logo-desktop.svg"
                        addonAfter={
                          <Upload {...uploadProps("desktop")}>
                            <Button
                              icon={<UploadOutlined />}
                              loading={imageLoading}
                              size="small"
                            >
                              Upload
                            </Button>
                          </Upload>
                        }
                      />
                    </Form.Item>
                    {form.getFieldValue(["logo", "desktop"]) && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-500 mb-1">
                          Current Logo Preview:
                        </div>
                        <div className="w-48 h-16 border rounded p-1 bg-gray-50">
                          <img
                            src={form.getFieldValue(["logo", "desktop"])}
                            alt="Current desktop logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Form.Item
                      name={["logo", "mobile"]}
                      label={
                        <span>
                          Mobile Logo URL{" "}
                          <Tooltip title="Recommended size: 120x40px">
                            <InfoCircleOutlined className="text-gray-400 ml-1" />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input
                        placeholder="e.g., /images/logo-mobile.svg"
                        addonAfter={
                          <Upload {...uploadProps("mobile")}>
                            <Button
                              icon={<UploadOutlined />}
                              loading={imageLoading}
                              size="small"
                            >
                              Upload
                            </Button>
                          </Upload>
                        }
                      />
                    </Form.Item>
                    {form.getFieldValue(["logo", "mobile"]) && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-500 mb-1">
                          Current Logo Preview:
                        </div>
                        <div className="w-32 h-16 border rounded p-1 bg-gray-50">
                          <img
                            src={form.getFieldValue(["logo", "mobile"])}
                            alt="Current mobile logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Form.Item
                  name={["logo", "altText"]}
                  label="Logo Alt Text"
                  extra="Important for SEO and accessibility"
                >
                  <Input placeholder="e.g., Company Logo" />
                </Form.Item>
              </Card>
            </Panel>

            {/* Navigation Items Section */}
            <Panel
              header={
                <span className="font-semibold text-base">
                  Navigation Menu
                </span>
              }
              key="2"
            >
              <Card
                bordered={false}
                className="rounded-lg shadow-sm border-0"
                bodyStyle={{ padding: "16px" }}
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddNavigationItem}
                    type="primary"
                    size="small"
                  >
                    Add Menu Item
                  </Button>
                }
              >
                {navigationItems.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No navigation items added yet
                  </div>
                )}
                <List
                  dataSource={navigationItems}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Menu Label*
                              </label>
                              <Input
                                placeholder="e.g., About Us"
                                value={item.label}
                                onChange={(e) =>
                                  handleNavigationItemChange(
                                    item.id,
                                    "label",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Menu Path*
                              </label>
                              <Input
                                placeholder="e.g., /about"
                                value={item.path}
                                onChange={(e) =>
                                  handleNavigationItemChange(
                                    item.id,
                                    "path",
                                    e.target.value
                                  )
                                }
                                className="w-full"
                                addonBefore={
                                  <span className="text-gray-500">
                                    {window.location.origin}
                                  </span>
                                }
                              />
                            </div>
                          </div>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveNavigationItem(item.id)}
                            className="md:ml-4"
                          />
                        </div>

                        <div className="pl-4 border-l-2 border-gray-200">
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                Submenu Items
                              </span>
                              <div className="flex gap-2">
                                {item.submenu !== "dynamic" && (
                                  <Button
                                    type="dashed"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() =>
                                      handleAddSubmenuItem(item.id)
                                    }
                                  >
                                    Add Submenu
                                  </Button>
                                )}
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() =>
                                    handleNavigationItemChange(
                                      item.id,
                                      "submenu",
                                      item.submenu === "dynamic"
                                        ? null
                                        : "dynamic"
                                    )
                                  }
                                >
                                  {item.submenu === "dynamic"
                                    ? "Remove Dynamic"
                                    : "Set as Dynamic"}
                                </Button>
                              </div>
                            </div>

                            {item.submenu === "dynamic" ? (
                              <Alert
                                message="This menu will show dynamic submenu content"
                                type="info"
                                showIcon
                                className="mb-2"
                              />
                            ) : Array.isArray(item.submenu) &&
                              item.submenu.length > 0 ? (
                              <List
                                dataSource={item.submenu}
                                renderItem={(subItem) => (
                                  <List.Item
                                    key={subItem.id}
                                    className="p-3 bg-gray-50 rounded mb-2"
                                  >
                                    <div className="w-full">
                                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Submenu Label*
                                            </label>
                                            <Input
                                              placeholder="e.g., Our Team"
                                              value={subItem.label}
                                              onChange={(e) =>
                                                handleSubmenuItemChange(
                                                  item.id,
                                                  subItem.id,
                                                  "label",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Submenu Path*
                                            </label>
                                            <Input
                                              placeholder="e.g., /about/team"
                                              value={subItem.path}
                                              onChange={(e) =>
                                                handleSubmenuItemChange(
                                                  item.id,
                                                  subItem.id,
                                                  "path",
                                                  e.target.value
                                                )
                                              }
                                              className="w-full"
                                              addonBefore={
                                                <span className="text-gray-500">
                                                  {window.location.origin}
                                                </span>
                                              }
                                            />
                                          </div>
                                        </div>
                                        <Button
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() =>
                                            handleRemoveSubmenuItem(
                                              item.id,
                                              subItem.id
                                            )
                                          }
                                          size="small"
                                        />
                                      </div>
                                    </div>
                                  </List.Item>
                                )}
                              />
                            ) : (
                              <div className="text-sm text-gray-500 py-2">
                                No submenu items added
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Panel>

            {/* Brands Section */}
            <Panel
              header={
                <span className="font-semibold text-base">Brands Section</span>
              }
              key="3"
            >
              <Card
                bordered={false}
                className="rounded-lg shadow-sm border-0"
                bodyStyle={{ padding: "16px" }}
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddBrand}
                    type="primary"
                    size="small"
                  >
                    Add Brand
                  </Button>
                }
              >
                {brands.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No brands added yet
                  </div>
                )}
                <List
                  dataSource={brands}
                  renderItem={(brand) => (
                    <List.Item
                      key={brand.id}
                      className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Brand Name*
                                </label>
                                <Input
                                  placeholder="e.g., Nike"
                                  value={brand.name}
                                  onChange={(e) =>
                                    handleBrandChange(
                                      brand.id,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Brand URL*
                                </label>
                                <Input
                                  placeholder="e.g., https://nike.com"
                                  value={brand.url}
                                  onChange={(e) =>
                                    handleBrandChange(
                                      brand.id,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Brand Slug
                                </label>
                                <Input
                                  placeholder="e.g., nike"
                                  value={brand.slug}
                                  onChange={(e) =>
                                    handleBrandChange(
                                      brand.id,
                                      "slug",
                                      e.target.value
                                    )
                                  }
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Brand Logo*
                                </label>
                                <div className="flex items-center gap-4">
                                  <Upload {...brandLogoUploadProps(brand.id)}>
                                    <Button
                                      icon={<UploadOutlined />}
                                      loading={imageLoading}
                                      className="h-10"
                                    >
                                      Upload Logo
                                    </Button>
                                  </Upload>
                                  {brand.logo ? (
                                    <div className="relative w-16 h-16 border rounded overflow-hidden bg-white">
                                      <img
                                        src={brand.logo}
                                        alt="Brand logo preview"
                                        className="w-full h-full object-contain p-1"
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      No logo uploaded
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveBrand(brand.id)}
                            className="md:ml-4"
                          />
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Panel>
          </Collapse>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditNavbarModal;