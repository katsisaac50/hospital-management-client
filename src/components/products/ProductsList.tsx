import { useState, useEffect } from "react";
import { useProductsContext } from "../../context/ProductsContext";
import { useTheme } from "../../context/ThemeContext";
import { Product } from "../../lib/interfaces";
import Button from "../ui/button";
import { useAppContext } from "../../context/AppContext";
import EditProductModal from "./EditProductModal";
import axios from "axios";

interface ProductsListProps {
  products?: Product[];
  onDispense?: (product: Product) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductsList: React.FC<ProductsListProps> = ({ products, onDispense }) => {
  const { products: contextProducts, setProducts } = useProductsContext();
  const { theme } = useTheme();
  const { user } = useAppContext();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDispense = (product: Product) => {
    onDispense?.(product);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const productItems = products?.length ? products : contextProducts;

  return (
    <div
      className={`p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300 ${
        theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-black"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} text-black`}>
              <th className="p-2 md:p-3 border-b">Name</th>
              <th className="p-2 md:p-3 border-b">Category</th>
              <th className="p-2 md:p-3 border-b">Quantity</th>
              <th className="p-2 md:p-3 border-b hidden md:table-cell">Price</th>
              <th className="p-2 md:p-3 border-b hidden md:table-cell">Batch No.</th>
              {["admin", "pharmacist", "doctor"].includes(user?.role) && (
                <th className="p-2 md:p-3 border-b">Action</th>
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
                <td className="p-2 md:p-3">{product.name}</td>
                <td className="p-2 md:p-3">{product.category}</td>
                <td className="p-2 md:p-3">{product.quantity ?? 0}</td>
                <td className="p-2 md:p-3 hidden md:table-cell">{product.price}</td>
                <td className="p-2 md:p-3 hidden md:table-cell">{product.batchNumber || "N/A"}</td>
                {["admin", "pharmacist", "doctor"].includes(user?.role) && (
                  <td className="p-2 flex flex-wrap md:flex-nowrap gap-1">
                    <Button
                      variant="contained"
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 text-white px-2 py-1 text-xs md:text-sm rounded-md shadow-sm hover:bg-blue-600 transition-all"
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      onClick={() => handleDispense(product)}
                      className="bg-green-500 text-white px-2 py-1 text-xs md:text-sm rounded-md shadow-sm hover:bg-green-600 transition-all"
                    >
                      💊 Dispense
                    </Button>
                    <Button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs md:text-sm rounded-md shadow-sm hover:bg-red-600 transition-all"
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
