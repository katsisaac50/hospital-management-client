import { useState } from 'react';
import { useProductsContext } from '../../context/ProductsContext';
import { addProduct } from '../../services/productsService';
import { AxiosError } from 'axios';
import { useTheme } from '../../context/ThemeContext'; // Import theme context
import { Product } from './../../lib/interfaces';

const ProductForm = () => {
  const { setProducts } = useProductsContext();

  const { theme } = useTheme(); // Get current theme
  const [form, setForm] = useState({
    name: '',
    category: 'medicine',
    quantity: 0,
    price: 0,
    expiryDate: '', // New state for expiry date
    batchNumber: '', // New state for batch number
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = await addProduct(form);
      setProducts((prev: Product[]) => [...prev, newProduct]);
    } catch (error) {
      const err = error as AxiosError;
      console.error('Failed to add product:', err.response?.data || err.message);
      alert('Error adding product. Please check the input fields.');
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className={`p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div>
      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
      <input
        id="name"
        type="text"
        placeholder="Enter product name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
      />
    </div>

    <div>
      <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
      <select
        id="category"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
      >
        <option value="medicine">Medicine</option>
        <option value="surgical">Surgical</option>
        <option value="equipment">Equipment</option>
      </select>
    </div>

    <div>
      <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
      <input
        id="quantity"
        type="number"
        placeholder="Enter quantity"
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
      />
    </div>

    <div>
      <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
      <input
        id="price"
        type="number"
        placeholder="Enter price"
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
      />
    </div>

    <div>
      <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">Expiry Date</label>
      <input
        id="expiryDate"
        type="date"
        placeholder="Enter expiry date"
        onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
      />
    </div>

    <div>
      <label htmlFor="batchNumber" className="block text-sm font-medium mb-1">Batch Number</label>
      <input
        id="batchNumber"
        type="text"
        placeholder="Enter batch number"
        onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
      />
    </div>
  </div>

  {/* Add Product Button (now centered and takes full width on small screens) */}
  <div className="mt-4 flex justify-center">
    <button
      type="submit"
      className={`w-full sm:w-auto py-2 px-4 rounded-md font-semibold transition ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
    >
      Add Product
    </button>
  </div>
</form>
  );
};

export default ProductForm;
