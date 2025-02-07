import { useState, useContext } from 'react';
import { ProductsContext } from '../context/ProductsContext';
import ProductForm from '../components/products/ProductForm';
import ProductsList from '../components/products/ProductsList';
import Link from 'next/link';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { Search } from 'lucide-react';

const Inventory = () => {
  const { products } = useContext(ProductsContext);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // const filteredProducts = products.filter(product =>
  //   product.name.toLowerCase().includes(search.toLowerCase())
  // );

   // Function to handle search
   const handleSearch = () => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(filtered)
    setFilteredProducts(filtered);
  };


  return (
    <div className="p-8 min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Pharmacy Inventory</h1>
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" variant="outline">Back to Dashboard</Button>
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
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" onClick={handleSearch}>
          Search
        </Button>
      </div>
      
      {/* Inventory Sections */}
      <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Product</h3>
        <ProductForm />
      </section>

      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Inventory List</h3>
        <ProductsList products={filteredProducts} />
      </section>
    </div>
  );
};

export default Inventory;
