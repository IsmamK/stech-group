import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Spin, Card, message } from "antd";
import Swal from "sweetalert2";

const HeroModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !initialized) {
      fetchHeroData();
      setInitialized(true);
    }
  }, [isOpen, initialized]);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/home/hero/`);

      if (!response.ok) {
        if (response.status === 404) {
          initializeWithDefaults();
          return;
        }
        throw new Error("Failed to fetch hero data");
      }

      const data = await response.json();
      form.setFieldsValue({
        title: data?.title || "",
      });
    } catch (error) {
      console.error("Error fetching hero data:", error);
      message.error("Failed to load hero data");
      initializeWithDefaults();
    } finally {
      setLoading(false);
    }
  };

  const initializeWithDefaults = () => {
    form.setFieldsValue({
      title: "STECH GROUP: A BRAND BUILT ON TRUST, QUALITY & CONFIDENCE",
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/home/hero/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: values.title }),
      });

      if (!response.ok) {
        throw new Error('Failed to save hero data');
      }

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Hero Title Updated Successfully",
        showConfirmButton: false,
        timer: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error saving hero data:", error);
      message.error(error.message || "Failed to update hero title");
    }
  };

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-gray-800">
          Edit Hero Title
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
      width={600}
      className="rounded-lg overflow-hidden"
      styles={{ body: { padding: "24px" } }}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Card
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
                  Hero Title
                </span>
              }
              rules={[
                { required: true, message: "Please enter the hero title" },
                { max: 100, message: "Title cannot exceed 100 characters" }
              ]}
            >
              <Input
                size="large"
                placeholder="Enter hero title"
                className="rounded-lg hover:border-blue-400 focus:border-blue-400"
                allowClear
              />
            </Form.Item>
          </Card>
        </Form>
      </Spin>
    </Modal>
  );
};

export default HeroModal;