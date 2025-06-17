import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Upload, Spin, Card, List, Tabs, Image } from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { TabPane } = Tabs;
const { TextArea } = Input;

const GalleryModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [galleryData, setGalleryData] = useState(null);
  const [activeTab, setActiveTab] = useState("gallery-box");

  useEffect(() => {
    if (isOpen) {
      fetchGalleryData();
    }
  }, [isOpen]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/gallery/`);

      if (!response.ok) {
        throw new Error("Failed to fetch gallery data");
      }

      const data = await response.json();
      setGalleryData(data);
      form.setFieldsValue({
        title: data.title || "",
      });
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      message.error("Failed to load gallery data.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, sectionSlug, imageId = null) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", "gallery_images");

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

      // Update the gallery data with the new image
      const updatedSections = galleryData.sections.map(section => {
        if (section.slug === sectionSlug) {
          if (imageId) {
            // Update existing image
            const updatedImages = section.images.map(img => 
              img.id === imageId ? { ...img, image: newImageUrl } : img
            );
            return { ...section, images: updatedImages };
          } else {
            // Add new image
            const newImage = {
              id: Date.now(), // temporary ID
              image: newImageUrl,
              primary_text: ""
            };
            return { ...section, images: [...section.images, newImage] };
          }
        }
        return section;
      });

      setGalleryData({
        ...galleryData,
        sections: updatedSections
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

  const uploadImageProps = (sectionSlug, imageId = null) => ({
    name: "image",
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const imageUrl = await handleImageUpload(file, sectionSlug, imageId);
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

  const handleAddImage = (sectionSlug) => {
    const updatedSections = galleryData.sections.map(section => {
      if (section.slug === sectionSlug) {
        return {
          ...section,
          images: [...section.images, { id: Date.now(), image: "", primary_text: "" }]
        };
      }
      return section;
    });

    setGalleryData({
      ...galleryData,
      sections: updatedSections
    });
  };

  const handleAddVideo = (sectionSlug) => {
    const updatedSections = galleryData.sections.map(section => {
      if (section.slug === sectionSlug) {
        return {
          ...section,
          videos: [...section.videos, { id: Date.now(), video: "", thumbnail: "", primary_text: "" }]
        };
      }
      return section;
    });

    setGalleryData({
      ...galleryData,
      sections: updatedSections
    });
  };

  const handleRemoveImage = (sectionSlug, imageId) => {
    const updatedSections = galleryData.sections.map(section => {
      if (section.slug === sectionSlug) {
        return {
          ...section,
          images: section.images.filter(img => img.id !== imageId)
        };
      }
      return section;
    });

    setGalleryData({
      ...galleryData,
      sections: updatedSections
    });
  };

  const handleRemoveVideo = (sectionSlug, videoId) => {
    const updatedSections = galleryData.sections.map(section => {
      if (section.slug === sectionSlug) {
        return {
          ...section,
          videos: section.videos.filter(vid => vid.id !== videoId)
        };
      }
      return section;
    });

    setGalleryData({
      ...galleryData,
      sections: updatedSections
    });
  };

  const handleTextChange = (sectionSlug, type, id, field, value) => {
    const updatedSections = galleryData.sections.map(section => {
      if (section.slug === sectionSlug) {
        if (type === 'image') {
          const updatedImages = section.images.map(item => 
            item.id === id ? { ...item, [field]: value } : item
          );
          return { ...section, images: updatedImages };
        } else {
          const updatedVideos = section.videos.map(item => 
            item.id === id ? { ...item, [field]: value } : item
          );
          return { ...section, videos: updatedVideos };
        }
      }
      return section;
    });

    setGalleryData({
      ...galleryData,
      sections: updatedSections
    });
  };

  const handleVideoLinkChange = (sectionSlug, videoId, link) => {
    // Extract YouTube video ID if it's a YouTube URL
    let videoUrl = link;
    let thumbnailUrl = "";
    
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      const youtubeId = extractYouTubeId(link);
      if (youtubeId) {
        videoUrl = `https://www.youtube.com/embed/${youtubeId}`;
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      }
    }

    const updatedSections = galleryData.sections.map(section => {
      if (section.slug === sectionSlug) {
        const updatedVideos = section.videos.map(video => 
          video.id === videoId ? { ...video, video: videoUrl, thumbnail: thumbnailUrl } : video
        );
        return { ...section, videos: updatedVideos };
      }
      return section;
    });

    setGalleryData({
      ...galleryData,
      sections: updatedSections
    });
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        title: values.title,
        sections: galleryData.sections.map(section => ({
          id: section.id,
          title: section.title,
          slug: section.slug,
          images: section.images.filter(img => img.image), // filter out empty images
          videos: section.videos.filter(vid => vid.video) // filter out empty videos
        }))
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/gallery/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save gallery data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Gallery Content Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving gallery data:", error);
      message.error(error.message || "Failed to update gallery section");
    }
  };

  if (!galleryData) return null;

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Gallery Section
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
                placeholder="e.g., Explore Stech Group Gallery"
                className="rounded-lg hover:border-blue-400 focus:border-blue-400"
              />
            </Form.Item>
          </Card>

          <Card
            title="Gallery Sections"
            bordered={false}
            className="rounded-lg shadow-sm border-0"
            headStyle={{
              background: "linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {galleryData.sections.map(section => (
                <TabPane tab={section.title} key={section.slug}>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-4">Images</h3>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddImage(section.slug)}
                      className="mb-4 flex items-center bg-blue-600 hover:bg-blue-700"
                    >
                      Add Image
                    </Button>
                    
                    <List
                      dataSource={section.images}
                      renderItem={(image) => (
                        <List.Item key={image.id} className="p-4 border-b border-gray-200 last:border-b-0">
                          <div className="w-full">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <Input
                                  placeholder="Primary Text"
                                  value={image.primary_text}
                                  onChange={(e) => handleTextChange(section.slug, 'image', image.id, 'primary_text', e.target.value)}
                                  className="rounded-lg hover:border-blue-400 focus:border-blue-400 mb-4"
                                />
                                
                                <div className="flex items-center gap-4">
                                  <Upload {...uploadImageProps(section.slug, image.id)}>
                                    <Button
                                      icon={<UploadOutlined />}
                                      loading={imageLoading}
                                      className="h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      Upload Image
                                    </Button>
                                  </Upload>
                                  {image.image && (
                                    <div className="relative w-32 h-32">
                                      <Image
                                        src={image.image}
                                        alt="Gallery image"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveImage(section.slug, image.id)}
                              />
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-4">Videos</h3>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddVideo(section.slug)}
                      className="mb-4 flex items-center bg-blue-600 hover:bg-blue-700"
                    >
                      Add Video
                    </Button>
                    
                    <List
                      dataSource={section.videos}
                      renderItem={(video) => (
                        <List.Item key={video.id} className="p-4 border-b border-gray-200 last:border-b-0">
                          <div className="w-full">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <Input
                                  placeholder="Primary Text"
                                  value={video.primary_text}
                                  onChange={(e) => handleTextChange(section.slug, 'video', video.id, 'primary_text', e.target.value)}
                                  className="rounded-lg hover:border-blue-400 focus:border-blue-400 mb-4"
                                />
                                
                                <Input
                                  placeholder="Enter YouTube or video URL"
                                  value={video.video}
                                  onChange={(e) => handleVideoLinkChange(section.slug, video.id, e.target.value)}
                                  className="rounded-lg hover:border-blue-400 focus:border-blue-400 mb-4"
                                />
                                
                                {video.thumbnail && (
                                  <div className="relative w-32 h-32 mt-4">
                                    <Image
                                      src={video.thumbnail}
                                      alt="Video thumbnail"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveVideo(section.slug, video.id)}
                              />
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </Form>
      </Spin>
    </Modal>
  );
};

export default GalleryModal;