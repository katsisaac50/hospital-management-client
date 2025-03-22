import { useState } from "react";
import axios from "axios";
import { useProductsContext } from "../../context/ProductsContext";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../ui/Modal"; // Importing the Modal component
// import Input from "../ui/input";
// import Button from "../ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RestockFormProps {
  productId: string;
  closeModal: () => void;
  refreshProducts: () => void;
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
      const response = await axios.post(`${API_URL}/products/restock-product/${productId}`, form);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, quantity: response.data.newStock } : product
        )
      );
      alert("Product restocked successfully!");
      refreshProducts();
      closeModal();
    } catch (error) {
      console.error("Failed to restock product:", error);
      alert("Error restocking product.");
    }
  };

  return (
    <Modal isOpen={true} onClose={closeModal}>
      <form
        onSubmit={handleSubmit}
        className={`p-4 rounded-lg shadow-lg w-96 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Restock Product</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Supplier Name</label>
            <input
              type="text"
              placeholder="Enter supplier name"
              value={form.supplierName}
              onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact</label>
            <input
              type="text"
              placeholder="Enter contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Purchase Price</label>
            <input
              type="number"
              placeholder="Enter purchase price"
              value={form.purchasePrice}
              onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md font-semibold transition ${
                theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Restock Product
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default RestockProductForm;