import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/button';
import { Product } from '../../lib/interfaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DispenseModalProps {
  productId: string;
  productName: string;
  productQuantity: number;
  onClose: () => void;
  onDispense: (quantity: number) => void;
} 
interface DispenseModalProps {
    product: {
      _id: string;
      name: string;
      quantity: number;
    };
    onClose: () => void;
    onDispense: (quantity: number) => void;
  }

const DispenseModal = ({ product, productId, productName, productQuantity, onClose, onDispense }: DispenseModalProps) => {
  const { theme } = useTheme();
  const [quantityToDispense, setQuantityToDispense] = useState(0);
  const selectedProduct = product;
  const handleDispense = async (quantity: number) => {
    if (!selectedProduct) return;
  
    if (quantity <= 0 || quantity > selectedProduct.quantity) {
      alert("Invalid quantity. Please enter a valid amount to dispense.");
      return;
    }
  
    try {
      // Send the dispense request to the backend
      console.log('helo', quantityToDispense)
      const response = await fetch(`${API_URL}/products/${selectedProduct._id}/dispense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:  JSON.stringify({ quantity: quantityToDispense}),
    });
    console.log('res', response)
  
      if (!response.ok) {
        throw new Error("Failed to update product stock.");
      }
  
      // Update local state after successful API call
      const updatedProducts = products.map((product) =>
        product._id === selectedProduct._id
          ? { ...product, quantity: product.quantity - quantity }
          : product
      );
  
      setProducts(updatedProducts);
      handleCloseModal(); // Close modal after dispensing
    } catch (error) {
      console.error("Error dispensing product:", error);
      alert("An error occurred while dispensing. Please try again.");
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div
        className={`w-full sm:w-96 p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
      >
        <h2 className="text-xl font-semibold mb-4">Dispense {productName}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quantity to Dispense</label>
          <input
            type="number"
            min="1"
            max={productQuantity}
            value={quantityToDispense}
            onChange={(e) => setQuantityToDispense(Number(e.target.value))}
            className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
          />
        </div>

        <div className="flex justify-between">
          <Button
            onClick={onClose}
            className={`text-sm ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDispense}
            className={`text-sm ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            Confirm Dispense
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DispenseModal;