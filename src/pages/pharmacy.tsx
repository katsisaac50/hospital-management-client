import { useState, useContext, useEffect, useMemo } from 'react';
import { ProductsContext } from '../context/ProductsContext';
import { useTheme } from '../context/ThemeContext';
import DispenseModal from '../components/products/DispenseModal';
import ProductForm from '../components/products/ProductForm';
import ProductsList from '../components/products/ProductsList';
import Link from 'next/link';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { Search } from 'lucide-react';

// Ensure Product type is defined or imported
interface Product {
  _id: string;
  name: string;
  quantity: number;
}

const Inventory = () => {
  const { products = [], setProducts } = useContext(ProductsContext); // Avoid undefined
  const { theme } = useTheme();
  const [search, setSearch] = useState(''); // Ensure search is defined
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDispense = (productID: Product, quantity: number ) => {
    if (!selectedProduct) return;

    if (selectedProduct.quantity < quantity) {
      alert("Not enough stock available!");
      return;
    }

    const updatedProducts = products.map((product) =>
      product._id === selectedProduct._id
        ? { ...product, quantity: Number(product.quantity) - Number(quantity) }
        : product
    );

    setProducts(updatedProducts);
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, products]);

  return (
    <div className={`px-4 py-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className={`text-xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>Pharmacy Inventory</h1>
        <Link href="/dashboard">
          <Button className={`${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white w-full sm:w-auto`}>Back to Dashboard</Button>
        </Link>
      </header>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-2/3">
        <div className="relative flex-grow w-full">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-400' : 'bg-white border-gray-300 text-black focus:ring-blue-500'
            }`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} size={20} />
        </div>
      </div>

      {/* Inventory Sections */}
      <section className={`p-4 sm:p-6 rounded-lg shadow-lg mb-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <ProductForm />
      </section>

      <section className={`p-4 sm:p-6 rounded-lg shadow-lg overflow-x-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h3 className="text-lg font-semibold mb-4">Inventory List</h3>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <ProductsList products={filteredProducts} onDispense={handleOpenModal} />
        )}
      </section>

      {/* Modal for Dispensing */}
      {showModal && selectedProduct && (
        <DispenseModal
          productId={selectedProduct._id}
          productName={selectedProduct.name}
          productQuantity={selectedProduct.quantity}
          onClose={handleCloseModal}
          onDispense={handleDispense}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Inventory;