import { useState } from "react";
import axios from "axios";
import { useProductsContext } from "../../context/ProductsContext";
import { useTheme } from "../../context/ThemeContext";

interface RestockFormProps {
  productId: string;
  closeModal: () => void; // If using a modal
}

const RestockProductForm: React.FC<RestockFormProps> = ({ closeModal, productId, refreshProducts }) => {
  const { setProducts } = useProductsContext();
  const { theme } = useTheme();
  
  const [form, setForm] = useState({
    supplierName: "",
    contact: "",
    purchasePrice: 0,
    quantity: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/restock-product/${productId}`, form);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, quantity: response.data.newStock } : product
        )
      );
      alert("Product restocked successfully!");
      refreshProducts();
      closeModal(); // Close modal after submission (if applicable)
    } catch (error) {
      console.error("Failed to restock product:", error);
      alert("Error restocking product.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Supplier Name</label>
          <input
            type="text"
            placeholder="Enter supplier name"
            onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contact</label>
          <input
            type="text"
            placeholder="Enter contact"
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Purchase Price</label>
          <input
            type="number"
            placeholder="Enter purchase price"
            onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 mt-3 rounded-md font-semibold transition ${
            theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Restock Product
        </button>
      </div>
    </form>
  );
};

export default RestockProductForm;