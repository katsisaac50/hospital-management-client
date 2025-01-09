import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Spin, Popconfirm, message } from "antd";
import { ColumnsType } from "antd/es/table";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
}

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [form] = Form.useForm();

  const getAuthToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Session expired or you are not logged in. Redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const response = await axios.get("http://localhost:5000/api/users?role=doctor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDoctors(response.data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      message.error("Failed to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleAddOrEditDoctor = async (values: Omit<Doctor, "_id">) => {
    const token = getAuthToken();
    if (!token) {
      alert("Session expired or you are not logged in. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    try {
      if (isEditing && currentDoctor) {
        await axios.put(`http://localhost:5000/api/users/${currentDoctor._id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Doctor updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/users", { ...values, role: "doctor" }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Doctor added successfully.");
      }
      setIsModalOpen(false);
      setCurrentDoctor(null);
      form.resetFields();
      fetchDoctors(); // Refresh doctors list
    } catch (error) {
      console.error("Error saving doctor:", error);
      message.error("Failed to save doctor.");
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    const token = getAuthToken();
    if (!token) {
      alert("Session expired or you are not logged in. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Doctor deleted successfully.");
      fetchDoctors(); // Refresh doctors list
    } catch (error) {
      console.error("Error deleting doctor:", error);
      message.error("Failed to delete doctor.");
    }
  };

  const columns: ColumnsType<Doctor> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Specialization", dataIndex: "specialization", key: "specialization" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setIsEditing(true);
              setIsModalOpen(true);
              setCurrentDoctor(record);
              form.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDeleteDoctor(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Doctors Management</h2>
      <Button
        type="primary"
        style={{ marginBottom: "20px" }}
        onClick={() => {
          setIsModalOpen(true);
          setIsEditing(false);
          form.resetFields();
        }}
      >
        Add Doctor
      </Button>

      {loading ? (
        <Spin tip="Loading doctors..." />
      ) : (
        <Table dataSource={doctors} columns={columns} rowKey={(record) => record._id} />
      )}

      <Modal
        title={isEditing ? "Edit Doctor" : "Add Doctor"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentDoctor(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddOrEditDoctor} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the doctor's name." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the doctor's email." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: "Please enter the specialization." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter the phone number." },
              { pattern: /^\d{10,15}$/, message: "Phone number must be 10-15 digits." },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorsPage;