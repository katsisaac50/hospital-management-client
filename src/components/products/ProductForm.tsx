import { useState, useContext } from 'react';
import { ProductsContext } from '../../context/ProductsContext';
import { addProduct } from '../../services/productsService';
import { AxiosError } from "axios";

const ProductForm = () => {
  const { setProducts } = useContext(ProductsContext);
  const [form, setForm] = useState({ name: '', category: 'medicine', quantity: 0, price: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const newProduct = await addProduct(form);
    setProducts((prev: any) => [...prev, newProduct]);
  } catch (error) {
    const err = error as AxiosError;
    console.error("Failed to add product:", err.response?.data || err.message);
    alert("Error adding product. Please check the input fields.");
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <select onChange={(e) => setForm({ ...form, category: e.target.value })}>
        <option value="medicine">Medicine</option>
        <option value="Surgical">Surgical</option>
        <option value="equipment">Equipment</option>
      </select>
      <input type="number" placeholder="Quantity" onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
      <input type="number" placeholder="Price" onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
