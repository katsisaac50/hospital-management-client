import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Select, Spin } from 'antd';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  // Fetch patients and doctors for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      alert(
        "Session expired or you are not logged in. Redirecting to login..."
      );
      window.location.href = "/login";
      return;
    }
      try {
        const patientRes = await axios.get('http://localhost:5000/api/patients',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        console.log(patientRes.data)
        const doctorRes = await axios.get('http://localhost:5000/api/users?role=doctor');
        console.log(doctorRes)
        setPatients(patientRes.data || []); // Ensure the response has `data`
        setDoctors(doctorRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPatients([]); // Fallback to empty array
      setDoctors([]);
      }
    };
    fetchData();
  }, []);

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices');
        setInvoices(response.data.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

   // Fetch invoices
   const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices');
      setInvoices(response.data.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle invoice creation
  const handleCreateInvoice = async (values) => {
    setCreating(true);
    try {
      const servicesArray = values.services.split(',').map((service) => {
        const [description, cost] = service.split(':');
        return { description: description.trim(), cost: parseFloat(cost.trim()) };
      });
  
      const totalAmount = servicesArray.reduce((sum, service) => sum + service.cost, 0);
  
      const response = await axios.post('http://localhost:5000/api/invoices', {
        ...values,
        services: servicesArray,
        totalAmount,
      });
  
      // Option 1: Re-fetch invoices from the server
      await fetchInvoices(); // Re-fetch all invoices to include the new one
  
      // Option 2: Alternatively, append the new invoice without re-fetching
      // setInvoices((prevInvoices) => [...prevInvoices, response.data.data]);
  
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setCreating(false);
    }
  };
  

  const columns = [
    { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Patient', dataIndex: ['patient', 'name'], key: 'patient' },
    { title: 'Doctor', dataIndex: ['doctor', 'name'], key: 'doctor' },
    { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount) => `$${amount}` },
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus' },
    { title: 'Actions', key: 'actions', render: () => <Button type="link">View Details</Button> },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Invoices</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: '20px' }}>
        Create Invoice
      </Button>

      {loading ? (
        <Spin tip="Loading invoices..." />
      ) : (
        <Table dataSource={invoices} columns={columns} rowKey={(record) => record._id || record.invoiceNumber} />
      )}

      <Modal
        title="Create Invoice"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={creating}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateInvoice} layout="vertical">
          <Form.Item
            name="invoiceNumber"
            label="Invoice Number"
            rules={[{ required: true, message: 'Please enter invoice number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="patient"
            label="Select Patient"
            rules={[{ required: true, message: 'Please select a patient' }]}
          >
            <Select placeholder="Select Patient">
            {patients && patients.length > 0 ? (
      patients.map((patient) => (
        <Select.Option key={patient._id} value={patient._id}>
          {patient.name}
        </Select.Option>
      ))
    ) : (
      <Select.Option disabled>No patients available</Select.Option>
    )}
            </Select>
          </Form.Item>
          <Form.Item
            name="doctor"
            label="Select Doctor"
            rules={[{ required: true, message: 'Please select a doctor' }]}
          >
            <Select placeholder="Select Doctor">
            {doctors && doctors.length > 0 ? (
      doctors.map((doctor) => (
        <Select.Option key={doctor._id} value={doctor._id}>
          {doctor.name}
        </Select.Option>
      ))
    ) : (
      <Select.Option disabled>No doctors available</Select.Option>
    )}
            </Select>
          </Form.Item>
          <Form.Item
            name="services"
            label="Services (comma-separated with costs, e.g., Consultation:50, Medication:20)"
            rules={[{ required: true, message: 'Please provide services with costs' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="paymentStatus"
            label="Payment Status"
            rules={[{ required: true, message: 'Please enter payment status' }]}
          >
            <Select>
    <Select.Option value="paid">Paid</Select.Option>
    <Select.Option value="pending">Pending</Select.Option>
    <Select.Option value="failed">Failed</Select.Option>
    {/* Add other valid options here */}
  </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoicePage;
