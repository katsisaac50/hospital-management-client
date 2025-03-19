import { useState, useEffect } from "react";
import { useProductsContext } from "../../context/ProductsContext";
import { useTheme } from "../../context/ThemeContext";
import { Product } from "../../lib/interfaces";
import Button from "../ui/button";
import { useAppContext } from "../../context/AppContext";
import EditProductModal from "./EditProductModal";
import axios from "axios";

// Define Props
interface ProductsListProps {
  products?: Product[]; // Optional since we fallback to context products
  onDispense?: (product: Product) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductsList: React.FC<ProductsListProps> = ({ products, onDispense }) => {
  const { products: contextProducts, setProducts } = useProductsContext();
  const { theme } = useTheme();
  const { user } = useAppContext();

  // State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get Products on Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [setProducts]);

  // Close Modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  // Edit Product
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Dispense Product
  const handleDispense = (product: Product) => {
    onDispense?.(product);
  };

  // Delete Product
  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Use provided products or fallback to context products
  const productItems = products?.length ? products : contextProducts;

  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-all duration-300 ${
        theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-black"
      }`}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} text-black`}>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Category</th>
            <th className="p-3 border-b">Quantity</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Batch No.</th>
            {["admin", "pharmacist", "doctor"].includes(user?.role) && (
              <th className="p-3 border-b">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {productItems.map((product) => (
            <tr
              key={product._id}
              className={`border-y transition-all duration-200 ${
                theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"
              }`}
            >
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.category}</td>
              <td className="p-3">{product.quantity ?? 0}</td>
              <td className="p-3">{product.price}</td>
              <td className="p-3">{product.batchNumber || "N/A"}</td>
              {["admin", "pharmacist", "doctor"].includes(user?.role) && (
                <td className="p-3 flex gap-2">
                <Button
                  variant="contained"
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
                >
                  ✏️ Edit
                </Button>
                <Button
                  onClick={() => handleDispense(product)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all"
                >
                  💊 Dispense
                </Button>
                <Button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all"
                >
                  🗑️ Delete
                </Button>
              </td>              
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {selectedProduct && (
        <EditProductModal
          open={modalOpen}
          handleClose={handleCloseModal}
          product={selectedProduct}
          refreshProducts={() => fetchProducts()} // Pass function reference
        />
      )}
    </div>
  );
};

export default ProductsList;