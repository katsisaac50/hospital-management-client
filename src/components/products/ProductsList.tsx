import { useContext } from 'react';
import { ProductsContext } from '../../context/ProductsContext';
import { useTheme } from '../../context/ThemeContext'; // Import theme context

// Define the expected structure of a product
interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  batchNumber?: string; // Optional in case some products don't have it
}

// Define the type for props
interface ProductsListProps {
  products?: Product[]; // Optional because we fall back to context products
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  const { products: contextProducts } = useContext(ProductsContext);
  const { theme } = useTheme(); // Get the current theme

  // Use provided products or fallback to context products
  const productItems = products && products.length > 0 ? products : contextProducts;

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
          <td className="p-3">{product.quantity}</td>
          <td className="p-3">{product.price}</td>
          <td className="p-3">{product.batchNumber || 'N/A'}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default ProductsList;