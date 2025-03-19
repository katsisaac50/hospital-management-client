import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";

// Define Product Type
interface Product {
  _id: string;
  name: string;
  category: "medicine" | "equipment";
  description?: string;
  dosageForm?: string;
  strength?: string;
  quantity: number;
  price: number;
  batchNumber: string;
  expiryDate: string;
}

// Props for the modal component
interface EditProductModalProps {
  open: boolean;
  handleClose: () => void;
  product: Product | null;
  refreshProducts: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL|| "http://localhost:5000/api";;

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  handleClose,
  product,
  refreshProducts,
}) => {
  const [formData, setFormData] = useState<Product>({
    _id: "",
    name: "",
    category: "medicine",
    description: "",
    dosageForm: "",
    strength: "",
    quantity: 0,
    price: 0,
    batchNumber: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        expiryDate: product.expiryDate ? product.expiryDate.split("T")[0] : "",
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_URL}/products/${product?._id}`, formData);
      refreshProducts(); // Refresh product list after update
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" />
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="medicine">Medicine</MenuItem>
          <MenuItem value="equipment">Equipment</MenuItem>
        </TextField>
        <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Dosage Form" name="dosageForm" value={formData.dosageForm} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Strength" name="strength" value={formData.strength} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} margin="normal" />
        <TextField fullWidth label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} margin="normal" />
        <TextField fullWidth type="date" label="Expiry Date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
