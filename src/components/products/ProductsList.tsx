import React, { useState, useEffect } from "react";
import { useProductsContext } from '../../context/ProductsContext';
import { useTheme } from '../../context/ThemeContext'; // Import theme context
import { Product } from './../../lib/interfaces';
import Button from '../ui/button';
import { useAppContext } from '../../context/AppContext';
import EditProductModal from "./EditProductModal";

// Define the type for props
interface ProductsListProps {
  products?: Product[]; // Optional because we fall back to context products
  onDispense?: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, onDispense }) => {
  const { products: contextProducts, setProducts } = useProductsContext();
  const { theme } = useTheme(); // Get the current theme
  const { user } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
console.log('products', products)
  // Use provided products or fallback to context products
  const productItems = products && products.length > 0 ? products : contextProducts;
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    const data = await response.json();
    setProducts(data); // Update context with fresh data
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null); // Clear selected product
  };
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDispense = (product: Product) => {
    if (onDispense) {
      onDispense(product);
    } else {
      console.warn("onDispense function is not provided.");
    }
  };
  

  return (
    <div 
  className={`p-6 rounded-lg shadow-lg transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-black'}`}
>
  
<table className="w-full border-collapse">
  <thead>
    <tr className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-black'}`}>
      <th className="p-3 border-b">Name</th>
      <th className="p-3 border-b">Category</th>
      <th className="p-3 border-b">Quantity</th>
      <th className="p-3 border-b">Price</th>
      <th className="p-3 border-b">Batch No.</th>
      {['admin', 'pharmacist', 'doctor'].includes(user?.role)  && <th className="p-3 border-b">Action</th>}{/* Added column for actions */}
    </tr>
  </thead>
  <tbody>
    {productItems.map((product: Product) => (
      <tr
        key={product._id}
        className={`border-y transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
      >
        <td className="p-3">{product.name}</td>
        <td className="p-3">{product.category}</td>
        <td className="p-3">{product.quantity ?? 0}</td>
        <td className="p-3">{product.price}</td>
        <td className="p-3">{product.batchNumber || 'N/A'}</td>
        <td className="p-3">
          {/* Show the button only for authorized roles */}
          {['admin', 'pharmacist', 'doctor'].includes(user?.role) && (<>
            <Button variant="contained" onClick={() => handleEdit(product)}>Edit</Button>
            <Button
              onClick={() => handleDispense(product)}
              className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded"
            >
              Dispense
            </Button>
          </>
            
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
{selectedProduct && (
        <EditProductModal
          open={modalOpen}
          handleClose={handleCloseModal}
          product={selectedProduct}
          refreshProducts={fetchProducts}
        />
      )}
</div>

  );
};

export default ProductsList;