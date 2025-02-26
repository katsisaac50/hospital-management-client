import { useState, useContext, useEffect, useCallback } from 'react';
import { ProductsContext } from '../context/ProductsContext';
import { useTheme } from '../context/ThemeContext'; // Import theme context
import ProductForm from '../components/products/ProductForm';
import ProductsList from '../components/products/ProductsList';
import Link from 'next/link';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { Search } from 'lucide-react';

const Inventory = () => {
  const { products } = useContext(ProductsContext);
  const { theme } = useTheme(); // Get current theme
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Function to handle search filter
  const handleSearch = useCallback((searchTerm: string) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [filtered]);


  // Use effect to filter products as user types
  useEffect(() => {
    handleSearch(search);
  }, [handleSearch, products]);

  const handleButtonSearch = () => {
    handleSearch(search);
  };

  return (
    <div
      className={`p-8 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1
          className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}
        >
          Pharmacy Inventory
        </h1>
        <Link href="/dashboard">
          <Button
            className={`${
              theme === 'dark'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </Link>
      </header>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 w-full sm:w-2/3">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-600 text-white focus:ring-blue-400'
                : 'bg-white border-gray-300 text-black focus:ring-blue-500'
            }`}
          />
          <Search
            className={`absolute right-3 top-2.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
            size={20}
          />
        </div>
        <Button
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          onClick={handleButtonSearch}
        >
          Search
        </Button>
      </div>

      {/* Inventory Sections */}
      <section
        className={`p-6 rounded-lg shadow-lg mb-6 ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
        <ProductForm />
      </section>

      <section
        className={`p-6 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Inventory List</h3>
        <ProductsList products={filteredProducts} />
      </section>
    </div>
  );
};

export default Inventory;