import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Box, TableSortLabel, TablePagination
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PaymentForm from './PaymentForm';
import CustomModal from '../ui/Modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define TypeScript Interfaces
interface Payment {
  _id: string;
  patient_id: { name: string } | null;
  amount_paid: number;
  balance: number;
  payment_date: string;
  payment_method: string;
  patientId: { fullName: string };
  name: string;
  date: string;
  total: number;
  paid: number;
  transactionType: string;
  notes: string;
}

const PaymentsTable: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sortBy, setSortBy] = useState<keyof Payment>('payment_date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get<Payment[]>(`${API_URL}/payments`, { params: { sortBy, order } });
      console.log(response)
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleSort = (field: keyof Payment) => {
    const isAsc = sortBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSortBy(field);
    fetchPayments();
  };

  const generatePDF = (): jsPDF => {
    const doc = new jsPDF();
    doc.text("Payments Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [['Patient', 'Amount Paid', 'Balance', 'Payment Date', 'Method']],
      body: payments.map(payment => ([
        payment.patient_id?.name || "Unknown",
        `$${payment.amount_paid.toFixed(2)}`,
        `$${payment.balance.toFixed(2)}`,
        new Date(payment.payment_date).toLocaleDateString(),
        payment.payment_method
      ])),
    });

    return doc;
  };

  const handleViewPDF = () => {
    const doc = generatePDF();
    window.open(URL.createObjectURL(doc.output("blob")));
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    doc.save("payments_report.pdf");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2>Payments</h2>
      {/* Button to open the modal */}
      <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ marginBottom: 2 }}>
        Add Payment
      </Button>

      {/* Payment Modal */}
      <CustomModal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <PaymentForm onPaymentAdded={() => {
          fetchPayments();
          setOpenModal(false); // Close modal after adding
        }} />
      </CustomModal>
      

      {/* Export Buttons */}
      <Box sx={{ marginBottom: 2 }}>
        <Button variant="contained" onClick={handleViewPDF} sx={{ marginRight: 1 }}>View PDF</Button>
        <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>Download PDF</Button>
      </Box>

      {/* Payments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={sortBy === 'patient_id'} direction={order} onClick={() => handleSort('patient_id')}>
                  Patient
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === 'amount_paid'} direction={order} onClick={() => handleSort('amount_paid')}>
                  Amount Paid
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === 'balance'} direction={order} onClick={() => handleSort('balance')}>
                  Balance
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === 'payment_date'} direction={order} onClick={() => handleSort('payment_date')}>
                  Payment Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Transaction Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>{payment.patient_id?.name || "Unknown"}</TableCell>
                <TableCell>${payment.amount_paid.toFixed(2)}</TableCell>
                <TableCell>${payment.balance.toFixed(2)}</TableCell>
                <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.payment_method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={payments.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Box>
  );
};

export default PaymentsTable;