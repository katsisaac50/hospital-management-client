import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, Spin } from 'antd';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices');
        const {data} = response.data
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/invoices', values);
      console.log(response)
      setInvoices([...invoices, response.data]);
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const columns = [
    { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
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
        <Table dataSource={invoices} columns={columns} rowKey="_id" />
      )}

      <Modal
        title="Create Invoice"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateInvoice} layout="vertical">
          <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true, message: 'Please enter invoice number' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="patient" label="Patient ID" rules={[{ required: true, message: 'Please enter patient ID' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="doctor" label="Doctor ID">
            <Input />
          </Form.Item>
          <Form.Item name="services" label="Services (comma-separated descriptions)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoicePage;
